export type NodeData = {
  label: string;
  type: 'text-generation' | 'image-generation' | 'file-to-text' | 'image-to-text' | 'output';
  description: string;
  content?: string;
  image?: string | File;
  aiModel?: string;
  prompt?: string;
  file?: {
    name: string;
    type: string;
    data: string | ArrayBuffer;
  };
  output?: string;
  outputType?: 'text' | 'image';
  inputType?: 'text' | 'image' | 'file';
};

export type WorkflowData = {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: NodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
  }>;
  metadata: {
    name: string;
    description: string;
    created: string;
    updated: string;
  };
};