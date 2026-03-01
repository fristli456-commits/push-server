const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Заменим на твой ключ
const serviceAccount = require("./serviceAccountKey.json");

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

app.listen(5000, () =>
  console.log("Push server running on port 5000")
);