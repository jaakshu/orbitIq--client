"use client";

import { memo } from "react";
import { Terminal } from "lucide-react";
import { BaseNode } from "./base-node";
import { useReactFlow } from 'reactflow';
import Image from "next/image";
import { cn } from "@/lib/utils";

export const OutputNode = memo(({ data, id }: { data: any; id: string }) => {
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
      })
    );
  };

  return (
    <BaseNode
      data={data}
      icon={Terminal}
      label="Output"
      badgeText="Result"
      updateNodeData={updateNodeData}
      isOutput={true}
      hideBottomHandles={true}
      singleTarget={true}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{data.description}</p>
        
        <div className={cn(
          "mt-2 rounded-md border",
          !data.output && "border-dashed h-32 flex items-center justify-center"
        )}>
          {data.output ? (
            data.outputType === 'image' ? (
              <div className="relative h-32 w-full rounded-md overflow-hidden">
                <Image
                  src={data.output}
                  alt="Generated output"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="p-3 font-mono text-sm whitespace-pre-wrap">
                {data.output}
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Output will appear here
            </p>
          )}
        </div>
      </div>
    </BaseNode>
  );
});

OutputNode.displayName = "OutputNode";