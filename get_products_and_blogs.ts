import * as fs from 'fs';

async function fetchAllData() {
  const server = 'https://ecobazar-server-rosy.vercel.app';
  const endpoints = ['/products', '/blogs', '/categories', '/reviews'];

  for (const endpoint of endpoints) {
    try {
      console.log('Fetching:', server + endpoint);
      const res = await fetch(server + endpoint);
      if (res.ok) {
        const data = await res.json();
        const filename = `${endpoint.replace('/', '')}.json`;
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`Saved ${filename} (count: ${Array.isArray(data) ? data.length : typeof data})`);
      } else {
        console.error(`Failed to fetch ${endpoint}: ${res.statusText}`);
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint}`, err);
    }
  }
}

fetchAllData();
