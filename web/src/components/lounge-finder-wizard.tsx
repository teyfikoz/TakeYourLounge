'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WizardState {
  step: number;
  accessMethod: string;
  priority: string;
  layoverDuration: string;
}

export default function LoungeFinderWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    step: 1,
    accessMethod: '',
    priority: '',
    layoverDuration: ''
  });

  const resetWizard = () => {
    setWizardState({
      step: 1,
      accessMethod: '',
      priority: '',
      layoverDuration: ''
    });
  };

  const handleNext = (field: keyof Omit<WizardState, 'step'>, value: string) => {
    setWizardState(prev => ({
      ...prev,
      [field]: value,
      step: prev.step + 1
    }));
  };

  const getRecommendation = (): string => {
    const { accessMethod, priority, layoverDuration } = wizardState;

    // Simple rule-based recommendations
    if (accessMethod === 'priority-pass') {
      if (priority === 'work') {
        return 'Business lounges with private workspaces, high-speed Wi-Fi, and quiet zones';
      } else if (priority === 'food') {
        return 'Premium dining lounges with chef-prepared meals and extensive buffets';
      } else if (priority === 'relax') {
        return 'Spa lounges with shower facilities, sleeping pods, and wellness amenities';
      }
    } else if (accessMethod === 'credit-card') {
      if (priority === 'work') {
        return 'Executive lounges with meeting rooms, business centers, and power outlets';
      } else if (priority === 'food') {
        return 'Club lounges with complimentary dining and premium beverages';
      }
    } else if (accessMethod === 'none') {
      return 'Pay-per-use lounges and day pass options for comfortable airport experience';
    }

    return 'Premium lounges matching your preferences';
  };

  const getSearchParams = (): string => {
    const params = new URLSearchParams();
    if (wizardState.accessMethod) params.set('access', wizardState.accessMethod);
    if (wizardState.priority) params.set('priority', wizardState.priority);
    if (wizardState.layoverDuration) params.set('layover', wizardState.layoverDuration);
    return params.toString();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-brand-600 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-brand-700 transition-all hover:scale-105 z-50 flex items-center gap-2 font-semibold"
      >
        <span className="text-2xl">🔍</span>
        Find Your Perfect Lounge
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">🧭 Smart Lounge Finder</h2>
              <p className="text-brand-100">Find the perfect lounge for your needs in 3 simple steps</p>
            </div>
            <button
              onClick={() => { setIsOpen(false); resetWizard(); }}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full flex-1 transition-all ${
                  step <= wizardState.step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Access Method */}
          {wizardState.step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">How will you access lounges?</h3>
                <p className="text-gray-600">Select your primary access method</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleNext('accessMethod', 'priority-pass')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">🎫</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Priority Pass</div>
                  <div className="text-sm text-gray-600">Membership programs</div>
                </button>

                <button
                  onClick={() => handleNext('accessMethod', 'credit-card')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">💳</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Credit Card</div>
                  <div className="text-sm text-gray-600">Amex, Chase, etc.</div>
                </button>

                <button
                  onClick={() => handleNext('accessMethod', 'airline')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">✈️</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Airline Status</div>
                  <div className="text-sm text-gray-600">Frequent flyer</div>
                </button>

                <button
                  onClick={() => handleNext('accessMethod', 'none')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group md:col-span-3"
                >
                  <div className="text-4xl mb-3">🎟️</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">No Access / Pay Per Use</div>
                  <div className="text-sm text-gray-600">Looking for day pass options</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Priority */}
          {wizardState.step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">What matters most to you?</h3>
                <p className="text-gray-600">Choose your main priority</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleNext('priority', 'work')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">💼</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Work & Productivity</div>
                  <div className="text-sm text-gray-600">Wi-Fi, quiet spaces, workstations</div>
                </button>

                <button
                  onClick={() => handleNext('priority', 'food')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">🍽️</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Food & Dining</div>
                  <div className="text-sm text-gray-600">Quality meals, buffets, beverages</div>
                </button>

                <button
                  onClick={() => handleNext('priority', 'relax')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">🧘</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Relaxation & Wellness</div>
                  <div className="text-sm text-gray-600">Showers, spa, sleeping pods</div>
                </button>

                <button
                  onClick={() => handleNext('priority', 'quiet')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">🤫</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Peace & Quiet</div>
                  <div className="text-sm text-gray-600">Low noise, private areas</div>
                </button>
              </div>

              <button
                onClick={() => setWizardState(prev => ({ ...prev, step: 1 }))}
                className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step 3: Layover Duration */}
          {wizardState.step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">How long is your layover?</h3>
                <p className="text-gray-600">This helps us recommend the right lounge</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleNext('layoverDuration', 'short')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">⏱️</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Short</div>
                  <div className="text-sm text-gray-600">Under 2 hours</div>
                </button>

                <button
                  onClick={() => handleNext('layoverDuration', 'medium')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">⏰</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Medium</div>
                  <div className="text-sm text-gray-600">2-5 hours</div>
                </button>

                <button
                  onClick={() => handleNext('layoverDuration', 'long')}
                  className="card text-left hover:border-brand-500 hover:shadow-lg transition-all group"
                >
                  <div className="text-4xl mb-3">🕐</div>
                  <div className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600">Long</div>
                  <div className="text-sm text-gray-600">5+ hours</div>
                </button>
              </div>

              <button
                onClick={() => setWizardState(prev => ({ ...prev, step: 2 }))}
                className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step 4: Results */}
          {wizardState.step === 4 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Perfect Match!</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Based on your preferences, we recommend:
                </p>
                <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                  <p className="text-brand-700 font-semibold text-lg">
                    {getRecommendation()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/lounges${getSearchParams() ? `?${getSearchParams()}` : ''}`}
                  className="btn-primary w-full text-center block py-4 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Recommended Lounges →
                </Link>

                <button
                  onClick={resetWizard}
                  className="w-full text-brand-600 hover:text-brand-700 font-medium py-3"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
