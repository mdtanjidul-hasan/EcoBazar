import * as fs from 'fs';

function findDetails() {
  const fileContent = fs.readFileSync('scraped_asset_._assets_index-cBHbePMW.js', 'utf8');

  // Let's print the first 50 appearances of strings that are likely product titles.
  // We can search for any string with uppercase letters or containing word characters that represents a product name or custom branding.
  // Let's run a search for typical e-commerce keywords: "phone", "shirt", "shoe", "bag", "laptop", "watch", "perfume", "electronics", "glass", "clothing".
  const keywords = ['cart', 'contact', 'product', 'shop', 'order', 'checkout', 'stripe', 'price', 'dollar', 'euro', 'USD', 'category', 'categories'];
  for (const keyword of keywords) {
    const minLength = Math.max(0, fileContent.indexOf(keyword) - 50);
    const maxLength = Math.min(fileContent.length, fileContent.indexOf(keyword) + 150);
    if (fileContent.indexOf(keyword) !== -1) {
      console.log(`--- INDEX OF "${keyword}": ---`);
      console.log(fileContent.substring(minLength, maxLength));
    }
  }

  // Let's extract all strings matching a product metadata structure.
  // In javascript, objects look like `{id:1, title:"Product 1", ...}`
  // Let's search for patterns like `id:`, `name:`, `price:`, `description:` in the file.
  // Let's do a regex search for something like `{id:` or `{name:` or `"id":` or `"name":`.
  const objectRegex = /\{[^}]*?price[^}]*?\}/g;
  const objectMatches = fileContent.match(objectRegex) || [];
  console.log(`Found ${objectMatches.length} objects containing the word "price".`);
  for (let i = 0; i < Math.min(10, objectMatches.length); i++) {
    console.log(`Match ${i}:`, objectMatches[i].substring(0, 300));
  }

  // Let's write a parser that extracts all unique strings starting with capitals (which might be titles, menu items, or products)
  const wordsRegex = /"[A-Z][A-Za-z0-9\s,\-\.\:\'\!]{3,40}"|'[A-Z][A-Za-z0-9\s,\-\.\:\'\!]{3,40}'/g;
  const wordMatches = fileContent.match(wordsRegex) || [];
  const uniqueCapitalized = Array.from(new Set(wordMatches))
    .map(w => w.slice(1, -1))
    .filter(w => w.trim().split(/\s+/).length >= 1 && !w.includes('Error') && !w.includes('Firebase') && !w.includes('React'));
  
  fs.writeFileSync('capitalized_strings.txt', uniqueCapitalized.join('\n'));
  console.log('Saved capitalized strings to capitalized_strings.txt:', uniqueCapitalized.length);
}

findDetails();
