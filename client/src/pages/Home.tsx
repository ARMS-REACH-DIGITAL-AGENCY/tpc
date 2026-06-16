import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CheckCircle2, ChevronDown, ChevronRight, FileText, HelpCircle, Lock, Share2 } from "lucide-react";
import { toast } from "sonner";

type DemoStep = "OPT_IN" | "QUIZ" | "OFFER" | "STRIPE_CHECKOUT" | "SUCCESS";

interface QuizAnswer {
  questionId: string;
  answer: string;
}

const SALE_PRICE = 199;
const GOLF_SHIPPING_CREDIT = 75;
const EFFECTIVE_FIRST_YEAR_COST = SALE_PRICE - GOLF_SHIPPING_CREDIT;
const NON_MEMBER_SCORE = 445;

const LOGOS = {
  tpc: "/assets/logos/tpc-shield-logo.png",
  benefitBuddies: "/assets/logos/benefit-buddies-logo.png",
  shipSticks: "/assets/logos/shipsticks-logo.png"
};

const includedBenefits = [
  {
    title: "Global Travel Assistance",
    body: "Emergency travel support for medical referrals, lost or stolen travel documents, legal/referral needs, evacuation coordination, and other away-from-home problems."
  },
  {
    title: "Away-From-Home Return Coordination",
    body: "If the worst happens while traveling, the package helps the family understand who to call first and how covered return-of-remains support is coordinated, subject to plan terms."
  },
  {
    title: "Roadside Assistance",
    body: "Road-trip support for golf weekends, tournaments, snowbird travel, airport drives, and course-to-course trips."
  },
  {
    title: "Telehealth + Everyday Savings",
    body: "Useful non-emergency value such as virtual care, travel savings, lifestyle discounts, and other bundled member benefits when available in the selected package."
  },
  {
    title: "Identity + Document Support",
    body: "Protection-minded help for lost documents, identity-related disruptions, and travel-security concerns."
  }
];

const quizQuestions = [
  {
    id: "travel_freq",
    question: "How often do you travel for golf, tournaments, or weekend getaways?",
    options: ["3+ times a year", "Once or twice a year", "Rarely", "Planning my first golf trip"]
  },
  {
    id: "worry_factor",
    question: "What travel problem would be most stressful on a golf trip?",
    options: ["Medical emergency away from home", "Car trouble on the road", "Lost documents or logistics", "Damage or delays with my clubs"]
  },
  {
    id: "planner_mindset",
    question: "When you travel, do you already have a clear emergency plan?",
    options: ["Yes, written and shared", "Somewhat", "Not really", "I have never thought about it"]
  },
  {
    id: "first_call_gap",
    question: "If something serious happened away from home, would your family know exactly who to call first?",
    options: ["Yes", "Not entirely sure", "Probably not", "We need a better plan"]
  }
];

const pencilScoreStyle: React.CSSProperties = {
  fontFamily: "'Comic Sans MS', 'Bradley Hand', 'Segoe Print', cursive",
  textShadow: "1px 2px 2px rgba(0,0,0,0.32)",
  letterSpacing: "0.02em"
};

