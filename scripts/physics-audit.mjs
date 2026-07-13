import { computeTrainState } from '../physics-model.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const cases = [
  { name: 'closed-aligned-right', input: { circuitClosed: true, magnetMode: 'aligned', polarity: 'right', voltage: 1.5 }, expected: { direction: 1, relativeForcePercent: 60 } },
  { name: 'closed-aligned-left', input: { circuitClosed: true, magnetMode: 'aligned', polarity: 'left', voltage: 1.5 }, expected: { direction: -1, relativeForcePercent: 60 } },
  { name: 'open-circuit', input: { circuitClosed: false, magnetMode: 'aligned', polarity: 'right', voltage: 1.5 }, expected: { direction: 0, relativeForcePercent: 0 } },
  { name: 'reversed-magnet', input: { circuitClosed: true, magnetMode: 'opposed', polarity: 'right', voltage: 1.5 }, expected: { direction: 0, relativeForcePercent: 0 } },
  { name: 'low-voltage-boundary', input: { circuitClosed: true, magnetMode: 'aligned', polarity: 'right', voltage: 0.5 }, expected: { direction: 1, relativeForcePercent: 20 } },
  { name: 'voltage-clamped-high', input: { circuitClosed: true, magnetMode: 'aligned', polarity: 'right', voltage: 9 }, expected: { direction: 1, relativeForcePercent: 60 } },
  { name: 'voltage-clamped-low', input: { circuitClosed: true, magnetMode: 'aligned', polarity: 'right', voltage: -2 }, expected: { direction: 1, relativeForcePercent: 20 } }
];

const results = cases.map((test) => {
  const actual = computeTrainState(test.input);
  const passed = Object.entries(test.expected).every(([key, value]) => actual[key] === value);
  return { ...test, actual, passed };
});

for (const result of results) console.log(`${result.passed ? 'PASS' : 'FAIL'} ${result.name}: direction=${result.actual.direction}, force=${result.actual.relativeForcePercent}%`);
const failed = results.filter((result) => !result.passed);
console.log(`Physics invariants: ${results.length - failed.length}/${results.length} passed.`);
await mkdir('audit', { recursive: true });
await writeFile('audit/physics-audit-report.json', JSON.stringify({
  generatedAt: new Date().toISOString(),
  system: 'battery-magnet train inside an uninsulated copper solenoid',
  passed: results.length - failed.length,
  total: results.length,
  results
}, null, 2));
const rows = results.map((result) => `| ${result.passed ? 'PASS' : 'FAIL'} | ${result.name} | ${result.actual.direction} | ${result.actual.relativeForcePercent}% |`).join('\n');
await writeFile('audit/physics-audit-report.md', `# Physics Audit Report\n\n- System: battery-magnet train inside an uninsulated copper solenoid\n- Sign convention: +1 right, -1 left, 0 no sustained motion\n- Result: ${results.length - failed.length}/${results.length} invariants passed\n\n| Status | Case | Direction | Relative force |\n|---|---|---:|---:|\n${rows}\n\nRelative force is a teaching index, not a value in newtons. Friction, contact resistance, battery internal resistance, heating and terminal speed are outside this model.\n`);
if (failed.length) process.exit(1);
