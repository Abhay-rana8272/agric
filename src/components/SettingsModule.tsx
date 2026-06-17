import React, { useState } from "react";
import { 
  Settings, 
  HelpCircle, 
  Lock, 
  Database, 
  Key, 
  Smartphone, 
  Check, 
  FileText, 
  Sliders, 
  Cpu, 
  SlidersHorizontal 
} from "lucide-react";
import { Farmer, SoilReport, Product } from "../types";

interface SettingsModuleProps {
  farmers: Farmer[];
  products: Product[];
  soilReports: SoilReport[];
  brandingTitle: string;
  onUpdateBranding: (newTitle: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  farmers,
  products,
  soilReports,
  brandingTitle,
  onUpdateBranding
}) => {
  const [bTitle, setBTitle] = useState(brandingTitle);
  const [brandingSaved, setBrandingSaved] = useState(false);

  // Key configurations
  const [twilioKey, setTwilioKey] = useState("SK_twilio_82739174621938");
  const [weatherKey, setWeatherKey] = useState("SK_accuweather_990184719");
  const [paymentsKey, setPaymentsKey] = useState("SK_razorpay_live_82739");

  // Toggle sliders
  const [enableSms, setEnableSms] = useState(true);
  const [enableWeather, setEnableWeather] = useState(true);
  const [enablePayments, setEnablePayments] = useState(false);
  const [enforceMfa, setEnforceMfa] = useState(true);
  const [ipRestrict, setIpRestrict] = useState(false);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBranding(bTitle.trim() || "Agriic Admin Terminal");
    setBrandingSaved(true);
    setTimeout(() => {
      setBrandingSaved(false);
    }, 3000);
  };

  // Live Data Export Generator (Dynamic files downloaded to client browser!)
  const triggerJSONDownload = (type: 'farmers' | 'soil' | 'products') => {
    let dataToExport: any = [];
    let filename = "";

    if (type === 'farmers') {
      dataToExport = farmers;
      filename = "agriic_growers_export.json";
    } else if (type === 'soil') {
      dataToExport = soilReports;
      filename = "agriic_soil_diagnostics.json";
    } else {
      dataToExport = products;
      filename = "agriic_inventory_catalog.json";
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerCSVDownload = () => {
    // Generate simple comma-separated string from farmers list
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Email,Phone,Location,Crop Focus,Land Scale,Role,Status\n";

    farmers.forEach(f => {
      const row = [
        f.id,
        `"${f.name}"`,
        f.email,
        `"${f.phone}"`,
        `"${f.location}"`,
        `"${f.cropFocus}"`,
        `"${f.landSize}"`,
        f.role,
        f.status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agriic_certified_farmers_database.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="settings-module">
      
      {/* 2x2 Grid setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Panel 1: Platform Branding (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
          <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-150 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#3B6D11]" />
            <span>Platform Branding Customizer</span>
          </h3>

          {brandingSaved && (
            <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-lg border border-emerald-250 flex items-center gap-1 font-bold animate-fade-in">
              <Check className="w-4 h-4 text-[#3B6D11]" />
              <span>Workspace configurations saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveBranding} className="space-y-3.5 text-xs text-slate-700">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Branded Agency Terminal Title</label>
              <input
                type="text"
                required
                value={bTitle}
                onChange={(e) => setBTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none focus:border-[#3B6D11]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Modifies title headers in real-time.</span>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Corporate Branding palette preset</label>
              <select
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-400"
              >
                <option>Active Palette: Agriic Botanical Green (#3B6D11) & Teal (#0F6E56)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!bTitle.trim()}
              className="bg-[#3B6D11] hover:bg-[#2e560d] text-white font-black py-2 px-5 rounded-lg cursor-pointer text-xs"
            >
              Update Brand Identity
            </button>
          </form>
        </div>

        {/* Panel 2: External API Gateways config (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-4 space-y-4">
          <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-150 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Active External Integrations</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Integration 1: Twilio SMS */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <strong className="text-slate-800 block">Twilio Automated SMS alert gateway</strong>
                <span className="text-[9.5px] text-gray-400 block font-mono">Status: {enableSms ? 'Active' : 'Deactivated'}</span>
              </div>
              <button
                onClick={() => setEnableSms(!enableSms)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  enableSms ? 'bg-[#3B6D11]' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  enableSms ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Integration 2: AccuWeather alerts */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-display">
              <div className="space-y-0.5">
                <strong className="text-slate-800 block">AccuWeather regional meteoro API</strong>
                <span className="text-[9.5px] text-gray-400 block font-mono">Status: {enableWeather ? 'Active' : 'Deactivated'}</span>
              </div>
              <button
                onClick={() => setEnableWeather(!enableWeather)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  enableWeather ? 'bg-[#3B6D11]' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  enableWeather ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Integration 3: Razorpay payments */}
            <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <strong className="text-slate-800 block">Razorpay domestic e-Store Checkout</strong>
                <span className="text-[9.5px] text-gray-400 block font-mono">Status: {enablePayments ? 'Active' : 'Deactivated'}</span>
              </div>
              <button
                onClick={() => setEnablePayments(!enablePayments)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  enablePayments ? 'bg-[#3B6D11]' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  enablePayments ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Row 2 Grid: 2 columns. Left: Security clearance 2FA (6 cols). Right: Data Export backup triggers (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Security Clearance 2FA */}
        <div className="lg:col-span-6 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
          <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-150 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>2FA Security Clearance</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* MFA Enforced */}
            <div className="flex items-center justify-between gap-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">Enforce Multifactor Authentication</span>
                <p className="text-[9.5px] text-gray-400 leading-tight">Obligatory MFA login parameters for corporate Agronomists</p>
              </div>
              <button
                onClick={() => setEnforceMfa(!enforceMfa)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  enforceMfa ? 'bg-[#3B6D11]' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  enforceMfa ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* IP restriction */}
            <div className="flex items-center justify-between gap-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">Restrict Access IP blocks</span>
                <p className="text-[9.5px] text-gray-400 leading-tight font-display">Limits terminal controls execution to official VPN blocks</p>
              </div>
              <button
                onClick={() => setIpRestrict(!ipRestrict)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  ipRestrict ? 'bg-[#3B6D11]' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  ipRestrict ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Data Export Center */}
        <div className="lg:col-span-6 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
          <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-150 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Interactive Data Export backups</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <p className="text-gray-400 text-[10.5px] leading-relaxed">
              Export and download high-resolution database listings compiled instantly from active state variables. Files are generated securely within sandboxed browser arrays:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => triggerCSVDownload()}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#0F6E56] border border-emerald-250 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Farmers (CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => triggerJSONDownload('farmers')}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <span>farmers_export.json</span>
              </button>
              <button
                type="button"
                onClick={() => triggerJSONDownload('soil')}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <span>soil_diagnostics.json</span>
              </button>
              <button
                type="button"
                onClick={() => triggerJSONDownload('products')}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <span>inventory_catalog.json</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
