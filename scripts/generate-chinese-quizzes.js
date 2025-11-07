#!/usr/bin/env node

/**
 * Script to automatically generate Chinese quiz JSON from raw question data
 * Updates question numbers, quiz numbers, and API endpoints automatically
 *
 * Usage:
 * node scripts/generate-chinese-quizzes.js
 */

const fs = require('fs');
const path = require('path');

// Raw quiz data - paste your questions here
const rawQuizzes = [
  {
    type: 'simulator',
    questions: [
      {
        question: "關於大型商用載貨車，以下哪一項為正確？",
        options: [
          "這列車由許多拖車製成，使其與載客用車相較更容易操作。",
          "他們有大盲點，這使得運貨卡車駕駛員難以看到其他車輛。",
          "他們有大而強的緊急煞車，這使他們能夠快速停車。"
        ],
        correctAnswer: 1, // b = index 1
        category: "安全",
        difficulty: "medium"
      },
      // Add more questions...
    ]
  },
  {
    type: 'practice',
    number: 1,
    questions: [
      // Practice test 1 questions...
    ]
  }
];

/**
 * Generate quiz ID based on type and number
 */
function generateQuizId(type, number = null) {
  if (type === 'simulator') {
    return 'chinese-simulator-test';
  }
  return `chinese-practice-test-${number}`;
}

/**
 * Generate quiz title
 */
function generateQuizTitle(type, number = null) {
  if (type === 'simulator') {
    return 'DMV Chinese Simulator Test / DMV 中文模擬考試';
  }
  return `DMV Chinese Practice Test #${number} / DMV 中文練習考試 #${number}`;
}

/**
 * Generate quiz description
 */
function generateQuizDescription(type) {
  if (type === 'simulator') {
    return 'California DMV 中文模擬考試 - 基本交通規則和標誌。California DMV Chinese driving simulator test with 10 real questions.';
  }
  return 'California DMV 中文練習考試 - 基本交通規則和標誌。California DMV Chinese driving practice test with 10 real questions.';
}

/**
 * Generate quiz slug
 */
function generateQuizSlug(type, number = null) {
  if (type === 'simulator') {
    return 'simulator-test';
  }
  return `practice-test-${number}`;
}

/**
 * Generate explanation from question and correct answer
 */
function generateExplanation(question, options, correctAnswerIndex) {
  const correctOption = options[correctAnswerIndex];
  return correctOption;
}

/**
 * Process and number questions automatically
 */
function processQuestions(questions) {
  return questions.map((q, index) => ({
    id: index + 1,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || generateExplanation(q.question, q.options, q.correctAnswer),
    category: q.category || "一般",
    difficulty: q.difficulty || "medium"
  }));
}

/**
 * Generate complete quiz object
 */
function generateQuiz(quizData, index) {
  const type = quizData.type;
  const number = type === 'practice' ? (quizData.number || index) : null;

  return {
    id: generateQuizId(type, number),
    title: generateQuizTitle(type, number),
    description: generateQuizDescription(type),
    category: "Chinese Tests / 中文考試",
    slug: generateQuizSlug(type, number),
    passingScore: 85,
    timeLimit: 30,
    language: "zh",
    questions: processQuestions(quizData.questions)
  };
}

/**
 * Generate the complete JSON file
 */
function generateChineseQuizzesJSON(quizzesData) {
  const quizzes = quizzesData.map((quizData, index) => generateQuiz(quizData, index));

  return {
    quizzes: quizzes
  };
}

/**
 * Parse answers from string format (e.g., "1a 2b 3c")
 * Returns array of answer indices (a=0, b=1, c=2)
 */
function parseAnswers(answerString) {
  const answerMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
  const matches = answerString.toLowerCase().match(/\d+[a-d]/g);

  if (!matches) return [];

  return matches.map(match => {
    const letter = match.slice(-1);
    return answerMap[letter];
  });
}

/**
 * Convert answer letter to index (a=0, b=1, c=2, d=3)
 */
function answerToIndex(letter) {
  const map = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
  return map[letter.toLowerCase()];
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateQuizId,
    generateQuizTitle,
    generateQuizDescription,
    generateQuizSlug,
    generateExplanation,
    processQuestions,
    generateQuiz,
    generateChineseQuizzesJSON,
    parseAnswers,
    answerToIndex
  };
}

// Main execution if run directly
if (require.main === module) {
  console.log('Chinese Quiz Generator');
  console.log('======================\n');
  console.log('This script helps generate properly formatted Chinese quiz JSON files.');
  console.log('Edit the rawQuizzes array in this file with your question data.\n');

  // Example: Generate and save
  if (rawQuizzes.length > 0 && rawQuizzes[0].questions.length > 0) {
    const output = generateChineseQuizzesJSON(rawQuizzes);
    const outputPath = path.join(__dirname, '../src/data/chinese-quizzes-generated.json');

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`✓ Generated ${output.quizzes.length} quizzes`);
    console.log(`✓ Saved to: ${outputPath}`);
  } else {
    console.log('No quiz data found. Please edit the rawQuizzes array in this script.');
  }
}
