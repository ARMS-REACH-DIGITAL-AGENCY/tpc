import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronRight, Lock, ArrowRight, Shield, Check, Share2, HelpCircle, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type DemoStep = "OPT_IN" | "QUIZ" | "OFFER" | "STRIPE_CHECKOUT" | "SUCCESS";

interface QuizAnswer {
  questionId: string;
  answer: string;
}

export default function Home() {
  const [step, setDemoStep] = useState<DemoStep>("OPT_IN");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookUrl] = useState(() => {
    return localStorage.getItem("arms_webhook_url") || "";
  });
  const [stripeData, setStripeData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: ""
  });
  
  // FAQs and Terms toggle states for final page
  const [faqOpen, setFaqOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

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

  // Reusable helper to send lead updates to YAT?STATS/ARMS Webhook at different funnel steps
  const sendLeadToLiveWebhook = async (funnelStep: string, status: string, answers: any = {}) => {
    if (!webhookUrl) return;
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          funnel_step: funnelStep,
          status: status,
          campaign: "Global 360 First Call 75",
          source: "ShipSticks_TPC_Launch",
          tag: "Golf_Wedge_Launch",
          quiz_answers: answers,
          timestamp: new Date().toISOString()
        }),
        mode: "no-cors" // no-cors is safer for HighLevel/Zapier webhooks to prevent CORS blockages
      });
      console.log(`Live Webhook Success: Pushed step '${funnelStep}' to ARMS.`);
    } catch (err) {
      console.error("Live Webhook Error:", err);
    }
  };

  const handleOptInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);

    // Push Opt-In Stage to ARMS
    if (webhookUrl) {
      await sendLeadToLiveWebhook("Opt-In", "Prospect");
    }
    
    toast.success("Contact info saved!");
    setIsSubmitting(false);
    // Go directly to the quiz questions!
    setDemoStep("QUIZ");
  };

  const handleQuizAnswer = async (answer: string) => {
    const updatedAnswers = [...quizAnswers, { questionId: quizQuestions[currentQuestionIndex].id, answer }];
    setQuizAnswers(updatedAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed! Format answers as key-value pairs for the webhook payload
      const formattedAnswers = updatedAnswers.reduce((acc, curr) => {
        acc[curr.questionId] = curr.answer;
        return acc;
      }, {} as Record<string, string>);

      // Push Quiz Completed Stage to ARMS
      if (webhookUrl) {
        await sendLeadToLiveWebhook("Quiz Completed", "Segmented Prospect", formattedAnswers);
      }

      setDemoStep("OFFER");
    }
  };

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeData.cardNumber || !stripeData.expiry || !stripeData.cvc) {
      toast.error("Please enter your card details.");
      return;
    }

    setIsSubmitting(true);

    // Format quiz answers for the final payload
    const formattedAnswers = quizAnswers.reduce((acc, curr) => {
      acc[curr.questionId] = curr.answer;
      return acc;
    }, {} as Record<string, string>);

    // Push Payment Completed Stage to ARMS
    if (webhookUrl) {
      await sendLeadToLiveWebhook("Payment Completed", "Active Member", formattedAnswers);
    }

    toast.success("Payment Authorized Successfully!");
    setIsSubmitting(false);
    setDemoStep("SUCCESS");
  };

  const prefillStripeDemo = () => {
    setStripeData({
      cardNumber: "4242 •••• •••• 4242",
      expiry: "12/28",
      cvc: "123"
    });
    toast.info("Demo card details pre-filled.");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Exclusive $75 Ship Sticks Rebate",
      text: "Check out this co-branded gift from The Travel Protection Club & ASB Athletics in conjunction with Ship Sticks!",
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success("Offer link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2B21] font-sans antialiased flex flex-col justify-between overflow-x-hidden pt-1 pb-4 px-4">
      {/* Main Content Area - Centered, Tightened Spacing, Warm Sand Aesthetics */}
      <main className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center my-auto space-y-2">
        {step === "OPT_IN" && (
          <div className="space-y-4 w-full animate-fade-in">
            {/* Pure, Frictionless Opt-In Form Card - Sharp Corners, Rich Cream Background, NO BORDERS */}
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-4">
                <div className="text-center space-y-2">
                  {/* BOLD SANS-SERIF HEADLINE - EXACTLY AS SHOWN IN USER MOCKUP */}
                  <h1 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-black leading-tight">
                    The next time <br />
                    your precious clubs <br />
                    need to get home safely... <br />
                    please think of us!
                  </h1>
                  <div className="h-[2px] w-16 bg-[#E5C158] mx-auto mt-2" />
                </div>

                <form onSubmit={handleOptInSubmit} className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-[10px] font-bold text-[#5C6B5E] tracking-wider uppercase">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Happy Gilmore"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-[10px] font-bold text-[#5C6B5E] tracking-wider uppercase">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="happy@gilmore.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-[10px] font-bold text-[#5C6B5E] tracking-wider uppercase">
                      Mobile Number <span className="text-[#A4B3A7] font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full min-h-12 py-3 px-4 bg-[#107C41] hover:bg-[#0C6233] active:scale-[0.98] transition-all text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer whitespace-normal text-center leading-normal"
                  >
                    <span>{isSubmitting ? "Securing..." : "ACTIVATE YOUR $75 SHIP STICKS REBATE NOW!"}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Bottom Section: Grouped Co-branded Logos & Elegant Footnote */}
            <div className="space-y-1.5 pt-1">
              {/* Row of Logos - Tightened vertical spacing, moved up, and cropped Ship Sticks text */}
              <div className="flex items-center justify-center gap-2 md:gap-4 px-2">
                {/* Logo 1: High-Res TPC Shield */}
                <img 
                  src="/manus-storage/57885_120b932a.png" 
                  alt="Travel Protection Club" 
                  className="h-14 md:h-18 object-contain shrink-0"
                />

                {/* Logo 2: Dark Ship Sticks Banner (Cropped bottom 20% to remove duplicate 'complement of') */}
                <div className="h-10 md:h-13 overflow-hidden shrink-0 flex items-center justify-center">
                  <img 
                    src="/manus-storage/cropped_shipsticks_dark_9caa446b.png" 
                    alt="Ship Sticks" 
                    className="h-[125%] object-contain scale-[1.0] origin-top translate-y-[-5%]"
                  />
                </div>

                {/* Logo 3: Circular ASB Logo */}
                <div className="h-11 w-11 md:h-14 md:w-14 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
                  <img 
                    src="/manus-storage/cropped_asb_dark_f202b5ec.png" 
                    alt="ASB Logo" 
                    className="h-[105%] w-[105%] object-cover scale-[0.95]"
                  />
                </div>
              </div>

              {/* Text Footnote */}
              <div className="text-center px-4">
                <span className="text-[9px] md:text-[10px] text-[#5C6B5E] font-bold tracking-wider uppercase block leading-relaxed">
                  COMPLEMENT of <br />
                  THE TRAVEL PROTECTION CLUB & ASB ATHLETICS <br />
                  <span className="text-[#A4B3A7] font-medium text-[8px] md:text-[9px]">in conjunction with SHIP STICKS</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {step === "QUIZ" && (
          <div className="w-full space-y-2 animate-fade-in">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider px-1 pt-1">
              <span>Golf Travel Planner</span>
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            </div>
            <div className="h-1 w-full bg-[#E8E4DC] rounded-none overflow-hidden">
              <div 
                className="h-full bg-[#107C41] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Clean, borderless card container blending seamlessly into the warm sand background */}
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-2.5 space-y-4">
                {/* EXTRA BOLD HEADLINE MATCHING LANDING PAGE AND USER SCREENSHOT */}
                <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-black text-center leading-tight max-w-xs mx-auto pt-2">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-2 max-w-sm mx-auto pt-2">
                  {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full p-3 text-left border border-[#E8E4DC] hover:border-[#107C41] hover:bg-[#EAF7EE]/20 active:scale-[0.99] transition-all rounded-none text-xs font-bold text-[#1C2B21] flex items-center justify-between group cursor-pointer bg-white"
                    >
                      <span>{option}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#A4B3A7] group-hover:text-[#107C41] transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "OFFER" && (
          <div className="w-full space-y-2 animate-fade-in">
            {/* Pure, borderless, warm-sand offer screen matching the landing page look and feel */}
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-2">
                {/* THE EMOTIONAL PIVOT HEADLINE - BOLD SANS-SERIF TYPOGRAPHY */}
                <div className="text-center space-y-1">
                  <h1 className="text-xl md:text-2xl font-sans font-black tracking-tight text-black leading-snug">
                    Your clubs deserve a way home. <br />
                    So does your family.
                  </h1>
                  <div className="h-[2px] w-12 bg-[#E5C158] mx-auto my-1" />
                  
                  {/* EMOTIONAL TRANSFORMATIONAL MESSAGE */}
                  <p className="text-[10px] md:text-xs text-[#3A4A3D] font-bold max-w-sm mx-auto leading-normal px-1">
                    Golfers plan how their clubs get home. First Call 75 helps your family know who to call first if something happens more than 75 miles from home.
                  </p>
                </div>

                {/* Clean, borderless value summary matching landing page styling */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-none overflow-hidden max-w-sm mx-auto">
                  <div className="bg-[#FAF8F5] border-b border-[#E8E4DC] p-2 text-[9px] font-bold text-[#5C6B5E] tracking-wider uppercase text-center">
                    Your First-Year Offer
                  </div>
                  <div className="divide-y divide-[#E8E4DC] text-[11px]">
                    <div className="grid grid-cols-2 p-2 text-[#1C2B21]">
                      <span className="font-semibold">1-Year Travel Protection Club Membership</span>
                      <span className="text-right font-bold">$150.00</span>
                    </div>
                    <div className="grid grid-cols-2 p-2 text-[#1C2B21] bg-[#EAF7EE]/10">
                      <span className="font-semibold text-[#107C41]">Golf Club Shipping Credit</span>
                      <span className="text-right font-bold text-[#107C41]">-$75.00</span>
                    </div>
                    <div className="grid grid-cols-2 p-2 bg-[#FAF8F5] font-bold text-[11px] text-[#1C2B21]">
                      <span>Effective First-Year Cost After Credit</span>
                      <span className="text-right text-[#107C41]">$75.00</span>
                    </div>
                  </div>
                </div>

                {/* EMOTIONALLY TRANSFORMED BENEFITS LIST */}
                <div className="space-y-1.5 pt-1 max-w-sm mx-auto">
                  <h3 className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-widest text-center">
                    YOUR FAMILY'S FIRST-CALL PROTECTION PLAN:
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex gap-2 items-start bg-[#FAF8F5] p-2 border border-[#E8E4DC] rounded-none">
                      <div className="p-0.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">Away-From-Home Return Coordination</h4>
                        <p className="text-[9px] text-[#5C6B5E] leading-normal mt-0.5">
                          If a covered member passes away more than 75 miles from home, the membership helps coordinate transportation back to the designated receiving funeral home, subject to plan terms.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start bg-[#FAF8F5] p-2 border border-[#E8E4DC] rounded-none">
                      <div className="p-0.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">One First Call for Your Family</h4>
                        <p className="text-[9px] text-[#5C6B5E] leading-normal mt-0.5">
                          Your family receives one dedicated number to call first before making arrangements. That helps reduce confusion and gives them a clear process during a difficult moment.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start bg-[#FAF8F5] p-2 border border-[#E8E4DC] rounded-none">
                      <div className="p-0.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">$75 Golf Club Shipping Credit</h4>
                        <p className="text-[9px] text-[#5C6B5E] leading-normal mt-0.5">
                          After membership activation, you receive a $75 credit toward a qualifying ShipSticks golf club shipment, subject to program terms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small note under table */}
                <p className="text-[9px] text-[#5C6B5E] text-center leading-normal max-w-sm mx-auto px-1 pt-0.5">
                  You pay $150 today. Your $75 golf club shipping credit is issued after paid membership activation and may be used toward a qualifying shipment. Effective first-year cost assumes the credit is redeemed. Terms apply.
                </p>

                {/* CTA Area */}
                <div className="space-y-1.5 pt-1 max-w-sm mx-auto">
                  <p className="text-[9px] text-[#5C6B5E] text-center leading-normal">
                    By continuing, you can activate your Travel Protection Club membership and unlock your $75 golf club shipping credit.
                  </p>
                  <Button 
                    onClick={() => setDemoStep("STRIPE_CHECKOUT")}
                    className="w-full min-h-10 py-2 px-3 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-[10px] tracking-wider uppercase rounded-none shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-normal text-center leading-normal"
                  >
                    <span>Activate My Membership + $75 Shipping Credit</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </Button>
                  <p className="text-[8px] text-[#A4B3A7] text-center italic">
                    You will review membership details and terms before final purchase.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Re-use bottom logos and footer on the offer screen to keep brand cohesion */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-center gap-2 md:gap-4 px-2">
                <img 
                  src="/manus-storage/57885_120b932a.png" 
                  alt="Travel Protection Club" 
                  className="h-10 md:h-13 object-contain shrink-0"
                />
                <div className="h-7 md:h-10 overflow-hidden shrink-0 flex items-center justify-center">
                  <img 
                    src="/manus-storage/cropped_shipsticks_dark_9caa446b.png" 
                    alt="Ship Sticks" 
                    className="h-[125%] object-contain scale-[1.0] origin-top translate-y-[-5%]"
                  />
                </div>
                <div className="h-9 w-9 md:h-11 md:w-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
                  <img 
                    src="/manus-storage/cropped_asb_dark_f202b5ec.png" 
                    alt="ASB Logo" 
                    className="h-[105%] w-[105%] object-cover scale-[0.95]"
                  />
                </div>
              </div>
              <div className="text-center px-4">
                <span className="text-[9px] text-[#5C6B5E] font-bold tracking-wider uppercase block leading-relaxed">
                  Compliments of <br />
                  THE TRAVEL PROTECTION CLUB & ASB ATHLETICS <br />
                  <span className="text-[#A4B3A7] font-medium text-[8px]">in conjunction with SHIP STICKS</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {step === "STRIPE_CHECKOUT" && (
          <div className="w-full max-w-sm mx-auto space-y-2 animate-fade-in">
            <Card className="border border-[#E8E4DC] shadow-[0_8px_30px_rgba(28,43,33,0.02)] bg-white rounded-none overflow-hidden">
              <div className="bg-[#FAF8F5] border-b border-[#E8E4DC] p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#107C41]" />
                  <span className="text-[10px] font-bold text-[#1C2B21] tracking-wider uppercase">Secure Stripe Checkout</span>
                </div>
                <div className="text-[8px] font-bold text-[#107C41] bg-[#EAF7EE] px-1.5 py-0.5 rounded-none">
                  SSL Encrypted
                </div>
              </div>

              <CardContent className="p-3 space-y-2.5">
                {/* Compact Order Summary */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-none p-2.5 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#5C6B5E]">
                    <span>1-Yr TPC Membership</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#107C41] font-bold">
                    <span>Ship Sticks Voucher</span>
                    <span>-$75.00 Rebate Held</span>
                  </div>
                  <div className="border-t border-[#E8E4DC] pt-1 flex justify-between text-xs font-bold text-[#1C2B21]">
                    <span>Total Due Today</span>
                    <span>$150.00</span>
                  </div>
                </div>

                <form onSubmit={handleStripeSubmit} className="space-y-2.5">
                  <div className="space-y-0.5">
                    <Label htmlFor="cardNumber" className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-wider">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={stripeData.cardNumber}
                      onChange={(e) => setStripeData({ ...stripeData, cardNumber: e.target.value })}
                      required
                      className="h-9 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-0.5">
                      <Label htmlFor="expiry" className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-wider">Expiration</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={stripeData.expiry}
                        onChange={(e) => setStripeData({ ...stripeData, expiry: e.target.value })}
                        required
                        className="h-9 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="cvc" className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-wider">CVC</Label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        value={stripeData.cvc}
                        onChange={(e) => setStripeData({ ...stripeData, cvc: e.target.value })}
                        required
                        className="h-9 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-0.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prefillStripeDemo}
                      className="flex-1 h-9 border-[#E8E4DC] text-[9px] font-bold text-[#5C6B5E] hover:bg-[#FAF8F5] active:scale-[0.98] rounded-none transition-all cursor-pointer"
                    >
                      Pref-fill Demo Card
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-9 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-[9px] tracking-wider uppercase rounded-none shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Authorize
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "SUCCESS" && (
          <div className="w-full space-y-4 animate-fade-in pb-6">
            {/* Pure, borderless, warm-sand success card */}
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-5">
                <div className="text-center space-y-2">
                  <div className="p-2 bg-[#EAF7EE] text-[#107C41] inline-flex rounded-full mb-1">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h1 className="text-2xl font-sans font-black tracking-tight text-black leading-tight">
                    You're Officially Protected!
                  </h1>
                  <div className="h-[2px] w-16 bg-[#E5C158] mx-auto mt-2" />
                </div>

                {/* EMOTIONALLY REASSURING AND ACTIONABLE MESSAGE */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] p-4 text-center space-y-3 rounded-none">
                  <p className="text-xs md:text-sm text-[#1C2B21] font-semibold leading-relaxed">
                    We have emailed your $75 Ship Sticks rebate code directly to <span className="text-[#107C41] font-bold">{formData.email || "your inbox"}</span>.
                  </p>
                  
                  <div className="h-[1px] bg-[#E8E4DC] w-full" />
                  
                  <p className="text-[11px] text-[#5C6B5E] leading-relaxed">
                    An email containing your permanent **Travel Protection Club** membership credentials and first-call guidelines has also been dispatched.
                  </p>
                </div>

                {/* ACTIVE VOUCHER CODE BOX - RE-STYLED WITHOUT ROUNDED CORNERS */}
                <div className="bg-white border border-[#107C41] p-4 text-center space-y-2 rounded-none shadow-sm">
                  <span className="text-[9px] font-bold text-[#107C41] tracking-widest uppercase block">
                    Your Active Ship Sticks Voucher Code
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-[#1C2B21] tracking-wider select-all">
                    TPC-75-GOLF
                  </div>
                  <p className="text-[10px] text-[#5C6B5E] leading-relaxed">
                    Apply this code at checkout on **ShipSticks.com** to receive your $75 discount instantly.
                  </p>
                </div>

                {/* COMPLETE-THE-LOOP GLOBAL 360 PORTAL CARD */}
                <div className="bg-[#FAF8F5] border border-[#E5C158] p-4 rounded-none space-y-3 shadow-sm">
                  <div className="flex gap-2.5 items-start">
                    <Shield className="w-5 h-5 text-[#107C41] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-black uppercase tracking-wider">Global 360 Assurance Portal</h4>
                      <p className="text-[11px] text-[#5C6B5E] leading-relaxed mt-1">
                        Access complete program details, view emergency contacts, and download family guidelines. If that unfortunate day happens, your family can log in here to activate instant repatriation support.
                      </p>
                    </div>
                  </div>
                  
                  <a 
                    href="https://global360assurance.com/tpc-member" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-11 border border-[#107C41] hover:bg-[#EAF7EE]/20 active:scale-[0.98] transition-all text-[#107C41] font-bold text-xs tracking-wider uppercase rounded-none flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <span>Visit Global 360 Assurance Website</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* FAQ AND TERMS SECTION - PURE CLASSIC ACCORDIONS */}
                <div className="space-y-2 pt-2">
                  {/* FAQ Accordion */}
                  <div className="border-b border-[#E8E4DC] pb-2">
                    <button 
                      onClick={() => setFaqOpen(!faqOpen)}
                      className="w-full flex justify-between items-center py-2 text-left text-xs font-bold text-[#5C6B5E] uppercase tracking-wider cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#107C41]" />
                        Frequently Asked Questions
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#5C6B5E] transition-transform ${faqOpen ? "rotate-180" : ""}`} />
                    </button>
                    {faqOpen && (
                      <div className="pt-2 pb-1 text-[11px] text-[#5C6B5E] space-y-3 leading-relaxed animate-fade-in">
                        <div>
                          <p className="font-bold text-black">Q: How do I activate my emergency protection?</p>
                          <p className="mt-0.5">A: In an emergency, simply call the dedicated First-Call number found in your welcome email. Our response center is staffed 24/7/365.</p>
                        </div>
                        <div>
                          <p className="font-bold text-black">Q: Is my family covered under my plan?</p>
                          <p className="mt-0.5">A: This individual membership covers the primary account holder. Family add-on options can be configured directly inside your Global 360 Assurance portal.</p>
                        </div>
                        <div>
                          <p className="font-bold text-black">Q: When does my Ship Sticks rebate expire?</p>
                          <p className="mt-0.5">A: Your $75 rebate code is valid for 12 months from the date of issuance and can be used on any domestic or international shipment.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Accordion */}
                  <div className="border-b border-[#E8E4DC] pb-2">
                    <button 
                      onClick={() => setTermsOpen(!termsOpen)}
                      className="w-full flex justify-between items-center py-2 text-left text-xs font-bold text-[#5C6B5E] uppercase tracking-wider cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#107C41]" />
                        Membership Terms & Disclosures
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#5C6B5E] transition-transform ${termsOpen ? "rotate-180" : ""}`} />
                    </button>
                    {termsOpen && (
                      <div className="pt-2 pb-1 text-[10px] text-[#5C6B5E] leading-relaxed space-y-2 animate-fade-in">
                        <p>
                          By enrolling in the Travel Protection Club, you agree to the annual membership fee of $150.00, which will automatically renew unless canceled at least 30 days prior to the renewal date.
                        </p>
                        <p>
                          Repatriation services are subject to geographic limitations and must be coordinated solely through our designated medical logistics partners. Self-coordinated transport is not eligible for reimbursement.
                        </p>
                        <p>
                          The $75 Ship Sticks rebate is provided in partnership with Ship Sticks and is subject to their standard shipping terms and conditions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Viral Share Button */}
                <Button 
                  onClick={handleShare}
                  className="w-full h-11 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <Share2 className="w-4 h-4" />
                  Share This Offer with Partners
                </Button>
              </CardContent>
            </Card>

            {/* Bottom co-branded logos on final screen */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-center gap-2 md:gap-4 px-2">
                <img 
                  src="/manus-storage/57885_120b932a.png" 
                  alt="Travel Protection Club" 
                  className="h-12 md:h-15 object-contain shrink-0"
                />
                <div className="h-8 md:h-11 overflow-hidden shrink-0 flex items-center justify-center">
                  <img 
                    src="/manus-storage/cropped_shipsticks_dark_9caa446b.png" 
                    alt="Ship Sticks" 
                    className="h-[125%] object-contain scale-[1.0] origin-top translate-y-[-5%]"
                  />
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
                  <img 
                    src="/manus-storage/cropped_asb_dark_f202b5ec.png" 
                    alt="ASB Logo" 
                    className="h-[105%] w-[105%] object-cover scale-[0.95]"
                  />
                </div>
              </div>
              <div className="text-center px-4">
                <span className="text-[9px] text-[#5C6B5E] font-bold tracking-wider uppercase block leading-relaxed">
                  COMPLEMENT of <br />
                  THE TRAVEL PROTECTION CLUB & ASB ATHLETICS <br />
                  <span className="text-[#A4B3A7] font-medium text-[8px]">in conjunction with SHIP STICKS</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
