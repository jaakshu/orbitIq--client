"use client";

import { memo } from "react";
import { ImageIcon } from "lucide-react";
import { BaseNode } from "./base-node";
import { useReactFlow } from "reactflow";
import Image from "next/image";

export const ImageGenerationNode = memo(
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
        icon={ImageIcon}
        label="Image Generation"
        badgeText="Image"
        updateNodeData={updateNodeData}
      >
        {data.image && (
          <div className="relative h-32 w-full mb-3 rounded-md overflow-hidden">
            <Image
              src={data.image}
              alt={data.label}
              fill
              className="object-cover"
            />
          </div>
        )}
        <p className="text-sm text-muted-foreground">{data.description}</p>
      </BaseNode>
    );
  },
);

ImageGenerationNode.displayName = "ImageGenerationNode";
