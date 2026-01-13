
import React from 'react';
import { PlayerInfo, SetHistory, PlayerStats } from '../types';
import { FileSpreadsheet, FileText, Plus, RefreshCcw } from 'lucide-react';

// Sub-component moved outside to prevent re-mounting on every StepSummary render
const Table: React.FC<{ data: SetHistory; title: string }> = ({ data, title }) => {
  const playersWithStats = (Object.entries(data) as [string, PlayerStats][])
    .filter(([_, s]) => (s.rc + s.re + s.bc + s.bs + s.ace + s.ae + s.pt) > 0);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden my-4 border border-gray-100">
      <div className="bg-gray-800 text-white px-3 py-2 text-xs font-bold uppercase tracking-widest flex justify-between">
        <span>{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] report-table">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2 text-left border-r">Atleta</th>
              <th className="p-2 border-r">R.OK</th>
              <th className="p-2 border-r">R.ER</th>
              <th className="p-2 border-r bg-blue-50 text-blue-800 font-bold">%R</th>
              <th className="p-2 border-r">S.OK</th>
              <th className="p-2 border-r">S.ER</th>
              <th className="p-2 border-r">ACE</th>
              <th className="p-2 border-r bg-blue-50 text-blue-800 font-bold">%S</th>
              <th className="p-2 border-r">A.ER</th>
              <th className="p-2 font-bold bg-blue-100 text-blue-900">PT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {playersWithStats.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-400 italic">Nessun dato registrato in questo set</td>
              </tr>
            ) : (
              playersWithStats.map(([name, s]) => {
                const rP = (s.rc + s.re) > 0 ? Math.round((s.rc / (s.rc + s.re)) * 100) + "%" : "-";
                const sP = (s.ace + s.bc + s.bs) > 0 ? Math.round(((s.ace + s.bc) / (s.ace + s.bc + s.bs)) * 100) + "%" : "-";
                return (
                  <tr key={name}>
                    <td className="p-2 font-bold text-gray-700 border-r">{name}</td>
                    <td className="p-2 text-center border-r">{s.rc}</td>
                    <td className="p-2 text-center border-r">{s.re}</td>
                    <td className="p-2 text-center border-r bg-blue-50 font-medium">{rP}</td>
                    <td className="p-2 text-center border-r">{s.bc}</td>
                    <td className="p-2 text-center border-r">{s.bs}</td>
                    <td className="p-2 text-center border-r">{s.ace}</td>
                    <td className="p-2 text-center border-r bg-blue-50 font-medium">{sP}</td>
                    <td className="p-2 text-center border-r">{s.ae}</td>
                    <td className="p-2 text-center font-bold bg-blue-100 text-blue-900">{s.pt + s.ace}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface StepSummaryProps {
  matchName: string;
  setsHistory: SetHistory[];
  roster: PlayerInfo[];
  onNextSet: () => void;
  onReset: () => void;
}

const StepSummary: React.FC<StepSummaryProps> = ({ matchName, setsHistory, roster, onNextSet, onReset }) => {
  
  const calculateTotals = () => {
    let totals: SetHistory = {};
    roster.forEach(p => { 
      if (!p.isAbsent) totals[p.name] = { rc: 0, re: 0, bc: 0, bs: 0, ace: 0, ae: 0, pt: 0 }; 
    });
    
    setsHistory.forEach(set => {
      Object.keys(set).forEach(name => {
        if (totals[name]) {
          Object.keys(set[name]).forEach(key => {
            const k = key as keyof PlayerStats;
            totals[name][k] += set[name][k];
          });
        }
      });
    });
    return totals;
  };

  const totals = calculateTotals();

  const exportExcel = () => {
    // @ts-ignore
    const XLSX = window.XLSX;
    if (!XLSX) return alert("Libreria Excel non caricata");
    const wb = XLSX.utils.book_new();
    
    setsHistory.forEach((setData, i) => {
      const wsData = (Object.entries(setData) as [string, PlayerStats][])
        .filter(([_, s]) => (s.rc + s.re + s.bc + s.bs + s.ace + s.ae + s.pt) > 0)
        .map(([name, s]) => ({
          'Giocatrice': name,
          'Ric.OK': s.rc,
          'Ric.ERR': s.re,
          'Serv.OK': s.bc,
          'Serv.ERR': s.bs,
          'ACE': s.ace,
          'Att.ERR': s.ae,
          'Punti Tot': s.pt + s.ace
        }));
      if (wsData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, `Set ${i+1}`);
      }
    });

    const wsTotalData = (Object.entries(totals) as [string, PlayerStats][])
      .filter(([_, s]) => (s.rc + s.re + s.bc + s.bs + s.ace + s.ae + s.pt) > 0)
      .map(([name, s]) => ({
        'Giocatrice': name,
        'Ric.OK': s.rc,
        'Ric.ERR': s.re,
        'Serv.OK': s.bc,
        'Serv.ERR': s.bs,
        'ACE': s.ace,
        'Att.ERR': s.ae,
        'Punti Tot': s.pt + s.ace
      }));
    if (wsTotalData.length > 0) {
      const wsTot = XLSX.utils.json_to_sheet(wsTotalData);
      XLSX.utils.book_append_sheet(wb, wsTot, "TOTALE");
    }

    XLSX.writeFile(wb, `Scout_${matchName || 'Gara'}.xlsx`);
  };

  const exportPDF = () => {
    // @ts-ignore
    const { jsPDF } = window.jspdf;
    if (!jsPDF) return alert("Libreria PDF non caricata");
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text("Report Scout Volley U13: " + (matchName || 'Gara'), 14, 10);
    
    let currentY = 15;
    const tables = document.querySelectorAll('.report-table');
    
    tables.forEach((table, i) => {
      const title = i === setsHistory.length ? "RIEPILOGO FINALE" : "SET " + (i+1);
      doc.setFontSize(10);
      doc.text(title, 14, currentY);
      // @ts-ignore
      doc.autoTable({ 
        html: table, 
        startY: currentY + 2, 
        theme: 'grid', 
        styles: { fontSize: 7 },
        headStyles: { fillColor: [44, 62, 80] }
      });
      // @ts-ignore
      currentY = doc.lastAutoTable.finalY + 15;
      if (currentY > 180 && i < tables.length - 1) {
        doc.addPage();
        currentY = 15;
      }
    });
    
    doc.save(`Scout_${matchName || 'Gara'}.pdf`);
  };

  return (
    <div className="p-4 space-y-4 pb-32 animate-fadeIn">
      <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-lg">
        <h2 className="text-xl font-bold mb-1 uppercase tracking-wider">Report Gara</h2>
        <p className="text-blue-100 text-sm opacity-80 mb-6">{matchName || 'Senza nome'}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={exportExcel}
            className="flex-1 bg-green-500 hover:bg-green-600 active:scale-95 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <FileSpreadsheet size={16} /> EXCEL
          </button>
          <button 
            onClick={exportPDF}
            className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {setsHistory.map((set, i) => (
          <Table key={i} data={set} title={`STATISTICHE SET ${i + 1}`} />
        ))}
        {setsHistory.length > 1 && (
          <Table data={totals} title="RIEPILOGO FINALE (TOTALE PARTITA)" />
        )}
      </div>

      {/* Action Floating Buttons */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto p-4 flex gap-3 pointer-events-none">
        <button 
          onClick={onNextSet}
          className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all pointer-events-auto border-2 border-white/20"
        >
          <Plus size={20} /> PROSSIMO SET
        </button>
        <button 
          onClick={onReset}
          className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all pointer-events-auto border-2 border-white/20"
        >
          <RefreshCcw size={18} /> AZZERA
        </button>
      </div>
    </div>
  );
};

export default StepSummary;
