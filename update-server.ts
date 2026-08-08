import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Remove async function startServer() {
content = content.replace(/async function startServer\(\) \{\n/, '');

// Remove the final startServer(); and the closing brace
content = content.replace(/}\n\nstartServer\(\);\n?$/, '');

// Unindent everything that was inside startServer by 2 spaces
// (optional, but good for cleanliness. Let's just do it)
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  // If the line starts with 2 spaces and is not an import, remove 2 spaces
  // Actually, wait, imports are not inside startServer.
  // The first 19 lines are imports.
  if (i >= 19 && lines[i].startsWith('  ')) {
    lines[i] = lines[i].substring(2);
  }
}
content = lines.join('\n');

// Now adjust the Vite and listen blocks for Vercel
content = content.replace(
  /if \(process\.env\.NODE_ENV !== 'production'\) \{/g,
  "if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {"
);

content = content.replace(
  /\} else \{(\s+const distPath = path\.join)/g,
  "} else if (!process.env.VERCEL) {$1"
);

content = content.replace(
  /app\.listen\(PORT, '0\.0\.0\.0', \(\) => \{\n\s+console\.log\(`Wanderlust Server active on http:\/\/0\.0\.0\.0:\$\{PORT\}`\);\n\s+\}\);/g,
  "if (!process.env.VERCEL) {\n  app.listen(PORT, '0.0.0.0', () => {\n    console.log(`Wanderlust Server active on http://0.0.0.0:${PORT}`);\n  });\n}\n\nexport default app;"
);

fs.writeFileSync('server.ts', content);
console.log('server.ts updated');
