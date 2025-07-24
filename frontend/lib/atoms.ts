import { Edge, Node } from "reactflow";
import { atom } from "recoil";
import type { WorkflowData } from "./types";

export const workflowState = atom<WorkflowData>({
  key: "workflowState",
  default: {
    nodes: [],
    edges: [],
    metadata: {
      name: "",
      description: "",
      created: "",
      updated: "",
    },
  },
});
