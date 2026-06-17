import React, { useState } from "react";
import { 
  FileText, 
  Video, 
  HelpCircle, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle,
  ExternalLink,
  Smartphone
} from "lucide-react";
import { ContentItem } from "../types";

interface ContentModuleProps {
  contentItems: ContentItem[];
  onAddContent: (item: Omit<ContentItem, "id" | "publishedAt" | "targetPushSent">) => void;
  onDeleteContent: (id: string) => void;
  onSendSegmentalPush: (segment: string, subject: string, messageText: string) => void;
}

export const ContentModule: React.FC<ContentModuleProps> = ({
  contentItems,
  onAddContent,
  onDeleteContent,
  onSendSegmentalPush
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cms' | 'faq' | 'push'>('cms');
  
  // CMS states
  const [showAddForm, setShowAddForm] = useState(false);
  const [cTitle, setCTitle] = useState("");
  const [cType, setCType] = useState<'article' | 'video'>('article');
  const [cCategory, setCCategory] = useState("Micro-nutrients");
  const [cBody, setCBody] = useState("");
  const [cVideoUrl, setCVideoUrl] = useState("");

  // FAQ states
  const [faqs, setFaqs] = useState([
    { question: "What is the optimum soil pH for commercial Sugarcane block cultivation?", answer: "Generally, sugarcane thrives in neutral to slightly acidic soils ranging between 6.0 and 7.5. Excess soil acidity below 5.5 limits nutrient extraction and leads to calcium deficiencies." },
    { question: "Is the Neem Pest Shield safe to mix into high-intensity drip systems?", answer: "We advise against injecting raw neem oil directly into micro-emitters as it can cause wax blockages. Instead, utilize foliar canopy spraying during late afternoon hours." },
    { question: "How does humic acid powder support compacted clay blocks?", answer: "Humic and fulvic acids act as chemical chelators, breaking up hard packed aluminosilicates, allowing organic matter expansion and deep hydration channels." }
  ]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Push states
  const [targetSegment, setTargetSegment] = useState("Punjab Wheat Growers");
  const [pushSubject, setPushSubject] = useState("Urgent: Impending Rain - Apply Root Micro NPK Doses Immediately");
  const [pushText, setPushText] = useState("Weather alerts specify heavy showers starting Ludhiana tomorrow morning. Advise all certified wheat partners to apply 15kg/acre Core NPK balanced powder immediately.");
  const [pushSuccess, setPushSuccess] = useState(false);

  const handleSubmitCMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle.trim() || !cBody.trim()) return;

    onAddContent({
      title: cTitle.trim(),
      type: cType,
      category: cCategory,
      contentBody: cBody.trim(),
      videoUrl: cType === 'video' ? cVideoUrl.trim() : undefined
    });

    setShowAddForm(false);
    setCTitle("");
    setCBody("");
    setCVideoUrl("");
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs([...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ("");
    setNewFaqA("");
  };

  const handleDeleteFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleDispatchPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushText.trim()) return;

    onSendSegmentalPush(targetSegment, pushSubject, pushText.trim());
    setPushSuccess(true);
    setTimeout(() => {
      setPushSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="content-module">
      
      {/* Content tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('cms')}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeSubTab === 'cms' 
              ? "border-[#3B6D11] text-[#3B6D11]" 
              : "border-transparent text-gray-400 hover:text-slate-800"
          }`}
        >
          Scientific Botanical CMS ({contentItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('faq')}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeSubTab === 'faq' 
              ? "border-[#3B6D11] text-[#3B6D11]" 
              : "border-transparent text-gray-400 hover:text-slate-800"
          }`}
        >
          Grower FAQ Accordions ({faqs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('push')}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeSubTab === 'push' 
              ? "border-[#3B6D11] text-[#3B6D11]" 
              : "border-transparent text-gray-400 hover:text-slate-800"
          }`}
        >
          Segmental SMS Push
        </button>
      </div>

      {/* SUB-TAB 1: CMS Article & Video list */}
      {activeSubTab === 'cms' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border-[0.5px] border-gray-200 shadow-sm">
            <div>
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Agrononical Content CMS</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Author crop-diagnostic training pieces or register interactive video links</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#3B6D11] hover:bg-[#2e560d] text-white text-[10px] font-black py-1.5 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Draft Content Piece</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contentItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {item.type === 'video' && item.videoUrl ? (
                    <div className="aspect-video bg-slate-100 flex items-center justify-center relative group">
                      <iframe
                        src={item.videoUrl}
                        title={item.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-emerald-50 to-indigo-50/20 p-4 border-b border-gray-150 flex flex-col justify-between">
                      <span className="text-[9px] bg-emerald-100 text-[#0F6E56] font-bold px-2 py-0.5 rounded-full uppercase self-start">
                        {item.category}
                      </span>
                      <FileText className="w-8 h-8 text-[#3B6D11]" />
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-extrabold text-[#3B6D11] text-xs font-display leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => onDeleteContent(item.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded cursor-pointer shrink-0"
                        title="Delete piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">
                      {item.contentBody}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 text-[9.5px] text-gray-400 font-mono border-t border-slate-50 flex justify-between items-center">
                  <span>Published: {item.publishedAt}</span>
                  <span className="uppercase font-bold text-[#0F6E56]">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FAQs editor */}
      {activeSubTab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* FAQ list viewer */}
          <div className="lg:col-span-8 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="font-black text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-gray-150">
              Active Crop Advisory FAQs
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-slate-800 text-xs flex items-start gap-1.5 leading-relaxed">
                      <HelpCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{faq.question}</span>
                    </h4>
                    <button
                      onClick={() => handleDeleteFaq(idx)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition duration-200 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11.5px] text-gray-500 leading-relaxed pl-5 pr-4 border-l border-emerald-600/30">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ creator */}
          <form onSubmit={handleAddFaq} className="lg:col-span-4 bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-4 text-xs space-y-3">
            <h3 className="font-black text-xs uppercase text-[#0F6E56] pb-2 border-b border-slate-150">
              Add Field FAQ Question
            </h3>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Question Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. How often to spray nitrogen formulas during monsoons?"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:border-[#3B6D11] outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Scientific Answer advisory *</label>
              <textarea
                required
                placeholder="Write customized advisory explanations..."
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                className="w-full h-24 bg-slate-50 border border-slate-200 rounded p-2.5 resize-none outline-none focus:border-[#3B6D11]"
              />
            </div>

            <button
              type="submit"
              disabled={!newFaqQ.trim() || !newFaqA.trim()}
              className="w-full bg-[#3B6D11] disabled:opacity-45 text-white hover:bg-[#2e560d] font-black py-2 rounded-lg cursor-pointer text-[10.5px]"
            >
              Publish FAQ Card
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: Segmental Push Dispatch tool */}
      {activeSubTab === 'push' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-sm p-6 space-y-5 animate-fade-in">
          <div className="pb-3 border-b border-slate-150 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-[#0F6E56]" />
                <span>Segmental Safety Push Broadcast</span>
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Stream meteorological and chemical recommendations instantly to farmer segments</p>
            </div>
          </div>

          {pushSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3.5 rounded-xl border border-emerald-250 flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-[#3B6D11]" />
              <span>Broadcast dispatched successfully to telemetry channels! Log appended.</span>
            </div>
          )}

          <form onSubmit={handleDispatchPush} className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Target Segment *</label>
              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2"
              >
                <option value="Punjab Wheat Growers">Punjab Wheat Growers (Rajesh Kumar, etc.)</option>
                <option value="Gujarat Cotton Growers">Gujarat Cotton Growers (Alok Patel)</option>
                <option value="Southern Paddy Cultivators">Southern Paddy & Sugarcane (Meenakshi, etc.)</option>
                <option value="All Certified Growers">All Registered Farmers</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Push Subject Header</label>
              <input
                type="text"
                required
                value={pushSubject}
                onChange={(e) => setPushSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:border-[#3B6D11]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1 font-display">Broadcast Body advisory text *</label>
              <textarea
                required
                rows={4}
                value={pushText}
                onChange={(e) => setPushText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 resize-none outline-none focus:border-[#3B6D11]"
              />
            </div>

            <button
              type="submit"
              disabled={!pushText.trim()}
              className="w-full bg-[#0F6E56] hover:bg-[#0c5946] font-black text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Segment Push Broadcast</span>
            </button>
          </form>
        </div>
      )}

      {/* Draft Content Modal Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200 animate-fade-in text-xs text-slate-700">
            <div className="bg-[#3B6D11] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-wider">
                Publish Agronomy training
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCMS} className="p-5 space-y-3.5">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-0.5">Content Type</label>
                  <select
                    value={cType}
                    onChange={(e) => setCType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700"
                  >
                    <option value="article">Scientific Article</option>
                    <option value="video">Embedded Video Guide</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-0.5">Category Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Irrigation, Soil pH"
                    value={cCategory}
                    onChange={(e) => setCCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Title Theme *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mitigating Al toxicity signs in sugar plots"
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs"
                />
              </div>

              {cType === 'video' && (
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">YouTube Embed URL *</label>
                  <input
                    type="text"
                    placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={cVideoUrl}
                    onChange={(e) => setCVideoUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Content description body *</label>
                <textarea
                  required
                  placeholder="Draft scientific, trace element analysis descriptions or video summaries..."
                  value={cBody}
                  onChange={(e) => setCBody(e.target.value)}
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded p-2.5 resize-none text-xs focus:border-[#3B6D11] outline-none"
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
                  disabled={!cTitle || !cBody}
                  className="bg-[#3B6D11] hover:bg-[#2e560d] text-white font-black py-2 px-5 rounded-lg cursor-pointer"
                >
                  Publish Content Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
