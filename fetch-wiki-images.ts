import fs from 'fs';

const pages = [
  "Kathmandu Durbar Square", "Swayambhunath", "Boudhanath Stupa", "Pashupatinath Temple",
  "Phewa Lake", "Sarangkot", "World Peace Pagoda Pokhara", "Devi's Falls Nepal",
  "Everest Base Camp", "Namche Bazaar", "Tengboche Monastery",
  "Chitwan National Park", "Rapti River Nepal",
  "Poon Hill", "Ghandruk", "Annapurna Circuit",
  "Lumbini", "Maya Devi Temple Lumbini",
  "Bhaktapur Durbar Square", "Nyatapola Temple",
  "Nagarkot", "Changu Narayan Temple",
  "Patan Durbar Square", "Krishna Mandir Patan", "Hiranya Varna Mahavihar",
  "Langtang Valley", "Kyanjin Gompa",
  "Upper Mustang", "Muktinath",
  "Rara Lake",
  "Bandipur Nepal", "Siddha Gufa",
  "Janakpur", "Janaki Mandir"
];

async function getImageUrl(query: string) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=1200&format=json`;
  try {
    const res = await fetch(searchUrl);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const map: Record<string, string> = {};
  for (const page of pages) {
    const img = await getImageUrl(page);
    map[page] = img || 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Taj_Mahal_in_March_2004.jpg/1280px-Taj_Mahal_in_March_2004.jpg'; // fallback
    console.log(`${page}: ${map[page]}`);
  }
  
  // Now modify the destinations.ts
  const destPath = './src/data/destinations.ts';
  let content = fs.readFileSync(destPath, 'utf-8');

  // Regex replacement approach might be fragile.
  // Instead, let's use a mapping for the known random images to the new ones, or replace images by name.
  
  // It's better to just replace the Unsplash URLs directly with these fetched ones.
  // I'll print the map so the AI can use replace_file_content or I can write a script.
  fs.writeFileSync('image_map.json', JSON.stringify(map, null, 2));
}

run();
