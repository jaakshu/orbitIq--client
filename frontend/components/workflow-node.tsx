"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const WorkflowNode = memo(({ data }: any) => {
  return (
    <Card className="w-[280px] bg-card">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{data.label}</h3>
          <Badge variant="secondary">{data.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
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
      </CardContent>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary"
      />
    </Card>
  );
});

WorkflowNode.displayName = "WorkflowNode";
