"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export const TextNode = memo(({ data }: { data: any }) => {
  return (
    <Card className="w-[280px] bg-card">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <h3 className="text-lg font-semibold">{data.label}</h3>
          </div>
          <Badge variant="secondary">Text</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
        {data.prompt && (
          <div className="bg-muted p-2 rounded-md">
            <p className="text-xs font-mono">{data.prompt}</p>
          </div>
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </Card>
  );
});

TextNode.displayName = "TextNode";