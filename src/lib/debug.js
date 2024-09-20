const fetch = require("node-fetch");

async function teleBot(log, message, chat_id = '-992983622') {
    let tele  = await fetch("https://api.telegram.org/bot6137483563:AAGy6nMRyWmV6lzSvnScf-NsmJZJ7ElUGOg/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chat_id,
            text: `${log} \n ${JSON.stringify(message)}`
        }),
    });
    tele = await tele.json();

    console.log("tele------------------------------", tele);
    return tele;
}

module.exports= {
    teleBot
};