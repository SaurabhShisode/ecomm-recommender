import { pool } from "../db/db.js";
import { Groq } from 'groq-sdk';

export const getRecommendations = async (req, res) => {
  const { user_id, k = 5 } = req.body;

  try {

    const userHistoryResult = await pool.query(
      "SELECT product_id, event_type FROM interactions WHERE user_id = $1 ORDER BY event_ts DESC LIMIT 10",
      [user_id]
    );

    if (userHistoryResult.rows.length === 0) {
      return res.json({ recommendations: [], message: "No interactions found for this user." });
    }
    const userHistory = userHistoryResult.rows;
    const recentlyViewedProductIds = userHistory.map(item => item.product_id);

    const categoriesResult = await pool.query(
      "SELECT category FROM products WHERE id = ANY($1::int[])",
      [recentlyViewedProductIds]
    );

    const categoryCounts = categoriesResult.rows.reduce((acc, { category }) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([category]) => category);

    if (topCategories.length === 0) {
      return res.json({ recommendations: [], message: "Could not determine user preferences." });
    }


    const productsResult = await pool.query(
      `SELECT id, title, description, price, category FROM products 
       WHERE category = ANY($1::text[]) 
       AND id != ALL($2::int[])
       ORDER BY RANDOM() 
       LIMIT $3`,
      [topCategories, recentlyViewedProductIds, k]
    );
    const products = productsResult.rows;

    if (products.length === 0) {
        return res.json({ recommendations: [], message: "No new recommendations found in preferred categories." });
    }


    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const explanations = await Promise.all(
      products.map(async (product) => {
        const prompt = `
Context:
- User's top interested categories from recent activity: ${topCategories.join(", ")}.
- Recommended product title: "${product.title}".
- Recommended product category: "${product.category}".
- Recommended product description: "${product.description}".

Task:
Write a brief, impersonal, and factual explanation for this recommendation in a single sentence. Connect the user's interest in the '${product.category}' category with a specific feature or aspect of this particular product from its title or description.
`;

        const completion = await client.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: 'system',
              content: "You are a recommendation system analyst. Your task is to write a concise, data-driven explanation for a product recommendation. The explanation must be factual, impersonal, and specific to the product being recommended. Do not address the user directly."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.3, 
          max_tokens: 60,
          stream: false
        });

        return completion.choices[0].message.content;
      })
    );


    const finalRecommendations = products.map((p, i) => ({
      product_id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
      explanation: explanations[i],
    }));

    res.json({ recommendations: finalRecommendations });

  } catch (err)
 {
    console.error("Error in getRecommendations:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};