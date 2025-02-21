export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: {
    url: string;
    title?: string;
  };
  tags?: string[];
}

export interface NotionConfig {
  token: string;
  databaseId: string;
}
