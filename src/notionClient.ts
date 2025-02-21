import { Client } from '@notionhq/client';
import type { Quote, NotionConfig } from './types';

export class NotionQuoteClient {
  private client: Client;
  private databaseId: string;

  constructor(config: NotionConfig) {
    this.client = new Client({ auth: config.token });
    this.databaseId = config.databaseId;
  }

  async getQuotes(): Promise<Quote[]> {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        sorts: [
          {
            property: 'Added',
            direction: 'descending',
          },
        ],
      });

      return response.results.map((page: any) => ({
        id: page.id,
        text: page.properties.Quote?.title[0]?.plain_text || '',
        author: page.properties.Author?.rich_text[0]?.plain_text || 'Unknown',
        source: page.properties.Source?.url ? {
          url: page.properties.Source.url,
          title: page.properties.Source.url.split('/').pop() || page.properties.Source.url
        } : undefined,
        tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      }));
    } catch (error) {
      console.error('Error fetching quotes from Notion:', error);
      throw error;
    }
  }
}
