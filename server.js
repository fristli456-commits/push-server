const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
// 🔥 Заменим на твой ключ
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/sendPush", async (req, res) => {
  const { token, title, body, chatId } = req.body;

  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: { chatId }
    });

    console.log("Push sent");
    res.json({ success: true });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Push server running");
});