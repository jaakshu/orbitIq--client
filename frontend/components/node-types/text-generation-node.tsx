"use client";

import { memo } from "react";
import { MessageSquare } from "lucide-react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "reactflow";

export const TextGenerationNode = memo(
  ({ data, id }: { data: any; id: string }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = (newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, ...newData },
            };
          }
          return node;
        }),
      );
    };

    return (
      <BaseNode
        data={data}
        icon={MessageSquare}
        label="Text Generation"
        badgeText="Text"
        updateNodeData={updateNodeData}
      >
        <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
      </BaseNode>
    );
  },
);

TextGenerationNode.displayName = "TextGenerationNode";
