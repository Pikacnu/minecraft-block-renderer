const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const JSZip = require('jszip');
const { downloadAssets } = require('./assetDownloader');
const { parseBlockstates } = require('./blockstateParser');
const { parseModels } = require('./modelParser');
const { loadTextures } = require('./textureLoader');
const { renderBlock } = require('./renderer');
const { computeHash } = require('./hashUtil');

const MC_VERSION = process.env.MC_VERSION || '1.20.1';
const BLOCK_ID_FILTER = process.env.BLOCK_ID_FILTER || null;
const PROP_INCLUDE = process.env.PROP_INCLUDE ? process.env.PROP_INCLUDE.split(',') : [];
const LIMIT = parseInt(process.env.LIMIT) || Infinity;
const KEEP_EXISTING = process.env.KEEP_EXISTING === '1';

async function generateAllStates() {
  console.log('Starting Minecraft Block Renderer...');

  // Download and extract assets
  const assetsPath = await downloadAssets(MC_VERSION);

  // Load blockstates, models, textures
  const blockstates = await parseBlockstates(path.join(assetsPath, 'blockstates'));
  const models = await parseModels(path.join(assetsPath, 'models'));
  const textures = await loadTextures(path.join(assetsPath, 'textures'));

  // Load existing blockData if KEEP_EXISTING
  let blockData = {};
  if (KEEP_EXISTING && await fs.access('blockData.json').then(() => true).catch(() => false)) {
    const data = await fs.readFile('blockData.json', 'utf8');
    blockData = JSON.parse(data);
  }

  const outputDir = 'output';
  await fs.mkdir(outputDir, { recursive: true });

  let count = 0;
  const zip = new JSZip();

  for (const [blockId, blockstate] of Object.entries(blockstates)) {
    if (BLOCK_ID_FILTER && !blockId.includes(BLOCK_ID_FILTER)) continue;
    if (count >= LIMIT) break;

    const variants = blockstate.variants || {};
    const multipart = blockstate.multipart || [];

    // Process variants
    for (const [variantKey, variant] of Object.entries(variants)) {
      if (PROP_INCLUDE.length > 0 && !PROP_INCLUDE.some(prop => variantKey.includes(prop))) continue;

      try {
        const renderedData = await renderBlock(blockId, variantKey, variant, models, textures);
        const filename = `${blockId.replace(':', '_')}_${variantKey.replace(/[,=]/g, '_')}.png`;
        const filePath = path.join(outputDir, filename);

        await fs.writeFile(filePath, renderedData.pngBuffer);

        const hash = computeHash(renderedData.pngBuffer);
        blockData[`${blockId}:${variantKey}`] = {
          generatedFile: filename,
          hash,
          model: variant.model,
          variantKey,
          errors: []
        };

        zip.file(filename, renderedData.pngBuffer);
        count++;
      } catch (error) {
        blockData[`${blockId}:${variantKey}`] = {
          generatedFile: null,
          hash: null,
          model: variant.model,
          variantKey,
          errors: [error.message]
        };
      }
    }

    // Process multipart (simplified)
    if (multipart.length > 0) {
      // Implement multipart logic here
      // For now, skip or handle as single variant
    }
  }

  // Write blockData.json
  await fs.writeFile('blockData.json', JSON.stringify(blockData, null, 2));
  zip.file('blockData.json', JSON.stringify(blockData, null, 2));

  // Generate ZIP
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  await fs.writeFile('minecraft-blocks.zip', zipBuffer);

  console.log(`Generated ${count} blocks. Output in ${outputDir}, ZIP: minecraft-blocks.zip`);
}

module.exports = { generateAllStates };
