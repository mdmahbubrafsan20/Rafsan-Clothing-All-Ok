"use client";

import { X, Ruler } from "lucide-react";
import { SizeChart } from "@/lib/products";

interface SizeChartModalProps {
  sizeChart: SizeChart | null | undefined | any;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Parse pipe-separated text into table rows
// Input: "|| S || 36" || 27" || 17" || 55-60kg ||"
// Output: ["S", `36"`, `27"`, `17"`, "55-60kg"]
function parsePipeRow(line: string): string[] {
  return line
    .split("||")
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0);
}

// Detect if size_chart is plain text (string) and parse it
function parseSizeChart(raw: any): { headers: string[]; rows: string[][]; description: string; unit: string } | null {
  if (!raw) return null;

  // Already proper JSON structure
  if (typeof raw === "object" && Array.isArray(raw.rows) && raw.rows.length > 0) {
    return raw;
  }

  // Plain text format — parse it
  if (typeof raw === "string" || (typeof raw === "object" && raw.description)) {
    const text = typeof raw === "string" ? raw : raw.description || "";
    const lines = text
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.includes("||") && l.length > 3);

    if (lines.length < 2) return null;

    const headers = parsePipeRow(lines[0]);
    const rows = lines.slice(1).map(parsePipeRow).filter((r: string[]) => r.length > 0);

    return {
      headers,
      rows,
      description: "",
      unit: "inches",
    };
  }

  return null;
}

export default function SizeChartModal({
  sizeChart,
  productName,
  isOpen,
  onClose,
}: SizeChartModalProps) {
  if (!isOpen) return null;

  const parsed = parseSizeChart(sizeChart);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
              <Ruler className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Size Guide</h2>
              {productName && (
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{productName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-5">
          {!parsed ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Ruler className="w-7 h-7 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">No size chart available</p>
              <p className="text-sm text-gray-400 mt-1">This product does not have size measurements yet.</p>
            </div>
          ) : (
            <>
              {parsed.description ? (
                <div className="mb-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  💡 {parsed.description}
                </div>
              ) : null}

              {/* Table */}
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900">
                      {parsed.headers.map((header, i) => (
                        <th
                          key={i}
                          className={`px-3 py-3 font-semibold text-white text-center ${i === 0 ? "text-left" : ""}`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className={`border-t border-gray-100 ${ri % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-3 py-3 text-center text-gray-700 ${ci === 0 ? "font-bold text-gray-900 text-left" : ""}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* How to measure */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  How to Measure
                </p>
                <div className="space-y-2 text-xs text-gray-600">
                  {[
                    ["Chest", "Measure around the fullest part of your chest, keeping tape horizontal."],
                    ["Length", "Measure from shoulder seam to the bottom hem."],
                    ["Shoulder", "Measure from shoulder point to shoulder point across the back."],
                  ].map(([label, desc]) => (
                    <div key={label} className="flex gap-2 items-start">
                      <span className="w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {label[0]}
                      </span>
                      <p><strong>{label}:</strong> {desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
                💡 <strong>Tip:</strong> If you are between sizes, we recommend sizing up. Easy 7-day exchange available.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
