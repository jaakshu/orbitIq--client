"use client";

import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface BaseNodeProps {
  data: any;
  icon: LucideIcon;
  label: string;
  badgeText: string;
  children?: React.ReactNode;
  updateNodeData?: (data: any) => void;
  isOutput?: boolean;
  hideBottomHandles?: boolean;
  singleTarget?: boolean;
}

export const BaseNode = ({ 
  data, 
  icon: Icon, 
  label, 
  badgeText, 
  children, 
  updateNodeData,
  isOutput = false,
  hideBottomHandles = false,
  singleTarget = false,
}: BaseNodeProps) => {
  const handleStyle = "!bg-primary w-3 h-3 transition-transform hover:scale-150";
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (updateNodeData) {
      updateNodeData({
        ...data,
        prompt: e.target.value,
      });
    }
  };

  return (
    <Card className="w-[280px] bg-card/95 supports-[backdrop-filter]:bg-card/80 relative group shadow-xl border-2 hover:border-primary/50 transition-all">
      {/* Top handles */}
      {singleTarget ? (
        <Handle type="target" position={Position.Top} className={handleStyle} />
      ) : (
        <>
          <Handle type="target" position={Position.Top} className={`${handleStyle} left-[25%]`} />
          <Handle type="target" position={Position.Top} className={`${handleStyle} left-[75%]`} />
        </>
      )}
      
      {/* Bottom handles */}
      {!hideBottomHandles && (
        <>
          <Handle type="source" position={Position.Bottom} className={`${handleStyle} left-[25%]`} />
          <Handle type="source" position={Position.Bottom} className={`${handleStyle} left-[75%]`} />
        </>
      )}

      {!isOutput && (
        <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="destructive" className="cursor-pointer animate-pulse">
            Double-click to delete
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <h3 className="text-lg font-semibold">{data.label || label}</h3>
          </div>
          <Badge variant="secondary" className="bg-secondary/50">{badgeText}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {children}
        {data.prompt !== undefined && (
          <div className="mt-2">
            <Textarea
              placeholder="Enter your prompt here..."
              value={data.prompt || ""}
              onChange={handlePromptChange}
              className="min-h-[80px] text-xs font-mono resize-none bg-background/50"
            />
          </div>
        )}
        {data.file && (
          <div className="mt-2 p-2 bg-muted rounded-md">
            <p className="text-xs font-mono truncate">
              📎 {data.file.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};