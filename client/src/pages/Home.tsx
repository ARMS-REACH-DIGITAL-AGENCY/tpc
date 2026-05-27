import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  User, 
  CreditCard, 
  Lock, 
  RefreshCw, 
  Award, 
  Compass, 
  HeartHandshake,
  Users,
  Clock,
  PhoneCall,
  Plane,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Steps in the pure consumer-facing funnel
type FunnelStep = "LANDING_PAGE" | "OPT_IN" | "QUIZ" | "OFFER" | "STRIPE_CHECKOUT" | "OUTCOME" | "FOLLOW_UP";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<FunnelStep>("LANDING_PAGE");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizIndex, setQuizIndex] = useState(0);

  // Stripe Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Custom Form Submission with Background API Bridge to YAT?STATS
  const handleCustomFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) {
      toast.error("Please enter both your name and email.");
      return;
    }

    setIsSubmittingForm(true);

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

      setIsSubmittingForm(false);
      setCurrentStep("QUIZ");
      toast.success("Voucher reserved! Let's complete your travel planner.");

    } catch (error) {
      console.error("Form submission error:", error);
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
    setQuizAnswers(prev => ({ ...prev, [currentQ.id]: option }));

    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setCurrentStep("OFFER");
    }
  };

  // Pre-fill card for quick presentation
  const prefillDemoCard = () => {
    setCardNumber("4242 •••• •••• 4242");
    setCardExpiry("12/28");
    setCardCvc("424");
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
    
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentStep("OUTCOME");
      toast.success("Payment Captured! Membership Activated.");
    }, 2000);
  };

  // Reset the funnel
  const resetDemo = () => {
    setCurrentStep("LANDING_PAGE");
    setLeadName("");
    setLeadEmail("");
    setQuizAnswers({});
    setQuizIndex(0);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF7] text-[#1E2B22] font-sans-ui selection:bg-[#C2B280] selection:text-[#1A331E]">
      
      {/* Premium Country Club Style Header */}
      <header className="border-b border-[#E6E2D3] bg-[#F9F8F0] py-5 px-6 sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#1A331E] rounded-xs flex items-center justify-center border border-[#C2B280]">
              <span className="font-serif-display text-lg font-bold text-[#E6E2D3]">G</span>
            </div>
            <div>
              <h1 className="font-serif-display text-lg font-bold tracking-wider text-[#1A331E]">GLOBAL 360</h1>
              <p className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold">Travel Protection Club</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#4A5D4E] font-medium">
              <ShieldCheck className="h-4 w-4 text-[#C2B280]" />
              <span>Elite Global Medical Repatriation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Screen Consumer Experience */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-2xl bg-white rounded-lg border border-[#E6E2D3] shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1A331E]"></div>

          {/* STEP 1: CONSUMER LANDING PAGE */}
          {currentStep === "LANDING_PAGE" && (
            <div className="flex flex-col">
              {/* Premium Hero Section */}
              <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img 
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368558979/TncsUA3wJWw3btME2gSgvv/luxury_golf_bg-eU6pGTC8LSgMWDHb2SD2Nq.webp" 
                  alt="Luxury Golf" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                  <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold mb-1.5">Exclusive Golf Invitation</span>
                  <h2 className="font-serif-display text-3xl font-bold text-white leading-tight max-w-lg">
                    Your Clubs Are Protected. But What About You?
                  </h2>
                </div>
              </div>

              {/* Body & Benefits */}
              <div className="p-8 space-y-6">
                <div className="inline-flex items-center gap-1.5 bg-[#1A331E]/5 border border-[#1A331E]/10 px-3 py-1 rounded-xs">
                  <Sparkles className="h-4 w-4 text-[#C2B280]" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Exclusive Member Benefit</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif-display text-xl font-bold text-[#1A331E] leading-snug">
                    Activate Your $75 Golf Travel Shipping Voucher
                  </h3>
                  <p className="text-sm text-[#4A5D4E] leading-relaxed">
                    Congratulations! Your invitation scan qualifies you for a <strong>$75 credit</strong> toward premium golf club shipping (ShipSticks-style). Ensure your clubs travel safely and stress-free on your next excursion.
                  </p>
                  <p className="text-sm text-[#4A5D4E] leading-relaxed">
                    But before you ship, ask yourself: if you plan ahead to protect your equipment, do you have a plan to protect yourself in an unforeseen medical crisis?
                  </p>
                </div>

                {/* Info Card */}
                <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-5 rounded-xs space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#1A331E] font-bold">
                    <CheckCircle2 className="h-5 w-5 text-[#1A331E]" />
                    <span>Instant Voucher Reservation</span>
                  </div>
                  <p className="text-xs text-[#4A5D4E] pl-7 leading-relaxed">
                    Secure your credit first. You can apply it to your next golf shipment immediately once your membership is confirmed.
                  </p>
                </div>

                {/* CTA */}
                <Button 
                  onClick={() => setCurrentStep("OPT_IN")}
                  className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-6 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-[0.99]"
                >
                  Secure Your Voucher <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: OPT-IN FORM */}
          {currentStep === "OPT_IN" && (
            <div className="p-8 space-y-6">
              <div className="w-full bg-[#E6E2D3] h-1 rounded-full overflow-hidden">
                <div className="bg-[#1A331E] h-full w-1/4"></div>
              </div>
              
              <div className="text-center space-y-1.5">
                <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold">Voucher Registration</span>
                <h3 className="font-serif-display text-2xl font-bold text-[#1A331E] leading-tight">Secure Your $75 Credit</h3>
                <p className="text-xs text-[#4A5D4E] max-w-md mx-auto leading-relaxed">
                  Enter your details to reserve your ShipSticks-style rebate voucher and begin your personalized travel safety planner.
                </p>
              </div>

              {/* Custom Premium React Form */}
              <form onSubmit={handleCustomFormSubmit} className="space-y-4 max-w-md mx-auto pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Peter DeLuca" 
                      className="w-full bg-white border border-[#E6E2D3] focus:border-[#1A331E] pl-10 pr-3 py-3 rounded-xs text-xs focus:outline-hidden transition-all text-[#1A331E]"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#C2B280]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="peter.deluca@gmail.com" 
                      className="w-full bg-white border border-[#E6E2D3] focus:border-[#1A331E] pl-10 pr-3 py-3 rounded-xs text-xs focus:outline-hidden transition-all text-[#1A331E]"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#C2B280]" />
                  </div>
                </div>
              </form>

              <div className="space-y-3 pt-4 max-w-md mx-auto">
                <Button 
                  onClick={handleCustomFormSubmit}
                  disabled={isSubmittingForm}
                  className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-6 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5"
                >
                  {isSubmittingForm ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Reserving Voucher...
                    </>
                  ) : (
                    <>
                      Reserve & Continue <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <span className="text-[10px] text-[#4A5D4E] text-center block leading-relaxed">
                  🔒 Your information is secure and protected. No spam, ever.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: TRAVEL QUIZ */}
          {currentStep === "QUIZ" && (
            <div className="p-8 space-y-6">
              <div className="w-full bg-[#E6E2D3] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1A331E] h-full transition-all duration-300"
                  style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold">
                  Question {quizIndex + 1} of {quizQuestions.length}
                </span>
                <h3 className="font-serif-display text-xl font-bold text-[#1A331E] leading-snug">
                  {quizQuestions[quizIndex].question}
                </h3>
              </div>

              <div className="space-y-3 max-w-md mx-auto pt-2">
                {quizQuestions[quizIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(option)}
                    className="w-full text-left bg-white hover:bg-[#F1EFE6] border border-[#E6E2D3] hover:border-[#1A331E] p-4 rounded-xs text-xs text-[#1A331E] font-medium transition-all active:scale-[0.99]"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-[#4A5D4E] pt-4 border-t border-[#E6E2D3]/40">
                <span>🔒 Secure Travel Profile</span>
                {quizIndex > 0 && (
                  <button 
                    onClick={() => setQuizIndex(prev => prev - 1)}
                    className="flex items-center gap-1 font-bold text-[#1A331E]"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Back
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: THE OFFER PIVOT */}
          {currentStep === "OFFER" && (
            <div className="flex flex-col">
              {/* Header */}
              <div className="bg-[#1A331E] text-white p-6 text-center border-b border-[#C2B280]">
                <span className="text-[10px] uppercase tracking-widest text-[#C2B280] font-bold block mb-1">Voucher Reserved & Held</span>
                <h3 className="font-serif-display text-lg font-bold text-white tracking-wide">
                  Your $75 Shipping Credit is Ready to Activate
                </h3>
              </div>

              <div className="p-8 space-y-6">
                <div className="text-center space-y-1.5">
                  <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold">The Planner's Choice</span>
                  <h3 className="font-serif-display text-2xl font-bold text-[#1A331E] leading-tight">
                    Your clubs have a plan to get home. Do you?
                  </h3>
                  <p className="text-xs text-[#4A5D4E] max-w-lg mx-auto leading-relaxed">
                    You plan ahead to protect your golf equipment. But what about your own peace of mind? If an unforeseen medical emergency occurs away from home, the logistical and financial burden of returning home can be astronomical.
                  </p>
                </div>

                {/* Value Stack Table */}
                <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-6 rounded-xs space-y-4 max-w-lg mx-auto">
                  <div className="border-b border-[#E6E2D3] pb-2 text-center">
                    <span className="text-xs uppercase tracking-widest text-[#1A331E] font-bold">The Activation Offer</span>
                  </div>
                  
                  <div className="flex justify-between text-xs border-b border-[#E6E2D3]/60 pb-2">
                    <span className="text-[#4A5D4E]">Travel Protection Club Membership (1 Yr)</span>
                    <span className="font-bold text-[#1A331E]">$150.00</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-[#2D6A4F] border-b border-[#E6E2D3]/60 pb-2">
                    <span>ShipSticks-Style Golf Shipping Credit</span>
                    <span className="font-bold">-$75.00</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <span className="text-xs font-bold text-[#1A331E] block">Effective First-Year Cost</span>
                      <span className="text-[10px] text-[#4A5D4E]">After voucher redemption</span>
                    </div>
                    <span className="font-serif-display text-2xl font-bold text-[#1A331E]">$75.00</span>
                  </div>
                </div>

                {/* Pillars of Protection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="border border-[#E6E2D3] p-4 rounded-xs bg-white space-y-1.5">
                    <ShieldCheck className="h-5 w-5 text-[#C2B280]" />
                    <h4 className="font-serif-display text-xs font-bold text-[#1A331E]">Elite Repatriation</h4>
                    <p className="text-[10px] text-[#4A5D4E] leading-relaxed">Complete medical transportation back to your local hospital in a crisis.</p>
                  </div>
                  <div className="border border-[#E6E2D3] p-4 rounded-xs bg-white space-y-1.5">
                    <PhoneCall className="h-5 w-5 text-[#C2B280]" />
                    <h4 className="font-serif-display text-xs font-bold text-[#1A331E]">First-Call Support</h4>
                    <p className="text-[10px] text-[#4A5D4E] leading-relaxed">One dedicated emergency number that coordinates everything for your family.</p>
                  </div>
                  <div className="border border-[#E6E2D3] p-4 rounded-xs bg-white space-y-1.5">
                    <Award className="h-5 w-5 text-[#C2B280]" />
                    <h4 className="font-serif-display text-xs font-bold text-[#1A331E]">Plan-Ahead Tools</h4>
                    <p className="text-[10px] text-[#4A5D4E] leading-relaxed">Includes physical membership cards, luggage tags, and emergency guides.</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-4 max-w-md mx-auto">
                  <Button 
                    onClick={() => setCurrentStep("STRIPE_CHECKOUT")}
                    className="w-full bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] py-6 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold shadow-md"
                  >
                    Activate Membership & Get Voucher
                  </Button>
                  <button 
                    onClick={() => setCurrentStep("FOLLOW_UP")}
                    className="w-full text-center text-xs text-[#4A5D4E] hover:text-[#1A331E] font-semibold py-2"
                  >
                    No thanks, I will forfeit my $75 voucher credit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SECURE STRIPE CHECKOUT */}
          {currentStep === "STRIPE_CHECKOUT" && (
            <div className="p-8 space-y-6">
              {/* Stripe Header */}
              <div className="flex items-center justify-between border-b border-[#E6E2D3] pb-4">
                <div className="flex items-center gap-1.5">
                  <div className="bg-[#635BFF] text-white p-1 rounded-xs">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1E2022] font-sans-ui tracking-wide">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#2D6A4F] font-semibold">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Stripe SSL Encryption</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Order Summary (5 Cols) */}
                <div className="md:col-span-5 space-y-4 bg-[#F9F8F0] p-5 rounded-xs border border-[#E6E2D3]">
                  <span className="text-[10px] uppercase tracking-widest text-[#4A5D4E] font-bold block">Order Summary</span>
                  
                  <div className="space-y-2.5 text-xs text-[#4A5D4E]">
                    <div className="flex justify-between">
                      <span>Annual Membership</span>
                      <span className="font-semibold text-[#1A331E]">$150.00</span>
                    </div>
                    <div className="flex justify-between text-[#2D6A4F] font-semibold">
                      <span>$75 Rebate Voucher</span>
                      <span>Included</span>
                    </div>
                  </div>

                  <div className="border-t border-[#E6E2D3] pt-3 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-[#1A331E]">Total Due Now</span>
                    <span className="font-serif-display text-xl font-bold text-[#1A331E]">$150.00</span>
                  </div>
                  
                  <span className="text-[9px] text-[#4A5D4E] block leading-relaxed">
                    ✓ Your $75 ShipSticks-style voucher will be delivered instantly upon payment authorization.
                  </span>
                </div>

                {/* Card Fields (7 Cols) */}
                <form onSubmit={handlePaymentSubmit} className="md:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Card Number</label>
                      <button 
                        type="button" 
                        onClick={prefillDemoCard}
                        className="text-[10px] text-[#635BFF] hover:underline font-bold"
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
                        className="w-full bg-white border border-[#E6E2D3] pl-10 pr-3 py-3 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#635BFF]"
                      />
                      <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-[#A3ACB9]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY" 
                        className="w-full bg-white border border-[#E6E2D3] px-3 py-3 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#635BFF] text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A331E]">CVC / CVV</label>
                      <input 
                        type="text" 
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123" 
                        className="w-full bg-white border border-[#E6E2D3] px-3 py-3 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-[#635BFF] text-center"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="space-y-3 pt-4 max-w-md mx-auto">
                <Button 
                  onClick={handlePaymentSubmit}
                  disabled={isProcessingPayment}
                  className="w-full bg-[#635BFF] hover:bg-[#5249E0] text-white py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Authorizing Securely...
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
                  className="w-full text-center text-xs text-[#4A5D4E] hover:text-[#1A331E] font-semibold py-1"
                >
                  ← Return to Offer Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS OUTCOME */}
          {currentStep === "OUTCOME" && (
            <div className="p-8 text-center space-y-6">
              <div className="h-16 w-16 bg-[#1A331E] rounded-full flex items-center justify-center border-2 border-[#C2B280] mx-auto">
                <Award className="h-8 w-8 text-[#C2B280]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold">Welcome to the Club</span>
                <h3 className="font-serif-display text-2xl font-bold text-[#1A331E]">Membership Activated!</h3>
                <p className="text-sm text-[#4A5D4E] max-w-md mx-auto leading-relaxed">
                  Thank you, {leadName}. Your first-year Travel Protection Club membership is active. Your family is now fully protected.
                </p>
              </div>

              {/* Voucher Box */}
              <div className="bg-[#F9F8F0] border-2 border-dashed border-[#C2B280] p-6 rounded-xs max-w-md mx-auto space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#4A5D4E] font-bold block">Your $75 Shipping Voucher</span>
                <span className="font-mono text-lg font-bold text-[#1A331E] tracking-wider bg-white px-4 py-2 border border-[#E6E2D3] rounded-xs block">
                  SS-GOLF-75-ACTIVE
                </span>
                <p className="text-[11px] text-[#4A5D4E] leading-relaxed">
                  Copy this code to use on your next golf travel shipment. An activation link has been sent to <strong>{leadEmail}</strong>.
                </p>
              </div>

              <div className="bg-[#1A331E]/5 border border-[#1A331E]/10 p-4 rounded-xs text-left max-w-md mx-auto space-y-2">
                <span className="text-xs font-bold text-[#1A331E] block">What happens next:</span>
                <ul className="text-xs text-[#4A5D4E] space-y-1.5 pl-5 list-disc">
                  <li>Check your inbox for the digital welcome packet.</li>
                  <li>Download and share the 1-Page Family Instruction sheet.</li>
                  <li>Your physical member card will arrive in 5-7 business days.</li>
                </ul>
              </div>

              <Button 
                onClick={resetDemo}
                className="bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] px-6 py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold"
              >
                Simulate Next Scan
              </Button>
            </div>
          )}

          {/* STEP 7: PLAN B FOLLOW-UP */}
          {currentStep === "FOLLOW_UP" && (
            <div className="p-8 text-center space-y-6">
              <div className="h-16 w-16 bg-[#F1EFE6] rounded-full flex items-center justify-center border border-[#E6E2D3] mx-auto">
                <Mail className="h-8 w-8 text-[#1A331E]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#C2B280] font-bold">Voucher Reserved</span>
                <h3 className="font-serif-display text-2xl font-bold text-[#1A331E]">Voucher Reservation Confirmed</h3>
                <p className="text-sm text-[#4A5D4E] max-w-md mx-auto leading-relaxed">
                  The voucher reservation remains active. A temporary confirmation has been sent to <strong>{leadEmail}</strong>.
                </p>
              </div>

              <div className="bg-[#F9F8F0] border border-[#E6E2D3] p-5 rounded-xs text-left max-w-md mx-auto space-y-3">
                <span className="text-xs font-bold text-[#1A331E] block">What to expect next:</span>
                <p className="text-xs text-[#4A5D4E] leading-relaxed">
                  Your $75 credit is held securely. Over the next few days, we will send you helpful, non-intrusive traveler safety guides and planner tools to assist your travel decisions.
                </p>
              </div>

              <Button 
                onClick={resetDemo}
                className="bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] px-6 py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold"
              >
                Simulate Next Scan
              </Button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E2D3] bg-[#F9F8F0] py-8 px-6 text-center text-xs text-[#4A5D4E]">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-sans-ui">
            &copy; 2026 Global 360 Travel Protection Club. All rights reserved.
          </p>
          <p className="text-[10px] text-[#C2B280] font-bold uppercase tracking-wider">
            Elite Repatriation & Crisis Coordination
          </p>
        </div>
      </footer>
    </div>
  );
}
