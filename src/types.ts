export interface Quote {
  id: string;
  notionUrl?: string;
  text: string;
  author: string;
  source?: {
    url: string;
    title?: string;
  };
  tags?: string[];
}
