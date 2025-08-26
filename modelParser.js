const fs = require('fs').promises;
const path = require('path');

async function parseModels(modelsPath) {
  const models = {};
  const files = await fs.readdir(modelsPath);

  for (const file of files) {
    if (path.extname(file) === '.json') {
      const modelId = path.basename(file, '.json');
      const content = await fs.readFile(path.join(modelsPath, file), 'utf8');
      models[modelId] = JSON.parse(content);
    }
  }

  return models;
}

async function mergeParentModels(model, models) {
  if (model.parent) {
    const parent = models[model.parent];
    if (parent) {
      const merged = { ...parent, ...model };
      return await mergeParentModels(merged, models);
    }
  }
  return model;
}

module.exports = { parseModels, mergeParentModels };
