import React, { useState } from "react";
import { 
  Users, 
  ShoppingBag, 
  Layers, 
  AlertTriangle, 
  Plus, 
  Check, 
  Trash2, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Farmer, SoilReport, Order, DeficiencyAlertRule, DashboardActivity } from "../types";

interface HomeModuleProps {
  farmers: Farmer[];
  soilReports: SoilReport[];
  orders: Order[];
  alertRules: DeficiencyAlertRule[];
  activities: DashboardActivity[];
  onClearActivities: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export const HomeModule: React.FC<HomeModuleProps> = ({
  farmers,
  soilReports,
  orders,
  alertRules,
  activities,
  onClearActivities,
  onNavigateToTab
}) => {
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean; priority: 'High' | 'Medium' | 'Low' }[]>([
    { id: "t1", text: "Approve high-alkalinity correction recipe for Rajesh Kumar", done: false, priority: "High" },
    { id: "t2", text: "Dispatch calibrated pH probe replacements to Anand logistics point", done: false, priority: "High" },
    { id: "t3", text: "Verify Neem Pest Shield bio-assay parameters for compliance", done: true, priority: "Medium" },
    { id: "t4", text: "Review crop irrigation levels in Guntur district advisory template", done: false, priority: "Low" }
  ]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const activeFarmersCount = farmers.filter(f => f.role === 'Farmer').length;
  const pendingSoilReportsCount = soilReports.filter(r => r.status === 'Pending').length;
  const activeAlertsCount = alertRules.filter(r => r.active).length;
  const totalRevenue = orders.reduce((acc, current) => acc + current.total, 0);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([
      ...tasks,
      {
        id: "task-" + Date.now(),
        text: newTaskText.trim(),
        done: false,
        priority: newTaskPriority
      }
    ]);
    setNewTaskText("");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in" id="home-module">
      {/* Welcome Hero */}
      <div className="bg-white rounded-2xl p-6 border-[0.5px] border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Welcome to <span className="text-[#3B6D11]">Agriic</span> Command Hub <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h2>
          <p className="text-gray-500 text-sm mt-1">Science-led diagnostic insights & automated nutrient delivery controls.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigateToTab("soil")} 
            className="px-4 py-2 bg-[#3B6D11] hover:bg-[#2e560d] text-white text-xs font-black rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Run New Diagnosis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Growers */}
        <div 
          onClick={() => onNavigateToTab("farmers")}
          className="bg-white p-5 rounded-xl border-[0.5px] border-gray-200 shadow-sm hover:border-[#3B6D11] cursor-pointer transition-all duration-200 group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Farmers</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0F6E56] group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800">{activeFarmersCount}</h3>
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-[#3B6D11] font-bold">100% verified</span> via agronomic database
          </p>
        </div>

        {/* KPI 2: Live Orders & Revenue */}
        <div 
          onClick={() => onNavigateToTab("products")}
          className="bg-white p-5 rounded-xl border-[0.5px] border-gray-200 shadow-sm hover:border-[#3B6D11] cursor-pointer transition-all duration-200 group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gross Sales Pipeline</span>
            <div className="w-9 h-9 rounded-lg bg-[#3B6D11]/10 flex items-center justify-center text-[#3B6D11] group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800">₹{totalRevenue.toLocaleString()}</h3>
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-[#0F6E56] font-bold">{orders.length} active dispatches</span> in pipeline
          </p>
        </div>

        {/* KPI 3: Soil Reports */}
        <div 
          onClick={() => onNavigateToTab("soil")}
          className="bg-white p-5 rounded-xl border-[0.5px] border-gray-200 shadow-sm hover:border-[#3B6D11] cursor-pointer transition-all duration-200 group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Soil Diagnostics</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800">{soilReports.length} Analyses</h3>
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-amber-600 font-bold">{pendingSoilReportsCount} reports pending</span> manual review
          </p>
        </div>

        {/* KPI 4: Alerts */}
        <div 
          onClick={() => onNavigateToTab("soil")}
          className="bg-white p-5 rounded-xl border-[0.5px] border-gray-200 shadow-sm hover:border-red-300 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deficiency Warnings</span>
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-red-600">{activeAlertsCount} Active</h3>
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            Based on <span className="text-slate-800 font-bold">{alertRules.length} systemic rules</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Activity Feed and Action Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        {/* Left: Interactive Activities (60%) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border-[0.5px] border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-150">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Live Activity Feed</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Real-time tele-diagnostics logs from agricultural points</p>
              </div>
              {activities.length > 0 && (
                <button 
                  onClick={onClearActivities}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  title="Purge activity log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {activities.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                🌱 No recent logs logged. New activities appear when farmers upload measurements.
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {activities.map((act) => {
                  let badgeColor = "bg-gray-100 text-gray-700";
                  let emoji = "🌾";
                  switch (act.type) {
                    case "report":
                      badgeColor = "bg-blue-50 text-blue-700 border-blue-100";
                      emoji = "🔬";
                      break;
                    case "order":
                      badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      emoji = "📦";
                      break;
                    case "alert":
                      badgeColor = "bg-red-50 text-red-700 border-red-100";
                      emoji = "⚠️";
                      break;
                    case "consult":
                      badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                      emoji = "👨‍🌾";
                      break;
                    case "support":
                      badgeColor = "bg-purple-50 text-purple-700 border-purple-100";
                      emoji = "📬";
                      break;
                  }

                  return (
                    <div 
                      key={act.id} 
                      className="flex items-start gap-3 p-3.5 rounded-xl border-[0.5px] border-slate-100 bg-slate-50/50 hover:bg-white transition-all text-xs"
                    >
                      <span className="text-base shrink-0 select-none">{emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 leading-normal">{act.message}</p>
                        <div className="flex gap-2 mt-1.5 items-center">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-wider uppercase border ${badgeColor}`}>
                            {act.type}
                          </span>
                          <span className="text-[10px] text-gray-400">{act.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mt-5 pt-3.5 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center">
            <span>Systems online: Singapore API Node • Core Live DB</span>
            <span className="font-mono text-[#0F6E56]">Active Node</span>
          </div>
        </div>

        {/* Right: Task advisory list (40%) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-[0.5px] border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-gray-150 mb-4">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Agronomist Advisory Tasks</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Maintain review guidelines and equipment dispatches</p>
            </div>

            {/* Tasks list */}
            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 mb-4">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  🎉 All tasks finished! Enjoy your afternoon tea.
                </div>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-100 relative group transition-all text-xs ${
                      task.done ? "bg-slate-50 opacity-60 line-through" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                          task.done 
                            ? "bg-[#3B6D11] text-white" 
                            : "border border-slate-300 hover:border-[#3B6D11]"
                        }`}
                      >
                        {task.done && <Check className="w-3 h-3" />}
                      </button>
                      <span className="text-slate-700 font-medium leading-relaxed break-words">{task.text}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${
                        task.priority === 'High' 
                          ? 'bg-red-50 text-red-600' 
                          : task.priority === 'Medium' 
                            ? 'bg-amber-50 text-amber-600' 
                            : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {task.priority}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100 hover:text-red-500 transition-all cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Task Add Form */}
            <form onSubmit={addTask} className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Add New Advisor Directive</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Insert new agronomist reminder..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#3B6D11] rounded-lg px-3 py-2 flex-1 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="bg-[#3B6D11] disabled:opacity-50 text-white p-2 rounded-lg hover:bg-[#2e560d] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 text-[10px]">
                <span className="text-gray-400">Set Priority:</span>
                {(['High', 'Medium', 'Low'] as const).map(p => (
                  <label key={p} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={newTaskPriority === p}
                      onChange={() => setNewTaskPriority(p)}
                      className="accent-[#3B6D11]"
                    />
                    <span className={newTaskPriority === p ? "text-slate-800 font-bold" : "text-gray-500"}>{p}</span>
                  </label>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
