export type ToolCategory =
  | 'code-text'
  | 'api-network'
  | 'data-conversion'
  | 'code-generation'
  | 'design-frontend'
  | 'datetime';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
}

export interface ToolCategoryMeta {
  id: ToolCategory;
  label: string;
  description: string;
  icon: string;
}
