import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const outDir = path.resolve(rootDir, '_site');
let basePath = process.env.BASE_PATH || '/public-slides/';
if (!basePath.startsWith('/')) basePath = '/' + basePath;
if (!basePath.endsWith('/')) basePath = basePath + '/';

console.log(`[build-all] Output directory: ${outDir}`);
console.log(`[build-all] Base path: ${basePath}`);

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Find all directories containing slides.md
const ignoreDirs = new Set(['node_modules', 'scripts', '.git', '.github', '_site', 'dist', '.slidev']);
const entries = fs.readdirSync(rootDir, { withFileTypes: true });

const decks = [];

for (const entry of entries) {
  if (!entry.isDirectory() || ignoreDirs.has(entry.name) || entry.name.startsWith('.')) {
    continue;
  }

  const deckDir = path.resolve(rootDir, entry.name);
  const slidesFile = path.resolve(deckDir, 'slides.md');

  if (fs.existsSync(slidesFile)) {
    const content = fs.readFileSync(slidesFile, 'utf-8');
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    let title = entry.name;
    let description = '';

    if (frontmatterMatch) {
      const fmText = frontmatterMatch[1];
      const titleMatch = fmText.match(/^title:\s*(.*)$/m);
      if (titleMatch) {
        title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
      }

      const multilineMatch = fmText.match(/^(?:info|description):\s*\|[ \t]*\r?\n((?:[ \t]+[^\r\n]*(?:\r?\n|$))+)/m);
      if (multilineMatch) {
        description = multilineMatch[1]
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
          .join(' ');
      } else {
        const descMatch = fmText.match(/^(?:description|info):\s*['"]?(.*?)['"]?$/m);
        if (descMatch && descMatch[1]) {
          description = descMatch[1].trim();
        }
      }
    }

    decks.push({
      dirName: entry.name,
      dirPath: deckDir,
      title,
      description,
    });
  }
}

console.log(`[build-all] Found ${decks.length} Slidev presentation(s): ${decks.map((d) => d.dirName).join(', ')}`);

for (const deck of decks) {
  console.log(`\n========================================`);
  console.log(`[build-all] Building: ${deck.dirName} ("${deck.title}")`);
  console.log(`========================================`);

  const deckOutDir = path.resolve(outDir, deck.dirName);
  const deckBase = `${basePath}${deck.dirName}/`;

  // Check if dependencies need installation
  const packageJsonPath = path.resolve(deck.dirPath, 'package.json');
  const nodeModulesPath = path.resolve(deck.dirPath, 'node_modules');

  if (fs.existsSync(packageJsonPath) && !fs.existsSync(nodeModulesPath)) {
    console.log(`[build-all] Installing dependencies in ${deck.dirName}...`);
    execSync('npm install', { cwd: deck.dirPath, stdio: 'inherit' });
  }

  console.log(`[build-all] Running slidev build (base: ${deckBase})...`);
  execSync(
    `npx @slidev/cli build slides.md --base "${deckBase}" --out "${deckOutDir}"`,
    { cwd: deck.dirPath, stdio: 'inherit' }
  );
}

// Generate root index.html landing page
const deckCardsHtml = decks
  .map(
    (d) => `
      <a class="card" href="${basePath}${d.dirName}/">
        <div class="card-header">
          <div class="card-tag">${d.dirName}</div>
          <span class="card-arrow">↗</span>
        </div>
        <h2 class="card-title">${escapeHtml(d.title)}</h2>
        <p class="card-desc">${escapeHtml(d.description || 'Interactive Slidev presentation deck.')}</p>
        <div class="card-footer">
          <span>View Slides</span>
        </div>
      </a>`
  )
  .join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Public Slides | @nooskuyh</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover-border: rgba(99, 102, 241, 0.4);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.15);
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, var(--bg) 70%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 3rem 1.5rem;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      width: 100%;
      flex: 1;
    }
    header {
      margin-bottom: 3.5rem;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.3);
      margin-bottom: 1.25rem;
      letter-spacing: 0.03em;
    }
    h1 {
      font-size: 2.75rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .card {
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 1rem;
      padding: 1.75rem;
      text-decoration: none;
      color: inherit;
      backdrop-filter: blur(12px);
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: var(--card-hover-border);
      box-shadow: 0 12px 30px -10px var(--accent-glow);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card-tag {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      color: #94a3b8;
    }
    .card-arrow {
      font-size: 1.25rem;
      color: var(--text-muted);
      transition: transform 0.2s ease, color 0.2s ease;
    }
    .card:hover .card-arrow {
      color: #a5b4fc;
      transform: translate(2px, -2px);
    }
    .card-title {
      font-size: 1.35rem;
      font-weight: 600;
      line-height: 1.35;
      margin-bottom: 0.75rem;
      color: #f1f5f9;
    }
    .card-desc {
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.6;
      flex: 1;
      margin-bottom: 1.5rem;
    }
    .card-footer {
      font-size: 0.85rem;
      font-weight: 600;
      color: #818cf8;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    footer a {
      color: #818cf8;
      text-decoration: none;
    }
    footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">${decks.length} PRESENTATION${decks.length === 1 ? '' : 'S'}</div>
      <h1>Slidev Presentations</h1>
      <p class="subtitle">Curated slide decks and lecture materials built with Slidev.</p>
    </header>

    <main class="grid">
      ${deckCardsHtml}
    </main>

    <footer>
      <p>
        Hosted on GitHub Pages &bull;
        <a href="https://github.com/nooskuyh/public-slides" target="_blank" rel="noopener">GitHub Repository</a>
      </p>
    </footer>
  </div>
</body>
</html>`;

fs.writeFileSync(path.resolve(outDir, 'index.html'), indexHtml);
console.log(`\n[build-all] Done! Generated portal index.html and built ${decks.length} deck(s).`);

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
