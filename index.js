const mineflayer = require('mineflayer');
const fs = require('fs');

// config.json'u oku
let config;
try {
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} catch (err) {
  console.error("config.json dosyası bulunamadı veya hatalı:", err);
  process.exit(1);
}

// Botu oluştur
let bot = mineflayer.createBot({
  host: config.server,
  username: config.username,
  password: config.password
});

// Sunucuya bağlanınca
bot.on('login', () => {
  console.log('Bot sunucuya bağlandı!');

  // commands varsa çalıştır
  if (config.commands && Array.isArray(config.commands)) {
    config.commands.forEach(cmd => {
      bot.chat(cmd);
    });
  }
});

// Hata olursa yazdır
bot.on('error', err => {
  console.log('Hata:', err);
});

// Bot sunucudan atılırsa tekrar bağlanmayı dene
bot.on('end', () => {
  console.log('Bot sunucudan ayrıldı, yeniden bağlanıyor...');
  setTimeout(() => {
    bot = mineflayer.createBot({
      host: config.server,
      username: config.username,
      password: config.password
    });
  }, 5000);
});
