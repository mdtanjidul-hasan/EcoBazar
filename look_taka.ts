import * as fs from 'fs';

function findTaka() {
  const fileContent = fs.readFileSync('scraped_asset_._assets_index-cBHbePMW.js', 'utf8');

  // Let's find all occurrences of "৳" and print the context around it
  let index = fileContent.indexOf('৳');
  let count = 0;
  while (index !== -1 && count < 20) {
    console.log(`--- Occurrence ${count} (index ${index}) ---`);
    console.log(fileContent.substring(Math.max(0, index - 500), Math.min(fileContent.length, index + 500)));
    index = fileContent.indexOf('৳', index + 1);
    count++;
  }
}

findTaka();
