"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Connection,
  addEdge,
  useEdgesState,
  useNodesState,
  ConnectionMode,
  Panel,
  MarkerType,
  Edge,
  Node,
  BackgroundVariant,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Plus,
  Save,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  ImageDown,
  Terminal,
  Upload,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TextGenerationNode } from "@/components/node-types/text-generation-node";
import { ImageGenerationNode } from "@/components/node-types/image-generation-node";
import { FileToTextNode } from "@/components/node-types/file-to-text-node";
import { ImageToTextNode } from "@/components/node-types/image-to-text-node";
import { OutputNode } from "@/components/node-types/output-node";
import type { NodeTypes } from "reactflow";
import type { WorkflowData } from "@/lib/types";
import { WorkflowMetadata } from "@/components/workflow-metadata";
import AIButton from "./framer-ai-button/AIButton";

const initialNodes = [
  {
    id: "output",
    type: "outputNode",
    position: { x: 250, y: 300 },
    data: {
      label: "Output",
      type: "output",
      description: "Final workflow result",
      outputType: "text",
      output: "",
    },
  },
];

const defaultEdgeOptions = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "currentColor",
  },
  style: {
    strokeWidth: 2,
  },
};

const STORAGE_KEY = "workflow-builder-state";
const proOptions = { hideAttribution: true };

const initialMetadata = {
  name: "Untitled Workflow",
  description: "Custom AI workflow configuration",
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
};

// Move nodeTypes OUTSIDE the component
const nodeTypes: NodeTypes = {
  textGenerationNode: TextGenerationNode,
  imageGenerationNode: ImageGenerationNode,
  fileToTextNode: FileToTextNode,
  imageToTextNode: ImageToTextNode,
  outputNode: OutputNode,
};

