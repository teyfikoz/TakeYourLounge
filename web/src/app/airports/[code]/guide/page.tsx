'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ShareToUnlock from '@/components/share-to-unlock';
import airportData from '@/data/airports.json';
import loungeData from '@/data/lounges.json';

export default function AirportGuidePage() {
  const params = useParams();
  const airportCode = params.code as string;

  // Find airport in data
  const airport = airportData.airports.find((a: any) => a.code === airportCode);

  if (!airport) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <header className="container-custom pt-8 pb-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-brand-700">
              TakeYourLounge
            </Link>
            <div className="space-x-6">
              <Link href="/airports" className="text-gray-700 hover:text-brand-600">
                Airports
              </Link>
            </div>
          </nav>
        </header>

        <div className="container-custom py-20 text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Airport Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            We couldn't find information for airport code "{airportCode}"
          </p>
          <Link href="/airports" className="btn-primary px-8 py-3">
            Browse All Airports
          </Link>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const terminals = Object.keys(airport.terminals || {});
  const terminalLoungeCounts = terminals.map(term => ({
    name: term,
    count: (airport.terminals as any)[term]?.length || 0,
    lounges: (airport.terminals as any)[term] || []
  })).sort((a, b) => b.count - a.count);

  const bestTerminal = terminalLoungeCounts[0];

  // Get all lounges for this airport from main lounge data
  const airportLounges = loungeData.lounges.filter((l: any) => l.airport_code === airportCode);

  // Calculate density score (lounges per million passengers - normalized)
  const densityScore = Math.min(10, Math.round((airport.lounge_count / 10) * 10) / 10);

  // Collect all access methods
  const accessMethodCounts: Record<string, number> = {};
  airportLounges.forEach((lounge: any) => {
    lounge.access_methods?.forEach((method: string) => {
      accessMethodCounts[method] = (accessMethodCounts[method] || 0) + 1;
    });
  });

  const topAccessMethods = Object.entries(accessMethodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Find hidden gems (good rating but lower review count)
  const hiddenGems = airportLounges
    .filter((l: any) => l.overall_rating && l.overall_rating >= 4.0)
    .sort((a: any, b: any) => (b.overall_rating || 0) - (a.overall_rating || 0))
    .slice(0, 3);

  // Find top-rated lounges
  const topRated = airportLounges
    .filter((l: any) => l.overall_rating && l.overall_rating > 0)
    .sort((a: any, b: any) => (b.overall_rating || 0) - (a.overall_rating || 0))
    .slice(0, 3);

  // Generate rule-based tips
  const generateTips = () => {
    const tips = [];

    // Terminal tip
    if (bestTerminal && bestTerminal.count > 1) {
      tips.push({
        icon: '🚪',
        title: `Fly from ${bestTerminal.name} if possible`,
        description: `This terminal has ${bestTerminal.count} lounges, giving you the most options for comfortable waiting.`
      });
    }

    // Access method tip
    if (topAccessMethods.length > 0) {
      const topMethod = topAccessMethods[0];
      tips.push({
        icon: '🎫',
        title: `${topMethod[0]} works at ${topMethod[1]} lounges`,
        description: `This is the most widely accepted access method at ${airport.name}.`
      });
    }

    // Early arrival tip
    if (airport.lounge_count > 5) {
      tips.push({
        icon: '⏰',
        title: 'Arrive 3+ hours early for international flights',
        description: 'With multiple lounges available, you can explore different options and enjoy premium amenities.'
      });
    }

    // Peak hours tip
    tips.push({
      icon: '📊',
      title: 'Avoid 6-9 AM and 5-8 PM if possible',
      description: 'These are typical peak hours when lounges are most crowded. Consider off-peak visits for better experience.'
    });

    // Multiple terminals tip
    if (terminals.length > 2) {
      tips.push({
        icon: '🗺️',
        title: 'Check your terminal before choosing a lounge',
        description: `${airport.name} has ${terminals.length} terminals. Make sure the lounge is in your departure terminal.`
      });
    }

    return tips;
  };

  const tips = generateTips();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Navigation */}
      <header className="container-custom pt-8 pb-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-brand-700">
            TakeYourLounge
          </Link>
          <div className="space-x-6">
            <Link href="/lounges" className="text-gray-700 hover:text-brand-600">
              Lounges
            </Link>
            <Link href="/airports" className="text-gray-700 hover:text-brand-600">
              Airports
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-brand-600">
              About
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-custom py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <Link href="/airports" className="text-brand-600 hover:text-brand-700 flex items-center gap-2">
              ← Back to Airports
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">✈️</div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {airport.name}
                </h1>
                <p className="text-xl text-gray-600">
                  {airport.city}, {airport.country}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full font-medium">
                    {airport.code}
                  </span>
                  <span className="text-gray-600">
                    {airport.lounge_count} Premium Lounges
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-brand-600">{airport.lounge_count}</div>
                <div className="text-sm text-gray-700 mt-1">Total Lounges</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{terminals.length}</div>
                <div className="text-sm text-gray-700 mt-1">Terminals</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{densityScore.toFixed(1)}</div>
                <div className="text-sm text-gray-700 mt-1">Density Score</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{topAccessMethods.length}+</div>
                <div className="text-sm text-gray-700 mt-1">Access Methods</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Analysis */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span>🗺️</span>
              Terminal Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {terminalLoungeCounts.map((terminal, idx) => (
                <div
                  key={terminal.name}
                  className={`card ${idx === 0 ? 'ring-2 ring-brand-500' : ''}`}
                >
                  {idx === 0 && (
                    <div className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                      ⭐ BEST TERMINAL
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{terminal.name}</h3>
                  <div className="text-3xl font-bold text-brand-600 mb-4">
                    {terminal.count}
                    <span className="text-base text-gray-600 ml-2">
                      {terminal.count === 1 ? 'lounge' : 'lounges'}
                    </span>
                  </div>

                  {/* Lounge list */}
                  <div className="space-y-2">
                    {terminal.lounges.slice(0, 3).map((lounge: any) => (
                      <Link
                        key={lounge.id}
                        href={`/lounges/${lounge.id}`}
                        className="block text-sm text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        → {lounge.name}
                      </Link>
                    ))}
                    {terminal.count > 3 && (
                      <p className="text-sm text-gray-500">+{terminal.count - 3} more</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expert Tips */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span>💡</span>
              Expert Tips
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, idx) => (
                <div key={idx} className="card bg-gradient-to-br from-white to-brand-50">
                  <div className="text-4xl mb-3">{tip.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-700">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Access Methods */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span>🎫</span>
              Popular Access Methods
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topAccessMethods.map(([method, count], idx) => (
                <div key={method} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{method}</div>
                      <div className="text-sm text-gray-600">
                        {count} {count === 1 ? 'lounge' : 'lounges'}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-brand-600">#{idx + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Lounges */}
      {topRated.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span>⭐</span>
                Top Rated Lounges
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topRated.map((lounge: any, idx) => (
                  <Link
                    key={lounge.id}
                    href={`/lounges/${lounge.id}`}
                    className="card hover:shadow-xl transition-shadow group"
                  >
                    <img
                      src={lounge.images[0]}
                      alt={lounge.name}
                      className="w-full h-40 object-cover rounded-lg mb-4 -mx-6 -mt-6"
                    />
                    <div className="flex items-start gap-2 mb-2">
                      <span className="bg-brand-600 text-white px-2 py-1 rounded text-sm font-bold">
                        #{idx + 1}
                      </span>
                      {lounge.overall_rating && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                          ⭐ {lounge.overall_rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-600">
                      {lounge.name}
                    </h3>
                    {lounge.terminal && (
                      <p className="text-sm text-gray-600">Terminal {lounge.terminal}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hidden Gems - Share to Unlock */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                <span>💎</span>
                Hidden Gems & Insider Tips
              </h2>
              <p className="text-gray-600">
                Unlock exclusive insights about lesser-known but exceptional lounges
              </p>
            </div>

            <ShareToUnlock
              contentId={`airport_${airportCode}_hidden_gems`}
              title="Unlock Hidden Gems"
              description="Share this guide to reveal insider tips and underrated lounges at this airport"
              shareText={`Check out this comprehensive lounge guide for ${airport.name}! 🛫 ${airport.lounge_count} lounges analyzed with expert tips. #AirportLounge #Travel`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🌟 Underrated Lounges You Shouldn't Miss
                </h3>

                <div className="space-y-6">
                  {hiddenGems.slice(0, 3).map((lounge: any, idx) => (
                    <div key={lounge.id} className="border-l-4 border-brand-500 pl-6 py-4 bg-gradient-to-r from-brand-50 to-transparent">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl font-bold text-brand-600">#{idx + 1}</div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{lounge.name}</h4>
                          {lounge.terminal && (
                            <p className="text-sm text-gray-600 mb-2">📍 {lounge.terminal}</p>
                          )}
                          <div className="flex items-center gap-4 mb-3">
                            {lounge.overall_rating && (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                ⭐ {lounge.overall_rating.toFixed(1)} / 5.0
                              </span>
                            )}
                          </div>

                          {/* Insider Tip */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">💡</span>
                              <div className="flex-1">
                                <div className="font-semibold text-yellow-900 text-sm mb-1">Insider Tip:</div>
                                <p className="text-yellow-800 text-sm">
                                  {idx === 0 && "Often overlooked but offers exceptional food quality and peaceful atmosphere. Best visited during off-peak hours."}
                                  {idx === 1 && "Hidden location means fewer crowds. Perfect for business travelers who need a quiet workspace."}
                                  {idx === 2 && "Recently renovated with premium amenities. Great shower facilities and comfortable seating areas."}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Link
                            href={`/lounges/${lounge.id}`}
                            className="inline-block mt-3 text-brand-600 hover:text-brand-700 font-medium text-sm"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Peak Hours Heatmap */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      ⏰ Best Times to Visit
                    </h4>
                    <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 rounded-lg p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl mb-2">🟢</div>
                          <div className="font-semibold text-sm">Early Morning</div>
                          <div className="text-xs text-gray-600">5-7 AM</div>
                          <div className="text-xs text-green-600 font-medium mt-1">Low crowd</div>
                        </div>
                        <div>
                          <div className="text-2xl mb-2">🟡</div>
                          <div className="font-semibold text-sm">Mid-Morning</div>
                          <div className="text-xs text-gray-600">7-10 AM</div>
                          <div className="text-xs text-yellow-600 font-medium mt-1">Moderate</div>
                        </div>
                        <div>
                          <div className="text-2xl mb-2">🟢</div>
                          <div className="font-semibold text-sm">Afternoon</div>
                          <div className="text-xs text-gray-600">12-4 PM</div>
                          <div className="text-xs text-green-600 font-medium mt-1">Low crowd</div>
                        </div>
                        <div>
                          <div className="text-2xl mb-2">🔴</div>
                          <div className="font-semibold text-sm">Evening Peak</div>
                          <div className="text-xs text-gray-600">5-8 PM</div>
                          <div className="text-xs text-red-600 font-medium mt-1">Very busy</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Money-Saving Tips */}
                  <div className="mt-6 bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span>💰</span>
                      Money-Saving Tips for {airport.name}
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Priority Pass often offers better value than pay-per-use at this airport</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Some credit cards include free lounge access - check your benefits before paying</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>Book lounge access online in advance for up to 20% discount vs walk-in rates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ShareToUnlock>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore Lounges at {airport.name}?
          </h2>
          <p className="text-xl mb-8 text-brand-100">
            Browse all {airport.lounge_count} premium lounges and find your perfect spot
          </p>
          <Link
            href={`/airports/${airport.code}`}
            className="inline-block bg-white text-brand-600 hover:bg-brand-50 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            View All Lounges
          </Link>
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
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
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
