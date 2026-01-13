
import React, { useState } from 'react';
import { PlayerInfo } from '../types';
import { Users, ChevronRight } from 'lucide-react';

interface StepRosterProps {
  onComplete: (name: string, roster: PlayerInfo[]) => void;
  initialRoster: PlayerInfo[];
  initialMatchName: string;
}

const StepRoster: React.FC<StepRosterProps> = ({ onComplete, initialRoster, initialMatchName }) => {
  const [matchName, setMatchName] = useState(initialMatchName);
  const [players, setPlayers] = useState<string[]>(
    initialRoster.map(p => p.isAbsent ? '' : p.name)
  );

  const handleInputChange = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleNext = () => {
    const finalRoster: PlayerInfo[] = players.map(p => ({
      name: p.trim() || 'Assente',
      isAbsent: p.trim() === ''
    }));
    onComplete(matchName, finalRoster);
  };

  return (
    <div className="p-4 space-y-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 border-l-4 border-blue-500">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dettagli Partita</label>
        <input 
          type="text" 
          placeholder="Es: Squadra A vs Squadra B"
          className="w-full text-lg font-semibold border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500"
          value={matchName}
          onChange={(e) => setMatchName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Users size={18} className="text-gray-500" />
          <h2 className="font-bold text-gray-700">Roster 12 Giocatrici</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {players.map((name, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 p-1 rounded-md border border-gray-100">
              <span className="w-8 text-center font-bold text-gray-400 text-sm">{i + 1}</span>
              <input 
                type="text"
                placeholder="Nome e Cognome"
                className="flex-1 bg-transparent p-2 text-sm focus:outline-none focus:bg-white rounded transition-colors"
                value={name}
                onChange={(e) => handleInputChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
      >
        Configura Formazione <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default StepRoster;
