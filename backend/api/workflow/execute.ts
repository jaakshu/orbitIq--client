import { NextRequest, NextResponse } from "next/server";
import type { WorkflowData, NodeData } from "@/lib/types";

// --- AI API Helpers ---
async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OpenAI API key");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 256,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callReplicate(prompt: string) {
  const apiKey = process.env.REPLICATE_API_KEY;
  if (!apiKey) throw new Error("Missing Replicate API key");
  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: "db21e45a3b6e0e7c8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e", // Stable Diffusion 1.5
      input: { prompt },
    }),
  });
  const data = await res.json();
  // Poll for completion
  let outputUrl = "";
  while (data.status === "starting" || data.status === "processing") {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(
      `https://api.replicate.com/v1/predictions/${data.id}`,
      {
        headers: { Authorization: `Token ${apiKey}` },
      },
    );
    const pollData = await poll.json();
    if (pollData.status === "succeeded") {
      outputUrl = pollData.output?.[0] || "";
      break;
    }
    if (pollData.status === "failed")
      throw new Error("Image generation failed");
  }
  return outputUrl;
}

async function callOCRSpace(imageBase64: string) {
  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) return "OCR result (placeholder, no API key set)";
  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `base64Image=${encodeURIComponent(imageBase64)}`,
  });
  const data = await res.json();
  if (data?.ParsedResults?.[0]?.ParsedText) {
    return data.ParsedResults[0].ParsedText;
  }
  return "OCR failed or no text found.";
}

// --- Workflow Execution Logic ---
function topologicalSort(
  nodes: WorkflowData["nodes"],
  edges: WorkflowData["edges"],
) {
  const inDegree: Record<string, number> = {};
  const graph: Record<string, string[]> = {};
  nodes.forEach((node) => {
    inDegree[node.id] = 0;
    graph[node.id] = [];
  });
  edges.forEach((edge) => {
    graph[edge.source].push(edge.target);
    inDegree[edge.target]++;
  });
  const queue = Object.keys(inDegree).filter((id) => inDegree[id] === 0);
  const sorted: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const neighbor of graph[id]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return sorted.map((id) => nodes.find((n) => n.id === id)!);
}

async function executeNode(
  node: { id: string; type: string; data: NodeData },
  input: any,
) {
  switch (node.data.type) {
    case "text-generation":
      return { output: await callOpenAI(node.data.prompt || "") };
    case "image-generation":
      return {
        output: await callReplicate(node.data.prompt || ""),
        outputType: "image",
      };
    case "file-to-text":
      if (node.data.file?.type === "text/plain") {
        // If file is text, return its content
        return { output: node.data.file.data };
      }
      return {
        output: `File-to-text not supported for type: ${node.data.file?.type}`,
      };
    case "image-to-text":
      if (node.data.file?.data) {
        return { output: await callOCRSpace(node.data.file.data) };
      }
      return { output: "No image provided" };
    case "output":
      return { output: input?.output || "" };
    default:
      return { output: "" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workflow: WorkflowData = body;
    const sortedNodes = topologicalSort(workflow.nodes, workflow.edges);
    const results: Record<string, any> = {};
    for (const node of sortedNodes) {
      const incomingEdge = workflow.edges.find((e) => e.target === node.id);
      const input = incomingEdge ? results[incomingEdge.source] : undefined;
      results[node.id] = await executeNode(node, input);
    }
    const outputNode = sortedNodes.find((n) => n.data.type === "output");
    const output = outputNode ? results[outputNode.id] : null;
    return NextResponse.json({ success: true, output, results });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 },
    );
  }
}
