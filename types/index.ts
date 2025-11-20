export interface Option {
  label: string;
  nextNodeId: string;
}

export interface Node {
  id: string;
  text: string;
  details?: string;
  type: 'question' | 'result';
  options?: Option[];
  status?: 'capacity' | 'incapacity';
}

export interface FlowchartData {
  startNodeId: string;
  nodes: Record<string, Node>;
}

