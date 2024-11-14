"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export const ImageNode = memo(({ data }: { data: any }) => {
  return (
    <Card className="w-[280px] bg-card">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <h3 className="text-lg font-semibold">{data.label}</h3>
          </div>
          <Badge variant="secondary">Image</Badge>
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
        {data.prompt && (
          <div className="bg-muted p-2 rounded-md mt-2">
            <p className="text-xs font-mono">{data.prompt}</p>
          </div>
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </Card>
  );
});

ImageNode.displayName = "ImageNode";