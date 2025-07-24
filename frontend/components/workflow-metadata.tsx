"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { WorkflowData } from "@/lib/types";

interface WorkflowMetadataProps {
  metadata: WorkflowData["metadata"];
  onUpdate: (metadata: WorkflowData["metadata"]) => void;
}

export function WorkflowMetadata({
  metadata,
  onUpdate,
}: WorkflowMetadataProps) {
  const [localMetadata, setLocalMetadata] = useState(metadata);

  const handleUpdate = () => {
    onUpdate({
      ...localMetadata,
      updated: new Date().toISOString(),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          {metadata.name || "Untitled Workflow"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Workflow Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Workflow Name
            </label>
            <Input
              id="name"
              value={localMetadata.name}
              onChange={(e) =>
                setLocalMetadata((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter workflow name..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={localMetadata.description}
              onChange={(e) =>
                setLocalMetadata((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your workflow..."
              className="resize-none"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Created: {new Date(metadata.created).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Last modified: {new Date(metadata.updated).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
