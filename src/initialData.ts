import { 
  Farmer, 
  SoilReport, 
  DeficiencyAlertRule, 
  NutritionPlan, 
  Product, 
  Order, 
  Consultation, 
  ContentItem, 
  SupportTicket, 
  DashboardActivity,
  WorkspaceSettings
} from "./types";
import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  writeBatch 
} from "./lib/firebase";

// Realistic Seed Data
export const SEED_FARMERS: Farmer[] = [
  {
    id: "FARMER_001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@agrilink.in",
    phone: "+91 98765 43210",
    role: "Farmer",
    location: "Punjab (Ludhiana)",
    cropFocus: "Wheat & Basmati Rice",
    landSize: "15 Acres (Commercial)",
    status: "Active",
    joinedAt: "2026-01-10T08:30:00Z"
  },
  {
    id: "FARMER_002",
    name: "Alok Patel",
    email: "alok.patel@agrimail.in",
    phone: "+91 94270 12345",
    role: "Farmer",
    location: "Gujarat (Anand)",
    cropFocus: "Cotton & Groundnut",
    landSize: "8 Acres (Medium)",
    status: "Active",
    joinedAt: "2026-02-14T09:15:00Z"
  },
  {
    id: "FARMER_003",
    name: "Bhavana Reddy",
    email: "bhavana.reddy@kisan.co",
    phone: "+91 81234 56789",
    role: "Farmer",
    location: "Andhra Pradesh (Guntur)",
    cropFocus: "Chillies & Turmeric",
    landSize: "4.5 Acres (Sub-medium)",
    status: "Active",
    joinedAt: "2026-03-01T14:22:00Z"
  },
  {
    id: "FARMER_004",
    name: "Sanjay Deshmukh",
    email: "sanjay.deshmukh@gmail.com",
    phone: "+91 70201 98765",
    role: "Farmer",
    location: "Maharashtra (Nashik)",
    cropFocus: "Grapes & Pomegranates",
    landSize: "12 Acres (Commercial)",
    status: "Active",
    joinedAt: "2026-03-25T11:05:00Z"
  },
  {
    id: "FARMER_005",
    name: "Meenakshi Sundaram",
    email: "meenakshi.s@rythu.org",
    phone: "+91 99401 23456",
    role: "Farmer",
    location: "Tamil Nadu (Thanjavur)",
    cropFocus: "Sugarcane & Paddy",
    landSize: "22 Acres (High Scale)",
    status: "Active",
    joinedAt: "2026-04-12T16:40:00Z"
  },
  {
    id: "AGR_001",
    name: "Dr. Ramesh Shinde",
    email: "ramesh.shinde@agriic.com",
    phone: "+91 90045 67890",
    role: "Agronomist",
    location: "Maharashtra (Pune)",
    cropFocus: "Soil Chemistry & Botany",
    landSize: "Consultant Staff",
    status: "Active",
    joinedAt: "2026-01-01T09:00:00Z"
  },
  {
    id: "AGR_002",
    name: "Anjali Sharma",
    email: "anjali.sharma@agriic.com",
    phone: "+91 91122 33445",
    role: "Agronomist",
    location: "Haryana (Karnal)",
    cropFocus: "Cereal Crop Nutrition",
    landSize: "Consultant Staff",
    status: "Active",
    joinedAt: "2026-01-15T10:00:00Z"
  }
];

export const SEED_SOIL_REPORTS: SoilReport[] = [
  {
    id: "REP-9921",
    farmerId: "FARMER_001",
    farmerName: "Rajesh Kumar",
    farmName: "Ludhiana North Farm A",
    pH: 7.4,
    nitrogen: 18,
    phosphorus: 24,
    potassium: 110,
    moisture: 42,
    status: "Reviewed",
    actionTaken: "High alkalinity; Nitrogen deficiency verified. Recommended Core NPK Formula with acidifying sulfur amendment.",
    cropType: "Wheat",
    uploadDate: "2026-06-10"
  },
  {
    id: "REP-9922",
    farmerId: "FARMER_002",
    farmerName: "Alok Patel",
    farmName: "Anand Cotton Plot",
    pH: 5.4,
    nitrogen: 45,
    phosphorus: 12,
    potassium: 85,
    moisture: 30,
    status: "Pending",
    actionTaken: "Acidic soil. Phosphorus is lock-bound. Requires lime powder application list alongside Bloom Booster phosphorus blend.",
    cropType: "Cotton",
    uploadDate: "2026-06-14"
  },
  {
    id: "REP-9923",
    farmerId: "FARMER_003",
    farmerName: "Bhavana Reddy",
    farmName: "Guntur Organic Chilli Field",
    pH: 6.5,
    nitrogen: 12,
    phosphorus: 38,
    potassium: 165,
    moisture: 55,
    status: "Reviewed",
    actionTaken: "Pristine neutral pH. Nitrogen is severely depleted. Prescribed organic compost tea and seaweed extract booster.",
    cropType: "Chillies",
    uploadDate: "2026-06-16"
  },
  {
    id: "REP-9924",
    farmerId: "FARMER_004",
    farmerName: "Sanjay Deshmukh",
    farmName: "Nashik Vineyard Yard",
    pH: 6.2,
    nitrogen: 35,
    phosphorus: 40,
    potassium: 90,
    moisture: 25,
    status: "Pending",
    actionTaken: "Awaiting agronomist visual diagnostics check. Potassium levels are low for grape sweetening period.",
    cropType: "Grapes",
    uploadDate: "2026-06-17"
  }
];

