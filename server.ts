import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getAllDestinations,
  getDestinationById,
  createCustomDestination,
  getFavorites,
  getFavoriteDestinations,
  toggleFavorite,
  getItineraries,
  createItinerary,
  addItineraryItem,
  deleteItinerary,
  deleteItineraryItem,
  addDestinationReview,
  getDb
} from './src/db/sqlite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite DB at startup
await getDb();

// API Route: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Route: Get Destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const category = req.query.category as string;
    const query = req.query.q as string;
    const sort = req.query.sort as string;
    const destinations = await getAllDestinations(category, query, sort);
    res.json(destinations);
  } catch (err: any) {
    console.error('Error fetching destinations:', err);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// API Route: Get Single Destination
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await getDestinationById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(destination);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// API Route: Add Custom Destination
app.post('/api/destinations', async (req, res) => {
  try {
    const newDest = await createCustomDestination(req.body);
    res.status(201).json(newDest);
  } catch (err: any) {
    console.error('Error creating destination:', err);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

// API Route: Add Destination Review
app.post('/api/destinations/:id/reviews', async (req, res) => {
  try {
    const { author, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    const newReview = await addDestinationReview(req.params.id, { author, rating, comment });
    res.status(201).json(newReview);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// API Route: Favorites
app.get('/api/favorites', async (req, res) => {
  try {
    const favs = await getFavorites();
    res.json(favs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

app.get('/api/favorites/destinations', async (req, res) => {
  try {
    const favDestinations = await getFavoriteDestinations();
    res.json(favDestinations);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch favorite destinations' });
  }
});

app.post('/api/favorites/toggle', async (req, res) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      return res.status(400).json({ error: 'destinationId is required' });
    }
    const result = await toggleFavorite(destinationId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// API Route: Itineraries
app.get('/api/itineraries', async (req, res) => {
  try {
    const itineraries = await getItineraries();
    res.json(itineraries);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
});

app.post('/api/itineraries', async (req, res) => {
  try {
    const { title, startDate, endDate, description } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: 'title, startDate, and endDate are required' });
    }
    const itinerary = await createItinerary(title, startDate, endDate, description);
    res.status(201).json(itinerary);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
});

app.post('/api/itineraries/:id/items', async (req, res) => {
  try {
    const item = await addItineraryItem(req.params.id, req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add item to itinerary' });
  }
});

app.delete('/api/itineraries/:id', async (req, res) => {
  try {
    await deleteItinerary(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete itinerary' });
  }
});

app.delete('/api/itineraries/items/:itemId', async (req, res) => {
  try {
    await deleteItineraryItem(req.params.itemId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete itinerary item' });
  }
});

// API Route: Weather Proxy with fallback
app.get('/api/weather', async (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 27.7172;
  const lon = parseFloat(req.query.lon as string) || 85.3240;
  const city = (req.query.city as string) || 'Kathmandu';

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const tempC = Math.round(data.main.temp);
        const condition = data.weather[0]?.main || 'Clear';
        const iconCode = data.weather[0]?.icon || '01d';

        return res.json({
          city: data.name || city,
          tempC,
          tempF: Math.round((tempC * 9/5) + 32),
          condition,
          icon: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
          humidity: data.main.humidity,
          windKmH: Math.round(data.wind.speed * 3.6),
          uvIndex: 6,
          feelsLikeC: Math.round(data.main.feels_like),
          forecast: [
            { day: 'Tomorrow', tempC: tempC + 1, condition, icon: `https://openweathermap.org/img/wn/${iconCode}@2x.png` },
            { day: 'Day 2', tempC: tempC - 1, condition: 'Partly Cloudy', icon: 'https://openweathermap.org/img/wn/02d@2x.png' },
            { day: 'Day 3', tempC: tempC + 2, condition: 'Sunny', icon: 'https://openweathermap.org/img/wn/01d@2x.png' }
          ]
        });
      }
    } catch (err) {
      console.warn('OpenWeather API fetch failed, falling back to simulated live weather:', err);
    }
  }

  // Dynamic Weather Generator fallback based on lat/lon & location name
  const absLat = Math.abs(lat);
  let baseTemp = 24; // Default pleasant valley
  const cityLower = city.toLowerCase();

  if (cityLower.includes('everest') || cityLower.includes('solukhumbu') || cityLower.includes('kala patthar')) {
    baseTemp = -2; // Cold Himalayan high altitude
  } else if (cityLower.includes('annapurna') || cityLower.includes('mustang') || cityLower.includes('muktinath') || cityLower.includes('langtang')) {
    baseTemp = 12; // Alpine trek temperature
  } else if (cityLower.includes('rara')) {
    baseTemp = 14;
  } else if (cityLower.includes('pokhara') || cityLower.includes('nagarkot') || cityLower.includes('bandipur')) {
    baseTemp = 23; // Hilly valley
  } else if (cityLower.includes('kathmandu') || cityLower.includes('bhaktapur') || cityLower.includes('patan')) {
    baseTemp = 24; // Warm valley
  } else if (cityLower.includes('chitwan') || cityLower.includes('lumbini') || cityLower.includes('janakpur')) {
    baseTemp = 30; // Subtropical Terai region
  }

  const conditions = baseTemp < 5 ? ['Sub-Zero Snow', 'Clear Mountain Sky', 'Frosty Breeze'] : ['Sunny', 'Clear Sky', 'Partly Cloudy', 'Pleasant Breeze'];
  const selectedCondition = conditions[Math.abs(Math.floor(lat * 100)) % conditions.length];

  res.json({
    city,
    tempC: baseTemp,
    tempF: Math.round((baseTemp * 9/5) + 32),
    condition: selectedCondition,
    icon: 'https://openweathermap.org/img/wn/01d@2x.png',
    humidity: 55 + (Math.abs(Math.floor(lon * 10)) % 25),
    windKmH: 12 + (Math.abs(Math.floor(lat * 5)) % 15),
    uvIndex: Math.min(9, Math.max(3, Math.round(10 - absLat / 10))),
    feelsLikeC: baseTemp + 1,
    forecast: [
      { day: 'Tomorrow', tempC: baseTemp + 1, condition: 'Sunny', icon: 'https://openweathermap.org/img/wn/01d@2x.png' },
      { day: 'In 2 Days', tempC: baseTemp, condition: 'Partly Cloudy', icon: 'https://openweathermap.org/img/wn/02d@2x.png' },
      { day: 'In 3 Days', tempC: baseTemp + 2, condition: 'Clear Sky', icon: 'https://openweathermap.org/img/wn/01d@2x.png' }
    ]
  });
});

// Vite Middleware in Dev, Static serving in Prod
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else if (!process.env.VERCEL) {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wanderlust Server active on http://0.0.0.0:${PORT}`);
  });
}

export default app;
