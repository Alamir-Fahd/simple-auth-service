const { Engine } = require('json-rules-engine');
const fs = require('fs');
const path = require('path');
const rulesPath = path.join(__dirname, '../rules.json');
const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
const engine = new Engine();

rulesData.forEach(rule => engine.addRule(rule));

async function evaluate(facts) {
  const enrichedFacts = {
    ...facts,
    debtToIncomeRatio: facts.debtAmount / facts.income
  };

  try {
    
    const { events } = await engine.run(enrichedFacts);

    if (events.length > 0) {
      return events[0].type; 
    }

    return 'referred';
  } catch (error) {
    console.error('Rule Engine Error:', error);
    return 'referred';
  }
}

module.exports = { evaluate };
