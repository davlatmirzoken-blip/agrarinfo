const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        if (!GROQ_API_KEY) {
            return res.status(500).json({ error: "GROQ_API_KEY Render panelida kiritilmagan!" });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Siz qishloq xo'jaligi, o'simliklar va ekinlar bo'yicha tajribali mutaxassis-agronom-maslahatchisiz. Foydalanuvchining savollariga aniq, foydali va qisqa qilib qishloq xo'jaligi bo'yicha maslahat berasiz." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API xatoligi:", data);
            return res.status(500).json({ error: data.error?.message || "Groq API dan xatolik qaytdi" });
        }

        res.json(data);
    } catch (error) {
        console.error("Server xatoligi:", error);
        res.status(500).json({ error: "Serverda ulanish xatoligi yuz berdi" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ishga tushdi: ${PORT}`));
