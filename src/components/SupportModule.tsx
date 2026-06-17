import React, { useState } from "react";
import { 
  Inbox, 
  Trash2, 
  Check, 
  MessageSquare,
  Clock,
  Zap,
  Lock,
  Plus,
  Send,
  BarChart2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { SupportTicket as Ticket, TicketMessage } from "../types";

interface SupportModuleProps {
  tickets: Ticket[];
  onAddTicketMessage: (ticketId: string, text: string, isInternal: boolean) => void;
  onUpdateTicketStatus: (id: string, status: 'Open' | 'Resolved') => void;
}

export const SupportModule: React.FC<SupportModuleProps> = ({
  tickets,
  onAddTicketMessage,
  onUpdateTicketStatus
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(tickets[0] || null);
  const [replyText, setReplyText] = useState("");
  const [isInternalStaffNote, setIsInternalStaffNote] = useState(false);

  // Canned replies
  const CANNED_REPLIES = [
    "We recommend checking soil pH levels first before dosing trace elements.",
    "Order shipment is already dispatched. Expect local transport within 3 business days.",
    "Our regional Pune agronomist team has scheduled a field visit to inspect leaf spots.",
    "Please send a high-resolution photo of the cane leaves via support dashboard."
  ];

  // Resolution speed statistical data (recharts)
  const resolutionData = [
    { day: "Mon", AverageHours: 3.4 },
    { day: "Tue", AverageHours: 2.8 },
    { day: "Wed", AverageHours: 2.1 },
    { day: "Thu", AverageHours: 1.8 },
    { day: "Fri", AverageHours: 1.5 }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    onAddTicketMessage(selectedTicket.id, replyText.trim(), isInternalStaffNote);

    // Update locally displayed messages to preserve reactivity prior to total parent re-fetch
    const updatedMessages = [
      ...selectedTicket.messages,
      {
        id: "msg-" + Date.now(),
        sender: isInternalStaffNote ? "STAFF NOTE" : "Agronomist Operator",
        text: replyText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInternal: isInternalStaffNote
      }
    ];

    setSelectedTicket({
      ...selectedTicket,
      messages: updatedMessages
    });

    setReplyText("");
  };

  const handleApplyCanned = (phrase: string) => {
    setReplyText(phrase);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="support-module">
      
      {/* Upper overview section: tickets list + chat window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Helpdesk Inbox list (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 bg-slate-50 border-b border-gray-150 flex items-center justify-between">
            <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-[#3B6D11]" />
              <span>Grower Tickets Inbox</span>
            </h3>
            <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded-full uppercase">
              {tickets.filter(t => t.status === 'Open').length} Open
            </span>
          </div>

          <div className="p-3 space-y-2.5 max-h-[450px] overflow-y-auto">
            {tickets.map((t) => (
              <div 
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs relative ${
                  selectedTicket?.id === t.id 
                    ? "bg-[#3B6D11]/10 border-[#3B6D11]/40" 
                    : t.status === 'Resolved' 
                      ? "bg-slate-50/50 border-gray-150 opacity-70"
                      : "bg-white hover:bg-slate-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <strong className="text-slate-800 text-xs truncate max-w-[150px]">{t.farmerName}</strong>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.2 rounded font-mono ${
                    t.priority === 'Critical' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : t.priority === 'High' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.priority} (SLA: {t.priority === 'Critical' ? '4h' : '12h'})
                  </span>
                </div>

                <p className="font-bold text-[#0F6E56] font-display mt-1.5 truncate">{t.subject}</p>
                
                <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2.5 pt-2 border-t border-slate-50">
                  <span className="font-mono">ID: {t.id}</span>
                  <span className={`font-semibold ${t.status === 'Open' ? 'text-amber-600 font-black' : 'text-emerald-600'}`}>
                    • {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Message dialogue window (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-4 space-y-4">
          {selectedTicket ? (
            <div className="space-y-4 animate-fade-in text-xs">
              
              {/* Ticket header details */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-150">
                <div>
                  <h4 className="font-black text-slate-800 text-sm leading-tight">{selectedTicket.subject}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Opened by <strong>{selectedTicket.farmerName}</strong> • Category: {selectedTicket.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status === 'Open' ? (
                    <button
                      onClick={() => {
                        onUpdateTicketStatus(selectedTicket.id, 'Resolved');
                        setSelectedTicket({ ...selectedTicket, status: 'Resolved' });
                      }}
                      className="bg-emerald-50 text-[#3B6D11] border border-emerald-250 hover:bg-[#3B6D11] hover:text-white px-2.5 py-1 rounded text-[10.5px] font-black transition cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Close Ticket</span>
                    </button>
                  ) : (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black uppercase px-2.5 py-0.5 rounded-full">
                      Resolved Ticket
                    </span>
                  )}
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="h-60 overflow-y-auto bg-slate-50/70 border border-slate-150 rounded-xl p-4 space-y-3 pr-2">
                {selectedTicket.messages.map((m) => (
                  <div 
                    key={m.id}
                    className={`p-3 max-w-[85%] rounded-xl shadow-sm text-xs ${
                      m.isInternal 
                        ? "bg-purple-50 text-purple-900 border border-purple-200 ml-4 italic" 
                        : m.sender === 'Agronomist Operator' || m.sender.includes("Operator")
                          ? "bg-teal-50 text-slate-800 border border-emerald-100 mr-auto"
                          : "bg-white text-slate-700 ml-auto border border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold mb-1 col-span-2">
                      <span className="uppercase text-[9px] font-extrabold flex items-center gap-0.5">
                        {m.isInternal && <Lock className="w-2.5 h-2.5 text-purple-700 shrink-0" />}
                        <span>{m.sender}</span>
                      </span>
                      <span className="font-mono">{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed break-words whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Command text editor box */}
              {selectedTicket.status === 'Open' ? (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  
                  {/* Canned reply shortcuts */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-black text-slate-400 block mb-0.5 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Click to inject Canned Advisory response</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-0.5 pb-0.5">
                      {CANNED_REPLIES.map((phrase, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyCanned(phrase)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded px-2 py-1 text-[9.5px] truncate max-w-[200px] cursor-pointer"
                          title={phrase}
                        >
                          {phrase}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input field */}
                  <div className="flex items-center gap-2">
                    <textarea
                      required
                      placeholder={isInternalStaffNote ? "[Private Note] Write local analysis observations visible only to Staff..." : "Write official, supportive reply to farmer..."}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className={`flex-1 h-14 bg-white border outline-none rounded-lg p-2.5 text-xs text-slate-700 resize-none transition-all ${
                        isInternalStaffNote 
                          ? "border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500" 
                          : "border-slate-200 focus:border-[#3B6D11] focus:ring-1 focus:ring-[#3B6D11]"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className={`h-14 px-4 text-white font-black rounded-lg cursor-pointer flex flex-col items-center justify-center gap-0.5 transition ${
                        isInternalStaffNote 
                          ? "bg-purple-700 hover:bg-purple-800" 
                          : "bg-[#0F6E56] hover:bg-[#0c5946]"
                      }`}
                      title="Send response"
                    >
                      <Send className="w-4 h-4" />
                      <span className="text-[9px]">Send</span>
                    </button>
                  </div>

                  {/* Private Note Toggle */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="internal-staff-checkbox"
                      checked={isInternalStaffNote}
                      onChange={(e) => setIsInternalStaffNote(e.target.checked)}
                      className="accent-purple-700 cursor-pointer h-3.5 w-3.5"
                    />
                    <label 
                      htmlFor="internal-staff-checkbox"
                      className="text-[10px] font-bold text-slate-500 cursor-pointer flex items-center gap-0.5 select-none"
                    >
                      <Lock className="w-3 h-3 text-purple-600" />
                      <span>Lock as Private Staff Note (Hidden from the farmer)</span>
                    </label>
                  </div>

                </form>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-center text-gray-400 text-xs">
                  🔒 Dialogue closed. Reopen or complete a new ticket request.
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
              👈 Awaiting ticket select to initialize helplines
            </div>
          )}
        </div>
      </div>

      {/* Support analytics SLAs speed (under chart) */}
      <div className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
        <div>
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
            <BarChart2 className="w-4 h-4 text-[#0F6E56]" />
            <span>Support Helpline response speed SLA (Hours)</span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Average time in hours taken to solve incoming critical or high priority tickets</p>
        </div>

        <div className="h-44" id="sla-speed-analysis-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resolutionData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Bar dataKey="AverageHours" fill="#0F6E56" radius={[4, 4, 0, 0]} name="Avg Hours to Resolve" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
