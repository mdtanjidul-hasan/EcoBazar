import * as fs from 'fs';

function findEndpoints() {
  const fileContent = fs.readFileSync('scraped_asset_._assets_index-cBHbePMW.js', 'utf8');

  // Let's find any URLs or endpoint strings that mention "ecobazar-server"
  const regex = /https?:\/\/[a-zA-Z0-9.\-_/:]+/g;
  const urls = Array.from(new Set(fileContent.match(regex) || []));
  console.log('URLs found inside JS:', urls);

  // Let's also search for all references to the backend routes in the JS
  // For example, fetch('/...') or .get('/...') or axios.get('/...')
  // We can look at 200 characters around any instance of "ecobazar-server-rosy.vercel.app"
  let index = fileContent.indexOf('ecobazar-server');
  let count = 0;
  while (index !== -1 && count < 10) {
    console.log(`--- Server endpoint occurrence ${count} (index ${index}) ---`);
    console.log(fileContent.substring(Math.max(0, index - 200), Math.min(fileContent.length, index + 200)));
    index = fileContent.indexOf('ecobazar-server', index + 1);
    count++;
  }
}

findEndpoints();
