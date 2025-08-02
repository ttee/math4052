const mongoose = require('mongoose');
const Question = require('./models/Question');
const dotenv = require('dotenv');

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Question.deleteMany({});
    await Question.create([
      {
        text: 'Solve \\( x^2 - 5x + 6 = 0 \\)',
        options: ['(x-1)(x-6)=0', '(x-2)(x-3)=0', '(x-4)(x-2)=0', '(x-5)(x-1)=0'],
        correctAnswer: 1,
        explanation: 'Step 1: Find factors of 6 that add to -5: -2 and -3.\nStep 2: (x-2)(x-3)=0.\nStep 3: Roots x=2, x=3.',
      },
      // Add more seed questions for multi-quiz testing
      {
        text: 'What is \\( 2 + 2 \\)?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: 'Basic addition.',
      },
    ]);
    console.log('Seeded questions');
    process.exit();
  })
  .catch(err => console.error(err));