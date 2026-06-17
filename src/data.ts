export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: 'nutrition' | 'soil-health' | 'pest-control' | 'tools';
  img: string;
}

export interface BlogPost {
  title: string;
  category: string;
  readTime: string;
  date: string;
  img: string;
  excerpt: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'core-npk',
    name: 'Agriic Core NPK Formula',
    desc: 'Sustained-release nitrogen, phosphorus, and potassium balance for all plants, optimized for Indian soils.',
    price: 349,
    category: 'nutrition',
    img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'bloom-booster',
    name: 'Bloom Booster Micro-nutrients',
    desc: 'High phosphorus and calcium formula designed to maximize flowering, fruiting, and vibrant bud formation.',
    price: 399,
    category: 'nutrition',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'neem-shield',
    name: 'Agriic Neem Pest Shield',
    desc: '100% cold-pressed neem oil spray for natural insect control and leaf shine, protecting your crops gently.',
    price: 299,
    category: 'pest-control',
    img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'root-stimulator',
    name: 'Root Stimulator & Seaweed Extract',
    desc: 'Enhanced root development formula with premium cold water kelp to promote deep, strong nutrient channels.',
    price: 449,
    category: 'nutrition',
    img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'soil-healer',
    name: 'Active Soil Healer',
    desc: 'Humus and fulvic acid rich powder to restore depleted soil structure, bio-fertility, and moisture tolerance.',
    price: 499,
    category: 'soil-health',
    img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'compost-tea',
    name: 'Compost Tea Starter Pack',
    desc: 'Premium microbial inoculant bags to boost soil life, organic matter degradation, and root zone health.',
    price: 249,
    category: 'soil-health',
    img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'defense-spray',
    name: 'Agriic Organic Defense Spray',
    desc: 'Dual action bio-fungicide and herbal insect protection spray that strengthens cellular plant walls.',
    price: 279,
    category: 'pest-control',
    img: 'https://images.unsplash.com/photo-1512288094938-363287817259?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'ph-tester',
    name: 'Precision Soil pH & Moisture Meter',
    desc: 'Instant digital display probe to keep track of soil acidity levels and root water metrics in real-time.',
    price: 549,
    category: 'tools',
    img: 'https://images.unsplash.com/photo-1581574919402-5b7d733224d6?auto=format&fit=crop&w=400&q=80'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Understanding Soil pH and Nutrient Availability',
    category: 'Science',
    readTime: '5 min',
    date: 'June 12, 2026',
    img: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=400&q=80',
    excerpt: 'How soil pH acts as a gatekeeper of root health, directly determining which vital minerals and moisture crops can properly absorb.'
  },
  {
    title: 'Organic vs Synthetic Fertilizers: The Ayurvedic View',
    category: 'Heritage',
    readTime: '8 min',
    date: 'May 28, 2026',
    img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80',
    excerpt: 'A deep dive into natural nutrition concepts that stimulate long-term soil carbon and foster lasting crop immunity.'
  },
  {
    title: 'The Secrets to Deep, Healthy Root Development',
    category: 'Education',
    readTime: '6 min',
    date: 'May 15, 2026',
    img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    excerpt: 'Learn how specific combinations of organic humic elements and micro-nutrients protect plants against extreme drought cycles.'
  }
];

export const TESTIMONIALS = [
  {
    img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80',
    quote: 'My yields doubled after using Agriic. Phenomenal growth and premium crop quality!',
    name: 'Sarah, Organic Farmer'
  },
  {
    img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80',
    quote: 'Agriic turned my struggling Monstera into a masterpiece. Healthy green leaves are back.',
    name: 'David, Plant Parent'
  },
  {
    img: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=400&q=80',
    quote: 'Root development is incredible. Stronger stalks, faster blooming, and better water uptake.',
    name: 'John, Farmer'
  },
  {
    img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
    quote: 'High yields achieved on our fields, pest damages are a thing of the past. Truly recommended.',
    name: 'Mark, Commercial Farmer'
  },
  {
    img: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=400&q=80',
    quote: 'We started our nursery using Agriic custom kits. Unbelievable growth and pest resistance!',
    name: 'Sani, Plant Cultivator'
  }
];

