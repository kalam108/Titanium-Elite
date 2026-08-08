import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { Destination, Favorite, Itinerary, ItineraryItem, Review } from '../types';
import { INITIAL_DESTINATIONS } from '../data/destinations';

const DB_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'wanderlust.sqlite')
  : path.join(process.cwd(), 'wanderlust.sqlite');

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const filebuffer = fs.readFileSync(DB_FILE_PATH);
      db = new SQL.Database(filebuffer);
    } catch (err) {
      console.error('Failed to read existing SQLite database file, recreating:', err);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Initialize tables
  db.run(`
    CREATE TABLE IF NOT EXISTS destinations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      country TEXT NOT NULL,
      category TEXT NOT NULL,
      rating REAL NOT NULL,
      reviewCount INTEGER NOT NULL,
      priceLevel TEXT NOT NULL,
      entryFee TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      gallery TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT NOT NULL,
      bestSeason TEXT NOT NULL,
      recommendedDays INTEGER NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      tags TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      attractions TEXT NOT NULL,
      reviews TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      destinationId TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS itineraries (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS itinerary_items (
      id TEXT PRIMARY KEY,
      itineraryId TEXT NOT NULL,
      destinationId TEXT NOT NULL,
      destinationTitle TEXT NOT NULL,
      destinationLocation TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      date TEXT NOT NULL,
      timeSlot TEXT,
      notes TEXT,
      estimatedCostUSD REAL DEFAULT 0,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (itineraryId) REFERENCES itineraries(id) ON DELETE CASCADE
    );
  `);

  // Sync updated Nepal destinations dataset into SQLite
  const stmtUpdate = db.prepare(`
    UPDATE destinations SET
      title = ?, location = ?, category = ?, rating = ?, priceLevel = ?,
      entryFee = ?, imageUrl = ?, gallery = ?, description = ?, highlights = ?,
      bestSeason = ?, recommendedDays = ?, lat = ?, lng = ?, tags = ?,
      featured = ?, attractions = ?, reviews = ?
    WHERE id = ?
  `);

  for (const d of INITIAL_DESTINATIONS) {
    stmtUpdate.run([
      d.title,
      d.location,
      d.category,
      d.rating,
      d.priceLevel,
      d.entryFee,
      d.imageUrl,
      JSON.stringify(d.gallery),
      d.description,
      JSON.stringify(d.highlights),
      d.bestSeason,
      d.recommendedDays,
      d.lat,
      d.lng,
      JSON.stringify(d.tags),
      d.featured ? 1 : 0,
      JSON.stringify(d.attractions),
      JSON.stringify(d.reviews),
      d.id
    ]);
  }
  stmtUpdate.free();

  // Insert missing destinations if any
  const nepalCountRes = db.exec("SELECT COUNT(*) as count FROM destinations WHERE country = 'Nepal'");
  const nepalCount = nepalCountRes[0]?.values[0]?.[0] as number || 0;

  if (nepalCount < INITIAL_DESTINATIONS.length) {
    console.log('Seeding updated Nepal destinations dataset into SQLite...');
    db.run("DELETE FROM destinations");
    const stmt = db.prepare(`
      INSERT INTO destinations (
        id, title, location, country, category, rating, reviewCount, priceLevel,
        entryFee, imageUrl, gallery, description, highlights, bestSeason,
        recommendedDays, lat, lng, tags, featured, attractions, reviews
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of INITIAL_DESTINATIONS) {
      stmt.run([
        d.id,
        d.title,
        d.location,
        d.country,
        d.category,
        d.rating,
        d.reviewCount,
        d.priceLevel,
        d.entryFee,
        d.imageUrl,
        JSON.stringify(d.gallery),
        d.description,
        JSON.stringify(d.highlights),
        d.bestSeason,
        d.recommendedDays,
        d.lat,
        d.lng,
        JSON.stringify(d.tags),
        d.featured ? 1 : 0,
        JSON.stringify(d.attractions),
        JSON.stringify(d.reviews)
      ]);
    }
    stmt.free();
  }
  saveDb();

  return db;
}

function saveDb() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite database to file:', err);
  }
}

// Convert DB Row to Destination model
function parseDestinationRow(row: any[]): Destination {
  return {
    id: row[0] as string,
    title: row[1] as string,
    location: row[2] as string,
    country: row[3] as string,
    category: row[4] as any,
    rating: Number(row[5]),
    reviewCount: Number(row[6]),
    priceLevel: row[7] as any,
    entryFee: row[8] as string,
    imageUrl: row[9] as string,
    gallery: JSON.parse(row[10] || '[]'),
    description: row[11] as string,
    highlights: JSON.parse(row[12] || '[]'),
    bestSeason: row[13] as string,
    recommendedDays: Number(row[14]),
    lat: Number(row[15]),
    lng: Number(row[16]),
    tags: JSON.parse(row[17] || '[]'),
    featured: Boolean(row[18]),
    attractions: JSON.parse(row[19] || '[]'),
    reviews: JSON.parse(row[20] || '[]')
  };
}

export async function getAllDestinations(category?: string, query?: string, sortBy?: string): Promise<Destination[]> {
  const database = await getDb();
  let sql = "SELECT * FROM destinations WHERE 1=1";
  const params: any[] = [];

  if (category && category !== 'All') {
    sql += " AND category = ?";
    params.push(category);
  }

  if (query && query.trim() !== '') {
    const q = `%${query.trim().toLowerCase()}%`;
    sql += " AND (LOWER(title) LIKE ? OR LOWER(location) LIKE ? OR LOWER(country) LIKE ? OR LOWER(tags) LIKE ?)";
    params.push(q, q, q, q);
  }

  if (sortBy === 'rating') {
    sql += " ORDER BY rating DESC";
  } else if (sortBy === 'popular') {
    sql += " ORDER BY reviewCount DESC";
  } else {
    sql += " ORDER BY featured DESC, rating DESC";
  }

  const stmt = database.prepare(sql);
  stmt.bind(params);

  const results: Destination[] = [];
  while (stmt.step()) {
    results.push(parseDestinationRow(stmt.get()));
  }
  stmt.free();

  return results;
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const database = await getDb();
  const stmt = database.prepare("SELECT * FROM destinations WHERE id = ?");
  stmt.bind([id]);

  if (stmt.step()) {
    const dest = parseDestinationRow(stmt.get());
    stmt.free();
    return dest;
  }
  stmt.free();
  return null;
}

export async function createCustomDestination(data: Partial<Destination>): Promise<Destination> {
  const database = await getDb();
  const id = data.id || `custom-${Date.now()}`;
  const newDest: Destination = {
    id,
    title: data.title || 'Untitled Destination',
    location: data.location || 'Unknown Location',
    country: data.country || 'Global',
    category: (data.category as any) || 'Adventure',
    rating: 5.0,
    reviewCount: 1,
    priceLevel: data.priceLevel || '$$',
    entryFee: data.entryFee || 'Free',
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    gallery: data.gallery || [data.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'],
    description: data.description || 'A custom destination added by travelers.',
    highlights: data.highlights || ['Scenic Views', 'Local Spots'],
    bestSeason: data.bestSeason || 'Year-round',
    recommendedDays: data.recommendedDays || 2,
    lat: Number(data.lat) || 0,
    lng: Number(data.lng) || 0,
    tags: data.tags || ['Custom', 'Community'],
    featured: false,
    attractions: data.attractions || [],
    reviews: []
  };

  const stmt = database.prepare(`
    INSERT INTO destinations (
      id, title, location, country, category, rating, reviewCount, priceLevel,
      entryFee, imageUrl, gallery, description, highlights, bestSeason,
      recommendedDays, lat, lng, tags, featured, attractions, reviews
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    newDest.id,
    newDest.title,
    newDest.location,
    newDest.country,
    newDest.category,
    newDest.rating,
    newDest.reviewCount,
    newDest.priceLevel,
    newDest.entryFee,
    newDest.imageUrl,
    JSON.stringify(newDest.gallery),
    newDest.description,
    JSON.stringify(newDest.highlights),
    newDest.bestSeason,
    newDest.recommendedDays,
    newDest.lat,
    newDest.lng,
    JSON.stringify(newDest.tags),
    newDest.featured ? 1 : 0,
    JSON.stringify(newDest.attractions),
    JSON.stringify(newDest.reviews)
  ]);
  stmt.free();
  saveDb();

  return newDest;
}

// Favorites Functions
export async function getFavorites(): Promise<string[]> {
  const database = await getDb();
  const res = database.exec("SELECT destinationId FROM favorites ORDER BY createdAt DESC");
  if (!res[0]) return [];
  return res[0].values.map(v => v[0] as string);
}

export async function getFavoriteDestinations(): Promise<Destination[]> {
  const database = await getDb();
  const favIds = await getFavorites();
  if (favIds.length === 0) return [];
  const placeholders = favIds.map(() => '?').join(',');
  const stmt = database.prepare(`SELECT * FROM destinations WHERE id IN (${placeholders})`);
  stmt.bind(favIds);

  const results: Destination[] = [];
  while (stmt.step()) {
    results.push(parseDestinationRow(stmt.get()));
  }
  stmt.free();
  return results;
}

export async function toggleFavorite(destinationId: string): Promise<{ isFavorite: boolean }> {
  const database = await getDb();
  const check = database.prepare("SELECT id FROM favorites WHERE destinationId = ?");
  check.bind([destinationId]);
  const exists = check.step();
  check.free();

  if (exists) {
    const del = database.prepare("DELETE FROM favorites WHERE destinationId = ?");
    del.run([destinationId]);
    del.free();
    saveDb();
    return { isFavorite: false };
  } else {
    const ins = database.prepare("INSERT INTO favorites (id, destinationId, createdAt) VALUES (?, ?, ?)");
    ins.run([`fav-${Date.now()}`, destinationId, new Date().toISOString()]);
    ins.free();
    saveDb();
    return { isFavorite: true };
  }
}

// Itinerary Functions
export async function getItineraries(): Promise<Itinerary[]> {
  const database = await getDb();
  const resItin = database.exec("SELECT * FROM itineraries ORDER BY createdAt DESC");
  if (!resItin[0]) return [];

  const itineraries: Itinerary[] = [];

  for (const row of resItin[0].values) {
    const id = row[0] as string;
    const title = row[1] as string;
    const description = row[2] as string;
    const startDate = row[3] as string;
    const endDate = row[4] as string;
    const createdAt = row[5] as string;

    const stmtItems = database.prepare("SELECT * FROM itinerary_items WHERE itineraryId = ? ORDER BY date ASC, orderIndex ASC");
    stmtItems.bind([id]);

    const items: ItineraryItem[] = [];
    while (stmtItems.step()) {
      const iRow = stmtItems.get();
      items.push({
        id: iRow[0] as string,
        destinationId: iRow[2] as string,
        destinationTitle: iRow[3] as string,
        destinationLocation: iRow[4] as string,
        imageUrl: iRow[5] as string,
        lat: Number(iRow[6]),
        lng: Number(iRow[7]),
        date: iRow[8] as string,
        timeSlot: iRow[9] as string || undefined,
        notes: iRow[10] as string || undefined,
        estimatedCostUSD: Number(iRow[11] || 0),
        orderIndex: Number(iRow[12] || 0)
      });
    }
    stmtItems.free();

    itineraries.push({
      id,
      title,
      description,
      startDate,
      endDate,
      createdAt,
      items
    });
  }

  return itineraries;
}

export async function createItinerary(title: string, startDate: string, endDate: string, description?: string): Promise<Itinerary> {
  const database = await getDb();
  const id = `itin-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const stmt = database.prepare(`
    INSERT INTO itineraries (id, title, description, startDate, endDate, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run([id, title, description || '', startDate, endDate, createdAt]);
  stmt.free();
  saveDb();

  return {
    id,
    title,
    description,
    startDate,
    endDate,
    createdAt,
    items: []
  };
}

export async function addItineraryItem(itineraryId: string, itemData: Partial<ItineraryItem>): Promise<ItineraryItem> {
  const database = await getDb();
  const id = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const stmt = database.prepare(`
    INSERT INTO itinerary_items (
      id, itineraryId, destinationId, destinationTitle, destinationLocation, imageUrl,
      lat, lng, date, timeSlot, notes, estimatedCostUSD, orderIndex
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    id,
    itineraryId,
    itemData.destinationId || '',
    itemData.destinationTitle || 'Custom Activity',
    itemData.destinationLocation || '',
    itemData.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    Number(itemData.lat) || 0,
    Number(itemData.lng) || 0,
    itemData.date || new Date().toISOString().split('T')[0],
    itemData.timeSlot || '10:00 AM',
    itemData.notes || '',
    Number(itemData.estimatedCostUSD || 50),
    Number(itemData.orderIndex || 0)
  ]);
  stmt.free();
  saveDb();

  return {
    id,
    destinationId: itemData.destinationId || '',
    destinationTitle: itemData.destinationTitle || 'Custom Activity',
    destinationLocation: itemData.destinationLocation || '',
    imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    lat: Number(itemData.lat) || 0,
    lng: Number(itemData.lng) || 0,
    date: itemData.date || new Date().toISOString().split('T')[0],
    timeSlot: itemData.timeSlot || '10:00 AM',
    notes: itemData.notes || '',
    estimatedCostUSD: Number(itemData.estimatedCostUSD || 50),
    orderIndex: Number(itemData.orderIndex || 0)
  };
}

export async function deleteItinerary(id: string): Promise<boolean> {
  const database = await getDb();
  database.run("DELETE FROM itinerary_items WHERE itineraryId = ?", [id]);
  database.run("DELETE FROM itineraries WHERE id = ?", [id]);
  saveDb();
  return true;
}

export async function deleteItineraryItem(itemId: string): Promise<boolean> {
  const database = await getDb();
  database.run("DELETE FROM itinerary_items WHERE id = ?", [itemId]);
  saveDb();
  return true;
}

export async function addDestinationReview(destinationId: string, review: { author: string; rating: number; comment: string }): Promise<Review> {
  const database = await getDb();
  const dest = await getDestinationById(destinationId);
  if (!dest) throw new Error('Destination not found');

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    author: review.author || 'Traveler',
    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&w=150&q=80`,
    rating: review.rating,
    date: new Date().toISOString().split('T')[0],
    comment: review.comment
  };

  const updatedReviews = [newReview, ...dest.reviews];
  const newReviewCount = dest.reviewCount + 1;
  const newRating = Number(((dest.rating * dest.reviewCount + review.rating) / newReviewCount).toFixed(2));

  const stmt = database.prepare("UPDATE destinations SET reviews = ?, reviewCount = ?, rating = ? WHERE id = ?");
  stmt.run([JSON.stringify(updatedReviews), newReviewCount, newRating, destinationId]);
  stmt.free();
  saveDb();

  return newReview;
}
