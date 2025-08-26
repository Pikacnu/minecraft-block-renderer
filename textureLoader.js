const fs = require('fs').promises;
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

async function loadTextures(texturesPath) {
  const textures = {};
  const files = await fs.readdir(texturesPath);

  for (const file of files) {
    if (path.extname(file) === '.png') {
      const textureId = path.basename(file, '.png');
      const image = await loadImage(path.join(texturesPath, file));
      textures[textureId] = image;
    }
  }

  return textures;
}

async function getTextureFrame(texture, frame = 0) {
  // For animated textures, return the first frame by default
  // Implement animation parsing if needed
  return texture;
}

module.exports = { loadTextures, getTextureFrame };
