const https = require('https');
const fs = require('fs');
const path = require('path');

const fontUrl = 'https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf';
const fontDir = path.join(__dirname, '../assets/fonts');
const fontPath = path.join(fontDir, 'PressStart2P-Regular.ttf');

// Create fonts directory if it doesn't exist
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

// Download the font
console.log('Downloading PressStart2P font...');
https.get(fontUrl, (response) => {
  const fileStream = fs.createWriteStream(fontPath);
  response.pipe(fileStream);
  
  fileStream.on('finish', () => {
    console.log('Font downloaded successfully!');
    fileStream.close();
  });
}).on('error', (err) => {
  console.error('Error downloading font:', err);
}); 