import * as fs from 'fs';

function getCategories() {
  const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  const categories = {};
  const subCategories = {};
  
  for (const p of products) {
    categories[p.category] = (categories[p.category] || 0) + 1;
    subCategories[p.sub_category] = (subCategories[p.sub_category] || 0) + 1;
  }
  
  console.log('Categories:', categories);
  console.log('Sub categories:', subCategories);
}

getCategories();
