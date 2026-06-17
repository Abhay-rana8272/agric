import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Phone, 
  FileText, 
  ShieldCheck, 
  User, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
  Lock,
  Search,
  BookOpen,
  Calendar,
  Clock,
  HelpCircle,
  Award,
  Globe,
  MapPin,
  Check,
  ChevronDown,
  Package,
  Truck,
  CreditCard,
  Camera,
  Mail
} from 'lucide-react';
import { PRODUCTS, BLOG_POSTS, TESTIMONIALS, INGREDIENTS, GOOGLE_REVIEWS, EXPECTATIONS_LIST, QUIZ_QUESTIONS, Product, MOCK_ORDERS, Order } from './data';

import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "./lib/firebase";
import { seedDatabaseIfEmpty } from "./initialData";
import { HomeModule } from "./components/HomeModule";
import { FarmersModule } from "./components/FarmersModule";
import { SoilModule } from "./components/SoilModule";
import { NutritionModule } from "./components/NutritionModule";
import { ProductsModule } from "./components/ProductsModule";
import { AnalyticsModule } from "./components/AnalyticsModule";
import { ConsultationsModule } from "./components/ConsultationsModule";
import { ContentModule } from "./components/ContentModule";
import { SupportModule } from "./components/SupportModule";
import { SettingsModule } from "./components/SettingsModule";
import { 
  Farmer, 
  SoilReport, 
  DeficiencyAlertRule, 
  NutritionPlan, 
  SupportTicket, 
  DashboardActivity,
  WorkspaceSettings,
  Consultation,
  ContentItem,
  UserRole
} from "./types";

