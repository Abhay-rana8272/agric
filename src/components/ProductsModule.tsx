import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  DollarSign, 
  ChevronRight, 
  BarChart, 
  Edit3 
} from "lucide-react";
import { Product, Order } from "../types";

interface ProductsModuleProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (prod: Omit<Product, "id">) => void;
  onEditProductStock: (id: string, newStock: number) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, nextStatus: 'Processing' | 'In-Transit' | 'Delivered') => void;
}

export const ProductsModule: React.FC<ProductsModuleProps> = ({
  products,
  orders,
  onAddProduct,
  onEditProductStock,
  onDeleteProduct,
  onUpdateOrderStatus
}) => {
  // Add Product Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState(299);
  const [newStock, setNewStock] = useState(50);
  const [newLowLimit, setNewLowLimit] = useState(15);
  const [newCategory, setNewCategory] = useState<'nutrition' | 'soil-health' | 'pest-control' | 'tools'>('nutrition');
  const [newImg, setNewImg] = useState("https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80");

  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editStockVal, setEditStockVal] = useState(0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddProduct({
      name: newName.trim(),
      desc: newDesc.trim() || "Multi-nutrient bio fertilizer package.",
      price: Number(newPrice),
      stock: Number(newStock),
      lowStockLimit: Number(newLowLimit),
      category: newCategory,
      img: newImg
    });

    setShowAddForm(false);
    setNewName("");
    setNewDesc("");
  };

  const handleSaveStock = (id: string) => {
    onEditProductStock(id, editStockVal);
    setEditingStockId(null);
  };

  // Kanban pipeline columns
  const COLUMNS = [
    { label: "Processing Logs", status: "Processing", bg: "bg-amber-50/50 border-amber-200" },
    { label: "In Transit Route", status: "In-Transit", bg: "bg-blue-50/50 border-blue-200" },
    { label: "Delivered Point", status: "Delivered", bg: "bg-emerald-50/50 border-emerald-250" }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="products-module">
      
      {/* Tab Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
            <Package className="w-5 h-5 text-[#3B6D11]" />
            <span>Product Inventory & Pipeline Commands</span>
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Control live stock thresholds and advance order fulfillment cycles</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#3B6D11] hover:bg-[#2e560d] text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Catalog Package</span>
        </button>
      </div>

      {/* Grid: 2 columns. Left: live product list with stock counters (7/12). Right: live low stock indicators (5/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Product CRUD List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
          <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-150">
            Active Catalog Management
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => {
              const isLowStock = p.stock <= p.lowStockLimit;
              return (
                <div 
                  key={p.id}
                  className={`p-3.5 rounded-xl border flex gap-3 relative transition-all ${
                    isLowStock ? "border-amber-400 bg-amber-50/10" : "border-slate-150 bg-white"
                  }`}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="min-w-0 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-slate-800 truncate" title={p.name}>{p.name}</h4>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="text-gray-400 hover:text-red-500 p-0.5 rounded cursor-pointer shrink-0"
                          title="Purge product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{p.desc}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-slate-50">
                      <span className="font-black text-[#0F6E56] font-mono">₹{p.price}</span>
                      
                      {/* Stock Counter modifier */}
                      {editingStockId === p.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editStockVal}
                            onChange={(e) => setEditStockVal(Number(e.target.value))}
                            className="w-12 bg-white border border-slate-300 rounded text-center text-xs py-0.5 font-bold font-mono outline-none"
                            min="0"
                          />
                          <button
                            onClick={() => handleSaveStock(p.id)}
                            className="bg-[#3B6D11] text-white text-[9px] font-black px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10.5px]">
                          <span className={`font-mono font-bold ${isLowStock ? "text-amber-600 font-extrabold" : "text-gray-500"}`}>
                            Stock: {p.stock}
                          </span>
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setEditStockVal(p.stock);
                            }}
                            className="text-gray-400 hover:text-slate-700 p-0.5"
                            title="Edit Stock Count"
                          >
                            <Edit3 className="w-3 h-3 animate-pulse" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isLowStock && (
                    <span className="absolute right-3 top-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Stock Warning Monitor (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-150 flex items-center gap-1">
              <BarChart className="w-4 h-4 text-amber-500" />
              <span>Safety Reserve Monitors</span>
            </h3>

            <div className="space-y-3.5 mt-4">
              {products.map((p) => {
                const stockPercent = Math.min(100, Math.max(0, (p.stock / 150) * 100));
                const isUnderAlert = p.stock <= p.lowStockLimit;

                return (
                  <div key={p.id} className="text-xs space-y-1">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-800 truncate max-w-[150px]">{p.name}</span>
                      <span className={`font-mono font-bold ${isUnderAlert ? "text-red-600" : "text-[#3B6D11]"}`}>
                        {p.stock} / 150 Level
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isUnderAlert ? "bg-red-500" : "bg-[#3B6D11]"
                        }`}
                        style={{ width: `${stockPercent}%` }}
                      ></div>
                    </div>
                    {isUnderAlert && (
                      <span className="text-[9px] text-red-600 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                        <span>Critical: Replenishment order advised (below {p.lowStockLimit})</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/40 text-[10.5px] text-red-800 mt-4 leading-relaxed">
            🌿 Low-stock alerts automatically flag items. Contact domestic terminal suppliers for rapid restocking of items displaying flashing crimson markers.
          </div>
        </div>
      </div>

      {/* Kanban Board Order Dispatch Pipeline */}
      <div className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
        <div className="pb-2 border-b border-gray-150">
          <h3 className="font-black text-slate-800 text-sm">Order Dispatch Kanban Pipeline</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Track and update the exact shipping cycle of compound packages. Advance state instantly in the database.</p>
        </div>

        {/* 3 Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="kanban-dispatch-board">
          {COLUMNS.map((col) => {
            const columnOrders = orders.filter(o => o.status === col.status);
            return (
              <div 
                key={col.status}
                className={`p-4 rounded-xl border ${col.bg} transition-all space-y-3`}
              >
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200">
                  <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider font-mono">{col.label}</span>
                  <span className="text-xs bg-white text-slate-800 font-extrabold px-2 py-0.5 rounded-full border border-slate-200 font-mono">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-0.5">
                  {columnOrders.length === 0 ? (
                    <div className="py-12 border border-dashed border-slate-200/50 rounded-lg text-center text-gray-400 text-[10px]">
                      🌌 No active dispatches under this column.
                    </div>
                  ) : (
                    columnOrders.map((ord) => (
                      <div 
                        key={ord.id}
                        className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm space-y-2"
                      >
                        <div className="flex justify-between items-start gap-1 text-[10px]">
                          <span className="font-mono font-bold text-gray-400 select-all">{ord.id}</span>
                          <span className="text-gray-400 font-mono">{ord.date}</span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-800 truncate" title={ord.farmerName}>
                            Grower: {ord.farmerName}
                          </h4>
                          <div className="space-y-0.5 mt-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="text-[10px] text-gray-600 flex justify-between">
                                <span className="truncate max-w-[120px]">{it.name}</span>
                                <span className="font-mono">x{it.qty}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-50 text-[10px]">
                          <span className="font-black text-[#0F6E56] font-mono">₹{ord.total}</span>
                          
                          {/* Next Pipeline Step button */}
                          {col.status !== "Delivered" && (
                            <button
                              onClick={() => {
                                const nextStatus = col.status === 'Processing' ? 'In-Transit' : 'Delivered';
                                onUpdateOrderStatus(ord.id, nextStatus);
                              }}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded text-slate-700 font-bold flex items-center gap-1 cursor-pointer hover:text-[#3B6D11]"
                              title="Advance to next step"
                            >
                              <span>Ship</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Product Dialog Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200 animate-fade-in">
            <div className="bg-[#3B6D11] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-white" />
                <span>Publish New Package</span>
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Product Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agriic Extreme Bloom Activator"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-[#3B6D11]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Catalog Description</label>
                <textarea
                  placeholder="Short explanation of trace element concentrations and Indian soil optimizations..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded p-2.5 resize-none outline-none focus:border-[#3B6D11]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Retail Price (₹INR) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Initial Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Low Stock Limit *</label>
                  <input
                    type="number"
                    required
                    value={newLowLimit}
                    onChange={(e) => setNewLowLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Inventory Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 outline-none text-slate-700"
                  >
                    <option value="nutrition">Soil Nutrition</option>
                    <option value="soil-health">Microbial Soil Health</option>
                    <option value="pest-control">Bio Pest Protection</option>
                    <option value="tools">Precision Diagnostics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Illustration Cover Image URL</label>
                <input
                  type="text"
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-gray-500"
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
                  disabled={!newName.trim()}
                  className="bg-[#3B6D11] hover:bg-[#2e560d] text-white font-black py-2 px-5 rounded-lg cursor-pointer"
                >
                  Publish Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
