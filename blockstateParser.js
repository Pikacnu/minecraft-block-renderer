const fs = require('fs').promises;
const path = require('path');

async function parseBlockstates(blockstatesPath) {
  const blockstates = {};
  const files = await fs.readdir(blockstatesPath);

  for (const file of files) {
    if (path.extname(file) === '.json') {
      const blockId = path.basename(file, '.json');
      const content = await fs.readFile(path.join(blockstatesPath, file), 'utf8');
      blockstates[blockId] = JSON.parse(content);
    }
  }

  return blockstates;
}

module.exports = { parseBlockstates };
