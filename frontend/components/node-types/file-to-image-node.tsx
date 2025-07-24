"use client";

import { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileImage, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const FileToImageNode = memo(
  ({ data, id }: { data: any; id: string }) => {
    const handleFileUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          // Handle file upload logic here
          console.log("File uploaded:", file);
        }
      },
      [],
    );

    return (
      <Card className="w-[280px] bg-card">
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-primary"
          isValidConnection={(connection) => connection.source !== id}
        />
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              <h3 className="text-lg font-semibold">{data.label}</h3>
            </div>
            <Badge variant="secondary">File → Image</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground mb-2">
            {data.description}
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </label>
            </Button>
            {data.image && (
              <div className="relative h-32 w-full rounded-md overflow-hidden">
                <Image
                  src={data.image}
                  alt={data.label}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {data.prompt && (
              <div className="bg-muted p-2 rounded-md mt-2">
                <p className="text-xs font-mono">{data.prompt}</p>
              </div>
            )}
          </div>
        </CardContent>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-primary"
          isValidConnection={(connection) => {
            const targetNode = document.querySelector(
              `[data-id="${connection.target}"]`,
            );
            const targetType = targetNode?.getAttribute("data-type");
            return targetType === "imageNode";
          }}
        />
      </Card>
    );
  },
);

FileToImageNode.displayName = "FileToImageNode";
