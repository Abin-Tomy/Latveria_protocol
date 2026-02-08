from django.core.management.base import BaseCommand
from game.models import Level


class Command(BaseCommand):
    help = 'Create initial puzzle levels'

    def handle(self, *args, **kwargs):
        levels_data = [
            {
                'level_number': 1,
                'title': 'Layer 01 - Clock Puzzle',
                'description': 'Check the current time.',
                'puzzle_content': 'Directions can change time. Rotate the arrows to set the correct time (12:15).',
                'answer': 'CLOCK_SOLVED',
                'hint': 'Rotate the arrow and set the clock digits to match the target time.',
                'is_final_level': False
            },
            {
                'level_number': 2,
                'title': 'Layer 02 - Escape System',
                'description': 'URL: Comparison is bad for soul, but it is a functional necessity in escape system survival.',
                'puzzle_content': 'Find the URL containing "esc" and discover the hidden code within the random symbols.',
                'answer': 'CRACK',
                'hint': 'Follow the URL with "esc" in it. Then find "esc" in the code blocks. esc → crack',
                'is_final_level': False
            },
            {
                'level_number': 3,
                'title': 'Layer 03 - Crossword Puzzle',
                'description': 'Solve the crossword puzzle clues to reveal the final message.',
                'puzzle_content': 'Clue 1: I come from the sun or a lamp (LIGHT)\nClue 2: I\'m what you do when you return to a place you have been before (BACK)\nClue 3: I\'m the place where you live with your family (HOME)\nClue 4: I\'m a tiny word, the most common english word (THE)\nClue 5: I\'m a path or a road, I show you which direction to go (WAY)',
                'answer': 'LIGHT THE WAY BACK HOME',
                'hint': 'When all answers are correct, combine the words to reveal the hidden message: LIGHT THE WAY BACK HOME',
                'is_final_level': False
            },
            {
                'level_number': 4,
                'title': 'Layer 04',
                'description': 'Combine all the clue slips you\'ve collected.',
                'puzzle_content': 'The final answer awaits those who paid attention.',
                'answer': 'LOCKSTEP',
                'hint': 'Your physical clues hold the key.',
                'is_final_level': False
            },
            {
                'level_number': 5,
                'title': 'Layer 05',
                'description': 'Placeholder puzzle 5',
                'puzzle_content': 'This is a placeholder for level 5. Update with actual puzzle content.',
                'answer': 'ANSWER5',
                'hint': 'Hint for level 5',
                'is_final_level': False
            },
            {
                'level_number': 6,
                'title': 'Layer 06',
                'description': 'Placeholder puzzle 6',
                'puzzle_content': 'This is a placeholder for level 6. Update with actual puzzle content.',
                'answer': 'ANSWER6',
                'hint': 'Hint for level 6',
                'is_final_level': False
            },
            {
                'level_number': 7,
                'title': 'Layer 07',
                'description': 'Placeholder puzzle 7',
                'puzzle_content': 'This is a placeholder for level 7. Update with actual puzzle content.',
                'answer': 'ANSWER7',
                'hint': 'Hint for level 7',
                'is_final_level': False
            },
            {
                'level_number': 8,
                'title': 'Layer 08',
                'description': 'Placeholder puzzle 8',
                'puzzle_content': 'This is a placeholder for level 8. Update with actual puzzle content.',
                'answer': 'ANSWER8',
                'hint': 'Hint for level 8',
                'is_final_level': False
            },
            {
                'level_number': 9,
                'title': 'Layer 09',
                'description': 'Placeholder puzzle 9',
                'puzzle_content': 'This is a placeholder for level 9. Update with actual puzzle content.',
                'answer': 'ANSWER9',
                'hint': 'Hint for level 9',
                'is_final_level': False
            },
            {
                'level_number': 10,
                'title': 'Layer 10',
                'description': 'Placeholder puzzle 10',
                'puzzle_content': 'This is a placeholder for level 10. Update with actual puzzle content.',
                'answer': 'ANSWER10',
                'hint': 'Hint for level 10',
                'is_final_level': False
            },
            {
                'level_number': 11,
                'title': 'Layer 11',
                'description': 'Placeholder puzzle 11',
                'puzzle_content': 'This is a placeholder for level 11. Update with actual puzzle content.',
                'answer': 'ANSWER11',
                'hint': 'Hint for level 11',
                'is_final_level': False
            },
            {
                'level_number': 12,
                'title': 'Layer 12',
                'description': 'Placeholder puzzle 12',
                'puzzle_content': 'This is a placeholder for level 12. Update with actual puzzle content.',
                'answer': 'ANSWER12',
                'hint': 'Hint for level 12',
                'is_final_level': False
            },
            {
                'level_number': 13,
                'title': 'Layer 13 - Geometric Decryption',
                'description': 'Shape the letter to decrypt',
                'puzzle_content': 'The 4 geometric fragments contain encrypted data.\nArrange them to form the letter "T" to decrypt the message.\n\nDrag pieces to move • Click center circle to rotate 45°',
                'answer': 'TANGRAM',
                'hint': 'Try rotating the pentagon at an angle, not horizontally. The trapezoid goes underneath.',
                'is_final_level': False
            },
            {
                'level_number': 14,
                'title': 'Layer 14 - Consequences of Time',
                'description': 'Remember where it all began',
                'puzzle_content': 'CHOICES HAVE CONSEQUENCES\n\nEvery decision you make leaves a mark in time.\nSome moments are more important than others.\n\nWhen did your journey through this maze truly begin?\nWhat time was on the clock when fate first called?',
                'answer': '12:15',
                'hint': 'Think back to the very first puzzle you encountered. What time did the clock show?',
                'is_final_level': False
            },
            {
                'level_number': 15,
                'title': 'Layer 15 - Final Challenge',
                'description': 'The ultimate test',
                'puzzle_content': 'This is a placeholder for the final level. Update with actual puzzle content.',
                'answer': 'VICTORY',
                'hint': 'Combine everything you\'ve learned.',
                'is_final_level': True
            },
        ]

        created_count = 0
        updated_count = 0

        for level_data in levels_data:
            level, created = Level.objects.update_or_create(
                level_number=level_data['level_number'],
                defaults={
                    'title': level_data['title'],
                    'description': level_data['description'],
                    'puzzle_content': level_data['puzzle_content'],
                    'answer': level_data['answer'],
                    'hint': level_data['hint'],
                    'is_final_level': level_data['is_final_level']
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {level}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'Updated: {level}'))

        self.stdout.write(self.style.SUCCESS(f'\nTotal: {created_count} created, {updated_count} updated'))