export default function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);
  const isInitialLoad = useRef(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWorkflowList, setShowWorkflowList] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const {
          nodes: savedNodes,
          edges: savedEdges,
          metadata: savedMetadata,
        } = JSON.parse(savedState);
        setNodes(savedNodes);
        setEdges(savedEdges);
        if (savedMetadata) {
          setMetadata(savedMetadata);
        }
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ nodes, edges, metadata }),
      );
    } catch (error) {
      console.error("Error saving state:", error);
    }
  }, [nodes, edges, metadata]);

  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, ...newData },
            };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const handleMetadataUpdate = useCallback(
    (newMetadata: WorkflowData["metadata"]) => {
      setMetadata(newMetadata);
    },
    [],
  );

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) return false;
      if (connection.source === connection.target) return false;

      // Check if target is output node and already has a connection
      if (targetNode.type === "outputNode") {
        const existingConnection = edges.find(
          (edge) => edge.target === targetNode.id,
        );
        if (existingConnection) return false;
      }

      const validConnections: { [key: string]: string[] } = {
        textGenerationNode: [
          "textGenerationNode",
          "imageGenerationNode",
          "outputNode",
        ],
        imageGenerationNode: [
          "imageToTextNode",
          "imageGenerationNode",
          "outputNode",
        ],
        fileToTextNode: [
          "textGenerationNode",
          "imageGenerationNode",
          "outputNode",
        ],
        imageToTextNode: [
          "textGenerationNode",
          "imageGenerationNode",
          "outputNode",
        ],
      };

      return (
        validConnections[sourceNode.type || 0]?.includes(
          targetNode.type as string,
        ) || false
      );
    },
    [nodes, edges],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (isValidConnection(params)) {
        setEdges((eds) => {
          const isDuplicate = eds.some(
            (edge) =>
              edge.source === params.source && edge.target === params.target,
          );
          if (!isDuplicate && params.source && params.target) {
            return addEdge(
              {
                ...params,
                type: "default",
                id: `e${params.source}-${params.target}`,
                className: "animate-pulse",
              },
              eds,
            );
          }
          return eds;
        });
      }
    },
    [setEdges, isValidConnection],
  );

  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges],
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.type === "outputNode") return;

      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== node.id && e.target !== node.id),
      );
    },
    [setNodes, setEdges],
  );

  const addNode = useCallback(
    (
      type:
        | "textGenerationNode"
        | "imageGenerationNode"
        | "fileToTextNode"
        | "imageToTextNode",
    ) => {
      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position: {
          x: Math.random() * 500,
          y: Math.random() * 300,
        },
        data: {
          label: `${
            type === "textGenerationNode"
              ? "Text Generation"
              : type === "imageGenerationNode"
                ? "Image Generation"
                : type === "fileToTextNode"
                  ? "File to Text"
                  : "Image to Text"
          } ${nodes.length}`,
          type: type.replace("Node", "") as any,
          description: `Configure this ${
            type === "textGenerationNode"
              ? "text generation"
              : type === "imageGenerationNode"
                ? "image generation"
                : type === "fileToTextNode"
                  ? "file to text"
                  : "image to text"
          } node`,
          prompt: "",
          outputType: type === "imageGenerationNode" ? "image" : "text",
          inputType: type.startsWith("file")
            ? "file"
            : type.startsWith("image")
              ? "image"
              : "text",
        },
      };
      //@ts-ignore
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes.length, setNodes],
  );

  const exportWorkflow = useCallback(() => {
    const workflowData = {
      nodes,
      edges,
      metadata,
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${metadata.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [nodes, edges, metadata]);

  const importWorkflow = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const workflowData = JSON.parse(content);
            setNodes(workflowData.nodes);
            setEdges(workflowData.edges);
            if (workflowData.metadata) {
              setMetadata(workflowData.metadata);
            }
          } catch (error) {
            console.error("Error importing workflow:", error);
          }
        };
        reader.readAsText(file);
      }
    },
    [setNodes, setEdges, setMetadata],
  );

  const executeWorkflow = useCallback(async () => {
    setExecuting(true);
    setExecutionResult(null);
    try {
      const workflowData = { nodes, edges, metadata };
      const res = await fetch("/api/workflow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      setExecutionResult({ success: false, error: (err as Error).message });
    } finally {
      setExecuting(false);
    }
  }, [nodes, edges, metadata]);

  const saveWorkflow = async () => {
    setSaveStatus(null);
    try {
      const res = await fetch("/api/workflow/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: metadata.name || "Untitled Workflow",
          data: { nodes, edges, metadata },
        }),
      });
      const data = await res.json();
      if (data.success) setSaveStatus("Saved!");
      else setSaveStatus(data.error || "Save failed");
    } catch (err) {
      setSaveStatus("Save failed");
    }
  };

  const loadWorkflows = async () => {
    setLoading(true);
    setShowWorkflowList(true);
    try {
      const res = await fetch("/api/workflow/load");
      const data = await res.json();
      if (data.success) setWorkflows(data.workflows);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-[radial-gradient(circle_at_center,_var(--background)_0%,_var(--muted)_100%)]"
        snapToGrid
        snapGrid={[20, 20]}
        proOptions={proOptions}
      >
        <Background color="currentColor" className="opacity-[0.02]" />
        <Controls className="bg-background border shadow-md" />
        <Panel position="top-left" className="flex gap-2">
          <WorkflowMetadata
            metadata={metadata}
            onUpdate={handleMetadataUpdate}
          />
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <AIButton onClick={executeWorkflow} disabled={executing} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="shadow-md text-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Node
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addNode("textGenerationNode")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Text Generation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("imageGenerationNode")}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Image Generation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("fileToTextNode")}>
                <FileText className="mr-2 h-4 w-4" />
                File to Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode("imageToTextNode")}>
                <ImageDown className="mr-2 h-4 w-4" />
                Image to Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={exportWorkflow}
            size="sm"
            variant="secondary"
            className="shadow-md"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={saveWorkflow}
            size="sm"
            variant="secondary"
            className="shadow-md"
          >
            Save Workflow
          </Button>
          {saveStatus && <span className="ml-2 text-xs">{saveStatus}</span>}
          <Button
            onClick={loadWorkflows}
            size="sm"
            variant="secondary"
            className="shadow-md"
          >
            Load Workflows
          </Button>
          <Button size="sm" variant="secondary" className="shadow-md" asChild>
            <label>
              <Upload className="mr-2 h-4 w-4" />
              Import
              <input
                type="file"
                className="hidden"
                accept=".json"
                onChange={importWorkflow}
              />
            </label>
          </Button>
        </Panel>
      </ReactFlow>
      {executionResult && (
        <div className="fixed bottom-4 right-4 bg-background border shadow-lg p-4 rounded-md z-50 max-w-md">
          <h4 className="font-bold mb-2">Workflow Result</h4>
          <pre className="text-xs whitespace-pre-wrap break-all">
            {JSON.stringify(executionResult, null, 2)}
          </pre>
        </div>
      )}
      {showWorkflowList && (
        <div className="fixed top-20 right-4 bg-white border shadow-lg p-4 rounded-md z-50 max-w-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold">Your Workflows</h4>
            <button
              onClick={() => setShowWorkflowList(false)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : workflows.length > 0 ? (
            <ul>
              {workflows.map((wf) => (
                <li key={wf.id} className="mb-2">
                  <button
                    className="underline text-blue-600"
                    onClick={() => {
                      setNodes(wf.data.nodes);
                      setEdges(wf.data.edges);
                      setMetadata(wf.data.metadata);
                      setShowWorkflowList(false);
                    }}
                  >
                    {wf.name}
                  </button>
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(wf.updatedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div>No workflows found.</div>
          )}
        </div>
      )}
    </div>
  );
}
