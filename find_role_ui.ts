import * as fs from 'fs';

function findRoleUI() {
  const fileContent = fs.readFileSync('scraped_asset_._assets_index-cBHbePMW.js', 'utf8');

  // Let's search around "Dashboard" menu items.
  const keyword = '/dashboard/users';
  const idx = fileContent.indexOf(keyword);
  if (idx !== -1) {
    console.log('--- Dashboard Menu items (index', idx, ') ---');
    console.log(fileContent.substring(Math.max(0, idx - 500), Math.min(fileContent.length, idx + 1500)));
  }
}

findRoleUI();
