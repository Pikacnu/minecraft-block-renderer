const { generateAllStates } = require('./generateAllStates');
const { runSmokeTest } = require('./smokeTest');

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--smoke-test')) {
    await runSmokeTest();
  } else {
    await generateAllStates();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
