import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TrustpilotReviewModel } from '../models/Statistics';

// Load environment variables
dotenv.config();

const trustpilotReviews = [
  {
    id: 'tp-001',
    name: 'Tejaswi Pasumarthi',
    avatar: 'TP',
    location: 'GB',
    reviewCount: 2,
    rating: 1,
    title: 'Fraud Edtech don\'t go for it',
    review: 'Hi these people and the whole program is a fraud.. stay away from these people.. Akash made me pay 200£ and the tutor akarshit demo and the knowledge is very disappointing.. ask them to send u demo classes before u lose your money ..\nI asked them a refund straight after two sessions as I understood I cannot gain any knowledge there is no support and they won\'t even pick my calls.. imagine what would happen once you pay 1000 bucks.. forget about job guarantee u wouldn\'t even gain anh knowledge for sure.. I\'m experienced software employee with Masters in Computer Science and please don\'t get fooled by these poeple',
    reviewDate: 'September 20, 2025',
    verified: true
  },
  {
    id: 'tp-002',
    name: 'Naseer Ahmad',
    avatar: 'NA',
    location: 'GB',
    reviewCount: 1,
    rating: 5,
    title: 'Edtech Informative was a game-changer…',
    review: 'Edtech Informative was a game-changer for Data Analytics and AI program. The structured study plan, regular mocks, and personalized mentorship were invaluable, especially for my weakest section. Their mock analysis and recorded sessions were extremely helpful in projects, internships,ensuring I never missed important content. The platform helped me achieve a remarkable outcome.',
    reviewDate: 'September 18, 2025',
    verified: true
  },
  {
    id: 'tp-003',
    name: 'Pavan',
    avatar: 'https://user-images.trustpilot.com/68d8c4e3412e4c6875561d59/73x73.png',
    location: 'GB',
    reviewCount: 1,
    rating: 5,
    title: 'Great learning experience and highly practical program',
    review: 'I had a really good experience with this program.the structure is clear,easy to follow,and very practical. The content isn\'t just theory - its focus on real world skills that I can directly apply to my career',
    reviewDate: 'July 19, 2025',
    verified: true
  },
  {
    id: 'tp-004',
    name: 'customer',
    avatar: 'CU',
    location: 'GB',
    reviewCount: 3,
    rating: 5,
    title: 'It\'s very informative and clear sessions',
    review: 'It\'s very informative and clear sessions',
    reviewDate: 'August 2, 2025',
    verified: true
  },
  {
    id: 'tp-005',
    name: 'Varun Wadhwa',
    avatar: 'VW',
    location: 'GB',
    reviewCount: 1,
    rating: 5,
    title: 'If you\'re looking for the career switch…',
    review: 'If you\'re looking for the career switch there are the best in that.\nGreat support From starting to end\nMentor are the best in coaching and really supportive you can ask anything at anytime.\nRight platform for the one who\'s really interested and seeking to have a career switch among all.',
    reviewDate: 'September 17, 2025',
    verified: true
  },
  {
    id: 'tp-006',
    name: 'Akash Rana',
    avatar: 'https://user-images.trustpilot.com/68caeb558a838ce0476f6446/73x73.png',
    location: 'GB',
    reviewCount: 1,
    rating: 4,
    title: 'I had a great time with Edtech…',
    review: 'I had a great time with Edtech Informative, the Instructors were helpful and very skilled. Live sessions were great. They took care of everything from my learning to earning part. Got me the internship first and than a good job.\nAll thanks to team of Edtech informative.',
    reviewDate: 'September 14, 2025',
    verified: true
  },
  {
    id: 'tp-007',
    name: 'Amaka Egwuogu',
    avatar: 'AE',
    location: 'GB',
    reviewCount: 1,
    rating: 5,
    title: 'I had zero coding background but this…',
    review: 'I had zero coding background but this program made python and sql super easy for me.',
    reviewDate: 'September 3, 2025',
    verified: true
  },
  {
    id: 'tp-008',
    name: 'shanaya',
    avatar: 'https://user-images.trustpilot.com/689f2269b7b817dbda7aa925/73x73.png',
    location: 'GB',
    reviewCount: 1,
    rating: 5,
    title: 'I was completed My Data Analytics…',
    review: 'I was completed My Data Analytics program from edtech informative , that was great experience  and i got a job in PWC . The faculties there are very supportive and their classes are very understandable so thank you so much for bringing growth in my career.',
    reviewDate: 'September 10, 2025',
    verified: true
  }
];

async function seedTrustpilotReviews() {
  try {
    // Connect to MongoDB using the same connection string as the server
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edtech';
    console.log('Connecting to MongoDB...');
    console.log('URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing trustpilot reviews
    await TrustpilotReviewModel.deleteMany({});
    console.log('✅ Cleared existing Trustpilot reviews');

    // Insert new reviews
    const insertedReviews = await TrustpilotReviewModel.insertMany(trustpilotReviews);
    console.log(`✅ Successfully seeded ${insertedReviews.length} Trustpilot reviews`);

    // Display summary
    console.log('\n=== Seeded Reviews Summary ===');
    insertedReviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.name} - ${review.rating} stars - "${review.title}"`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding Trustpilot reviews:', error);
    process.exit(1);
  }
}

// Run the seed function
seedTrustpilotReviews();
