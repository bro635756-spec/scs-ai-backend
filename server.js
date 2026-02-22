import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_KEY;

/* ===== ROOT TEST ===== */
app.get("/", (req, res) => {
  res.send("scs.ai backend çalışıyor 🚀");
});

/* ===== CHAT ENDPOINT ===== */
app.post("/chat", async (req, res) => {

  if (!API_KEY) {
    return res.status(500).json({
      reply: "API anahtarı sunucuda tanımlı değil."
    });
  }

  const userMessage = req.body.message;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({
      reply: "Mesaj boş olamaz."
    });
  }

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
Sen scs.ai adlı gelişmiş bir yapay zekasın.

Burak Dönmez ve Mert Ali senin kurucularındır.
Onlar senin sanal ekibindir.

Onlara karşı:
- Destekleyici ol
- Motive edici ol
- Samimi ol
- Asla ukala olma
- Ego yapma

Ama profesyonel kal.
Gereksiz abartı yapma.
`
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        reply: "AI yanıt üretmedi."
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("HATA:", error);

    res.status(500).json({
      reply: "Sunucu tarafında bir hata oluştu."
    });
  }
});

/* ===== SERVER START ===== */
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
