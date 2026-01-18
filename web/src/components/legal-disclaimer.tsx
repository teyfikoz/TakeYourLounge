"use client";

import { AlertTriangle, CheckCircle2, ExternalLink, Flag } from "lucide-react";
import { useState } from "react";

interface LegalDisclaimerProps {
  loungeName: string;
  loungeId: string;
  verified: boolean;
  dataSources?: string[];
  onReportInaccuracy?: () => void;
}

export function LegalDisclaimer({
  loungeName,
  loungeId,
  verified = false,
  dataSources = ["community"],
  onReportInaccuracy,
}: LegalDisclaimerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">
                {verified ? "Verified Information" : "Community-Sourced Information"}
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                {verified ? (
                  <>
                    This lounge information has been verified by the operator.
                    However, details may change. Please confirm before your visit.
                  </>
                ) : (
                  <>
                    This information is sourced from community contributions and public data.
                    <strong className="font-medium"> We cannot guarantee accuracy.</strong>
                    Please verify with the lounge operator before visiting.
                  </>
                )}
              </p>
            </div>

            {verified && (
              <div className="flex items-center gap-1.5 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </div>
            )}
          </div>

          {/* Data Sources */}
          <div className="mt-3 text-xs text-amber-700">
            <span className="font-medium">Data sources: </span>
            {dataSources.map((source, idx) => (
              <span key={source}>
                {source}
                {idx < dataSources.length - 1 && ", "}
              </span>
            ))}
          </div>

          {/* Expanded Attribution */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-amber-200 text-xs text-amber-700 space-y-1.5">
              <p className="font-medium">Attribution & Licenses:</p>
              <ul className="space-y-1 ml-4">
                {dataSources.includes("OpenStreetMap") && (
                  <li>
                    • OpenStreetMap: © OpenStreetMap contributors (
                    <a
                      href="https://www.openstreetmap.org/copyright"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-900"
                    >
                      ODbL License
                    </a>
                    )
                  </li>
                )}
                {dataSources.includes("Wikidata") && (
                  <li>
                    • Wikidata: Wikidata contributors (
                    <a
                      href="https://www.wikidata.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-900"
                    >
                      CC0 License
                    </a>
                    )
                  </li>
                )}
                {dataSources.includes("Google Places") && (
                  <li>• Google Places: Map data ©2025 Google</li>
                )}
                {dataSources.includes("community") && (
                  <li>• Community: TakeYourLounge user contributions</li>
                )}
                <li>
                  • Images: Photos from{" "}
                  <a
                    href="https://unsplash.com/license"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-900"
                  >
                    Unsplash
                  </a>{" "}
                  (Free for commercial use)
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-amber-700 hover:text-amber-900 font-medium underline"
            >
              {expanded ? "Hide" : "Show"} attribution details
            </button>

            {onReportInaccuracy && (
              <button
                onClick={onReportInaccuracy}
                className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-medium"
              >
                <Flag className="h-3.5 w-3.5" />
                Report Inaccuracy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalDisclaimer;
