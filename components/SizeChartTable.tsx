"use client";

import { ReactNode } from "react";

interface SizeChartTableProps {
  sizeChart: unknown;
}

/**
 * Parses and renders a size chart from either:
 * - A structured object with `headers` and `rows` arrays
 * - A pipe-delimited string format (e.g., "Size||Chest||Length\nM||38||28")
 */
export default function SizeChartTable({ sizeChart }: SizeChartTableProps) {
  const raw = sizeChart as any;
  let parsed: {
    headers: string[];
    rows: string[][];
  } | null = null;

  if (
    raw &&
    typeof raw === "object" &&
    Array.isArray(raw.rows) &&
    raw.rows.length > 0
  ) {
    parsed = raw;
  } else if (raw && (typeof raw === "string" || raw.description)) {
    const text = typeof raw === "string" ? raw : raw.description || "";
    const lines = text
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.includes("||") && l.length > 3);
    if (lines.length >= 2) {
      const parsePipe = (line: string) =>
        line
          .split("||")
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0);
      parsed = {
        headers: parsePipe(lines[0]),
        rows: lines.slice(1).map(parsePipe),
      };
    }
  }

  if (!parsed) {
    return (
      <p className="text-sm text-gray-400">Size chart not available.</p>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <table className="w-full text-xs md:text-sm">
        <thead>
          <tr className="bg-gray-900">
            {parsed.headers.map((h, i) => (
              <th
                key={i}
                className={`px-2 md:px-3 py-2.5 md:py-3 font-semibold text-white text-center ${
                  i === 0 ? "text-left" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsed.rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-t border-gray-100 ${
                ri % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-2 md:px-3 py-2 md:py-2.5 text-center text-gray-700 ${
                    ci === 0 ? "font-bold text-gray-900 text-left" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}