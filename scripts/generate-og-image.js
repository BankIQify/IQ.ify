import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

// Create the public directory if it doesn't exist
if (!existsSync('public')) {
  mkdirSync('public');
}

// Create the image with dimensions 1200x630 (recommended for Open Graph)
sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 30, g: 174, b: 219, alpha: 0.1 }
  }
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <rect width="1200" height="630" fill="rgba(30,174,219,0.1)"/>
          <text x="50%" y="25%" font-family="Arial" font-size="60" fill="rgba(0,0,0,0.9)" text-anchor="middle">
            IQify
          </text>
          <text x="50%" y="45%" font-family="Arial" font-size="30" fill="rgba(0,0,0,0.7)" text-anchor="middle">
            Train Your Brain with IQ Tests and Games
          </text>
          <text x="50%" y="65%" font-family="Arial" font-size="20" fill="rgba(0,0,0,0.6)" text-anchor="middle">
            Join thousands of users improving their cognitive skills daily
          </text>
        </svg>`
      ),
      gravity: 'center'
    }
  ])
  .png()
  .toFile('public/og-image.png')
  .then(() => {
    console.log('Open Graph image generated successfully!');
  })
  .catch(err => {
    console.error('Error generating Open Graph image:', err);
  });
