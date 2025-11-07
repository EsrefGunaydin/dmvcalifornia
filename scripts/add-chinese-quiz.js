#!/usr/bin/env node

/**
 * Add Chinese Quiz Script
 *
 * This script automatically:
 * 1. Reads existing chinese-quizzes.json
 * 2. Determines the next quiz number
 * 3. Generates proper IDs, titles, and endpoints
 * 4. Numbers questions automatically
 * 5. Saves the updated file
 *
 * Usage:
 * node scripts/add-chinese-quiz.js <type> <questions-file>
 *
 * Example:
 * node scripts/add-chinese-quiz.js practice questions.txt
 * node scripts/add-chinese-quiz.js simulator questions.txt
 */

const fs = require('fs');
const path = require('path');

const QUIZ_FILE = path.join(__dirname, '../src/data/chinese-quizzes.json');

/**
 * Parse answer letter to index
 */
function answerToIndex(letter) {
  const map = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
  return map[letter.toLowerCase()];
}

/**
 * Get next quiz number based on existing quizzes
 */
function getNextQuizNumber(quizzes, type) {
  if (type === 'simulator') {
    // Check if simulator already exists
    const hasSimulator = quizzes.some(q => q.id === 'chinese-simulator-test');
    return hasSimulator ? null : 0; // null means simulator already exists
  }

  // For practice tests, find highest number
  const practiceQuizzes = quizzes.filter(q => q.id.startsWith('chinese-practice-test-'));
  if (practiceQuizzes.length === 0) return 1;

  const numbers = practiceQuizzes.map(q => {
    const match = q.id.match(/chinese-practice-test-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });

  return Math.max(...numbers) + 1;
}

/**
 * Generate quiz object
 */
function createQuiz(type, number, questions) {
  const isSimulator = type === 'simulator';
  const id = isSimulator ? 'chinese-simulator-test' : `chinese-practice-test-${number}`;
  const title = isSimulator
    ? 'DMV Chinese Simulator Test / DMV 中文模擬考試'
    : `DMV Chinese Practice Test #${number} / DMV 中文練習考試 #${number}`;
  const slug = isSimulator ? 'simulator-test' : `practice-test-${number}`;
  const description = isSimulator
    ? 'California DMV 中文模擬考試 - 基本交通規則和標誌。California DMV Chinese driving simulator test with 10 real questions.'
    : 'California DMV 中文練習考試 - 基本交通規則和標誌。California DMV Chinese driving practice test with 10 real questions.';

  // Number questions automatically
  const numberedQuestions = questions.map((q, index) => ({
    ...q,
    id: index + 1
  }));

  return {
    id,
    title,
    description,
    category: "Chinese Tests / 中文考試",
    slug,
    passingScore: 85,
    timeLimit: 30,
    language: "zh",
    questions: numberedQuestions
  };
}

/**
 * Add new quiz to existing file
 */
function addQuiz(type, questions) {
  // Read existing file
  const data = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));

  // Get next number
  const number = getNextQuizNumber(data.quizzes, type);

  if (number === null) {
    console.error('❌ Error: Simulator test already exists!');
    process.exit(1);
  }

  // Create new quiz
  const newQuiz = createQuiz(type, number, questions);

  // Add to array
  data.quizzes.push(newQuiz);

  // Save file
  fs.writeFileSync(QUIZ_FILE, JSON.stringify(data, null, 2), 'utf8');

  console.log('✓ Successfully added quiz!');
  console.log(`  ID: ${newQuiz.id}`);
  console.log(`  Title: ${newQuiz.title}`);
  console.log(`  Questions: ${newQuiz.questions.length}`);
  console.log(`  API Endpoint: /api/quizzes/${newQuiz.id}`);
}

/**
 * Update question numbers in existing quizzes
 */
function renumberAllQuestions() {
  const data = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));

  let updated = false;
  data.quizzes.forEach(quiz => {
    quiz.questions.forEach((q, index) => {
      if (q.id !== index + 1) {
        q.id = index + 1;
        updated = true;
      }
    });
  });

  if (updated) {
    fs.writeFileSync(QUIZ_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('✓ Renumbered all questions');
  } else {
    console.log('✓ All questions already properly numbered');
  }
}

/**
 * List all existing quizzes
 */
function listQuizzes() {
  const data = JSON.parse(fs.readFileSync(QUIZ_FILE, 'utf8'));

  console.log('\nExisting Chinese Quizzes:');
  console.log('=========================\n');

  data.quizzes.forEach((quiz, index) => {
    console.log(`${index + 1}. ${quiz.title}`);
    console.log(`   ID: ${quiz.id}`);
    console.log(`   Questions: ${quiz.questions.length}`);
    console.log(`   API: /api/quizzes/${quiz.id}\n`);
  });

  console.log(`Total: ${data.quizzes.length} quizzes`);
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('Chinese Quiz Manager');
  console.log('====================\n');
  console.log('Commands:');
  console.log('  list              - List all existing quizzes');
  console.log('  renumber          - Renumber all question IDs');
  console.log('  add <type>        - Add new quiz (interactive)');
  console.log('\nExamples:');
  console.log('  node scripts/add-chinese-quiz.js list');
  console.log('  node scripts/add-chinese-quiz.js renumber');
  console.log('  node scripts/add-chinese-quiz.js add practice');
  process.exit(0);
}

switch (command) {
  case 'list':
    listQuizzes();
    break;

  case 'renumber':
    renumberAllQuestions();
    break;

  case 'add':
    console.log('Interactive quiz addition not yet implemented.');
    console.log('Please edit the chinese-quizzes.json file directly or');
    console.log('use the existing pattern to add new quizzes.');
    break;

  default:
    console.log(`Unknown command: ${command}`);
    console.log('Run without arguments to see available commands.');
    process.exit(1);
}
