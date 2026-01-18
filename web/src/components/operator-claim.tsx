"use client";

import { Building2, CheckCircle, Mail, Phone, Globe, FileText } from "lucide-react";
import { useState } from "react";

interface OperatorClaimProps {
  loungeId: string;
  loungeName: string;
  airportCode: string;
  currentOperator?: string;
}

export function OperatorClaim({
  loungeId,
  loungeName,
  airportCode,
  currentOperator,
}: OperatorClaimProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: currentOperator || "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    position: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lounges/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loungeId,
          loungeName,
          airportCode,
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Claim submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Claim Submitted!</h3>
        <p className="text-green-800 mb-4">
          Thank you for claiming this lounge listing. Our team will review your request
          and contact you within 1-2 business days to verify your ownership.
        </p>
        <p className="text-sm text-green-700">
          We'll send a verification email to <strong>{formData.email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Are you the lounge operator?
          </h3>

          {!showForm ? (
            <>
              <p className="text-gray-700 mb-4">
                Claim this listing to get <strong>FREE benefits</strong>:
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">Verified Badge</strong> - Stand out
                    with official verification
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">Manage Your Listing</strong> -
                    Update photos, amenities, hours
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">Direct Booking Link</strong> - Drive
                    more customers
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">Analytics Dashboard</strong> - Track
                    views & engagement
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">Priority Placement</strong> - Higher
                    visibility in search
                  </span>
                </li>
              </ul>

              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Claim This Lounge (Free)
              </button>

              <p className="text-xs text-gray-600 mt-3 text-center">
                100% free. No credit card required. Verification in 24-48 hours.
              </p>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company / Lounge Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Primeclass Lounge"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="contact@lounge.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+90 212 123 4567"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://yourlounge.com"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Position *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., General Manager"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information to help us verify your claim..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Claim Request"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-600 text-center">
                By submitting, you confirm that you are authorized to represent this
                lounge.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default OperatorClaim;
