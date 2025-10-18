/**
 * Test file for name parser utility
 * Run with: node utils/testNameParser.js
 */

const { parseFullName, parseMultipleNames, formatFullName, validateName } = require('./nameParser');

console.log('=== Name Parser Tests ===\n');

// Test cases
const testCases = [
  'John Smith',
  'Dr. Jane Doe',
  'Robert Johnson Jr.',
  'Mary Elizabeth Williams',
  'Mr. James A. Wilson Sr.',
  'Dr. Sarah K. Thompson PhD',
  'Michael',
  'Smith, John',
  'Van Der Berg, Maria Elena',
  'O\'Connor, Patrick',
  'Jean-Paul Sartre',
  'Madonna',
  'Cher'
];

console.log('Individual Name Parsing:');
console.log('='.repeat(50));

testCases.forEach(fullName => {
  const parsed = parseFullName(fullName);
  const validation = validateName(parsed);
  
  console.log(`\nInput: "${fullName}"`);
  console.log(`  First: "${parsed.firstName}"`);
  console.log(`  Last:  "${parsed.lastName}"`);
  console.log(`  Middle: "${parsed.middleName}"`);
  console.log(`  Title: "${parsed.title}"`);
  console.log(`  Suffix: "${parsed.suffix}"`);
  
  if (validation.errors.length > 0) {
    console.log(`  ❌ Errors: ${validation.errors.join(', ')}`);
  }
  if (validation.warnings.length > 0) {
    console.log(`  ⚠️  Warnings: ${validation.warnings.join(', ')}`);
  }
  if (validation.isValid && validation.warnings.length === 0) {
    console.log(`  ✅ Valid`);
  }
});

console.log('\n\nMultiple Names Parsing:');
console.log('='.repeat(50));

const multipleNames = 'John Smith, Dr. Jane Doe, Robert Johnson Jr.';
const parsedMultiple = parseMultipleNames(multipleNames);

console.log(`Input: "${multipleNames}"`);
parsedMultiple.forEach((parsed, index) => {
  console.log(`\nName ${index + 1}:`);
  console.log(`  First: "${parsed.firstName}"`);
  console.log(`  Last:  "${parsed.lastName}"`);
  console.log(`  Full:  "${parsed.fullName}"`);
});

console.log('\n\nName Formatting:');
console.log('='.repeat(50));

const sampleName = parseFullName('Dr. John Michael Smith Jr.');
console.log('Sample parsed name:', sampleName);

console.log(`Full format: "${formatFullName(sampleName)}"`);
console.log(`Without title: "${formatFullName(sampleName, { includeTitle: false })}"`);
console.log(`Without suffix: "${formatFullName(sampleName, { includeSuffix: false })}"`);
console.log(`Last, First: "${formatFullName(sampleName, { format: 'last_first' })}"`);

console.log('\n=== Tests Complete ===');