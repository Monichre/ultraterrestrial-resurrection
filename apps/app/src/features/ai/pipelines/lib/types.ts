export interface ExamplePrompt {
  title: string;
  description: string;
  inputs: Record<string, string>;
}

export interface AgentType {
  id: string;
  name: string;
  description: string;
  inputFields: Array<{
    name: string;
    type: 'input' | 'textarea';
    placeholder?: string;
    label?: string;
  }>;
}