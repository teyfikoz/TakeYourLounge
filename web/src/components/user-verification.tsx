"use client";

import { CheckCircle, XCircle, ThumbsUp, MessageSquare, Edit } from "lucide-react";
import { useState } from "react";

interface UserVerificationProps {
  loungeId: string;
  loungeName: string;
  currentVerifications?: {
    accurate: number;
    inaccurate: number;
    totalReports: number;
  };
}

export function UserVerification({
  loungeId,
  loungeName,
  currentVerifications = {
    accurate: 0,
    inaccurate: 0,
    totalReports: 0,
  },
}: UserVerificationProps) {
  const [userVote, setUserVote] = useState<"accurate" | "inaccurate" | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleVote = async (vote: "accurate" | "inaccurate") => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lounges/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loungeId,
          vote,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setUserVote(vote);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lounges/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loungeId,
          loungeName,
          report: reportText,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setReportText("");
        setShowReportForm(false);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Report error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVotes = currentVerifications.accurate + currentVerifications.inaccurate;
  const accuracyRate = totalVotes > 0
    ? Math.round((currentVerifications.accurate / totalVotes) * 100)
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Community Verification</h3>
          <p className="text-sm text-gray-600 mt-1">
            Help us verify this lounge information
          </p>
        </div>

        {accuracyRate !== null && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{accuracyRate}%</div>
            <div className="text-xs text-gray-500">accuracy</div>
          </div>
        )}
      </div>

      {/* Verification Stats */}
      {totalVotes > 0 && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">
              {currentVerifications.accurate} verified accurate
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-amber-600" />
            <span className="text-gray-700">
              {currentVerifications.totalReports} reports
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Thank you for your contribution!</span>
        </div>
      )}

      {/* Voting Buttons */}
      {!userVote && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Is this information accurate?
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handleVote("accurate")}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
              Yes, it's accurate
            </button>

            <button
              onClick={() => handleVote("inaccurate")}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors"
            >
              <XCircle className="h-5 w-5" />
              No, needs correction
            </button>
          </div>
        </div>
      )}

      {/* User Already Voted */}
      {userVote && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700">
            You marked this information as{" "}
            <strong className="font-semibold">
              {userVote === "accurate" ? "accurate" : "inaccurate"}
            </strong>
          </p>
        </div>
      )}

      {/* Report Form Toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {!showReportForm ? (
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Edit className="h-4 w-4" />
            Suggest an edit or report specific issue
          </button>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What needs to be corrected?
              </label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="e.g., The lounge has moved to Terminal 2, or amenities are outdated..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                rows={4}
                required
                minLength={10}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || reportText.length < 10}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReportForm(false);
                  setReportText("");
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserVerification;
