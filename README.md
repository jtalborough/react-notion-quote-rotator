# React Notion Quote Rotator

A React component for displaying and rotating quotes from a Notion database.

## Features

- 🔄 Automatic quote rotation with configurable interval
- 🎲 Optional randomization of quotes
- 🎨 Customizable styling
- 📱 Responsive design
- 🔗 Source linking
- 🏷️ Tag display
- ⚡ TypeScript support

## Installation

```bash
npm install react-notion-quote-rotator
```

## Usage

1. First, set up your Notion database with the following properties:
   - Quote (title)
   - Author (text)
   - Source (url)
   - Tags (multi-select)
   - Added (date)

2. Get your Notion API token and database ID:
   - Create an integration at https://www.notion.so/my-integrations
   - Share your database with the integration
   - Copy the database ID from the URL

3. Import the styles and use the component in your React application:

```tsx
import { QuoteRotator, NotionQuoteClient } from 'react-notion-quote-rotator';
import 'react-notion-quote-rotator/dist/styles.css'; // Optional default styles

// Initialize the client
const notionClient = new NotionQuoteClient({
  token: 'your-notion-token',
  databaseId: 'your-database-id'
});

// In your component
function App() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    async function fetchQuotes() {
      const fetchedQuotes = await notionClient.getQuotes();
      setQuotes(fetchedQuotes);
    }
    fetchQuotes();
  }, []);

  return (
    <QuoteRotator
      quotes={quotes}
      interval={5000} // Optional: time between quotes in ms
      randomize={true} // Optional: randomize quote order
      showSource={true} // Optional: show source links
      showTags={true} // Optional: show tags
      onQuoteChange={(quote) => console.log('New quote:', quote)} // Optional: quote change callback
    />
  );
}
```

## Styling

The component provides the following CSS classes for styling:

- `.quote-rotator`: Container element
- `.quote-content`: Quote content wrapper
- `.quote-text`: Quote text
- `.quote-footer`: Footer containing author and source
- `.quote-author`: Author name
- `.quote-source`: Source link
- `.quote-tags`: Tags container
- `.quote-tag`: Individual tag

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| quotes | Quote[] | required | Array of quotes to display |
| interval | number | 10000 | Time between quote changes (ms) |
| randomize | boolean | true | Whether to randomize quote order |
| className | string | '' | Additional CSS class for container |
| showSource | boolean | true | Whether to show source links |
| showTags | boolean | true | Whether to show tags |
| onQuoteChange | function | undefined | Callback when quote changes |

## License

MIT
