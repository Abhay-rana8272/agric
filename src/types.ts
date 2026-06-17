export type UserRole = 'Super Admin' | 'Agronomist' | 'Farmer';

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  cropFocus: string;
  landSize: string;
  status: 'Active' | 'Suspended';
  notesCount?: number;
  joinedAt: string;
}

export interface SoilReport {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  pH: number;
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  moisture: number; // %
  status: 'Pending' | 'Reviewed';
  actionTaken: string;
  cropType: string;
  uploadDate: string;
}

export interface DeficiencyAlertRule {
  id: string;
  parameter: 'pH' | 'Nitrogen' | 'Phosphorus' | 'Potassium' | 'Moisture';
  operand: 'less_than' | 'greater_than';
  value: number;
  severity: 'Warning' | 'Critical';
  message: string;
  active: boolean;
}

export interface NutritionPlan {
  id: string;
  title: string;
  cropType: string;
  durationWeeks: number;
  pHRange: string;
  ingredients: string[];
  frequency: string;
  stages: {
    week: string;
    description: string;
    formulation: string;
  }[];
  isTemplate: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'nutrition' | 'soil-health' | 'pest-control' | 'tools';
  price: number;
  stock: number;
  lowStockLimit: number;
  desc: string;
  img: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  img: string;
}

export interface Order {
  id: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'In-Transit' | 'Delivered';
  paymentMethod: 'card' | 'upi' | 'cod';
  address: string;
  date: string;
}

export interface Consultation {
  id: string;
  farmerId: string;
  farmerName: string;
  agronomistId: string;
  agronomistName: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: 'Scheduled' | 'Completed';
  npsScore: number; // 0-10 feedback rating
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video';
  category: string;
  contentBody: string;
  videoUrl?: string; // e.g. youtube embed
  publishedAt: string;
  targetPushSent: boolean;
}

export interface TicketMessage {
  id?: string;
  sender: string;
  text?: string;
  isInternal?: boolean;
  senderName?: string;
  message?: string;
  timestamp: string;
}

export interface TicketNote {
  agronomistName: string;
  note: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  farmerName: string;
  subject: string;
  category?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In-Progress' | 'Solved' | 'Resolved';
  slaHours: number;
  date: string;
  messages: TicketMessage[];
  internalNotes: TicketNote[];
}

export interface DashboardActivity {
  id: string;
  message: string;
  type: 'order' | 'user' | 'report' | 'support' | 'alert' | 'content' | 'consult';
  time: string;
}

export interface WorkspaceSettings {
  primaryBrandName: string;
  primaryColor: string;
  secondaryColor: string;
  enableSMS: boolean;
  enablePayments: boolean;
  enableWeather: boolean;
  twoFactorEnabled: boolean;
}
