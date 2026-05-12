"use client";

import { X, Ruler } from "lucide-react";
import { SizeChart } from "@/lib/products";

interface SizeChartModalProps {
  sizeChart: SizeChart | null | undefined;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeChartModal({
  sizeChart,
  productName,
  isOpen,
  onClose,
}: SizeChartModalProps) {
  if (!isOpen) return null;

  const hasData = sizeChart && (sizeChart.rows?.length > 0 || sizeChart.description);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Ruler className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Size Guide</h2>
              {productName && (
                <p className="text-xs text-gray-500 mt-0.5">{productName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {!hasData ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No size chart available</p>
              <p className="text-gray-400 text-sm mt-1">
                This product does not have size measurements yet.
              </p>
            </div>
          ) : (
            <>
              {/* Fit notes */}
              {sizeChart.description && (
                <div className="mb-5 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium flex items-start gap-2">
                    <span className="mt-0.5 text-amber-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    {sizeChart.description}
                  </p>
                </div>
              )}

              {/* Size chart table */}
              {sizeChart.rows && sizeChart.rows.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900">
                        {sizeChart.headers.map((header, idx) => (
                          <th
                            key={idx}
                            className={`px-4 py-3 text-center font-semibold text-white ${
                              idx === 0 ? "text-left" : ""
                            }`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.rows.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className={`border-t border-gray-100 ${
                            rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition-colors`}
                        >
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className={`px-4 py-3 text-center text-gray-700 ${
                                cellIdx === 0 ? "font-bold text-gray-900" : ""
                              }`}
                            >
                              {cell}
                              {cellIdx > 0 && sizeChart.unit && (
                                <span className="text-xs text-gray-400 ml-0.5">
                                  {sizeChart.unit === "cm" ? " cm" : "\""}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Unit label */}
              {sizeChart.unit && sizeChart.rows.length > 0 && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  All measurements are in {sizeChart.unit}
                </p>
              )}

              {/* How to measure */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  How to Measure
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                  <div className="flex gap-2 items-start">
                    <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold flex-shrink-0 mt-0.5">1</span>
                    <p><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold flex-shrink-0 mt-0.5">2</span>
                    <p><strong>Waist:</strong> Measure around the narrowest part of your waist.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold flex-shrink-0 mt-0.5">3</span>
                    <p><strong>Length:</strong> Measure from shoulder seam to bottom hem.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
