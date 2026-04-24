import React from "react";
import { useSpeechSynthesis } from 'react-speech-kit';

const links = [
  { name: 'Open roles', href: '#' },
  { name: 'Our Services', href: '#' },
  { name: 'Our values', href: '#' },
  { name: 'Meet our leadership', href:'#leadership'},
]
const people = [
  {
    name: 'Aayush Talreja',
    role: 'Founder & CEO',
    bio: 'Visionary leader driven by passion for inclusive education. Aayush leads Shiksha\'s mission to revolutionize learning accessibility.',
    imageUrl:
      'https://media.licdn.com/dms/image/C4D03AQGjVJnZjakikg/profile-displayphoto-shrink_200_200/0/1657648501282?e=1700092800&v=beta&t=2hsLm8z_INY3nH59HSVzYgUFC3wyNXZ_MTRUTVCHgXA',
  },
  {
    name: 'Sudhanshu Sabale',
    role: 'CTO & HR Head',
    bio: 'Tech innovator building robust platforms. Sudhanshu ensures our technology serves all learners with excellence.',
    imageUrl:
      'https://media.licdn.com/dms/image/D4D03AQGGyi7iO4NFKw/profile-displayphoto-shrink_100_100/0/1679249654187?e=1700092800&v=beta&t=52x6MXU8vQmG6xyf4d9VXrZPmZk-eynVeylJu4eqKI4',
  },
  {
    name: 'Anshita Talreja',
    role: 'Co-Founder & COO',
    bio: 'Operations strategist with heart for student success. Anshita orchestrates seamless delivery of quality education.',
    imageUrl:
      'https://media.licdn.com/dms/image/D5603AQHwd4NbcDAYyA/profile-displayphoto-shrink_100_100/0/1682758978080?e=1700092800&v=beta&t=Q6y7SLBAwemKPD7GNmlbu8OZyIePNlkXzx97cnuBnhg',
  },
  {
    name: 'Cheshta Gurbaxani',
    role: 'Chief Financial Officer',
    bio: 'Financial strategist ensuring sustainable growth. Cheshta manages resources to maximize educational impact.',
    imageUrl:
      'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGNhcnRvb24lMjBnaXJsfGVufDB8fDB8fHww',
  },
  {
    name: 'Mansi Bellani',
    role: 'Data Analyst & CIO',
    bio: 'Data-driven decision maker transforming insights into action. Mansi leverages analytics for continuous improvement.',
    imageUrl:
      'https://media.licdn.com/dms/image/D4D03AQF_sjSz2esQWA/profile-displayphoto-shrink_100_100/0/1689216851927?e=1695859200&v=beta&t=PcC2gr_o7cAiThV_uHFBsv3K_udJjZjd2d2scy55nfc',
  },
  {
    name: 'Anuj Bagad',
    role: 'Backend Developer & MD',
    bio: 'Architecture expert building scalable solutions. Anuj ensures our platform handles millions seamlessly.',
    imageUrl:
      'https://media.licdn.com/dms/image/C4D03AQG7ln3Kb53VZA/profile-displayphoto-shrink_100_100/0/1641273867979?e=1695859200&v=beta&t=La4q8Eg25kwPNzgMgDugEziMUXBECbFoAVDxSACt8pg',
  },
  {
    name: 'Niranjan Yeole',
    role: 'PR & Communications Lead',
    bio: 'Community builder amplifying our message. Niranjan connects Shiksha with the world, one story at a time.',
    imageUrl:
      'https://media.licdn.com/dms/image/C4E03AQFMaAxosx5O8A/profile-displayphoto-shrink_100_100/0/1642847850390?e=1695859200&v=beta&t=nUjDR1YwYcLXZ7Qjxx7jPxPVPSYupqjHXzIGXWoVvGU',
  },
]

function About1() {
  const { speak } = useSpeechSynthesis();

  return (
    <div className="bg-white">
      {/* Vision Section */}
      <div className="px-6 mx-auto max-w-7xl lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">Our Vision</h2>
            <p className="mt-6 text-lg leading-8 text-gray-700 mb-6">
              We believe that <span className="font-semibold text-indigo-600">education is a fundamental right</span>, not a privilege. Our mission is to provide equal opportunity of education to everyone, irrespective of their disability or background.
            </p>
            <p className="text-lg leading-8 text-gray-600">
              At Shiksha, we're breaking down barriers and reimagining what inclusive education looks like. We leverage cutting-edge technology, passionate educators, and innovative pedagogy to ensure that every student—regardless of their abilities—has access to world-class learning opportunities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border-2 border-indigo-100">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-3xl">🎯</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusive Learning</h3>
                  <p className="text-gray-600">Education designed for all abilities and backgrounds</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">♿</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility First</h3>
                  <p className="text-gray-600">Technology that adapts to every learner's needs</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">🌟</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Education</h3>
                  <p className="text-gray-600">Expert educators and engaging content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="px-6 mx-auto max-w-7xl lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseOver={() => speak({ text: link.name })}
              className="group p-6 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl transition border border-indigo-200 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">{link.name}</h3>
              <span className="text-indigo-600 group-hover:translate-x-1 inline-block transition">→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Leadership Section */}
      <div className="py-20 sm:py-28 px-6 lg:px-8" id="leadership">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our diverse team of innovators, educators, and visionaries are united by a single mission: 
              to revolutionize education and make it accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {people.map((person) => (
              <div 
                key={person.name}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-200"
                onMouseOver={() => speak({ text: person.name })}
              >
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{person.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-4 text-lg">{person.role}</p>
                  <p className="text-gray-600 leading-relaxed">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 mx-auto max-w-7xl lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Learning Journey?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of students already experiencing the future of inclusive education
        </p>
        <a 
          href="/signup" 
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Get Started Today
        </a>
      </div>
    </div>
  );
}

export default About1;