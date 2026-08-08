const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'components');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Background colors - make them frosted glass
  content = content.replace(/bg-slate-950\/90/g, 'bg-white/40');
  content = content.replace(/bg-slate-950\/80/g, 'bg-white/40');
  content = content.replace(/bg-slate-950/g, 'bg-transparent');
  content = content.replace(/bg-slate-900\/90/g, 'bg-white/50');
  content = content.replace(/bg-slate-900\/80/g, 'bg-white/40');
  content = content.replace(/bg-slate-900\/50/g, 'bg-white/30');
  content = content.replace(/bg-slate-900/g, 'bg-white/40');
  content = content.replace(/bg-slate-800\/80/g, 'bg-white/50');
  content = content.replace(/bg-slate-800\/50/g, 'bg-white/40');
  content = content.replace(/bg-slate-800/g, 'bg-white/50');
  content = content.replace(/bg-slate-700/g, 'bg-white/60');
  
  // Fix gradients
  content = content.replace(/from-slate-950/g, 'from-blue-200/50');
  content = content.replace(/via-slate-950/g, 'via-blue-300/50');
  content = content.replace(/to-slate-950/g, 'to-blue-200/50');
  content = content.replace(/from-slate-900/g, 'from-white/50');
  content = content.replace(/to-slate-900/g, 'to-white/40');

  // Borders
  content = content.replace(/border-slate-800/g, 'border-white/50');
  content = content.replace(/border-slate-700/g, 'border-white/60');
  content = content.replace(/border-white\/10/g, 'border-white/50');
  content = content.replace(/border-white\/5/g, 'border-white/40');

  // Text colors
  content = content.replace(/text-slate-200/g, 'text-slate-800');
  content = content.replace(/text-slate-300/g, 'text-slate-700');
  content = content.replace(/text-slate-400/g, 'text-slate-600');
  content = content.replace(/text-white/g, 'text-slate-900');
  
  // Fix primary buttons to keep white text
  content = content.replace(/bg-blue-600(.*?)text-slate-900/g, 'bg-blue-600$1text-white');
  content = content.replace(/text-slate-900(.*?)bg-blue-600/g, 'text-white$1bg-blue-600');

  // Any stray generic text-white on blue buttons
  content = content.replace(/bg-blue-500(.*?)text-slate-900/g, 'bg-blue-500$1text-white');

  fs.writeFileSync(filePath, content, 'utf8');
};

const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.tsx'));
files.forEach(file => {
  replaceInFile(path.join(directoryPath, file));
});

console.log('Theme replaced in components');
