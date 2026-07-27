const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "newsletters");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));

const newsletters = files.map(file => {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter = {};
  match[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key) frontmatter[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
  });
  return { ...frontmatter, body: match[2].trim(), file };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(newsletters, null, 2));
console.log(`Built index.json with ${newsletters.length} newsletters`);
