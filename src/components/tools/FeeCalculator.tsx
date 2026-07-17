'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

// Figures match the published breakdown on /california-dmv-fees. Kept in
// one place so both pages can't silently drift out of sync.
const BASE_FEE = 65;
const CHP_FEE = 32;
const VLF_RATE = 0.0065; // 0.65% of vehicle value
const TITLE_TRANSFER_FEE = 15;
const DEFAULT_USE_TAX_RATE = 7.25; // CA statewide base rate; counties/districts add more

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

type Mode = 'renewal' | 'purchase';

export default function FeeCalculator() {
  const [mode, setMode] = useState<Mode>('renewal');
  const [value, setValue] = useState('20000');
  const [useTaxRate, setUseTaxRate] = useState(String(DEFAULT_USE_TAX_RATE));

  const vehicleValue = Math.max(0, Number(value) || 0);
  const taxRate = Math.max(0, Number(useTaxRate) || 0);

  const result = useMemo(() => {
    const vlf = vehicleValue * VLF_RATE;
    if (mode === 'renewal') {
      const total = BASE_FEE + CHP_FEE + vlf;
      return {
        rows: [
          { label: 'Base registration fee', amount: BASE_FEE },
          { label: 'CHP fee', amount: CHP_FEE },
          { label: 'Vehicle License Fee (0.65% of value)', amount: vlf },
        ],
        total,
      };
    }
    const useTax = vehicleValue * (taxRate / 100);
    const total = BASE_FEE + CHP_FEE + vlf + TITLE_TRANSFER_FEE + useTax;
    return {
      rows: [
        { label: 'Base registration fee', amount: BASE_FEE },
        { label: 'CHP fee', amount: CHP_FEE },
        { label: 'Vehicle License Fee (0.65% of value)', amount: vlf },
        { label: 'Title transfer fee', amount: TITLE_TRANSFER_FEE },
        { label: `Use tax (${taxRate}% of price)`, amount: useTax },
      ],
      total,
    };
  }, [mode, vehicleValue, taxRate]);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6">
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode('renewal')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            mode === 'renewal' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Renewing my registration
        </button>
        <button
          type="button"
          onClick={() => setMode('purchase')}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            mode === 'purchase' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Registering a new purchase
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === 'renewal' ? "Estimated current vehicle value" : 'Purchase price'}
          </span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </label>

        {mode === 'purchase' && (
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1.5 block">
              Use tax rate (your county may be higher)
            </span>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.01}
                value={useTaxRate}
                onChange={(e) => setUseTaxRate(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </label>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        {result.rows.map((row) => (
          <div key={row.label} className="flex justify-between text-sm text-gray-700">
            <span>{row.label}</span>
            <span className="font-medium">{formatCurrency(row.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
          <span>Estimated total</span>
          <span>{formatCurrency(result.total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setValue('20000');
          setUseTaxRate(String(DEFAULT_USE_TAX_RATE));
        }}
        className="mt-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset
      </button>

      <p className="mt-4 text-xs text-gray-500 leading-relaxed">
        This is a ballpark estimate using published statewide rates. It does not include county or
        district fees, does not account for the Vehicle License Fee&apos;s depreciation schedule on
        older vehicles, and does not include late penalties. Confirm the exact amount for your
        vehicle on the official DMV fee calculator before you pay.
      </p>
    </div>
  );
}
