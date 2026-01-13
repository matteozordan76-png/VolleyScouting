
import React, { useState } from 'react';
import { PlayerInfo, AppStep } from '../types';
import { ClipboardList, ArrowLeft, Play } from 'lucide-react';

interface StepSelectionProps {
  roster: PlayerInfo[];
  starters: string[];
  setCount: number;
  setStep: (step: AppStep) => void;
  onStart: (selected: string[]) => void;
}

const StepSelection: React.FC<StepSelectionProps> = ({ roster, starters: initialStarters, setCount, setStep, onStart }) => {
  const [selected, setSelected] = useState<string[]>(initialStarters);

  const togglePlayer = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(s => s !== name));
    } else {
      if (selected.length < 6) {
        setSelected([...selected, name]);
      }
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => setStep(AppStep.ROSTER)} className="p-2 bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Scegli le 6 per il SET {setCount}</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {roster.map((player, i) => {
          const isSelected = selected.includes(player.name);
          return (
            <button
              key={i}
              disabled={player.isAbsent}
              onClick={() => togglePlayer(player.name)}
              className={`
                aspect-square flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                ${player.isAbsent 
                  ? 'bg-gray-100 border-gray-200 text-gray-300 opacity-50' 
                  : isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md scale-105'
                    : 'bg-white border-gray-100 text-gray-700 shadow-sm'}
              `}
            >
              <span className="text-[10px] font-bold opacity-50 mb-1">#{i + 1}</span>
              <span className="text-xs font-bold text-center line-clamp-2">{player.name}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-xl space-y-4">
        <div className="flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full ${i < selected.length ? 'bg-yellow-400' : 'bg-blue-400'}`} 
            />
          ))}
        </div>
        <p className="font-medium text-sm">Selezionate: {selected.length} / 6</p>
        <button 
          onClick={() => selected.length === 6 ? onStart(selected) : null}
          disabled={selected.length !== 6}
          className={`
            w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            ${selected.length === 6 
              ? 'bg-white text-blue-700 shadow-lg active:scale-95' 
              : 'bg-blue-500 text-blue-300 cursor-not-allowed'}
          `}
        >
          <Play size={18} fill="currentColor" /> INIZIA SCOUTING
        </button>
      </div>
    </div>
  );
};

export default StepSelection;
