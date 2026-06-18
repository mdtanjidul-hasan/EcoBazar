import * as fs from 'fs';

function searchAuth() {
  const fileContent = fs.readFileSync('scraped_asset_._assets_index-cBHbePMW.js', 'utf8');

  // Let's search for "createUserWithEmailAndPassword" or "signInWithEmailAndPassword" or "/login" or "/signup"
  const authKeywords = [
    'createUserWithEmailAndPassword',
    'signInWithEmailAndPassword',
    'signInWithPopup',
    'GoogleAuthProvider',
    'onAuthStateChanged',
    'signOut',
    '/users'
  ];

  for (const keyword of authKeywords) {
    const idx = fileContent.indexOf(keyword);
    if (idx !== -1) {
      console.log(`--- Auth Keyword "${keyword}" (index ${idx}) ---`);
      console.log(fileContent.substring(Math.max(0, idx - 200), Math.min(fileContent.length, idx + 200)));
    } else {
      console.log(`Auth Keyword "${keyword}" NOT found.`);
    }
  }
}

searchAuth();
