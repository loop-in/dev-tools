export type ToolCategory =
  | 'format-validate'
  | 'encode-decode'
  | 'design-ui'
  | 'api-network'
  | 'datetime'
  | 'data-math'
  | 'generators';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  isPopular?: boolean;
}

export interface ToolCategoryMeta {
  id: ToolCategory;
  label: string;
  description: string;
  icon: string;
}
