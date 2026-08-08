
import fs from 'fs';
import { INITIAL_DESTINATIONS } from './src/data/destinations.js';

// Since it's TS and might have imports that aren't resolved easily in plain node,
// I'll just do text replacement on the file.
const destPath = './src/data/destinations.ts';
let content = fs.readFileSync(destPath, 'utf-8');

const imageMap: Record<string, string[]> = {
  'kathmandu-valley': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kathmandu_Durbar_Square_02.jpg/1200px-Kathmandu_Durbar_Square_02.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Swayambhunath_2018.jpg/1200px-Swayambhunath_2018.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Boudhanath_Stupa-Kathmandu_Nepal.jpg/1200px-Boudhanath_Stupa-Kathmandu_Nepal.jpg'
  ],
  'pokhara-phewa-lake': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Phewa_lake%2C_Pokhara.jpg/1200px-Phewa_lake%2C_Pokhara.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Sunset_flying_above_Himalayas.jpg/1200px-Sunset_flying_above_Himalayas.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/World_Peace_Pagoda%2C_Pokhara_Nepal.jpg/1200px-World_Peace_Pagoda%2C_Pokhara_Nepal.jpg'
  ],
  'everest-base-camp': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Everest_Base_Camp_Trek_-_View_of_Everest.jpg/1200px-Everest_Base_Camp_Trek_-_View_of_Everest.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Namche_Bazaar_Nepal.jpg/1200px-Namche_Bazaar_Nepal.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Front_view_of_the_iconic_Tengboche_Monastery_in_Nepal.jpg/1200px-Front_view_of_the_iconic_Tengboche_Monastery_in_Nepal.jpg'
  ],
  'chitwan-national-park': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Rhinoceros_unicornis_-_Chitwan_National_Park.jpg/1200px-Rhinoceros_unicornis_-_Chitwan_National_Park.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Elephant_safari_in_Chitwan_National_Park.jpg/1200px-Elephant_safari_in_Chitwan_National_Park.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Tharu_village%2C_Chitwan_National_Park.jpg/1200px-Tharu_village%2C_Chitwan_National_Park.jpg'
  ],
  'annapurna-circuit-poon-hill': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Poon_Hill_sunrise.jpg/1200px-Poon_Hill_sunrise.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ghandruk_village_in_Nepal.jpg/1200px-Ghandruk_village_in_Nepal.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Annapurna_Circuit_trek.jpg/1200px-Annapurna_Circuit_trek.jpg'
  ],
  'lumbini-buddha-birthplace': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lumbini_Maya_Devi_Temple.jpg/1200px-Lumbini_Maya_Devi_Temple.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/World_Peace_Pagoda_Lumbini.jpg/1200px-World_Peace_Pagoda_Lumbini.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Lumbini_Maya_Devi_Temple.jpg/1200px-Lumbini_Maya_Devi_Temple.jpg'
  ],
  'bhaktapur-durbar-square': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bhaktapur_Durbar_Square_01.jpg/1200px-Bhaktapur_Durbar_Square_01.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nyatapola_Temple.jpg/1200px-Nyatapola_Temple.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bhaktapur_Durbar_Square_01.jpg/1200px-Bhaktapur_Durbar_Square_01.jpg'
  ],
  'nagarkot-viewpoint': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nagarkot_Sunrise.jpg/1200px-Nagarkot_Sunrise.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Changu_Narayan_Temple.jpg/1200px-Changu_Narayan_Temple.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nagarkot_Sunrise.jpg/1200px-Nagarkot_Sunrise.jpg'
  ],
  'patan-durbar-square': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Patan_Durbar_Square_01.jpg/1200px-Patan_Durbar_Square_01.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Krishna_Mandir_Patan.jpg/1200px-Krishna_Mandir_Patan.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Golden_Temple_Patan.jpg/1200px-Golden_Temple_Patan.jpg'
  ],
  'langtang-valley-trek': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Langtang_Valley.jpg/1200px-Langtang_Valley.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Kyanjin_Gompa.jpg/1200px-Kyanjin_Gompa.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Langtang_Valley.jpg/1200px-Langtang_Valley.jpg'
  ],
  'mustang-muktinath': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Upper_Mustang.jpg/1200px-Upper_Mustang.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Muktinath_Temple.jpg/1200px-Muktinath_Temple.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Upper_Mustang.jpg/1200px-Upper_Mustang.jpg'
  ],
  'rara-lake': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Rara_Lake_Nepal.jpg/1200px-Rara_Lake_Nepal.jpg'
  ],
  'bandipur-heritage-town': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bandipur_Bazaar.jpg/1200px-Bandipur_Bazaar.jpg'
  ],
  'janakpur-janaki-temple': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Janaki_Mandir_Janakpur.jpg/1200px-Janaki_Mandir_Janakpur.jpg'
  ]
};

const regexId = /id:\s*'([^']+)'/g;
let match;
let lastIndex = 0;
let newContent = '';

// We will split the file by objects. 
// A simpler way: loop over each key in imageMap and find its block.
const blocks = content.split(/(?=\n  \{)/);

for (let i = 0; i < blocks.length; i++) {
  let block = blocks[i];
  const idMatch = block.match(/id:\s*'([^']+)'/);
  if (idMatch) {
    const id = idMatch[1];
    const urls = imageMap[id];
    if (urls) {
      // replace imageUrl
      block = block.replace(/imageUrl:\s*'[^']+'/, `imageUrl: '${urls[0]}'`);
      // replace gallery
      block = block.replace(/gallery:\s*\[\s*'[^']+',\s*'[^']+',\s*'[^']+'\s*\]/g,
        `gallery: [\n      '${urls[0]}',\n      '${urls[1]}',\n      '${urls[2]}'\n    ]`);
      // replace attractions photoUrl
      let attrIndex = 0;
      block = block.replace(/photoUrl:\s*'[^']+'/g, (match) => {
        const url = urls[attrIndex % urls.length];
        attrIndex++;
        return `photoUrl: '${url}'`;
      });
      // also replace the review avatars with something generic to fix broken ones. Unsplash avatars might still work, but let's change them just in case.
      // Actually unsplash URLs for avatars without 'source' might work since they are just IDs.
    }
  }
  newContent += block;
}

fs.writeFileSync(destPath, newContent);
console.log('Done!');
