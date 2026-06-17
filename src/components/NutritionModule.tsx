import React, { useState } from "react";
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  Calendar, 
  Plus, 
  Activity, 
  Check, 
  BookOpen 
} from "lucide-react";
import { NutritionPlan, Farmer } from "../types";

interface NutritionModuleProps {
  nutritionPlans: NutritionPlan[];
  farmers: Farmer[];
  onAddPlan: (plan: Omit<NutritionPlan, "id">) => void;
}

export const NutritionModule: React.FC<NutritionModuleProps> = ({
  nutritionPlans,
  farmers,
  onAddPlan
}) => {
  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [wTitle, setWTitle] = useState("");
  const [wCrop, setWCrop] = useState("Sugarcane");
  const [wpHRange, setWpHRange] = useState("6.0 - 7.0");
  const [wDuration, setWDuration] = useState(4);
  const [wFrequency, setWFrequency] = useState("Weekly");
  const [wIngredients, setWIngredients] = useState<string[]>([]);
  const [wStages, setWStages] = useState<{ week: string; description: string; formulation: string }[]>([
    { week: "Week 1", description: "Soil inoculants & microbial activation compound", formulation: "Active Soil Healer" },
    { week: "Week 2", description: "Vegetative foliar greening balance", formulation: "Agriic balanced NPK spray" },
    { week: "Week 3", description: "Trace micro-nutrient blossom induction", formulation: "Bloom Booster blend" },
    { week: "Week 4", description: "Root drenching & depth strengthening booster", formulation: "Seaweed extract drench" }
  ]);

  // Scheduler states
  const [scheduledEvents, setScheduledEvents] = useState([
    { id: "e1", farmer: "Rajesh Kumar", crop: "Wheat", formulation: "Core NPK Formula", date: "2026-06-18", status: "Scheduled" },
    { id: "e2", farmer: "Alok Patel", crop: "Cotton", formulation: "Bloom Booster Micro", date: "2026-06-20", status: "Scheduled" },
    { id: "e3", farmer: "Bhavana Reddy", crop: "Chillies", formulation: "Compost Tea Starter", date: "2026-06-21", status: "Scheduled" },
    { id: "e4", farmer: "Sanjay Deshmukh", crop: "Grapes", formulation: "Active Soil Healer", date: "2026-06-15", status: "Executed" }
  ]);
  const [newEventFarmer, setNewEventFarmer] = useState("");
  const [newEventCrop, setNewEventCrop] = useState("Sugarcane");
  const [newEventForm, setNewEventForm] = useState("Core NPK Formula");
  const [newEventDate, setNewEventDate] = useState("2026-06-19");

  const INGREDIENT_POOL = [
    "Agriic Core NPK Formula",
    "Bloom Booster Micro-nutrients",
    "Agriic Neem Pest Shield",
    "Root Stimulator & Seaweed",
    "Active Soil Healer",
    "Compost Tea Starter",
    "Humic Acid biological powder",
    "Bone Meal slow release"
  ];

  const handleToggleIngredient = (item: string) => {
    if (wIngredients.includes(item)) {
      setWIngredients(wIngredients.filter(i => i !== item));
    } else {
      setWIngredients([...wIngredients, item]);
    }
  };

  const handleStageDescChange = (index: number, val: string) => {
    const updated = [...wStages];
    updated[index].description = val;
    setWStages(updated);
  };

  const handleStageFormulationChange = (index: number, val: string) => {
    const updated = [...wStages];
    updated[index].formulation = val;
    setWStages(updated);
  };

  const submitWizardPlan = () => {
    if (!wTitle) return;

    onAddPlan({
      title: wTitle,
      cropType: wCrop,
      durationWeeks: wDuration,
      pHRange: wpHRange,
      ingredients: wIngredients.length > 0 ? wIngredients : ["NPK Core Formulation"],
      frequency: wFrequency,
      stages: wStages,
      isTemplate: true
    });

    // Reset wizard
    setWTitle("");
    setWIngredients([]);
    setWizardStep(1);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventFarmer) return;

    setScheduledEvents([
      ...scheduledEvents,
      {
        id: "ev-" + Date.now(),
        farmer: newEventFarmer,
        crop: newEventCrop,
        formulation: newEventForm,
        date: newEventDate,
        status: "Scheduled"
      }
    ]);
    setNewEventFarmer("");
  };

  const toggleEventStatus = (id: string) => {
    setScheduledEvents(scheduledEvents.map(ev => 
      ev.id === id ? { ...ev, status: ev.status === 'Scheduled' ? 'Executed' : 'Scheduled' } : ev
    ));
  };

  // Only display templates
  const planTemplates = nutritionPlans.filter(p => p.isTemplate);

  return (
    <div className="space-y-6 animate-fade-in" id="nutrition-module">
      
      {/* Upper Grid: 4-Step Plan Wizard (Primary focus) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Wizard Card (8 columns) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-150 flex items-center justify-between">
            <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Plant Nutrition Plan Wizard</span>
            </h3>
            <span className="text-[10px] bg-[#3B6D11]/10 text-[#3B6D11] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              Step {wizardStep} / 4
            </span>
          </div>

          <div className="p-6 text-xs text-slate-700">
            {/* Step Progress Bar Indicator */}
            <div className="flex justify-between items-center mb-6 relative">
              <div className="absolute left-0 right-0 h-0.5 bg-gray-100 top-1/2 -translate-y-1/2 -z-10"></div>
              {[1, 2, 3, 4].map(idx => (
                <div 
                  key={idx}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono transition-all border ${
                    wizardStep >= idx 
                      ? "bg-[#3B6D11] border-[#3B6D11] text-white shadow" 
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {idx}
                </div>
              ))}
            </div>

            {/* Step 1: Meta selection */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Step 1: Crop Selection & Soil Targets</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Plan Template Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rice Grain Dense-Stalk Diet"
                      value={wTitle}
                      onChange={(e) => setWTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#3B6D11]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Target Crop Focus</label>
                    <input
                      type="text"
                      placeholder="e.g. Basmati Paddy"
                      value={wCrop}
                      onChange={(e) => setWCrop(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#3B6D11]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Safe Operating pH Range</label>
                    <input
                      type="text"
                      value={wpHRange}
                      onChange={(e) => setWpHRange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Program Duration</label>
                    <select
                      value={wDuration}
                      onChange={(e) => setWDuration(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2"
                    >
                      <option value={4}>4 Weeks (Standard)</option>
                      <option value={8}>8 Weeks (Advanced Crop cycle)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Feeding Frequency</label>
                    <select
                      value={wFrequency}
                      onChange={(e) => setWFrequency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2"
                    >
                      <option value="Weekly">Weekly (High concentration)</option>
                      <option value="Bimonthly">Bimonthly (Balanced release)</option>
                      <option value="Every 10 Days">Every 10 Days</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Fertilizer Selection checklist */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Step 2: Selected Packages & Compound Pool</h4>
                <p className="text-gray-400 text-[10px] -mt-2">Choose which soil stimulants are required inside this agronomy program</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INGREDIENT_POOL.map((ing) => {
                    const isSelected = wIngredients.includes(ing);
                    return (
                      <div 
                        key={ing}
                        onClick={() => handleToggleIngredient(ing)}
                        className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                          isSelected 
                            ? "bg-[#3B6D11]/10 border-[#3B6D11] text-[#3B6D11] font-bold" 
                            : "bg-white hover:bg-slate-50 border-gray-200 text-slate-700"
                        }`}
                      >
                        <span>{ing}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? "bg-[#3B6D11] text-white border-[#3B6D11]" : "border-gray-200"
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Application stage description fields */}
            {wizardStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Step 3: Customize Segment Stages</h4>
                <p className="text-gray-400 text-[10px]">Define the precise localized dosage details for each stage week in crop cycle</p>
                
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {wStages.map((stage, sIdx) => (
                    <div key={stage.week} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black text-[#0F6E56] uppercase tracking-wider">{stage.week} Stage</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold block mb-0.5 text-gray-400 uppercase text-[9px]">Description Advisory</label>
                          <input
                            type="text"
                            value={stage.description}
                            onChange={(e) => handleStageDescChange(sIdx, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3B6D11]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-0.5 text-gray-400 uppercase text-[9px]">Specific Compound Dose</label>
                          <input
                            type="text"
                            value={stage.formulation}
                            onChange={(e) => handleStageFormulationChange(sIdx, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-[#3B6D11]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Summary Overview & trigger submit */}
            {wizardStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="font-bold text-slate-800 text-sm">Step 4: Finalize & Push Recipe to Library</h4>
                
                <div className="p-4 bg-slate-50 border border-[#3B6D11]/20 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-bold text-slate-800 text-sm">{wTitle || "Untitled Program Formula"}</span>
                    <span className="text-[9px] font-black bg-[#3B6D11] text-white uppercase px-2 py-0.5 rounded-md">
                      {wCrop}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500">
                    <div>pH TARGET: <strong className="text-slate-700">{wpHRange}</strong></div>
                    <div>SCHEDULE: <strong className="text-slate-700">{wFrequency}</strong></div>
                    <div>DURATION: <strong className="text-slate-700">{wDuration} Weeks</strong></div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[9.5px] uppercase font-black text-slate-400 block mb-1">Required Crop Food:</span>
                    <div className="flex flex-wrap gap-1">
                      {wIngredients.map(ing => (
                        <span key={ing} className="bg-white border border-slate-200 text-slate-600 rounded px-2 py-0.5 text-[9.5px]">
                          {ing}
                        </span>
                      ))}
                      {wIngredients.length === 0 && <span className="text-red-500 italic">No packages selected!</span>}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 italic">
                  * Clicking save will directly register the new customizable blueprint inside the central nutrition library collections tab, enabling immediate assignments.
                </p>
              </div>
            )}

            {/* Wizard Navigation */}
            <div className="flex justify-between items-center pt-5 mt-6 border-t border-gray-100">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              
              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (wizardStep === 1 && !wTitle.trim()) return;
                    setWizardStep(wizardStep + 1);
                  }}
                  className="bg-[#3B6D11] text-white font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-[#2e560d]"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitWizardPlan}
                  disabled={!wTitle.trim()}
                  className="bg-[#0F6E56] hover:bg-[#0c5946] text-white font-black py-2 px-5 rounded-lg cursor-pointer"
                >
                  Commit Program Blueprint
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Template Library list (4 columns) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-4 space-y-4">
          <div className="pb-2 border-b border-gray-150">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#3B6D11]" />
              <span>Plant Recipe Library</span>
            </h3>
            <p className="text-[9px] text-gray-400">Predefined crop blueprints engineered for optimum carbon harvest levels</p>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {planTemplates.map((p) => (
              <div 
                key={p.id}
                className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-white transition-all text-xs space-y-2 relative group"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-800 font-display leading-tight">{p.title}</h4>
                  <span className="text-[8px] bg-emerald-50 text-[#0F6E56] border border-emerald-100 font-bold px-1.5 py-0.5 rounded uppercase">
                    {p.cropType}
                  </span>
                </div>
                
                <p className="text-[10px] text-gray-400">
                  pH limits: <strong className="text-slate-600">{p.pHRange}</strong> • Term: <strong className="text-slate-600">{p.durationWeeks} Weeks</strong>
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {p.ingredients.slice(0, 3).map((ing, idx) => (
                    <span key={idx} className="bg-white border border-gray-200 text-[9px] text-gray-500 rounded px-1.5 py-0.5">
                      {ing}
                    </span>
                  ))}
                  {p.ingredients.length > 3 && (
                    <span className="text-[9px] text-gray-400 font-bold">+{p.ingredients.length - 3} more</span>
                  )}
                </div>

                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => {
                      setWTitle(p.title + " Copy");
                      setWCrop(p.cropType);
                      setWpHRange(p.pHRange);
                      setWDuration(p.durationWeeks);
                      setWIngredients(p.ingredients);
                      setWizardStep(1);
                    }}
                    className="w-full bg-[#3B6D11] hover:bg-[#2e560d] text-white text-[9px] py-1 rounded-md font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Bookmark className="w-3 h-3" />
                    <span>Copy variables into Wizard</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment 3: Scheduled application calendar */}
      <div className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-[#0F6E56]" />
              <span>Nutrition Application Calendar Scheduler</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Disperse and schedule periodic direct soil application dates for regional crop operators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Scheduled events view (8 cols) */}
          <div className="lg:col-span-8 space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {scheduledEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                Awaiting upcoming chemical dispatches. Schedule one on the right.
              </div>
            ) : (
              scheduledEvents.map((ev) => (
                <div 
                  key={ev.id}
                  className="flex items-center justify-between gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-150 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <button
                        onClick={() => toggleEventStatus(ev.id)}
                        className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                          ev.status === 'Executed' 
                            ? "bg-[#3B6D11] text-white" 
                            : "border border-slate-300 hover:border-[#3B6D11]"
                        }`}
                        title="Mark Completed"
                      >
                        {ev.status === 'Executed' && <Check className="w-3 h-3" />}
                    </button>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <span>{ev.farmer}</span>
                        <span className="text-[9px] bg-slate-100 text-[#0F6E56] font-extrabold px-1.5 py-0.2 rounded font-display uppercase">{ev.crop}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">Formula: <strong>{ev.formulation}</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[10px] text-slate-600 font-bold bg-white px-2.5 py-0.5 border border-slate-200 rounded-lg">
                      {ev.date}
                    </span>
                    <span className={`text-[9px] font-black uppercase text-center w-20 px-1.5 py-0.5 rounded ${
                      ev.status === 'Executed' ? 'bg-[#3B6D11]/10 text-[#3B6D11]' : 'bg-amber-100 text-amber-700 font-black'
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Schedule Adder (4 cols) */}
          <form onSubmit={handleAddSchedule} className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
            <h4 className="font-black text-xs uppercase text-[#0F6E56] flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Schedule Nutrient Task</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Select Farmer *</label>
              <select
                required
                value={newEventFarmer}
                onChange={(e) => setNewEventFarmer(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-[#3B6D11]"
              >
                <option value="">-- Choose Grower --</option>
                {farmers.filter(f => f.role === 'Farmer').map(f => (
                  <option key={f.id} value={f.name}>{f.name} ({f.location})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Crop Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat"
                  value={newEventCrop}
                  onChange={(e) => setNewEventCrop(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Fertilizer Compound</label>
              <select
                value={newEventForm}
                onChange={(e) => setNewEventForm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5"
              >
                <option value="Core NPK Formula">Core NPK Formula</option>
                <option value="Bloom Booster Micro">Bloom Booster Micro</option>
                <option value="Active Soil Healer">Active Soil Healer</option>
                <option value="Root Stimulator & Seaweed">Root Stimulator & Seaweed</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!newEventFarmer}
              className="w-full bg-[#0F6E56] disabled:opacity-40 hover:bg-[#0c5946] text-white font-black py-2 rounded-lg cursor-pointer text-[11px]"
            >
              Add Upcoming Schedule Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
