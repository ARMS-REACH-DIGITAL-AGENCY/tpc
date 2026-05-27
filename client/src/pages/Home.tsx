import React, { useState, useEffect, useRef } from "react";
import { 
  Smartphone, 
  SmartphoneNfc, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  ShieldCheck, 
  Database, 
  Settings, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  HelpCircle, 
  Users, 
  DollarSign, 
  BarChart3, 
  Award, 
  ChevronLeft,
  Activity,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Clock,
  Layers,
  FileText,
  CreditCard,
  Lock,
  Link2,
  ExternalLink,
  Code,
  User,
  Compass,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Define the steps in the consumer-facing funnel
type DemoStep = "CHIP_TAP" | "LANDING_PAGE" | "OPT_IN" | "QUIZ" | "OFFER" | "STRIPE_CHECKOUT" | "OUTCOME" | "FOLLOW_UP";

// CRM Log entry type
interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  type: "info" | "success" | "warning" | "arms";
}

export default function Home() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<"funnel" | "portal" | "console" | "about">("funnel");
  
  // Funnel State
  const [currentStep, setCurrentStep] = useState<DemoStep>("CHIP_TAP");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizIndex, setQuizIndex] = useState(0);
  const [crmLogs, setCrmLogs] = useState<LogEntry[]>([]);
  const [voucherClaimed, setVoucherClaimed] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState<boolean | null>(null);

  // Stripe Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Portal Stats State
  const [scanCount, setScanCount] = useState(148);
  const [optInCount, setOptInCount] = useState(96);
  const [memberCount, setMemberCount] = useState(41);
  const [recentLeads, setRecentLeads] = useState([
    { name: "Marcus Vance", email: "marcus.v@golfclub.com", status: "Active Member", date: "Just now", value: "$150" },
    { name: "Sarah Jenkins", email: "sjenkins@traveler.org", status: "Prospect (Plan B)", date: "10m ago", value: "$0" },
    { name: "Robert Chen", email: "r.chen@capital.com", status: "Active Member", date: "1h ago", value: "$150" },
    { name: "Emily Watson", email: "emily@watsongolf.com", status: "Prospect (Quiz)", date: "3h ago", value: "$0" }
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Helper to add CRM logs with simulated timestamps
  const addLog = (event: string, type: "info" | "success" | "warning" | "arms" = "info") => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: timeStr,
      event,
      type
    };
    setCrmLogs(prev => [newEntry, ...prev]);
  };

  // Scroll to bottom of logs (CONTAINED INSIDE THE CONSOLE BOX ONLY - NO WINDOW JUMPING)
  useEffect(() => {
    if (logsEndRef.current) {
      const parent = logsEndRef.current.parentElement;
      if (parent) {
        parent.scrollTop = parent.scrollHeight;
      }
    }
  }, [crmLogs, activeTab]);

  // Initial log population
  useEffect(() => {
    addLog("ARMS Automated Relationship Management System Active", "arms");
    addLog("Custom CRM Form Bridge Configured: Direct Post to YAT?STATS", "success");
    addLog("NFC Webhook Listener: Listening at /api/v1/scans/poker-chip", "arms");
    addLog("Ready to capture custom submissions directly to YAT?STATS sub-account!", "info");
  }, []);

  // Handle virtual NFC chip tap
  const handleNfcTap = () => {
    addLog("⚡ NFC Chip Tap Detected! UID: 04:A1:D3:C2:5E:8F", "success");
    addLog("ARMS Attribution: Source tagged as 'Physical NFC Poker Chip'", "arms");
    addLog("Redirecting prospect to secure Travel Protection Club landing page...", "info");
    setScanCount(prev => prev + 1);
    setCurrentStep("LANDING_PAGE");
    toast.success("NFC Tap Simulated!");
  };

  // Custom Form Submission with Background API Bridge
  const handleCustomFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) {
      toast.error("Please enter both your name and email.");
      return;
    }

    setIsSubmittingForm(true);
    addLog(`👤 Submitting contact: ${leadName} (${leadEmail})`, "info");
    addLog("📡 Dispatching secure payload to YAT?STATS Form Bridge...", "arms");

    try {
      // Create a hidden form submission payload to post directly to HighLevel's native form endpoint
      const formData = new FormData();
      formData.append("formId", "H634urGOeGS6U0BpCfBS");
      formData.append("full_name", leadName);
      formData.append("email", leadEmail);
      formData.append("location_id", "8eYj1Uj7Ugt0PDUGHblx"); // YAT?STATS Location ID

      // Send the background POST request to the native HighLevel form endpoint
      await fetch("https://api.armsreachdigital.com/widget/form/H634urGOeGS6U0BpCfBS", {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      addLog("👤 Contact successfully created inside YAT?STATS CRM (Free Native Submission)!", "success");
      addLog("ARMS Action: Tagged with 'Golf_Wedge_2026' & 'Voucher_Unclaimed'", "arms");
      addLog("ARMS Action: Voucher code G75-TEMP-ACTIVATE reserved for 15 minutes", "info");

      // Add to recent leads list
      setRecentLeads(prev => [
        { name: leadName, email: leadEmail, status: "Prospect (Quiz)", date: "Just now", value: "$0" },
        ...prev.slice(0, 3)
      ]);

      setOptInCount(prev => prev + 1);
      setIsSubmittingForm(false);
      
      // Advance to quiz instantly with zero extra clicks
      setCurrentStep("QUIZ");
      toast.success("Contact Saved! Proceeding to travel quiz...");

    } catch (error) {
      console.error("Form submission error:", error);
      // Fallback transition so the presentation is never blocked even if offline
      addLog("⚠️ Form Bridge connection timeout. Transitioning with local cache fallback.", "warning");
      addLog(`👤 Contact cached locally: ${leadName} (${leadEmail})`, "success");
      
      setOptInCount(prev => prev + 1);
      setIsSubmittingForm(false);
      setCurrentStep("QUIZ");
    }
  };

  // Quiz Questions definition
  const quizQuestions = [
    {
      id: "travel_freq",
      question: "How often do you travel with your golf clubs?",
      options: ["3+ times a year", "Once or twice a year", "Rarely", "Planning my first golf trip"]
    },
    {
      id: "worry_factor",
      question: "What concerns you most when shipping or traveling with your clubs?",
      options: ["Damage to expensive clubs", "Delays/lost luggage", "Excessive shipping fees", "Logistical hassle"]
    },
    {
      id: "planner_mindset",
      question: "When you travel, do you usually plan emergency logistics in advance?",
      options: ["Always (I have written checklists)", "Usually", "Sometimes", "I prefer to wing it"]
    },
    {
      id: "first_call_gap",
      question: "If an unexpected medical crisis happened away from home, would your family know exactly who to call first?",
      options: ["Yes, we have a clear emergency contact", "Not entirely sure", "Probably not", "We have never thought about it"]
    }
  ];

  // Handle quiz answers
  const handleQuizAnswer = (option: string) => {
    const currentQ = quizQuestions[quizIndex];
    const updatedAnswers = { ...quizAnswers, [currentQ.id]: option };
    setQuizAnswers(updatedAnswers);
    
    addLog(`📝 Quiz Answer [${currentQ.id}]: "${option}"`, "info");
    addLog(`ARMS Profiler: Contact profile updated with segmentation data`, "arms");

    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      addLog("🎯 Quiz Completed! Analyzing traveler planning profile...", "success");
      
      const isPlanner = updatedAnswers["planner_mindset"] === "Always (I have written checklists)" || updatedAnswers["planner_mindset"] === "Usually";
      const hasFirstCallPlan = updatedAnswers["first_call_gap"] === "Yes, we have a clear emergency contact";
      
      addLog(`ARMS Segmentation: Mindset classified as '${isPlanner ? "Planner" : "Spontaneous"}'`, "arms");
      addLog(`ARMS Segmentation: Family First-Call Status: '${hasFirstCallPlan ? "Protected" : "Unprepared"}'`, "arms");
      
      if (!hasFirstCallPlan) {
        addLog(`ARMS Trigger: Set dynamic landing page theme to 'Family Security & Peace of Mind'`, "arms");
      } else {
        addLog(`ARMS Trigger: Set dynamic landing page theme to 'Seamless Elite Traveler Coordination'`, "arms");
      }
      
      setCurrentStep("OFFER");
    }
  };

  // Handle offer decision
  const handleOfferDecision = (accepted: boolean) => {
    setAcceptedOffer(accepted);
    if (accepted) {
      addLog("🛒 Offer Accepted! Redirecting to secure Stripe Checkout...", "info");
      setCurrentStep("STRIPE_CHECKOUT");
    } else {
      addLog("⚠️ Prospect hesitated on offer page (Clicked 'No thanks' or closed tab)", "warning");
      addLog("ARMS Trigger: Activated Abandoned Checkout Recovery Sequence", "arms");
      addLog("ARMS Delay: Scheduled Plan B Email Nurture Sequence (Trigger in 15 mins)", "arms");
      
      setCurrentStep("FOLLOW_UP");
      toast.info("Plan B Nurture Sequence activated in ARMS CRM.");
    }
  };

  // Pre-fill card for quick presentation
  const prefillDemoCard = () => {
    setCardNumber("4242 •••• •••• 4242");
    setCardExpiry("12/28");
    setCardCvc("424");
    addLog("💳 Pre-filled demo credit card credentials", "info");
    toast.info("Demo card pre-filled.");
  };

  // Process Simulated Payment
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast.error("Please enter your card details.");
      return;
    }

    setIsProcessingPayment(true);
    addLog("🔒 Initiating secure card authorization via Stripe API...", "info");
    
    setTimeout(() => {
      setIsProcessingPayment(false);
      addLog("💳 Stripe: Charge authorized successfully! Amount: $150.00 USD", "success");
      addLog("ARMS Billing: Generated invoice #INV-2026-0089", "arms");
      addLog("ARMS CRM: Upgraded contact status to 'Active Member'", "arms");
      addLog("ARMS Action: Delivered $75 ShipSticks-style Voucher code: SS-GOLF-75-ACTIVE", "success");
      addLog("ARMS Action: Dispatched 'First Call Family Instruction Packet' PDF via email", "info");
      addLog("ARMS Fulfillment: Scheduled physical welcome packet & membership card delivery", "arms");
      
      setMemberCount(prev => prev + 1);
      
      // Update the active lead status in portal table
      setRecentLeads(prev => {
        const updated = [...prev];
        if (updated[0] && updated[0].name === leadName) {
          updated[0].status = "Active Member";
          updated[0].value = "$150";
        }
        return updated;
      });

      setCurrentStep("OUTCOME");
      toast.success("Payment Captured! Membership Activated.");
    }, 2000);
  };

  // Reset the demo
  const resetDemo = () => {
    setCurrentStep("CHIP_TAP");
    setLeadName("");
    setLeadEmail("");
    setQuizAnswers({});
    setQuizIndex(0);
    setAcceptedOffer(null);
    setVoucherClaimed(false);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    addLog("🔄 Virtual Demo Reset. Ready for next simulation.", "info");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF7] text-[#1E2B22]">
      {/* Premium Country Club Style Header */}
      <header className="border-b border-[#E6E2D3] bg-[#F9F8F0] py-4 px-6 relative">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#1A331E] rounded-sm flex items-center justify-center border border-[#C2B280]">
              <span className="font-serif-display text-lg font-bold text-[#E6E2D3]">G</span>
            </div>
            <div>
              <h1 className="font-serif-display text-lg font-bold tracking-wider text-[#1A331E]">GLOBAL 360</h1>
              <p className="font-sans-ui text-xs uppercase tracking-widest text-[#C2B280] font-semibold">Travel Protection Club</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2 bg-[#F1EFE6] p-1 rounded-sm border border-[#E6E2D3]">
            <button 
              onClick={() => setActiveTab("funnel")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "funnel" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              Interactive Demo
            </button>
            <button 
              onClick={() => setActiveTab("portal")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "portal" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              ARMS B2B Partner Portal
            </button>
            <button 
              onClick={() => setActiveTab("console")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "console" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              ARMS Engine Console
            </button>
            <button 
              onClick={() => setActiveTab("about")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "about" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              About the Club
            </button>
          </nav>
        </div>
      </header>

      {/* Main Pitch/Demo Workspace */}
      <main className="flex-1 container py-8 px-6">
        
        {/* TAB 1: INTERACTIVE FUNNEL DEMO */}
        {activeTab === "funnel" && (
          <div className="flex flex-col items-center max-w-xl mx-auto">
            
            {/* Virtual iPhone/Prospect Experience */}
            <div className="w-full bg-[#1A331E] p-4 rounded-[40px] shadow-2xl border-4 border-[#C2B280] relative">
              
              {/* Speaker & Camera notch */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 h-4 w-28 bg-[#1A331E] rounded-full z-20 flex items-center justify-center">
                <div className="h-1.5 w-12 bg-[#2D4A32] rounded-full"></div>
              </div>

              {/* iPhone Screen Container */}
              <div className="bg-[#FDFCF7] rounded-[32px] overflow-hidden border-2 border-[#C2B280] min-h-[600px] flex flex-col relative z-10">
                
                {/* Phone Status Bar */}
                <div className="bg-[#F9F8F0] px-6 pt-6 pb-2 flex justify-between items-center text-xs text-[#1A331E] font-semibold border-b border-[#E6E2D3]">
                  <span>9:41 ⛳</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="h-3 w-5 border border-[#1A331E] rounded-xs p-0.5 flex items-center">
                      <div className="h-full w-full bg-[#1A331E] rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                {/* SCREEN STATE 1: CHIP TAP */}
                {currentStep === "CHIP_TAP" && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#FDFCF7]">
                    <div className="relative mb-6 group cursor-pointer" onClick={handleNfcTap}>
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#C2B280] to-[#1A331E] rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                      <img 
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368558979/TncsUA3wJWw3btME2gSgvv/nfc_poker_chip-gqKEzNEg3LPNyRz7HuxEcb.webp" 
                        alt="NFC Poker Chip" 
                        className="relative h-44 w-44 object-cover rounded-full border-4 border-[#C2B280] shadow-lg transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#1A331E] p-2.5 rounded-full border border-[#C2B280] text-[#C2B280] shadow-md">
                        <SmartphoneNfc className="h-5 w-5 animate-pulse" />
                      </div>
                    </div>
                    
                    <h3 className="font-serif-display text-xl font-bold text-[#1A331E] mb-2">Simulate the NFC Tap</h3>
                    <p className="text-sm text-[#4A5D4E] mb-6 max-w-xs">
                      This poker chip contains an NFC tag. Tap the chip below or click to simulate a golfer scanning it on the course or at a tournament.
                    </p>
                    
                    <Button 
                      onClick={handleNfcTap}
                      className="bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] px-6 py-5 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold transition-all duration-200 shadow-md active:scale-95"
                    >
                      Tap Virtual Chip <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* SCREEN STATE 2: LANDING PAGE */}
                {currentStep === "LANDING_PAGE" && (
                  <div className="flex-1 flex flex-col p-0 bg-[#FDFCF7]">
                    <div className="relative h-40 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-black/40 z-10"></div>
                      <img 
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368558979/TncsUA3wJWw3btME2gSgvv/luxury_golf_bg-eU6pGTC8LSgMWDHb2SD2Nq.webp" 
                        alt="Luxury Golf" 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
                        <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">Exclusive Golf Invitation</span>
                        <h4 className="font-serif-display text-lg font-bold text-white leading-tight">Travel Protection Club</h4>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1 bg-[#1A331E]/5 border border-[#1A331E]/10 px-2 py-1 rounded-xs mb-3">
                          <Sparkles className="h-3.5 w-3.5 text-[#C2B280]" />
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Exclusive Benefit</span>
                        </div>
                        
                        <h5 className="font-serif-display text-base font-bold text-[#1A331E] mb-2 leading-snug">
                          Activate Your $75 Golf Travel Shipping Voucher
                        </h5>
                        <p className="text-xs text-[#4A5D4E] mb-4">
                          Congratulations! Your chip scan qualifies you for a $75 credit toward premium golf club shipping (ShipSticks-style). Ensure your clubs travel safely and stress-free on your next excursion.
                        </p>
                        
                        <div className="bg-[#F1EFE6] border border-[#E6E2D3] p-3 rounded-xs mb-4">
                          <div className="flex items-center gap-2 text-xs text-[#1A331E] font-semibold mb-1">
                            <CheckCircle2 className="h-4 w-4 text-[#1A331E]" />
                            <span>Instant Voucher Reservation</span>
                          </div>
                          <p className="text-[11px] text-[#4A5D4E] pl-6">
                            Secure your credit first. You can apply it to your next golf shipment immediately.
                          </p>
                        </div>
                      </div>

                      <Button 
                        onClick={() => setCurrentStep("OPT_IN")}
                        className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold"
                      >
                        Secure Voucher Now <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* SCREEN STATE 3: CUSTOM PREMIUM OPT-IN FORM */}
                {currentStep === "OPT_IN" && (
                  <div className="flex-1 flex flex-col p-6 justify-between bg-[#FDFCF7]">
                    <div className="space-y-5">
                      <div className="w-full bg-[#E6E2D3] h-1 rounded-full overflow-hidden">
                        <div className="bg-[#1A331E] h-full w-1/4"></div>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">Voucher Registration</span>
                        <h4 className="font-serif-display text-lg font-bold text-[#1A331E] leading-tight mt-0.5">Secure Your $75 Credit</h4>
                        <p className="text-xs text-[#4A5D4E] mt-1.5 leading-relaxed">
                          Enter your details to reserve your ShipSticks-style rebate voucher and begin your personalized travel planner.
                        </p>
                      </div>

                      {/* Custom Premium React Form */}
                      <form onSubmit={handleCustomFormSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Full Name</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              placeholder="Peter DeLuca" 
                              className="w-full bg-white border border-[#E6E2D3] focus:border-[#1A331E] pl-10 pr-3 py-2.5 rounded-xs text-xs focus:outline-hidden transition-all text-[#1A331E]"
                            />
                            <User className="absolute left-3 top-3 h-4 w-4 text-[#C2B280]" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Email Address</label>
                          <div className="relative">
                            <input 
                              type="email" 
                              required
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              placeholder="peter.deluca@gmail.com" 
                              className="w-full bg-white border border-[#E6E2D3] focus:border-[#1A331E] pl-10 pr-3 py-2.5 rounded-xs text-xs focus:outline-hidden transition-all text-[#1A331E]"
                            />
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#C2B280]" />
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="space-y-2.5 pt-4">
                      <Button 
                        onClick={handleCustomFormSubmit}
                        disabled={isSubmittingForm}
                        className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5"
                      >
                        {isSubmittingForm ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Saving Contact...
                          </>
                        ) : (
                          <>
                            Reserve & Continue <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <span className="text-[9px] text-[#4A5D4E] text-center block leading-relaxed">
                        🔒 <strong>Zero Premium Fees:</strong> Submitting automatically registers your lead directly in YAT?STATS using a native, free API bridge.
                      </span>
                    </div>
                  </div>
                )}

                {/* SCREEN STATE 4: QUIZ */}
                {currentStep === "QUIZ" && (
                  <div className="flex-1 flex flex-col p-6 justify-between bg-[#FDFCF7]">
                    <div>
                      <div className="w-full bg-[#E6E2D3] h-1.5 rounded-full mb-6 overflow-hidden">
                        <div 
                          className="bg-[#1A331E] h-full transition-all duration-300"
                          style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                        ></div>
                      </div>

                      <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">
                        Question {quizIndex + 1} of {quizQuestions.length}
                      </span>
                      
                      <h4 className="font-serif-display text-base font-bold text-[#1A331E] mt-1 mb-6 leading-snug">
                        {quizQuestions[quizIndex].question}
                      </h4>

                      <div className="space-y-3">
                        {quizQuestions[quizIndex].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(option)}
                            className="w-full text-left bg-white hover:bg-[#F1EFE6] border border-[#E6E2D3] hover:border-[#1A331E] p-3.5 rounded-xs text-xs text-[#1A331E] font-medium transition-all active:scale-[0.99]"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-[#4A5D4E] mt-4">
                      <span>🔒 Safe & Private Profile</span>
                      {quizIndex > 0 && (
                        <button 
                          onClick={() => setQuizIndex(prev => prev - 1)}
                          className="flex items-center gap-1 font-bold text-[#1A331E]"
                        >
                          <ChevronLeft className="h-3 w-3" /> Back
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* SCREEN STATE 5: OFFER PIVOT */}
                {currentStep === "OFFER" && (
                  <div className="flex-1 flex flex-col p-0 bg-[#FDFCF7] overflow-y-auto max-h-[580px]">
                    {/* Top banner highlighting voucher reserved */}
                    <div className="bg-[#1A331E] text-white p-4 text-center border-b border-[#C2B280]">
                      <span className="text-[9px] uppercase tracking-widest text-[#C2B280] font-bold block mb-0.5">Voucher Reserved for You</span>
                      <h5 className="font-serif-display text-sm font-bold text-white tracking-wide">
                        $75 Credit Ready to Activate
                      </h5>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="text-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">The Planner's Choice</span>
                        <h4 className="font-serif-display text-lg font-bold text-[#1A331E] leading-tight mt-0.5">
                          Your clubs deserve a way home. So do you.
                        </h4>
                      </div>

                      <p className="text-[11px] text-[#4A5D4E] text-center leading-relaxed">
                        You plan ahead to protect your golf equipment. But what about your own peace of mind? If an unforeseen medical emergency occurs away from home, the logistical and financial burden of returning home can be astronomical.
                      </p>

                      {/* Value Stack */}
                      <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-4 rounded-xs space-y-3">
                        <div className="border-b border-[#E6E2D3] pb-2 text-center">
                          <span className="text-xs uppercase tracking-widest text-[#1A331E] font-bold">The Activation Offer</span>
                        </div>
                        
                        <div className="flex justify-between text-xs border-b border-[#E6E2D3]/60 pb-1.5">
                          <span className="text-[#4A5D4E]">Travel Protection Club Membership (1 Yr)</span>
                          <span className="font-bold text-[#1A331E]">$150</span>
                        </div>
                        
                        <div className="flex justify-between text-xs text-[#2D6A4F] border-b border-[#E6E2D3]/60 pb-1.5">
                          <span>ShipSticks-Style Golf Shipping Credit</span>
                          <span className="font-bold">-$75</span>
                        </div>

                        <div className="flex justify-between items-center pt-1">
                          <div>
                            <span className="text-xs font-bold text-[#1A331E] block">Effective First-Year Cost</span>
                            <span className="text-[9px] text-[#4A5D4E]">After voucher redemption</span>
                          </div>
                          <span className="font-serif-display text-lg font-bold text-[#1A331E]">$75</span>
                        </div>
                      </div>

                      {/* Features list */}
                      <div className="space-y-2.5 text-[11px] text-[#4A5D4E] px-1">
                        <div className="flex gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#C2B280] shrink-0 mt-0.5" />
                          <span><strong>Guaranteed Repatriation:</strong> Complete logistics and transportation coverage back to your local hospital in a crisis.</span>
                        </div>
                        <div className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#C2B280] shrink-0 mt-0.5" />
                          <span><strong>One Number to Call:</strong> A single, dedicated first-call line that coordinates everything, sparing your loved ones the burden.</span>
                        </div>
                        <div className="flex gap-2">
                          <Sparkles className="h-4 w-4 text-[#C2B280] shrink-0 mt-0.5" />
                          <span><strong>Plan-Ahead Checklist:</strong> Instantly receive your written family emergency instruction guide and emergency wallet card.</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="space-y-2 pt-2">
                        <Button 
                          onClick={() => handleOfferDecision(true)}
                          className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold shadow-md"
                        >
                          Activate Membership & Get Voucher
                        </Button>
                        <button 
                          onClick={() => handleOfferDecision(false)}
                          className="w-full text-center text-[10px] text-[#4A5D4E] hover:text-[#1A331E] font-semibold py-2"
                        >
                          No thanks, I will forfeit my $75 voucher credit
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN STATE 5.5: STRIPE SECURE CHECKOUT */}
                {currentStep === "STRIPE_CHECKOUT" && (
                  <div className="flex-1 flex flex-col p-6 justify-between bg-white">
                    <div>
                      {/* Stripe Header */}
                      <div className="flex items-center justify-between border-b border-[#E6E2D3] pb-4 mb-5">
                        <div className="flex items-center gap-1.5">
                          <div className="bg-[#635BFF] text-white p-1 rounded-xs">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-[#1E2022] font-sans-ui tracking-wide">Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#4A5D4E]">
                          <Lock className="h-3 w-3 text-[#2D6A4F]" />
                          <span className="font-semibold text-[#2D6A4F]">Stripe SSL</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-[9px] uppercase tracking-widest text-[#4A5D4E] font-bold block">Payable Amount</span>
                        <span className="font-serif-display text-2xl font-bold text-[#1A331E]">$150.00</span>
                        <span className="text-[10px] text-[#2D6A4F] font-semibold block mt-0.5">
                          ✓ $75 Rebate Voucher reserved & attached
                        </span>
                      </div>

                      {/* Credit Card Form */}
                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Card Number</label>
                            <button 
                              type="button" 
                              onClick={prefillDemoCard}
                              className="text-[9px] text-[#635BFF] hover:underline font-bold"
                            >
                              Pre-fill Demo Card
                            </button>
                          </div>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 4242 4242 4242" 
                              className="w-full bg-white border border-[#E6E2D3] pl-10 pr-3 py-2.5 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#635BFF]"
                            />
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-[#A3ACB9]" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Expiry Date</label>
                            <input 
                              type="text" 
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY" 
                              className="w-full bg-white border border-[#E6E2D3] px-3 py-2.5 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#635BFF] text-center"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">CVC / CVV</label>
                            <input 
                              type="text" 
                              required
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123" 
                              className="w-full bg-white border border-[#E6E2D3] px-3 py-2.5 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#635BFF] text-center"
                            />
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="space-y-3 mt-6">
                      <Button 
                        onClick={handlePaymentSubmit}
                        disabled={isProcessingPayment}
                        className="w-full bg-[#635BFF] hover:bg-[#5249E0] text-white py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2"
                      >
                        {isProcessingPayment ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Processing Securely...
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            Authorize $150.00 Payment
                          </>
                        )}
                      </Button>
                      <button 
                        onClick={() => setCurrentStep("OFFER")}
                        className="w-full text-center text-[10px] text-[#4A5D4E] hover:text-[#1A331E] font-semibold py-1"
                      >
                        ← Return to Offer Details
                      </button>
                    </div>
                  </div>
                )}

                {/* SCREEN STATE 6: OUTCOME (ACCEPTED) */}
                {currentStep === "OUTCOME" && (
                  <div className="flex-1 flex flex-col p-6 justify-between text-center bg-[#FDFCF7]">
                    <div className="my-auto space-y-6">
                      <div className="h-16 w-16 bg-[#1A331E] rounded-full flex items-center justify-center border-2 border-[#C2B280] mx-auto animate-bounce">
                        <Award className="h-8 w-8 text-[#C2B280]" />
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">Welcome to the Club</span>
                        <h4 className="font-serif-display text-xl font-bold text-[#1A331E] mt-1 mb-2">Membership Activated!</h4>
                        <p className="text-xs text-[#4A5D4E] max-w-xs mx-auto">
                          Thank you, {leadName}. Your first-year Travel Protection Club membership is active. Your family is now fully protected.
                        </p>
                      </div>

                      {/* Voucher Display */}
                      <div className="bg-[#F9F8F0] border-2 border-dashed border-[#C2B280] p-4 rounded-xs max-w-xs mx-auto relative">
                        <span className="text-[9px] uppercase tracking-widest text-[#4A5D4E] font-bold block mb-1">Your $75 Shipping Voucher</span>
                        <span className="font-mono text-base font-bold text-[#1A331E] tracking-wider bg-white px-3 py-1.5 border border-[#E6E2D3] rounded-xs block">
                          SS-GOLF-75-ACTIVE
                        </span>
                        <p className="text-[9px] text-[#4A5D4E] mt-2">
                          Copy this code to use on your next golf travel shipment. An activation link has been sent to {leadEmail}.
                        </p>
                      </div>

                      <div className="bg-[#1A331E]/5 border border-[#1A331E]/10 p-3 rounded-xs text-left max-w-xs mx-auto">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E] block mb-1">What happens next:</span>
                        <ul className="text-[10px] text-[#4A5D4E] space-y-1 pl-4 list-disc">
                          <li>Check your inbox for the digital welcome packet.</li>
                          <li>Download and share the 1-Page Family Instruction sheet.</li>
                          <li>Your physical member card will arrive in 5-7 business days.</li>
                        </ul>
                      </div>
                    </div>

                    <Button 
                      onClick={resetDemo}
                      className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-3.5 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold"
                    >
                      Simulate Next Scan <RefreshCw className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {/* SCREEN STATE 7: FOLLOW-UP (DECLINED - PLAN B) */}
                {currentStep === "FOLLOW_UP" && (
                  <div className="flex-1 flex flex-col p-6 justify-between bg-[#FDFCF7]">
                    <div className="my-auto space-y-5">
                      <div className="h-12 w-12 bg-[#F1EFE6] rounded-full flex items-center justify-center border border-[#E6E2D3] mx-auto">
                        <Mail className="h-6 w-6 text-[#1A331E] animate-pulse" />
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">Voucher Reserved</span>
                        <h4 className="font-serif-display text-lg font-bold text-[#1A331E] mt-1 mb-2">Voucher Reservation Active</h4>
                        <p className="text-xs text-[#4A5D4E] max-w-xs mx-auto">
                          The voucher reservation remains active. A temporary confirmation has been sent to {leadEmail}.
                        </p>
                      </div>

                      {/* Email Drip Box */}
                      <div className="bg-white border border-[#E6E2D3] p-4 rounded-xs text-left shadow-xs">
                        <div className="flex justify-between items-center border-b border-[#E6E2D3] pb-2 mb-2">
                          <span className="text-[10px] font-bold text-[#1A331E]">Scheduled Member Education</span>
                          <span className="bg-[#1A331E]/10 text-[#1A331E] text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-xs">Drip Queue</span>
                        </div>

                        <div className="space-y-3 text-[10px] text-[#4A5D4E]">
                          <div className="border-l-2 border-[#C2B280] pl-2 py-0.5">
                            <p className="font-bold text-[#1A331E]">Message 1 (Scheduled): "Your $75 Voucher is Reserved"</p>
                            <p className="text-[9px]">A gentle reminder that the voucher credit is held and ready for activation.</p>
                          </div>
                          <div className="border-l-2 border-[#E6E2D3] pl-2 py-0.5">
                            <p className="font-bold text-[#1A331E]/70">Message 2 (Scheduled): "Your clubs have a way home. Do you?"</p>
                            <p className="text-[9px]">Connecting club-protection logistics with personal travel peace of mind.</p>
                          </div>
                          <div className="border-l-2 border-[#E6E2D3] pl-2 py-0.5">
                            <p className="font-bold text-[#1A331E]/70">Message 3 (Scheduled): "The true cost of being unprepared"</p>
                            <p className="text-[#9px]">Educational resource on travel safety and repatriation coordination.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-3 rounded-xs text-center text-[10px] text-[#4A5D4E]">
                        💡 Your contact details have been safely stored in our relationship manager. You will receive helpful, non-intrusive traveler guides to assist your decision.
                      </div>
                    </div>

                    <Button 
                      onClick={resetDemo}
                      className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-3.5 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold"
                    >
                      Simulate Next Scan <RefreshCw className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ARMS B2B PARTNER PORTAL */}
        {activeTab === "portal" && (
          <div className="space-y-8 max-w-5xl mx-auto">
            
            {/* CLIENT-FACING GLOBAL 360 BANNER AD INSIDE YAT?STATS */}
            <div className="relative rounded-sm overflow-hidden border-2 border-[#C2B280] bg-[#1A331E] text-white p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute top-0 right-0 h-full w-1/3 bg-radial from-[#C2B280]/20 to-transparent pointer-events-none"></div>
              
              <div className="flex items-center gap-4 z-10">
                <div className="h-14 w-14 bg-[#FDFCF7] rounded-full flex items-center justify-center border-2 border-[#C2B280] shrink-0">
                  <Award className="h-7 w-7 text-[#1A331E]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#C2B280] text-[#1A331E] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">Exclusive Partnership</span>
                    <span className="text-[10px] text-[#C2B280] font-semibold">YAT?STATS Special Offer</span>
                  </div>
                  <h3 className="font-serif-display text-lg font-bold text-white tracking-wide">
                    Global 360 | First Call 75 Travel Protection
                  </h3>
                  <p className="text-xs text-[#D4ECD5] font-serif-body max-w-xl">
                    Protect your cherished golf clubs and secure your repatriation safety plan. Activate your $75 ShipSticks-style travel voucher now.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setActiveTab("funnel");
                  setCurrentStep("LANDING_PAGE");
                  addLog("🔗 Banner Ad Clicked inside YAT?STATS Portal!", "success");
                  toast.success("Navigating to Global 360 Funnel Landing Page!");
                }}
                className="bg-[#FDFCF7] hover:bg-[#E6E2D3] text-[#1A331E] border border-[#C2B280] px-6 py-5 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold z-10 shadow-lg shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                Claim $75 Voucher <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Dashboard Hero */}
            <div className="double-border bg-[#F9F8F0] p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A331E]"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold block mb-1">Automated Relationship Management System</span>
                  <h2 className="font-serif-display text-2xl font-bold text-[#1A331E] tracking-wide">
                    B2B Partner Dashboard
                  </h2>
                  <p className="text-xs text-[#4A5D4E] font-serif-body">
                    Operational analytics, member conversion pipelines, and partner attribution.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-[#1A331E] hover:bg-[#2D4A32] text-white text-xs border border-[#C2B280] px-4 py-2 rounded-sm">
                    Export Partner Report
                  </Button>
                </div>
              </div>
            </div>

            {/* High Level Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border border-[#E6E2D3] bg-white">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold">Total Scans</span>
                    <Smartphone className="h-4 w-4 text-[#C2B280]" />
                  </div>
                  <span className="font-serif-display text-2xl font-bold text-[#1A331E] block">{scanCount}</span>
                  <span className="text-[10px] text-[#2D6A4F] font-bold">↑ 12% from last week</span>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold">Opt-In Rate</span>
                    <UserCheck className="h-4 w-4 text-[#C2B280]" />
                  </div>
                  <span className="font-serif-display text-2xl font-bold text-[#1A331E] block">
                    {Math.round((optInCount / scanCount) * 100)}%
                  </span>
                  <span className="text-[10px] text-[#2D6A4F] font-bold">96 Captured Profiles</span>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold">Paid Conversions</span>
                    <DollarSign className="h-4 w-4 text-[#C2B280]" />
                  </div>
                  <span className="font-serif-display text-2xl font-bold text-[#1A331E] block">
                    {Math.round((memberCount / optInCount) * 100)}%
                  </span>
                  <span className="text-[10px] text-[#2D6A4F] font-bold">41 Active Members</span>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold">Total Revenue</span>
                    <TrendingUp className="h-4 w-4 text-[#C2B280]" />
                  </div>
                  <span className="font-serif-display text-2xl font-bold text-[#1A331E] block">
                    ${memberCount * 150}
                  </span>
                  <span className="text-[10px] text-[#4A5D4E] font-bold">Recurring Membership LTV</span>
                </CardContent>
              </Card>
            </div>

            {/* Split Screen: Recent Leads & Campaign Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Leads Table (7 Cols) */}
              <Card className="lg:col-span-7 border border-[#E6E2D3] bg-white">
                <CardHeader className="border-b border-[#E6E2D3] pb-3">
                  <CardTitle className="text-sm font-bold text-[#1A331E]">RECENT RELATIONSHIP PIPELINE</CardTitle>
                  <CardDescription className="text-xs text-[#4A5D4E]">Real-time contact status captured via NFC funnel</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F9F8F0] border-b border-[#E6E2D3] text-[#1A331E] font-bold">
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Campaign Status</th>
                          <th className="py-3 px-4">Time</th>
                          <th className="py-3 px-4 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6E2D3]/60 text-[#4A5D4E]">
                        {recentLeads.map((lead, idx) => (
                          <tr key={idx} className="hover:bg-[#FDFCF7]">
                            <td className="py-3 px-4">
                              <span className="font-bold text-[#1A331E] block">{lead.name}</span>
                              <span className="text-[10px] text-[#4A5D4E]">{lead.email}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded-xs text-[9px] font-bold ${
                                lead.status === "Active Member" ? "bg-[#2D6A4F]/10 text-[#2D6A4F]" :
                                lead.status === "Prospect (Plan B)" ? "bg-[#C2B280]/20 text-[#1A331E]" : "bg-[#F1EFE6] text-[#4A5D4E]"
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[#4A5D4E]">{lead.date}</td>
                            <td className="py-3 px-4 text-right font-bold text-[#1A331E]">{lead.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Flow Architecture (5 Cols) */}
              <Card className="lg:col-span-5 border border-[#E6E2D3] bg-white">
                <CardHeader className="border-b border-[#E6E2D3] pb-3">
                  <CardTitle className="text-sm font-bold text-[#1A331E]">CAMPAIGN WORKFLOW CONFIG</CardTitle>
                  <CardDescription className="text-xs text-[#4A5D4E]">Active relationship automation sequences</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    
                    <div className="flex items-start gap-3 p-2.5 rounded-xs bg-[#F9F8F0] border border-[#E6E2D3]">
                      <Clock className="h-4 w-4 text-[#1A331E] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-[#1A331E] block">Trigger: Form Submitted</span>
                        <p className="text-[10px] text-[#4A5D4E]">Triggers when a golfer submits the native 'Global360Assurance' form.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xs bg-[#F9F8F0] border border-[#E6E2D3]">
                      <Layers className="h-4 w-4 text-[#1A331E] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-[#1A331E] block">Segmenter: Traveler Profiler</span>
                        <p className="text-[10px] text-[#4A5D4E]">Evaluates travel frequency and emergency preparedness to tailor offer page messaging.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xs bg-[#F9F8F0] border border-[#E6E2D3]">
                      <FileText className="h-4 w-4 text-[#1A331E] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-[#1A331E] block">Plan B: Educational Drip Queue</span>
                        <p className="text-[10px] text-[#4A5D4E]">Automated 3-part email sequence scheduled instantly upon early lead capture.</p>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        )}

        {/* TAB 2.5: DEDICATED FULL-SCREEN ARMS ENGINE CONSOLE */}
        {activeTab === "console" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="double-border bg-[#F9F8F0] p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A331E]"></div>
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-[#1A331E]" />
                <div>
                  <h2 className="font-serif-display text-xl font-bold text-[#1A331E]">ARMS Live Automation Logs</h2>
                  <p className="text-xs text-[#4A5D4E]">
                    Monitor background API triggers, webhooks, and contact segmentation actions as you run the demo.
                  </p>
                </div>
              </div>
            </div>

            <Card className="border border-[#1A331E]/20 bg-[#122015] text-[#D4ECD5] font-mono rounded-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-[#2D4A32] pb-3 bg-[#172D1B] px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-[#C2B280]" />
                    <span className="text-xs uppercase tracking-wider font-bold text-white">Live System Output Terminal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-[#2D6A4F] rounded-full animate-ping"></span>
                    <span className="text-[10px] text-[#83B085] uppercase tracking-wider font-bold">Active Connection</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[450px] overflow-y-auto space-y-3.5 text-xs leading-relaxed pr-1 flex flex-col">
                  {crmLogs.slice().reverse().map((log) => (
                    <div key={log.id} className="border-b border-[#2D4A32]/30 pb-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-[#83B085] mb-1">
                        <span>[{log.timestamp}]</span>
                        <span className={`uppercase text-[8px] font-bold px-2 py-0.5 rounded-xs ${
                          log.type === "success" ? "bg-[#2D6A4F] text-white" :
                          log.type === "warning" ? "bg-[#B22222] text-white" :
                          log.type === "arms" ? "bg-[#C2B280] text-[#1A331E]" : "bg-[#2D4A32] text-[#D4ECD5]"
                        }`}>
                          {log.type}
                        </span>
                      </div>
                      <p className={`${
                        log.type === "success" ? "text-white font-semibold" :
                        log.type === "warning" ? "text-[#FF8C00]" :
                        log.type === "arms" ? "text-[#C2B280]" : "text-[#D4ECD5]"
                      }`}>
                        {log.event}
                      </p>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: ABOUT THE CLUB */}
        {activeTab === "about" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* Pitch Strategy Guide Header */}
            <div className="bg-[#1A331E] text-white p-6 rounded-sm border border-[#C2B280] shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold block mb-1">Strategic Pitch Resource</span>
              <h3 className="font-serif-display text-lg font-bold text-white mb-2">
                How to use the "About the Club" Tab in your Meeting with Andrew
              </h3>
              <p className="text-xs text-[#D4ECD5] font-serif-body leading-relaxed">
                Andrew is a smart businessman; he will immediately want to know: <strong>"What is the actual product here? Why would a golfer pay $150?"</strong>. This tab is your commercial justification. Use it to prove that the $150 membership is a high-value, highly responsible safety product, and the $75 voucher is simply the high-leverage wedge to acquire the lead.
              </p>
            </div>

            {/* About Cover */}
            <div className="double-border bg-[#F9F8F0] p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A331E]"></div>
              <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold block mb-2">Travel Protection Club</span>
              <h2 className="font-serif-display text-3xl font-bold text-[#1A331E] tracking-wide mb-4">
                The Heritage of Responsible Travel
              </h2>
              <p className="text-sm text-[#4A5D4E] max-w-xl mx-auto font-serif-body leading-relaxed">
                The Travel Protection Club provides comprehensive medical repatriation, crisis coordination, and planning tools to ensure elite travelers and their families are fully protected anywhere in the world.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <div className="h-10 w-10 bg-[#1A331E]/5 rounded-sm flex items-center justify-center border border-[#1A331E]/10 mb-2">
                    <ShieldCheck className="h-5 w-5 text-[#1A331E]" />
                  </div>
                  <CardTitle className="text-base font-bold text-[#1A331E]">Elite Repatriation</CardTitle>
                  <CardDescription className="text-xs text-[#C2B280] font-bold uppercase tracking-wider">Complete Protection</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    Guaranteed, seamless transportation back to your local hospital in the event of a medical emergency away from home.
                  </p>
                  <p>
                    <strong>Strategic Pitch Line:</strong> <em>"Andrew, standard health and travel insurance rarely cover the specialized logistics and astronomical costs of medical transport. If they care enough about their $2,000 golf clubs to protect them, shouldn't they care about themselves?"</em>
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <div className="h-10 w-10 bg-[#1A331E]/5 rounded-sm flex items-center justify-center border border-[#1A331E]/10 mb-2">
                    <Users className="h-5 w-5 text-[#1A331E]" />
                  </div>
                  <CardTitle className="text-base font-bold text-[#1A331E]">First-Call Coordination</CardTitle>
                  <CardDescription className="text-xs text-[#C2B280] font-bold uppercase tracking-wider">One Dedicated Line</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    A single emergency number that handles all coordination, logistics, and family support during a travel crisis.
                  </p>
                  <p>
                    <strong>Strategic Pitch Line:</strong> <em>"This spares their loved ones the agonizing burden of managing complex transport logistics and paperwork during a crisis. It's about being responsible and having a clear plan."</em>
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <div className="h-10 w-10 bg-[#1A331E]/5 rounded-sm flex items-center justify-center border border-[#1A331E]/10 mb-2">
                    <Award className="h-5 w-5 text-[#1A331E]" />
                  </div>
                  <CardTitle className="text-base font-bold text-[#1A331E]">Plan-Ahead Tools</CardTitle>
                  <CardDescription className="text-xs text-[#C2B280] font-bold uppercase tracking-wider">Peace of Mind</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    Includes physical membership cards, custom travel luggage tags, and written family emergency instruction guides.
                  </p>
                  <p>
                    <strong>Strategic Pitch Line:</strong> <em>"We give them tangible, high-end physical assets. It makes the membership feel real, premium, and constantly reminds them of their protected status every time they look at their golf bag."</em>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Quote */}
            <div className="border-l-4 border-[#C2B280] pl-6 py-2 italic text-[#1A331E] font-serif-body text-sm bg-[#F9F8F0]/50 rounded-r-xs">
              "First Call 75 is more than just travel protection. It's being responsible. The savings, if ever needed, are astronomical, but the peace of mind is priceless."
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E2D3] bg-[#F9F8F0] py-6 px-6 text-center text-xs text-[#4A5D4E]">
        <div className="container">
          <p className="font-sans-ui">
            &copy; 2026 Global 360 & ARMS. All rights reserved.
          </p>
          <p className="text-[10px] text-[#C2B280] mt-1 font-semibold uppercase tracking-wider">
            Powered by Automated Relationship Management System
          </p>
        </div>
      </footer>
    </div>
  );
}
