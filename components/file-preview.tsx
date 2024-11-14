"use client";

import Image from "next/image";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  file: {
    name: string;
    type: string;
    data: string | ArrayBuffer;
  };
  onRemove?: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  
  return (
    <div className="relative mt-2 p-2 bg-muted rounded-md group">
      <div className="flex items-start gap-2">
        {isImage ? (
          <div className="relative h-20 w-20 rounded-md overflow-hidden">
            <Image
              src={file.data as string}
              alt={file.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <FileText className="h-20 w-20 p-4 text-muted-foreground" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {isImage ? 'Image' : 'Document'}
          </p>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}