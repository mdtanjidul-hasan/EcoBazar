import * as fs from 'fs';

function findRoutes() {
  const fileContent = fs.readFileSync('scraped_asset_._assets_index-cBHbePMW.js', 'utf8');

  // Find all paths of the form path:"/..."
  const routeRegex = /path:\s*"([^"]+)"/g;
  const paths = Array.from(new Set([...fileContent.matchAll(routeRegex)].map(m => m[1])));
  console.log('Paths with schema path:"...":', paths);

  const routeRegex2 = /path:\s*'([^']+)'/g;
  const paths2 = Array.from(new Set([...fileContent.matchAll(routeRegex2)].map(m => m[1])));
  console.log('Paths with schema path:\'...\' :', paths2);
}

findRoutes();
