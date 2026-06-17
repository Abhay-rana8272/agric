import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Tag, 
  Smartphone, 
  UserPlus, 
  X, 
  Notebook, 
  Mail, 
  Sliders, 
  Database,
  Briefcase
} from "lucide-react";
import { Farmer } from "../types";

interface FarmersModuleProps {
  farmers: Farmer[];
  onUpdateRole: (id: string, role: 'Super Admin' | 'Agronomist' | 'Farmer') => void;
  onUpdateStatus: (id: string, status: 'Active' | 'Suspended') => void;
  onAddFarmer: (farmer: Omit<Farmer, "id" | "joinedAt">) => void;
}

export const FarmersModule: React.FC<FarmersModuleProps> = ({
  farmers,
  onUpdateRole,
  onUpdateStatus,
  onAddFarmer
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  
  // States for adding farmer
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addLocation, setAddLocation] = useState("");
  const [addCrop, setAddCrop] = useState("");
  const [addScale, setAddScale] = useState("Medium Scale (5-15 Acres)");
  const [addRole, setAddRole] = useState<'Super Admin' | 'Agronomist' | 'Farmer'>("Farmer");

  // Filter list
  const filteredFarmers = farmers.filter(f => {
    const text = (f.name + f.email + f.location + f.cropFocus).toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail || !addPhone) return;
    onAddFarmer({
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim(),
      location: addLocation.trim() || "Maharashtra",
      cropFocus: addCrop.trim() || "Millet",
      landSize: addScale,
      role: addRole,
      status: "Active"
    });
    setAddName("");
    setAddEmail("");
    setAddPhone("");
    setAddLocation("");
    setAddCrop("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="farmers-module">
      
      {/* Directory Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search farmers by name, location, or crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 outline-none focus:border-[#3B6D11] focus:ring-1 focus:ring-[#3B6D11] text-xs rounded-xl pl-9 pr-4 py-2.5 transition"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#3B6D11] hover:bg-[#2e560d] text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Farmer</span>
        </button>
      </div>

      {/* Grid containing directory and active profile panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left: Directory Logs Table */}
        <div className="xl:col-span-8 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-150 flex items-center justify-between">
            <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider">Farmer Records Log</h3>
            <span className="text-[10px] bg-[#3B6D11]/10 text-[#3B6D11] font-extrabold px-2 py-0.5 rounded-full">
              {filteredFarmers.length} total matched
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/50 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-4">Name / ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Crop Focus</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-slate-700">
                {filteredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      🔍 No certified farmers found matching the keyword.
                    </td>
                  </tr>
                ) : (
                  filteredFarmers.map((f) => (
                    <tr 
                      key={f.id}
                      onClick={() => setSelectedFarmer(f)}
                      className={`hover:bg-slate-50/70 transition-all cursor-pointer ${
                        selectedFarmer?.id === f.id ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div>{f.name}</div>
                        <div className="text-[9.5px] text-gray-400 mt-0.5 font-mono">{f.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-[#0F6E56]" />
                          <span>{f.location}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          f.role === 'Super Admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : f.role === 'Agronomist'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {f.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {f.cropFocus}
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <select 
                            value={f.status}
                            onChange={(e) => onUpdateStatus(f.id, e.target.value as 'Active' | 'Suspended')}
                            className={`border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              f.status === 'Active' ? 'text-emerald-600 font-black' : 'text-red-500 font-semibold'
                            }`}
                          >
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Farmer Profile Side-Panel */}
        <div className="xl:col-span-4 space-y-4">
          {selectedFarmer ? (
            <div className="bg-white rounded-2xl border-[0.5px] border-emerald-600/20 shadow-md overflow-hidden animate-fade-in">
              <div className="bg-[#2b3a30] p-5 text-white flex justify-between items-start">
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-[#c2dd74] font-black block">Farmer Profile Panel</span>
                  <h3 className="font-black text-base truncate mt-0.5">{selectedFarmer.name}</h3>
                  <p className="text-[10px] text-white/70 font-mono">{selectedFarmer.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedFarmer(null)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Detail fields */}
              <div className="p-5 space-y-4 text-xs">
                {/* Field Details */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 font-medium">Email Adress</span>
                    <span className="font-semibold text-slate-800 break-all select-all flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>{selectedFarmer.email}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 font-medium">Mobile Phone</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{selectedFarmer.phone}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 font-medium">Farm Territory</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#3B6D11]" />
                      <span>{selectedFarmer.location}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 font-medium">Land Acreage scale</span>
                    <span className="font-semibold text-slate-800">{selectedFarmer.landSize}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 font-medium font-display">Major Plants Focus</span>
                    <span className="font-bold text-[#0F6E56] font-display">{selectedFarmer.cropFocus}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 font-medium">Account Created On</span>
                    <span className="font-mono text-[10px] text-gray-500">{new Date(selectedFarmer.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1.5 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#3B6D11]" />
                    <span>System Role Switcher</span>
                  </label>
                  <div className="flex gap-1.5">
                    {(['Farmer', 'Agronomist', 'Super Admin'] as const).map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          onUpdateRole(selectedFarmer.id, role);
                          setSelectedFarmer({ ...selectedFarmer, role });
                        }}
                        className={`flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                          selectedFarmer.role === role 
                            ? 'bg-[#3B6D11] text-white shadow-sm' 
                            : 'bg-white text-gray-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                        title={`Assign role ${role}`}
                        type="button"
                      >
                        {role === 'Farmer' ? 'Farmer' : role === 'Agronomist' ? 'Staff' : 'Admin'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro diagnostics checklist log */}
                <div className="p-3.5 bg-yellow-50/50 border border-yellow-200/40 rounded-xl space-y-1.5">
                  <strong className="text-[10px] font-black uppercase text-amber-900/70 block flex items-center gap-1">
                    <Notebook className="w-3.5 h-3.5 text-amber-700" />
                    <span>Agronomist Notes Segment</span>
                  </strong>
                  <p className="text-[11px] leading-relaxed text-amber-900/80 italic">
                    "Registered grower shows consistent cooperation. Soil pH in central acreage blocks tends to be highly acidic. Recommended systematic application calendars."
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border-[0.5px] border-dashed border-gray-300 text-center text-gray-400 text-xs">
              👈 Select a row in the table to display full farm metrics and update staff roles in real-time.
            </div>
          )}
        </div>
      </div>

      {/* Register Farmer Dialog Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#1b261f]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200 animate-fade-in">
            <div className="bg-[#3B6D11] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#c2dd74]" />
                <span>Register Certified Farmer</span>
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Representative Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balakrishnan Deshmukh"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#3B6D11] outline-none rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@agrimail.in"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#3B6D11] outline-none rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 99000 00000"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#3B6D11] outline-none rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Regional State Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Punjab (Ludhiana)"
                    value={addLocation}
                    onChange={(e) => setAddLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#3B6D11] outline-none rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Crop Focus</label>
                  <input
                    type="text"
                    placeholder="e.g. Green Vegetables"
                    value={addCrop}
                    onChange={(e) => setAddCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#3B6D11] outline-none rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Land Holding scale</label>
                <select
                  value={addScale}
                  onChange={(e) => setAddScale(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 outline-none rounded-lg px-2.5 py-2 text-xs text-slate-700"
                >
                  <option>Backyard Garden (5-15 pots)</option>
                  <option>Smallholder (1-5 Acres)</option>
                  <option>Medium Scale (5-15 Acres)</option>
                  <option>Commercial Scale (15+ Acres)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">System Account Role</label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as 'Super Admin' | 'Agronomist' | 'Farmer')}
                  className="w-full bg-slate-50 border border-slate-200 outline-none rounded-lg px-2.5 py-2 text-xs text-slate-700"
                >
                  <option value="Farmer">Farmer (Standard client)</option>
                  <option value="Agronomist">Agronomist (Staff consultant)</option>
                  <option value="Super Admin">Super Admin (Universal rights)</option>
                </select>
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
                  className="bg-[#3B6D11] hover:bg-[#2e560d] text-white font-black py-2 px-5 rounded-lg cursor-pointer"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
