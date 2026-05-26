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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Define the steps in the virtual live demo
type DemoStep = "CHIP_TAP" | "LANDING_PAGE" | "OPT_IN" | "QUIZ" | "OFFER" | "OUTCOME" | "FOLLOW_UP";

// CRM Log entry type
interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  type: "info" | "success" | "warning" | "arms";
}

export default function Home() {
  // Demo State
  const [currentStep, setCurrentStep] = useState<DemoStep>("CHIP_TAP");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizIndex, setQuizIndex] = useState(0);
  const [crmLogs, setCrmLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"strategy" | "demo" | "arms" | "pilot">("demo");
  const [voucherClaimed, setVoucherClaimed] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState<boolean | null>(null);
  const [simulatedTime, setSimulatedTime] = useState("0:00");
  const [scanCount, setScanCount] = useState(42);
  const [optInCount, setOptInCount] = useState(28);
  const [memberCount, setMemberCount] = useState(12);

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

  // Scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [crmLogs]);

  // Initial log population
  useEffect(() => {
    addLog("ARMS CRM Engine Initialized & Listening...", "arms");
    addLog("Source Campaign: 'First Call 75 Golf Wedge' active.", "info");
    addLog("NFC Webhook Listener: Registered at /api/v1/scans/poker-chip", "arms");
  }, []);

  // Handle virtual NFC chip tap
  const handleNfcTap = () => {
    addLog("⚡ NFC Chip Tap Detected! UID: 04:A1:D3:C2:5E:8F", "success");
    addLog("ARMS Attribution: Source tagged as 'Physical NFC Poker Chip - Event Launch'", "arms");
    addLog("Redirecting prospect to safe quiz landing page...", "info");
    setScanCount(prev => prev + 1);
    setCurrentStep("LANDING_PAGE");
    toast.success("NFC Tap Simulated Successfully!");
  };

  // Handle email/name capture (Opt-In)
  const handleOptInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) {
      toast.error("Please enter a name and email to secure your voucher.");
      return;
    }
    addLog(`👤 Lead Captured: ${leadName} (${leadEmail})`, "success");
    addLog(`ARMS Database: Created contact record with status 'Prospect'`, "arms");
    addLog(`ARMS Sequence: Tagged with 'Golf_Wedge_2026' & 'Voucher_Unclaimed'`, "arms");
    addLog(`ARMS Action: Voucher code G75-TEMP-ACTIVATE reserved for 15 minutes`, "info");
    setOptInCount(prev => prev + 1);
    setCurrentStep("QUIZ");
    toast.success("Voucher Reserved! Let's complete the quick travel planner profile.");
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
      // Quiz complete - calculate segmentation
      addLog("🎯 Quiz Completed! Analyzing traveler planning profile...", "success");
      
      const isPlanner = updatedAnswers["planner_mindset"] === "Always (I have written checklists)" || updatedAnswers["planner_mindset"] === "Usually";
      const hasFirstCallPlan = updatedAnswers["first_call_gap"] === "Yes, we have a clear emergency contact";
      
      addLog(`ARMS Segmentation: Mindset classified as '${isPlanner ? "Planner (High Value)" : "Spontaneous"}'`, "arms");
      addLog(`ARMS Segmentation: Family First-Call Status: '${hasFirstCallPlan ? "Protected" : "Unprepared (Vulnerable)"}'`, "arms");
      
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
      addLog("💳 Membership Purchased! $150 transaction authorized.", "success");
      addLog("ARMS Billing: Generated invoice #INV-2026-0089", "arms");
      addLog("ARMS CRM: Upgraded contact status to 'Active Member'", "arms");
      addLog("ARMS Action: Delivered $75 ShipSticks-style Voucher code: SS-GOLF-75-ACTIVE", "success");
      addLog("ARMS Action: Dispatched 'First Call Family Instruction Packet' PDF via email", "info");
      addLog("ARMS Fulfillment: Scheduled physical welcome packet & membership card delivery", "arms");
      setMemberCount(prev => prev + 1);
      setCurrentStep("OUTCOME");
      toast.success("Membership Activated! $75 Voucher delivered.");
    } else {
      addLog("⚠️ Prospect hesitated on offer page (Clicked 'No thanks' or closed tab)", "warning");
      addLog("ARMS Trigger: Activated Abandoned Checkout Recovery Sequence", "arms");
      addLog("ARMS Delay: Scheduled Plan B Email Nurture Sequence (Trigger in 15 mins)", "arms");
      setCurrentStep("FOLLOW_UP");
      toast.info("Plan B Nurture Sequence activated in ARMS CRM.");
    }
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
              <p className="font-sans-ui text-xs uppercase tracking-widest text-[#C2B280] font-semibold">Pitch & Live Demo Deck</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2 bg-[#F1EFE6] p-1 rounded-sm border border-[#E6E2D3]">
            <button 
              onClick={() => setActiveTab("demo")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "demo" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              Live Demo
            </button>
            <button 
              onClick={() => setActiveTab("strategy")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "strategy" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              Strategy Deck
            </button>
            <button 
              onClick={() => setActiveTab("arms")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "arms" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              ARMS Engine
            </button>
            <button 
              onClick={() => setActiveTab("pilot")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all ${activeTab === "pilot" ? "bg-[#1A331E] text-white shadow-xs" : "text-[#1A331E] hover:bg-[#E6E2D3]"}`}
            >
              Pilot Plan
            </button>
          </nav>
        </div>
      </header>

      {/* Main Pitch/Demo Workspace */}
      <main className="flex-1 container py-8 px-6">
        
        {/* TAB 1: LIVE DEMO SANDBOX */}
        {activeTab === "demo" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Virtual iPhone/Prospect Experience (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full max-w-md bg-[#1A331E] p-4 rounded-[40px] shadow-2xl border-4 border-[#C2B280] relative">
                
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
                          <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">First Call 75 x Golf Wedge</span>
                          <h4 className="font-serif-display text-lg font-bold text-white leading-tight">Travel Protection Club</h4>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="inline-flex items-center gap-1 bg-[#1A331E]/5 border border-[#1A331E]/10 px-2 py-1 rounded-xs mb-3">
                            <Sparkles className="h-3.5 w-3.5 text-[#C2B280]" />
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">NFC Exclusive Benefit</span>
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

                  {/* SCREEN STATE 3: OPT-IN FORM */}
                  {currentStep === "OPT_IN" && (
                    <div className="flex-1 flex flex-col p-6 justify-between bg-[#FDFCF7]">
                      <div>
                        <div className="w-full bg-[#E6E2D3] h-1.5 rounded-full mb-6 overflow-hidden">
                          <div className="bg-[#1A331E] h-full w-1/4"></div>
                        </div>
                        
                        <h4 className="font-serif-display text-lg font-bold text-[#1A331E] mb-2">Secure Your Voucher</h4>
                        <p className="text-xs text-[#4A5D4E] mb-6">
                          Enter your details below to reserve your $75 travel shipping voucher and unlock your personalized travel protection profile.
                        </p>

                        <form onSubmit={handleOptInSubmit} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Full Name</label>
                            <input 
                              type="text" 
                              required
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              placeholder="e.g., Andrew Miller" 
                              className="w-full bg-white border border-[#E6E2D3] px-3 py-2.5 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#1A331E]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Email Address</label>
                            <input 
                              type="email" 
                              required
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              placeholder="e.g., andrew@armsreach.com" 
                              className="w-full bg-white border border-[#E6E2D3] px-3 py-2.5 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#1A331E]"
                            />
                          </div>
                          
                          <div className="flex items-start gap-2 pt-2">
                            <input type="checkbox" defaultChecked required className="mt-0.5 accent-[#1A331E]" id="consent" />
                            <label htmlFor="consent" className="text-[10px] text-[#4A5D4E] leading-tight">
                              I agree to receive the voucher code and consent to relationship updates from the Travel Protection Club.
                            </label>
                          </div>
                        </form>
                      </div>

                      <Button 
                        onClick={handleOptInSubmit}
                        className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold mt-4"
                      >
                        Reserve & Continue <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
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
                        <span className="text-[9px] uppercase tracking-widest text-[#C2B280] font-bold block mb-0.5">Voucher Reserved for {leadName}</span>
                        <h5 className="font-serif-display text-sm font-bold text-white tracking-wide">
                          $75 Credit Ready to Activate
                        </h5>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">The Planner's Pivot</span>
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
                            <span><strong>Plan-Ahead Checklist:</strong> Instantly receive your written family instruction guide and emergency wallet card.</span>
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
                            Copy this code to use on your next golf travel shipment. An activation link has been sent to <strong>{leadEmail}</strong>.
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
                          <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">Plan B Activated</span>
                          <h4 className="font-serif-display text-lg font-bold text-[#1A331E] mt-1 mb-2">Lead Saved in ARMS</h4>
                          <p className="text-xs text-[#4A5D4E] max-w-xs mx-auto">
                            The prospect hesitated on the purchase, but because we captured <strong>{leadName}</strong>'s contact info early, the relationship is saved.
                          </p>
                        </div>

                        {/* Email Drip Box */}
                        <div className="bg-white border border-[#E6E2D3] p-4 rounded-xs text-left shadow-xs">
                          <div className="flex justify-between items-center border-b border-[#E6E2D3] pb-2 mb-2">
                            <span className="text-[10px] font-bold text-[#1A331E]">Simulated Email Nurture Sequence</span>
                            <span className="bg-[#1A331E]/10 text-[#1A331E] text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-xs">Plan B Drip</span>
                          </div>

                          <div className="space-y-3 text-[10px] text-[#4A5D4E]">
                            <div className="border-l-2 border-[#C2B280] pl-2 py-0.5">
                              <p className="font-bold text-[#1A331E]">Email 1 (Immediate): "Your $75 Voucher is Reserved"</p>
                              <p className="text-[9px]">Gives them a gentle reminder that the voucher is still waiting, reducing friction.</p>
                            </div>
                            <div className="border-l-2 border-[#E6E2D3] pl-2 py-0.5">
                              <p className="font-bold text-[#1A331E]/70">Email 2 (Day 1): "Your clubs have a way home. Do you?"</p>
                              <p className="text-[9px]">The elegant pivot from club protection to human travel protection.</p>
                            </div>
                            <div className="border-l-2 border-[#E6E2D3] pl-2 py-0.5">
                              <p className="font-bold text-[#1A331E]/70">Email 3 (Day 3): "The true cost of being unprepared"</p>
                              <p className="text-[9px]">Educational content on repatriation and first-call coordination.</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-3 rounded-xs text-center text-[10px] text-[#4A5D4E]">
                          💡 <strong>Marketing Insight:</strong> Capturing the email early turns a lost visitor into a long-term asset. We can retarget them with high-value education.
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

            {/* Right: ARMS Automation Log Console (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Mini Stats Card */}
              <Card className="double-border bg-[#F9F8F0]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold tracking-wider text-[#1A331E]">PILOT SIMULATION METRICS</CardTitle>
                  <CardDescription className="text-xs text-[#4A5D4E]">Real-time campaign performance attribution</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-xs border border-[#E6E2D3]">
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold block">Scans</span>
                    <span className="font-serif-display text-lg font-bold text-[#1A331E]">{scanCount}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xs border border-[#E6E2D3]">
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold block">Opt-ins</span>
                    <span className="font-serif-display text-lg font-bold text-[#1A331E]">{optInCount}</span>
                    <span className="text-[8px] text-[#2D6A4F] font-bold block">({Math.round((optInCount/scanCount)*100)}%)</span>
                  </div>
                  <div className="bg-white p-2 rounded-xs border border-[#E6E2D3]">
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold block">Members</span>
                    <span className="font-serif-display text-lg font-bold text-[#1A331E]">{memberCount}</span>
                    <span className="text-[8px] text-[#2D6A4F] font-bold block">({Math.round((memberCount/optInCount)*100)}%)</span>
                  </div>
                </CardContent>
              </Card>

              {/* ARMS Live Log Console */}
              <Card className="border border-[#1A331E]/20 bg-[#122015] text-[#D4ECD5] font-mono rounded-sm shadow-xl">
                <CardHeader className="border-b border-[#2D4A32] pb-3 bg-[#172D1B]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-[#C2B280] animate-pulse" />
                      <span className="text-xs uppercase tracking-wider font-bold text-white">ARMS Engine Console</span>
                    </div>
                    <span className="h-2 w-2 bg-[#2D6A4F] rounded-full animate-ping"></span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[360px] overflow-y-auto space-y-3 text-[11px] leading-relaxed pr-1 flex flex-col-reverse">
                    <div ref={logsEndRef} />
                    {crmLogs.map((log) => (
                      <div key={log.id} className="border-b border-[#2D4A32]/30 pb-2 animate-fadeIn">
                        <div className="flex items-center justify-between text-[10px] text-[#83B085] mb-0.5">
                          <span>[{log.timestamp}]</span>
                          <span className={`uppercase text-[8px] font-bold px-1.5 py-0.2 rounded-xs ${
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
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-4 rounded-xs text-xs text-[#4A5D4E]">
                <span className="font-bold text-[#1A331E] block mb-1">💡 Pitching Tip for Andrew:</span>
                "Show him the screen on the left, but point to the screen on the right. Andrew needs to see that while the prospect experiences a beautiful, simple, country-club style quiz, the **ARMS engine** is automatically segmenting them, reserving vouchers, managing billing, and triggering automated follow-up drip sequences."
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: STRATEGY DECK */}
        {activeTab === "strategy" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* Strategy Cover */}
            <div className="double-border bg-[#F9F8F0] p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A331E]"></div>
              <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold block mb-2">The Go-To-Market Blueprint</span>
              <h2 className="font-serif-display text-3xl font-bold text-[#1A331E] tracking-wide mb-4">
                The Golf Wedge Acquisition Strategy
              </h2>
              <p className="text-sm text-[#4A5D4E] max-w-xl mx-auto font-serif-body leading-relaxed">
                How we bypass the psychological barrier of repatriation sales using a high-value, country-club-aligned golf wedge powered by ARMS relationship automation.
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <div className="h-10 w-10 bg-[#1A331E]/5 rounded-sm flex items-center justify-center border border-[#1A331E]/10 mb-2">
                    <Smartphone className="h-5 w-5 text-[#1A331E]" />
                  </div>
                  <CardTitle className="text-base font-bold text-[#1A331E]">The Hook</CardTitle>
                  <CardDescription className="text-xs text-[#C2B280] font-bold uppercase tracking-wider">Tactile Curiosity</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    A physical NFC-enabled poker chip is handed out at high-end golf events, tournaments, or pro-shops.
                  </p>
                  <p>
                    <strong>Why it works:</strong> It creates immediate tactile curiosity and promises a safe, concrete $75 shipping voucher credit.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <div className="h-10 w-10 bg-[#1A331E]/5 rounded-sm flex items-center justify-center border border-[#1A331E]/10 mb-2">
                    <HelpCircle className="h-5 w-5 text-[#1A331E]" />
                  </div>
                  <CardTitle className="text-base font-bold text-[#1A331E]">The Story</CardTitle>
                  <CardDescription className="text-xs text-[#C2B280] font-bold uppercase tracking-wider">The Planner's Pivot</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    A short, non-threatening quiz identifies the traveler's habits and introduces the concept of repatriation.
                  </p>
                  <p>
                    <strong>Why it works:</strong> "Your clubs deserve a way home. So do you." It moves the conversation from equipment to family protection gently.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <div className="h-10 w-10 bg-[#1A331E]/5 rounded-sm flex items-center justify-center border border-[#1A331E]/10 mb-2">
                    <Award className="h-5 w-5 text-[#1A331E]" />
                  </div>
                  <CardTitle className="text-base font-bold text-[#1A331E]">The Offer</CardTitle>
                  <CardDescription className="text-xs text-[#C2B280] font-bold uppercase tracking-wider">The Value Bridge</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    A $150 annual membership that includes full repatriation protection and instantly activates the $75 voucher.
                  </p>
                  <p>
                    <strong>Why it works:</strong> If they use the voucher, the effective net cost of the peace-of-mind membership is only $75.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Psychological Breakdown Table */}
            <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-6 rounded-xs space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-[#1A331E] border-b border-[#E6E2D3] pb-2">
                Funnel Psychology: Reducing Friction
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E6E2D3] text-[#1A331E] font-bold">
                      <th className="py-2 pr-4">Funnel Stage</th>
                      <th className="py-2 px-4">Traditional Threat</th>
                      <th className="py-2 px-4">The Golf Wedge Bridge</th>
                      <th className="py-2 pl-4">Psychological Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2D3]/60 text-[#4A5D4E]">
                    <tr>
                      <td className="py-3 pr-4 font-bold text-[#1A331E]">1. First Contact</td>
                      <td className="py-3 px-4">Selling "repatriation/death services" cold.</td>
                      <td className="py-3 px-4">A premium NFC poker chip offering a $75 golf travel voucher.</td>
                      <td className="py-3 pl-4">High curiosity, low threat, high-value alignment.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-bold text-[#1A331E]">2. Lead Capture</td>
                      <td className="py-3 px-4">Demanding sensitive personal/health data.</td>
                      <td className="py-3 px-4">Name and email to secure the reserved voucher code.</td>
                      <td className="py-3 pl-4">High opt-in rate; secures the contact for Plan B retargeting.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-bold text-[#1A331E]">3. Education</td>
                      <td className="py-3 px-4">Graphic descriptions of emergency costs.</td>
                      <td className="py-3 px-4">A short quiz: "Your clubs have a way home. Do you?"</td>
                      <td className="py-3 pl-4">Self-recognition; prospect identifies as a responsible planner.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-bold text-[#1A331E]">4. Conversion</td>
                      <td className="py-3 px-4">A $150 pure protection cost with no immediate benefit.</td>
                      <td className="py-3 px-4">A $150 membership that instantly unlocks the $75 voucher.</td>
                      <td className="py-3 pl-4">Perceived net cost of $75; converts impulse into active protection.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Quote */}
            <div className="border-l-4 border-[#C2B280] pl-6 py-2 italic text-[#1A331E] font-serif-body text-sm bg-[#F9F8F0]/50 rounded-r-xs">
              "We are not trying to change how people think about death. We are leveraging how smart travelers already think about logistics, planning, and protecting what they value."
            </div>

          </div>
        )}

        {/* TAB 3: ARMS AUTOMATION ENGINE */}
        {activeTab === "arms" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            
            <div className="double-border bg-[#F9F8F0] p-8">
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-6 w-6 text-[#1A331E]" />
                <h2 className="font-serif-display text-xl font-bold text-[#1A331E]">ARMS: The Relationship Engine</h2>
              </div>
              <p className="text-xs text-[#4A5D4E] font-serif-body">
                ARMS is the white-label automation system that operates behind the scenes. It tracks attribution, manages contact segmentation, runs email/SMS drip sequences, recovers abandoned checkouts, and handles member onboarding and renewals.
              </p>
            </div>

            {/* Automation Workflow Diagram */}
            <div className="bg-white border border-[#E6E2D3] p-6 rounded-xs space-y-6">
              <h3 className="font-serif-display text-base font-bold text-[#1A331E] text-center">
                ARMS End-to-End Automation Blueprint
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                
                {/* Step 1 */}
                <div className="bg-[#F9F8F0] p-4 rounded-xs border border-[#E6E2D3] text-center relative z-10">
                  <div className="h-8 w-8 bg-[#1A331E] rounded-full flex items-center justify-center text-[#C2B280] text-xs font-bold mx-auto mb-2">1</div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E] block">NFC Tap / Scan</span>
                  <p className="text-[10px] text-[#4A5D4E] mt-1">
                    Attributes lead source & registers campaign webhook.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-[#F9F8F0] p-4 rounded-xs border border-[#E6E2D3] text-center relative z-10">
                  <div className="h-8 w-8 bg-[#1A331E] rounded-full flex items-center justify-center text-[#C2B280] text-xs font-bold mx-auto mb-2">2</div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E] block">Opt-In Capture</span>
                  <p className="text-[10px] text-[#4A5D4E] mt-1">
                    Secures contact info before price resistance.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#F9F8F0] p-4 rounded-xs border border-[#E6E2D3] text-center relative z-10">
                  <div className="h-8 w-8 bg-[#1A331E] rounded-full flex items-center justify-center text-[#C2B280] text-xs font-bold mx-auto mb-2">3</div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E] block">Quiz Segment</span>
                  <p className="text-[10px] text-[#4A5D4E] mt-1">
                    Profiles traveler habits and planning mindset.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-[#F9F8F0] p-4 rounded-xs border border-[#E6E2D3] text-center relative z-10">
                  <div className="h-8 w-8 bg-[#1A331E] rounded-full flex items-center justify-center text-[#C2B280] text-xs font-bold mx-auto mb-2">4</div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E] block">The Offer</span>
                  <p className="text-[10px] text-[#4A5D4E] mt-1">
                    Presents $150 membership with $75 voucher credit.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="bg-[#1A331E] p-4 rounded-xs border border-[#C2B280] text-center text-white relative z-10">
                  <div className="h-8 w-8 bg-[#C2B280] rounded-full flex items-center justify-center text-[#1A331E] text-xs font-bold mx-auto mb-2">5</div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#C2B280] block">Plan B Nurture</span>
                  <p className="text-[10px] text-[#E6E2D3] mt-1">
                    If they hesitate, ARMS drip sequence educates.
                  </p>
                </div>

              </div>
            </div>

            {/* Core ARMS Functions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-[#1A331E] flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-[#C2B280]" />
                    Lead Capture & Segmentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    ARMS captures contact details early, ensuring we never lose a prospect who scans the chip.
                  </p>
                  <p>
                    The quiz results are instantly mapped to custom contact fields, segmenting leads by travel frequency and preparedness. This allows highly personalized follow-up campaigns.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-[#1A331E] flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#C2B280]" />
                    Abandoned Checkout Recovery
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-2">
                  <p>
                    If a prospect completes the quiz but abandons the offer page, ARMS triggers an automated checkout recovery sequence.
                  </p>
                  <p>
                    Within 15 minutes, the prospect receives a gentle email/SMS reminding them that their $75 voucher is reserved and expires shortly, maintaining urgency.
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        )}

        {/* TAB 4: PILOT PROPOSAL */}
        {activeTab === "pilot" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            
            <div className="double-border bg-[#F9F8F0] p-8 text-center">
              <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold block mb-1">Proposed Next Steps</span>
              <h2 className="font-serif-display text-2xl font-bold text-[#1A331E] mb-2">The Minimum Viable Pilot</h2>
              <p className="text-xs text-[#4A5D4E] max-w-xl mx-auto font-serif-body">
                Let's invite Andrew into a controlled, measurable pilot to prove the golf wedge conversion economics before scaling the program.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pilot Scope */}
              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-[#1A331E]">Pilot Scope & Deliverables</CardTitle>
                  <CardDescription className="text-xs text-[#4A5D4E]">What we build for the pilot test</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C2B280] shrink-0 mt-0.5" />
                    <span><strong>100 NFC Poker Chips:</strong> Branded physical chips to distribute at a local partner course or regional tournament.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C2B280] shrink-0 mt-0.5" />
                    <span><strong>The Quiz Funnel:</strong> A fully-optimized, mobile-first quiz funnel landing page (identical to this demo).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C2B280] shrink-0 mt-0.5" />
                    <span><strong>ARMS Automation:</strong> Lead capture, contact segmentation, checkout recovery, and Plan B email drips.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#C2B280] shrink-0 mt-0.5" />
                    <span><strong>Attribution Dashboard:</strong> A simple dashboard in ARMS to measure scan-to-opt-in and opt-in-to-membership conversion.</span>
                  </div>
                </CardContent>
              </Card>

              {/* Success Metrics */}
              <Card className="border border-[#E6E2D3] bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-[#1A331E]">Key Success Metrics</CardTitle>
                  <CardDescription className="text-xs text-[#4A5D4E]">How we judge the pilot's performance</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[#4A5D4E] space-y-3">
                  <div className="flex items-start gap-2">
                    <BarChart3 className="h-4 w-4 text-[#1A331E] shrink-0 mt-0.5" />
                    <span><strong>Scan-to-Opt-In Rate (Target: 35%+):</strong> Proves that the $75 voucher is a compelling, non-threatening hook.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-[#1A331E] shrink-0 mt-0.5" />
                    <span><strong>Opt-In-to-Membership Rate (Target: 10%+):</strong> Proves the clubs-to-care story successfully makes the emotional pivot.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-[#1A331E] shrink-0 mt-0.5" />
                    <span><strong>Customer Acquisition Cost (CAC):</strong> Measuring the net cost of acquisition against lifetime membership value.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <RefreshCw className="h-4 w-4 text-[#1A331E] shrink-0 mt-0.5" />
                    <span><strong>Plan B Recovery Rate (Target: 15%+):</strong> Proves the value of early lead capture and automated drip campaigns.</span>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Call to Action Box */}
            <div className="bg-[#1A331E] text-white p-8 rounded-xs text-center border border-[#C2B280]">
              <h3 className="font-serif-display text-lg font-bold text-[#C2B280] mb-2">Ready to Pitch Andrew Tomorrow?</h3>
              <p className="text-xs text-[#E6E2D3] max-w-lg mx-auto mb-6">
                Use the "Live Demo" tab during your meeting to show Andrew the seamless transition from physical chip to ARMS-powered CRM logging. It's the most powerful way to prove the strategy works.
              </p>
              <Button 
                onClick={() => setActiveTab("demo")}
                className="bg-[#C2B280] hover:bg-[#D4C391] text-[#1A331E] font-sans-ui text-xs uppercase tracking-wider font-bold px-6 py-4 rounded-sm"
              >
                Open Live Demo Sandbox <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E2D3] bg-[#F9F8F0] py-6 px-6 text-center text-xs text-[#4A5D4E]">
        <div className="container">
          <p className="font-sans-ui">
            &copy; 2026 Global 360 & ARMS Reach. Confidential Pitch Materials.
          </p>
          <p className="text-[10px] text-[#C2B280] mt-1 font-semibold">
            NEVER REFER TO ARMS BY ANY OTHER NAME. POWERED BY AUTOMATED RELATIONSHIP MANAGEMENT SYSTEM.
          </p>
        </div>
      </footer>
    </div>
  );
}
