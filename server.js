const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Разрешаем запросы с вашего фронтенда
app.use(express.json());


const PORT = 4000;
const TG_TOKEN = "8599901880:AAFMVeToYa3267MNjqARUyLyUIolKPdCVMM";
const CHAT_ID = "710003344";

const sendTelegramNotification = (body) => {
    const { name, attendance, selectedDrinks } = body;

    // Формируем список напитков с буллитами
    const drinksList = selectedDrinks.length > 0
        ? selectedDrinks.map(drink => `- ${drink}`).join('%0A')
        : 'Не выбрано';

    const isPresence = attendance === "Да, с удовольствием!"

    // Формируем красивый HTML текст
    const message = [
        `<b>📩 Новая анкета:</b>`,
        `<b>ФИО:</b> ${name}`,
        `<b>Присутствие:</b> ${isPresence ? "✅" : "❌"} ${attendance}`,
        isPresence ? `\n<b>Предпочтения по напиткам:</b>%0A${drinksList}` : ''
    ].join('%0A');

    return message
};


app.get('/', (req, res) => {
    res.send('<h1>Привет! Бэкенд запущен и готов к работе.</h1>');
});


app.post('/api/send-tg', async (req, res) => {
    try {
        console.log("запрос получен: ", req.body)
        const message = sendTelegramNotification(req.body);
        const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}&parse_mode=HTML`
        await axios.get(url);
        console.log("успешно!")
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