export const SEED_DEFICIENCY_RULES: DeficiencyAlertRule[] = [
  {
    id: "RULE_01",
    parameter: "pH",
    operand: "less_than",
    value: 5.5,
    severity: "Critical",
    message: "Severe soil acidity detected. Aluminum toxicity risk. Locks down phosphorus absorption.",
    active: true
  },
  {
    id: "RULE_02",
    parameter: "Nitrogen",
    operand: "less_than",
    value: 20,
    severity: "Warning",
    message: "Low nitrogen count. Will cause yellowing (chlorosis) of lower leaves & stunted crop growth.",
    active: true
  },
  {
    id: "RULE_03",
    parameter: "Potassium",
    operand: "less_than",
    value: 120,
    severity: "Warning",
    message: "Deficient potash levels. Impairs carbohydrate translocation, weakening stems & reducing fruit size.",
    active: true
  },
  {
    id: "RULE_04",
    parameter: "Moisture",
    operand: "less_than",
    value: 25,
    severity: "Critical",
    message: "Extreme soil dry state. Direct water stress hazard. Delay any immediate powder NPK applications.",
    active: false
  }
];

export const SEED_NUTRITION_PLANS: NutritionPlan[] = [
  {
    id: "PLAN_TEMP_001",
    title: "Premium Sugarcane Yield Booster Plan",
    cropType: "Sugarcane",
    durationWeeks: 4,
    pHRange: "6.0 - 7.5",
    ingredients: ["NPK 10-10-10", "Active Soil Healer", "Seaweed Extract", "Bone Meal"],
    frequency: "Bimonthly",
    stages: [
      { week: "Week 1", description: "Soil preparation and microbial starter blend", formulation: "Active Soil Healer 10kg/acre + Compost Tea" },
      { week: "Week 2", description: "Vegetative burst nitrogen surge application", formulation: "Agriic Core NPK Formula, 25kg/acre" },
      { week: "Week 3", description: "Foliar trace mineral and seaweed misting", formulation: "Seaweed Extract (1L in water spray)" },
      { week: "Week 4", description: "Phosphate binding soil conditioning", formulation: "Bone Meal slow release, 15kg/acre" }
    ],
    isTemplate: true
  },
  {
    id: "PLAN_TEMP_002",
    title: "Cotton Fiber Strengthening & Bloom Plan",
    cropType: "Cotton",
    durationWeeks: 4,
    pHRange: "5.8 - 6.8",
    ingredients: ["Bloom Booster Micro-nutrients", "Root Stimulator", "Neem Pest Shield"],
    frequency: "Weekly",
    stages: [
      { week: "Week 1", description: "Deep root drenching & organic defense layering", formulation: "Root Stimulator & Seaweed 2L/acre" },
      { week: "Week 2", description: "Fruiting site induction nitrogen balanced feed", formulation: "Agriic Core NPK balanced, 15kg/acre" },
      { week: "Week 3", description: "Bloom booster high-calcium micro blend spray", formulation: "Bloom Booster calcium-rich spray, 500g/acre" },
      { week: "Week 4", description: "Pest preventative organic shield coating", formulation: "Neem Pest Shield 100% spray, 1.5L/acre" }
    ],
    isTemplate: true
  },
  {
    id: "PLAN_TEMP_003",
    title: "All-purpose Vegetable Organic Garden Diet",
    cropType: "Vegetables & Herbs",
    durationWeeks: 4,
    pHRange: "6.2 - 6.8",
    ingredients: ["Root Stimulator", "Active Soil Healer", "Bloom Booster"],
    frequency: "Every 10 Days",
    stages: [
      { week: "Week 1", description: "Inoculate soil with bio-active humic humus", formulation: "Active Soil Healer 1kg/plot" },
      { week: "Week 2", description: "Balanced nutrient drenching for rapid leaves", formulation: "Root Stimulator & Seaweed 200ml" },
      { week: "Week 3", description: "Vegetable protection organic neem layer", formulation: "Neem Pest Shield dilution" },
      { week: "Week 4", description: "Blossom booster phosphorus root food", formulation: "Bloom Booster Micro-nutrients 250g" }
    ],
    isTemplate: true
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: "core-npk",
    name: "Agriic Core NPK Formula",
    category: "nutrition",
    price: 349,
    stock: 140,
    lowStockLimit: 30,
    desc: "Sustained-release nitrogen, phosphorus, and potassium balance for all plants, optimized for Indian soils.",
    img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "bloom-booster",
    name: "Bloom Booster Micro-nutrients",
    category: "nutrition",
    price: 399,
    stock: 12, // Needs Low Stock highlight!
    lowStockLimit: 25,
    desc: "High phosphorus and calcium formula designed to maximize flowering, fruiting, and vibrant bud formation.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "neem-shield",
    name: "Agriic Neem Pest Shield",
    category: "pest-control",
    price: 299,
    stock: 8, // Needs Low Stock highlight!
    lowStockLimit: 15,
    desc: "100% cold-pressed neem oil spray for natural insect control and leaf shine, protecting your crops gently.",
    img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "root-stimulator",
    name: "Root Stimulator (Seaweed Extract)",
    category: "nutrition",
    price: 449,
    stock: 75,
    lowStockLimit: 20,
    desc: "Enhanced root development formula with premium cold water kelp to promote deep, strong nutrient channels.",
    img: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "soil-healer",
    name: "Active Soil Healer",
    category: "soil-health",
    price: 499,
    stock: 110,
    lowStockLimit: 25,
    desc: "Humus and fulvic acid rich powder to restore depleted soil structure, bio-fertility, and moisture tolerance.",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "ph-tester",
    name: "Precision Soil pH Probe",
    category: "tools",
    price: 549,
    stock: 4, // Critical Low
    lowStockLimit: 10,
    desc: "Instant digital display probe to keep track of soil acidity levels and root water metrics in real-time.",
    img: "https://images.unsplash.com/photo-1581574919402-5b7d733224d6?auto=format&fit=crop&w=400&q=80"
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: "AGR-88402",
    farmerId: "FARMER_001",
    farmerName: "Rajesh Kumar",
    items: [
      { productId: "core-npk", name: "Agriic Core NPK Formula", price: 349, qty: 3, img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80" }
    ],
    total: 1047,
    status: "Delivered",
    paymentMethod: "upi",
    address: "Flat 403, Vrindavan Heights, Shivajinagar, Pune, Maharashtra - 411005",
    date: "2026-06-12"
  },
  {
    id: "AGR-91255",
    farmerId: "FARMER_002",
    farmerName: "Alok Patel",
    items: [
      { productId: "bloom-booster", name: "Bloom Booster Micro-nutrients", price: 399, qty: 2, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" }
    ],
    total: 798,
    status: "In-Transit",
    paymentMethod: "card",
    address: "House No. 12, Park Street, Anand, Gujarat - 388001",
    date: "2026-06-15"
  },
  {
    id: "AGR-93810",
    farmerId: "FARMER_003",
    farmerName: "Bhavana Reddy",
    items: [
      { productId: "soil-healer", name: "Active Soil Healer", price: 499, qty: 1, img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80" },
      { productId: "neem-shield", name: "Agriic Neem Pest Shield", price: 299, qty: 1, img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80" }
    ],
    total: 798,
    status: "Processing",
    paymentMethod: "cod",
    address: "Near Old Temple, Guntur Town, AP - 522001",
    date: "2026-06-17"
  }
];

export const SEED_CONSULTATIONS: Consultation[] = [
  {
    id: "CONS_001",
    farmerId: "FARMER_001",
    farmerName: "Rajesh Kumar",
    agronomistId: "AGR_001",
    agronomistName: "Dr. Ramesh Shinde",
    date: "2026-06-18",
    timeSlot: "11:00 AM - 11:30 AM",
    notes: "Review wheat ear-emergence stage nutrition. Farmer is reporting light leaf yellowing on boundary fields.",
    status: "Scheduled",
    npsScore: 0
  },
  {
    id: "CONS_002",
    farmerId: "FARMER_002",
    farmerName: "Alok Patel",
    agronomistId: "AGR_002",
    agronomistName: "Anjali Sharma",
    date: "2026-06-16",
    timeSlot: "03:15 PM - 03:45 PM",
    notes: "Discussed cotton soil pH remediation. Instructed application of high-phosphorus booster alongside biological amendments.",
    status: "Completed",
    npsScore: 10
  },
  {
    id: "CONS_003",
    farmerId: "FARMER_003",
    farmerName: "Bhavana Reddy",
    agronomistId: "AGR_001",
    agronomistName: "Dr. Ramesh Shinde",
    date: "2026-06-17",
    timeSlot: "09:30 AM - 10:00 AM",
    notes: "Verified chilli leaf curl diagnostics. Instructed spray concentrations of Neem pest oil to mitigate thrips vectors.",
    status: "Completed",
    npsScore: 9
  }
];

export const SEED_CONTENT: ContentItem[] = [
  {
    id: "ART_01",
    title: "In-Depth Soil pH and Crop Carbon Retention Science",
    type: "article",
    category: "Agronomy Science",
    contentBody: "Soil pH acts as the ultimate gatekeeper of biological crop health. When soil drifts below 5.5 (excessively acidic), phosphate ions lock-bind with aluminum and iron oxides, rendering external fertilizers useless. Adding active alkaline calcium carbonate (lime) can neutralize the charge and restore nutrient intake efficiency by over 200%. Let's look at the scientific formula...",
    publishedAt: "2026-06-12",
    targetPushSent: true
  },
  {
    id: "VID_01",
    title: "How to Apply Liquid Organic Seaweed via Drip Line",
    type: "video",
    category: "Tutorials",
    contentBody: "A complete visual masterclass demonstrating dosage equations and filtration screen steps to stream seaweed micronutrients safely without clogging high-density micro-drip networks.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // compliant embed mock
    publishedAt: "2026-06-14",
    targetPushSent: false
  },
  {
    id: "ART_02",
    title: "Remediating Yellowing Basmati Rice Leaves Dynamically",
    type: "article",
    category: "Troubleshooting",
    contentBody: "Chlorosis is often misdiagnosed as simple nitrogen hunger. This guide explores secondary symptoms of iron and sulfur lockdowns caused by compacted clay blocks or water stagnation, and provides quick botanical foliar solutions.",
    publishedAt: "2026-06-16",
    targetPushSent: false
  }
];

export const SEED_TICKETS: SupportTicket[] = [
  {
    id: "TIC-5512",
    farmerName: "Rajesh Kumar",
    subject: "Bulk delivery delay for Core NPK mix",
    priority: "High",
    status: "In-Progress",
    slaHours: 24,
    date: "2026-06-15",
    messages: [
      { sender: "farmer", senderName: "Rajesh Kumar", message: "Hello, our Ludhiana farm ordered 10 bags of NPK on Monday. Real-time tracks say it only reached local hub yesterday. We need to apply it tomorrow morning before heavy rains begin. Can we expedite delivery?", timestamp: "2026-06-15T10:10:00Z" },
      { sender: "support", senderName: "Super Admin Support", message: "Hi Rajesh, we have flagged this with our Ludhiana logistics coordinator. We are working to secure a priority delivery truck for tonight.", timestamp: "2026-06-15T11:45:00Z" }
    ],
    internalNotes: [
      { agronomistName: "Anjali Sharma", note: "Ludhiana terminal is short-staffed due to regional transport strikes. Transferred ticket to priority dispatch backup partner.", timestamp: "2026-06-15T11:42:00Z" }
    ]
  },
  {
    id: "TIC-5513",
    farmerName: "Alok Patel",
    subject: "Soil pH probe calibration failure query",
    priority: "Medium",
    status: "Open",
    slaHours: 48,
    date: "2026-06-16",
    messages: [
      { sender: "farmer", senderName: "Alok Patel", message: "My precision soil pH probe is consistently outputting 7.0 even inside acidic tea compost. Is there a resetting dial or calibration liquid I need to buy?", timestamp: "2026-06-16T14:30:00Z" }
    ],
    internalNotes: []
  },
  {
    id: "TIC-5514",
    farmerName: "Sanjay Deshmukh",
    subject: "Fruiting stage dose recommendation",
    priority: "Low",
    status: "Solved",
    slaHours: 72,
    date: "2026-06-14",
    messages: [
      { sender: "farmer", senderName: "Sanjay Deshmukh", message: "At what concentration should I apply Bloom Booster for commercial Nashik grape canopies?", timestamp: "2026-06-14T08:00:00Z" },
      { sender: "support", senderName: "Dr. Ramesh Shinde", message: "Standard dilution is 15 grams per 10 liters of water during late afternoon sprays. Please avoid direct sunlight applications to prevent foliar scorching.", timestamp: "2026-06-14T11:00:00Z" }
    ],
    internalNotes: [
      { agronomistName: "Dr. Ramesh Shinde", note: "Farmer confirmed successful application, grape sweetening metrics are perfect. Solved.", timestamp: "2026-06-14T15:00:00Z" }
    ]
  }
];

export const SEED_ACTIVITIES: DashboardActivity[] = [
  { id: "ACT_001", message: "Farmer Rajesh Kumar uploaded new soil report (REP-9921) for Ludhiana North", type: "report", time: "12 mins ago" },
  { id: "ACT_002", message: "New bulk order AGR-93810 processing for ₹798 by Bhavana Reddy", type: "order", time: "1 hour ago" },
  { id: "ACT_003", message: "Agronomist Anjali Sharma completed Cotton consultation for Alok Patel", type: "consult", time: "2 hours ago" },
  { id: "ACT_004", message: "Deficiency Alert: Soil acidity under pH 5.5 triggers critical threshold at Anand Plot", type: "alert", time: "4 hours ago" },
  { id: "ACT_005", message: "Support ticket TIC-5512 marked HIGH priority by dispatch system", type: "support", time: "5 hours ago" }
];

export const DEFAULT_SETTINGS: WorkspaceSettings = {
  primaryBrandName: "Agriic Science HQ",
  primaryColor: "#3B6D11",
  secondaryColor: "#0F6E56",
  enableSMS: true,
  enablePayments: true,
  enableWeather: true,
  twoFactorEnabled: false
};

// Seeding engine to push to Firestore
export async function seedDatabaseIfEmpty() {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    if (productsSnap.empty) {
      console.log("Firestore collections are empty. Starting automatic Agriic dummy seeding...");
      
      // Batch seed Products
      for (const p of SEED_PRODUCTS) {
        await setDoc(doc(db, "products", p.id), p);
      }
      // Batch seed Farmers / Users
      for (const f of SEED_FARMERS) {
        const udoc = {
          uid: f.id,
          name: f.name,
          email: f.email,
          phone: f.phone,
          role: f.role,
          location: f.location,
          cropFocus: f.cropFocus,
          landSize: f.landSize,
          status: f.status,
          joinedAt: f.joinedAt
        };
        await setDoc(doc(db, "users", f.id), udoc);
      }
      // Batch seed Soil Reports
      for (const sr of SEED_SOIL_REPORTS) {
        await setDoc(doc(db, "soilReports", sr.id), sr);
      }
      // Batch seed Deficiency Rules
      for (const dr of SEED_DEFICIENCY_RULES) {
        await setDoc(doc(db, "deficiencyRules", dr.id), dr);
      }
      // Batch seed Nutrition Plans
      for (const np of SEED_NUTRITION_PLANS) {
        await setDoc(doc(db, "nutritionPlans", np.id), np);
      }
      // Batch seed Orders
      for (const o of SEED_ORDERS) {
        await setDoc(doc(db, "orders", o.id), o);
      }
      // Batch seed Consultations
      for (const c of SEED_CONSULTATIONS) {
        await setDoc(doc(db, "consultations", c.id), c);
      }
      // Batch seed Content CMS
      for (const ct of SEED_CONTENT) {
        await setDoc(doc(db, "content", ct.id), ct);
      }
      // Batch seed Tickets
      for (const t of SEED_TICKETS) {
        await setDoc(doc(db, "supportTickets", t.id), t);
      }
      // Batch seed Activities
      for (const act of SEED_ACTIVITIES) {
        await setDoc(doc(db, "activities", act.id), act);
      }
      // Batch seed Settings
      await setDoc(doc(db, "settings", "global_workspace"), DEFAULT_SETTINGS);

      console.log("Firestore successfully populated with 10 robust, contextual modules seeded.");
    }
  } catch (error) {
    console.error("Failed to seed Firestore collections:", error);
  }
}
