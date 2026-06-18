import * as fs from 'fs';

function analyzeJs() {
  const fileContent = fs.readFileSync('scraped_asset_._assets_index-cBHbePMW.js', 'utf8');
  console.log('JS length:', fileContent.length);

  // Lets search for strings inside the compiled JS.
  // Vite compiled react code has a lot of string literals.
  // We can extract all double-quoted and single-quoted or tick strings that are longer than 15 characters
  // and contain standard human-readable text.
  
  const regex = /"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`/g;
  const matches = fileContent.match(regex) || [];
  
  const readableStrings = matches
    .map(s => s.slice(1, -1)) // strip quotes
    .filter(s => {
      // should contain spaces and be human readable
      if (s.length < 10) return false;
      if (s.includes('http') && s.length < 30) return false;
      if (/^[a-zA-Z0-9_\-\/\.\s,!\?':\(\)]+$/.test(s)) {
        return s.trim().split(/\s+/).length >= 2;
      }
      return false;
    });

  const uniqueStrings = Array.from(new Set(readableStrings));
  
  fs.writeFileSync('extracted_strings.txt', uniqueStrings.join('\n'));
  console.log('Found', uniqueStrings.length, 'readable strings, written to extracted_strings.txt');
}

analyzeJs();
