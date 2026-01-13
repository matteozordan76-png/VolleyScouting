
import React from 'react';
import { PlayerStats } from '../types';
import { StopCircle, RefreshCw } from 'lucide-react';

interface StepGameProps {
  starters: string[];
  onAddStat: (name: string, key: keyof PlayerStats) => void;
  onTerminate: () => void;
  onSostituzioni: () => void;
}

const StepGame: React.FC<StepGameProps> = ({ starters, onAddStat, onTerminate, onSostituzioni }) => {
  return (
    <div className="p-2 space-y-3 bg-gray-200 min-h-full animate-fadeIn">
      <div className="grid grid-cols-2 gap-2">
        {starters.map((name, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-blue-500 transform active:scale-98 transition-transform">
            <div className="bg-gray-50 py-1.5 px-2 border-b border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400">P{i + 1}</span>
              <span className="text-xs font-bold text-gray-800 truncate max-w-[85%]">{name}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-[1px] bg-gray-300">
              <button 
                onClick={() => onAddStat(name, 'rc')} 
                className="bg-green-600 text-white text-[10px] font-bold py-4 active:brightness-75 transition-all uppercase"
              >
                R.OK
              </button>
              <button 
                onClick={() => onAddStat(name, 're')} 
                className="bg-red-600 text-white text-[10px] font-bold py-4 active:brightness-75 transition-all uppercase"
              >
                R.ER
              </button>
              <button 
                onClick={() => onAddStat(name, 'ae')} 
                className="bg-orange-500 text-white text-[10px] font-bold py-4 active:brightness-75 transition-all uppercase"
              >
                A.ER
              </button>
              
              <button 
                onClick={() => onAddStat(name, 'bc')} 
                className="bg-green-700 text-white text-[10px] font-bold py-4 active:brightness-75 transition-all uppercase"
              >
                S.OK
              </button>
              <button 
                onClick={() => onAddStat(name, 'bs')} 
                className="bg-red-700 text-white text-[10px] font-bold py-4 active:brightness-75 transition-all uppercase"
              >
                S.ER
              </button>
              <button 
                onClick={() => onAddStat(name, 'ace')} 
                className="bg-sky-400 text-black text-[10px] font-bold py-4 active:brightness-75 transition-all uppercase"
              >
                ACE
              </button>
              
              <button 
                onClick={() => onAddStat(name, 'pt')} 
                className="col-span-3 bg-blue-800 text-white text-[12px] font-black py-3 active:bg-blue-900 tracking-widest transition-colors"
              >
                PUNTO
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 p-2 mt-4">
        <button 
          onClick={onSostituzioni}
          className="flex-1 bg-gray-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
        >
          <RefreshCw size={18} /> CAMBI
        </button>
        <button 
          onClick={onTerminate}
          className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
        >
          <StopCircle size={18} /> STOP SET
        </button>
      </div>
    </div>
  );
};

export default StepGame;
