const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function downloadAssets(mcVersion) {
  const assetsPath = path.join(__dirname, 'assets', mcVersion);
  await fs.mkdir(assetsPath, { recursive: true });

  const jarPath = path.join(assetsPath, 'client.jar');
  const url = `https://piston-data.mojang.com/v1/objects/bb2b6b1aefcd70dfd1892149ac3a215f6c636b07/client.jar`; // Example for 1.20.1, replace with dynamic

  console.log(`Downloading client.jar for ${mcVersion}...`);
  const response = await axios.get(url, { responseType: 'stream' });
  await new Promise((resolve, reject) => {
    const writer = require('fs').createWriteStream(jarPath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  // Extract assets
  console.log('Extracting assets...');
  const extractPath = path.join(assetsPath, 'extracted');
  await fs.mkdir(extractPath, { recursive: true });
  await execAsync(`unzip -q ${jarPath} "assets/minecraft/blockstates/*" "assets/minecraft/models/block/*" "assets/minecraft/textures/block/*" -d ${extractPath}`);

  return path.join(extractPath, 'assets', 'minecraft');
}

module.exports = { downloadAssets };
