/**
 * seedCatalogue.js
 * -----------------
 * Seeds the full Course Catalogue into MongoDB Atlas.
 * Uses upsert (insertOrUpdate) so running it multiple times is safe —
 * it will NOT delete existing data or videos.
 *
 * Run with:
 *   node server/seedCatalogue.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./models/Course');

const courses = [
  {
    title: "Environmental Science-1",
    subject: "Science",
    description: "Environmental Science-1 covers fundamental concepts of ecology, biodiversity, and natural resource management. It contains 12 lectures and 7 quizzes.",
    instructor: "Aayush Talreja",
    instructorImg: "https://media.licdn.com/dms/image/C4D03AQGjVJnZjakikg/profile-displayphoto-shrink_200_200/0/1657648501282?e=1685577600&v=beta&t=GZVLCtCI6mAVh0T4uTBJODcNWased_DRS3pxg73A7Vk",
    thumbnail: "/evs.png",
    videoCount: 12,
    price: 0,
    level: "Beginner",
    duration: "6h 30m",
  },
  {
    title: "Environmental Science-2",
    subject: "Science",
    description: "Environmental Science-2 dives deeper into environmental pollution, climate change, and sustainable development. It contains 12 lectures and 7 quizzes.",
    instructor: "Niranjan Yeole",
    instructorImg: "https://media.licdn.com/dms/image/C4E03AQFMaAxosx5O8A/profile-displayphoto-shrink_100_100/0/1642847850390?e=1685577600&v=beta&t=LDCn4WpFeU6vUMdAP6e9nQf4Cdz4DNs6zvy52GHkwVI",
    thumbnail: "/evs.png",
    videoCount: 12,
    price: 0,
    level: "Intermediate",
    duration: "6h 30m",
  },
  {
    title: "EVS-Practical",
    subject: "Science",
    description: "EVS Practical contains hands-on experiments covering basic science concepts. Includes 5 lab sessions.",
    instructor: "Anuj Bagad",
    instructorImg: "https://media.licdn.com/dms/image/C4D03AQG7ln3Kb53VZA/profile-displayphoto-shrink_100_100/0/1641273867979?e=1685577600&v=beta&t=QRlrRpePXwAuUynmY0zhCahF2ZU4cKns6uUqbDMdIZE",
    thumbnail: "/evs.png",
    videoCount: 5,
    price: 0,
    level: "Beginner",
    duration: "3h 00m",
  },
  {
    title: "Basics of Mathematics",
    subject: "Mathematics",
    description: "Covers number systems, arithmetic operations, fractions, decimals, and introductory algebra. It contains 12 lectures and 7 quizzes.",
    instructor: "Sachin Bellani",
    instructorImg: "https://media.licdn.com/dms/image/D4D03AQG3tgMaLVMfug/profile-displayphoto-shrink_100_100/0/1666875030217?e=1685577600&v=beta&t=vfoT736oR7cZXkuDcl9J6ZSnJIOaJzpkaJ1D-Y6qh_0",
    thumbnail: "/math.png",
    videoCount: 12,
    price: 0,
    level: "Beginner",
    duration: "5h 00m",
  },
  {
    title: "Simplified Mathematics",
    subject: "Mathematics",
    description: "Makes complex math topics easy and approachable with step-by-step explanations. It contains 12 lectures and 7 quizzes.",
    instructor: "Shams Tabrez",
    instructorImg: "",
    thumbnail: "/math.png",
    videoCount: 12,
    price: 0,
    level: "Beginner",
    duration: "5h 00m",
  },
  {
    title: "English",
    subject: "English",
    description: "Covers vocabulary, comprehension, story-telling, and communication skills. It contains 10 lectures and 5 quizzes.",
    instructor: "Shams Tabrez",
    instructorImg: "",
    thumbnail: "/eng.jpg",
    videoCount: 10,
    price: 0,
    level: "Beginner",
    duration: "4h 30m",
  },
  {
    title: "English Grammar",
    subject: "English",
    description: "Covers parts of speech, sentence structure, tenses, punctuation and writing skills. It contains 10 lectures and 5 quizzes.",
    instructor: "Shams Tabrez",
    instructorImg: "",
    thumbnail: "/enggram.jpg",
    videoCount: 10,
    price: 0,
    level: "Intermediate",
    duration: "4h 30m",
  },
  {
    title: "Hindi",
    subject: "Hindi",
    description: "Covers reading, writing, comprehension, and communication in Hindi language. It contains 10 lectures and 5 quizzes.",
    instructor: "Shams Tabrez",
    instructorImg: "",
    thumbnail: "/hin.png",
    videoCount: 10,
    price: 0,
    level: "Beginner",
    duration: "4h 00m",
  },
  {
    title: "Hindi Vyakaran",
    subject: "Hindi",
    description: "Covers grammar rules, sandhi, samas, karak, and literary forms of the Hindi language. It contains 10 lectures and 5 quizzes.",
    instructor: "Shams Tabrez",
    instructorImg: "",
    thumbnail: "/hin.png",
    videoCount: 10,
    price: 0,
    level: "Intermediate",
    duration: "4h 00m",
  }
];

const seedCatalogue = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    let inserted = 0;
    let updated = 0;

    for (const course of courses) {
      const existing = await Course.findOne({ title: course.title });

      if (existing) {
        // Update existing course fields (but keep rating/enrolledCount/ratingCount intact)
        await Course.findByIdAndUpdate(existing._id, {
          $set: {
            subject: course.subject,
            description: course.description,
            instructor: course.instructor,
            instructorImg: course.instructorImg,
            thumbnail: course.thumbnail,
            price: course.price,
            level: course.level,
            duration: course.duration,
          }
        });
        console.log(`  🔄 Updated: ${course.title}`);
        updated++;
      } else {
        await Course.create({
          ...course,
          rating: 0,
          ratingCount: 0,
          enrolledCount: 0,
        });
        console.log(`  ➕ Inserted: ${course.title}`);
        inserted++;
      }
    }

    console.log(`\n✅ Catalogue Seeding Complete!`);
    console.log(`   Inserted : ${inserted} courses`);
    console.log(`   Updated  : ${updated} courses`);
    console.log(`   Total    : ${courses.length} courses in MongoDB\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Failed:', err.message);
    process.exit(1);
  }
};

seedCatalogue();
