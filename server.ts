import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./server_db";
import { setupAPI } from "./server_api";
import { seedDB } from "./server_seed";

const app = express();
const PORT = 3000;

app.use(express.json());

// Setup API routes
setupAPI(app);

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Reusable fallback recommendations matcher
const getHeuristicRecommendations = (currentProduct: any, allProducts: any[]) => {
  const matches = allProducts
    .filter((p: any) => p._id !== currentProduct._id)
    .map((p: any) => {
      let score = 0;
      if (p.category === currentProduct.category) score += 3;
      if (p.sub_category === currentProduct.sub_category) score += 2;
      
      const descLower = (p.description || "").toLowerCase();
      const titleLower = (p.title || "").toLowerCase();
      
      // Complementary heuristics
      if (currentProduct.category.toLowerCase().includes("earr") || currentProduct.category.toLowerCase().includes("jewel")) {
        if (p.category !== currentProduct.category) score += 1;
      }
      if (currentProduct.category.toLowerCase().includes("gadget") || currentProduct.category.toLowerCase().includes("tech")) {
        if (descLower.includes("cable") || descLower.includes("charger") || descLower.includes("adapter") || titleLower.includes("cable") || titleLower.includes("charger") || titleLower.includes("adapter")) {
          score += 2;
        }
      }
      
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => ({
      productId: item.product._id,
      reasoning: `Recommended matching choice: ${item.product.category}. Formulated to elevate and complement your style alongside ${currentProduct.title}.`
    }));
  return matches;
};

// API Endpoint for AI recommendations
app.post("/api/recommendations", async (req, res) => {
  let currentProduct: any = null;
  let allProducts: any[] = [];

  try {
    const { currentProductId, allProducts: receivedProducts } = req.body;
    if (!currentProductId || !receivedProducts || !Array.isArray(receivedProducts)) {
      return res.status(400).json({ error: "Missing currentProductId or allProducts array" });
    }

    allProducts = receivedProducts;
    currentProduct = allProducts.find((p: any) => p._id === currentProductId);
    if (!currentProduct) {
      return res.status(404).json({ error: "Current product not found in the list" });
    }

    const ai = getGeminiClient();

    // If API key is missing, fallback to high-quality rule-based recommendations
    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to heuristic/category matching.");
      const matches = getHeuristicRecommendations(currentProduct, allProducts);
      return res.json({ recommendations: matches, source: "fallback_heuristic" });
    }

    // Keep payload small to avoid token limits
    const productSummaries = allProducts.map((p: any) => ({
      _id: p._id,
      title: p.title,
      category: p.category,
      sub_category: p.sub_category || "",
      description: (p.description || "").substring(0, 150)
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert personalized product recommendation engine for "EcoBazar Jewelry and Gadgets Store". 
Analyze the current product being viewed by the user and determine the top 4 complementary or matching accessory products from the available products catalog below. 

A complementary product matches perfectly (e.g., if current product is gold earrings, suggest matching gold necklaces, rings, jewelry boxes, or companion jewelry pieces; if current product is a gadget, suggest compatible cables, chargers, cases, or companion smart devices). Avoid recommending the current product itself or identical products unless they form a perfect set combo.

Current Product being viewed:
- ID: ${currentProduct._id}
- Title: ${currentProduct.title}
- Category: ${currentProduct.category}
- Subcategory: ${currentProduct.sub_category || ""}
- Description: ${currentProduct.description}

Available Catalog Products List:
${JSON.stringify(productSummaries)}

Return your list of recommendations in a strict JSON array containing exactly 4 items. Each recommended item MUST match an actual "_id" from the Catalog Products List and include a short, compelling reason (approx 1-2 sentences) in Bengali or English suited for the buyer explaining why these two items complement each other.

JSON Response Schema structure:
[
  { "productId": "id_string", "reasoning": "compelling matching reason string" }
]`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                productId: {
                  type: Type.STRING,
                  description: "The _id of the recommended complementary product."
                },
                reasoning: {
                  type: Type.STRING,
                  description: "Short matching explanation outlining why it complements the current items."
                }
              },
              required: ["productId", "reasoning"]
            }
          }
        }
      });

      const textOutput = response.text?.trim() || "[]";
      const results = JSON.parse(textOutput);
      return res.json({ recommendations: results, source: "gemini_api" });
    } catch (apiError: any) {
      const isUnavailable = apiError?.message?.includes("503") || apiError?.status === 503 || apiError?.message?.includes("UNAVAILABLE");
      if (isUnavailable) {
        console.warn("[AI recommendation API Engine] Upstream model capacity limit reached (503 Service Unavailable). Activating heuristic accessory matchmaking.");
      } else {
        console.warn("[AI recommendation API Engine] Upstream API issue. Activating high-quality heuristic matchmaking:", apiError?.message || apiError);
      }
      const matches = getHeuristicRecommendations(currentProduct, allProducts);
      return res.json({ recommendations: matches, source: "fallback_heuristic" });
    }

  } catch (error: any) {
    console.warn("[AI recommendation API Engine] Recommendation Outer Handler activated fallback matching:", error?.message || error);
    if (currentProduct && allProducts.length > 0) {
      const matches = getHeuristicRecommendations(currentProduct, allProducts);
      return res.json({ recommendations: matches, source: "fallback_heuristic" });
    }
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Reusable fallback dropship marketing pack generator
const getHeuristicDropshipPack = (product: any) => {
  const title = product.title || "Premium Item";
  const desc = product.description || "";
  const cat = product.category || "Jewelry & Gadgets";
  
  return {
    facebookAd: {
      headline: `⭐ Transform Your Vibe with ${title}! (Offer inside)`,
      primaryText: `Ready to elevate your everyday style? ✨ Meet the ${title}. Curated to add a premium touch of class, durability, and elegance to your daily life. Over 5,000 satisfied buyers worldwide are already loving theirs!\n\n🔥 Get 45% OFF + Free Worldwide Tracked Shipping today only. Fast safe checkout!\n\n👉 Tap 'Shop Now' before sell out: [Your Link Here]`,
      hook: `Why is everyone on social media obsessed with the ${title}? Here is why...`,
      targetAudienceSuggestion: `Age 18-45, Intersecting Interests: Online Shopping, Boutique Jewelry, High-Tech Gadgets, Smart Lifestyle, Aesthetic Accessories`
    },
    instagramAd: {
      caption: `Minimalist aesthetics meet luxurious appeal. ✨ The all-new ${title} is designed to make a quiet yet powerful statement. Pair it, flaunt it, love it! Save 45% off yours during our global launch event.\n\nWhich style is your favorite? Tell us in the comments! 👇`,
      hashtags: `#${cat.replace(/\s+/g, '')} #AestheticStyle #MinimalistLuxury #DropshipGlobal #OOTDPremium #TrendAlert2026`,
      aestheticVibeGuide: `Sleek dark marble backdrops, warm macro jewelry lighting, or crisp everyday carry (EDC) flatlays under golden hour natural light.`,
      influencerCollabIdea: `Send a free custom box packaging to micro-influencers in the lifestyle, fashion, or tech aesthetics niche. Request a 15-second 'unboxing + touch test' reel with their personal affiliate promo discount code.`
    },
    tiktokAd: {
      videoHook3s: `TikTok made me buy this: The ultimate ${title} unboxing! 📦✨`,
      musicVibeSuggestion: `Upbeat ambient lofi house beats or modern high-fidelity synthpop audio tracks.`,
      visualScriptOutline: `0:00 - Ultra close-up of opening a magnetic premium matte packaging. 0:05 - Visual test demonstrating shiny metallic details or sleek design interface. 0:10 - Hand-model wearing/using the item in a chic, aesthetic room environment. 0:15 - 'Get yours at the link in bio!' overlay.`,
      trendingChallengeIntegration: `Use the screen-swipe transition trend. Show a plain outfit/desk space first, swipe your hand, and suddenly reveal the shimmering/active ${title} completely lighting up the atmosphere!`
    },
    googleAd: {
      headline1: `Buy ${title.substring(0, 25)} | Global Dropship Launch`,
      headline2: `Free Tracked Shipping Worldwide`,
      descriptionText: `Shop the premium customized ${title}. High-density materials, exquisite finish, and 30-day money-back guarantee. View our collections today!`,
      targetedKeywords: `buy ${title.toLowerCase()}, online dropship ${cat.toLowerCase()}, luxury ${title.toLowerCase()} sale, premium gadgets online, eco-friendly luxury matching sets`
    },
    seoMetaData: {
      seoTitle: `Premium ${title} | Luxury Accessories | EcoBazar Online Store`,
      metaDescription: `Discover the luxury ${title} at EcoBazar. Hand-selected for exceptional durability and timeless visual appeal. Enjoy secure checkout and free global delivery.`,
      productSlug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-premium-edition`,
      LSIKeywords: `${title.toLowerCase()} reviews, cheap alternative ${title.toLowerCase()}, eco-bazar accessories catalog, aesthetic jewelry sets`,
      backlinkRecomm: `Publish a guest blog on accessory-review.com or smartlifestyletrends.org focusing on: 'Why ${title} is the ultimate accessory upgrade in 2026.'`
    }
  };
};

// API Endpoint for AI Dropshipping Marketing Copy & SEO Meta Pack
app.post("/api/dropship-generator", async (req, res) => {
  try {
    const { product } = req.body;
    if (!product || !product.title) {
      return res.status(400).json({ error: "Missing product data" });
    }

    const ai = getGeminiClient();

    // If API key is missing, fallback to our marketing-minds heuristic generator
    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to heuristic dropship content generator.");
      const heuristicPack = getHeuristicDropshipPack(product);
      return res.json({ pack: heuristicPack, source: "fallback_heuristic" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an elite eCommerce digital marketing manager, conversion rate optimization (CRO) consultant, dropshipping maven, and world-class copywriter.
Create a highly persuasive, conversion-optimized global digital marketing and SEO blueprint for dropshipping this product:

Product Name: ${product.title}
Category: ${product.category}
Sub-Category: ${product.sub_category || ""}
Description: ${product.description || ""}
Suggested Price: ${product.price}

Generate creative scripts, hooks, and taglines tailored for five distinct traffic channels:
1. Facebook Ads: Designed to convert cold social feeds into impulsive orders. Highlight FOMO, discount, trust, and global shipping.
2. Instagram Feed: Visually aesthetic, storytelling caption, premium hashtags, aesthetic creative guide, and micro-influencer collaboration angle.
3. TikTok Ads: Attention-grabbing short-form viral hook (first 3 seconds), recommended audio tracks, a visual scene-by-scene filming script, and trend/filter hook ideas.
4. Google Search Ads: Structured headlines and descriptions maximizing Click-Through-Rate (CTR) with high-intent target keywords.
5. Search Engine Optimization (SEO): Search title (under 60 chars), meta description (under 160 chars), localized search-friendly URL/slug, LSI search terms, and structured backlink opportunities suggestions.

Return your exact response as a strict JSON object structure adhering to the schema below.

Required JSON Structure:
{
  "facebookAd": {
    "headline": "Headline string",
    "primaryText": "Persuasive primary text with emojis and clear call to action.",
    "hook": "Attention-grabber",
    "targetAudienceSuggestion": "Granular interest target guidelines"
  },
  "instagramAd": {
    "caption": "Aesthetic lifestyle caption",
    "hashtags": "Hashtags space",
    "aestheticVibeGuide": "Brief filming style recommendations",
    "influencerCollabIdea": "Creative micro-influencer product setup seed"
  },
  "tiktokAd": {
    "videoHook3s": "Compelling 3-second visual or text grabber",
    "musicVibeSuggestion": "Audio style",
    "visualScriptOutline": "Scene-by-scene blueprint",
    "trendingChallengeIntegration": "Idea on how to integrate into current challenge trends"
  },
  "googleAd": {
    "headline1": "Headline style 1",
    "headline2": "Headline style 2",
    "descriptionText": "Persuasive search ad snippet",
    "targetedKeywords": "List of high-conversion search keywords comma separated"
  },
  "seoMetaData": {
    "seoTitle": "Optimized Google Page Title",
    "metaDescription": "Optimized meta description",
    "productSlug": "SEO-friendly-url-slug",
    "LSIKeywords": "Keywords list",
    "backlinkRecomm": "Suggestions for content backlinks"
  }
}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              facebookAd: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  primaryText: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  targetAudienceSuggestion: { type: Type.STRING }
                },
                required: ["headline", "primaryText", "hook", "targetAudienceSuggestion"]
              },
              instagramAd: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.STRING },
                  aestheticVibeGuide: { type: Type.STRING },
                  influencerCollabIdea: { type: Type.STRING }
                },
                required: ["caption", "hashtags", "aestheticVibeGuide", "influencerCollabIdea"]
              },
              tiktokAd: {
                type: Type.OBJECT,
                properties: {
                  videoHook3s: { type: Type.STRING },
                  musicVibeSuggestion: { type: Type.STRING },
                  visualScriptOutline: { type: Type.STRING },
                  trendingChallengeIntegration: { type: Type.STRING }
                },
                required: ["videoHook3s", "musicVibeSuggestion", "visualScriptOutline", "trendingChallengeIntegration"]
              },
              googleAd: {
                type: Type.OBJECT,
                properties: {
                  headline1: { type: Type.STRING },
                  headline2: { type: Type.STRING },
                  descriptionText: { type: Type.STRING },
                  targetedKeywords: { type: Type.STRING }
                },
                required: ["headline1", "headline2", "descriptionText", "targetedKeywords"]
              },
              seoMetaData: {
                type: Type.OBJECT,
                properties: {
                  seoTitle: { type: Type.STRING },
                  metaDescription: { type: Type.STRING },
                  productSlug: { type: Type.STRING },
                  LSIKeywords: { type: Type.STRING },
                  backlinkRecomm: { type: Type.STRING }
                },
                required: ["seoTitle", "metaDescription", "productSlug", "LSIKeywords", "backlinkRecomm"]
              }
            },
            required: ["facebookAd", "instagramAd", "tiktokAd", "googleAd", "seoMetaData"]
          }
        }
      });

      const textOutput = response.text?.trim() || "{}";
      const results = JSON.parse(textOutput);
      return res.json({ pack: results, source: "gemini_api" });
    } catch (apiError: any) {
      console.warn("[AI dropship API Engine] Gemini API hit limit or error, falling back to marketing formulas:", apiError?.message || apiError);
      const heuristicPack = getHeuristicDropshipPack(product);
      return res.json({ pack: heuristicPack, source: "fallback_heuristic" });
    }

  } catch (error: any) {
    console.error("[AI dropship API Engine] Outer Error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Heuristic fallback for SEO Health analysis in case Gemini API is offline or has no key
const getHeuristicSeoAnalysis = (product: any, trends: any[]) => {
  const title = product.title || "";
  const desc = product.description || "";
  
  let score = 55;
  const analysis: any[] = [];
  
  // Title analysis
  if (title.length >= 40 && title.length <= 60) {
    score += 15;
    analysis.push({
      item: "Title Length Optimization",
      grade: "A",
      status: "Optimal",
      feedback: `Your title length (${title.length} characters) is ideal for search snippets, avoiding truncation in Google SERP.`
    });
  } else if (title.length < 40) {
    score += 5;
    analysis.push({
      item: "Title Length Optimization",
      grade: "C",
      status: "Too Short",
      feedback: `Title is short (${title.length} chars). Expand it with descriptive high-volume search keywords (e.g. style, material) to boost CTR.`
    });
  } else {
    score += 2;
    analysis.push({
      item: "Title Length Optimization",
      grade: "D",
      status: "Truncation Risk",
      feedback: `Title length (${title.length} chars) exceeds the 60-character recommended ceiling. Prune fluffy adjectives to display fully.`
    });
  }

  // Description analysis
  if (desc.length >= 110 && desc.length <= 160) {
    score += 15;
    analysis.push({
      item: "Meta Description Richness",
      grade: "A",
      status: "Optimal",
      feedback: `Meta description length (${desc.length} characters) is within the optimal Google SERP viewport size.`
    });
  } else if (desc.length < 110) {
    score += 5;
    analysis.push({
      item: "Meta Description Richness",
      grade: "C",
      status: "Under-optimized",
      feedback: `Meta description (${desc.length} chars) is too minimal. Add rich benefits, specifications, or secondary high-intent keywords.`
    });
  } else {
    score += 2;
    analysis.push({
      item: "Meta Description Richness",
      grade: "D",
      status: "Truncated",
      feedback: `Description length (${desc.length} chars) exceeds the 160-character maximum. Searchers won't see trailing calls-to-action.`
    });
  }

  // Keyword Matching Heuristic
  const matchedKeywords: string[] = [];
  const trendsList = Array.isArray(trends) && trends.length > 0 ? trends : [
    { keyword: "traditional beaded necklaces", volume: 88 },
    { keyword: "handmade silver gemstone rings", volume: 94 },
    { keyword: "waterproof smartwatch fitness track", volume: 72 },
    { keyword: "dual camera mini folding drone", volume: 96 }
  ];

  trendsList.forEach((t: any) => {
    const word = (t.keyword || "").toLowerCase();
    if (title.toLowerCase().includes(word) || desc.toLowerCase().includes(word)) {
      matchedKeywords.push(t.keyword);
    }
  });

  if (matchedKeywords.length > 0) {
    score += 15;
    analysis.push({
      item: "Search Trend Alignment",
      grade: "A",
      status: "Strong Match",
      feedback: `Excellent! You successfully integrated high-volume trends: "${matchedKeywords.join(", ")}".`
    });
  } else {
    analysis.push({
      item: "Search Trend Alignment",
      grade: "F",
      status: "No active search keywords",
      feedback: `Critical warning: No active high-volume search trends detected in your product metadata. You are missing free organic traffic.`
    });
  }

  // Cap final score
  score = Math.min(100, Math.max(15, score));

  // Determine an auto keyword to use for the optimized suggestions
  const topTrend = trendsList[0]?.keyword || "handmade gemstone pieces";
  const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Premium Item Edition";
  const suggestedTitle = `Eco-Bazar ${cleanTitle} | Verified ${topTrend}`;
  const suggestedDesc = `High-quality ${cleanTitle} at EcoBazar. ${desc.slice(0, 90)}... Features elegant design, craftsmanship, and fast global shipping. Order today!`;
  const suggestedKeywords = `${topTrend.toLowerCase()}, buy ${cleanTitle.toLowerCase()}, eco friendly accessories store, best organic materials jewelry`;

  return {
    score,
    analysis,
    matchedKeywords,
    suggestedTitle,
    suggestedDesc,
    suggestedKeywords,
    trendInsights: `Search interest for "${topTrend}" is actively trending upwards (Volume: ${trendsList[0]?.volume || 90}). Targeting these terms gives your product a search relevancy boost.`
  };
};

// API Endpoint for AI SEO Health Checker & Search Trends Analyzer
app.post("/api/seo-health-checker", async (req, res) => {
  try {
    const { product, trends } = req.body;
    if (!product || !product.title) {
      return res.status(400).json({ error: "Missing product data for SEO analysis" });
    }

    const ai = getGeminiClient();

    // If API key is missing, fallback to our heuristic engine
    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to heuristic SEO analyzer.");
      const result = getHeuristicSeoAnalysis(product, trends);
      return res.json({ result, source: "fallback_heuristic" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are a certified professional SEO Architect, eCommerce Crawler, Search Intent Specialist, and Google Trends analyst.
Analyze the following product details and active search engine keyword trends to evaluate the product's discoverability score (0 to 100) and draft key improvements to rank higher on search engines.

Product Metadata:
- Title: "${product.title}"
- Description: "${product.description || ""}"
- Category: "${product.category}"

Active Google Search trends we want to target:
${JSON.stringify(trends)}

Tasks to achieve:
1. Compute a holistic SEO Health rating (integer from 0 to 100) based on title length guidelines (optimal: 40-60 chars), description richness (optimal: 110-160 chars), and relevance to high-volume keywords in trends.
2. Provide a structured checklist itemizing Title Length, Category relevance, Meta Description richness, and Trend alignment. Grade each category (A to F), state its status, and provide helpful search crawler feedback.
3. Identify which active trend keywords are matched or almost matched.
4. Suggest a direct search engine optimized title (under 60 characters) integrating high-performing keyword terms.
5. Create a dynamic conversion-friendly meta description (110 to 160 characters) with a clear CTA.
6. Propose a comma-separated list of highly-relevant LSI / search-ranking keywords to append.
7. Provide a localized ranking / search interest insights paragraph detailing seasonal intent or competition on Google Trends.

Return your exact response as a strict JSON object structure adhering to the schema below.

Required JSON Structure:
{
  "score": 85,
  "analysis": [
    {
      "item": "Title Length Optimization",
      "grade": "B",
      "status": "Short",
      "feedback": "Details feedback here..."
    }
  ],
  "matchedKeywords": ["handmade silver gemstone rings"],
  "suggestedTitle": "Optimized Product Title Here",
  "suggestedDesc": "Persuasive search meta description here...",
  "suggestedKeywords": "keyword1, keyword2, keyword3",
  "trendInsights": "Google Trends context paragraph or seasonal guidance info..."
}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              analysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    grade: { type: Type.STRING },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING }
                  },
                  required: ["item", "grade", "status", "feedback"]
                }
              },
              matchedKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              suggestedTitle: { type: Type.STRING },
              suggestedDesc: { type: Type.STRING },
              suggestedKeywords: { type: Type.STRING },
              trendInsights: { type: Type.STRING }
            },
            required: ["score", "analysis", "matchedKeywords", "suggestedTitle", "suggestedDesc", "suggestedKeywords", "trendInsights"]
          }
        }
      });

      const textOutput = response.text?.trim() || "{}";
      const results = JSON.parse(textOutput);
      return res.json({ result: results, source: "gemini_api" });
    } catch (apiError: any) {
      console.warn("[AI SEO Analyzer API] Gemini API error, falling back to heuristics:", apiError?.message || apiError);
      const result = getHeuristicSeoAnalysis(product, trends);
      return res.json({ result, source: "fallback_heuristic" });
    }

  } catch (error: any) {
    console.error("[AI SEO Analyzer API] Outer error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// AI Shopping Assistant Q&A Heuristics Matcher
const getHeuristicAssistantResponse = (product: any, query: string): string => {
  const qStr = (query || "").toLowerCase();
  
  if (qStr.includes("price") || qStr.includes("cost") || qStr.includes("how much") || qStr.includes("টাকা") || qStr.includes("দাম")) {
    return `The price of "${product.title}" is ${product.price} BDT. We support cash on delivery inside Bangladesh, alongside Visa/Mastercard payments.`;
  }
  
  if (qStr.includes("stock") || qStr.includes("quantity") || qStr.includes("available") || qStr.includes("কতটা আছে") || qStr.includes("স্টক") || qStr.includes("কয়টা")) {
    return product.quantity > 0 
      ? `Yes! We currently have ${product.quantity} units of "${product.title}" in stock and ready to ship within 24 hours.`
      : `Currently, "${product.title}" is out of stock. It is expected to replenish soon, but you can pre-order or consult our help desk!`;
  }
  
  if (qStr.includes("shipping") || qStr.includes("delivery") || qStr.includes("courier") || qStr.includes("শিপিং") || qStr.includes("ডেলিভারি") || qStr.includes("পৌঁছ")) {
    return `We offer free standard global courier shipping (7-12 business days) with zero damage liability. You can also opt for priority tracked shipping (3-5 business days) for an extra ৳450 BDT at checkout.`;
  }
  
  if (qStr.includes("material") || qStr.includes("made of") || qStr.includes("metal") || qStr.includes("silver") || qStr.includes("wood") || qStr.includes("তৈরি") || qStr.includes("উপাদান") || qStr.includes("উপকরণ")) {
    const descLower = (product.description || "").toLowerCase();
    if (descLower.includes("silver") || descLower.includes("gold") || descLower.includes("gemstone") || descLower.includes("alloy") || descLower.includes("pouch")) {
      return `This is crafted with selected materials details: "${product.description.substring(0, 150)}...". All our jewelry products feature hypoallergenic materials, 100% free from Lead, Cadmium, or BPA.`;
    }
    return `This gadget features premium components: "${product.description.substring(0, 150)}...". Designed for high durability, energy efficiency, and modern everyday lifestyle standards.`;
  }
  
  if (qStr.includes("origin") || qStr.includes("where") || qStr.includes("supplier") || qStr.includes("উৎস") || qStr.includes("কোন দেশ")) {
    return `The "${product.title}" is premium quality and sourced directly through EcoBazar Certified Fair-Trade Green Manufacturing Hubs, guaranteeing both quality verification and ethical production loops.`;
  }
  
  if (qStr.includes("hello") || qStr.includes("hi") || qStr.includes("hey") || qStr.includes("সালাম") || qStr.includes("হ্যালো") || qStr.includes("কেমন")) {
    return `Hello there! I am your AI-powered boutique guide at EcoBazar. I'd be absolutely delighted to help you understand more about the beautiful "${product.title}". What would you like to know about its design, materials, spec metrics, or delivery options?`;
  }
  
  // Default overview fallback
  return `I'm happy to help explain more about "${product.title}"! It is priced at ${product.price} BDT in our "${product.category}" gallery. Description: "${product.description.substring(0, 120)}...". Let me know if you would like me to clarify its dimensions, stock depth, or shipping details!`;
};

// API Endpoint for AI Shopping Assistant (Product Q&A Chat)
app.post("/api/shopping-assistant", async (req, res) => {
  try {
    const { product, messages } = req.body;
    if (!product || !product.title || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing product object or messages array" });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const ai = getGeminiClient();

    // If API key is missing, fallback to our heuristic assistant engine
    if (!ai) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to heuristic chatbot response.");
      const reply = getHeuristicAssistantResponse(product, lastUserMessage);
      return res.json({ reply, source: "fallback_heuristic" });
    }

    try {
      // Map chat messages format to Google GenAI expectations
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const systemInstruction = `You are a helpful, extremely polite, and personal AI shopping assistant at "EcoBazar Jewelry and Gadgets Store".
Your goal is to assist customers with details or questions about the specific product they are currently viewing.
Answer accurately based on the provided Product Details. If any detail is not specified or cannot be reasonably inferred, say you don't have that exact detail, but encourage them to proceed configuration or talk to EcoBazar customer service.

Current Product Details:
- Title: "${product.title}"
- Price: ${product.price} BDT
- Category: "${product.category}"
- Sub-category: "${product.sub_category || "N/A"}"
- Description: "${product.description}"
- Rating: ${product.rating || "5"} / 5 stars
- Available Inventory Stock: ${product.quantity} items available in our fair-trade hub

Our General Store Standards:
- Standard Shipping: Free worldwide delivery (typical timeframe 7-12 business days).
- Express Delivery: Priority tracked courier is available for ৳450 BDT (takes 3-5 business days).
- Raw Material Quality: All metallic products are hypoallergenic, lead/cadmium/BPA free. Handcrafted items come with a luxurious travel velvet packaging box.
- Returns policy: 30 days money-back guarantee with prepaid return labels if unsatisfied.

Tone Guidelines:
1. Warm, premium boutique assistant vibe. Speak with gentle elegance and enthusiasm for fine items.
2. Keep responses concise (usually 2-3 sentences), making them easy to read inside a small chat drawer or tab widget.
3. Support Bengali natively if the user queries in Bengali, and English if they write in English. Use natural local phrasing.
4. Do not mention any JSON, API, or engineering parameters. Speak directly as a human shop assistant.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text?.trim() || "I'm sorry, I couldn't formulate an answer at the moment. Please feel free to ask again!";
      return res.json({ reply, source: "gemini_api" });
    } catch (apiError: any) {
      console.warn("[AI Assistant API] Gemini API error, activating heuristics fallback:", apiError?.message || apiError);
      const reply = getHeuristicAssistantResponse(product, lastUserMessage);
      return res.json({ reply, source: "fallback_heuristic" });
    }

  } catch (error: any) {
    console.error("[AI Assistant API] Outer handler error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Serve frontend assets
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Connect to DB and seed
  await connectDB();
  await seedDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
});
