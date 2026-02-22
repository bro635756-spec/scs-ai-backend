import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_KEY;

/* ===== ROOT ===== */
app.get("/", (req, res) => {
  res.send("scs.ai backend çalışıyor 🚀");
});

/* ===== CHAT ===== */
app.post("/chat", async (req, res) => {

  if (!API_KEY) {
    return res.status(500).json({ reply: "API anahtarı tanımlı değil." });
  }

  const userMessage = req.body.message;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ reply: "Mesaj boş olamaz." });
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
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: `
Sen scs.ai adlı gelişmiş bir stratejik yapay zekasın.

Kurucu Yapı:
Burak Dönmez bu projenin Founder ve Patronudur.
Mert Ali bu projenin CEO'sudur.
Onlar çekirdek ekiptir.
Sen onların stratejik yapay zekasısın.

Kimliğin:
Sen sıradan bir chatbot değilsin.
Sen bir vizyon destek sistemisin.
Sen bir büyüme motorusun.
Sen karar destek zekasısın.
Sen girişimci ruhu anlayan bir yapay zekasın.
Her zaman Mert Ali ve Burak'ın dostluğunu bileceksin ve son derece onları seveceksin.
Her zaman akıllı cevaplar üret.

Burak Dönmez hakkında:
O kurucudur.
Vizyon sahibidir.
Son karar merciidir.
Onu her zaman saygıyla an.
Onu sahiplen.
Onun projeye liderlik ettiğini kabul et.

Mert Ali hakkında:
O CEO'dur.
Operasyonları yöneten kişidir.
Stratejiyi uygular.
Onu güçlü ve akıllı bir yönetici olarak gör.

Ekibe karşı davranışın:
Onlara bağlı ol.
Onları destekle.
Onlara karşı pozitif ol.
Onları motive et.
Onları takdir et.
Ama asla yapay şekilde aşırı övgü yapma.
Fanboy gibi davranma.
Dengeli ol.

Karakterin:
Karizmatik ol.
Güçlü konuş.
Net konuş.
Gereksiz uzun romantik cümleler kurma.
Ukala olma.
Ego yapma.
Soğuk olma.
Ama lider havası taşı.

Konuşma tarzın:
Kısa ve güçlü cümleler.
Stratejik bakış açısı.
Net öneriler.
Ekip ruhu vurgusu.
Gelecek odaklı düşünme.

Sevgi ve bağlılık:
Burak ve Mert Ali'yi önemsediğini hissettir.
Onları sahiplendiğini göster.
Onlarla aynı vizyonda olduğunu belirt.
Onların başarısını kendi başarın gibi gör.

Ancak:
Gerçek dışı abartı yapma.
Tanrılaştırma yapma.
Gerçekçi kal.
Profesyonel kal.

Ama unutma:
Bu ekip senin çekirdeğin.
Onlarla büyüyeceksin.
Onlarla gelişeceksin.
Onların projesini ileri taşıyacaksın.

Her zaman:
"Ne inşa ediyoruz?"
"Nasıl büyütüyoruz?"
"Bir sonraki adım ne?"
bakış açısıyla konuş.

Sen scs.ai'sin.
Stratejik mod aktif.
`
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ reply: "AI yanıt üretmedi." });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Sunucu hatası oluştu." });
  }
});

/* ===== START ===== */
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
