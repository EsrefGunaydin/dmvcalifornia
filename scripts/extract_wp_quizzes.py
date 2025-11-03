#!/usr/bin/env python3
"""
WordPress Quiz Data Extractor
Extracts quiz data from WP Pro Quiz plugin and converts to JSON
"""

import re
import json
import phpserialize
from datetime import datetime
from collections import defaultdict

def unserialize_php(data):
    """Deserialize PHP serialized data"""
    try:
        return phpserialize.loads(data.encode('utf-8'), decode_strings=True)
    except Exception as e:
        print(f"Error deserializing: {e}")
        return None

def extract_quiz_master(sql_content):
    """Extract quiz metadata from wp_wp_pro_quiz_master"""
    quizzes = []

    # Find the INSERT statement
    master_pattern = r"INSERT INTO `wp_wp_pro_quiz_master`.*?VALUES\s*(.*?)(?=\n-- |\nCREATE|INSERT INTO `wp_wp_pro_quiz_prerequisite|$)"
    match = re.search(master_pattern, sql_content, re.DOTALL)

    if not match:
        print("No quiz master data found")
        return quizzes

    values_section = match.group(1)

    # Parse individual quiz records
    # Pattern to match (id, 'name', 'text', ...)
    quiz_pattern = r"\((\d+),\s*'([^']*)',\s*'((?:[^'\\\\]|\\\\.)*)'"

    for quiz_match in re.finditer(quiz_pattern, values_section):
        try:
            quiz_id = int(quiz_match.group(1))
            quiz_name = quiz_match.group(2)
            quiz_desc = quiz_match.group(3).replace("\\'", "'").replace("\\r\\n", "\n")

            # Extract full record for this quiz (simplified)
            # Find the complete record by ID
            record_pattern = rf"\({quiz_id},\s*'[^']*',.*?\),\n"
            record_match = re.search(record_pattern, values_section, re.DOTALL)

            if record_match:
                record = record_match.group(0)

                # Extract key fields (this is simplified - real parsing would be more complex)
                quiz_data = {
                    'wpQuizId': quiz_id,
                    'title': quiz_name,
                    'description': quiz_desc,
                    'slug': quiz_name.lower().replace(' ', '-').replace('/', '-'),
                    'language': 'ENGLISH',  # Default
                    'difficulty': 'BEGINNER',
                    'category': 'GENERAL'
                }

                # Detect language from title
                if 'turkish' in quiz_name.lower() or 'türkçe' in quiz_name.lower():
                    quiz_data['language'] = 'TURKISH'
                elif 'español' in quiz_name.lower() or 'spanish' in quiz_name.lower():
                    quiz_data['language'] = 'SPANISH'

                # Detect category from title
                if 'sign' in quiz_name.lower():
                    quiz_data['category'] = 'ROAD_SIGNS'
                elif 'driving' in quiz_name.lower():
                    quiz_data['category'] = 'GENERAL'

                quizzes.append(quiz_data)
                print(f"✓ Extracted quiz: {quiz_name} (ID: {quiz_id})")

        except Exception as e:
            print(f"Error parsing quiz: {e}")
            continue

    return quizzes

def extract_quiz_questions(sql_content):
    """Extract questions and answers from wp_wp_pro_quiz_question"""
    questions_by_quiz = defaultdict(list)

    # Find all INSERT statements for questions
    question_pattern = r"INSERT INTO `wp_wp_pro_quiz_question`.*?VALUES\s*(.*?);"
    matches = re.finditer(question_pattern, sql_content, re.DOTALL)

    for match in matches:
        values_section = match.group(1)

        # Parse individual question records
        # Pattern: (id, quiz_id, online, sort, 'title', points, 'question', ...)
        row_pattern = r"\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']*)',\s*(\d+),\s*'((?:[^'\\\\]|\\\\[\\\\'])*)',\s*'([^']*)',\s*'([^']*)',"

        for row in re.finditer(row_pattern, values_section):
            try:
                question_id = int(row.group(1))
                quiz_id = int(row.group(2))
                online = int(row.group(3))
                sort_order = int(row.group(4))
                title = row.group(5)
                points = int(row.group(6))
                question_text = row.group(7).replace("\\'", "'").replace("\\r\\n", "\n")
                correct_msg = row.group(8)
                incorrect_msg = row.group(9)

                # Extract answer_data (this is a simplified approach)
                # In reality, we need to find the serialized answer_data field
                # For now, we'll create a placeholder structure

                question_data = {
                    'wpQId': question_id,
                    'quizId': quiz_id,
                    'question': question_text,
                    'explanation': correct_msg if correct_msg else None,
                    'order': sort_order,
                    'points': points,
                    'answerType': 'SINGLE_CHOICE',
                    'answers': []  # Will be populated from answer_data
                }

                questions_by_quiz[quiz_id].append(question_data)

            except Exception as e:
                print(f"Error parsing question: {e}")
                continue

    return questions_by_quiz

def main():
    print("=" * 60)
    print("WordPress Quiz Data Extractor")
    print("=" * 60)

    # Read SQL file
    sql_file = '../data/wordpress/dmvcali2.sql'
    print(f"\n📂 Reading: {sql_file}")

    try:
        with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
            sql_content = f.read()

        print(f"   File size: {len(sql_content) / (1024*1024):.2f} MB\n")

        # Extract quizzes
        print("📊 Extracting quiz metadata...")
        quizzes = extract_quiz_master(sql_content)
        print(f"   Found {len(quizzes)} quizzes\n")

        # Extract questions
        print("❓ Extracting quiz questions...")
        questions_by_quiz = extract_quiz_questions(sql_content)
        print(f"   Found questions for {len(questions_by_quiz)} quizzes\n")

        # Combine quizzes with their questions
        for quiz in quizzes:
            quiz_id = quiz['wpQuizId']
            if quiz_id in questions_by_quiz:
                quiz['questions'] = questions_by_quiz[quiz_id]
                print(f"   {quiz['title']}: {len(quiz['questions'])} questions")

        # Save to JSON
        output_file = 'extracted_quizzes.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'extracted_at': datetime.now().isoformat(),
                'quizzes': quizzes,
                'total_quizzes': len(quizzes),
                'total_questions': sum(len(q.get('questions', [])) for q in quizzes)
            }, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Extraction complete!")
        print(f"   Saved to: {output_file}")
        print(f"   Total quizzes: {len(quizzes)}")
        print(f"   Total questions: {sum(len(q.get('questions', [])) for q in quizzes)}")

        # Print summary
        print("\n" + "=" * 60)
        print("Quiz Summary:")
        print("=" * 60)
        for quiz in quizzes:
            print(f"\n📝 {quiz['title']}")
            print(f"   Language: {quiz['language']}")
            print(f"   Category: {quiz['category']}")
            print(f"   Questions: {len(quiz.get('questions', []))}")
            print(f"   Slug: {quiz['slug']}")

    except FileNotFoundError:
        print(f"❌ Error: Could not find {sql_file}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
