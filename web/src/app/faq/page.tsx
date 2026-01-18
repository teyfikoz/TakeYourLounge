'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "General",
    question: "What is TakeYourLounge?",
    answer: "TakeYourLounge is a comprehensive global directory of airport lounges. We provide detailed information about 2,045+ premium lounges across 703 airports in 175 countries, including amenities, access methods, ratings, and reviews."
  },
  {
    category: "General",
    question: "Is TakeYourLounge free to use?",
    answer: "Yes! TakeYourLounge is completely free to use. You can browse all lounges, read reviews, and access detailed information without any cost. We're here to help you find the perfect lounge for your travels."
  },
  {
    category: "Lounge Access",
    question: "How can I access airport lounges?",
    answer: "There are several ways to access airport lounges: Priority Pass membership, credit cards (Amex Platinum, Chase Sapphire Reserve, etc.), airline status (frequent flyer programs), day passes purchased at the lounge, and some lounges offer pay-per-use access through apps."
  },
  {
    category: "Lounge Access",
    question: "What is Priority Pass?",
    answer: "Priority Pass is the world's largest independent airport lounge access program. With a Priority Pass membership, you can access over 1,300 lounges worldwide regardless of the airline you're flying or your ticket class."
  },
  {
    category: "Lounge Access",
    question: "Can I bring guests to the lounge?",
    answer: "Guest policies vary by lounge and access method. Some memberships like Priority Pass allow a certain number of guests (sometimes for a fee), while others don't permit guests. Always check the specific lounge's guest policy before visiting."
  },
  {
    category: "Features",
    question: "What information is available for each lounge?",
    answer: "For each lounge, we provide: location and terminal information, amenities (food, showers, Wi-Fi, etc.), access methods accepted, operating hours, user ratings and reviews, photos, and contact information when available."
  },
  {
    category: "Features",
    question: "Can I leave reviews for lounges?",
    answer: "Yes! We encourage travelers to share their experiences. You can rate lounges on cleanliness, food quality, quietness, and workspace quality, and leave detailed written reviews to help other travelers."
  },
  {
    category: "Features",
    question: "Are the lounge images accurate?",
    answer: "We strive to provide accurate images, but some may be representative photos of typical airport lounges rather than the specific lounge. We recommend verifying details directly with the lounge operator for the most current information."
  },
  {
    category: "LoungeConnect",
    question: "What is LoungeConnect?",
    answer: "LoungeConnect is our upcoming mobile application that will revolutionize airport networking. It will allow you to connect with fellow travelers and professionals in real-time at airport lounges, creating networking opportunities during your journey."
  },
  {
    category: "LoungeConnect",
    question: "When will LoungeConnect be available?",
    answer: "LoungeConnect is currently in development and will be launching soon! Sign up for updates on our website to be among the first to know when it goes live and get early access opportunities."
  },
  {
    category: "Technical",
    question: "How do I search for lounges?",
    answer: "You can search for lounges by airport name, airport code, city, country, or lounge name. Use our advanced filters to narrow down results by access method, amenities, ratings, and more."
  },
  {
    category: "Technical",
    question: "Can I save my favorite lounges?",
    answer: "This feature is coming soon! We're working on user accounts that will allow you to save favorite lounges, track your lounge visits, and get personalized recommendations."
  },
  {
    category: "Support",
    question: "How can I report incorrect information?",
    answer: "If you notice any incorrect or outdated information about a lounge, please contact us at info@tsynca.com. We regularly update our database and appreciate your help in keeping information accurate."
  },
  {
    category: "Support",
    question: "How can I contact TakeYourLounge?",
    answer: "You can reach us at info@tsynca.com for any questions, suggestions, or feedback. We typically respond within 24-48 hours during business days."
  },
  {
    category: "Privacy",
    question: "How is my data protected?",
    answer: "We take your privacy seriously. We use industry-standard security measures to protect your data. For detailed information about how we collect, use, and protect your data, please review our Privacy Policy."
  },
  {
    category: "Privacy",
    question: "Do you use cookies?",
    answer: "Yes, we use cookies to improve your browsing experience and analyze site usage through Google Analytics. You can manage your cookie preferences through the banner that appears on your first visit or in your browser settings."
  }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  // Schema.org FAQPage structured data for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Navigation */}
      <header className="container-custom pt-8 pb-6">
          <Navbar />
      </header>

      {/* Hero Section */}
      <section className="container-custom py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about TakeYourLounge and airport lounge access
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container-custom pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-brand-50 border border-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-brand-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-brand-300 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`text-2xl text-brand-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    ↓
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-brand-100 mb-6">
            We're here to help! Reach out to our support team.
          </p>
          <a
            href="mailto:info@tsynca.com"
            className="inline-block bg-white text-brand-600 hover:bg-brand-50 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">TakeYourLounge</div>
              <p className="text-sm">
                Your global airport lounge directory and networking platform.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/lounges" className="hover:text-white">All Lounges</Link></li>
                <li><Link href="/airports" className="hover:text-white">Airports</Link></li>
                <li><Link href="/blog" className="hover:text-white">Travel Guides</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/faq" className="text-white font-medium">FAQ</Link></li>
                <li><a href="mailto:info@tsynca.com" className="hover:text-white">Contact</a></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.linkedin.com/company/tech-sync-analytica-llc/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 TakeYourLounge. All rights reserved.</p>
            <p className="mt-2">
              Developed by{' '}
              <a
                href="https://techsyncanalytica.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 font-medium"
              >
                Tech Sync Analytica LLC
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
