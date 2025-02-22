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
      console.log('=== NOTION CLIENT ===');
      console.log('0. Client auth:', this.client.auth ? 'Set' : 'Not set');
      console.log('1. Database ID:', this.databaseId);
      console.log('2. Visibility param:', visibility);
      
      const filter = visibility ? {
        property: 'Visibility',
        multi_select: {
          contains: visibility
        }
      } : undefined;

      console.log('3. Using filter:', JSON.stringify(filter, null, 2));

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

      console.log('4. Found quotes:', response.results.length);
      console.log('4a. First result raw:', JSON.stringify(response.results[0], null, 2));
      console.log('Raw response:', JSON.stringify(response.results[0]?.properties, null, 2));
      console.log('Available property names:', Object.keys(response.results[0]?.properties || {}));
      console.log('5. Visibility property for first quote:', JSON.stringify(response.results[0]?.properties?.Visibility, null, 2));
      console.log('6. All quotes visibility:', response.results.map(page => ({
        text: page.properties?.Quote?.title[0]?.plain_text?.slice(0, 30),
        visibility: page.properties?.Visibility?.multi_select?.map((item: any) => item.name)
      })));
      console.log('5. First 3 quotes:');
      response.results.slice(0, 3).forEach((page: any, i) => {
        const visibility = page.properties?.Visibility?.multi_select?.map((item: any) => item.name) || [];
        console.log(`   Quote ${i + 1}: ${page.properties?.Quote?.title[0]?.plain_text?.slice(0, 30)}... | Visibility: ${visibility.join(', ')}`);
      });
      console.log('=== END NOTION CLIENT ===');

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
        visibility: page.properties?.Visibility?.multi_select?.map((item: any) => item.name) || [],
      }));
    } catch (error) {
      console.error('Error fetching quotes from Notion:', error);
      throw error;
    }
  }
}