export const INGREDIENTS = [
  { img: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=200&q=80', name: 'N:P:K 10-10-10', desc: 'Balanced core nutrients for all-round growth.' },
  { img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=200&q=80', name: 'Organic Humus', desc: 'Improves soil structure and water retention.' },
  { img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', name: 'Seaweed Extract', desc: 'Boosts plant stress tolerance and root development.' },
  { img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80', name: 'Neem Seed Meal', desc: 'Supplies organic nitrogen and fights root pests.' },
  { img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80', name: 'Alfalfa Meal', desc: 'Rich in active triacontanol for vigorous vegetative leaf growth.' },
  { img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80', name: 'Mustard Seed Meal', desc: 'Enhances micro-nutrient status and bio-shielding.' },
  { img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=200&q=80', name: 'Bat Guano', desc: 'Potent source of active phosphorus and minerals.' },
  { img: 'https://images.unsplash.com/photo-1512288094938-363287817259?auto=format&fit=crop&w=200&q=80', name: 'Fulvic Acid', desc: 'Chelates soil nutrients to increase root bio-availability.' },
  { img: 'https://images.unsplash.com/photo-1596766415124-7851d2f09d84?auto=format&fit=crop&w=200&q=80', name: 'Bone Meal', desc: 'Slow-release calcium and vital phosphate reserves.' },
  { img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80', name: 'Grain Protein', desc: 'Amino acids cocktail to support rapid metabolic repair.' }
];

export const GOOGLE_REVIEWS = [
  { text: 'As a mother, I was extremely worried about my home garden yield, things changed after Agriic stepped in!', name: 'Sanjukta Sanyal' },
  { text: 'Before trying Agriic I used a lot of other modern medications but this organic NPK gave the best and safest output.', name: 'Laljeet Barua' },
  { text: 'I have been following Agriic customized routines since last 9 months now and the crop weight and taste both improved.', name: 'Devendra Desai' },
  { text: "It's all about patience and consistency. Agriic helped me restore soil vitality with the customized diet plan.", name: 'Shubham Nilsen' },
  { text: 'Since I have started using Agriic, my soil has really improved a lot. It is looser, and earthy worm life is back.', name: 'Bhavana Singh' },
  { text: 'The product is very good. The leaves showed a noticeable dark green shine in just 15 days of spraying.', name: 'Sonia Nair Studio' }
];

export const EXPECTATIONS_LIST = [
  { img: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=400&q=80', label: 'Lush Greenery', ok: true },
  { img: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80', label: 'Strong Stalk', ok: true },
  { img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80', label: 'Abundant Grains', ok: true },
  { img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80', label: 'Full Harvest', ok: true },
  { img: 'https://images.unsplash.com/photo-1610341592771-74946011232f?auto=format&fit=crop&w=400&q=80', label: 'Robust Fruits', ok: true },
  { img: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=400&q=80', label: 'Severe Deficiency', ok: false },
  { img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80', label: 'Untreatable State', ok: false },
  { img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80', label: 'Balanced Soil Profile', ok: true },
  { img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80', label: 'Strong Roots', ok: true },
  { img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80', label: 'Pest Resistance', ok: true },
  { img: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=400&q=80', label: 'Abundant Blooms', ok: true },
  { img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80', label: 'Vibrant Turf', ok: true },
  { img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80', label: 'Compacted Hard Clay', ok: false },
  { img: 'https://images.unsplash.com/photo-1535090486790-da76d70928a6?auto=format&fit=crop&w=400&q=80', label: 'Untreatable Disease', ok: false }
];

export const QUIZ_QUESTIONS = [
  {
    question: 'What type of crops are you growing?',
    options: ['Vegetables', 'Fruits', 'Grains & Cereals', 'Ornamental / Flowers', 'Herbs & Spices', 'Lawn / Turf']
  },
  {
    question: 'What does your soil look like?',
    options: ['Dark, rich and moist', 'Light brown and dry', 'Reddish clay', 'Sandy and loose', 'Compacted and hard', 'I\'m not sure']
  },
  {
    question: 'What symptoms are you seeing?',
    options: ['Yellowing leaves', 'Stunted growth', 'Poor flowering/fruiting', 'Leaf spots or disease', 'Wilting despite watering', 'No visible issues — I want to optimize']
  },
  {
    question: 'How often do you water your plants?',
    options: ['Daily', 'Every 2-3 days', 'Weekly', 'Depends on rain', 'Drip irrigation system', 'Irregular / Not sure']
  },
  {
    question: 'What is your location / climate zone?',
    options: ['Tropical (Kerala, Goa, Coastal)', 'Subtropical (Maharashtra, Gujarat)', 'Arid (Rajasthan, Parts of AP)', 'Temperate (Himachal, Uttarakhand)', 'Semi-arid (Tamil Nadu, Karnataka)', 'Other / Not sure']
  }
];

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  img: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'In-Transit' | 'Delivered';
  paymentMethod: 'card' | 'upi' | 'cod';
  address: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'AGR-88402',
    date: 'June 02, 2026',
    items: [
      {
        productId: 'core-npk',
        name: 'Agriic Core NPK Formula',
        price: 349,
        qty: 2,
        img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80'
      },
      {
        productId: 'neem-shield',
        name: 'Agriic Neem Pest Shield',
        price: 299,
        qty: 1,
        img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80'
      }
    ],
    total: 997,
    status: 'Delivered',
    paymentMethod: 'upi',
    address: 'Flat 403, Vrindavan Heights, Shivajinagar, Pune, Maharashtra - 411005'
  },
  {
    id: 'AGR-91255',
    date: 'June 10, 2026',
    items: [
      {
        productId: 'bloom-booster',
        name: 'Bloom Booster Micro-nutrients',
        price: 399,
        qty: 1,
        img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
      }
    ],
    total: 399,
    status: 'In-Transit',
    paymentMethod: 'card',
    address: 'House No. 12, Park Street, Anand, Gujarat - 388001'
  },
  {
    id: 'AGR-93810',
    date: 'June 16, 2026',
    items: [
      {
        productId: 'soil-healer',
        name: 'Active Soil Healer',
        price: 499,
        qty: 1,
        img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80'
      }
    ],
    total: 499,
    status: 'Processing',
    paymentMethod: 'cod',
    address: 'Near Old Temple, Vapi East, Gujarat - 396191'
  }
];
