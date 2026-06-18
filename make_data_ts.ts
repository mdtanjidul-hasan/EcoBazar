import * as fs from 'fs';

function makeDataTs() {
  const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  const blogs = JSON.parse(fs.readFileSync('blogs.json', 'utf8'));

  const tsContent = `import { Product, Blog } from './types';

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const INITIAL_BLOGS: Blog[] = ${JSON.stringify(blogs, null, 2)};
`;

  fs.writeFileSync('src/data.ts', tsContent);
  console.log('Saved src/data.ts successfully!');
}

makeDataTs();
