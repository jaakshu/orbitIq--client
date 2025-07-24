"use client";

import { memo, useCallback } from "react";
import { FileText, Upload } from "lucide-react";
import { BaseNode } from "./base-node";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "reactflow";
import { FilePreview } from "@/components/file-preview";

export const FileToTextNode = memo(
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

    const handleFileUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            updateNodeData({
              file: {
                name: file.name,
                type: file.type,
                data: e.target?.result,
              },
            });
          };
          reader.readAsDataURL(file);
        }
      },
      [updateNodeData],
    );

    const handleRemoveFile = useCallback(() => {
      updateNodeData({ file: null });
    }, [updateNodeData]);

    return (
      <BaseNode
        data={data}
        icon={FileText}
        label="File to Text"
        badgeText="File → Text"
        updateNodeData={updateNodeData}
      >
        <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
        <div className="flex flex-col gap-2">
          {data.file ? (
            <FilePreview file={data.file} onRemove={handleRemoveFile} />
          ) : (
            <Button variant="outline" className="w-full" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.doc,.docx"
                />
              </label>
            </Button>
          )}
        </div>
      </BaseNode>
    );
  },
);

FileToTextNode.displayName = "FileToTextNode";
