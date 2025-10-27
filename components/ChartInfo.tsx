'use client';

import { Info } from 'lucide-react';

export default function ChartInfo() {
  return (
    <div className="bg-gray-100 p-4 border-2 border-black mb-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-black text-black mb-2">
            HOW TO READ THIS CHART
          </h4>
          <ul className="space-y-1.5 text-black font-semibold">
            <li>• <strong>Y-AXIS (Vertical):</strong> Top 10 Districts ranked by performance</li>
            <li>• <strong>X-AXIS (Horizontal):</strong> Employment/Expenditure values</li>
            <li>• <strong>HOVER:</strong> Hover over bars to see detailed district information</li>
            <li>• <strong>ANIMATION:</strong> Watch progression across financial years (plays once)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
