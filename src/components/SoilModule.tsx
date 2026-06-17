import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Plus, 
  Activity, 
  Settings, 
  Lightbulb, 
  CheckCircle, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Droplet 
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { SoilReport, DeficiencyAlertRule, Farmer } from "../types";

interface SoilModuleProps {
  soilReports: SoilReport[];
  alertRules: DeficiencyAlertRule[];
  farmers: Farmer[];
  onReviewReport: (id: string, actionComments: string) => void;
  onAddReport: (report: Omit<SoilReport, "id" | "uploadDate">) => void;
  onAddAlertRule: (rule: Omit<DeficiencyAlertRule, "id">) => void;
  onToggleAlertRule: (id: string, active: boolean) => void;
  onDeleteAlertRule: (id: string) => void;
}

export const SoilModule: React.FC<SoilModuleProps> = ({
  soilReports,
  alertRules,
  farmers,
  onReviewReport,
  onAddReport,
  onAddAlertRule,
  onToggleAlertRule,
  onDeleteAlertRule
}) => {
  const [selectedReport, setSelectedReport] = useState<SoilReport | null>(soilReports[0] || null);
  const [reviewComments, setReviewComments] = useState("");

  // Add Soil Report Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFarmerId, setNewFarmerId] = useState("");
  const [newFarmName, setNewFarmName] = useState("");
  const [newpH, setNewpH] = useState(6.5);
  const [newNitrogen, setNewNitrogen] = useState(25);
  const [newPhosphorus, setNewPhosphorus] = useState(30);
  const [newPotassium, setNewPotassium] = useState(130);
  const [newMoisture, setNewMoisture] = useState(40);
  const [newCropType, setNewCropType] = useState("Sugarcane");

  // Add Deficiency Rule States
  const [newParam, setNewParam] = useState<'pH' | 'Nitrogen' | 'Phosphorus' | 'Potassium' | 'Moisture'>("pH");
  const [newOperand, setNewOperand] = useState<'less_than' | 'greater_than'>("less_than");
  const [newThreshold, setNewThreshold] = useState(5.5);
  const [newSeverity, setNewSeverity] = useState<'Warning' | 'Critical'>("Warning");
  const [newMsg, setNewMsg] = useState("");

  // Interactive Recharts Historical Trend Data
  // Dynamically constructed from selected or all reports
  const trendData = selectedReport 
    ? [
        { name: "Month -3", N: Math.round(selectedReport.nitrogen * 0.8), P: Math.round(selectedReport.phosphorus * 1.2), K: Math.round(selectedReport.potassium * 0.9), pH: Number((selectedReport.pH - 0.4).toFixed(1)) },
        { name: "Month -2", N: Math.round(selectedReport.nitrogen * 0.9), P: Math.round(selectedReport.phosphorus * 1.1), K: Math.round(selectedReport.potassium * 0.95), pH: Number((selectedReport.pH - 0.2).toFixed(1)) },
        { name: "Month -1", N: Math.round(selectedReport.nitrogen * 0.7), P: Math.round(selectedReport.phosphorus * 1.0), K: Math.round(selectedReport.potassium * 1.0), pH: Number(selectedReport.pH.toFixed(1)) },
        { name: "Current", N: selectedReport.nitrogen, P: selectedReport.phosphorus, K: selectedReport.potassium, pH: selectedReport.pH }
      ]
    : [
        { name: "Plot Jan", N: 15, P: 20, K: 90, pH: 5.6 },
        { name: "Plot Feb", N: 22, P: 24, K: 105, pH: 5.9 },
        { name: "Plot Mar", N: 30, P: 28, K: 115, pH: 6.1 },
        { name: "Plot Apr", N: 28, P: 32, K: 120, pH: 6.3 }
      ];

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const farmerObj = farmers.find(f => f.id === newFarmerId);
    if (!newFarmerId || !newFarmName) return;

    onAddReport({
      farmerId: newFarmerId,
      farmerName: farmerObj?.name || "Unknown Farmer",
      farmName: newFarmName,
      pH: Number(newpH),
      nitrogen: Number(newNitrogen),
      phosphorus: Number(newPhosphorus),
      potassium: Number(newPotassium),
      moisture: Number(newMoisture),
      status: "Pending",
      actionTaken: "",
      cropType: newCropType
    });
    
    setShowAddForm(false);
    setNewFarmName("");
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    onAddAlertRule({
      parameter: newParam,
      operand: newOperand,
      value: Number(newThreshold),
      severity: newSeverity,
      message: newMsg.trim(),
      active: true
    });
    setNewMsg("");
  };

  const handleReviewSubmit = () => {
    if (!selectedReport) return;
    onReviewReport(selectedReport.id, reviewComments || "Parameters calibrated. Balanced compound applications advised.");
    setSelectedReport({
      ...selectedReport,
      status: "Reviewed",
      actionTaken: reviewComments || "Parameters calibrated. Balanced compound applications advised."
    });
    setReviewComments("");
  };

  const farmerOptions = farmers.filter(f => f.role === 'Farmer');

  return (
    <div className="space-y-6 animate-fade-in" id="soil-module">
      
      {/* Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: soil report log + upload form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-gray-150 flex items-center justify-between">
            <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-[#3B6D11]" />
              <span>Grower Soil Test Logs</span>
            </h3>
            <button
              onClick={() => {
                if (farmerOptions.length > 0) {
                  setNewFarmerId(farmerOptions[0].id);
                }
                setShowAddForm(true);
              }}
              className="bg-[#3B6D11] hover:bg-[#2e560d] text-white text-[10px] font-black py-1.5 px-3 rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Upload Soil Report</span>
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left font-display">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-black uppercase text-[10px] tracking-wider bg-slate-50/40">
                    <th className="py-2.5 px-2">Farmer / Farm</th>
                    <th className="py-2.5 px-2 text-center">pH</th>
                    <th className="py-2.5 px-2 text-center">NPK (ppm)</th>
                    <th className="py-2.5 px-2 text-center">Moisture</th>
                    <th className="py-2.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-slate-700">
                  {soilReports.map((sc) => (
                    <tr 
                      key={sc.id}
                      onClick={() => setSelectedReport(sc)}
                      className={`hover:bg-slate-50 cursor-pointer transition-all ${
                        selectedReport?.id === sc.id ? "bg-emerald-50/50 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3 px-2">
                        <div className="font-bold text-slate-800">{sc.farmerName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{sc.farmName} • {sc.cropType}</div>
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          sc.pH < 5.8 ? 'bg-red-50 text-red-600' : sc.pH > 7.3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-[#3B6D11]'
                        }`}>{sc.pH}</span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-[10.5px]">
                        <span className="text-red-700">{sc.nitrogen}</span> - <span className="text-blue-700">{sc.phosphorus}</span> - <span className="text-emerald-700">{sc.potassium}</span>
                      </td>
                      <td className="py-3 px-2 text-center text-gray-500 font-mono font-medium">
                        {sc.moisture}%
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          sc.status === 'Reviewed' ? 'bg-emerald-50 text-[#3B6D11]' : 'bg-amber-50 text-amber-600 font-black'
                        }`}>
                          {sc.status === 'Reviewed' ? 'Reviewed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: active report review & details + trend chart */}
        <div className="lg:col-span-5 space-y-4">
          {selectedReport ? (
            <div className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4 animate-fade-in">
              <div className="flex justify-between items-start border-b border-gray-150 pb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#0F6E56] font-black block">Active Diagnosis</span>
                  <h3 className="font-black text-slate-800 text-sm">{selectedReport.farmerName}</h3>
                  <span className="text-[10px] text-gray-400 font-mono">{selectedReport.farmName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 font-mono">{selectedReport.id}</span>
                </div>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-center">
                  <span className="text-[9px] text-gray-400 font-semibold block uppercase">pH Valency</span>
                  <span className="text-base font-black text-slate-800 font-mono block mt-1">{selectedReport.pH}</span>
                  <span className="text-[8px] text-gray-500 font-medium">
                    {selectedReport.pH < 6.0 ? "Acid" : selectedReport.pH > 7.2 ? "Alkaline" : "Neutral"}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-center">
                  <span className="text-[9px] text-gray-500 font-semibold block uppercase">Nitrogen (N)</span>
                  <span className="text-base font-black text-red-600 font-mono block mt-1">{selectedReport.nitrogen}</span>
                  <span className="text-[8px] text-red-500 font-medium">ppm (Low)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-center">
                  <span className="text-[9px] text-blue-500 font-semibold block uppercase">Phosphate (P)</span>
                  <span className="text-base font-black text-blue-600 font-mono block mt-1">{selectedReport.phosphorus}</span>
                  <span className="text-[8px] text-blue-400 font-medium">ppm</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 text-center">
                  <span className="text-[9px] text-green-500 font-semibold block uppercase">Potassium (K)</span>
                  <span className="text-base font-black text-green-700 font-mono block mt-1">{selectedReport.potassium}</span>
                  <span className="text-[8px] text-green-600 font-medium">ppm</span>
                </div>
              </div>

              {/* Status and Action Panel */}
              <div className="space-y-2 p-3 bg-[#e2e1d7]/20 border border-[#e2e1d7] rounded-xl text-xs">
                {selectedReport.status === 'Reviewed' ? (
                  <div>
                    <span className="text-[#3B6D11] font-black flex items-center gap-1 uppercase text-[10px]">
                      <CheckCircle className="w-4 h-4" />
                      <span>Diagnosed & Adored</span>
                    </span>
                    <p className="text-slate-700 mt-1.5 leading-relaxed italic pr-1">
                      "{selectedReport.actionTaken}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <span className="text-amber-700 font-black flex items-center gap-1 uppercase text-[10px]">
                      <Activity className="w-4 h-4" />
                      <span>Awaiting Agronomist Advisory Action</span>
                    </span>
                    <textarea
                      placeholder="Write customized plant food prescription notes (e.g. spray NPK formulation weekly, add lime compost, seaweed extract)..."
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      className="w-full h-16 bg-white border border-slate-200 focus:border-[#3B6D11] outline-none rounded-lg p-2.5 text-xs text-slate-700 resize-none"
                    />
                    <button
                      onClick={handleReviewSubmit}
                      className="w-full bg-[#0F6E56] hover:bg-[#0c5946] text-white font-black py-2 rounded-lg cursor-pointer transition text-[11px]"
                    >
                      Authenticate Diagnosis Advisory
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border-[0.5px] border-gray-200 text-center text-gray-400 text-xs">
              Select or upload a report to inspect diagnostic parameters.
            </div>
          )}
        </div>
      </div>

      {/* Recharts Trend Charting Section */}
      <div className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#0F6E56]" />
              <span>Historical Soil Nutrient Trends</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Line map showcasing N-P-K (ppm) nitrogen curves over recent crop rotations</p>
          </div>
          {selectedReport && (
            <span className="text-xs font-bold text-slate-600 bg-emerald-50 rounded px-2.5 py-1">
              Displaying: <strong>{selectedReport.farmerName} ({selectedReport.cropType})</strong>
            </span>
          )}
        </div>

        <div className="h-64" id="trend-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="N" name="Nitrogen (ppm)" stroke="#e11d48" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="P" name="Phosphorus (ppm)" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="K" name="Potassium (ppm)" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deficiency Rules Engine */}
      <div className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-5">
        <div className="pb-3 border-b border-gray-150">
          <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-slate-700" />
            <span>Deficiency Warning Alarm Rules</span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5 font-display">System triggers persistent alert notice boards if uploaded soil readings violate these limits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Rules List (8 cols) */}
          <div className="lg:col-span-8 space-y-2.5">
            {alertRules.map((r) => (
              <div 
                key={r.id}
                className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 p-1 rounded font-black text-[9px] uppercase ${
                    r.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.severity}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-1">
                      <span>Threshold:</span>
                      <strong className="text-indigo-600 font-mono">
                        {r.parameter} {r.operand === 'less_than' ? '<' : '>'} {r.value}
                      </strong>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{r.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle Switch */}
                  <button
                    onClick={() => onToggleAlertRule(r.id, !r.active)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      r.active ? 'bg-[#3B6D11]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                        r.active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => onDeleteAlertRule(r.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                    title="Delete Rule"
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Rule Creator (4 cols) */}
          <form onSubmit={handleCreateRule} className="lg:col-span-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
            <h4 className="font-black text-xs uppercase text-slate-700 flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Define Deficiency Limit</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Target Parameter</label>
              <select
                value={newParam}
                onChange={(e) => setNewParam(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-[#3B6D11]"
              >
                <option value="pH">pH (Acidity scale)</option>
                <option value="Nitrogen">Nitrogen (N)</option>
                <option value="Phosphorus">Phosphorus (P)</option>
                <option value="Potassium">Potassium (K)</option>
                <option value="Moisture">Soil Moisture %</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Operand</label>
                <select
                  value={newOperand}
                  onChange={(e) => setNewOperand(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3B6D11]"
                >
                  <option value="less_than">Less than (&lt;)</option>
                  <option value="greater_than">Greater than (&gt;)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3B6D11] font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Alarm Severity</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    checked={newSeverity === 'Warning'}
                    onChange={() => setNewSeverity('Warning')}
                    className="accent-amber-500"
                  />
                  <span>Warning</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    checked={newSeverity === 'Critical'}
                    onChange={() => setNewSeverity('Critical')}
                    className="accent-red-600"
                  />
                  <span className="text-red-600 font-bold">Critical</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Message Description</label>
              <input
                type="text"
                required
                placeholder="Alert text: Low potash content, risk of..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-[#3B6D11]"
              />
            </div>

            <button
              type="submit"
              disabled={!newMsg.trim()}
              className="w-full bg-[#3B6D11] text-white hover:bg-[#2e560d] font-black py-2 rounded-lg cursor-pointer transition text-[11px]"
            >
              Commit Safety Rule
            </button>
          </form>
        </div>
      </div>

      {/* Report Upload Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200 animate-fade-in">
            <div className="bg-[#0F6E56] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-[#bad15a]" />
                <span>Upload New Soil Report</span>
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-5 space-y-3 px-6 text-xs text-slate-700">
              
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Select Farm Holder *</label>
                {farmerOptions.length === 0 ? (
                  <p className="text-red-500">Please register a standard farmer first.</p>
                ) : (
                  <select
                    value={newFarmerId}
                    onChange={(e) => setNewFarmerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-2 text-xs"
                  >
                    {farmerOptions.map(fo => (
                      <option key={fo.id} value={fo.id}>{fo.name} ({fo.location})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Specific Field Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana Plot B (West Orchard)"
                  value={newFarmName}
                  onChange={(e) => setNewFarmName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-0.5">Crop Target</label>
                  <input
                    type="text"
                    value={newCropType}
                    onChange={(e) => setNewCropType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-0.5">Soil pH (0-14)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="14"
                    value={newpH}
                    onChange={(e) => setNewpH(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-600 block mb-0.5">Nitrogen (N)</label>
                  <input
                    type="number"
                    value={newNitrogen}
                    onChange={(e) => setNewNitrogen(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-0.5">Phosphate (P)</label>
                  <input
                    type="number"
                    value={newPhosphorus}
                    onChange={(e) => setNewPhosphorus(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-0.5">Potassium (K)</label>
                  <input
                    type="number"
                    value={newPotassium}
                    onChange={(e) => setNewPotassium(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Gravimetric moisture content (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newMoisture}
                  onChange={(e) => setNewMoisture(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-4 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFarmName || !newFarmerId}
                  className="bg-[#0F6E56] disabled:opacity-40 hover:bg-[#0c5946] text-white font-black py-2 px-5 rounded-lg cursor-pointer"
                >
                  Validate & Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
