const { generateAllStates } = require('./generateAllStates');

async function runSmokeTest() {
  console.log('Running smoke test for stone block...');
  process.env.BLOCK_ID_FILTER = 'stone';
  process.env.LIMIT = '1';
  await generateAllStates();
  console.log('Smoke test completed.');
}

module.exports = { runSmokeTest };