export default function Home() {
  const [step, setDemoStep] = useState<DemoStep>("OPT_IN");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerViewTracked, setOfferViewTracked] = useState(false);
  const [stripeData, setStripeData] = useState({ cardNumber: "", expiry: "", cvc: "" });
  const [faqOpen, setFaqOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const formattedAnswers = quizAnswers.reduce((acc, curr) => {
    acc[curr.questionId] = curr.answer;
    return acc;
  }, {} as Record<string, string>);

  const sendLeadToLiveWebhook = async (funnelStep: string, status: string, answers: Record<string, string> = {}, extra: Record<string, unknown> = {}) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      funnel_step: funnelStep,
      status,
      campaign: "TPC Golf Travel Benefits Bundle",
      source: "TPC_Golf_Travel_Funnel",
      tag: "Golf_Travel_Benefits",
      partner: "Benefit Buddies",
      product: "Annual Travel Protection Club Membership",
      sale_price: SALE_PRICE,
      golf_shipping_credit: GOLF_SHIPPING_CREDIT,
      effective_first_year_cost: EFFECTIVE_FIRST_YEAR_COST,
      quiz_answers: answers,
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...extra
    };

    try {
      const response = await fetch("/api/arms-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.ok === false) {
        console.error("ARMS webhook proxy error:", result);
        toast.error("Lead capture did not reach ARMS. Check webhook environment variable.");
      }
    } catch (err) {
      console.error("ARMS webhook request failed:", err);
      toast.error("Lead capture connection failed.");
    }
  };

  const handleOptInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setIsSubmitting(true);
    await sendLeadToLiveWebhook("Opt-In", "Golf Travel Lead Captured", {}, { lead_type: "front_end_rebate_opt_in" });
    setIsSubmitting(false);
    toast.success("Contact info saved!");
    setDemoStep("QUIZ");
  };

  const handleQuizAnswer = async (answer: string) => {
    const updatedAnswers = [...quizAnswers, { questionId: quizQuestions[currentQuestionIndex].id, answer }];
    setQuizAnswers(updatedAnswers);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }

    const answers = updatedAnswers.reduce((acc, curr) => {
      acc[curr.questionId] = curr.answer;
      return acc;
    }, {} as Record<string, string>);
    await sendLeadToLiveWebhook("Quiz Completed", "Segmented Golf Travel Lead", answers, { lead_type: "qualified_quiz_completion" });
    setDemoStep("OFFER");
  };

  useEffect(() => {
    if (step === "OFFER" && !offerViewTracked && formData.email) {
      setOfferViewTracked(true);
      void sendLeadToLiveWebhook("Offer Viewed", "Scorecard Conversion Page Viewed", formattedAnswers, { lead_type: "offer_view" });
    }
  }, [step, offerViewTracked, formData.email]);

  const handleCheckoutStart = async () => {
    await sendLeadToLiveWebhook("Checkout Started", "High Intent Prospect", formattedAnswers, { lead_type: "checkout_intent" });
    setDemoStep("STRIPE_CHECKOUT");
  };

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeData.cardNumber || !stripeData.expiry || !stripeData.cvc) {
      toast.error("Please enter your card details.");
      return;
    }
    setIsSubmitting(true);
    await sendLeadToLiveWebhook("Payment Completed", "Active Golf Travel Benefits Member", formattedAnswers, { lead_type: "conversion", transaction_amount: SALE_PRICE });
    setIsSubmitting(false);
    toast.success("Payment Authorized Successfully!");
    setDemoStep("SUCCESS");
  };

  const prefillStripeDemo = () => {
    setStripeData({ cardNumber: "4242 •••• •••• 4242", expiry: "12/28", cvc: "123" });
    toast.info("Demo card details pre-filled.");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Exclusive $75 Ship Sticks Rebate",
      text: "Check out this co-branded golf travel benefit from The Travel Protection Club & Benefit Buddies in conjunction with Ship Sticks!",
      url: window.location.origin
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
      }
      toast.success("Offer link shared!");
    } catch {
      toast.error("Unable to share link.");
    }
  };

  const BrandFooter = () => (
    <div className="space-y-0 mt-0">
      <div className="flex items-center justify-center gap-5 md:gap-8 px-2">
        <img src={LOGOS.tpc} alt="Travel Protection Club" className="h-16 md:h-20 object-contain shrink-0" />
        <img src={LOGOS.benefitBuddies} alt="Benefit Buddies" className="h-36 w-36 md:h-40 md:w-40 object-contain shrink-0" />
        <img src={LOGOS.shipSticks} alt="ShipSticks" className="h-12 md:h-16 object-contain shrink-0" />
      </div>
      <div className="text-center px-4">
        <span className="text-[9px] md:text-[10px] text-[#5C6B5E] font-bold tracking-wider uppercase block leading-relaxed">
          Compliments of <br />
          THE TRAVEL PROTECTION CLUB & BENEFIT BUDDIES <br />
          <span className="text-[#A4B3A7] font-medium text-[8px] md:text-[9px]">in conjunction with SHIP STICKS</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2B21] font-sans antialiased flex flex-col justify-between overflow-x-hidden pt-1 pb-4 px-4">
      <main className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center my-auto space-y-2">
        {step === "OPT_IN" && (
          <div className="space-y-2 w-full animate-fade-in">
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-4">
                <div className="text-center space-y-2">
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
                    <Label htmlFor="name" className="text-[10px] font-bold text-[#5C6B5E] tracking-wider uppercase">Full Name</Label>
                    <Input id="name" type="text" placeholder="Happy Gilmore" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-11 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-[10px] font-bold text-[#5C6B5E] tracking-wider uppercase">Email Address</Label>
                    <Input id="email" type="email" placeholder="happy@gilmore.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-11 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-[10px] font-bold text-[#5C6B5E] tracking-wider uppercase">Mobile Number <span className="text-[#A4B3A7] font-normal">(Optional)</span></Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-11 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]" />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full min-h-12 py-3 px-4 bg-[#107C41] hover:bg-[#0C6233] active:scale-[0.98] transition-all text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer whitespace-normal text-center leading-normal">
                    <span>{isSubmitting ? "Securing..." : "ACTIVATE YOUR $75 SHIP STICKS REBATE NOW!"}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </Button>
                </form>
              </CardContent>
            </Card>
            <BrandFooter />
          </div>
        )}

        {step === "QUIZ" && (
          <div className="w-full space-y-2 animate-fade-in">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider px-1 pt-1">
              <span>Golf Travel Planner</span>
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            </div>
            <div className="h-1 w-full bg-[#E8E4DC] rounded-none overflow-hidden">
              <div className="h-full bg-[#107C41] transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }} />
            </div>
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-2.5 space-y-4">
                <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-black text-center leading-tight max-w-xs mx-auto pt-2">{quizQuestions[currentQuestionIndex].question}</h2>
                <div className="space-y-2 max-w-sm mx-auto pt-2">
                  {quizQuestions[currentQuestionIndex].options.map((option) => (
                    <button key={option} onClick={() => handleQuizAnswer(option)} className="w-full p-3 text-left border border-[#E8E4DC] hover:border-[#107C41] hover:bg-[#EAF7EE]/20 active:scale-[0.99] transition-all rounded-none text-xs font-bold text-[#1C2B21] flex items-center justify-between group cursor-pointer bg-white">
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
          <div className="w-full max-w-[760px] mx-auto space-y-3 animate-fade-in">
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-3">
                <div className="text-center space-y-1.5">
                  <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-black leading-tight max-w-4xl mx-auto">
                    Good job — you now have a plan to get your clubs home safely.
                  </h1>
                  <div className="h-[3px] w-24 bg-[#E5C158] mx-auto my-3" />
                  <p className="text-base md:text-2xl text-[#3A4A3D] font-serif font-bold max-w-3xl mx-auto leading-snug px-1">
                    Travel Protection Club Members also have an annual plan that helps their family members know who to call first and what steps to take if something happens away from home.
                  </p>
                </div>

                <div className="max-w-[740px] mx-auto border-[4px] border-[#13263A] bg-white shadow-md rounded-none overflow-hidden">
                  <div className="bg-[#13263A] text-white text-center py-4 text-base md:text-2xl font-black uppercase tracking-[0.25em]">
                    Your First Year TPC Member Scorecard
                  </div>
                  <div className="grid grid-cols-[1.45fr_0.85fr_0.9fr_0.85fr] bg-[#FDFBF7] border-b-[4px] border-[#13263A] text-[#13263A]">
                    <div className="p-3 border-r-[3px] border-[#13263A]" />
                    <div className="p-3 border-r-[3px] border-[#13263A] flex items-center justify-center text-center font-serif text-xl md:text-3xl font-black uppercase tracking-wide">Gross</div>
                    <div className="p-3 border-r-[3px] border-[#13263A] flex items-center justify-center text-center font-serif text-xl md:text-3xl font-black uppercase tracking-wide">HCP</div>
                    <div className="p-3 flex items-center justify-center text-center font-serif text-xl md:text-3xl font-black uppercase tracking-wide">Net</div>
                  </div>
                  <div className="grid grid-cols-[1.45fr_0.85fr_0.9fr_0.85fr] min-h-[92px] md:min-h-[112px] text-[#1C2B21] border-b-[3px] border-[#13263A]">
                    <div className="p-2 border-r-[3px] border-[#13263A] flex items-center justify-center text-center text-2xl md:text-4xl font-black text-black -rotate-2 leading-tight" style={pencilScoreStyle}>Non-Member</div>
                    <div className="p-2 border-r-[3px] border-[#13263A] flex items-center justify-center text-center text-3xl md:text-5xl font-black text-black" style={pencilScoreStyle}>${NON_MEMBER_SCORE}</div>
                    <div className="p-2 border-r-[3px] border-[#13263A] flex items-center justify-center text-center">
                      <span className="block w-20 md:w-28 h-2 md:h-3 bg-[#13263A] rounded-full rotate-[-28deg] shadow-sm" />
                    </div>
                    <div className="p-2 flex items-center justify-center text-center text-3xl md:text-5xl font-black text-black" style={pencilScoreStyle}>${NON_MEMBER_SCORE}</div>
                  </div>
                  <div className="grid grid-cols-[1.45fr_0.85fr_0.9fr_0.85fr] min-h-[105px] md:min-h-[130px] bg-[#EAF7EE] text-[#107C41]">
                    <div className="p-2 border-r-[3px] border-[#13263A] flex items-center justify-center gap-2">
                      <img src={LOGOS.tpc} alt="TPC" className="h-12 w-12 md:h-16 md:w-16 object-contain shrink-0" />
                      <span className="text-2xl md:text-4xl font-black text-[#107C41] -rotate-2 leading-tight" style={pencilScoreStyle}>Member<br />Year 1</span>
                    </div>
                    <div className="p-2 border-r-[3px] border-[#13263A] flex items-center justify-center text-center text-3xl md:text-5xl font-black text-[#107C41]" style={pencilScoreStyle}>${SALE_PRICE}</div>
                    <div className="p-2 border-r-[3px] border-[#13263A] flex items-center justify-center text-center text-3xl md:text-5xl font-black text-red-600" style={pencilScoreStyle}>$-{GOLF_SHIPPING_CREDIT}</div>
                    <div className="p-1 flex items-center justify-center text-center relative overflow-visible">
                      <span className="relative inline-flex items-center justify-center text-3xl md:text-5xl font-black text-[#107C41] px-2 py-2" style={pencilScoreStyle}>
                        ${EFFECTIVE_FIRST_YEAR_COST}
                        <span className="absolute -inset-x-2 -inset-y-1 border-[5px] border-red-600 rounded-[20%] rotate-[3deg] pointer-events-none" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-0.5 max-w-[740px] mx-auto">
                  <Button onClick={handleCheckoutStart} className="w-full min-h-[72px] p-0 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-sm md:text-2xl tracking-wider uppercase rounded-none shadow-md flex items-stretch justify-center gap-0 cursor-pointer whitespace-normal text-center leading-tight active:scale-[0.97] transition-all overflow-hidden">
                    <span className="bg-[#13263A] px-4 md:px-8 py-3 flex items-center justify-center shrink-0 min-w-[135px] md:min-w-[220px]">
                      <img src={LOGOS.shipSticks} alt="ShipSticks" className="h-10 md:h-16 object-contain" />
                    </span>
                    <span className="flex-1 px-3 md:px-6 py-2 flex items-center justify-center" style={pencilScoreStyle}>ACTIVATE MY TPC MEMBERSHIP + $75 SHIPSTICKS REBATE</span>
                    <ChevronRight className="w-6 h-6 shrink-0 self-center mr-4" />
                  </Button>
                </div>

                <div className="space-y-2 pt-4 max-w-[740px] mx-auto">
                  <h3 className="text-sm md:text-xl font-bold text-[#5C6B5E] uppercase tracking-[0.25em] text-center">YOUR ANNUAL TPC MEMBER PLAN INCLUDES:</h3>
                  <div className="space-y-3">
                    {includedBenefits.map((benefit) => (
                      <div key={benefit.title} className="flex gap-4 items-start bg-[#FAF8F5] p-4 md:p-6 border border-[#E8E4DC] rounded-none">
                        <div className="p-1.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5"><Check className="w-4 h-4 md:w-6 md:h-6" /></div>
                        <div><h4 className="text-lg md:text-2xl font-bold text-black uppercase tracking-wider">{benefit.title}</h4><p className="text-base md:text-xl text-[#5C6B5E] leading-normal mt-2 font-serif">{benefit.body}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <BrandFooter />
          </div>
        )}

        {step === "STRIPE_CHECKOUT" && (
          <div className="w-full max-w-sm mx-auto space-y-2 animate-fade-in">
            <Card className="border border-[#E8E4DC] shadow-[0_8px_30px_rgba(28,43,33,0.02)] bg-white rounded-none overflow-hidden">
              <div className="bg-[#FAF8F5] border-b border-[#E8E4DC] p-2.5 flex items-center justify-between"><div className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-[#107C41]" /><span className="text-[10px] font-bold text-[#1C2B21] tracking-wider uppercase">Secure Stripe Checkout</span></div><div className="text-[8px] font-bold text-[#107C41] bg-[#EAF7EE] px-1.5 py-0.5 rounded-none">SSL Encrypted</div></div>
              <CardContent className="p-3 space-y-2.5">
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-none p-2.5 space-y-1"><div className="flex justify-between text-[11px] text-[#5C6B5E]"><span>Annual TPC Membership</span><span>${SALE_PRICE.toFixed(2)}</span></div><div className="flex justify-between text-[11px] text-[#107C41] font-bold"><span>Golf Club Shipping Credit</span><span>-${GOLF_SHIPPING_CREDIT.toFixed(2)} Rebate Held</span></div><div className="border-t border-[#E8E4DC] pt-1 flex justify-between text-xs font-bold text-[#1C2B21]"><span>Total Due Today</span><span>${SALE_PRICE.toFixed(2)}</span></div></div>
                <form onSubmit={handleStripeSubmit} className="space-y-2.5">
                  <div className="space-y-0.5"><Label htmlFor="cardNumber" className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-wider">Card Number</Label><Input id="cardNumber" type="text" placeholder="4242 4242 4242 4242" value={stripeData.cardNumber} onChange={(e) => setStripeData({ ...stripeData, cardNumber: e.target.value })} required className="h-9 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all" /></div>
                  <div className="grid grid-cols-2 gap-2.5"><div className="space-y-0.5"><Label htmlFor="expiry" className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-wider">Expiration</Label><Input id="expiry" type="text" placeholder="MM/YY" value={stripeData.expiry} onChange={(e) => setStripeData({ ...stripeData, expiry: e.target.value })} required className="h-9 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all" /></div><div className="space-y-0.5"><Label htmlFor="cvc" className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-wider">CVC</Label><Input id="cvc" type="text" placeholder="123" value={stripeData.cvc} onChange={(e) => setStripeData({ ...stripeData, cvc: e.target.value })} required className="h-9 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all" /></div></div>
                  <div className="flex gap-2.5 pt-0.5"><Button type="button" variant="outline" onClick={prefillStripeDemo} className="flex-1 h-9 border-[#E8E4DC] text-[9px] font-bold text-[#5C6B5E] hover:bg-[#FAF8F5] active:scale-[0.98] rounded-none transition-all cursor-pointer">Prefill Demo Card</Button><Button type="submit" className="flex-1 h-9 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-[9px] tracking-wider uppercase rounded-none shadow-sm active:scale-[0.98] transition-all cursor-pointer">Authorize</Button></div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "SUCCESS" && (
          <div className="w-full space-y-4 animate-fade-in pb-6">
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-5">
                <div className="text-center space-y-2"><div className="p-2 bg-[#EAF7EE] text-[#107C41] inline-flex rounded-full mb-1"><CheckCircle2 className="w-10 h-10" /></div><h1 className="text-2xl font-sans font-black tracking-tight text-black leading-tight">Your Annual TPC Membership Is Activated</h1><div className="h-[2px] w-16 bg-[#E5C158] mx-auto mt-2" /></div>
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] p-4 text-center space-y-3 rounded-none"><p className="text-xs md:text-sm text-[#1C2B21] font-semibold leading-relaxed">We have emailed your welcome details and golf club shipping credit instructions to <span className="text-[#107C41] font-bold">{formData.email || "your inbox"}</span>.</p><div className="h-[1px] bg-[#E8E4DC] w-full" /><p className="text-[11px] text-[#5C6B5E] leading-relaxed">Your Benefit Buddies package is designed to help with travel assistance, roadside issues, first-call family guidance, and practical member benefits before the next trip.</p></div>
                <div className="bg-white border border-[#107C41] p-4 text-center space-y-2 rounded-none shadow-sm"><span className="text-[9px] font-bold text-[#107C41] tracking-widest uppercase block">Your Active Golf Shipping Credit Code</span><div className="text-xl font-mono font-extrabold text-[#107C41] bg-[#EAF7EE]/30 py-1.5 px-3 border border-dashed border-[#107C41]/30 tracking-wider select-all inline-block rounded-none">TPC-GOLF-75-{formData.email ? formData.email.split("@")[0].substring(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000) : "A8B9D"}</div><p className="text-[10px] text-[#5C6B5E] leading-relaxed">Use this code according to the shipping-credit instructions in your welcome email. Supplier and redemption terms apply.</p><div className="text-[9px] text-[#8C9B8E] bg-[#FAF8F5] border border-[#E8E4DC] p-2 rounded-none leading-normal text-left mt-1"><span className="font-bold text-[#5C6B5E] block uppercase tracking-wider text-[8px] mb-0.5">SECURED BY ARMS CRM API</span>This unique code is linked to <strong>{formData.email || "your email"}</strong> and should be used only by the activated member.</div></div>
                <div className="bg-[#FAF8F5] border border-[#E5C158] p-4 rounded-none space-y-3 shadow-sm"><div className="flex gap-2.5 items-start"><FileText className="w-5 h-5 text-[#107C41] shrink-0 mt-0.5" /><div><h4 className="text-xs font-bold text-black uppercase tracking-wider">Your Travel Benefits Portal</h4><p className="text-[11px] text-[#5C6B5E] leading-relaxed mt-1">Review benefit access instructions, emergency contact guidance, roadside assistance details, telehealth/savings resources, and family first-call steps before your next trip.</p></div></div></div>
                <div className="space-y-2 pt-2">
                  <div className="border-b border-[#E8E4DC] pb-2"><button onClick={() => setFaqOpen(!faqOpen)} className="w-full flex justify-between items-center py-2 text-left text-xs font-bold text-[#5C6B5E] uppercase tracking-wider cursor-pointer"><span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-[#107C41]" />Frequently Asked Questions</span><ChevronDown className={`w-4 h-4 text-[#5C6B5E] transition-transform ${faqOpen ? "rotate-180" : ""}`} /></button>{faqOpen && (<div className="pt-2 pb-1 text-[11px] text-[#5C6B5E] space-y-3 leading-relaxed animate-fade-in"><div><p className="font-bold text-black">Q: Is this only for repatriation?</p><p className="mt-0.5">A: No. The package now positions repatriation/return coordination as one serious-family-protection benefit inside a broader golf travel package.</p></div><div><p className="font-bold text-black">Q: What travel benefits are represented?</p><p className="mt-0.5">A: The page represents global travel assistance, roadside assistance, lost document support, emergency coordination, telehealth/savings-style resources, identity support, and golf shipping credit value.</p></div><div><p className="font-bold text-black">Q: Is this insurance?</p><p className="mt-0.5">A: This page intentionally describes the offer as a membership and non-insured benefit package. Final supplier-approved language should be used before launch.</p></div></div>)}</div>
                  <div className="border-b border-[#E8E4DC] pb-2"><button onClick={() => setTermsOpen(!termsOpen)} className="w-full flex justify-between items-center py-2 text-left text-xs font-bold text-[#5C6B5E] uppercase tracking-wider cursor-pointer"><span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#107C41]" />Membership Terms & Disclosures</span><ChevronDown className={`w-4 h-4 text-[#5C6B5E] transition-transform ${termsOpen ? "rotate-180" : ""}`} /></button>{termsOpen && (<div className="pt-2 pb-1 text-[10px] text-[#5C6B5E] leading-relaxed space-y-2 animate-fade-in"><p>By enrolling in the annual Travel Protection Club Golf Travel Benefits Package, you agree to the displayed ${SALE_PRICE.toFixed(2)} membership fee and renewal terms shown during final checkout.</p><p>Benefits are subject to supplier terms, eligibility rules, geographic limits, activation requirements, and availability. Services must be coordinated through the designated benefit provider when applicable.</p><p>The golf club shipping credit is a promotional benefit and is subject to redemption instructions, supplier rules, and expiration terms.</p></div>)}</div>
                </div>
                <Button onClick={handleShare} className="w-full h-11 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"><Share2 className="w-4 h-4" />Share This Offer with Partners</Button>
              </CardContent>
            </Card>
            <BrandFooter />
          </div>
        )}
      </main>
    </div>
  );
}
