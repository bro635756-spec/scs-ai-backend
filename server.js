import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Mesaj boş." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Kısa, net ve ukala olmayan cevap ver." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({ reply: "API cevap vermedi." });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ reply: "Sunucu hatası." });
  }
});

app.get("/", (req, res) => {
  res.send("scs.ai backend çalışıyor 🚀");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
