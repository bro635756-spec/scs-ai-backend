const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// ===== OPENAI =====
const openai = new OpenAI({
  apiKey: "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"
});

// ===== DATABASE =====
const db = new sqlite3.Database("./chat.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ===== CHAT ENDPOINT =====
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Mesaj boş" });
  }

  // Kullanıcı mesajını kaydet
  db.run("INSERT INTO messages (role, content) VALUES (?, ?)", [
    "user",
    userMessage
  ]);

  try {
    // Son 10 mesajı al (context için)
    db.all(
      "SELECT role, content FROM messages ORDER BY id DESC LIMIT 10",
      async (err, rows) => {
        if (err) {
          return res.status(500).json({ error: "DB hata" });
        }

        const messages = rows.reverse();

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: messages
        });

        const aiReply = completion.choices[0].message.content;

        // AI cevabını kaydet
        db.run("INSERT INTO messages (role, content) VALUES (?, ?)", [
          "assistant",
          aiReply
        ]);

        res.json({ reply: aiReply });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI hata" });
  }
});

// ===== SOHBET GEÇMİŞİ =====
app.get("/history", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY id ASC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "DB hata" });
    }
    res.json(rows);
  });
});

// ===== SOHBETİ SİL =====
app.delete("/history", (req, res) => {
  db.run("DELETE FROM messages", (err) => {
    if (err) {
      return res.status(500).json({ error: "Silme hata" });
    }
    res.json({ message: "Sohbet temizlendi" });
  });
});

app.listen(3000, () => {
  console.log("Server 3000 portunda çalışıyor");
});
