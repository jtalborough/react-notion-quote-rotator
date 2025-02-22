import { Client } from '@notionhq/client';
export { Client };

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: {
    url: string;
    title?: string;
  };
  tags?: string[];
  visibility?: string[];
  notionUrl?: string;
}

export class NotionQuoteClient {
  private client: Client;
  private databaseId: string;

  constructor({ token, databaseId }: { token: string; databaseId: string }) {
    this.client = new Client({ auth: token });
    this.databaseId = databaseId;
  }

  async getQuotes(visibility?: string): Promise<Quote[]> {
    try {
      console.log('Querying Notion database:', this.databaseId);
      
      const filter = visibility ? {
        and: [{
          property: 'Visibility',
          multi_select: {
            contains: visibility
          }
        }]
      } : undefined;

      console.log('Using Notion filter:', JSON.stringify(filter, null, 2));

      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter,
        sorts: [
          {
            property: 'Added',
            direction: 'descending',
          },
        ],
      });

      console.log('Found quotes:', response.results.length);
      console.log('First quote visibility:', response.results[0]?.properties?.Visibility?.multi_select);

      return response.results.map((page: any) => ({
        notionUrl: `https://notion.so/${page.id.replace(/-/g, '')}`,
        id: page.id,
        text: page.properties.Quote?.title[0]?.plain_text || '',
        author: page.properties.Author?.rich_text[0]?.plain_text || 'Unknown',
        source: page.properties.Source?.url ? {
          url: page.properties.Source.url,
          title: page.properties.Source.url.split('/').pop() || page.properties.Source.url
        } : undefined,
        tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        visibility: page.properties.Visibility?.multi_select?.map((item: any) => item.name) || [],
      }));
    } catch (error) {
      console.error('Error fetching quotes from Notion:', error);
      throw error;
    }
  }
}
