
import React, { useState, useCallback } from 'react';
import { AppStep, PlayerInfo, PlayerStats, SetHistory } from './types';
import { Trophy, Users, ClipboardList, BarChart3, AlertCircle } from 'lucide-react';

// Components
import StepRoster from './components/StepRoster';
import StepSelection from './components/StepSelection';
import StepGame from './components/StepGame';
import StepSummary from './components/StepSummary';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.ROSTER);
  const [matchName, setMatchName] = useState<string>('');
  const [roster, setRoster] = useState<PlayerInfo[]>(
    Array.from({ length: 12 }, (_, i) => ({ name: '', isAbsent: true }))
  );
  const [starters, setStarters] = useState<string[]>([]);
  const [currentStats, setCurrentStats] = useState<SetHistory>({});
  const [setsHistory, setSetsHistory] = useState<SetHistory[]>([]);
  const [showConfirmTerminate, setShowConfirmTerminate] = useState(false);

  // Inizializza statistiche per un nuovo set
  const initStats = useCallback((players: PlayerInfo[]) => {
    const initial: SetHistory = {};
    players.forEach(p => {
      if (!p.isAbsent) {
        initial[p.name] = { rc: 0, re: 0, bc: 0, bs: 0, ace: 0, ae: 0, pt: 0 };
      }
    });
    setCurrentStats(initial);
  }, []);

  const handleSetupSelection = (name: string, updatedRoster: PlayerInfo[]) => {
    setMatchName(name || 'Gara');
    setRoster(updatedRoster);
    initStats(updatedRoster);
    setStep(AppStep.SELECTION);
  };

  const handleStartGame = (selectedStarters: string[]) => {
    setStarters(selectedStarters);
    setStep(AppStep.GAME);
  };

  const handleAddStat = (playerName: string, key: keyof PlayerStats) => {
    setCurrentStats(prev => {
      if (!prev[playerName]) return prev;
      return {
        ...prev,
        [playerName]: {
          ...prev[playerName],
          [key]: prev[playerName][key] + 1
        }
      };
    });
  };

  const executeTerminateSet = () => {
    // Clonazione profonda dei dati per evitare riferimenti mutabili
    const statsSnapshot = JSON.parse(JSON.stringify(currentStats));
    
    // Aggiorna lo storico e cambia step simultaneamente
    setSetsHistory(prev => {
      const newHistory = [...prev, statsSnapshot];
      return newHistory;
    });
    
    setStep(AppStep.SUMMARY);
    setShowConfirmTerminate(false);
  };

  const handleGoToNextSet = () => {
    initStats(roster);
    setStarters([]);
    setStep(AppStep.SELECTION);
  };

  const handleReset = () => {
    // Reset completo dell'app
    window.location.reload();
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.ROSTER:
        return <StepRoster onComplete={handleSetupSelection} initialRoster={roster} initialMatchName={matchName} />;
      case AppStep.SELECTION:
        return (
          <StepSelection 
            roster={roster} 
            starters={starters} 
            setStep={setStep}
            onStart={handleStartGame} 
            setCount={setsHistory.length + 1}
          />
        );
      case AppStep.GAME:
        return (
          <StepGame 
            starters={starters} 
            onAddStat={handleAddStat} 
            onTerminate={() => setShowConfirmTerminate(true)}
            onSostituzioni={() => setStep(AppStep.SELECTION)}
          />
        );
      case AppStep.SUMMARY:
        return (
          <StepSummary 
            matchName={matchName}
            setsHistory={setsHistory}
            roster={roster}
            onNextSet={handleGoToNextSet}
            onReset={handleReset}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-xl relative">
      {/* App Header */}
      <header className="bg-[#2c3e50] text-white p-4 sticky top-0 z-50 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={24} />
          <div>
            <h1 className="text-lg font-bold leading-tight">Scout Volley U13</h1>
            <p className="text-xs text-gray-400">MultiSet Professional</p>
          </div>
        </div>
        {step !== AppStep.ROSTER && (
          <div className="bg-[#34495e] px-3 py-1 rounded text-xs font-mono">
            SET {step === AppStep.SUMMARY ? setsHistory.length : setsHistory.length + 1}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        {renderContent()}

        {/* Custom Confirmation Modal */}
        {showConfirmTerminate && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <AlertCircle size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Termina Set?</h3>
                <p className="text-sm text-gray-500">I dati del set attuale verranno salvati nel report finale.</p>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={executeTerminateSet}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg"
                >
                  Sì, Termina Set
                </button>
                <button 
                  onClick={() => setShowConfirmTerminate(false)}
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold active:scale-95 transition-all"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation (Indicatore visivo dello step attuale) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200 flex justify-around py-2 z-50">
        <div className={`flex flex-col items-center gap-1 transition-colors ${step === AppStep.ROSTER ? 'text-blue-600' : 'text-gray-400'}`}>
          <Users size={20} />
          <span className="text-[10px] font-medium">Roster</span>
        </div>
        <div className={`flex flex-col items-center gap-1 transition-colors ${step === AppStep.SELECTION ? 'text-blue-600' : 'text-gray-400'}`}>
          <ClipboardList size={20} />
          <span className="text-[10px] font-medium">Formazione</span>
        </div>
        <div className={`flex flex-col items-center gap-1 transition-colors ${step === AppStep.GAME ? 'text-blue-600' : 'text-gray-400'}`}>
          <Trophy size={20} />
          <span className="text-[10px] font-medium">Gara</span>
        </div>
        <div className={`flex flex-col items-center gap-1 transition-colors ${step === AppStep.SUMMARY ? 'text-blue-600' : 'text-gray-400'}`}>
          <BarChart3 size={20} />
          <span className="text-[10px] font-medium">Report</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