// Custom router helper
const getHashParams = (hashStr: string) => {
  const parts = hashStr.split('?');
  const path = parts[0] || '#home';
  const query = parts[1] || '';
  const params: Record<string, string> = {};
  if (query) {
    query.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value || '');
    });
  }
  return { path, params };
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#home');

  // ==========================================
  // DYNAMIC ADMIN STATE & DATABASE CONTROLS
  // ==========================================
  const [adminActiveTab, setAdminActiveTab] = useState<string>('home');
  const [liveFarmers, setLiveFarmers] = useState<Farmer[]>([]);
  const [liveSoilReports, setLiveSoilReports] = useState<SoilReport[]>([]);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [liveAlertRules, setLiveAlertRules] = useState<DeficiencyAlertRule[]>([]);
  const [liveNutritionPlans, setLiveNutritionPlans] = useState<NutritionPlan[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [liveConsultations, setLiveConsultations] = useState<Consultation[]>([]);
  const [liveContent, setLiveContent] = useState<ContentItem[]>([]);
  const [liveTickets, setLiveTickets] = useState<SupportTicket[]>([]);
  const [liveActivities, setLiveActivities] = useState<DashboardActivity[]>([]);
  const [liveSettings, setLiveSettings] = useState<WorkspaceSettings | null>(null);
  
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: UserRole; uid?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('agriic_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Automated first-run seed trigger
  useEffect(() => {
    seedDatabaseIfEmpty();
  }, []);

  // Sync state machine on Firebase Auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let assignedRole: UserRole = 'Farmer';
        if (user.email === 'abhayrana8272@gmail.com' || user.email?.endsWith('@agriic.com')) {
          assignedRole = 'Super Admin';
        } else {
          assignedRole = 'Agronomist';
        }
        const session = {
          email: user.email || '',
          name: user.displayName || 'Google Specialist',
          role: assignedRole,
          uid: user.uid
        };
        setAdminUser(session);
        localStorage.setItem('agriic_admin_session', JSON.stringify(session));
      }
    });
    return () => unsub();
  }, []);

  // Live Snapshot synchronizers
  useEffect(() => {
    if (!adminUser) return;

    const u1 = onSnapshot(collection(db, "users"), (snapshot) => {
      const fList: Farmer[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        fList.push({
          id: doc.id,
          name: d.name || 'Anonymous Grower',
          email: d.email || '',
          phone: d.phone || '',
          role: d.role || 'Farmer',
          location: d.location || '',
          cropFocus: d.cropFocus || '',
          landSize: d.landSize || '',
          status: d.status || 'Active',
          joinedAt: d.joinedAt || new Date().toISOString()
        });
      });
      setLiveFarmers(fList);
    }, (err) => handleLiveSyncError(err, 'list', 'users'));

    const u2 = onSnapshot(collection(db, "soilReports"), (snapshot) => {
      const sList: SoilReport[] = [];
      snapshot.forEach(doc => {
        sList.push({ id: doc.id, ...doc.data() } as SoilReport);
      });
      setLiveSoilReports(sList);
    }, (err) => handleLiveSyncError(err, 'list', 'soilReports'));

    const u3 = onSnapshot(collection(db, "orders"), (snapshot) => {
      const oList: Order[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        oList.push({ id: doc.id, ...d } as Order);
      });
      setLiveOrders(oList);
    }, (err) => handleLiveSyncError(err, 'list', 'orders'));

    const u4 = onSnapshot(collection(db, "deficiencyRules"), (snapshot) => {
      const rList: DeficiencyAlertRule[] = [];
      snapshot.forEach(doc => {
        rList.push({ id: doc.id, ...doc.data() } as DeficiencyAlertRule);
      });
      setLiveAlertRules(rList);
    }, (err) => handleLiveSyncError(err, 'list', 'deficiencyRules'));

    const u5 = onSnapshot(collection(db, "nutritionPlans"), (snapshot) => {
      const pList: NutritionPlan[] = [];
      snapshot.forEach(doc => {
        pList.push({ id: doc.id, ...doc.data() } as NutritionPlan);
      });
      setLiveNutritionPlans(pList);
    }, (err) => handleLiveSyncError(err, 'list', 'nutritionPlans'));

    const u6 = onSnapshot(collection(db, "products"), (snapshot) => {
      const prList: Product[] = [];
      snapshot.forEach(doc => {
        prList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setLiveProducts(prList);
    }, (err) => handleLiveSyncError(err, 'list', 'products'));

    const u7 = onSnapshot(collection(db, "consultations"), (snapshot) => {
      const cList: Consultation[] = [];
      snapshot.forEach(doc => {
        cList.push({ id: doc.id, ...doc.data() } as Consultation);
      });
      setLiveConsultations(cList);
    }, (err) => handleLiveSyncError(err, 'list', 'consultations'));

    const u8 = onSnapshot(collection(db, "content"), (snapshot) => {
      const cnList: ContentItem[] = [];
      snapshot.forEach(doc => {
        cnList.push({ id: doc.id, ...doc.data() } as ContentItem);
      });
      setLiveContent(cnList);
    }, (err) => handleLiveSyncError(err, 'list', 'content'));

    const u9 = onSnapshot(collection(db, "supportTickets"), (snapshot) => {
      const tList: SupportTicket[] = [];
      snapshot.forEach(doc => {
        tList.push({ id: doc.id, ...doc.data() } as SupportTicket);
      });
      setLiveTickets(tList);
    }, (err) => handleLiveSyncError(err, 'list', 'supportTickets'));

    const u10 = onSnapshot(collection(db, "activities"), (snapshot) => {
      const actList: DashboardActivity[] = [];
      snapshot.forEach(doc => {
        actList.push({ id: doc.id, ...doc.data() } as DashboardActivity);
      });
      setLiveActivities(actList);
    }, (err) => handleLiveSyncError(err, 'list', 'activities'));

    const u11 = onSnapshot(doc(db, "settings", "global_workspace"), (doc) => {
      if (doc.exists()) {
        setLiveSettings(doc.data() as WorkspaceSettings);
      }
    }, (err) => handleLiveSyncError(err, 'get', 'settings/global_workspace'));

    return () => {
      if (typeof u1 === 'function') u1();
      if (typeof u2 === 'function') u2();
      if (typeof u3 === 'function') u3();
      if (typeof u4 === 'function') u4();
      if (typeof u5 === 'function') u5();
      if (typeof u6 === 'function') u6();
      if (typeof u7 === 'function') u7();
      if (typeof u8 === 'function') u8();
      if (typeof u9 === 'function') u9();
      if (typeof u10 === 'function') u10();
      if (typeof u11 === 'function') u11();
    };
  }, [adminUser]);

  // Error handling compliance mapper
  function handleLiveSyncError(error: unknown, opType: string, path: string) {
    const errObj = {
      error: error instanceof Error ? error.message : String(error),
      auth: {
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email
      },
      operationType: opType,
      path: path
    };
    console.error("Firestore sync error: ", JSON.stringify(errObj));
  }

  // Live Actions mapped directly to Firestore writes
  const handleClearActivities = async () => {
    try {
      for (const act of liveActivities) {
        await deleteDoc(doc(db, "activities", act.id));
      }
      showToastMsg("Cleared historical audit logs.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', 'activities');
    }
  };

  const handleUpdateFarmerRole = async (id: string, role: string) => {
    try {
      await updateDoc(doc(db, "users", id), { role });
      showToastMsg(`Role assigned successfully: ${role}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `users/${id}`);
    }
  };

  const handleUpdateFarmerStatus = async (id: string, status: 'Active' | 'Suspended') => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      showToastMsg(`Grower login state switched to: ${status}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `users/${id}`);
    }
  };

  const handleReviewSoilReport = async (id: string, action: string) => {
    try {
      await updateDoc(doc(db, "soilReports", id), {
        status: "Reviewed",
        actionTaken: action
      });
      showToastMsg("Manual diagnosis review committed to database.");
    } catch (e) {
      handleLiveSyncError(e, 'update', `soilReports/${id}`);
    }
  };

  const handleUploadSoilReport = async (report: any) => {
    try {
      const newId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = {
        id: newId,
        ...report,
        status: "Pending",
        actionTaken: "",
        uploadDate: new Date().toISOString().split('T')[0]
      };
      await setDoc(doc(db, "soilReports", newId), payload);
      showToastMsg(`Successfully registered Soil Analysis report ${newId}`);
    } catch (e) {
      handleLiveSyncError(e, 'create', 'soilReports');
    }
  };

  const handleAddAlertRule = async (rule: any) => {
    try {
      const newId = `RULE-${Date.now()}`;
      await setDoc(doc(db, "deficiencyRules", newId), { id: newId, ...rule });
      showToastMsg("Biochemical deficiency warning rule saved.");
    } catch (e) {
      handleLiveSyncError(e, 'create', 'deficiencyRules');
    }
  };

  const handleToggleAlertRule = async (id: string, active: boolean) => {
    try {
      await updateDoc(doc(db, "deficiencyRules", id), { active });
    } catch (e) {
      handleLiveSyncError(e, 'update', `deficiencyRules/${id}`);
    }
  };

  const handleDeleteAlertRule = async (id: string) => {
    try {
      await deleteDoc(doc(db, "deficiencyRules", id));
      showToastMsg("Custom threshold warning rule removed.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `deficiencyRules/${id}`);
    }
  };

  const handleAddPlan = async (plan: any) => {
    try {
      const newId = `PLAN-${Date.now()}`;
      await setDoc(doc(db, "nutritionPlans", newId), { id: newId, ...plan });
      showToastMsg("Botanical formulation template successfully logged.");
    } catch (e) {
      handleLiveSyncError(e, 'create', 'nutritionPlans');
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deleteDoc(doc(db, "nutritionPlans", id));
      showToastMsg("Formulation plan template deleted.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `nutritionPlans/${id}`);
    }
  };

  const handleAddProductAdmin = async (prod: any) => {
    try {
      const newId = `prod_new_${Date.now()}`;
      await setDoc(doc(db, "products", newId), { id: newId, ...prod });
      showToastMsg(`New catalog product "${prod.name}" successfully registered.`);
    } catch (e) {
      handleLiveSyncError(e, 'create', 'products');
    }
  };

  const handleEditProductStock = async (id: string, newStock: number) => {
    try {
      await updateDoc(doc(db, "products", id), { stock: Number(newStock) });
    } catch (e) {
      handleLiveSyncError(e, 'update', `products/${id}`);
    }
  };

  const handleDeleteProductAdmin = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      showToastMsg("Catalog product removed from inventory registry.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `products/${id}`);
    }
  };

  const handleUpdateOrderStatusAdmin = async (id: string, nextStatus: any) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: nextStatus });
      showToastMsg(`Advanced order process to: ${nextStatus}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `orders/${id}`);
    }
  };

  const handleAddConsultation = async (consult: any) => {
    try {
      const newId = `CON-${Math.floor(1000 + Math.random() * 9000)}`;
      await setDoc(doc(db, "consultations", newId), { id: newId, ...consult });
      showToastMsg("Fitted advisor slot successfully booked.");
    } catch (e) {
      handleLiveSyncError(e, 'create', 'consultations');
    }
  };

  const handleCompleteConsultation = async (id: string, notes: string) => {
    try {
      await updateDoc(doc(db, "consultations", id), {
        notes,
        status: "Completed"
      });
      showToastMsg("Session marked Completed; advisory records committed.");
    } catch (e) {
      handleLiveSyncError(e, 'update', `consultations/${id}`);
    }
  };

  const handlePublishArticle = async (article: any) => {
    try {
      const newId = `ART-${Date.now()}`;
      const payload = {
        id: newId,
        ...article,
        publishedAt: new Date().toISOString(),
        targetPushSent: false
      };
      await setDoc(doc(db, "content", newId), payload);
      showToastMsg(`Broadcasted article: ${article.title}`);
    } catch (e) {
      handleLiveSyncError(e, 'create', 'content');
    }
  };

  const handleTriggerSMSPush = async (id: string) => {
    try {
      await updateDoc(doc(db, "content", id), { targetPushSent: true });
      showToastMsg("Push notification payload transmitted via cellular gateway.");
    } catch (e) {
      handleLiveSyncError(e, 'update', `content/${id}`);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(db, "content", id));
      showToastMsg("Scientific report deleted.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `content/${id}`);
    }
  };

  const handleAddTicketMessage = async (ticketId: string, text: string, isInternal: boolean) => {
    try {
      const tRef = doc(db, "supportTickets", ticketId);
      const tSnap = await getDoc(tRef);
      if (tSnap.exists()) {
        const ticketData = tSnap.data() as SupportTicket;
        const msg = {
          id: "msg-" + Date.now(),
          sender: isInternal ? "STAFF NOTE" : "Agronomist Operator",
          text: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isInternal: isInternal
        };
        const updatedMsgs = [...ticketData.messages, msg];
        await updateDoc(tRef, { messages: updatedMsgs });
        showToastMsg("Grower helpdesk chat dispatched.");
      }
    } catch (e) {
      handleLiveSyncError(e, 'update', `supportTickets/${ticketId}`);
    }
  };

  const handleUpdateTicketStatus = async (id: string, status: any) => {
    try {
      await updateDoc(doc(db, "supportTickets", id), { status });
      showToastMsg(`Helpdesk ticket marked: ${status}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `supportTickets/${id}`);
    }
  };

  const handleSaveSettings = async (setts: any) => {
    try {
      await setDoc(doc(db, "settings", "global_workspace"), setts);
      showToastMsg("Saved application gateways and notification configs.");
    } catch (e) {
      handleLiveSyncError(e, 'write', 'settings/global_workspace');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        let assignedRole: UserRole = 'Farmer';
        if (user.email === 'abhayrana8272@gmail.com' || user.email?.endsWith('@agriic.com')) {
          assignedRole = 'Super Admin';
        } else {
          assignedRole = 'Agronomist';
        }
        
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        let finalAdm;
        if (!userSnap.exists()) {
          const freshUser = {
            id: user.uid,
            name: user.displayName || "Google Specialist",
            email: user.email || "",
            phone: user.phoneNumber || "+91 90000 00000",
            role: assignedRole,
            location: "India",
            cropFocus: "Advisor Control",
            landSize: "Staff",
            status: "Active",
            joinedAt: new Date().toISOString()
          };
          await setDoc(userRef, freshUser);
          finalAdm = freshUser;
        } else {
          finalAdm = { id: user.uid, ...userSnap.data() };
        }
        
        const session = {
          email: finalAdm.email || '',
          name: finalAdm.name || '',
          role: finalAdm.role as UserRole,
          uid: finalAdm.id
        };
        setAdminUser(session);
        localStorage.setItem('agriic_admin_session', JSON.stringify(session));
        showToastMsg(`Logged in successfully! Role: ${session.role}`);
      }
    } catch (error) {
      console.error("Google authentication failed:", error);
      showToastMsg("Google authentication pop-up was closed or failed.");
    }
  };

  const handleDemoAdminLogin = (role: UserRole) => {
    const demoSession = {
      email: role === 'Super Admin' ? 'abhayrana8272@gmail.com' : 'ramesh.shinde@agriic.com',
      name: role === 'Super Admin' ? 'Abhay Rana' : 'Dr. Ramesh Shinde',
      role: role,
      uid: role === 'Super Admin' ? 'AGR_DEMO_SUPER' : 'AGR_DEMO_STAFF'
    };
    setAdminUser(demoSession);
    localStorage.setItem('agriic_admin_session', JSON.stringify(demoSession));
    showToastMsg(`Sandbox Mode: Logged in as ${role}!`);
  };

  const handleAdminSignOut = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
      localStorage.removeItem('agriic_admin_session');
      showToastMsg("Admin console session terminated safely.");
    } catch {
      setAdminUser(null);
      localStorage.removeItem('agriic_admin_session');
    }
  };
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>(() => {
    try {
      const saved = localStorage.getItem('agriic_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('agriic_orders');
      return saved ? JSON.parse(saved) : MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('agriic_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const toastTimeoutRef = React.useRef<any>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Timeline Tab State
  const [timelineTab, setTimelineTab] = useState<'vegetable' | 'ornamental'>('vegetable');

  // Auth Mode
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string; phone?: string; location?: string; cropType?: string; landSize?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('agriic_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLocation, setAuthLocation] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCropType, setEditCropType] = useState('Vegetables & Herbs');
  const [editLandSize, setEditLandSize] = useState('Backyard (5-10 Pots)');

  // Profile Image State
  const [profileImage, setProfileImage] = useState<string>(() => {
    try {
      return localStorage.getItem('agriic_profile_image') || '';
    } catch {
      return '';
    }
  });

  // Invoice Modal State
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [invoiceEmailType, setInvoiceEmailType] = useState<'visual' | 'code'>('visual');
  const [invoiceSending, setInvoiceSending] = useState(false);

  // Checkout Form State
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutFullname, setCheckoutFullname] = useState('');
  const [checkoutStreet, setCheckoutStreet] = useState('');
  const [checkoutPincode, setCheckoutPincode] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [checkoutState, setCheckoutState] = useState('');

  // Ref for picking file
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
      setEditLocation(currentUser.location || '');
      setEditCropType(currentUser.cropType || 'Vegetables & Herbs');
      setEditLandSize(currentUser.landSize || 'Backyard (5-10 Pots)');
    } else {
      setEditName('Alok Patel');
      setEditEmail('alok.patel@agrimail.in');
      setEditPhone('9845012345');
      setEditLocation('Maharashtra');
      setEditCropType('Vegetables & Herbs');
      setEditLandSize('Backyard (5-10 Pots)');
    }
  }, [currentUser]);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Shop Filter
  const [productFilter, setProductFilter] = useState<string>('all');

  // Blog News Letter
  const [newsEmail, setNewsEmail] = useState('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });

  // Accordion Details Active Key
  const [openAccordion, setOpenAccordion] = useState<string | null>('benefits');

  // Checkout Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  // Counter simulation on landing page
  const [farmersCount, setFarmersCount] = useState(0);
  const [resultsPct, setResultsPct] = useState(0);
  const [ratingVal, setRatingVal] = useState(0);

  // Parse hash and params
  const { path: routePath, params: routeParams } = getHashParams(hash);

  // Sync profile details to checkout when entering checkout page
  useEffect(() => {
    if (routePath === '#checkout') {
      setCheckoutEmail(currentUser?.email || editEmail || '');
      setCheckoutPhone(currentUser?.phone || editPhone || '');
      setCheckoutFullname(currentUser?.name || editName || '');
      setCheckoutState(currentUser?.location || editLocation || '');
    }
  }, [routePath, currentUser, editEmail, editPhone, editName, editLocation]);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#home');
      window.scrollTo(0, 0);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('agriic_cart', JSON.stringify(cart));
  }, [cart]);

  // Stat Counter Animation
  useEffect(() => {
    if (routePath === '#home') {
      const timer = setTimeout(() => {
        setFarmersCount(5); // Simulate 5L+
        setResultsPct(98);  // 98%
        setRatingVal(4.7);  // 4.7
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [routePath]);

  const showToastMsg = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
    setTimeout(() => {
      setToast(msg);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 3000);
    }, 40);
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].qty += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { product, qty: quantity }]);
    }
    showToastMsg(`${quantity}x ${product.name} added to cart!`);
  };

  const updateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
      showToastMsg(`Item removed from cart.`);
    } else {
      setCart(cart.map(item => item.product.id === productId ? { ...item, qty: newQty } : item));
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('agriic_cart');
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  // Authentication Helpers
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      const emailVal = authEmail.trim() || 'farmer_user@agriic.com';
      const nameVal = currentUser?.name || (emailVal.split('@')[0].toUpperCase()[0] + emailVal.split('@')[0].slice(1) || 'Alok Patel');
      const mockUser = { 
        email: emailVal, 
        name: nameVal,
        phone: currentUser?.phone || '9845012345',
        location: currentUser?.location || 'Maharashtra',
        cropType: currentUser?.cropType || 'Vegetables & Herbs',
        landSize: currentUser?.landSize || 'Backyard (5-10 Pots)'
      };
      localStorage.setItem('agriic_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      showToastMsg('Welcome back to Agriic.!');
    } else {
      const nameVal = authName.trim() || 'Alok Patel';
      const emailVal = authEmail.trim() || 'farmer_user@agriic.com';
      const locVal = authLocation.trim() || 'Maharashtra';
      const phoneVal = authPhone.trim() || '9845012345';
      const mockUser = { 
        email: emailVal, 
        name: nameVal, 
        phone: phoneVal,
        location: locVal,
        cropType: 'Vegetables & Herbs',
        landSize: 'Backyard (5-10 Pots)'
      };
      localStorage.setItem('agriic_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      showToastMsg('Account created successfully!');
    }
    window.location.hash = '#profile';
  };

  const handleLogout = () => {
    localStorage.removeItem('agriic_user');
    setCurrentUser(null);
    showToastMsg('Logged out successfully.');
    window.location.hash = '#home';
  };

  const saveUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      email: editEmail.trim() || currentUser?.email || 'alok.patel@agrimail.in',
      name: editName.trim() || currentUser?.name || 'Alok Patel',
      phone: editPhone.trim() || currentUser?.phone || '9845012345',
      location: editLocation.trim() || currentUser?.location || 'Maharashtra',
      cropType: editCropType,
      landSize: editLandSize
    };
    
    // Save to state and local storage
    localStorage.setItem('agriic_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    showToastMsg('Grower Profile updated and synchronized successfully!');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToastMsg('Image is too large! Please choose an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('agriic_profile_image', base64String);
        showToastMsg('Profile avatar image loaded and saved inside grower cache!');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmailTemplate = (order: Order): string => {
    const itemRows = order.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7;">
          <div style="display: flex; align-items: center;">
            <img src="${item.img || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80'}" style="width: 40px; height: 40px; border-radius: 8px; margin-right: 12px; object-fit: cover;" />
            <div>
              <div style="font-weight: bold; color: #1b3322; font-size: 14px;">${item.name}</div>
              <div style="color: #666; font-size: 11px;">ID: ${item.productId}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7; text-align: center; color: #1b3322; font-weight: bold;">
          ${item.qty}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7; text-align: right; color: #1b3322; font-family: monospace;">
          ₹${item.price}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7; text-align: right; color: #1b3322; font-weight: bold; font-family: monospace;">
          ₹${item.price * item.qty}
        </td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Agriic Order Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #fcfbf7; margin: 0; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e1d7; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <div style="background-color: #1b3322; padding: 24px; text-align: center; border-bottom: 4px solid #c2dd74;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">Agriic<span style="color: #c2dd74;">.</span></h1>
      <p style="color: #c2dd74; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 5px 0 0 0; font-weight: bold;">Order Purchase Receipt</p>
    </div>
    <div style="padding: 24px;">
      <h2 style="color: #1b3322; margin-top: 0; font-size: 18px;">Grower Dispatch Invoice</h2>
      <p style="color: #555; font-size: 13px; line-height: 1.5;">
        Dear Grower, your organic order formulation has been processed. Here is the verified dynamic digital tax invoice showing active botanical dispatches.
      </p>
      <div style="background-color: #f7f6ee; border-radius: 8px; padding: 12px; margin: 20px 0; border-left: 4px solid #1b3322; font-size: 12px;">
        <table style="width: 100%;">
          <tr><td style="color: #666; padding: 2px 0;"><strong>Invoice ID:</strong></td><td style="color: #1b3322; text-align: right; font-weight: bold;">${order.id}</td></tr>
          <tr><td style="color: #666; padding: 2px 0;"><strong>Issue Date:</strong></td><td style="color: #1b3322; text-align: right;">${order.date}</td></tr>
          <tr><td style="color: #666; padding: 2px 0;"><strong>Shipping Destination:</strong></td><td style="color: #1b3322; text-align: right;">${order.address}</td></tr>
          <tr><td style="color: #666; padding: 2px 0;"><strong>Billing Method:</strong></td><td style="color: #1b3322; text-align: right; text-transform: uppercase;">${order.paymentMethod}</td></tr>
        </table>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px;">
        <thead>
          <tr style="background-color: #1b3322; color: #ffffff; text-align: left;">
            <th style="padding: 8px;">Active Formulation</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Rate</th>
            <th style="padding: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px 8px 2px 8px; text-align: right; color: #666;">Shipping charges:</td>
            <td style="padding: 10px 8px 2px 8px; text-align: right; color: #1b3322; font-weight: bold; font-family: monospace;">
              ${order.total >= 499 ? '₹0 (Gratis)' : '₹49'}
            </td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 2px 8px 10px 8px; text-align: right; color: #1b3322; font-size: 14px; font-weight: bold; border-top: 1px solid #1b3322;">Grand Total:</td>
            <td style="padding: 2px 8px 10px 8px; text-align: right; color: #1b3322; font-size: 15px; font-weight: bold; font-family: monospace; border-top: 1px solid #1b3322;">
              ₹${order.total}
            </td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top: 25px; text-align: center; border-top: 1px dashed #e2e1d7; padding-top: 15px;">
        <p style="color: #1b3322; font-size: 11px; font-weight: bold; margin: 0;">90-DAY ROOT & SOIL BIOME HEALTH GUARANTEE</p>
        <p style="color: #666; font-size: 10px; margin: 4px 0 0 0; line-height: 1.4;">
          Your formulation has been packed and sealed under temperature control. Thank you for cultivating with Agriic.
        </p>
      </div>
    </div>
    <div style="background-color: #f7f6ee; padding: 15px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #e2e1d7;">
      <p style="margin: 0;">© 2026 Agriic Solutions Private Limited.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  // Navigation Links array
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Science', href: '#science' },
    { label: 'Products', href: '#products' },
    { label: 'Soil Test™', href: '#soil-test' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
    { label: 'Admin Console', href: '#admin' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-display bg-white text-agri-charcoal relative">
      
      {/* Toast Notification */}
      {toast && (
        <>
          <style>{`
            @keyframes toastSlideDown {
              0% { transform: translate(-50%, -24px); opacity: 0; }
              100% { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes toastShrink {
              0% { width: 100%; }
              100% { width: 0%; }
            }
            .animate-toast-slide-in {
              animation: toastSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-toast-progress {
              animation: toastShrink 3000ms linear forwards;
            }
          `}</style>
          <div className="fixed top-24 left-1/2 z-50 bg-[#2b3a30] text-white px-5 py-3.5 rounded-xl border border-[#c2dd74]/35 shadow-2.5xl flex flex-col overflow-hidden animate-toast-slide-in backdrop-blur-md min-w-[280px] sm:min-w-[345px]">
            <div className="flex items-center space-x-3 mb-2.5">
              <CheckCircle className="w-4.5 h-4.5 text-[#c2dd74] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">{toast}</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-[#c2dd74] h-full animate-toast-progress" />
            </div>
          </div>
        </>
      )}

      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-[#2b3a30] border-b border-[#bad15a]/10 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between text-white shadow-md">
        <a href="#home" className="flex items-center space-x-2 shrink-0">
          <Leaf className="w-8 h-8 text-agri-lime fill-agri-lime" />
          <span className="text-2xl font-bold tracking-tight font-display text-white">
            Agriic<span className="text-agri-lime">.</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = routePath === link.href;
            return (
              <a 
                key={link.label}
                href={link.href}
                className={`text-[14px] font-medium tracking-wide transition-colors duration-200 hover:text-agri-lime ${
                  isActive ? 'text-agri-lime font-bold border-b-2 border-agri-lime pb-1' : 'text-white/80'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right header icons */}
        <div className="flex items-center space-x-4">
          <a href="#cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-agri-lime text-agri-deep text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#2b3a30]">
                {getCartCount()}
              </span>
            )}
          </a>

          {currentUser ? (
            <div className="flex items-center space-x-2">
              <a 
                href="#profile" 
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  routePath === '#profile' 
                    ? 'bg-[#c2dd74]/20 border-[#c2dd74] text-[#c2dd74]' 
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white/95'
                }`}
              >
                <User className="w-4.5 h-4.5 text-[#c2dd74]" />
                <span className="text-[12px] font-medium hidden sm:inline">{currentUser.name || 'Alok'}</span>
              </a>
              <button 
                onClick={handleLogout} 
                className="text-[11.5px] text-white/60 hover:text-red-400 font-bold px-2 py-1.5 rounded-md hover:bg-white/5 transition-all"
              >
                Exit
              </button>
            </div>
          ) : (
            <a href="#auth" className="flex items-center space-x-1.5 hover:text-agri-lime text-sm font-semibold transition px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </a>
          )}

          {/* Mobile drawer toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-agri-lime transition"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-50 bg-[#2b3a30] text-white p-6 flex flex-col space-y-5 animate-fade-in lg:hidden">
          {navLinks.map((link) => {
            const isActive = routePath === link.href;
            return (
              <a 
                key={link.label} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-semibold border-b border-white/10 pb-2 flex justify-between items-center ${isActive ? 'text-agri-lime' : 'text-white'}`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </a>
            );
          })}
          <div className="pt-6 space-y-3">
            {currentUser && (
              <a 
                href="#profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center block bg-white/10 hover:bg-white/15 text-white font-extrabold tracking-wider py-4 rounded-xl border border-white/15"
              >
                VIEW MY PROFILE & ORDERS
              </a>
            )}
            <a 
              href="#soil-test"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center block bg-agri-lime text-[#1b3322] font-extrabold tracking-wider py-4 rounded-xl shadow-lg"
            >
              TAKE THE SOIL TEST™
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="page-content" className="flex-grow animate-fade-in">
        
        {/* VIEW 1: HOME */}
        {routePath === '#home' && (
          <div>
            {/* Section 1: Hero */}
            <section className="relative px-4 md:px-8 lg:px-12 pt-3 md:pt-8 pb-8 md:pb-16 bg-[#f7f6ee] z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[55%] md:h-[65%] bg-[#2b3a30] z-0 rounded-b-[32px] md:rounded-b-[40px]"></div>
              
              <div className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden relative flex flex-col min-h-[420px] md:min-h-[600px] shadow-2xl bg-[#1b251f] z-10 mx-auto max-w-[1440px]">
                {/* SVG Decor for desktop: slanted solid brown on the left side ONLY, leaving right image 100% bright and clear */}
                <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
                  <svg viewBox="0 0 1440 640" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,0 L650,0 C 580,200 500,440 450,640 L0,640 Z" fill="#4e2b15" opacity="1"></path>
                  </svg>
                </div>
                
                {/* Image panel: positioned right-side, bright, clear, no overlay shade covering it on desktop */}
                <div className="absolute top-0 right-0 w-full md:w-[65%] h-full z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80" 
                    alt="Indian farming field with farmer family portrait theme" 
                    className="w-full h-full object-cover md:object-[center_top] object-[center_35%]"
                  />
                  {/* Gentle gradient for text visibility on mobile ONLY, completely transparent/hidden on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent md:hidden pointer-events-none"></div>
                </div>

                {/* Left side text */}
                <div className="relative z-20 w-full p-5 sm:p-10 md:p-16 flex flex-col justify-end md:justify-center h-full min-h-[420px] md:min-h-[600px]">
                  <div className="max-w-[530px] text-center md:text-left flex flex-col items-center md:items-start">
                    <span className="border border-[#c2dd74]/60 bg-[#c2dd74]/15 md:bg-[#c2dd74] text-[#c2dd74] md:text-[#1b3322] px-3.5 py-1.5 rounded-full text-[10px] md:text-[12px] font-bold tracking-widest uppercase mb-3 inline-block shadow-sm">
                      SCIENCE-LED PLANT NUTRITION SOLUTION
                    </span>
                    <h1 className="text-[28px] leading-[1.12] sm:text-4xl md:text-5xl lg:text-[54px] font-black text-white mb-4 md:mb-6 tracking-tight drop-shadow-md">
                      Know the root cause of your soil problems.
                    </h1>
                    <p className="text-white/85 text-xs md:text-base max-w-md mb-6 md:mb-8 leading-relaxed">
                      Unlock your soil's hidden potential for maximum crop yield. Take our diagnostic test and get customized organic kits. 
                    </p>
                    <a 
                      href="#soil-test" 
                      className="bg-agri-lime text-[#1b3322] font-black text-xs md:text-sm px-6 md:px-8 py-3.5 md:py-4.5 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-transform block md:inline-block w-full md:w-auto text-center tracking-wider uppercase"
                    >
                      TAKE THE SOIL TEST™
                    </a>
                  </div>
                </div>
              </div>

              {/* Stats Bar: Compact, clean row on mobile that fits perfectly inside screen width */}
              <div className="relative z-20 max-w-[1440px] mx-auto mt-6 md:mt-12 w-full">
                <div className="flex flex-row justify-between gap-2.5 w-full">
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-agri-red-accent flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {farmersCount || 0}L+
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Indian Farmers</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-agri-gold flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {resultsPct || 0}%
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Saw Yield Boost</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-[#369654] flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {ratingVal ? ratingVal.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Google Rating</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2 text-[9px] md:text-xs text-gray-400 italic">
                  *Based on long-term trial observations across Indian soil profiles, March 2026.
                </div>
              </div>
            </section>

            {/* Section 2: Testimonials Slider */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-white rounded-b-[32px] md:rounded-b-[40px] relative z-20 shadow-sm border-b border-gray-100">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-10">
                  <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">FARMER TESTIMONIALS</span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-gray-950">Real people, real soil recovery</h2>
                </div>

                <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-6 slider-container snap-x snap-mandatory">
                  {TESTIMONIALS.map((t, index) => (
                    <div key={index} className="min-w-[280px] max-w-[280px] rounded-[24px] overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between bg-white transform hover:scale-102 transition-transform snap-start">
                      <img src={t.img} className="h-44 w-full object-cover" alt="Farmer" />
                      <div className="p-5 bg-gradient-to-br from-agri-dark to-[#1b251f] text-white">
                        <div className="flex text-agri-lime mb-2">
                           {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star key={starIdx} className="w-3.5 h-3.5 fill-agri-lime" />
                          ))}
                        </div>
                        <p className="italic text-xs text-slate-100 leading-relaxed">"{t.quote}"</p>
                        <span className="block mt-3 text-xs font-bold text-agri-lime/95">— {t.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Soil Health Pillars: Custom slideable cards on mobile, grid on desktop */}
                <div className="mt-8 md:mt-16 pt-8 md:pt-12 border-t border-agri-cream-border">
                  <span className="text-xs font-extrabold text-agri-green-mid uppercase tracking-widest block mb-2">ROOT CAUSES</span>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-950">Crop health starts from the soil</h2>
                    <p className="text-gray-500 mt-2 md:mt-0 text-xs md:text-sm max-w-md">Our specialized organic nutrition formula targets the five foundational columns of healthy plant ecosystems.</p>
                  </div>

                  <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 lg:grid-cols-5 pb-4">
                    {[
                      { title: 'Full Nutrition', desc: 'Providing the complete spectrum of macro and micro-nutrients for optimum plant cellular growth.' },
                      { title: 'Healthy Soil Biology', desc: 'Restoring native organic microbial activity to help dissolve bound soil phosphate.' },
                      { title: 'Deep Roots', desc: 'Stimulating primary and secondary capillary roots for maximum structural strength and nutrient uptake.' },
                      { title: 'Vigor & Defense', desc: 'Strengthening internal defense pathways to prevent pest infection and climate stress.' },
                      { title: 'Max Genetic Yield', desc: 'Activating specific floral and vegetative growth switches to optimize fruit mass and flavor.' }
                    ].map((p, i) => (
                      <div key={i} className="bg-agri-cream rounded-2xl p-3.5 text-center border border-agri-cream-border flex flex-col items-center min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                        <div className="w-10 h-10 bg-agri-dark text-agri-lime rounded-full flex items-center justify-center font-bold mb-3 text-sm shrink-0">
                          0{i+1}
                        </div>
                        <h3 className="font-extrabold text-[11px] text-gray-900 mb-1 leading-tight line-clamp-1">{p.title}</h3>
                        <p className="text-[9px] text-gray-500 leading-normal line-clamp-5">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Research Backed banner info */}
            <section className="w-full bg-gradient-to-r from-agri-deep to-agri-green-mid py-20 px-6 md:px-12 text-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
                <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
                  <span className="text-xs font-black text-agri-lime uppercase tracking-widest block mb-3">RESEARCH BACKED SYSTEM</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tight">
                    93% saw greener,<br />healthier crop growth*
                  </h2>
                  <div className="space-y-4">
                    {[
                      '300 Controlled Farms under validation',
                      'Crops tested across 12 distinct Indian micro-climates',
                      'Active monitoring over 5+ seasonal planting cycles'
                    ].map((check, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-sm">
                        <Check className="w-5 h-5 text-agri-lime shrink-0" />
                        <span className="text-white/90">{check}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <a href="#science" className="text-agri-lime font-bold inline-flex items-center space-x-2 group hover:underline text-sm">
                      <span>Explore Scientific Data</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative p-2 bg-white/5 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80" 
                      alt="Greener crop leaf output" 
                      className="rounded-2xl w-full object-cover h-64"
                    />
                    <div className="absolute -bottom-4 right-4 bg-white text-agri-dark px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center space-x-2 border border-orange-150">
                      <Star className="w-4 h-4 fill-agri-gold text-agri-gold shrink-0" />
                      <span>Sustained leaf chlorophyll boost</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Holistic Approach & Expectations */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-agri-cream border-t border-b border-agri-cream-border">
              <div className="max-w-7xl mx-auto">
                <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">HOLISTIC METHOD</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6">What comes inside the Agriic program?</h2>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 mb-10 pb-4">
                  {[
                    { title: 'Customized Nutrient Mix', desc: 'A custom dry blend organic fertilizer tailored to your specific diagnostic results.', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80' },
                    { title: 'Feeding & Watering Guide', desc: 'A step-by-step custom calendar drafted by botanists for your crop stage.', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=300&q=80' },
                    { title: 'Dedicated Crop Coach', desc: 'Direct chat line to our botany experts for monthly updates and emergency support.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-3.5 md:p-5 rounded-2xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-3 md:space-y-0 md:space-x-4 shadow-sm border border-gray-150 min-w-[150px] max-w-[150px] md:min-w-0 md:max-w-none flex-shrink-0 snap-start">
                      <img src={item.img} className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl shrink-0" alt="Detail img" />
                      <div>
                        <h3 className="font-extrabold text-[11px] md:text-sm text-gray-900 mb-1 leading-tight line-clamp-1 md:line-clamp-none">{item.title}</h3>
                        <p className="text-[9px] md:text-xs text-gray-500 font-normal leading-relaxed line-clamp-3 md:line-clamp-none">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Brand Honesty/Expectations matrix */}
                <div>
                  <span className="text-[12px] font-black text-agri-green-mid uppercase tracking-widest block mb-1">HONEST EXPECTATIONS</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No miracles. Only transparent science.</h2>
                  <p className="text-xs md:text-sm text-gray-600 mb-6 max-w-xl">
                    We only recommend plans for crops we know we can help. See exactly which situations are responsive to organic nutrients and which are beyond chemical rescue.
                  </p>

                  <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-5 pb-4">
                    {EXPECTATIONS_LIST.slice(0, 10).map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded-2xl border border-gray-150 text-center relative flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                        <div className="relative rounded-xl overflow-hidden aspect-square mb-2">
                          <img src={item.img} className="w-full h-full object-cover" alt={item.label} />
                          <span className={`absolute top-2 right-2 flex items-center justify-center text-white w-5 h-5 rounded-full text-[10px] font-extrabold border border-white ${item.ok ? 'bg-[#369654]' : 'bg-red-500'}`}>
                            {item.ok ? '✓' : '✕'}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-850 leading-tight block">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Timeline Tabs */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-white">
              <div className="max-w-5xl mx-auto">
                <div className="flex space-x-2.5 mb-5" id="timeline-tabs">
                  <button 
                    onClick={() => setTimelineTab('vegetable')}
                    className={`px-4 py-2 rounded-xl text-[11px] md:text-xs font-extrabold tracking-wide transition ${
                      timelineTab === 'vegetable' ? 'bg-[#2b3a30] text-[#c2dd74] shadow-md' : 'bg-agri-cream text-gray-600'
                    }`}
                  >
                    VEGETABLE TIMELINE
                  </button>
                  <button 
                    onClick={() => setTimelineTab('ornamental')}
                    className={`px-4 py-2 rounded-xl text-[11px] md:text-xs font-extrabold tracking-wide transition ${
                      timelineTab === 'ornamental' ? 'bg-[#2b3a30] text-[#c2dd74] shadow-md' : 'bg-agri-cream text-gray-600'
                    }`}
                  >
                    ORNAMENTAL TIMELINE
                  </button>
                </div>

                <h2 className="text-2xl font-extrabold mb-6 text-gray-900 tracking-tight">
                  When will your crops show change?
                </h2>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 lg:grid-cols-6 pb-4">
                  {timelineTab === 'vegetable' ? (
                    <>
                      {[
                        { num: 'Month 1', label: 'Nutrient Intake', txt: 'Capillary roots begin absorbing direct seaweed proteins.' },
                        { num: 'Month 2', label: 'Root Branching', txt: 'Roots lock deep into soil, doubling nutrient coverage.' },
                        { num: 'Month 3', label: 'Stem Vigor', txt: 'Cellular walls harden, boosting stalk thickness and leaf surface.' },
                        { num: 'Month 4', label: 'Floral Boost', txt: 'Early bud division shows stronger and wider color structure.' },
                        { num: 'Month 5', label: 'Fruit Formation', txt: 'Consistent water and calcium delivery avoids leaf spot defaults.' },
                        { num: 'Month 6', label: 'Maximum Yield', txt: 'Harvest density peaks, retaining native botanical sugars.' }
                      ].map((step, i) => (
                        <div key={i} className="bg-agri-cream p-3 px-3.5 rounded-xl relative border border-agri-cream-border flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                          <span className="text-[10px] font-black text-agri-green-mid block mb-1">{step.num}</span>
                          <h4 className="font-extrabold text-[11px] text-gray-900 mb-1 leading-tight line-clamp-1">{step.label}</h4>
                          <p className="text-[9px] text-gray-500 leading-normal line-clamp-4">{step.txt}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        { num: 'Week 2-4', label: 'Micellar Awaken', txt: 'Houseplant potting soil wakes up. Green foliage brightens.' },
                        { num: 'Month 1-2', label: 'New Offshoots', txt: 'Vibrant young red/green leaf nodes start splitting.' },
                        { num: 'Month 2-3', label: 'Deep Luster', txt: 'Vitamins supply robust leaf defense against household mites.' },
                        { num: 'Month 3-4', label: 'Active Budding', txt: 'Ornamental buds cluster densely along stalks.' },
                        { num: 'Month 4-5', label: 'Ext Blooming', txt: 'Flower duration extends by up to 2.5 times.' },
                        { num: 'Month 5-6', label: 'Sustained Beauty', txt: 'A resilient, gorgeous lush canopy is fully finalized.' }
                      ].map((step, i) => (
                        <div key={i} className="bg-agri-cream p-3 px-3.5 rounded-xl relative border border-agri-cream-border flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                          <span className="text-[10px] font-black text-agri-green-mid block mb-1">{step.num}</span>
                          <h4 className="font-extrabold text-[11px] text-gray-900 mb-1 leading-tight line-clamp-1">{step.label}</h4>
                          <p className="text-[9px] text-gray-500 leading-normal line-clamp-4">{step.txt}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Section 6: Big Brand Science banner */}
            <section className="bg-agri-dark text-white py-10 md:py-20 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full lg:w-1/2 mb-8 lg:mb-0 max-w-xl">
                <span className="text-xs font-bold text-agri-lime tracking-widest uppercase block mb-2 font-mono">SOIL DISCIPLINE</span>
                <h2 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 leading-tight">Root development science is our priority.</h2>
                <p className="text-white/80 leading-relaxed text-xs md:text-base">
                  Most fertilizers only feed the leaf, forcing immediate growth on fragile stalks. Agriic works from the bottom up. We enrich root structures first, securing long-term nutrient storage. Healthy plants are merely the natural side-effect of rich soil.
                </p>
                <div className="mt-6 md:mt-8">
                  <a href="#soil-test" className="btn-primary inline-block text-xs md:text-sm">Diagnostic Soil Test</a>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=700&q=80" 
                  alt="Root system structure photography" 
                  className="rounded-2xl md:rounded-3xl w-full max-w-md object-cover h-52 md:h-72 shadow-lg"
                />
              </div>
            </section>

            {/* Section 7: Ingredients Slider Overview */}
            <section className="py-8 md:py-16 bg-[#f7f6ee]">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-6 md:mb-10 text-center md:text-left">
                  <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">PURE ESSENCES</span>
                  <h2 className="text-2xl font-extrabold text-gray-900">Ayurveda + Modern Plant Science</h2>
                  <p className="text-gray-500 text-xs mt-1 max-w-md">Every premium lot represents a clean, fully listed mixture of nutrient-dense bio-actives.</p>
                </div>

                <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-6 slider-container snap-x snap-mandatory">
                  {INGREDIENTS.map((item, index) => (
                    <div key={index} className="min-w-[150px] max-w-[150px] bg-white rounded-2xl p-3.5 shadow-sm border border-gray-150 flex flex-col items-center snap-start">
                      <img src={item.img} className="w-14 h-14 object-cover rounded-xl mb-3 border border-gray-100" alt="Ingredient" />
                      <h4 className="font-extrabold text-[11px] text-gray-900 text-center mb-1 leading-tight line-clamp-1">{item.name}</h4>
                      <p className="text-[9px] text-gray-500 text-center leading-normal line-clamp-2">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 8: Google Reviews */}
            <section className="py-8 md:py-16 bg-white border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-6 md:mb-10 text-center">
                  <span className="text-xs font-extrabold text-[#e0b031] tracking-widest block uppercase mb-1">4.5★ GOOGLE PRESENCE</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">What backyard growers are sharing</h2>
                </div>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 pb-4">
                  {GOOGLE_REVIEWS.map((r, i) => (
                    <div key={i} className="bg-white p-3.5 rounded-2xl border border-gray-200 flex flex-col justify-between shadow-sm min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                      <div>
                        <div className="flex text-yellow-505 text-[10px] tracking-widest mb-2">★★★★★</div>
                        <p className="text-[10px] text-gray-500 italic leading-relaxed line-clamp-5">"{r.text}"</p>
                      </div>
                      <span className="block font-bold text-[9px] text-slate-800 mt-2 border-t border-slate-100 pt-2 truncate">— {r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 9: Quick Shop Panel */}
            <section className="py-8 md:py-16 px-4 md:px-12 bg-agri-cream">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10">
                  <div>
                    <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-1">PRODUCTS DIRECT</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#2b3a30]">Plant nutrition concentrates</h2>
                  </div>
                  <a href="#products" className="text-agri-dark font-extrabold hover:underline text-xs md:text-sm mt-2 md:mt-0 flex items-center">
                    <span>View all products</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>

                <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 pb-4">
                  {PRODUCTS.slice(0, 4).map((p) => (
                    <div key={p.id} className="bg-white p-3.5 rounded-[20px] md:p-5 md:rounded-[24px] shadow-sm border border-transparent hover:border-gray-200 flex flex-col justify-between relative group transform hover:-translate-y-1 transition-all min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                      <div>
                        <div className="relative rounded-xl overflow-hidden aspect-square mb-3 bg-gray-50 flex items-center justify-center p-2">
                          <img src={p.img} className="max-h-20 md:max-h-32 object-contain group-hover:scale-105 transition-transform" alt={p.name} />
                        </div>
                        <span className="text-[8px] md:text-[9px] font-bold text-agri-green-mid block mb-0.5 uppercase tracking-wide">{p.category}</span>
                        <h4 className="font-extrabold text-[10px] md:text-sm text-gray-900 mb-0.5 leading-tight line-clamp-1">{p.name}</h4>
                        <p className="text-[9px] md:text-[11px] text-gray-500 font-normal leading-relaxed mb-3 line-clamp-2">{p.desc}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-[11px] md:text-sm text-gray-950">₹ {p.price}</span>
                          <span className="text-[9px] md:text-[10px] text-gray-400 line-through">₹ {Math.round(p.price * 1.25)}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(p)}
                          className="w-full bg-[#2c2c2c] hover:bg-black text-white text-[9px] md:text-[11px] font-black tracking-wider py-1.5 md:py-2.5 rounded-lg transition-colors uppercase"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SCIENCE */}
        {routePath === '#science' && (
          <div className="py-6 md:py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-1">RESEARCH METHODOLOGY</span>
            <h1 className="text-2xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">
              Science and Field Validation
            </h1>
            <p className="text-gray-600 text-xs md:text-base max-w-2xl leading-relaxed mb-8">
              At Agriic, botanical biology is not a marketing hook. Read how we design precision soil restoration programs through active trial iterations.
            </p>

            <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 mb-10 pb-4">
              {[
                { title: 'Soil Extraction Map', text: 'We start by extracting complete trace element metrics—specifically evaluating primary mineral depletion levels.' },
                { title: 'Ayurvedic Hybrid Blends', text: 'We enrich active compound isolates (like cold-pressed seaweed micellar enzymes) directly into organic mineral bases.' },
                { title: 'Independent Verification', text: 'Third-party validation verifies final leaf health indexes, crop root weight expansion ratios, and lasting soil biomes.' }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 p-3.5 rounded-2xl shadow-sm bg-white hover:shadow-md transition min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-black text-agri-lime block mb-1">0{index + 1}</span>
                    <h3 className="font-extrabold text-[11px] text-slate-900 mb-1 leading-tight line-clamp-1">{item.title}</h3>
                    <p className="text-[9px] text-gray-505 leading-normal line-clamp-5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Before after cards */}
            <div className="bg-agri-cream p-4 md:p-10 rounded-2xl md:rounded-[32px] mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 md:mb-6 text-center md:text-left">Longitudinal Case Studies</h2>
              <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 pb-4">
                {[
                  { 
                    farmer: 'Amit Deshmukh (Pune District)', 
                    crop: 'Pomegranate Growth',
                    before: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=350&q=80',
                    after: 'https://images.unsplash.com/photo-1610341592771-74946011232f?auto=format&fit=crop&w=350&q=80',
                    desc: 'Soil pH recovery from 5.4 back to balanced 6.7 in just 120 days. Fruit output weight increased by active 42%.'
                  },
                  { 
                    farmer: 'Vikas Patel (Anand District)', 
                    crop: 'Leaf Nitrogen Density',
                    before: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=350&q=80',
                    after: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=350&q=80',
                    desc: 'Nitrogen levels balanced. Soil moisture capacity increased by 33%, securing crops against dry hot bursts.'
                  }
                ].map((caseStudy, index) => (
                  <div key={index} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-150 flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                    <div>
                      <h3 className="font-extrabold text-[11px] md:text-sm text-gray-900 mb-0.5 line-clamp-1">{caseStudy.farmer}</h3>
                      <span className="text-[9px] md:text-[11px] font-bold text-agri-green-mid block mb-2 leading-tight line-clamp-1">{caseStudy.crop}</span>
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        <div>
                          <span className="text-[8px] text-slate-400 block mb-0.5 uppercase font-mono truncate">BEFORE</span>
                          <img src={caseStudy.before} className="rounded-lg h-14 md:h-24 w-full object-cover" alt="Before" />
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 block mb-0.5 uppercase font-mono truncate font-semibold">AFTER</span>
                          <img src={caseStudy.after} className="rounded-lg h-14 md:h-24 w-full object-cover" alt="After" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] md:text-[11px] text-gray-600 leading-normal line-clamp-3 md:line-clamp-none">{caseStudy.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-agri-dark to-agri-green-mid text-white p-6 md:p-12 rounded-2xl md:rounded-3xl text-center">
              <h3 className="text-xl md:text-2xl font-extrabold mb-3">Ready to test your soil baseline?</h3>
              <p className="text-white/80 max-w-sm mx-auto text-[11px] md:text-xs leading-relaxed mb-5">Receive a custom mineral and composition breakdown analysis through our direct digital Soil Test™ quiz.</p>
              <a href="#soil-test" className="bg-agri-lime text-[#1b3322] font-black text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform inline-block uppercase">Start diagnostic free</a>
            </div>
          </div>
        )}

        {/* VIEW 3: ABOUT US */}
        {routePath === '#about' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">OUR BOTANICS MISSION</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-6 tracking-tight">Rooted in science, grown for India</h1>
            
            <div className="prose prose-sm text-gray-600 leading-relaxed space-y-6 text-sm mb-12">
              <p>
                Agriic was established in Vapi, Gujarat with a primary mission: to provide Indian agriculture with customized, soil-specific organic plant nutrition solutions. 
              </p>
              <p>
                By avoiding typical synthetic nitrates that permanently crystallize the topsoil, our slow-release recipes integrate trace botanical enzymes to maintain soil porosity and balanced biological biomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border">
                <h3 className="font-extrabold text-[#2b3a30] text-sm mb-2">Ayurvedic Insight</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">We utilize traditional plant food protocols like neem cake, mustard oil hulls, and alfalfa compounds to construct organic defense.</p>
              </div>
              <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border">
                <h3 className="font-extrabold text-[#2b3a30] text-sm mb-2">Contemporary Science</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">Controlled laboratory extractions of fulvic and humic chains ensure our mixes release micronutrients consistently.</p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Our Journey</h2>
            <div className="space-y-6 relative border-l border-gray-200 pl-6 ml-2">
              {[
                { year: '2019', title: 'Founded with Soil Testing Focus', desc: 'Initially built custom testing kits for state-level co-ops.' },
                { year: '2021', title: 'Formulations validation', desc: 'Completed 300 controlled farm validation iterations with state botanical councils.' },
                { year: '2023', title: 'Farmer Network Reaches 5L', desc: 'Opened centers in Bangalore, Hyderabad, and Nagpur to meet direct requests.' },
                { year: '2026', title: 'Direct consumer launch', desc: 'Making professional agricultural-grade custom blends accessible directly to home gardeners.' }
              ].map((milestone, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-agri-green-mid border-2 border-white ring-4 ring-agri-cream"></span>
                  <span className="block text-xs font-black text-agri-green-mid mb-1">{milestone.year}</span>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{milestone.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: PRODUCTS */}
        {routePath === '#products' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <div className="mb-8">
              <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">SHOP THE CATALOG</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 tracking-tight">Science-backed organic products</h1>
            </div>

            {/* Filter Pills */}
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-4 mb-8">
              {[
                { key: 'all', label: 'All Mixtures' },
                { key: 'nutrition', label: 'Nutrition' },
                { key: 'soil-health', label: 'Soil Health' },
                { key: 'pest-control', label: 'Pest Control' },
                { key: 'tools', label: 'Testing Tools' }
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setProductFilter(pill.key)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-black tracking-wide transition whitespace-nowrap ${
                    productFilter === pill.key 
                      ? 'bg-agri-dark text-white shadow-md' 
                      : 'bg-agri-cream text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.filter(p => productFilter === 'all' || p.category === productFilter).map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-[#e2e1d7]/60 flex flex-col justify-between group transform hover:-translate-y-1 transition-all">
                  <div>
                    <a href={`#product?id=${p.id}`} className="block">
                      <div className="relative rounded-xl overflow-hidden aspect-square mb-4 bg-gray-50 flex items-center justify-center p-4">
                        <img src={p.img} className="max-h-36 object-contain group-hover:scale-105 transition-transform" alt={p.name} />
                      </div>
                      <span className="text-[10px] font-bold text-agri-green-mid block mb-1 uppercase tracking-wider">{p.category}</span>
                      <h4 className="font-extrabold text-sm text-gray-900 mb-1 leading-tight group-hover:text-agri-green-mid transition-colors">{p.name}</h4>
                      <p className="text-[11px] text-gray-500 font-normal leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                    </a>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-extrabold text-[#2b3a30] text-sm">₹ {p.price}</span>
                      <span className="text-[11px] text-gray-400 line-through">₹ {Math.round(p.price * 1.25)}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(p)}
                      className="w-full bg-[#1b3322] hover:bg-black text-white text-[11px] tracking-widest font-black py-3 rounded-lg transition-colors"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: PRODUCT DETAIL */}
        {routePath === '#product' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-6xl mx-auto">
            {(() => {
              const prodId = routeParams.id;
              const product = PRODUCTS.find(p => p.id === prodId);
              
              if (!product) {
                return (
                  <div className="text-center py-16">
                    <HelpCircle className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
                    <p className="text-sm text-gray-550 mb-6">The item you searched for could not be traced.</p>
                    <a href="#products" className="btn-primary">Browse All Products</a>
                  </div>
                );
              }

              // Related products
              const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
              
              return (
                <div>
                  <a href="#products" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-agri-green-mid hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to shop catalog</span>
                  </a>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
                    {/* Left side Image container */}
                    <div className="bg-agri-cream rounded-[32px] p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                      <img src={product.img} className="max-h-72 object-contain drop-shadow-xl" alt={product.name} />
                    </div>

                    {/* Right side detail fields */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">{product.category}</span>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">{product.name}</h1>
                        
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="flex text-agri-gold">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <Star key={starIdx} className="w-4 h-4 fill-agri-gold" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">Verified trial reports</span>
                        </div>

                        <div className="flex items-end space-x-2.5 mb-6">
                          <span className="text-2xl font-black text-gray-905">₹ {product.price}</span>
                          <span className="text-xs text-gray-400 line-through mb-1">₹ {Math.round(product.price * 1.25)}</span>
                          <span className="text-xs text-red-500 font-bold ml-2">(20% discount applied)</span>
                        </div>

                        <p className="text-sm text-gray-650 leading-relaxed font-normal mb-8">
                          {product.desc} Every Agriic concentration goes through rigorous quality control checks and is organic certified, protecting local water basins against synthetic run-off.
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-6">
                        <button 
                          onClick={() => addToCart(product, 1)}
                          className="w-full bg-agri-dark text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-black transition text-sm tracking-wider uppercase"
                        >
                          ADD TO CART • ₹ {product.price}
                        </button>
                      </div>

                      {/* Accordions */}
                      <div className="mt-8 space-y-3.5">
                        {[
                          { id: 'benefits', title: 'Nutrient Bio-availability & Benefits', txt: 'Restores the nitrogen framework with slow solubility, ensuring local capillary root branches absorb macro complexes without cell burning risk.' },
                          { id: 'usage', title: 'Specific Application Directions', txt: 'Apply 15g evenly around houseplants or 1 bag per 100 sq ft for field cultivation. Water immediately. Repeat once every 24 days.' },
                          { id: 'shipping', title: 'Safe Delivery & Traceability', txt: 'Eco-packed and traced within 24 hours. Free dispatch for carts above ₹499.' }
                        ].map(acc => {
                          const isOpen = openAccordion === acc.id;
                          return (
                            <div key={acc.id} className="border-b border-slate-100 pb-3">
                              <button 
                                onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                                className="w-full flex items-center justify-between text-left focus:outline-none py-2"
                              >
                                <span className="font-bold text-xs tracking-wide text-slate-800 uppercase">{acc.title}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isOpen && (
                                <p className="text-xs text-gray-550 leading-relaxed mt-2 animate-fade-in pl-1">
                                  {acc.txt}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Related items */}
                  {related.length > 0 && (
                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-6">Other target organic mixtures</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {related.map((rp) => (
                          <div key={rp.id} className="bg-[#f7f6ee] p-4 rounded-2xl flex flex-col justify-between hover:shadow-sm transition">
                            <a href={`#product?id=${rp.id}`} className="block">
                              <img src={rp.img} className="h-28 mx-auto object-contain rounded-lg mb-2" alt={rp.name} />
                              <h4 className="font-extrabold text-xs text-gray-900 group-hover:text-agri-green-mid leading-tight line-clamp-1">{rp.name}</h4>
                            </a>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-bold text-xs text-gray-800">₹ {rp.price}</span>
                              <button 
                                onClick={() => addToCart(rp)}
                                className="bg-white hover:bg-gray-100 border border-gray-250 px-2.5 py-1.5 rounded-lg text-[10px] font-bold"
                              >
                                Add item
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 6: SOIL TEST */}
        {routePath === '#soil-test' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-3xl mx-auto">
            {!quizCompleted ? (
              <div className="bg-[#f7f6ee] p-6 md:p-10 rounded-[32px] border border-agri-cream-border shadow-sm">
                <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-1">DIAGNOSTIC TEST</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">The Soil Test™</h1>
                <p className="text-xs text-gray-550 mb-8 max-w-md leading-relaxed">
                  Analyze your baseline nutrient deficiencies to generate a customized kit recommendation. Answer 5 easy questions.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full mb-2 overflow-hidden">
                  <div 
                    className="bg-agri-lime-alt h-full transition-all duration-300"
                    style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 font-bold mb-8">
                  <span>STEP {quizStep + 1} OF 5</span>
                  <span>{Math.round(((quizStep + 1) / QUIZ_QUESTIONS.length) * 100)}% COMPLETE</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 mb-6">{QUIZ_QUESTIONS[quizStep].question}</h3>
                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[quizStep].options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[quizStep] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            const updated = [...quizAnswers];
                            updated[quizStep] = optIdx;
                            setQuizAnswers(updated);
                          }}
                          className={`w-full text-left p-4.5 rounded-xl border text-xs font-bold leading-tight transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-white border-agri-lime text-agri-dark ring-2 ring-agri-lime/20' 
                              : 'bg-white border-gray-250 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-agri-lime bg-agri-lime' : 'border-gray-300'}`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#1b3322]"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center-pt-4">
                  {quizStep > 0 ? (
                    <button 
                      onClick={() => setQuizStep(quizStep - 1)}
                      className="text-xs font-bold text-gray-500 hover:text-black transition"
                    >
                      ← Back
                    </button>
                  ) : <div></div>}

                  <button
                    onClick={() => {
                      if (quizStep < QUIZ_QUESTIONS.length - 1) {
                        setQuizStep(quizStep + 1);
                      } else {
                        setQuizCompleted(true);
                      }
                    }}
                    disabled={quizAnswers[quizStep] === undefined}
                    className={`px-6 py-3.5 rounded-xl text-xs font-extrabold tracking-wider ${
                      quizAnswers[quizStep] !== undefined 
                        ? 'bg-agri-dark text-white cursor-pointer hover:bg-black' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {quizStep === QUIZ_QUESTIONS.length - 1 ? 'See Recommendations' : 'Next Question →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 p-6 md:p-10 rounded-[32px] text-center shadow-lg animate-fade-in text-gray-900">
                <div className="w-16 h-16 bg-agri-lime/30 rounded-full flex items-center justify-center text-agri-dark mx-auto mb-6">
                  <Check className="w-8 h-8 text-agri-dark" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Diagnostic Analysis Complete!</h1>
                <p className="text-xs text-gray-650 max-w-sm mx-auto mb-8 leading-normal">
                  Our system matched your answers to target deficiencies. We recommend the following starter mixture based on your crop selections.
                </p>

                <div className="border border-[#e2e1d7] p-5 rounded-2xl bg-slate-50 text-left mb-8 max-w-md mx-auto">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={PRODUCTS[0].img} className="w-12 h-12 object-cover rounded-lg bg-white p-1 border" alt="Core NPK" />
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{PRODUCTS[0].name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{PRODUCTS[0].desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center-pt-2 border-t border-slate-100 mt-2">
                    <span className="font-extrabold text-slate-800 text-sm">₹ {PRODUCTS[0].price}</span>
                    <button 
                      onClick={() => addToCart(PRODUCTS[0], 1)}
                      className="bg-[#2b3a30] text-agri-lime hover:bg-black font-black text-[10px] tracking-wider px-3 py-1.5 rounded-md"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => {
                      setQuizStep(0);
                      setQuizAnswers([]);
                      setQuizCompleted(false);
                    }}
                    className="text-xs text-gray-550 hover:text-black tracking-wide font-extrabold underline"
                  >
                    Retake Soil Test™
                  </button>
                  <span>|</span>
                  <a href="#products" className="text-xs text-agri-green-mid hover:underline font-extrabold">Shop complete kit</a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 7: GROWING BLOG */}
        {routePath === '#blog' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">EDUCATIONAL HUB</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">Stay rooted in botany</h1>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-12">Learn top gardening practices, soil microbial mechanics, and seasonal vegetable timing from our specialists.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post, index) => (
                <div key={index} className="border border-gray-150 rounded-[24px] overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <img src={post.img} className="h-48 w-full object-cover" alt={post.title} />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-[10px] font-extrabold text-agri-green-mid mb-2 uppercase tracking-widest bg-agri-cream px-2 py-0.5 rounded w-fit">
                      <span>{post.category}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-gray-905 mb-2 leading-tight">{post.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-3 border-t border-slate-50 font-semibold">
                      <span>{post.date}</span>
                      <span>{post.readTime} read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-[#f7f6ee] p-8 md:p-12 rounded-[32px] mt-16 text-center max-w-3xl mx-auto border border-[#e2e1d7]/60">
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Subscribe to Agriic Digest</h3>
              <p className="text-xs text-gray-550 max-w-md mx-auto mb-6">Receive seasonal crop guidance, localized soil alerts, and exclusive discounts directly in your inbox.</p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsEmail) {
                    showToastMsg('Subscription success! Check your inbox soon.');
                    setNewsEmail('');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input 
                  type="email" 
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="Enter email address" 
                  className="bg-white border border-gray-300 px-4 py-3 rounded-xl flex-1 text-slate-800 text-xs font-semibold focus:outline-none" 
                  required
                />
                <button 
                  type="submit" 
                  className="bg-agri-dark text-white font-extrabold text-xs px-6 py-3.5 rounded-xl hover:bg-black transition whitespace-nowrap"
                >
                  Join Newsletter
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 8: ABOUT / HOW TO CONTACT */}
        {routePath === '#contact' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-2">DIRECT COMMUNICATION</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">Consult with our advisors</h1>
            <p className="text-sm text-gray-600 mb-10 max-w-md lead-relaxed">We provide responsive, direct advice. Send a custom enquiry about crop health or order problems.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Form panel */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  showToastMsg('Message received. Our advisor will return with research data soon.');
                  setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={contactForm.name} 
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })} 
                    placeholder="Enter name" 
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Email</label>
                    <input 
                      type="email" 
                      value={contactForm.email} 
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })} 
                      placeholder="you@example.com" 
                      className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone (Format)</label>
                    <input 
                      type="tel" 
                      value={contactForm.phone} 
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} 
                      placeholder="+91" 
                      className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Subject</label>
                  <select 
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none"
                    required
                  >
                    <option value="">Choose a subject...</option>
                    <option value="soil">Soil test support enquiries</option>
                    <option value="product">Product composition questions</option>
                    <option value="wholesale">Commercial and bulk purchases</option>
                    <option value="delivery">Shipping query</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Enquiry</label>
                  <textarea 
                    value={contactForm.message} 
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })} 
                    placeholder="Provide details about your soil or crop type..." 
                    rows={4} 
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-agri-dark text-[#c2dd74] font-black tracking-wider text-xs px-6 py-4.5 rounded-xl hover:bg-black transition-colors"
                >
                  SEND ADVICE ENQUIRY
                </button>
              </form>

              {/* Direct ways details */}
              <div className="space-y-6">
                <div className="bg-[#f7f6ee] p-6 rounded-2xl border border-[#e2e1d7]">
                  <h3 className="font-extrabold text-sm text-[#2b3a30] mb-2 flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-agri-green-mid" />
                    <span>WhatsApp support centre</span>
                  </h3>
                  <p className="text-xs text-gray-650 leading-relaxed font-normal mb-4">
                    Send photos of your crops directly to our botanical advisors. We will review leaf spot damages immediately.
                  </p>
                  <a 
                    href="https://wa.me/918047863601" 
                    target="_blank" 
                    rel="noopener"
                    className="bg-[#25D366] text-white font-extrabold text-xs px-5 py-2.5 rounded-lg inline-flex items-center space-x-2 shadow-sm"
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 mb-3">Service Locations</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Bengaluru', 'Pune', 'Nagpur', 'Chennai', 'Vapi (Regd. Office)', 'Mumbai (HQ)'].map((city, idx) => (
                      <span key={idx} className="bg-agri-cream text-gray-700 border border-agri-cream-border text-[11px] font-semibold px-3.5 py-1.5 rounded-md">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p className="font-bold">Agriic Solutions Pvt. Ltd.</p>
                  <p className="mt-1">Unit no - 101, B wing, building - 16, Interface, Off Link Road, Malad (West), Mumbai - 400064</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 9: CART */}
        {routePath === '#cart' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-[#2b3a30] mb-2 tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-gray-500 mb-8">{getCartCount()} items in basket</p>

            {cart.length === 0 ? (
              <div className="text-center py-16 bg-[#f7f6ee] rounded-3xl p-6 border">
                <ShoppingCart className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cart is empty</h3>
                <p className="text-xs text-gray-500 mb-6">Explore our diagnostic mixtures to start crop recovery.</p>
                <a href="#products" className="btn-primary">Browse Shop Products</a>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="divide-y divide-gray-150">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4.5 flex items-center justify-between gap-4">
                      <img src={item.product.img} className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-1" alt={item.product.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-gray-900 truncate">{item.product.name}</h4>
                        <span className="text-[11px] text-gray-500 font-bold uppercase">{item.product.category}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-slate-50 px-2 py-1 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                          className="p-1 hover:text-red-500 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button 
                          onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                          className="p-1 hover:text-agri-green-mid transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right w-20">
                        <span className="font-extrabold text-sm text-gray-950 block">₹ {item.product.price * item.qty}</span>
                        <span className="text-[10px] text-slate-400">₹ {item.product.price}/ea</span>
                      </div>

                      <button 
                        onClick={() => updateCartQty(item.product.id, 0)}
                        className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Free shipping banner */}
                <div className="bg-agri-cream p-4 rounded-xl border border-agri-cream-border text-xs flex justify-between items-center">
                  {getSubtotal() >= 499 ? (
                    <span className="text-agri-green-mid font-bold flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Order qualifies for free secure shipping!</span>
                    </span>
                  ) : (
                    <span className="text-gray-650">
                      Add <strong>₹ {499 - getSubtotal()}</strong> more to unlock <strong>FREE secure shipping</strong>
                    </span>
                  )}
                  <span className="font-semibold text-slate-400">Secure packing guaranteed</span>
                </div>

                <div className="bg-[#f7f6ee] rounded-2xl p-6 md:p-8 mt-4 border border-[#e2e1d7] max-w-sm ml-auto">
                  <h3 className="font-black text-sm text-gray-900 border-b border-[#e2e1d7] pb-3 mb-4 uppercase">Subtotal Summary</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span className="font-bold text-gray-900">₹ {getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Estimated shipping</span>
                      <span className="font-bold text-gray-900">
                        {getSubtotal() >= 499 ? <span className="text-agri-green-mid">FREE</span> : '₹ 49'}
                      </span>
                    </div>
                    <div className="border-t border-[#e2e1d7] pt-3 flex justify-between font-black text-sm text-gray-950">
                      <span>Total Invoice</span>
                      <span>₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}</span>
                    </div>
                  </div>

                  <a 
                    href="#checkout" 
                    className="w-full text-center block bg-agri-dark text-white font-extrabold text-xs py-4.5 rounded-xl shadow-lg hover:bg-black transition-colors uppercase mt-6"
                  >
                    PROCEED TO CHECKOUT
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 10: CHECKOUT */}
        {routePath === '#checkout' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            {cart.length === 0 ? (
              <div className="text-center py-16 bg-[#f7f6ee] border border-gray-200 rounded-3xl p-6 max-w-md mx-auto">
                <ShoppingCart className="w-12 h-12 text-[#2b3a30] mx-auto mb-4" />
                <h3 className="text-lg font-black text-[#1b3322] mb-1">Cart is empty</h3>
                <p className="text-xs text-gray-500 mb-6">Explore our diagnostic mixtures to start crop recovery.</p>
                <a href="#products" className="btn-primary inline-block">Browse Shop Products</a>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Secure Checkout</h1>
                <p className="text-xs text-gray-400 mb-6 font-normal">Complete your organic soil biome restoration order parameters.</p>

                {/* AUTOFILL HELPER BANNER */}
                <div className="bg-[#f7f6ee] border border-dashed border-[#1b3322]/30 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h4 className="text-xs font-black text-[#1b3322] uppercase tracking-wide">Grower Profile Auto-fill</h4>
                      <p className="text-[11px] text-gray-500 leading-normal mt-0.5 font-normal">
                        {currentUser ? `Speed up dispatch with registered profile details: Name: "${currentUser.name || 'Alok'}", Phone: "${currentUser.phone || 'N/A'}", State: "${currentUser.location || 'N/A'}"` : 'Please register or log in to automatically load your location and phone metrics!'}
                      </p>
                    </div>
                  </div>
                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutEmail(currentUser.email || '');
                        setCheckoutPhone(currentUser.phone || '');
                        setCheckoutFullname(currentUser.name || '');
                        setCheckoutState(currentUser.location || '');
                        showToastMsg('⚡ Successfully pre-loaded Address and Phone from Grower Profile!');
                      }}
                      className="bg-[#1b3322] hover:bg-black text-[#c2dd74] hover:text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      Fill Profile Details
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Side forms */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      
                      const email = checkoutEmail || 'farmer@agriic.com';
                      const fullname = checkoutFullname || 'Alok Patel';
                      const street = checkoutStreet || '';
                      const pincode = checkoutPincode || '';
                      const city = checkoutCity || '';
                      const state = checkoutState || '';

                      const newOrder: Order = {
                        id: `AGR-${Math.floor(10000 + Math.random() * 90000)}`,
                        date: new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        }),
                        items: cart.map(item => ({
                          productId: item.product.id,
                          name: item.product.name,
                          price: item.product.price,
                          qty: item.qty,
                          img: item.product.img
                        })),
                        total: getSubtotal() + (getSubtotal() >= 499 ? 0 : 49),
                        status: 'Processing',
                        paymentMethod: paymentMethod,
                        address: `${street}, ${city}, ${state} - ${pincode}`
                      };

                      setOrders([newOrder, ...orders]);
                      showToastMsg('Order placed successfully! Redirecting to tracking center.');
                      clearCart();
                      window.location.hash = '#profile';
                    }}
                    className="lg:col-span-2 space-y-6"
                  >
                    {/* Contact details */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Contact Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Email</label>
                          <input 
                            name="email" 
                            type="email" 
                            value={checkoutEmail}
                            onChange={e => setCheckoutEmail(e.target.value)}
                            placeholder="farmer@agriic.com" 
                            className="w-full border p-3 text-xs font-semibold rounded-xl" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Mobile Phone</label>
                          <input 
                            name="phone" 
                            type="tel" 
                            value={checkoutPhone}
                            onChange={e => setCheckoutPhone(e.target.value)}
                            placeholder="+91" 
                            className="w-full border p-3 text-xs font-semibold rounded-xl" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Shipping Destination</h3>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">Complete Full Name</label>
                        <input 
                          name="fullname" 
                          type="text" 
                          value={checkoutFullname}
                          onChange={e => setCheckoutFullname(e.target.value)}
                          placeholder="Add name" 
                          className="w-full border p-3 text-xs font-semibold rounded-xl" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">Street Address</label>
                        <input 
                          name="street" 
                          type="text" 
                          value={checkoutStreet}
                          onChange={e => setCheckoutStreet(e.target.value)}
                          placeholder="Apartment, block, area details" 
                          className="w-full border p-3 text-xs font-semibold rounded-xl" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Pin Code</label>
                          <input 
                            name="pincode" 
                            type="text" 
                            value={checkoutPincode}
                            onChange={e => setCheckoutPincode(e.target.value)}
                            placeholder="400001" 
                            className="w-full border p-3 text-xs font-semibold rounded-xl" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">City</label>
                          <input 
                            name="city" 
                            type="text" 
                            value={checkoutCity}
                            onChange={e => setCheckoutCity(e.target.value)}
                            placeholder="Mumbai" 
                            className="w-full border p-3 text-xs font-semibold rounded-xl" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">State</label>
                          <input 
                            name="state" 
                            type="text" 
                            value={checkoutState}
                            onChange={e => setCheckoutState(e.target.value)}
                            placeholder="Maharashtra" 
                            className="w-full border p-3 text-xs font-semibold rounded-xl" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Method selection */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Billing Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button 
                          type="button" 
                          onClick={() => setPaymentMethod('card')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'card' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          Credit / Debit Card
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'upi' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          UPI / QR Instant
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'cod' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          Cash on Delivery (COD)
                        </button>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-dashed mt-4">
                          <div>
                            <input type="text" placeholder="Card owner name" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                          <div>
                            <input type="text" placeholder="16-digit Card Number" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/YY" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                            <input type="password" placeholder="CVV" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'upi' && (
                        <div className="p-4 bg-[#f7f6ee] text-center rounded-xl font-bold text-xs text-agri-dark mt-4 border border-agri-cream-border">
                          🔒 Pay via GooglePay or PhonePe UPI address on the next interactive prompt.
                        </div>
                      )}

                      {paymentMethod === 'cod' && (
                        <div className="p-4 bg-yellow-50 text-center rounded-xl font-bold text-xs text-[#4e2b15] mt-4 border border-yellow-150">
                          📦 Pay securely when the local courier delivers bags to your destination.
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#1b3322] hover:bg-black text-white py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-md"
                    >
                      PLACE SECURED ORDER • ₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}
                    </button>
                  </form>

                  {/* Right Side summary */}
                  <div>
                    <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border sticky top-24">
                      <h3 className="font-extrabold text-sm text-[#2b3a30] mb-4 uppercase border-b border-agri-cream-border pb-2">Items Summary</h3>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar mb-4">
                        {cart.map(item => (
                          <div key={item.product.id} className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2">
                              <img src={item.product.img} className="w-8 h-8 object-cover rounded bg-white p-0.5 border" alt="Cart item pr" />
                              <span className="font-semibold text-gray-850 truncate max-w-32">{item.product.name}</span>
                              <span className="text-gray-400 font-bold ml-1">x{item.qty}</span>
                            </div>
                            <span className="font-bold text-slate-900">₹ {item.product.price * item.qty}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-agri-cream-border pt-4 text-xs space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹ {getSubtotal()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Estimated shipping</span>
                          <span>{getSubtotal() >= 499 ? 'FREE' : '₹ 49'}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-bold text-slate-800 pt-1 border-t">
                          <span>Total to pay</span>
                          <span>₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 11: AUTHENTICATION */}
        {routePath === '#auth' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-sm mx-auto">
            <div className="bg-agri-cream p-6 rounded-3xl border border-agri-cream-border shadow-md">
              <h1 className="text-xl font-black text-gray-905 mb-2 text-center uppercase tracking-wide">
                {authMode === 'login' ? 'Sign In Back' : 'Create accounts'}
              </h1>
              <p className="text-[11px] text-gray-500 text-center mb-6 leading-normal">
                {authMode === 'login' ? 'Access trace logs, orders histories, and Soil Test™ data.' : 'Join the science-led farming nutrition network today.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <div>
                      <label className="text-[11px] font-bold text-gray-750 block mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={authName} 
                        onChange={e => setAuthName(e.target.value)} 
                        placeholder="e.g. Alok Patel" 
                        className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-750 block mb-1">Indian State / Location</label>
                      <input 
                        type="text" 
                        value={authLocation} 
                        onChange={e => setAuthLocation(e.target.value)} 
                        placeholder="Enter State (e.g. Maharashtra)" 
                        className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-750 block mb-1">Phone / Whatsapp Number</label>
                      <input 
                        type="tel" 
                        value={authPhone} 
                        onChange={e => setAuthPhone(e.target.value)} 
                        placeholder="e.g. 9845012345" 
                        className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" 
                        required 
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="text-[11px] font-bold text-gray-750 block mb-1">Email address</label>
                  <input 
                    type="email" 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-750 block mb-1 font-mono">Enter your Password</label>
                  <input 
                    type="password" 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#1b3322] hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow"
                >
                  {authMode === 'login' ? 'LOGIN USER' : 'CREATE FREE USER'}
                </button>
              </form>

              <div className="mt-6 border-t pt-4 text-center">
                {authMode === 'login' ? (
                  <button 
                    onClick={() => setAuthMode('signup')}
                    className="text-xs text-agri-green-mid hover:underline font-bold"
                  >
                    Don't have an account? Sign up here
                  </button>
                ) : (
                  <button 
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-agri-green-mid hover:underline font-bold"
                  >
                    Already have an account? Log in here
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 11.2: ADMIN DASHBOARD PLATFORM */}
        {routePath === '#admin' && (
          <div className="min-h-screen bg-[#F4F6F2] font-sans antialiased text-slate-800 flex flex-col md:flex-row animate-fade-in">
            {/* If not authenticated as Admin, show login screen */}
            {!adminUser ? (
              <div className="flex-1 flex items-center justify-center py-20 px-4">
                <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl max-w-md w-full text-center space-y-6">
                  <div>
                    <span className="inline-flex p-3 rounded-2xl bg-emerald-50 text-[#3B6D11] mb-3">
                      <Leaf className="w-8 h-8 animate-pulse" />
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agriic Staff Hub</h2>
                    <p className="text-gray-500 text-xs mt-1">Science-led plant nutrition and grower support cockpit</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl font-bold text-xs text-slate-700 transition cursor-pointer shadow-sm animate-bounce"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.838 15.539 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.302-.176-1.71h-10.617z"/>
                      </svg>
                      <span>Sign In with Google Account</span>
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-150"></div>
                    </div>
                    <span className="relative px-3 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sandbox Overrides</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      onClick={() => handleDemoAdminLogin('Super Admin')}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition cursor-pointer"
                    >
                      <strong className="text-[#3B6D11] text-[11px] font-black block">👑 Super Admin</strong>
                      <span className="text-[9px] text-emerald-800 block mt-0.5 font-medium">Bypass OAuth & inspect full business metrics.</span>
                    </button>
                    <button
                      onClick={() => handleDemoAdminLogin('Agronomist')}
                      className="p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-left transition cursor-pointer"
                    >
                      <strong className="text-[#0F6E56] text-[11px] font-black block">🔬 Staff Advisor</strong>
                      <span className="text-[9px] text-teal-800 block mt-0.5 font-medium">Test custom role-based view constraints.</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Connecting to secure Cloud Firestore instance IDs: <br/>
                    <strong className="font-mono text-slate-500">ai-studio-a19b472c-b3ef-4bd2-bee0-ad2edf9f388c</strong>
                  </p>
                </div>
              </div>
            ) : (
              /* Administrative Dashboard Main Shell */
              <div className="flex-1 flex flex-col md:flex-row min-h-screen">
                {/* Left Sidebar Layout */}
                <div className="w-full md:w-64 bg-[#112415] text-white shrink-0 flex flex-col border-r border-[#1e3d23] relative z-20">
                  {/* Brand header */}
                  <div className="p-5 border-b border-[#1e3d23] flex items-center gap-2 bg-[#0c1a0f]">
                    <span className="p-1.5 rounded-lg bg-[#3B6D11] text-white">
                      <Leaf className="w-4 h-4 text-agri-lime" />
                    </span>
                    <div>
                      <h1 className="font-black text-xs uppercase tracking-widest text-[#c2dd74]">Agriic Admin</h1>
                      <p className="text-[9px] text-emerald-600 font-mono">v1.2.0-secure</p>
                    </div>
                  </div>

                  {/* Navigation Links: 10 Tabs */}
                  <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto max-h-[85vh]">
                    {[
                      { id: 'home', label: 'Dashboard Home', icon: Globe },
                      { id: 'farmers', label: 'Farmers Directory', icon: User },
                      { id: 'soil', label: 'Soil & Crop Analysis', icon: Leaf },
                      { id: 'nutrition', label: 'Nutrition Plans', icon: FileText },
                      { id: 'products', label: 'Products & Kanban', icon: Package },
                      { id: 'analytics', label: 'Analytics Insights', icon: Award },
                      { id: 'consultations', label: 'Appointments', icon: Calendar },
                      { id: 'content', label: 'Content CMS & SMS', icon: BookOpen },
                      { id: 'support', label: 'Support Helpdesk', icon: HelpCircle },
                      { id: 'settings', label: 'Workspace Settings', icon: ShieldCheck }
                    ].map((tab) => {
                      const IconComp = tab.icon;
                      const isActive = adminActiveTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setAdminActiveTab(tab.id)}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-black transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-[#3B6D11] text-white shadow-md' 
                              : 'text-emerald-100 hover:bg-emerald-950/40 hover:text-white'
                          }`}
                        >
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-agri-lime' : 'text-emerald-500'}`} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer User Badge & Role switch */}
                  <div className="p-4 border-t border-[#1e3d23] bg-[#0c1a0f] space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-emerald-900 overflow-hidden flex items-center justify-center text-slate-800 font-bold text-xs uppercase font-mono">
                        {adminUser.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <strong className="text-[11px] block text-slate-100 truncate">{adminUser.name}</strong>
                        <span className="text-[9px] block text-agri-lime font-mono font-bold uppercase tracking-wider">{adminUser.role}</span>
                      </div>
                    </div>

                    {/* Quick tester role switcher */}
                    <div className="space-y-1.5 pt-2 border-t border-emerald-950">
                      <label className="text-[8px] font-extrabold uppercase tracking-widest text-[#0F6E56] block font-mono">Access Role Toggle</label>
                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <button
                          onClick={() => handleDemoAdminLogin('Super Admin')}
                          className={`px-1 py-1 rounded text-[8px] font-black uppercase text-center border cursor-pointer ${
                            adminUser.role === 'Super Admin' 
                              ? 'bg-[#3B6D11] border-[#3B6D11] text-white' 
                              : 'bg-transparent border-emerald-900 text-emerald-300 hover:text-white'
                          }`}
                        >
                          SuperAdmin
                        </button>
                        <button
                          onClick={() => handleDemoAdminLogin('Agronomist')}
                          className={`px-1 py-1 rounded text-[8px] font-black uppercase text-center border cursor-pointer ${
                            adminUser.role === 'Agronomist' 
                              ? 'bg-[#0F6E56] border-[#0F6E56] text-white' 
                              : 'bg-transparent border-emerald-900 text-emerald-300 hover:text-white'
                          }`}
                        >
                          Agronomist
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAdminSignOut}
                      className="w-full text-center py-2 bg-[#2d1c1a]/60 hover:bg-[#3f2220] text-red-300 hover:text-red-200 rounded-lg text-[9.5px] font-extrabold transition uppercase tracking-widest cursor-pointer mt-1"
                    >
                      Sign Out Hub
                    </button>
                  </div>
                </div>

                {/* Right panel, main content */}
                <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-h-screen">
                  {/* System connection header */}
                  <div className="bg-white border-[0.5px] border-emerald-50 rounded-xl px-4 py-2 flex items-center justify-between text-[10px] text-gray-500 shadow-sm mt-1 sm:mt-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Connected live to Google Firestore: <strong className="font-mono text-[#3B6D11]">gen-lang-client-0062152692</strong></span>
                    </div>
                    <span className="font-mono text-[9px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded">
                      Role Access level: {adminUser.role.toUpperCase()}
                    </span>
                  </div>

                   {/* Modules Rendering router */}
                  {adminActiveTab === 'home' && (
                    <HomeModule 
                      farmers={liveFarmers}
                      soilReports={liveSoilReports}
                      orders={liveOrders as any}
                      alertRules={liveAlertRules}
                      activities={liveActivities}
                      onClearActivities={handleClearActivities}
                      onNavigateToTab={(tabId) => setAdminActiveTab(tabId)}
                    />
                  )}

                  {adminActiveTab === 'farmers' && (
                    <FarmersModule 
                      farmers={liveFarmers}
                      onUpdateRole={handleUpdateFarmerRole}
                      onUpdateStatus={handleUpdateFarmerStatus}
                      onAddFarmer={async (farmer) => {
                        try {
                          const newId = `FARMER_${Math.floor(1000 + Math.random() * 9000)}`;
                          const payload = {
                            id: newId,
                            ...farmer,
                            joinedAt: new Date().toISOString()
                          };
                          await setDoc(doc(db, "users", newId), payload);
                          showToastMsg(`Registered grower ${farmer.name} successfully.`);
                        } catch (e) {
                          handleLiveSyncError(e, 'create', 'users');
                        }
                      }}
                    />
                  )}

                  {adminActiveTab === 'soil' && (
                    <SoilModule 
                      soilReports={liveSoilReports}
                      alertRules={liveAlertRules}
                      farmers={liveFarmers}
                      onReviewReport={handleReviewSoilReport}
                      onAddReport={handleUploadSoilReport}
                      onAddAlertRule={handleAddAlertRule}
                      onToggleAlertRule={handleToggleAlertRule}
                      onDeleteAlertRule={handleDeleteAlertRule}
                    />
                  )}

                  {adminActiveTab === 'nutrition' && (
                    <NutritionModule 
                      nutritionPlans={liveNutritionPlans}
                      farmers={liveFarmers}
                      onAddPlan={handleAddPlan}
                    />
                  )}

                  {adminActiveTab === 'products' && (
                    <ProductsModule 
                      products={liveProducts as any}
                      orders={liveOrders as any}
                      onAddProduct={handleAddProductAdmin}
                      onEditProductStock={handleEditProductStock}
                      onDeleteProduct={handleDeleteProductAdmin}
                      onUpdateOrderStatus={handleUpdateOrderStatusAdmin}
                    />
                  )}

                  {adminActiveTab === 'analytics' && (
                    adminUser.role === 'Super Admin' ? (
                      <AnalyticsModule 
                        orders={liveOrders as any}
                        farmers={liveFarmers}
                        soilReports={liveSoilReports}
                      />
                    ) : (
                      <div className="bg-white border rounded-2xl p-12 text-center text-slate-500 max-w-lg mx-auto mt-10 shadow-sm animate-fade-in">
                        <span className="text-4xl block mb-4">🔒</span>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Analytics Restricted</h3>
                        <p className="text-[10px] mt-1.5 leading-relaxed text-gray-500">Only users logged in with the <strong className="text-[#3B6D11]">Super Admin</strong> privilege are autorun to query business and gross revenues. Please use the sidebar's role toggle to elevate privilege levels.</p>
                      </div>
                    )
                  )}

                  {adminActiveTab === 'consultations' && (
                    <ConsultationsModule 
                      consultations={liveConsultations}
                      farmers={liveFarmers}
                      onAddConsultation={handleAddConsultation}
                      onCompleteConsultation={handleCompleteConsultation}
                    />
                  )}

                  {adminActiveTab === 'content' && (
                    <ContentModule 
                      contentItems={liveContent}
                      onAddContent={handlePublishArticle}
                      onDeleteContent={handleDeleteArticle}
                      onSendSegmentalPush={async (segment, subj, msg) => {
                        try {
                          const actId = `ACT_SMS_${Date.now()}`;
                          await setDoc(doc(db, "activities", actId), {
                            id: actId,
                            message: `⚡ SMS Broadcast: "${subj}" pushed to segment ${segment}`,
                            type: 'content',
                            time: 'just now'
                          });
                          showToastMsg(`SMS broadcast successfully scheduled to segment [${segment}]`);
                        } catch (e) {
                          handleLiveSyncError(e, 'create', 'activities');
                        }
                      }}
                    />
                  )}

                  {adminActiveTab === 'support' && (
                    <SupportModule 
                      tickets={liveTickets}
                      onAddTicketMessage={handleAddTicketMessage}
                      onUpdateTicketStatus={handleUpdateTicketStatus}
                    />
                  )}

                  {adminActiveTab === 'settings' && (
                    adminUser.role === 'Super Admin' ? (
                      <SettingsModule 
                        farmers={liveFarmers}
                        products={liveProducts as any}
                        soilReports={liveSoilReports}
                        brandingTitle={liveSettings?.primaryBrandName || "Agriic Science HQ"}
                        onUpdateBranding={async (newTitle) => {
                          try {
                            const defaultSetts = {
                              primaryBrandName: newTitle,
                              primaryColor: "#3B6D11",
                              secondaryColor: "#0F6E56",
                              enableSMS: true,
                              enablePayments: true,
                              enableWeather: true,
                              twoFactorEnabled: false
                            };
                            await setDoc(doc(db, "settings", "global_workspace"), defaultSetts);
                            showToastMsg(`Successfully updated settings branding title to: "${newTitle}"`);
                          } catch (e) {
                            handleLiveSyncError(e, 'write', 'settings/global_workspace');
                          }
                        }}
                      />
                    ) : (
                      <div className="bg-white border rounded-2xl p-12 text-center text-slate-500 max-w-lg mx-auto mt-10 shadow-sm animate-fade-in">
                        <span className="text-4xl block mb-4">🔒</span>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Workspace Settings Restricted</h3>
                        <p className="text-[10px] mt-1.5 leading-relaxed text-gray-500">Workspace settings and core system switches are restricted with ABAC permissions to <strong className="text-[#3B6D11]">Super Admin</strong>. Elevate role below to view or manage setting profiles.</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 11.5: PROFILE & ORDERS TRACKING */}
        {routePath === '#profile' && (
          <div className="py-12 px-4 md:px-8 lg:px-12 bg-white max-w-7xl mx-auto animate-fade-in text-slate-800">
            {/* Header info card */}
            <div className="bg-gradient-to-br from-[#2b3a30] to-[#1b251f] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
              
               <div className="flex items-center gap-3.5 sm:gap-5 relative z-10 min-w-0 flex-1">
                {/* PROFILE AVATAR WITH PHOTO UPLOADER */}
                <div className="relative group shrink-0">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-4 border-white/20 shadow-md object-cover transition-transform group-hover:scale-105 duration-200 bg-white" 
                      alt="Grower Profile" 
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#c2dd74] text-[#1b3322] flex items-center justify-center font-black text-xl sm:text-2.5xl border-4 border-white/20 shadow-md uppercase">
                      {(currentUser?.name || editName || 'Alok')[0]}
                    </div>
                  )}
                  {/* Small trigger Camera Badge */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -right-0.5 -bottom-0.5 w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full bg-[#1b3322] border-2 border-white text-[#c2dd74] flex items-center justify-center hover:bg-[#c2dd74] hover:text-[#1b3322] transition-colors shadow-md cursor-pointer text-[10px] sm:text-xs"
                    title="Change Profile Photo"
                    type="button"
                  >
                    <Camera className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white leading-tight break-words">
                      {currentUser?.name || editName || 'Alok Patel'}
                    </h1>
                    {!currentUser && (
                      <span className="bg-amber-500/20 text-amber-300 text-[8px] sm:text-[9.5px] uppercase font-black px-1.5 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                        Demo Sandbox
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/70 mt-1 break-all max-w-full truncate" title={currentUser?.email || editEmail || 'alok.patel@agrimail.in'}>
                    {currentUser?.email || editEmail || 'alok.patel@agrimail.in'}
                  </p>
                  <div className="text-[9.5px] sm:text-[11px] text-white/95 font-medium mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#c2dd74]" />
                      <span>State: <strong className="font-bold text-white">{currentUser?.location || editLocation || 'Maharashtra'}</strong></span>
                    </span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>Crop: <strong className="font-bold text-white">{currentUser?.cropType || editCropType || 'Vegetables & Herbs'}</strong></span>
                    </span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>Scale: <strong className="font-bold text-white">{currentUser?.landSize || editLandSize || 'Backyard (5-10 Pots)'}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                {!currentUser ? (
                  <a href="#auth" className="bg-[#c2dd74] text-[#1b3322] text-xs font-black px-4.5 py-3 rounded-xl hover:bg-white transition-all shadow-md uppercase tracking-wider">
                    Sign in to Account
                  </a>
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-all"
                  >
                    Exit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Total Purchases</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">{orders.length}</span>
              </div>
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Active Deliveries</span>
                <span className="text-2xl font-extrabold text-amber-600 block mt-1">
                  {orders.filter(o => o.status !== 'Delivered').length}
                </span>
              </div>
              <div className="bg-[#c2dd74]/10 border border-[#c2dd74]/30 p-5 rounded-2xl">
                <span className="text-[10px] text-[#2b3a30] font-extrabold block uppercase tracking-wider">Arrived Safely</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">
                  {orders.filter(o => o.status === 'Delivered').length}
                </span>
              </div>
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">AgriPoints Balance</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">
                  {orders.reduce((acc, curr) => acc + Math.floor(curr.total / 10), 0) + 180} pts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* EDITABLE FORM SIDEBAR */}
              <div className="lg:col-span-5 bg-[#fcfbf7] border border-[#e2e1d7] rounded-3xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center space-x-2.5 mb-5 border-b pb-4 border-[#e2e1d7]">
                  <div className="w-8 h-8 rounded-full bg-[#1b3322] flex items-center justify-center text-white shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1b3322] tracking-tight">Grower Profile Settings</h3>
                    <p className="text-[10px] text-gray-400">Modify information metrics displayed in your agricultural logs.</p>
                  </div>
                </div>

                <form onSubmit={saveUserProfile} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Grower Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="e.g. Alok Patel" 
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-agri-lime" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      placeholder="you@example.com" 
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-agri-lime" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Phone / WhatsApp Number</label>
                    <input 
                      type="tel" 
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      placeholder="e.g. 9845012345" 
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-agri-lime" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Indian State / Location</label>
                    <input 
                      type="text" 
                      value={editLocation}
                      onChange={e => setEditLocation(e.target.value)}
                      placeholder="e.g. Maharashtra" 
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1b3322]" 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Crop focus</label>
                      <select 
                        value={editCropType}
                        onChange={e => setEditCropType(e.target.value)}
                        className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none"
                      >
                        <option value="Vegetables & Herbs">Vegetables & Herbs</option>
                        <option value="Flowering & Roses">Flowering & Roses</option>
                        <option value="Organic Farm crops">Organic Farm crops</option>
                        <option value="Roof-Garden & Pots">Roof-Garden & Pots</option>
                        <option value="Fruit Orchards">Fruit Orchards</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Cultivation scale</label>
                      <select 
                        value={editLandSize}
                        onChange={e => setEditLandSize(e.target.value)}
                        className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none"
                      >
                        <option value="Backyard (1-5 Pots)">Backyard (1-5 Pots)</option>
                        <option value="Terrace (5-20 Pots)">Terrace (5-20 Pots)</option>
                        <option value="Small Farm (0.5-2 Acres)">Small Farm (0.5-2 Acres)</option>
                        <option value="Medium (2-10 Acres)">Medium (2-10 Acres)</option>
                        <option value="Commercial Land">Commercial Land</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1b3322] hover:bg-black text-white hover:text-agri-lime font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider mt-2 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Save grower settings</span>
                  </button>
                </form>

                <div className="mt-5 bg-[#c2dd74]/15 border border-[#c2dd74]/30 rounded-2xl p-4 text-[10px] text-gray-600 leading-normal">
                  <span className="font-extrabold text-[#1b3322] block mb-1">🌱 Verified Diagnostics</span>
                  All mineral evaluations, diagnostic Soil Test™ logs, and temperature-controlled crop dispatch routes are protected under soil cybersecurity protocols.
                </div>
              </div>

              {/* ORDERS FEED LIST */}
              <div className="lg:col-span-7 space-y-6">
                {/* Orders Section Head */}
                <div className="border-b pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                      <Package className="w-5 h-5 text-[#2b3a30] shrink-0" />
                      <span>My Active & Historical Orders</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-normal">Real-time dynamic transit checkpoints for formulation dispatch logs.</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#c2dd74] bg-[#2b3a30] px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Live Feed
                  </span>
                </div>

                {/* Orders Stack */}
                {orders.length === 0 ? (
                  <div className="text-center py-16 border rounded-3xl bg-slate-50 border-dashed">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Build your soil health list, add recipes to cart, and checkout to view active statuses here.</p>
                    <a href="#products" className="btn-primary inline-block mt-4 text-xs font-black uppercase">Browse Shop</a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      return (
                        <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-200">
                          
                          {/* Top Order Row */}
                          <div className="bg-slate-50/80 px-4 sm:px-5 py-4 border-b border-gray-150 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">ID</span>
                                <span className="font-extrabold text-xs sm:text-sm text-slate-800">#{order.id}</span>
                              </div>
                              <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Ordered On</span>
                                <span className="text-xs font-bold text-slate-700">{order.date}</span>
                              </div>
                              <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Invoice Amount</span>
                                <span className="text-xs font-extrabold text-slate-800 font-mono">₹{order.total}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button 
                                title="Simulate step transitions"
                                onClick={() => {
                                  const nextStatusMap: Record<string, 'Processing' | 'In-Transit' | 'Delivered'> = {
                                    'Processing': 'In-Transit',
                                    'In-Transit': 'Delivered',
                                    'Delivered': 'Processing'
                                  };
                                  const nextStatus = nextStatusMap[order.status];
                                  setOrders(orders.map(o => o.id === order.id ? { ...o, status: nextStatus } : o));
                                  showToastMsg(`Demo order status upgraded to: ${nextStatus}`);
                                }}
                                className="text-[10px] bg-white hover:bg-slate-100 text-slate-800 font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 transition shrink-0 flex items-center space-x-1 shadow-sm cursor-pointer"
                              >
                                <span>🔄 Upgrade Status</span>
                              </button>

                              <button 
                                type="button"
                                title="Generate custom invoice template"
                                onClick={() => {
                                  setInvoiceModalOrder(order);
                                  setInvoiceEmailType('visual');
                                }}
                                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1.5 rounded-lg border border-emerald-200/50 transition shrink-0 flex items-center space-x-1 shadow-sm cursor-pointer"
                              >
                                <Mail className="w-3 h-3 text-emerald-800" />
                                <span>✉️ Send Invoice</span>
                              </button>
                            </div>
                          </div>

                          <div className="p-4 sm:p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                            {/* Status tracker steps */}
                            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-gray-150 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-center">
                              <span className="text-[10px] font-bold text-gray-400 block mb-5 uppercase tracking-wider">Live Delivery Milestones</span>
                              
                              {/* Steps tracker UI */}
                              <div className="relative flex items-center justify-between w-full px-2 sm:px-4">
                                
                                {/* Connector bar background */}
                                <div className="absolute top-4.5 left-6 sm:left-8 right-6 sm:right-8 h-1 bg-gray-200 -z-10 rounded-full" />
                                
                                {/* Connector bar active fill */}
                                <div 
                                  className="absolute top-4.5 left-6 sm:left-8 h-1 bg-[#2b3a30] -z-10 rounded-full transition-all duration-500" 
                                  style={{ 
                                    width: order.status === 'Processing' ? '0%' : order.status === 'In-Transit' ? '50%' : '100%' 
                                  }}
                                />

                                {/* Milestone 1 : Processing */}
                                <div className="flex flex-col items-center">
                                  <div 
                                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                      order.status === 'Processing'
                                        ? 'bg-amber-50 border-amber-600 text-amber-700 font-bold ring-4 ring-amber-100 scale-105 shadow-md'
                                        : 'bg-[#2b3a30] border-[#2b3a30] text-[#c2dd74]'
                                    }`}
                                  >
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] sm:text-[11px] font-bold mt-2 text-center text-slate-800">Processing</span>
                                  <span className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">Scanned</span>
                                </div>

                                {/* Milestone 2 : In-Transit */}
                                <div className="flex flex-col items-center">
                                  <div 
                                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                      order.status === 'In-Transit'
                                        ? 'bg-amber-50 border-amber-600 text-amber-700 ring-4 ring-amber-100 scale-105 shadow-md'
                                        : order.status === 'Delivered'
                                          ? 'bg-[#2b3a30] border-[#2b3a30] text-[#c2dd74]'
                                          : 'bg-white border-gray-200 text-gray-350'
                                    }`}
                                  >
                                    <Truck className="w-4.5 h-4.5" />
                                  </div>
                                  <span className={`text-[10px] sm:text-[11px] font-bold mt-2 text-center ${
                                    order.status === 'Processing' ? 'text-gray-400' : 'text-slate-800'
                                  }`}>In Transit</span>
                                  <span className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">Underway</span>
                                </div>

                                {/* Milestone 3 : Delivered */}
                                <div className="flex flex-col items-center">
                                  <div 
                                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                      order.status === 'Delivered'
                                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold ring-4 ring-emerald-100 scale-105 shadow-md'
                                        : 'bg-white border-gray-200 text-gray-350'
                                    }`}
                                  >
                                    <CheckCircle className="w-4.5 h-4.5" />
                                  </div>
                                  <span className={`text-[10px] sm:text-[11px] font-bold mt-2 text-center ${
                                    order.status !== 'Delivered' ? 'text-gray-400' : 'text-slate-800'
                                  }`}>Delivered</span>
                                  <span className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">Arrived</span>
                                </div>

                              </div>

                              {/* Extra status report banner */}
                              <div className="mt-8 bg-[#f7f6ee]/85 p-4 rounded-xl border border-gray-150 flex items-start space-x-3 text-xs leading-normal">
                                <span className="text-base shrink-0 mt-0.5">
                                  {order.status === 'Processing' ? '⚙️' : order.status === 'In-Transit' ? '🚚' : '📦'}
                                </span>
                                <div>
                                  <p className="font-extrabold text-[#1b3322]">
                                    {order.status === 'Processing' && 'Formulation and raw-ingredient testing checks are active. Bagged and sealed.'}
                                    {order.status === 'In-Transit' && 'En-route past central transport corridors. Expected delivery in 32 Hours.'}
                                    {order.status === 'Delivered' && 'Checkpoints clear. Delivery verified successfully.'}
                                  </p>
                                  <p className="text-[11px] text-gray-400 mt-1">
                                    Ship destination: <strong className="text-gray-700 font-semibold">{order.address}</strong>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Order item lists */}
                            <div className="lg:col-span-5 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold text-gray-400 block mb-3 uppercase tracking-wider">Formulation Breakdown</span>
                                <div className="space-y-3 max-h-68 overflow-y-auto pr-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-gray-150 rounded-xl p-3.5 space-y-2.5 transition hover:bg-slate-100/70">
                                      <div className="flex items-start space-x-3.5 min-w-0">
                                        <img src={item.img || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80'} className="w-11 h-11 object-cover rounded-lg bg-white p-0.5 border shrink-0 shadow-sm" alt={item.name} />
                                        <div className="min-w-0 flex-1">
                                          <span className="text-xs font-black text-slate-800 block truncate leading-snug">{item.name}</span>
                                          <p className="text-[9px] text-gray-400 mt-0.5 font-mono">ID: {item.productId}</p>
                                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            <span className="bg-[#1b3322]/10 text-[#1b3322] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase font-sans">
                                              ₹{item.price}/bag
                                            </span>
                                            <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase font-sans">
                                              {item.qty} dispatch bags
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-xs font-extrabold text-slate-950 block font-mono">₹{item.price * item.qty}</span>
                                        </div>
                                      </div>
                                      
                                      {/* GROWER QUANTITY SUMMARY FOOTPRINT */}
                                      <div className="border-t border-dashed border-gray-200 pt-2 flex items-center justify-between text-[10px] text-gray-500 font-semibold gap-1">
                                        <span>⚖️ Total Batch dispatch mass:</span>
                                        <span className="text-slate-800 font-bold font-mono">
                                          {(item.qty * 1.5).toFixed(1)} Kg Formulation
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-5 pt-3.5 border-t border-gray-150/80 flex justify-between items-center text-xs">
                                <span className="capitalize font-bold text-slate-500">Method: {order.paymentMethod.toUpperCase()}</span>
                                <span className="text-[10px] text-gray-400 italic">Signature scan on record</span>
                              </div>
                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick reference block */}
            <div className="mt-12 bg-[#2b3a30] text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#c2dd74] uppercase tracking-wide">Need Delivery Interventions?</h4>
                <p className="text-xs text-white/70 leading-normal">Our organic dispatches are temperature-controlled. Contact regional helpline for reroutes.</p>
              </div>
              <a href="#contact" className="bg-[#c2dd74] text-[#1b3322] hover:bg-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shadow-sm text-center">
                Contact Desk
              </a>
            </div>

          </div>
        )}

        {/* VIEW 12: PRIVACY POLICY */}
        {routePath === '#privacy' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto text-gray-700 leading-relaxed text-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="mb-4">Last Updated: June 17, 2026</p>
            <p className="mb-4">
              At Agriic Solutions Pvt. Ltd., we understand that information regarding crop coordinates, chemical soil composition ranges, and direct address identifiers are extremely private. We secure all diagnostic findings to guarantee soil baseline security.
            </p>
            <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Collected Metrics</h3>
            <p className="mb-4">
              We collect information provided explicitly by you—including crop variants, symptoms entered into the quiz module, address parameters, contact emails, and card transaction tokens processed securely via our bank gateways.
            </p>
          </div>
        )}

        {/* VIEW 13: TERMS */}
        {routePath === '#terms' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto text-gray-700 leading-relaxed text-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
            <p className="mb-4">Last Updated: June 17, 2026</p>
            <p className="mb-4">
              By accessing the Agriic website and taking the Soil Test™ diagnostic, you agree to be bound by standard state rules and the following guidelines.
            </p>
            <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Formulation Intent & Claims</h3>
            <p className="mb-4">
              Our organic mixtures are created using carefully researched plant compounds. Outcomes depend significantly on moisture levels, regional seasonal changes, local insect pressures, and potting structure. If soil shows zero recovery, use the contact advisor panel to apply our Money-Back guidelines.
            </p>
          </div>
        )}

      </main>

      {/* Persistent Footer */}
      <footer className="bg-agri-dark text-white pt-10 pb-6 px-6 md:px-12 border-t border-[#bad15a]/10 relative z-30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          
          {/* Logo column */}
          <div className="space-y-3">
            <a href="#home" className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-agri-lime fill-agri-lime" />
              <span className="text-lg font-bold text-white tracking-widest font-display">Agriic<span className="text-agri-lime">.</span></span>
            </a>
            <p className="text-[11px] text-white/70 leading-relaxed max-w-xs font-normal">
              Science-led, Ayurveda-inspired organic nutrition blends customized for Indian soils. Securing sustainable crop harvests since 2019.
            </p>
            <div className="flex space-x-3 text-white/55 text-[10px] font-semibold pt-1">
              <span>Mumbai</span>•<span>GUJARAT</span>•<span>VAPI</span>
            </div>
          </div>

          {/* Nav quick links */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-[#bad15a] uppercase">Explore</h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-white/80">
              <a href="#home" className="hover:text-agri-lime transition">Home page</a>
              <a href="#products" className="hover:text-agri-lime transition">Product catalog</a>
              <a href="#science" className="hover:text-agri-lime transition">Scientific research</a>
              <a href="#soil-test" className="hover:text-agri-lime transition">Soil Test™ Quiz</a>
              <a href="#blog" className="hover:text-agri-lime transition">Growing Blog</a>
              <a href="#about" className="hover:text-agri-lime transition">Our journey</a>
            </div>
          </div>

          {/* Botanical support links */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-[#bad15a] uppercase">Support</h4>
            <div className="space-y-1.5 text-[11px] text-white/80">
              <a href="#contact" className="block hover:text-agri-lime transition">Direct Support request</a>
              <a href="https://wa.me/918047863601" target="_blank" rel="noopener" className="block hover:text-agri-lime transition">Chat on WhatsApp</a>
              <a href="#privacy" className="block hover:text-agri-lime transition">Privacy Policy</a>
              <a href="#terms" className="block hover:text-agri-lime transition">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] text-white/55 space-y-3 md:space-y-0">
          <p>© {new Date().getFullYear()} Agriic Solutions Private Limited. All mineral data secured.</p>
          <p className="text-white/70">
            Made by <a href="https://vexoritsolutions.site" target="_blank" rel="noopener noreferrer" className="text-agri-lime font-bold hover:underline tracking-wide hover:text-white transition-colors">VEXOR IT SOLUTIONS</a>
          </p>
          <p className="text-white/45">Unit 101, B Wing, Off Link Road, Malad West, Mumbai, MH - 400064</p>
        </div>
      </footer>

      {/* INVOICE MODAL SYSTEM */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 bg-[#1b261f]/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="invoice-modal">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-150 flex flex-col my-8">
            {/* Modal Header */}
            <div className="bg-[#2b3a30] text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🧾</span>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-[#c2dd74]">Grower Order Invoice Dispatch</h3>
                  <p className="text-[10px] text-white/70">Secure PDF Summary & Automation Template Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setInvoiceModalOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white text-sm font-bold cursor-pointer"
                title="Dismiss View"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Inner Tabs navigation */}
            <div className="border-b border-gray-200 bg-slate-50 p-2 flex space-x-2">
              <button
                type="button"
                onClick={() => setInvoiceEmailType('visual')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                  invoiceEmailType === 'visual'
                    ? 'bg-white text-[#1b3322] shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                🖼️ Beautiful Visual Preview
              </button>
              <button
                type="button"
                onClick={() => setInvoiceEmailType('code')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                  invoiceEmailType === 'code'
                    ? 'bg-white text-[#1b3322] shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-slate-800'
                }`}
              >
                💻 Raw email HTML layout
              </button>
            </div>

            {/* Tab content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-50/50">
              {invoiceEmailType === 'visual' ? (
                /* GORGEOUS DESIGN WITH DYNAMIC FIELDS */
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-inner relative space-y-6">
                  {/* Paid Watermark Banner */}
                  <div className="absolute right-6 top-6 border-4 border-emerald-600/30 text-emerald-600 text-[11px] font-black uppercase px-2.5 py-1 rounded-lg transform rotate-12 scale-105 select-none pointer-events-none">
                    🇮🇳 INVOICE PAID
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Leaf className="w-5 h-5 text-emerald-700 fill-emerald-600" />
                        <span className="font-black text-sm tracking-widest text-[#1b3322]">Agriic.</span>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">Science-Led Botanical Nutrition Solutions</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Invoice ID</span>
                      <span className="text-xs font-black text-slate-800 font-mono">#{invoiceModalOrder.id}</span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Metadata info */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Grower Details</span>
                      <strong className="text-slate-800 font-semibold block mt-0.5">{currentUser?.name || 'Registered Grower'}</strong>
                      <span className="text-gray-500 text-[10px] block mt-0.5">Phone: {currentUser?.phone || 'Not Specified'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Dispatch Details</span>
                      <span className="text-slate-800 font-semibold block mt-0.5">Ordered On: {invoiceModalOrder.date}</span>
                      <span className="text-gray-500 text-[10px] block mt-0.5">Method: {invoiceModalOrder.paymentMethod.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-[#f7f6ee]/70 p-3 rounded-xl border border-yellow-200/40 text-xs">
                    <span className="text-[9px] font-bold text-amber-900/60 uppercase block">Ship To Address</span>
                    <p className="text-slate-700 font-semibold mt-1">{invoiceModalOrder.address}</p>
                  </div>

                  {/* Line itemized breakdown table */}
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase mb-2 font-display">Formulation Items</span>
                    <div className="space-y-1.5">
                      {invoiceModalOrder.items.map((item, idy) => (
                        <div key={idy} className="flex justify-between items-center text-xs border-b border-gray-100 pb-1.5 pt-0.5">
                          <div>
                            <span className="font-extrabold text-slate-800 block">{item.name}</span>
                            <span className="text-[10px] text-gray-400">Qty: {item.qty} bag(s) • Weight: {(item.qty * 1.5).toFixed(1)} Kg</span>
                          </div>
                          <span className="font-mono font-bold text-slate-800">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fees footer summary */}
                  <div className="border-t border-gray-100 pt-3 flex flex-col items-end text-xs space-y-1.5 text-right font-display">
                    <div className="flex justify-between w-48 text-gray-500">
                      <span>Itemized Subtotal:</span>
                      <span className="font-mono">₹{invoiceModalOrder.total}</span>
                    </div>
                    <div className="flex justify-between w-48 text-[#1b3322] font-black text-sm border-t border-dashed border-gray-200 pt-1.5">
                      <span>Grand Total:</span>
                      <span className="font-mono text-slate-900">₹{invoiceModalOrder.total}</span>
                    </div>
                  </div>

                  {/* Digital signatures */}
                  <div className="border-t border-slate-100 pt-3 justify-between items-center flex text-[9px] text-gray-400">
                    <span>AGRIIC SECURE RECEIPT PROMPT</span>
                    <span className="italic font-mono">Authorized System stamp OK • 2026</span>
                  </div>
                </div>
              ) : (
                /* CODE GENERATOR SOURCE BLOCK FOR GROWERS WITH PRETTY COPY & DESCRIPTIONS */
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-blue-800 text-[11px] leading-normal font-sans">
                    💡 <strong>Grower system email template:</strong> This pristine responsive HTML template uses clean system styles and is pre-configured for dispatch via standard mail delivery agents.
                  </div>
                  <pre className="bg-slate-900 text-teal-400 p-4 rounded-xl text-[11px] font-mono overflow-auto max-h-72 select-all border border-slate-950/45">
                    {generateEmailTemplate(invoiceModalOrder)}
                  </pre>
                  <p className="text-[10px] text-gray-400 text-right">💡 Double click the raw input text container to select all HTML code fast.</p>
                </div>
              )}
            </div>

            {/* Action buttons footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-gray-150 flex flex-wrap justify-between items-center gap-3">
              {/* Copy action */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateEmailTemplate(invoiceModalOrder));
                  showToastMsg("Success! Professional HTML Invoice Code copied to clipboard!");
                }}
                className="bg-slate-250 text-slate-800 hover:bg-slate-350 text-[11px] font-black py-2 md:py-2.5 px-3.5 rounded-xl transition cursor-pointer"
              >
                📋 Copy HTML Source Code
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    showToastMsg("Simulated invoice print spooling initiated.");
                    window.print();
                  }}
                  className="bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 text-[11px] font-extrabold py-2 md:py-2.5 px-3 rounded-xl transition cursor-pointer"
                >
                  🖨️ Print Dispatch Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToastMsg(`Email summary generated and successfully dispatched payload via simulated SMTP gateway to ${currentUser?.email || 'registered grower'}!`);
                    setInvoiceModalOrder(null);
                  }}
                  className="bg-[#1b3322] hover:bg-[#2b3a30] text-[#c2dd74] text-[11px] font-black py-2 md:py-2.5 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1"
                >
                  <Mail className="w-3.5 h-3.5 mr-0.5 text-agri-lime" />
                  <span>📬 Dispatch via Simulated SMTP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
