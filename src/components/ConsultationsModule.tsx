import React, { useState } from "react";
import { 
  PhoneCall, 
  MapPin, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Clipboard, 
  FileCheck,
  Star,
  Activity,
  Smile
} from "lucide-react";
import { Consultation, Farmer } from "../types";

interface ConsultationsModuleProps {
  consultations: Consultation[];
  farmers: Farmer[];
  onAddConsultation: (consult: Omit<Consultation, "id" | "npsScore">) => void;
  onCompleteConsultation: (id: string, notes: string, npsRating: number) => void;
}

export const ConsultationsModule: React.FC<ConsultationsModuleProps> = ({
  consultations,
  farmers,
  onAddConsultation,
  onCompleteConsultation
}) => {
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(consultations[0] || null);
  const [completeNotes, setCompleteNotes] = useState("");
  const [completeNps, setCompleteNps] = useState(10);

  // New Booking States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFarmerId, setNewFarmerId] = useState("");
  const [newAgronomist, setNewAgronomist] = useState("Dr. Ramesh Shinde");
  const [newDate, setNewDate] = useState("2026-06-18");
  const [newSlot, setNewSlot] = useState("10:00 AM - 10:30 AM");
  const [newNotes, setNewNotes] = useState("");

  const pendingConsults = consultations.filter(c => c.status === 'Scheduled');
  const finishedConsults = consultations.filter(c => c.status === 'Completed');

  // Math Net Promoter Score (Feedback Rating)
  const completedWithFeedback = finishedConsults.filter(c => c.npsScore > 0);
  const avgNps = completedWithFeedback.length > 0
    ? (completedWithFeedback.reduce((acc, current) => acc + current.npsScore, 0) / completedWithFeedback.length).toFixed(1)
    : "9.5";

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const grower = farmers.find(f => f.id === newFarmerId);
    if (!newFarmerId) return;

    onAddConsultation({
      farmerId: newFarmerId,
      farmerName: grower?.name || "Unknown Farmer",
      agronomistId: newAgronomist === "Dr. Ramesh Shinde" ? "AGR_001" : "AGR_002",
      agronomistName: newAgronomist,
      date: newDate,
      timeSlot: newSlot,
      notes: newNotes.trim() || "Regular seasonal soil pH consultation.",
      status: "Scheduled"
    });

    setShowAddForm(false);
    setNewNotes("");
  };

  const handleResolveBooking = () => {
    if (!selectedConsult) return;
    onCompleteConsultation(selectedConsult.id, completeNotes || "Completed consultation successfully.", Number(completeNps));
    
    // update locally shown
    setSelectedConsult({
      ...selectedConsult,
      status: "Completed",
      notes: completeNotes || "Completed consultation successfully.",
      npsScore: Number(completeNps)
    });
    setCompleteNotes("");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="consultations-module">
      
      {/* Overview Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Consultation appointments (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50 border-b border-gray-150 flex items-center justify-between">
            <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#3B6D11]" />
              <span>Agronomy Bookings & Schedule Calendar</span>
            </h3>
            <button
              onClick={() => {
                const growers = farmers.filter(f => f.role === 'Farmer');
                if (growers.length > 0) {
                  setNewFarmerId(growers[0].id);
                }
                setShowAddForm(true);
              }}
              className="bg-[#3B6D11] hover:bg-[#2e560d] text-white text-[10px] font-black py-1.5 px-3 rounded-lg shadow-sm cursor-pointer transition flex items-center gap-1"
            >
              <Plus className="w-3" />
              <span>Book Appointment</span>
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-3.5">
              {/* Category selector split */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">Upcoming Rostered Bookings ({pendingConsults.length})</span>
                <div className="space-y-2">
                  {pendingConsults.map((c) => (
                    <div 
                      key={c.id}
                      onClick={() => setSelectedConsult(c)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex justify-between items-center text-xs ${
                        selectedConsult?.id === c.id ? "bg-emerald-50/50 border-emerald-550" : "bg-white hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg bg-teal-50 p-1.5 rounded text-[#0F6E56]">☎️</span>
                        <div>
                          <strong className="text-slate-800">{c.farmerName}</strong>
                          <p className="text-[10px] text-gray-400 mt-0.5">Consultant: <strong>{c.agronomistName}</strong></p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="bg-[#3B6D11] text-white px-2 py-0.5 rounded text-[9px] font-bold font-mono">
                          {c.date} ({c.timeSlot})
                        </span>
                      </div>
                    </div>
                  ))}
                  {pendingConsults.length === 0 && (
                    <p className="text-gray-400 text-xs italic text-center py-4">No scheduled upcoming agronomist sessions.</p>
                  )}
                </div>
              </div>

              {/* Historics */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 pb-4">
                <span className="text-[10px] uppercase font-black text-slate-400 block mb-2">Historics & Case Archive ({finishedConsults.length})</span>
                <div className="space-y-1.5">
                  {finishedConsults.map((c) => (
                    <div 
                      key={c.id}
                      onClick={() => setSelectedConsult(c)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition flex justify-between items-center text-xs ${
                        selectedConsult?.id === c.id ? "bg-emerald-50/20 border-emerald-550" : "bg-white hover:bg-slate-100/70 border-slate-100"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-slate-700">{c.farmerName}</span>
                        <span className="text-[9.5px] italic text-[#3B6D11] ml-2">via {c.agronomistName}</span>
                      </div>
                      
                      {c.npsScore > 0 && (
                        <span className="text-[9.5px] bg-amber-50 text-amber-600 font-extrabold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{c.npsScore}/10 review</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Pane with notes editor (4 mins) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Workload card roster */}
          <div className="bg-white p-4 rounded-xl border-[0.5px] border-gray-200">
            <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1 mb-2">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>Agronomist Net Promoter Rating</span>
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{avgNps}</span>
              <span className="text-[10px] text-[#0F6E56] font-bold">★ Active scoring (Out of 10 average)</span>
            </div>
          </div>

          {selectedConsult ? (
            <div className="bg-white rounded-2xl border-[0.5px] border-emerald-600/30 shadow-md p-5 space-y-4 animate-fade-in text-xs">
              <div className="border-b border-gray-150 pb-3">
                <span className="text-[9px] font-black bg-[#3B6D11] text-white rounded px-2 py-0.5 uppercase tracking-wider">
                  {selectedConsult.status}
                </span>
                <h4 className="font-black text-slate-800 text-sm mt-2">{selectedConsult.farmerName}</h4>
                <p className="text-[9.5px] font-mono text-gray-400 mt-0.5">Consultant: {selectedConsult.agronomistName}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-black block mb-1">Diagnosed notes / Initial parameters:</span>
                <p className="bg-slate-50 border border-slate-200 rounded p-2.5 leading-relaxed text-slate-700 italic pr-1">
                  "{selectedConsult.notes}"
                </p>
              </div>

              {selectedConsult.status === 'Scheduled' ? (
                <div className="space-y-3 pt-2.5 border-t border-slate-100">
                  <span className="text-[10.5px] font-black text-[#0F6E56] uppercase tracking-wider block flex items-center gap-1">
                    <Clipboard className="w-4 h-4" />
                    <span>Complete Appointment Diagnosis Form</span>
                  </span>
                  
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Diagnostic Case Prescription notes *</label>
                    <textarea
                      required
                      placeholder="e.g. Diagnosed high-alkalinity strain. Advised immediate compound dosing triggers."
                      value={completeNotes}
                      onChange={(e) => setCompleteNotes(e.target.value)}
                      className="w-full h-16 bg-slate-50 border border-slate-200 rounded p-2.5 text-xs outline-none focus:border-[#3B6D11]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Farmer NPS Rating (0-10)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={completeNps}
                      onChange={(e) => setCompleteNps(Number(e.target.value))}
                      className="w-full accent-[#3B6D11]"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-gray-400 font-bold">
                      <span>1 Detractor</span>
                      <span className="text-[#3B6D11] font-extrabold">{completeNps}/10 Promoted</span>
                      <span>10 Promoter</span>
                    </div>
                  </div>

                  <button
                    onClick={handleResolveBooking}
                    className="w-full bg-[#0F6E56] hover:bg-[#0c5946] text-white font-black py-2.5 rounded-lg cursor-pointer text-[10.5px]"
                  >
                    Authenticate Consultation
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 text-slate-700 rounded-xl space-y-2 border border-emerald-200 text-[11px]">
                  <strong className="text-[#3B6D11] uppercase font-black text-[9px] flex items-center gap-1">
                    <FileCheck className="w-4 h-4" />
                    <span>Session Completed</span>
                  </strong>
                  <div>Rated NPS scoring: <strong className="font-mono text-[#0F6E56] font-extrabold">{selectedConsult.npsScore}/10</strong></div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
              👈 Awaiting roster session select diagnostics note
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-200 animate-fade-in text-xs font-display">
            <div className="bg-[#3B6D11] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Roster Agronomist Session</span>
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-5 space-y-4 text-slate-700">
              
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Select Grower *</label>
                <select
                  required
                  value={newFarmerId}
                  onChange={(e) => setNewFarmerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700"
                >
                  {farmers.filter(f => f.role === 'Farmer').map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Assigned Agronomist Staff *</label>
                <select
                  value={newAgronomist}
                  onChange={(e) => setNewAgronomist(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700"
                >
                  <option value="Dr. Ramesh Shinde">Dr. Ramesh Shinde (Pune)</option>
                  <option value="Anjali Sharma">Anjali Sharma (Haryana)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Time Slot Range</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700"
                  >
                    <option value="09:30 AM - 10:00 AM">09:30 - 10:00 AM</option>
                    <option value="11:00 AM - 11:30 AM">11:00 - 11:30 AM</option>
                    <option value="03:15 PM - 03:45 PM">03:15 - 03:45 PM</option>
                    <option value="04:30 PM - 05:00 PM">04:30 - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Case Notes / Direct Request Context</label>
                <input
                  type="text"
                  placeholder="e.g. Wheat yellowing at plot node C."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-4 rounded-lg cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3B6D11] hover:bg-[#2e560d] text-white font-black py-2 px-5 rounded-lg cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
