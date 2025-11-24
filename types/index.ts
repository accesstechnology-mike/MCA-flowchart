export interface Option {
  label: string;
  nextNodeId: string;
  statement?: string;
}

export interface Node {
  id: string;
  text: string;
  details?: string;
  info?: string;
  type: 'question' | 'result';
  options?: Option[];
  status?: 'capacity' | 'incapacity';
  emailTemplate?: string;
}

export interface FlowchartData {
  startNodeId: string;
  nodes: Record<string, Node>;
}
