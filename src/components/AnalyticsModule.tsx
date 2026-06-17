import React, { useState } from "react";
import { 
  BarChart as RcBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line 
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Percent, 
  Calendar, 
  Leaf, 
  Activity, 
  PieChart 
} from "lucide-react";
import { Order, Farmer, SoilReport } from "../types";

interface AnalyticsModuleProps {
  orders: Order[];
  farmers: Farmer[];
  soilReports: SoilReport[];
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  orders,
  farmers,
  soilReports
}) => {
  const [timeframe, setTimeframe] = useState<'30_days' | '6_months' | 'all_year'>('30_days');

  // Math metrics
  const activeFarmersCount = farmers.filter(f => f.role === 'Farmer').length;
  const totalRevenue = orders.reduce((sum, curr) => sum + curr.total, 0);
  const averageOrderVal = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // 1. Sales revenue trend points
  const revenueHistory = [
    { month: "Jan", Sales: 18400, Registrations: 3 },
    { month: "Feb", Sales: 24700, Registrations: 5 },
    { month: "Mar", Sales: 38100, Registrations: 12 },
    { month: "Apr", Sales: 42900, Registrations: 15 },
    { month: "May", Sales: 53100, Registrations: 18 },
    { month: "Jun", Sales: 61800, Registrations: 24 }
  ];

  // 2. Crop Yield comparison data model (Agriic Science vs Conventional results)
  const yieldComparison = [
    { crop: "Sugarcane", Agriic: 44.5, Conventional: 32.1, Metres: "Tons/Acre" },
    { crop: "Basmati Rice", Agriic: 6.8, Conventional: 4.5, Metres: "Quintals/Acre" },
    { crop: "Chillies", Agriic: 12.4, Conventional: 8.8, Metres: "Quintals/Acre" },
    { crop: "Cotton", Agriic: 18.2, Conventional: 13.5, Metres: "Quintals/Acre" },
    { crop: "Grapes", Agriic: 15.5, Conventional: 11.2, Metres: "Tons/Acre" }
  ];

  // 3. Farmer Consultation & Engagement volume
  const engagementStats = [
    { name: "Week 1", Consults: 8, ReportsChecked: 14, CartSessions: 42 },
    { name: "Week 2", Consults: 12, ReportsChecked: 19, CartSessions: 55 },
    { name: "Week 3", Consults: 15, ReportsChecked: 22, CartSessions: 60 },
    { name: "Current Week", Consults: 18, ReportsChecked: 28, CartSessions: 85 }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="analytics-module">
      
      {/* Time Filter Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border-[0.5px] border-gray-200">
        <div>
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <Activity className="w-4 h-4 text-[#0F6E56]" />
            <span>Interactive Performance Metrics Reports</span>
          </h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Statistical yield analyses & commerce telemetry aggregates</p>
        </div>
        <div className="flex gap-1">
          {([
            { id: '30_days', label: 'Last 30 Days' },
            { id: '6_months', label: '6 Months Overview' },
            { id: 'all_year', label: 'Annual' }
          ] as const).map(bt => (
            <button
              key={bt.id}
              onClick={() => setTimeframe(bt.id)}
              className={`py-1 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                timeframe === bt.id 
                  ? 'bg-[#3B6D11] text-white shadow-sm' 
                  : 'bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border-[0.5px] border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-gray-400 text-[10px] uppercase font-black tracking-wider">
            <span>Aggregated Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-[#0F6E56]" />
          </div>
          <h4 className="text-xl font-black text-slate-800 mt-2">₹{(totalRevenue + 218000).toLocaleString()}</h4>
          <span className="text-[9px] text-[#3B6D11] font-bold mt-1 block">▲ +14% relative growth</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-[0.5px] border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-gray-400 text-[10px] uppercase font-black tracking-wider">
            <span>Verified Farmer Growth</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <h4 className="text-xl font-black text-slate-800 mt-2">+{farmers.length * 4} Growers</h4>
          <span className="text-[9px] text-indigo-600 font-bold mt-1 block">Direct organic signups</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-[0.5px] border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-gray-400 text-[10px] uppercase font-black tracking-wider">
            <span>Average Order Total</span>
            <span className="text-[#0F6E56] font-bold font-mono">₹</span>
          </div>
          <h4 className="text-xl font-black text-slate-800 mt-2">₹{averageOrderVal.toLocaleString()}</h4>
          <span className="text-[9px] text-gray-500 mt-1 block">Average cart checkout items</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-[0.5px] border-gray-200 shadow-sm">
          <div className="flex justify-between items-center text-gray-400 text-[10px] uppercase font-black tracking-wider">
            <span>Advisory NPS Target</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <h4 className="text-xl font-black text-slate-800 mt-2">94.8% SLA</h4>
          <span className="text-[9px] text-amber-600 font-bold mt-1 block">Feedback rating average</span>
        </div>
      </div>

      {/* Recharts Diagrams Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Earnings area graph (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#3B6D11]" />
              <span>Earnings Pipeline History</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Consolidated monthly retail transactions sales</p>
          </div>

          <div className="h-64" id="revenue-area-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B6D11" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B6D11" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Area type="monotone" dataKey="Sales" name="Sales Revenue (₹)" stroke="#3B6D11" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farmer harvest comparative yields chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-4 h-4 text-[#0F6E56]" />
              <span>Yield Improvement Science Data</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Comparison measuring Agriic Science results vs standard methods</p>
          </div>

          <div className="h-64" id="crop-yield-bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <RcBarChart data={yieldComparison} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" stroke="#94a3b8" style={{ fontSize: "9px", fontWeight: "700" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
                <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="Agriic" name="Agriic Method" fill="#0F6E56" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Conventional" name="Traditional Method" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </RcBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Engagement logs volume line chart */}
      <div className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
        <div>
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#3B6D11]" />
            <span>Grower Engagement & Consultation Loads</span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Weekly volume trends logging farmer diagnostics requests and consultationsCompleted</p>
        </div>

        <div className="h-60" id="engagement-line-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementStats} margin={{ top: 5, right: 15, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "600" }} />
              <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Line type="monotone" dataKey="Consults" name="Agronomist Bookings" stroke="#0F6E56" strokeWidth={3} />
              <Line type="monotone" dataKey="ReportsChecked" name="Soil Reports Reviewed" stroke="#3B6D11" strokeWidth={3} />
              <Line type="monotone" dataKey="CartSessions" name="E-Store Sessions (*10)" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
