'use client';
import { Check } from 'lucide-react';

interface Props {
  steps: string[];
  current: number; // 0-indexed
}

export default function StepBar({ steps, current }: Props) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              done ? 'step-done' : active ? 'step-active' : 'step-idle'
            }`}>
              {done
                ? <Check className="w-3 h-3"/>
                : <span className="w-4 text-center">{i+1}</span>
              }
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length-1 && (
              <div className={`w-4 h-px mx-0.5 ${done ? 'bg-[#0D7C66]/40' : 'bg-white/8'}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}
