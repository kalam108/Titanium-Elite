import { Destination } from '../types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'kathmandu-valley',
    title: 'Kathmandu Durbar Square & Swayambhunath',
    location: 'Kathmandu Valley',
    country: 'Nepal',
    category: 'Cultural',
    rating: 4.9,
    reviewCount: 4210,
    priceLevel: '$',
    entryFee: 'NPR 1,000 (~$7.50)',
    altitude: '1,324 m (4,344 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kathmandu_Durbar_Square_02.jpg/1200px-Kathmandu_Durbar_Square_02.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kathmandu_Durbar_Square_02.jpg/1200px-Kathmandu_Durbar_Square_02.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Swayambhunath_2018.jpg/1200px-Swayambhunath_2018.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Boudhanath_Stupa-Kathmandu_Nepal.jpg/1200px-Boudhanath_Stupa-Kathmandu_Nepal.jpg'
    ],
    description: 'The vibrant heart of Nepal’s capital. Explore UNESCO royal palaces, intricate Newari woodcarvings, and iconic stupas including Swayambhunath (Monkey Temple) and Boudhanath Stupa surrounded by prayer wheels and incense smoke.',
    highlights: [
      'Climb 365 stone steps to Swayambhunath Stupa with all-seeing Buddha eyes',
      'Circumambulate Boudhanath Stupa—the largest mandala stupa in Nepal',
      'Visit Living Goddess Kumari Ghar at Hanuman Dhoka Durbar Square',
      'Taste authentic Newari Momos & Sel Roti in historic Asan Bazaar'
    ],
    bestSeason: 'Autumn (Sep - Nov) & Spring (Mar - May)',
    recommendedDays: 3,
    lat: 27.7042,
    lng: 85.3093,
    tags: ['UNESCO', 'Culture', 'Temples', 'Stupa', 'Heritage', 'Food'],
    featured: true,
    attractions: [
      {
        id: 'swayambhunath',
        name: 'Swayambhunath Stupa (Monkey Temple)',
        category: 'Stupa & Temple',
        lat: 27.7149,
        lng: 85.2903,
        distanceKm: 2.8,
        description: 'Ancient hilltop religious complex with panoramic views over Kathmandu valley.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kathmandu_Durbar_Square_02.jpg/1200px-Kathmandu_Durbar_Square_02.jpg'
      },
      {
        id: 'boudhanath',
        name: 'Boudhanath Stupa',
        category: 'Buddhist Sacred Site',
        lat: 27.7215,
        lng: 85.3620,
        distanceKm: 5.8,
        description: 'Massive mandala stupa, central gathering hub for Tibetan Buddhist pilgrims.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Swayambhunath_2018.jpg/1200px-Swayambhunath_2018.jpg'
      },
      {
        id: 'pashupatinath',
        name: 'Pashupatinath Sacred Temple',
        category: 'Hindu Temple',
        lat: 27.7104,
        lng: 85.3487,
        distanceKm: 4.2,
        description: 'Sacred Hindu temple dedicated to Lord Shiva on the banks of Bagmati River.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Boudhanath_Stupa-Kathmandu_Nepal.jpg/1200px-Boudhanath_Stupa-Kathmandu_Nepal.jpg'
      }
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Aarav Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-06-15',
        comment: 'Atmosphere at Boudhanath during evening prayer hour with butter lamps lighting up is serene and magical!'
      },
      {
        id: 'r2',
        author: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-05-10',
        comment: 'Kathmandu is a paradise of heritage and culture. Seeing Swayambhunath at sunrise with Kathmandu valley views is unforgettable.'
      }
    ]
  },
  {
    id: 'pokhara-phewa-lake',
    title: 'Pokhara & Phewa Lake (Annapurna Gateway)',
    location: 'Pokhara, Kaski',
    country: 'Nepal',
    category: 'Mountain',
    rating: 4.96,
    reviewCount: 5380,
    priceLevel: '$$',
    entryFee: 'Free (City Access)',
    altitude: '822 m (2,697 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Phewa_lake%2C_Pokhara.jpg/1200px-Phewa_lake%2C_Pokhara.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Phewa_lake%2C_Pokhara.jpg/1200px-Phewa_lake%2C_Pokhara.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Sunset_flying_above_Himalayas.jpg/1200px-Sunset_flying_above_Himalayas.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/World_Peace_Pagoda%2C_Pokhara_Nepal.jpg/1200px-World_Peace_Pagoda%2C_Pokhara_Nepal.jpg'
    ],
    description: 'Nepal’s premier lake city and adventure hub. Relax in colorful wooden rowboats on serene Phewa Lake reflecting Mount Machhapuchhre (Fishtail Peak), catch golden sunrise over Annapurna from Sarangkot, and paraglide through crystal clear Himalayan skies.',
    highlights: [
      'Paddle wooden boats on Phewa Lake to Tal Barahi island temple',
      'Watch 8,000m+ Annapurna Range sunrise from Sarangkot tower',
      'Experience world-class tandem paragliding above Pokhara Valley',
      'Hike to World Peace Pagoda (Shanti Stupa) for 360° lake vistas'
    ],
    bestSeason: 'October - April',
    recommendedDays: 4,
    lat: 28.2096,
    lng: 83.9856,
    tags: ['Lakes', 'Paragliding', 'Annapurna', 'Sunrise', 'Boating', 'Relaxation'],
    featured: true,
    attractions: [
      {
        id: 'sarangkot',
        name: 'Sarangkot Sunrise Viewpoint',
        category: 'Viewpoint',
        lat: 28.2439,
        lng: 83.9486,
        distanceKm: 9.5,
        description: 'World-famous hilltop vantage point for Himalayan sunrise over Annapurna & Dhaulagiri.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Phewa_lake%2C_Pokhara.jpg/1200px-Phewa_lake%2C_Pokhara.jpg'
      },
      {
        id: 'world-peace-pagoda',
        name: 'World Peace Pagoda (Shanti Stupa)',
        category: 'Monument',
        lat: 28.2003,
        lng: 83.9450,
        distanceKm: 6.2,
        description: 'White Buddhist pagoda perched on Anadu Hill overlooking Phewa Lake.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Sunset_flying_above_Himalayas.jpg/1200px-Sunset_flying_above_Himalayas.jpg'
      },
      {
        id: 'davis-falls',
        name: 'Devi’s Falls & Gupteshwor Cave',
        category: 'Waterfall & Cave',
        lat: 28.1893,
        lng: 83.9585,
        distanceKm: 4.1,
        description: 'Dramatic waterfall plunging into an underground tunnel cave complex.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/World_Peace_Pagoda%2C_Pokhara_Nepal.jpg/1200px-World_Peace_Pagoda%2C_Pokhara_Nepal.jpg'
      }
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Liam O’Connor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-07-02',
        comment: 'Sarangkot at 5:30 AM with Machhapuchhre turning golden orange is one of the most stunning sights on Earth!'
      }
    ]
  },
  {
    id: 'everest-base-camp',
    title: 'Mount Everest Base Camp & Solukhumbu',
    location: 'Solukhumbu Region',
    country: 'Nepal',
    category: 'Adventure',
    rating: 4.99,
    reviewCount: 6890,
    priceLevel: '$$$',
    entryFee: 'NPR 3,000 (~$25) + Local Tax',
    altitude: '5,364 m (17,598 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Everest_Base_Camp_Trek_-_View_of_Everest.jpg/1200px-Everest_Base_Camp_Trek_-_View_of_Everest.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Everest_Base_Camp_Trek_-_View_of_Everest.jpg/1200px-Everest_Base_Camp_Trek_-_View_of_Everest.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Namche_Bazaar_Nepal.jpg/1200px-Namche_Bazaar_Nepal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Front_view_of_the_iconic_Tengboche_Monastery_in_Nepal.jpg/1200px-Front_view_of_the_iconic_Tengboche_Monastery_in_Nepal.jpg'
    ],
    description: 'The ultimate bucket-list expedition to the foot of Mt. Everest (8,848.86m)—Sagarmatha. Trek across high suspension bridges draped in prayer flags, through Sherpa capital Namche Bazaar, and to spiritual Tengboche Monastery surrounded by Ama Dablam.',
    highlights: [
      'Stand at Everest Base Camp (5,364m) beside the tumbling Khumbu Icefall',
      'Acclimatize in Namche Bazaar—vibrant Sherpa mountain hub',
      'Watch sunset over Mt. Everest summit from Kala Patthar (5,545m)',
      'Receive blessings at historic Tengboche Monastery'
    ],
    bestSeason: 'Autumn (Sep - Nov) & Spring (Mar - May)',
    recommendedDays: 12,
    lat: 28.0026,
    lng: 86.8528,
    tags: ['Everest', 'Trekking', 'Sherpa', 'Himalayas', 'BucketList', 'UNESCO'],
    featured: true,
    attractions: [
      {
        id: 'namche-bazaar',
        name: 'Namche Bazaar Sherpa Hub',
        category: 'Mountain Town',
        lat: 27.8069,
        lng: 86.7140,
        distanceKm: 28.0,
        description: 'Amphitheater-shaped Sherpa town famous for mountain bakeries & gear markets.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Everest_Base_Camp_Trek_-_View_of_Everest.jpg/1200px-Everest_Base_Camp_Trek_-_View_of_Everest.jpg'
      },
      {
        id: 'tengboche-monastery',
        name: 'Tengboche Monastery',
        category: 'Buddhist Monastery',
        lat: 27.8358,
        lng: 86.7640,
        distanceKm: 18.0,
        description: 'Largest Tibetan Buddhist monastery in Khumbu with framing backdrop of Ama Dablam.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Namche_Bazaar_Nepal.jpg/1200px-Namche_Bazaar_Nepal.jpg'
      }
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-06-28',
        comment: 'Trekking in Nepal to Everest Base Camp changed my life. The warmth and hospitality of Sherpa people is incredible.'
      }
    ]
  },
  {
    id: 'chitwan-national-park',
    title: 'Chitwan National Park Jungle Safari',
    location: 'Chitwan, Terai',
    country: 'Nepal',
    category: 'Nature',
    rating: 4.88,
    reviewCount: 3120,
    priceLevel: '$$',
    entryFee: 'NPR 2,000 (~$15/day)',
    altitude: '150 m (492 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Rhinoceros_unicornis_-_Chitwan_National_Park.jpg/1200px-Rhinoceros_unicornis_-_Chitwan_National_Park.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Rhinoceros_unicornis_-_Chitwan_National_Park.jpg/1200px-Rhinoceros_unicornis_-_Chitwan_National_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Elephant_safari_in_Chitwan_National_Park.jpg/1200px-Elephant_safari_in_Chitwan_National_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Tharu_village%2C_Chitwan_National_Park.jpg/1200px-Tharu_village%2C_Chitwan_National_Park.jpg'
    ],
    description: 'Nepal’s premier wildlife haven in the Terai lowlands. UNESCO World Heritage sanctuary famous for the endangered Greater One-Horned Rhinoceros, elusive Royal Bengal Tigers, wild elephants, and exotic tropical birdlife.',
    highlights: [
      'Jeep safari to spot One-Horned Rhinos & wild tigers in dense jungle',
      'Canoe ride on Rapti River watching endangered Gharial crocodiles',
      'Guided jungle walking tour with certified naturalist guides',
      'Immerse in indigenous Tharu cultural stick dance performance'
    ],
    bestSeason: 'October - March',
    recommendedDays: 3,
    lat: 27.5300,
    lng: 84.4500,
    tags: ['UNESCO', 'Wildlife', 'Safari', 'Rhinos', 'Jungle', 'Nature'],
    featured: true,
    attractions: [
      {
        id: 'rapti-river',
        name: 'Rapti River Canoe Safari',
        category: 'Wildlife Spotting',
        lat: 27.5700,
        lng: 84.4900,
        distanceKm: 4.5,
        description: 'Tranquil dug-out canoe rides for bird watching and crocodile sightings.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Rhinoceros_unicornis_-_Chitwan_National_Park.jpg/1200px-Rhinoceros_unicornis_-_Chitwan_National_Park.jpg'
      },
      {
        id: 'tharu-village',
        name: 'Tharu Cultural Village Saueraha',
        category: 'Cultural Village',
        lat: 27.5810,
        lng: 84.4930,
        distanceKm: 2.0,
        description: 'Traditional mud house village showcasing indigenous Tharu customs and craft.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Elephant_safari_in_Chitwan_National_Park.jpg/1200px-Elephant_safari_in_Chitwan_National_Park.jpg'
      }
    ],
    reviews: [
      {
        id: 'r5',
        author: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-05-18',
        comment: 'We saw 4 rhinos up close on our morning jeep safari! Such a contrast to the high mountains of Nepal.'
      }
    ]
  },
  {
    id: 'annapurna-circuit-poon-hill',
    title: 'Annapurna Circuit & Poon Hill Sunrise',
    location: 'Annapurna Region',
    country: 'Nepal',
    category: 'Adventure',
    rating: 4.94,
    reviewCount: 4750,
    priceLevel: '$$',
    entryFee: 'NPR 3,000 (~$25 ACAP)',
    altitude: '3,210 m (10,531 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Poon_Hill_sunrise.jpg/1200px-Poon_Hill_sunrise.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Poon_Hill_sunrise.jpg/1200px-Poon_Hill_sunrise.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ghandruk_village_in_Nepal.jpg/1200px-Ghandruk_village_in_Nepal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Annapurna_Circuit_trek.jpg/1200px-Annapurna_Circuit_trek.jpg'
    ],
    description: 'Traverse diverse mountain landscapes from subtropical paddy fields and blooming rhododendron forests to icy alpine passes. Experience Poon Hill (3,210m) golden sunrise over Dhaulagiri and Annapurna South.',
    highlights: [
      'Witness 360° golden Himalayan sunrise from Poon Hill tower',
      'Soak in natural geothermal hot springs at Tatopani',
      'Cross high alpine Thorong La Pass (5,416m) in Mustang',
      'Stay in traditional Gurung tea houses in Ghandruk village'
    ],
    bestSeason: 'March - May & September - November',
    recommendedDays: 6,
    lat: 28.3970,
    lng: 83.7011,
    tags: ['Trekking', 'Annapurna', 'Hot Springs', 'Sunrise', 'Gurung Culture'],
    featured: false,
    attractions: [
      {
        id: 'ghorepani',
        name: 'Ghorepani & Poon Hill',
        category: 'Trekking Peak',
        lat: 28.3990,
        lng: 83.6980,
        distanceKm: 1.2,
        description: 'Famous mountain stopover town leading directly up to Poon Hill viewpoint.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Poon_Hill_sunrise.jpg/1200px-Poon_Hill_sunrise.jpg'
      },
      {
        id: 'ghandruk',
        name: 'Ghandruk Heritage Village',
        category: 'Traditional Village',
        lat: 28.3750,
        lng: 83.8070,
        distanceKm: 12.0,
        description: 'Stone-paved Gurung village offering uninterrupted views of Annapurna South.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ghandruk_village_in_Nepal.jpg/1200px-Ghandruk_village_in_Nepal.jpg'
      }
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Chloe Dupont',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-04-12',
        comment: 'Trekking through red rhododendron forests in April in Nepal is breathtakingly beautiful.'
      }
    ]
  },
  {
    id: 'lumbini-buddha-birthplace',
    title: 'Lumbini – Birthplace of Lord Buddha',
    location: 'Lumbini, Rupandehi',
    country: 'Nepal',
    category: 'Historic',
    rating: 4.91,
    reviewCount: 3890,
    priceLevel: '$',
    entryFee: 'NPR 700 (~$5.50)',
    altitude: '150 m (492 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lumbini_Maya_Devi_Temple.jpg/1200px-Lumbini_Maya_Devi_Temple.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lumbini_Maya_Devi_Temple.jpg/1200px-Lumbini_Maya_Devi_Temple.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/World_Peace_Pagoda_Lumbini.jpg/1200px-World_Peace_Pagoda_Lumbini.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lumbini_Maya_Devi_Temple.jpg/1200px-Lumbini_Maya_Devi_Temple.jpg'
    ],
    description: 'One of the world’s most sacred pilgrimage destinations. Lumbini is the birthplace of Siddhartha Gautama (Lord Buddha) in 623 BC. Explore peaceful international monastic zones built by nations worldwide, ancient ruins, and the Sacred Garden.',
    highlights: [
      'Visit Maya Devi Temple marking exact birth marker stone of Buddha',
      'Meditate by Puskarini Sacred Pond where Buddha took his first bath',
      'See Ashoka Pillar erected by Emperor Ashoka in 249 BC',
      'Explore 25+ international Buddhist monasteries (German, Chinese, Thai)'
    ],
    bestSeason: 'October - March',
    recommendedDays: 2,
    lat: 27.4800,
    lng: 83.2750,
    tags: ['UNESCO', 'Spiritual', 'Buddha', 'Pilgrimage', 'Peace', 'History'],
    featured: true,
    attractions: [
      {
        id: 'maya-devi-temple',
        name: 'Maya Devi Sacred Temple',
        category: 'Pilgrimage Shrine',
        lat: 27.4795,
        lng: 83.2760,
        distanceKm: 0.2,
        description: 'Main temple enshrining the ancient foundation stone where Buddha was born.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lumbini_Maya_Devi_Temple.jpg/1200px-Lumbini_Maya_Devi_Temple.jpg'
      },
      {
        id: 'world-peace-flame',
        name: 'Eternal World Peace Flame',
        category: 'Monument',
        lat: 27.4880,
        lng: 83.2780,
        distanceKm: 1.0,
        description: 'Ever-burning peace flame brought from the United Nations in 1986.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/World_Peace_Pagoda_Lumbini.jpg/1200px-World_Peace_Pagoda_Lumbini.jpg'
      }
    ],
    reviews: [
      {
        id: 'r7',
        author: 'Tenzin Norbu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-03-22',
        comment: 'Deeply spiritual and calm environment. Walking around the monastery zone in Lumbini brings profound peace.'
      }
    ]
  },
  {
    id: 'bhaktapur-durbar-square',
    title: 'Bhaktapur Durbar Square & Pottery Square',
    location: 'Bhaktapur',
    country: 'Nepal',
    category: 'Cultural',
    rating: 4.92,
    reviewCount: 2940,
    priceLevel: '$',
    entryFee: 'NPR 1,800 (~$13.50)',
    altitude: '1,401 m (4,596 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bhaktapur_Durbar_Square_01.jpg/1200px-Bhaktapur_Durbar_Square_01.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bhaktapur_Durbar_Square_01.jpg/1200px-Bhaktapur_Durbar_Square_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nyatapola_Temple.jpg/1200px-Nyatapola_Temple.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bhaktapur_Durbar_Square_01.jpg/1200px-Bhaktapur_Durbar_Square_01.jpg'
    ],
    description: 'The City of Devotees and living museum of medieval Newari art. Vehicle-free Bhaktapur boasts the tallest pagoda temple in Nepal (Nyatapola), golden gates, and artisans spinning clay pots in open-air squares.',
    highlights: [
      'Admire 5-tiered Nyatapola Temple—highest pagoda temple in Nepal',
      'Visit 55-Window Palace and intricate Golden Gate (Lu Dhowka)',
      'Taste famous Juju Dhau ("King Curd") traditional sweet yogurt',
      'Watch pottery masters craft clay pots in Pottery Square'
    ],
    bestSeason: 'Year-round (Best Sep - May)',
    recommendedDays: 2,
    lat: 27.6710,
    lng: 85.4298,
    tags: ['UNESCO', 'Architecture', 'Artisans', 'Pottery', 'Newari', 'Heritage'],
    featured: false,
    attractions: [
      {
        id: 'nyatapola-temple',
        name: 'Nyatapola 5-Storey Pagoda',
        category: 'Temple',
        lat: 27.6715,
        lng: 85.4290,
        distanceKm: 0.3,
        description: 'Magnificent 18th-century pagoda standing 30 meters high with stone guardian statues.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bhaktapur_Durbar_Square_01.jpg/1200px-Bhaktapur_Durbar_Square_01.jpg'
      }
    ],
    reviews: [
      {
        id: 'r8',
        author: 'Freja Lindqvist',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-02-14',
        comment: 'Bhaktapur feels like stepping back 500 years in time. Try the Juju Dhau curd, it is delicious!'
      }
    ]
  },
  {
    id: 'nagarkot-viewpoint',
    title: 'Nagarkot Himalayan Sunrise Viewpoint',
    location: 'Nagarkot, Bhaktapur',
    country: 'Nepal',
    category: 'City Breaks',
    rating: 4.87,
    reviewCount: 2180,
    priceLevel: '$$',
    entryFee: 'NPR 340 (~$2.50 Local Tax)',
    altitude: '2,195 m (7,200 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nagarkot_Sunrise.jpg/1200px-Nagarkot_Sunrise.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nagarkot_Sunrise.jpg/1200px-Nagarkot_Sunrise.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Changu_Narayan_Temple.jpg/1200px-Changu_Narayan_Temple.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nagarkot_Sunrise.jpg/1200px-Nagarkot_Sunrise.jpg'
    ],
    description: 'Perched on a mountain ridge just 32km from Kathmandu, Nagarkot offers one of the broadest panoramic views of the Himalayas—stretching from Annapurna in the west to Mt. Everest in the east.',
    highlights: [
      'Catch golden sunrise over 8 Himalayan mountain ranges',
      'Climb Nagarkot Panoramic View Tower at 2,195m elevation',
      'Day hike through pine forest trails down to Changu Narayan temple',
      'Enjoy mountain resort stays with private balcony mountain views'
    ],
    bestSeason: 'October - April',
    recommendedDays: 2,
    lat: 27.7172,
    lng: 85.5200,
    tags: ['Himalayas', 'Sunrise', 'Panoramic', 'Resort', 'Hiking', 'Everest View'],
    featured: false,
    attractions: [
      {
        id: 'changu-narayan',
        name: 'Changu Narayan Temple',
        category: 'Ancient Temple',
        lat: 27.7153,
        lng: 85.4280,
        distanceKm: 8.5,
        description: 'Oldest Hindu temple in Nepal with 5th-century stone inscriptions.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nagarkot_Sunrise.jpg/1200px-Nagarkot_Sunrise.jpg'
      }
    ],
    reviews: [
      {
        id: 'r9',
        author: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-01-20',
        comment: 'Waking up at 5 AM to see the sunrise illuminate the snowy Himalayan peaks right from our hotel balcony was magical.'
      }
    ]
  },
  {
    id: 'patan-durbar-square',
    title: 'Patan Durbar Square & Krishna Mandir',
    location: 'Lalitpur, Kathmandu Valley',
    country: 'Nepal',
    category: 'Cultural',
    rating: 4.93,
    reviewCount: 3100,
    priceLevel: '$',
    entryFee: 'NPR 1,000 (~$7.50)',
    altitude: '1,300 m (4,265 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Patan_Durbar_Square_01.jpg/1200px-Patan_Durbar_Square_01.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Patan_Durbar_Square_01.jpg/1200px-Patan_Durbar_Square_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Krishna_Mandir_Patan.jpg/1200px-Krishna_Mandir_Patan.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Golden_Temple_Patan.jpg/1200px-Golden_Temple_Patan.jpg'
    ],
    description: 'Known as Lalitpur ("City of Fine Arts"), Patan is world-famous for metal artisans, bronze statues, and stone architecture. Admire Krishna Mandir—a 21-pinnacle stone masterpiece built in 1637—and the Golden Temple (Hiranya Varna Mahavihar).',
    highlights: [
      'Marvel at 21-pinnacle carved stone Krishna Mandir temple',
      'Visit Golden Temple (Hiranya Varna Mahavihar) guarded by bronze lions',
      'Explore Patan Museum—voted one of South Asia’s finest museums',
      'Watch metal smiths carve traditional Buddha statues in Mangal Bazaar'
    ],
    bestSeason: 'Year-round',
    recommendedDays: 2,
    lat: 27.6738,
    lng: 85.3253,
    tags: ['UNESCO', 'Fine Arts', 'Krishna Mandir', 'Bronze', 'Culture', 'Museum'],
    featured: true,
    attractions: [
      {
        id: 'golden-temple',
        name: 'Hiranya Varna Mahavihar (Golden Temple)',
        category: 'Buddhist Temple',
        lat: 27.6751,
        lng: 85.3245,
        distanceKm: 0.2,
        description: '3-storey golden pagoda monastery adorned with brass statuary and prayer wheels.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Patan_Durbar_Square_01.jpg/1200px-Patan_Durbar_Square_01.jpg'
      }
    ],
    reviews: [
      {
        id: 'r10',
        author: 'Siddharth Roy',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-05-02',
        comment: 'Patan Museum courtyard is super quiet and serene. The craftsmanship of the bronze icons is incredible.'
      }
    ]
  },
  {
    id: 'langtang-valley-trek',
    title: 'Langtang Valley & Kyanjin Gompa Trek',
    location: 'Langtang, Rasuwa',
    country: 'Nepal',
    category: 'Adventure',
    rating: 4.89,
    reviewCount: 1950,
    priceLevel: '$$',
    entryFee: 'NPR 3,000 (~$25 Langtang Permit)',
    altitude: '3,870 m (12,696 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Langtang_Valley.jpg/1200px-Langtang_Valley.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Langtang_Valley.jpg/1200px-Langtang_Valley.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Kyanjin_Gompa.jpg/1200px-Kyanjin_Gompa.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Langtang_Valley.jpg/1200px-Langtang_Valley.jpg'
    ],
    description: 'Closest Himalayan trekking valley to Kathmandu. Known as "The Valley of Glaciers", Langtang combines Tamang mountain culture, yak cheese factories, alpine meadows, and views of Langtang Lirung (7,227m).',
    highlights: [
      'Climb Kyanjin Ri (4,773m) for 360° glacier panoramas',
      'Visit historic Kyanjin Gompa and sample fresh Swiss-inspired Yak Cheese',
      'Experience authentic Tamang mountain heritage hospitality',
      'Trek through bamboo forests home to rare Red Pandas'
    ],
    bestSeason: 'March - May & September - November',
    recommendedDays: 7,
    lat: 28.2167,
    lng: 85.5667,
    tags: ['Trekking', 'Glaciers', 'Tamang', 'Yak Cheese', 'Red Panda', 'Mountains'],
    featured: false,
    attractions: [
      {
        id: 'kyanjin-gompa',
        name: 'Kyanjin Gompa & Cheese Factory',
        category: 'Monastery & Farm',
        lat: 28.2120,
        lng: 85.5600,
        distanceKm: 0.5,
        description: 'Spiritual mountain monastery surrounded by towering snow caps and artisan yak cheese farm.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Langtang_Valley.jpg/1200px-Langtang_Valley.jpg'
      }
    ],
    reviews: [
      {
        id: 'r11',
        author: 'Sophie Martin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-04-18',
        comment: 'Langtang trek is much less crowded than Everest or Annapurna, yet the glacier mountain views are unbelievable.'
      }
    ]
  },
  {
    id: 'mustang-muktinath',
    title: 'Upper Mustang & Sacred Muktinath Temple',
    location: 'Mustang Region',
    country: 'Nepal',
    category: 'Historic',
    rating: 4.95,
    reviewCount: 2280,
    priceLevel: '$$$',
    entryFee: '$50/day RAP + NPR 3,000 ACAP',
    altitude: '3,800 m (12,467 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Upper_Mustang.jpg/1200px-Upper_Mustang.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Upper_Mustang.jpg/1200px-Upper_Mustang.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Muktinath_Temple.jpg/1200px-Muktinath_Temple.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Upper_Mustang.jpg/1200px-Upper_Mustang.jpg'
    ],
    description: 'The ancient "Forbidden Kingdom of Lo" in the rain-shadow of the Himalayas. Upper Mustang offers dramatic red sandstone canyons, thousand-year-old cliff sky caves, walled city Lo Manthang, and sacred Muktinath Temple at 3,800m.',
    highlights: [
      'Bathe under 108 bull-headed sacred water spouts at Muktinath',
      'Explore 14th-century walled royal city Lo Manthang',
      'See ancient cliff sky caves and Tibetan Buddhist wall frescoes',
      'Ride mountain bikes or horses across arid Himalayan desert canyons'
    ],
    bestSeason: 'May - November (Ideal Rain-Shadow Zone)',
    recommendedDays: 8,
    lat: 28.8167,
    lng: 83.8667,
    tags: ['Mustang', 'Muktinath', 'Desert', 'Kingdom', 'Spiritual', 'Canyons'],
    featured: true,
    attractions: [
      {
        id: 'muktinath-temple',
        name: 'Muktinath Sacred Shrine',
        category: 'Pilgrimage Shrine',
        lat: 28.8170,
        lng: 83.8720,
        distanceKm: 0.3,
        description: 'Sacred salvation site for both Hindus and Buddhists with 108 spouts and eternal natural gas flame.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Upper_Mustang.jpg/1200px-Upper_Mustang.jpg'
      }
    ],
    reviews: [
      {
        id: 'r12',
        author: 'Rohan Deshmukh',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-03-30',
        comment: 'The landscape in Mustang looks like another planet! The spiritual energy at Muktinath with 108 spouts is sublime.'
      }
    ]
  },
  {
    id: 'rara-lake',
    title: 'Rara Lake National Park (Queen of Alpine Lakes)',
    location: 'Mugu, Karnali',
    country: 'Nepal',
    category: 'Nature',
    rating: 4.97,
    reviewCount: 1420,
    priceLevel: '$$$',
    entryFee: 'NPR 3,000 (~$23 Park Permit)',
    altitude: '2,990 m (9,810 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg'
    ],
    description: 'Nepal’s largest and deepest freshwater lake situated at 2,990m elevation in pristine remote Western Nepal. Surrounded by dense pine, spruce, and juniper forests with snow-capped mountain reflections.',
    highlights: [
      'Boat across deep blue crystal-clear waters changing colors with sunlight',
      'Horse trek along forested lake perimeter trails',
      'Camp under unpolluted starry night skies and Milky Way',
      'Spot rare Himalayan Black Bears and Musk Deer in pine forest'
    ],
    bestSeason: 'September - November & April - May',
    recommendedDays: 5,
    lat: 29.5333,
    lng: 82.0833,
    tags: ['Alpine Lake', 'Remote', 'Wilderness', 'Boating', 'Stars', 'Pine Forest'],
    featured: false,
    attractions: [
      {
        id: 'murma-top',
        name: 'Murma Top Viewpoint',
        category: 'Viewpoint',
        lat: 29.5400,
        lng: 82.0900,
        distanceKm: 3.5,
        description: 'Vantage point offering full 360-degree aerial panorama of Rara Lake and Karnali peaks.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg'
      }
    ],
    reviews: [
      {
        id: 'r13',
        author: 'Nisha Bista',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-06-01',
        comment: 'Rara Lake is pure untouched wilderness. Seeing the reflection of snow mountains on the deep blue water is breathtaking.'
      }
    ]
  },
  {
    id: 'bandipur-heritage-town',
    title: 'Bandipur Living Museum Hill Town',
    location: 'Tanahun, Gandaki',
    country: 'Nepal',
    category: 'City Breaks',
    rating: 4.88,
    reviewCount: 1870,
    priceLevel: '$$',
    entryFee: 'Free (Siddha Cave NPR 150)',
    altitude: '1,030 m (3,379 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg'
    ],
    description: 'A preserved hilltop Newari town halfway between Kathmandu and Pokhara. Free from motor vehicles, Bandipur features 18th-century architecture, brass lanterns, bougainvillea flowers, and views over Marshyangdi River Valley.',
    highlights: [
      'Stroll automobile-free cobblestone main bazaar flanked by heritage mansions',
      'Watch sunset over Dhaulagiri and Annapurna ranges from Tundikhel',
      'Explore Siddha Cave—the largest natural cave in Nepal',
      'Hike down through orange orchards to Ramkot village'
    ],
    bestSeason: 'October - April',
    recommendedDays: 2,
    lat: 27.9333,
    lng: 84.4167,
    tags: ['Newari', 'Heritage', 'Hill Town', 'Cobblestone', 'Relaxation', 'Sunset'],
    featured: false,
    attractions: [
      {
        id: 'siddha-cave',
        name: 'Siddha Cave (Siddha Gufa)',
        category: 'Cave Exploration',
        lat: 27.9400,
        lng: 84.4200,
        distanceKm: 2.1,
        description: 'Nepal’s largest cave chamber with dramatic stalactite and stalagmite formations.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg'
      }
    ],
    reviews: [
      {
        id: 'r14',
        author: 'Carlos Gomez',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-05-15',
        comment: 'Bandipur is super charming and peaceful. Sipping coffee on a balcony in the morning overlooking the valley is pure bliss.'
      }
    ]
  },
  {
    id: 'janakpur-janaki-temple',
    title: 'Janakpurdham & Bright Ram Janaki Temple',
    location: 'Janakpur, Dhanusha',
    country: 'Nepal',
    category: 'Historic',
    rating: 4.86,
    reviewCount: 2150,
    priceLevel: '$',
    entryFee: 'Free',
    altitude: '70 m (230 ft)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg'
    ],
    description: 'The ancient capital of the Videha Kingdom and birthplace of Goddess Sita (Janaki). Janakpur is world-famous for its bright white marble Janaki Mandir palace temple, Mithila folk paintings, sacred ponds, and rich Ramayana mythology.',
    highlights: [
      'Admire Janaki Mandir—a 3-storey white palace temple built in 1911',
      'Learn traditional Mithila art paintings created by indigenous women',
      'Visit Vivah Mandap marking the divine wedding venue of Sita and Ram',
      'Ride the historic Nepal Railways train across Terai plains'
    ],
    bestSeason: 'October - March',
    recommendedDays: 2,
    lat: 26.7271,
    lng: 85.9248,
    tags: ['Ramayana', 'Mithila Art', 'Palace Temple', 'Pilgrimage', 'Terai', 'Culture'],
    featured: false,
    attractions: [
      {
        id: 'janaki-mandir',
        name: 'Janaki Mandir Palace Temple',
        category: 'Pilgrimage Temple',
        lat: 26.7275,
        lng: 85.9250,
        distanceKm: 0.1,
        description: 'Imposing Mughal and Rajput style marble temple with 60 rooms and intricate arches.',
        photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg'
      }
    ],
    reviews: [
      {
        id: 'r15',
        author: 'Anjali Gupta',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2026-04-05',
        comment: 'Janaki Mandir illuminated at night with colorful lights looks like a fairytale palace!'
      }
    ]
  }
];
