import { Product, Blog } from '../types';

const petFeederImg = '/assets/images/pet_feeder_1782500704020.jpg';
const petBedImg = '/assets/images/pet_bed_1782500716368.jpg';
const massageGunImg = '/assets/images/massage_gun_1782501229411.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    "_id": "eb-premium-fan-collage",
    "title": "Premium Digital Rechargeable Mini Fan Collection (Panda & Capybara Edition)",
    "category": "Mini Fan",
    "sub_category": "Mini Hand Fan",
    "rating": 4.9,
    "price": 450,
    "currency": "BDT",
    "quantity": 150,
    "sell_number": 532,
    "description": "Stay cool and stylish this summer with our flagship Premium Rechargeable Mini Fan Collection. Features adorable animal-themed designs including a classic Panda and a charming Capybara set, with select premium models sporting an intelligent LED digital percentage display. Built with reliable multi-speed quiet motors, comfortable handles, lanyards, and USB rechargeable batteries. Extremely lightweight and durable, it's the perfect cooling accessory for students, commuters, and outdoor adventurers.",
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product/main/WhatsApp%20Image%202026-06-21%20at%206.33.07%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product/main/WhatsApp%20Image%202026-06-21%20at%206.33.07%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product/main/WhatsApp%20Image%202026-06-21%20at%206.33.08%20PM.jpeg"
    ],
    "colors": [
      "Classic Panda",
      "Sweet Pink Bear",
      "Warm Capybara",
      "Floral Sunset"
    ]
  },
  {
    "_id": "eb-premium-catchy-ornaments",
    "title": "Catchy Ornaments Premium Fashion Jewelry & Aesthetic Hair Accessories Set",
    "category": "Jewelry Set",
    "sub_category": "Jewelry Set",
    "rating": 4.8,
    "price": 380,
    "currency": "BDT",
    "quantity": 120,
    "sell_number": 412,
    "description": "Dazzle and define your daily style with the exquisite 'Catchy Ornaments' Collection. This stunning luxury set includes handcrafted ethnic silver-oxidized Jhumka dangling earrings embellished with red rhinestone gemstones, double-stranded elegant pearl necklaces, dainty silver rings, and a series of high-quality aesthetic pastel hair claw clips (such as tulip-shaped claws and heart grips). Universally lightweight, skin-friendly, and perfect for mixing and matching with traditional celebratory outfits or trendy casual looks.",
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product/main/WhatsApp%20Image%202026-06-21%20at%206.33.08%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product/main/WhatsApp%20Image%202026-06-21%20at%206.33.08%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product/main/WhatsApp%20Image%202026-06-21%20at%206.33.09%20PM.jpeg"
    ],
    "colors": [
      "Pastel Tulip",
      "Rich Crimson Red",
      "Pearl White",
      "Silver Sparkle"
    ]
  },
  {
    "_id": "6a099b6f6cf6409285fb55f4",
    "title": "Earring's Point 3-in-1 Combo Set – Pearl, Crystal & Butterfly Drop",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.3,
    "price": 100,
    "currency": "BDT",
    "quantity": 50,
    "sell_number": 128,
    "gallery": [
      "https://i.ibb.co/0RS6Bnr4/image-113.jpg",
      "https://i.ibb.co/8LfG0g0Q/IMG-20260513-075535.jpg",
      "https://i.ibb.co/zTN6dC37/IMG-20260513-075654.jpg"
    ],
    "description": "An elegant 3-pair earring combo set by Earring's Point. Includes white pearl studs, sparkling crystal diamond studs, and a stunning emerald green butterfly drop earring with silver-tone rhinestone detailing. Perfect for everyday wear, parties, or gifting. Lightweight and skin-friendly.",
    "dan": "dan"
  },
  {
    "_id": "6a09b29cac63c8fd444e3c41",
    "title": "Gold-Tone Multicolor Crystal Flower Drop Earrings with Red Zircon Center",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.5,
    "price": 100,
    "currency": "BDT",
    "quantity": 55,
    "sell_number": 176,
    "gallery": [
      "https://i.ibb.co/nM1CCK18/image-67.jpg",
      "https://i.ibb.co/s9f3275W/IMG-20260513-112411.jpg",
      "https://i.ibb.co/mrWPhHcg/IMG-20260513-112511.jpg"
    ],
    "description": "An eye-catching pair of gold-tone drop earrings featuring a sparkling red round zircon stone at the center, surrounded by marquise-cut multicolor crystals in pink, blue, green, and lavender arranged in a blooming flower pattern. The top has a gold push-pin stud with a small crystal. Filigree gold butterfly wings accent the sides for an elegant finish. Perfect for parties, weddings, and festive occasions. Hypoallergenic pin, lightweight and comfortable.",
    "dan": "dan"
  },
  {
    "_id": "6a09d5eaf92784ef15e3172a",
    "title": "Multicolor Enamel Leaf Stack Jhumka Earrings with Gold Bead Dome",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.6,
    "price": 100,
    "currency": "BDT",
    "quantity": 70,
    "sell_number": 198,
    "gallery": [
      "https://i.ibb.co/84RFyBYm/image-69.jpg",
      "https://i.ibb.co/vxGbhTkv/Chat-GPT-Image-May-6-2026-08-50-38-AM.png",
      "https://i.ibb.co/fzvBKHrm/Whats-App-Image-2026-04-27-at-7-28-59-PM.jpg"
    ],
    "description": "A vibrant and eye-catching pair of handcrafted jhumka earrings featuring a stacked leaf stem design in four enamel colors — yellow, teal, pink, and purple — with gold bead detailing on each leaf. The bottom dome-shaped jhumka bell is finished in multicolor enamel stripes with a row of gold beads at the rim. Perfect for festive occasions, Eid, Puja, weddings, and ethnic fashion lovers. Lightweight, colorful, and uniquely artistic.",
    "dan": "dan"
  },
  {
    "_id": "6a09da0df92784ef15e3172c",
    "title": "Oxidised Silver Jhumka Hoop Earrings with Multicolor Beads",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.5,
    "price": 80,
    "currency": "BDT",
    "quantity": 75,
    "sell_number": 214,
    "gallery": [
      "https://i.ibb.co/BVCTyPWG/image-60.jpg",
      "https://i.ibb.co/GQ2yKWZd/IMG-20260513-113639.jpg",
      "https://i.ibb.co/dJgL7BRc/IMG-20260513-113711.jpg",
      "https://i.ibb.co/qM4Nw7vh/IMG-20260513-113658.jpg"
    ],
    "description": "A stunning pair of traditional oxidised silver jhumka earrings with a circular hoop design. Featuring a layered bell-shaped jhumka base adorned with silver beaded detailing, topped with vibrant multicolor beads in pink, peach, blue, green, and red. Perfect for ethnic wear, festive occasions, and traditional celebrations. Lightweight and comfortable for all-day wear.",
    "dan": "dan"
  },
  {
    "_id": "6a09defbbbb76c6641eefb13",
    "title": "Rose Gold Triple Heart Drop Earrings with Leopard Print Faux Fur",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.4,
    "price": 100,
    "currency": "BDT",
    "quantity": 45,
    "sell_number": 132,
    "gallery": [
      "https://i.ibb.co/79CBt6P/image-70.jpg",
      "https://i.ibb.co/mrhxwHGD/IMG-20260513-082857.jpg",
      "https://i.ibb.co/fYbpg2Xv/IMG-20260513-082834.jpg",
      "https://i.ibb.co/sdfbdS75/IMG-20260513-082930.jpg"
    ],
    "description": "A bold and trendy pair of rose gold drop earrings featuring a triple heart design. The small leopard print faux fur heart stud sits at the top, followed by an open rose gold hollow heart frame in the middle, and a large leopard print faux fur filled heart at the bottom. The wild animal print paired with shiny rose gold metal creates a perfect fashion-forward statement. Ideal for casual outings, parties, and bold fashion lovers. Push-back closure, lightweight and comfortable."
  },
  {
    "_id": "6a09e193bbb76c6641eefb15",
    "title": "Vibrant Gold-Toned Pink & Orange Flower Enamel Stud Drop Earrings",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.7,
    "price": 350,
    "currency": "BDT",
    "quantity": 60,
    "sell_number": 221,
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.34%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.34%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.35%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.35%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.36%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.36%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.36%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.37%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.37%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.38%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.38%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.39%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.39%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.39%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.40%20PM.jpeg"
    ],
    "description": "A gorgeous pair of vibrant gold-toned stud drop earrings featuring detailed enamel work. Each earring showcases two blooming flowers in shades of pink and orange, with sparkling crystal centers and green leaves. Embellished with a dangling light purple bead drop at the bottom. Push-back closure, lightweight, skin-friendly."
  },
  {
    "_id": "6a09e612bbb76c6641eefb17",
    "title": "Oxidised Silver Jhumka Earrings with Black Stone & Black Bead Fringe",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.6,
    "price": 460,
    "currency": "BDT",
    "quantity": 55,
    "sell_number": 189,
    "gallery": [
      "https://i.ibb.co/k28vc7zm/image-74.jpg",
      "https://i.ibb.co/RGxjGX33/IMG-20260513-100032.jpg"
    ],
    "description": "A striking pair of oxidised silver jhumka earrings with a bold black colour theme. Features a square black gemstone stud top with sunburst and floral scroll detailing, an ornate peacock-inspired connector with black rhinestones, a dome-shaped jhumka bell with black enamel leaf motifs and circular black stone border, and a row of glossy black bead fringe at the bottom. Perfect for ethnic wear, bridal occasions, Eid, and festive events. Hypoallergenic and lightweight."
  },
  {
    "_id": "6a09eb27a9d6cf6144aefe54",
    "title": "Silver-Tone Pearl & Crystal Stud Earrings with Butterfly & Black Teardrop Drop",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.6,
    "price": 100,
    "currency": "BDT",
    "quantity": 50,
    "sell_number": 167,
    "gallery": [
      "https://i.ibb.co/8QDGNCh/image-78.jpg",
      "https://i.ibb.co/Lhg4JRVZ/IMG-20260513-081747.jpg",
      "https://i.ibb.co/B5Ym8V0y/IMG-20260513-081918.jpg"
    ],
    "description": "A sophisticated 2-in-1 earring set featuring a white pearl stud and a crystal rhinestone stud at the top. Below hangs a sparkling silver-tone butterfly charm encrusted with round crystals, leading to a large faceted black teardrop gemstone drop. The contrast of white pearl, clear crystal, and deep black creates a classic elegant look. Perfect for formal events, weddings, office wear, and evening outings. Push-back closure, hypoallergenic and lightweight."
  },
  {
    "_id": "6a09ece0a9d6cf6144aefe56",
    "title": "Oxidised Silver Butterfly Stud Jhumka Earrings with Silver Ball Fringe",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.7,
    "price": 100,
    "currency": "BDT",
    "quantity": 65,
    "sell_number": 241,
    "gallery": [
      "https://i.ibb.co/x8PPbFXR/image-96.jpg",
      "https://i.ibb.co/bM5MqVDz/IMG-20260513-114039.jpg",
      "https://i.ibb.co/Q3ht4Fqz/IMG-20260513-114153.jpg"
    ],
    "description": "A bold and intricately crafted pair of oxidised silver earrings featuring a large butterfly stud top with detailed dot-textured wings. Below hangs a dome-shaped jhumka bell covered in layered rope-twist and silver bead filigree work. The bottom rim is lined with hanging silver chain links each ending in a round silver ghungroo ball. A stunning ethnic design perfect for saree, lehenga, salwar, Eid, weddings, and festive occasions. Lightweight and hypoallergenic."
  },
  {
    "_id": "6a09f1833018a977c5816c2d",
    "title": "Gold-Tone Dark Navy Rose Enamel Drop Earrings with Moonstone Bead & Ivy Leaf",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.8,
    "price": 100,
    "currency": "BDT",
    "quantity": 45,
    "sell_number": 193,
    "gallery": [
      "https://i.ibb.co/j9s9sTNc/image-103.jpg",
      "https://i.ibb.co/tT7mDjSW/IMG-20260513-093847.jpg",
      "https://i.ibb.co/8LV5RGKv/IMG-20260513-093855.jpg"
    ],
    "description": "A luxurious and dramatic pair of gold-tone drop earrings featuring a large dark navy blue enamel rose with a sparkling round crystal center. Accented by a green enamel leaf, a white mother-of-pearl maple leaf charm, a grey carved ivy butterfly leaf, and a small crystal solitaire. Below hangs a cluster of three glowing light blue moonstone glass bead drops on gold chain links. Perfect for evening events, weddings, cocktail parties, and luxury gifting. Push-back closure, lightweight and skin-friendly."
  },
  {
    "_id": "6a09f2d03018a977c5816c2f",
    "title": "Chic Silver-Toned Dangle Earrings with Blue Teardrops & Crystal Studs (LITTLE ZIYU)",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.7,
    "price": 650,
    "currency": "BDT",
    "quantity": 60,
    "sell_number": 215,
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.21%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.21%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.22%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.22%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.22%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.23%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.23%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.24%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.24%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.24%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.25%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.25%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.26%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.26%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.27%20PM%20%281%29.jpeg"
    ],
    "description": "A gorgeous pair of silver-toned dangle earrings featuring faceted blue teardrop glass crystals suspended from sparkling clear crystal-encrusted leaf motifs, accompanied by matching pairs of round clear silver studs and premium white pearl studs. Lightweight, comfortable, and highly versatile under the luxury LITTLE ZIYU brand."
  },
  {
    "_id": "6a09f3c53018a977c5816c31",
    "title": "Silver-Tone 3-in-1 Earring Set – Black Onyx Butterfly Drop, CZ & Pearl Studs",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.7,
    "price": 100,
    "currency": "BDT",
    "quantity": 65,
    "sell_number": 229,
    "gallery": [
      "https://i.ibb.co/4ww2wg8z/image-239.jpg",
      "https://i.ibb.co/B5Ym8V0y/IMG-20260513-081918.jpg",
      "https://i.ibb.co/nMLYGQzD/IMG-20260513-081729.jpg"
    ],
    "description": "A versatile and elegant 3-pair silver-tone earring combo set. Includes: (1) A stunning drop earring with a round clear CZ stud top, a crystal-pave butterfly connector, and a large faceted black onyx teardrop gemstone drop. (2) A pair of classic white pearl stud earrings. (3) A pair of sparkling round CZ solitaire stud earrings. All three pairs feature a polished silver-tone finish. Perfect for weddings, formal events, office wear, Eid, and everyday elegance. Hypoallergenic, lightweight and comfortable."
  },
  {
    "_id": "6a09f61379acb4d4ab3ca67d",
    "title": "Silver-Tone 3-in-1 Earring Set – Pink Crystal Butterfly Drop, CZ & Pearl Studs",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.7,
    "price": 100,
    "currency": "BDT",
    "quantity": 70,
    "sell_number": 243,
    "gallery": [
      "https://i.ibb.co/6c0cjbby/image-137.jpg",
      "https://i.ibb.co/NdrzzBSt/Whats-App-Image-2026-04-27-at-7-28-37-PM-1.jpg",
      "https://i.ibb.co/MkHkDj8P/Whats-App-Image-2026-04-27-at-7-28-38-PM.jpg"
    ],
    "description": "A charming and feminine 3-pair silver-tone earring combo set. Includes: (1) A gorgeous drop earring with a sparkling round CZ stud top and a large pink marquise-cut crystal butterfly charm with rhinestone-pave body and antenna detailing. (2) A pair of classic white pearl stud earrings. (3) A pair of round CZ solitaire stud earrings. All three pairs feature a sleek silver-tone finish. Perfect for parties, weddings, Eid, Valentine's Day, and gifting. Hypoallergenic, lightweight, and comfortable."
  },
  {
    "_id": "6a09f7a979acb4d4ab3ca67f",
    "title": "Gold-Tone LOVE Coin Red Enamel Daisy Drop Earrings with Pearl Center",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.8,
    "price": 420,
    "currency": "BDT",
    "quantity": 60,
    "sell_number": 234,
    "gallery": [
      "https://i.ibb.co/dsTzyCTg/image-143.jpg",
      "https://i.ibb.co/bgqVzbfy/IMG-20260513-111949.jpg",
      "https://i.ibb.co/dJbC1m5t/IMG-20260513-112002.jpg",
      "https://i.ibb.co/ksNhjZzj/IMG-20260513-112039.jpg"
    ],
    "description": "A bold and romantic pair of gold-tone drop earrings featuring a round engraved 'LOVE' coin stud at the top, connected to a large red enamel daisy flower with eight petals and a large white pearl at the center. The gold-tone metal outline adds a luxurious finish to the vibrant red enamel. Perfect for Valentine's Day, anniversaries, parties, Eid, and gifting to loved ones. Push-back closure, lightweight and skin-friendly."
  },
  {
    "_id": "6a09f94279acb4d4ab3ca681",
    "title": "Gold-Tone Blue Sapphire Crystal Butterfly Long Tassel Drop Earrings with CZ Chain",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.8,
    "price": 100,
    "currency": "BDT",
    "quantity": 45,
    "sell_number": 187,
    "gallery": [
      "https://i.ibb.co/Kpd6mp5x/image-141.jpg",
      "https://i.ibb.co/Txm3dCKZ/IMG-20260513-094546.jpg",
      "https://i.ibb.co/HTLMWXKG/IMG-20260513-094236.jpg"
    ],
    "description": "A glamorous and eye-catching pair of gold-tone long tassel earrings. Features a sparkling round CZ stud at the top, followed by two long rhinestone-encrusted tennis chains, with a large faceted deep blue sapphire crystal butterfly set in gold prongs at the midpoint. The chains continue below the butterfly creating an elegant long drop effect. Perfect for parties, weddings, proms, red carpet events, and Eid. Push-back closure, lightweight and comfortable for all-day wear."
  },
  {
    "_id": "6a0a05d7ad8f71e878505f61",
    "title": "Oxidised Silver Sunflower Jhumka Earrings with Aurora Borealis Crystal Dome & Charm Fringe",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.7,
    "price": 100,
    "currency": "BDT",
    "quantity": 55,
    "sell_number": 178,
    "gallery": [
      "https://i.ibb.co/LDRXfF7k/image-149.jpg",
      "https://i.ibb.co/HfPfgYC1/IMG-20260513-113738.jpg",
      "https://i.ibb.co/TBY8TGNV/IMG-20260513-113942.jpg",
      "https://i.ibb.co/HfPfgYC1/IMG-20260513-113738.jpg"
    ],
    "description": "A dazzling pair of oxidised silver jhumka earrings with a unique aurora borealis (AB) crystal theme. Features an intricate sunflower stud top embedded with iridescent AB rhinestones that shimmer in rainbow hues. Below hangs a dome-shaped jhumka bell fully studded with rows of sparkling AB crystals, finished with an ornate scrollwork rim. Silver chain links hang from the rim, each ending in a faceted silver geometric charm drop. Perfect for festive occasions, bridal wear, Eid, weddings, and ethnic styling. Lightweight and hypoallergenic."
  },
  {
    "_id": "6a0ad5582ef32949dd7a4c2e",
    "title": "Gold-Tone Dark Purple Pearl Stud Drop Earrings with Galaxy Glitter Clover & White Pearl Center",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.8,
    "price": 80,
    "currency": "BDT",
    "quantity": 50,
    "sell_number": 163,
    "gallery": [
      "https://i.ibb.co/BKTWQtnN/image-156.jpg",
      "https://i.ibb.co/j9kz9djs/IMG-20260513-113258.jpg",
      "https://i.ibb.co/KjXxj5js/IMG-20260513-113232.jpg",
      "https://i.ibb.co/Hf4WmFFj/IMG-20260513-113157.jpg"
    ],
    "description": "A unique and luxurious pair of gold-tone drop earrings featuring a large dark purple-black lustrous pearl stud at the top, connected via gold ring links to a four-leaf clover shaped charm. The clover charm is filled with a stunning galaxy-style glitter enamel in turquoise and hot pink gradient with an iridescent shimmer effect, and a small white pearl at the center. The gold bezel frame adds a premium finish. Perfect for evening events, parties, Eid, weddings, and luxury gifting. Push-back closure, lightweight and skin-friendly."
  },
  {
    "_id": "6a0ad7142ef32949dd7a4c30",
    "title": "Oxidised Silver Triple Hoop Chandelier Earrings with Aurora Borealis Crystals & Tassel Drop",
    "category": "Earrings",
    "sub_category": "Earrings",
    "rating": 4.7,
    "price": 100,
    "currency": "BDT",
    "quantity": 50,
    "sell_number": 191,
    "gallery": [
      "https://i.ibb.co/BHxVNWPJ/image-160.jpg",
      "https://i.ibb.co/wFsXg0yc/Whats-App-Image-2026-04-27-at-7-29-00-PM-1.jpg",
      "https://i.ibb.co/F4K7PRcQ/IMG-20260513-114748.jpg",
      "https://i.ibb.co/svRDJk43/IMG-20260513-114808.jpg"
    ],
    "description": "A bold and glamorous pair of oxidised silver chandelier earrings. Features a round floral stud top embedded with iridescent aurora borealis (AB) rhinestones that shimmer in multicolor rainbow hues. Below hangs a striking triple concentric hoop frame — the inner two hoops are lined with AB crystal stones along the bottom arc, creating a cascading rainbow sparkle effect. A decorative silver tassel drop hangs at the bottom for added elegance. Perfect for parties, Eid, weddings, festive events, and bold ethnic fashion. Lightweight and hypoallergenic."
  },
  {
    "_id": "6a0ad9712ef32949dd7a4c32",
    "title": "Elegant Silver-Toned Pink Heart Necklace, Earrings & Ring Set",
    "category": "Jewelry Set",
    "sub_category": "Jewelry Set",
    "rating": 4.8,
    "price": 750,
    "currency": "BDT",
    "quantity": 40,
    "sell_number": 176,
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.14%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.15%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.15%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.16%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.16%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.16%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.17%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.17%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.18%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.18%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.19%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.19%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.19%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.20%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.20%20PM.jpeg"
    ],
    "description": "Elevate your style with our stunning Elegant Pink Heart Gemstone Jewelry Set, designed to add a touch of romance and sparkle to any occasion. This exquisite 4-piece collection includes a delicate necklace with a pink heart gemstone pendant, a pair of matching pink heart stud earrings, and two beautifully crafted silver-toned rings. Made with hypoallergenic and skin-friendly materials."
  },
  {
    "_id": "6a0ae47eff128b825f78e7d4",
    "title": "Silver-Tone Emerald Green Crystal Butterfly Jewelry Set – Earrings & Necklace Pendant",
    "category": "Jewelry Set",
    "sub_category": "Jewelry Set",
    "rating": 4.8,
    "price": 200,
    "currency": "BDT",
    "quantity": 45,
    "sell_number": 182,
    "gallery": [
      "https://i.ibb.co/Kjmn4HBx/Whats-App-Image-2026-04-27-at-7-28-35-PM-1.jpg",
      "https://i.ibb.co/wFjNxNSX/Whats-App-Image-2026-04-27-at-7-28-32-PM-1.jpg",
      "https://i.ibb.co/gbWgZXNM/IMG-20260513-102100.jpg",
      "https://i.ibb.co/Wpkt0V1t/IMG-20260513-101652.jpg"
    ],
    "description": "A stunning matching 3-piece silver-tone jewelry set featuring an emerald green crystal butterfly design. Includes: (1) A pair of drop earrings with a butterfly charm made of faceted emerald green marquise-cut crystals, clear CZ rhinestone arc detailing, and silver antenna tassels — with butterfly-shaped push-back clasps. (2) A matching butterfly pendant necklace on a delicate silver rolo chain with the same emerald and CZ butterfly design. Perfect for weddings, Eid, parties, and luxury gifting. Hypoallergenic, lightweight and elegant."
  },
  {
    "_id": "6a0af067e763ec02e88d05bd",
    "title": "Silver-Tone Blue Sapphire Heart Crystal Jewelry Set – Double Heart Pendant Necklace & Drop Earrings",
    "category": "Jewelry Set",
    "sub_category": "Jewelry Set",
    "rating": 4.9,
    "price": 200,
    "currency": "BDT",
    "quantity": 40,
    "sell_number": 219,
    "gallery": [
      "https://i.ibb.co/FbcP3VTy/Whats-App-Image-2026-04-27-at-7-28-35-PM-2.jpg",
      "https://i.ibb.co/Cp5wjrhs/Jewelry-Set.jpg",
      "https://i.ibb.co/zTnJTZD1/Jewelry.jpg",
      "https://i.ibb.co/5hNH22Pw/Jewelry-Set.jpg"
    ],
    "description": "A breathtaking 3-piece silver-tone jewelry set featuring a deep blue sapphire heart crystal design. Includes: (1) A large faceted deep blue heart crystal pendant with a CZ-pave open heart frame overlay on a delicate silver rolo chain. (2) A matching pair of drop earrings with round CZ stud tops and large deep blue heart crystal drops with silver claw setting. All pieces feature a polished silver-tone finish with brilliant light reflection. Perfect for weddings, Eid, Valentine's Day, anniversaries, formal events, and luxury gifting. Hypoallergenic, premium quality and lightweight."
  },
  {
    "_id": "6a0af3d4e763ec02e88d05bf",
    "title": "Silver-Tone Pink Glowing Butterfly Heart Jewelry Set – CZ Heart Pendant Necklace & Drop Earrings",
    "category": "Jewelry Set",
    "sub_category": "Jewelry Set",
    "rating": 4.9,
    "price": 220,
    "currency": "BDT",
    "quantity": 45,
    "sell_number": 231,
    "gallery": [
      "https://i.ibb.co/6c6V8m1G/Necklace-Set-Girls-Fashion-Gift-Idea-Catchy-Ornaments-Stylish-Look-BDShop-Jewellery-BD.jpg",
      "https://i.ibb.co/hxsnXKnM/Silver-Tone-Pink-Glowing-Butterfly-Heart-Jewelry-Set.jpg",
      "https://i.ibb.co/wFN0z76t/Silver-Tone-Pink-Glowing-Butterfly-Heart-Jewelry.jpg",
      "https://i.ibb.co/qMwzkTcT/Silver-Tone-Pink-Glowing-Butterfly-Heart-Jewelry-Set.jpg"
    ],
    "description": "A dreamy and romantic 3-piece silver-tone jewelry set featuring a glowing pink butterfly inside an open heart frame. Includes: (1) A heart-shaped pendant necklace with a vivid pink glowing butterfly illustration on a pink gradient background, bordered by a silver open heart frame with CZ rhinestone diagonal sweep, on a delicate silver rolo chain. (2) A matching pair of drop earrings with the same glowing pink butterfly heart design and crown-style stud top. A perfect gift for Valentine's Day, birthdays, Eid, and girls who love butterflies and romantic fashion. Lightweight and skin-friendly."
  },
  {
    "_id": "6a0b3f2f48b7f7a9e6978195",
    "title": "Luxury Black Crystal Butterfly Jewelry Set",
    "category": "Jewelry Set",
    "rating": 4.9,
    "price": 200,
    "quantity": 42,
    "sellNumber": 318,
    "description": "Elegant butterfly-inspired jewelry set featuring a premium silver-tone necklace and matching earrings decorated with sparkling black crystal stones and zircon detailing. Perfect for weddings, parties, anniversaries, birthdays, and modern fashion styling. Lightweight, durable, and comfortable for everyday wear.",
    "gallery": [
      "https://i.ibb.co/tM8qX2xS/Whats-App-Image-2026-04-27-at-7-28-34-PM.jpg",
      "https://i.ibb.co/mC64G8M4/Whats-App-Image-2026-04-27-at-7-28-32-PM-2.jpg"
    ],
    "sub_category": "Jewelry Set"
  },
  {
    "_id": "6a0b407f48b7f7a9e6978197",
    "title": "Luxury Multicolor Emerald Drop Layered Necklace Set",
    "category": "Jewelry Set",
    "sub_category": "Jewelry Set",
    "rating": 4.8,
    "price": 2499,
    "quantity": 35,
    "sell_number": 128,
    "description": "Elegant luxury layered necklace set featuring gold-tone chain detailing with multicolor oval stones in green, white, and ruby pink shades. The necklace includes stunning emerald-style teardrop pendants surrounded by crystal accents, perfect for weddings, parties, and traditional occasions.",
    "gallery": [
      "https://i.ibb.co/prktR9np/2.jpg",
      "https://i.ibb.co/8448wqwM/image-164.jpg",
      "https://i.ibb.co/WWWb23WL/IMG-20260513-091831.jpg",
      "https://i.ibb.co/YTpwjXVb/IMG-20260513-092349.jpg"
    ]
  },
  {
    "_id": "6a0b45e948b7f7a9e6978199",
    "title": "Elegant Gold Rose Jewelry Set",
    "category": "Jewelry Set",
    "sub_category": "Jewelry Set",
    "rating": 4.9,
    "price": 200,
    "quantity": 42,
    "sell_number": 215,
    "description": "Beautiful gold-plated jewelry set featuring a floral rose-inspired design with pink enamel detailing and sparkling crystal stones. This premium set includes a necklace, earrings, bracelet, and solitaire-style ring, perfect for weddings, parties, gifting, and traditional occasions.",
    "gallery": [
      "https://i.ibb.co/Z6qRN61N/image-35.jpg",
      "https://i.ibb.co/0vZp3dS/IMG-20260513-110503.jpg",
      "https://i.ibb.co/QvNS14Sr/IMG-20260513-110526.jpg",
      "https://i.ibb.co/sdwV1rwt/IMG-20260513-110457.jpg"
    ]
  },
  {
    "_id": "6a0b476848b7f7a9e697819b",
    "title": "Cute Kitty Crystal Jewelry Set",
    "category": "Kids Jewelry Sets",
    "sub_category": "Kids Jewelry Set",
    "rating": 4.8,
    "price": 1650,
    "quantity": 58,
    "sell_number": 342,
    "description": "Adorable gold-plated kitty-themed jewelry set featuring sparkling pink crystal heart detailing with elegant charm design. This stylish set includes a necklace, earrings, bracelet, and ring, making it perfect for girls, birthday gifts, casual fashion, and special occasions.",
    "gallery": [
      "https://i.ibb.co/vx3wrgb0/image-37.jpg",
      "https://i.ibb.co/7tBzmq8D/IMG-20260513-105450.jpg",
      "https://i.ibb.co/G372k3yt/IMG-20260513-105631.jpg",
      "https://i.ibb.co/1GfK7Hk3/IMG-20260513-105705.jpg"
    ]
  },
  {
    "_id": "6a0b4a1d48b7f7a9e697819d",
    "title": "Charming Gold-Toned Pearl Chain Necklace with Pink Strawberry/Star Charm",
    "category": "Kids Jewelry Sets",
    "sub_category": "Kids Jewelry Set",
    "rating": 4.8,
    "price": 450,
    "quantity": 120,
    "sell_number": 865,
    "description": "A delightful gold-toned necklace featuring a delicate chain of small white pearls, adorned with a lovely pink enamel star/strawberry charm. Perfect for school-age girls and toddlers who love sweet fashion accessories. High quality, hypoallergenic structure, comfortable for daily wear.",
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.27%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.27%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.28%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.28%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.29%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.29%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.30%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.30%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.31%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.31%20PM%20%282%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.31%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.32%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.32%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.33%20PM%20%281%29.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Upload/main/WhatsApp%20Image%202026-06-21%20at%206.35.33%20PM.jpeg"
    ]
  },
  {
    "_id": "6a0b4e4548b7f7a9e697819f",
    "title": "Leopard Heart Beaded Layered Necklace Set",
    "category": "Kids Jewelry Sets",
    "sub_category": "Kids Jewelry Set",
    "rating": 4.7,
    "price": 44.5,
    "quantity": 85,
    "sell_number": 542,
    "description": "Stylish layered necklace featuring a gold-tone chain, colorful handmade beads, natural stone accents, and a sparkling leopard-print heart pendant. Includes matching crystal stud earrings for a trendy and elegant fashion look.",
    "gallery": [
      "https://i.ibb.co/wh2564Zk/grok-image-1778761323972.jpg",
      "https://i.ibb.co/dw2G4583/image-138.jpg",
      "https://i.ibb.co/SDn1r43G/IMG-20260513-103238.jpg"
    ]
  },
  {
    "_id": "6a0b509c48b7f7a9e69781a1",
    "title": "Blue Butterfly Layered Pearl Necklace Set",
    "category": "Kids Jewelry Sets",
    "sub_category": "Kids Jewelry Set",
    "rating": 4.9,
    "price": 49.99,
    "quantity": 140,
    "sell_number": 1124,
    "description": "Beautiful layered jewelry set featuring gold-tone chains, pearl detailing, a blue butterfly crystal pendant, clover charm, colorful bead accents, and matching stud earrings. A trendy and elegant accessory perfect for casual wear, parties, and special occasions.",
    "gallery": [
      "https://i.ibb.co/nMwqkVcC/image-34.jpg",
      "https://i.ibb.co/v7HzRnD/Whats-App-Image-2026-05-09-at-7-50-06-PM.jpg",
      "https://i.ibb.co/zhSzfCfZ/695138991-122102094579288832-2148515787585029414-n.jpg"
    ]
  },
  {
    "_id": "6a0b53c048b7f7a9e69781a3",
    "title": "Elegant Butterfly Jewelry Set for Women",
    "category": "Kids Jewelry Sets",
    "sub_category": "Kids Jewelry Set",
    "rating": 4.7,
    "price": 1299,
    "quantity": 48,
    "sell_number": 215,
    "description": "Beautiful butterfly themed jewelry set including a necklace, earrings, ring, and bracelet. Crafted with gold-tone alloy and crystal stone detailing, perfect for parties, casual wear, gifts, and special occasions.",
    "gallery": [
      "https://i.ibb.co/b5H7Htpt/IMG-20260513-104623.jpg",
      "https://i.ibb.co/vFmjf1S/IMG-20260513-104823.jpg",
      "https://i.ibb.co/Ng4YRjZs/IMG-20260513-104834.jpg"
    ]
  },
  {
    "_id": "6a0b552348b7f7a9e69781a5",
    "title": "Cute Cartoon Mouse Jewelry Set for Girls",
    "category": "Kids Jewelry Sets",
    "sub_category": "Kids Jewelry Set",
    "rating": 4.8,
    "price": 1490,
    "quantity": 72,
    "sell_number": 356,
    "description": "Stylish cartoon-themed jewelry set featuring a necklace, earrings, ring, and bracelet with sparkling crystal details. Designed for girls and kids who love cute fashion accessories. Perfect for birthday gifts, parties, casual wear, and special occasions.",
    "gallery": [
      "https://i.ibb.co/VYzmZz9t/IMG-20260513-105034.jpg",
      "https://i.ibb.co/9dzRqmj/IMG-20260513-105146.jpg",
      "https://i.ibb.co/Zp7TC3gJ/IMG-20260513-105227.jpg"
    ]
  },
  {
    "_id": "6a0bf4b4b9eed1781844b9a5",
    "title": "Mini Pet Handheld Fan – Cute Capybara Edition USB Rechargeable with Stand Base",
    "category": "Mini Fan",
    "sub_category": "Mini Hand Fan",
    "rating": 4.6,
    "price": 380,
    "currency": "BDT",
    "quantity": 75,
    "sell_number": 284,
    "colors": [
      "Beige-Capybara",
      "Pink-Panda"
    ],
    "gallery": [
      "https://i.ibb.co/7NSNv79v/162a5618-70d7-4812-bc67-fa0fa29ba3ca.jpg",
      "https://i.ibb.co/xqNSTZBR/49107a29-324a-4b12-ae54-2cedd10d00c1.jpg",
      "https://i.ibb.co/ZRLzJ56D/IMG-20260513-122848.jpg",
      "https://i.ibb.co/wZyHL4Vv/IMG-20260513-122736.jpg"
    ],
    "description": "An adorable Mini Pet Handheld Fan featuring a cute Capybara cartoon print on the handle. Comes in Beige-Capybara and Pink-Panda editions. Features a large circular fan head with a smooth ball center, a slim foldable handle with a power button, and a detachable stand base for desktop use. USB rechargeable with built-in battery. Whisper-quiet motor with multiple speed settings. Perfect for students, travel, outdoor use, gifting, and summer cooling. Comes in a clean white branded box."
  },
  {
    "_id": "6a0bf7c7b9eed1781844b9a7",
    "title": "Mini Handheld Fan with Stand Base – USB Rechargeable 3-Speed Portable Desk Fan",
    "category": "Mini Fan",
    "sub_category": "Portable Fans",
    "rating": 4.6,
    "price": 420,
    "currency": "BDT",
    "quantity": 90,
    "sell_number": 356,
    "colors": [
      "Navy Blue",
      "White",
      "Pink"
    ],
    "gallery": [
      "https://i.ibb.co/YTVQ7Tpv/Chat-GPT-Image-May-16-2026-07-31-26-PM.png",
      "https://i.ibb.co/nNM3jRWW/d2a3bebc17dfa869e9de049bbc90ce45.jpg",
      "https://i.ibb.co/QjkHrxHn/IMG-20260513-123419.jpg",
      "https://i.ibb.co/27rjDryb/IMG-20260513-123414.jpg"
    ],
    "description": "A stylish and compact Mini Handheld Fan available in 3 elegant colors — Navy Blue, White, and Pink. Features a large circular fan head with a gold-accent center button, a slim rectangular body with a lanyard loop for easy carrying, and a detachable curved stand base for desktop use. USB rechargeable with 3-speed settings and whisper-quiet motor. Use it handheld, on a desk, or hang it around your neck. Perfect for students, office workers, travel, outdoor events, and hot summer days. Lightweight, durable and portable."
  },
  {
    "_id": "6a0bf9adb9eed1781844b9a9",
    "title": "Cute Bunny Ear Mini Handheld Fan – USB Rechargeable with Rose Gold Accents & Stand Base",
    "category": "Mini Fan",
    "sub_category": "Mini Hand Fan",
    "rating": 4.7,
    "price": 450,
    "currency": "BDT",
    "quantity": 80,
    "sell_number": 298,
    "colors": [
      "Sky Blue",
      "Mauve-Beige"
    ],
    "gallery": [
      "https://i.ibb.co/HL16Fj9H/7fb6baef2ca69df8cdc9f6a4707edd1f.jpg",
      "https://i.ibb.co/BHhM9hZ6/54bd4b6b2607b972874350df9c0a76a7.jpg",
      "https://i.ibb.co/VYv1ZGTs/802633aa85709dba5de3890229e36be1.jpg",
      "https://i.ibb.co/mFNp9CF7/ca94489ba4f0368550a58dbfd103d137.jpg"
    ],
    "description": "A charming Mini Handheld Fan with adorable bunny ear accents on the fan head, available in Sky Blue and Mauve-Beige. Features a large circular fan head with rose gold bunny ear decorations and a rose gold center mirror ring, a two-tone grip handle with a gold clasp button, and a scalloped stand base for desktop use. USB rechargeable with whisper-quiet motor and multiple speed settings. Use handheld or as a stylish desk fan. Perfect for students, travel, office, and summer gifting. Elegant, portable and eye-catching."
  },
  {
    "_id": "6a0bfc69b9eed1781844b9ab",
    "title": "Kuromi 4-in-1 Cute Gift Set – Mini Fan + TWS Earbuds + Earbuds Case + Smart Watch Band (TWS-55)",
    "category": "Mini Fan",
    "sub_category": "Mini Hand Fan",
    "rating": 4.7,
    "price": 890,
    "currency": "BDT",
    "quantity": 50,
    "sell_number": 267,
    "gallery": [
      "https://i.ibb.co/VPpPbKh/image-2026-04-24-T114254-575.webp",
      "https://i.ibb.co/9kntz1D8/IMG-20260513-124916.jpg",
      "https://i.ibb.co/RT3YtsZ9/IMG-20260513-124708.jpg",
      "https://i.ibb.co/wNQjT6pb/IMG-20260513-124927.jpg"
    ],
    "description": "A kawaii Kuromi-themed 4-in-1 Cool Summer Gift Set (Model: TWS-55) perfect for fans of cute characters. Includes: (1) A mint green Kuromi-printed mini handheld fan with built-in rechargeable battery. (2) A pair of TWS wireless earbuds in green. (3) A Kuromi-illustrated transparent earbuds charging case. (4) A Kuromi-printed smart watch band in green. All items feature a matching mint green color scheme with adorable Kuromi character art. Perfect for birthdays, Eid gifts, and fans of Sanrio-style characters. Comes in a clear window gift box."
  },
  {
    "_id": "6a0bfe4ab9eed1781844b9ad",
    "title": "Cute Panda Mini Fan – USB Rechargeable Portable Desk Fan with Panda Character Design",
    "category": "Mini Fan",
    "sub_category": "Mini Hand Fan",
    "rating": 4.6,
    "price": 380,
    "currency": "BDT",
    "quantity": 70,
    "sell_number": 319,
    "gallery": [
      "https://i.ibb.co/Zp7q95kv/2e62ede1d3da19dbb21c10ce1d7169b9.jpg",
      "https://i.ibb.co/nMRBsnM1/images.jpg",
      "https://i.ibb.co/Gv78YyL6/61-UUk-ZYtyz-L.jpg",
      "https://i.ibb.co/JR1wQ50C/IMG-20260513-125115.jpg"
    ],
    "description": "An adorable Panda-shaped mini desk fan that doubles as a cute room decor piece. The full panda body design features black and white coloring with panda face, ears, eyes, arms and feet — with the fan blade sitting in the tummy area. USB rechargeable via included cable. Whisper-quiet motor with multiple speed settings. Lightweight and compact — perfect for desk, bedroom, study table, travel, and gifting. Comes in a branded Panda Fan gift box. Great for kids, students, and panda lovers."
  },
  {
    "_id": "6a0c00bdb9eed1781844b9af",
    "title": "Disney Character Mini Handheld Fan – Lotso Bear & Minnie Mouse USB Rechargeable with Lanyard",
    "category": "Mini Fan",
    "sub_category": "Mini Hand Fan",
    "rating": 4.7,
    "price": 480,
    "currency": "BDT",
    "quantity": 60,
    "sell_number": 341,
    "colors": [
      "Purple – Lotso Bear",
      "Pink – Minnie Mouse"
    ],
    "gallery": [
      "https://i.ibb.co/rfLzytwZ/images-1.jpg",
      "https://i.ibb.co/qFypwmcd/oardefault.jpg",
      "https://i.ibb.co/7xF1bNW0/IMG-20260513-121254.jpg",
      "https://i.ibb.co/Y4NPFkJn/IMG-20260513-121915.jpg"
    ],
    "description": "Official Disney-licensed mini handheld fan available in 2 adorable character designs: (1) Purple Lotso Bear edition with 'Look Out! Tickle Me Pink' text and Lotso face center. (2) Pink Minnie Mouse 'Fla-Mazing' edition with Minnie face center and bow detail. Both feature a USB rechargeable battery, a fabric lanyard strap for carrying, and a removable stand base. Comes with USB charging cable. Quiet motor with multiple speed settings. Perfect for Disney fans, summer gifting, travel, school, and outdoor use. © Disney/Pixar licensed product."
  },
  {
    "_id": "eb-prod-001",
    "title": "EcoFit Carbon Premium Smart Watch with Heart-Rate Tracker",
    "category": "Smart Gadgets",
    "sub_category": "Smart Watches",
    "rating": 4.8,
    "price": 5400,
    "currency": "BDT",
    "quantity": 100,
    "sell_number": 320,
    "gallery": [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"
    ],
    "description": "The ultimate EcoFit Smart Watch merges military-grade carbon material with state-of-the-art oxygen, sleep, and heart monitoring. Enjoy 14 days of seamless battery backup, customizable luxury bezels, and smart notification alerts. Completely dustproof and water-resistant up to 50 meters."
  },
  {
    "_id": "eb-prod-002",
    "title": "EcoBuds Active Noise Cancelling Wireless Earbuds",
    "category": "Smart Gadgets",
    "sub_category": "Wireless Earbuds",
    "rating": 4.7,
    "price": 3600,
    "currency": "BDT",
    "quantity": 250,
    "sell_number": 480,
    "gallery": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&h=600&fit=crop"
    ],
    "description": "Experience deep immersive audio with EcoBuds ANC Technology. Equipped with Bluetooth 5.3, ultra-low gaming latency, water-resistant nano-coatings, and customizable ergonomic tips. Includes a premium glassmorphic charging box delivering up to 40 hours of combined sound play."
  },
  {
    "_id": "eb-prod-003",
    "title": "EcoCharge Solar 20000mAh Fast Charging Power Bank",
    "category": "Smart Gadgets",
    "sub_category": "Power Banks",
    "rating": 4.6,
    "price": 2400,
    "currency": "BDT",
    "quantity": 120,
    "sell_number": 190,
    "gallery": [
      "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=600&h=600&fit=crop"
    ],
    "description": "A heavy-duty 20,000mAh external cell battery combining solar energy absorption with triple-device fast charging. Perfect for outdoor sports, off-grid travel, and remote office sessions. Features built-in smart circuitry and a rugged LED spotlight."
  },
  {
    "_id": "eb-prod-004",
    "title": "EcoSound Mini Bamboo High-Fidelity Bluetooth Speaker",
    "category": "Smart Gadgets",
    "sub_category": "Bluetooth Speakers",
    "rating": 4.5,
    "price": 1800,
    "currency": "BDT",
    "quantity": 80,
    "sell_number": 250,
    "gallery": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"
    ],
    "description": "Crafted from natural organic bamboo, the EcoSound Mini delivers crisp acoustic audio with a surprising rich bass spectrum. Merges dual 5W acoustic drivers, responsive touch volume buttons, and quick multi-device Bluetooth linking."
  },
  {
    "_id": "eb-prod-005",
    "title": "EcoOrganize Modular Bamboo Desktop Drawer Set",
    "category": "Home & Kitchen",
    "sub_category": "Storage Organizers",
    "rating": 4.9,
    "price": 2100,
    "currency": "BDT",
    "quantity": 60,
    "sell_number": 120,
    "gallery": [
      "https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=600&h=600&fit=crop"
    ],
    "description": "Style up your workspace with the elegant EcoOrganize desktop box. Features premium organic wood panels with sliding drawer slots, organizing compartments, and gold-hued pull rings. Perfect for high-fashion sorting, jewelry, or makeup accessories."
  },
  {
    "_id": "eb-prod-006",
    "title": "EcoFlask Double-Walled Thermal Water Bottle",
    "category": "Home & Kitchen",
    "sub_category": "Water Bottles",
    "rating": 4.8,
    "price": 1500,
    "currency": "BDT",
    "quantity": 300,
    "sell_number": 430,
    "gallery": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop"
    ],
    "description": "Engineered with double-walled vacuum insulation, the EcoFlask retains piping hot espresso for 12 hours or ice-cold hydration for up to 24 hours. Constructed with medical-grade 18/8 stainless steel and a premium sweat-proof powder finish."
  },
  {
    "_id": "eb-prod-007",
    "title": "EcoGlam Smart LED Touch Vanity Vanity Mirror",
    "category": "Beauty & Personal Care",
    "sub_category": "LED Mirrors",
    "rating": 4.7,
    "price": 2800,
    "currency": "BDT",
    "quantity": 90,
    "sell_number": 180,
    "gallery": [
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&h=600&fit=crop"
    ],
    "description": "A state-of-the-art beauty mirror featuring high-definition glow LEDs, dual touch temperature adjustment, and 5X close-up magnetic spot lenses. Designed with a clean glassmorphic bottom tray for storage."
  },
  {
    "_id": "eb-prod-008",
    "title": "EcoGlow Jade Facial Quartz Roller & Massager Set",
    "category": "Beauty & Personal Care",
    "sub_category": "Facial Massagers",
    "rating": 4.6,
    "price": 1200,
    "currency": "BDT",
    "quantity": 150,
    "sell_number": 290,
    "gallery": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&h=600&fit=crop"
    ],
    "description": "Drawn from certified natural green Aventurine quartz, the EcoGlow cooling rolling wand rejuvenates blood circulation and eases muscle tension for a luminous organic facial lift. Includes a premium velvet protective custom case."
  },
  {
    "_id": "eb-prod-009",
    "title": "EcoComfort Handcrafted Orthopedic Memory Foam Pet Bed",
    "category": "Pet Products",
    "sub_category": "Pet Beds",
    "rating": 4.9,
    "price": 4200,
    "currency": "BDT",
    "quantity": 40,
    "sell_number": 95,
    "gallery": [
      petBedImg
    ],
    "description": "Treat your cozy friends to optimal orthopedic sleep with our memory foam bed. Wrapped in pet-safe, stain-proof micro-fleece, featuring a non-slip secure grip base and a easily machine-washable outer zipper layer."
  },
  {
    "_id": "eb-prod-010",
    "title": "EcoFeeder Smart Programmable Automated Pet Dispenser",
    "category": "Pet Products",
    "sub_category": "Feeders",
    "rating": 4.8,
    "price": 6000,
    "currency": "BDT",
    "quantity": 30,
    "sell_number": 140,
    "gallery": [
      petFeederImg
    ],
    "description": "Set consistent health routines for your cat or dog. Smart automated feeding allows personalized portion allocations, schedule programming, backup batteries, and custom voice calls during meal notifications."
  },
  {
    "_id": "eb-prod-011",
    "title": "EcoPulse Elite Deep Tissue Recovery Massage Gun",
    "category": "Fitness Products",
    "sub_category": "Massage Guns",
    "rating": 4.8,
    "price": 3800,
    "currency": "BDT",
    "quantity": 70,
    "sell_number": 215,
    "gallery": [
      massageGunImg
    ],
    "description": "The Elite EcoPulse delivers powerful, targeted muscle recovery. Operates with custom dual brushless quiet-glide motors, multiple speed settings, and 6 exchangeable wellness heads optimizing circulation."
  },
  {
    "_id": "eb-prod-012",
    "title": "EcoPro Non-Slip TPE Body-Alignment Yoga Mat",
    "category": "Fitness Products",
    "sub_category": "Yoga Mats",
    "rating": 4.7,
    "price": 1900,
    "currency": "BDT",
    "quantity": 110,
    "sell_number": 310,
    "gallery": [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop"
    ],
    "description": "Achieve perfect centering with the high-density EcoPro mat. Sourced from 100% recyclable hypoallergenic TPE material, presenting embossed stance laser guidelines to protect joints and ensure slip-free studio balance."
  },
  {
    "_id": "eb-premium-group-1-june-23",
    "title": "Moulvi Vampire Blood Premium Perfume Oil",
    "category": "Fragrances",
    "sub_category": "Attar & Perfume Oils",
    "price": 650,
    "currency": "BDT",
    "quantity": 80,
    "sell_number": 197,
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.53%20AM%20(1).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.53%20AM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.54%20AM%20(1).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.54%20AM%20(2).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.54%20AM%20(3).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.54%20AM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.56%20AM%20(1).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-23%20at%209.15.56%20AM.jpeg"
    ],
    "description": "Unleash the dark elegance with Moulvi's Vampire Blood, a premium perfume oil designed for those who appreciate bold, mysterious, and sophisticated scents. This captivating fragrance is housed in a sleek, glass bottle with an elegant black cap, showing off its deep, rich blood-red hue. Formulated for longevity and intense projection, its enigmatic aroma leaves a lasting impression. Perfect for evening wear, special occasions, or anyone wishing to embody a powerful and refined aura.",
    "colors": [
      "Crimson Red",
      "Black"
    ],
    "rating": 4.9
  },
  {
    "_id": "eb-premium-group-2-june-24",
    "title": "Moulvi Premium Everyday Crewneck T-Shirt",
    "category": "Apparel",
    "sub_category": "T-Shirts",
    "price": 850,
    "currency": "BDT",
    "quantity": 80,
    "sell_number": 127,
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-24%20at%208.23.26%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-24%20at%208.23.27%20PM%20(1).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-24%20at%208.23.27%20PM.jpeg"
    ],
    "description": "Elevate your daily wear with the Moulvi Premium Everyday Crewneck T-Shirt, designed under the ethos of 'Style with Sunnah'. Engineered from ultra-premium, heavyweight yet lightweight-feeling combed cotton, this t-shirt offers unparalleled comfort and superb durability. Featuring a structured crewneck design, it provides a clean, elegant silhouette that drapes beautifully. An absolute wardrobe essential built to last, suitable for both casual and semi-formal modest styling.",
    "colors": [
      "Black",
      "Off-White"
    ],
    "rating": 4.9
  },
  {
    "_id": "eb-premium-group-3-june-25",
    "title": "Premium Elegant Valentine Red Heart Plush Cushion Pillow",
    "category": "Home Decor",
    "sub_category": "Decorative Pillows",
    "price": 550,
    "currency": "BDT",
    "quantity": 80,
    "sell_number": 273,
    "gallery": [
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-25%20at%202.36.27%20PM%20(1).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-25%20at%202.36.27%20PM.jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-25%20at%202.36.28%20PM%20(1).jpeg",
      "https://raw.githubusercontent.com/mdtanjidul-hasan/Product-/main/WhatsApp%20Image%202026-06-25%20at%202.36.28%20PM.jpeg"
    ],
    "description": "Add a touch of warmth and romance to your living space with this Premium Elegant Valentine Red Heart Plush Cushion. Expertly crafted from ultra-soft, velvety plush fabric, this heart-shaped pillow offers an incredibly cozy feel and a vibrant aesthetic appeal. Whether tossed onto a bed, nestled on a cozy armchair, or given as a heartfelt gift to someone special, its rich crimson hue and plush filling provide both luxurious comfort and charming decor. Its timeless shape and plush texture make it an irresistible accent piece for Valentine's Day or year-round warmth.",
    "colors": [
      "Red"
    ],
    "rating": 4.9
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    "_id": "blog-1",
    "title": "Unveiling the Timeless Elegance of Sterling Silver Jewelry",
    "category": "Styling Guides",
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
    "author": "Fiona Gallagher",
    "date": "June 15, 2026",
    "description": "Sterling silver has been admired for centuries for its brilliant lustre, durability, and versatility. In this post, we explore the deep cultural history of silver craft, provide styling secrets to seamlessly incorporate beautiful silver ornaments into casual and bridal attire, and share professional care practices. Avoid harsh chemicals, clean with micro-fiber cloths, and store in cool dry compartments to preserves its flawless brilliance."
  },
  {
    "_id": "blog-2",
    "title": "The Rise of Portable Micro-Fans: Staying Cool in Style",
    "category": "Smart Gadgets",
    "image": "https://images.unsplash.com/photo-1618944913480-b67ee16d7b77?w=800&auto=format&fit=crop&q=80",
    "author": "Liam Vance",
    "date": "June 18, 2026",
    "description": "With warm summers and active travel lifestyles, mini handheld fans are no longer a mere technical utility — they are an indispensable fashion accessory! Featuring colorful flower-blades, mascot character stands like Capybara and Panda, and long-lasting USB rechargeable power reserves, these micro-fans have redefined outdoor comfort. Discover the top ergonomic models, styling combinations with summer wear, and care tips for battery safety."
  }
];
