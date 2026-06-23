import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronDown, ChevronRight, FileText, HelpCircle, Lock, Share2 } from "lucide-react";
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
const NON_MEMBER_HCP = 75;
const NON_MEMBER_NET = NON_MEMBER_SCORE + NON_MEMBER_HCP;
const ESTIMATED_MONTHLY_BENEFIT_COST = 9.88;

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
    title: "Travel Savings & Planning",
    body: "Travel savings and planning resources that help members find added value before, during, and after golf trips."
  },
  {
    title: "Roadside Assistance",
    body: "Road-trip support for golf weekends, tournaments, snowbird travel, airport drives, and course-to-course trips."
  },
  {
    title: "Health Advocate Support",
    body: "Healthcare navigation support to help members understand options, coordinate next steps, and know who to call first."
  },
  {
    title: "Teladoc",
    body: "Virtual care access for non-emergency medical questions when members are home, traveling, or away for golf weekends."
  },
  {
    title: "MRI & CT Scan Savings",
    body: "Included imaging-savings resources that may help members compare or reduce eligible MRI and CT scan costs."
  },
  {
    title: "Legal Services",
    body: "Access to legal support resources for travel, family, identity, document, and everyday personal matters, subject to program terms."
  },
  {
    title: "Everyday Member Deals",
    body: "Everyday savings and deal access for members looking for added value beyond the core travel-support benefits."
  },
  {
    title: "Lab Testing Savings",
    body: "Included lab-testing savings resources that may help members compare or reduce eligible testing costs."
  },
  {
    title: "Pharmacy Savings",
    body: "Included pharmacy savings resources for members and families, with access and savings subject to program availability."
  },
  {
    title: "Pet Rx Savings",
    body: "Included pet prescription savings resources for families who travel with pets or manage pet-care needs at home."
  },
  {
    title: "Counseling Services",
    body: "Confidential support resources for stress, family, work, and life situations that can come up before, during, or after travel."
  },
  {
    title: "WorkLife Family Support",
    body: "Everyday guidance resources designed to help members manage family, work, caregiving, and personal-life logistics."
  },
  {
    title: "Family Planning Support",
    body: "Planning and support resources for families facing difficult end-of-life logistics, subject to program terms."
  },
  {
    title: "Hearing Aid Savings",
    body: "Included hearing-aid savings resources for members and eligible family members, subject to provider terms and availability."
  },
  {
    title: "Contact Lens Savings",
    body: "Included contact-lens savings resources for everyday vision needs, subject to program terms and availability."
  },
  {
    title: "Diabetic Supply Savings",
    body: "Included savings resources for eligible diabetic supplies, subject to provider terms and program availability."
  },
  {
    title: "Vitamin Savings",
    body: "Included wellness-value access for vitamins and related everyday health savings through the member benefit program."
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

const scorecardTextStyle: React.CSSProperties = {
  fontFamily: "'Arial Black', Impact, Inter, system-ui, sans-serif",
  letterSpacing: "0.01em",
  fontVariantNumeric: "tabular-nums"
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

  const sendLeadToLiveWebhook = async (
    funnelStep: string,
    status: string,
    answers: Record<string, string> = {},
    extra: Record<string, unknown> = {}
  ) => {
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
      estimated_monthly_benefit_cost: ESTIMATED_MONTHLY_BENEFIT_COST,
      selected_benefits: includedBenefits.map((benefit) => benefit.title),
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
    await sendLeadToLiveWebhook("Payment Completed", "Active Golf Travel Benefits Member", formattedAnswers, {
      lead_type: "conversion",
      transaction_amount: SALE_PRICE
    });
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
      text: "Check out this co-branded golf travel benefit from The Travel Protection Club by Benefit Buddies in conjunction with ShipSticks by Ship&Play!",
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
      <div className="flex items-center justify-center gap-4 md:gap-7 px-4 md:px-12">
        <img src={LOGOS.tpc} alt="Travel Protection Club" className="h-16 md:h-20 object-contain shrink-0" />
        <img
          src={LOGOS.benefitBuddies}
          alt="Benefit Buddies"
          className="w-[102px] md:w-[156px] h-auto max-h-[43px] object-contain shrink-0"
        />
        <img src={LOGOS.shipSticks} alt="ShipSticks" className="h-10 md:h-14 object-contain shrink-0" />
      </div>
      <div className="text-center px-4 mt-1">
        <div className="text-[9px] md:text-[10px] text-[#5C6B5E] font-bold tracking-wider block leading-relaxed">
          <div>Compliments of</div>
          <div>THE TRAVEL PROTECTION CLUB by BENEFIT BUDDIES</div>
          <div className="text-[#A4B3A7] font-medium text-[8px] md:text-[9px]">in conjunction with ShipSticks by Ship&amp;Play</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2B21] font-sans antialiased flex flex-col justify-between overflow-x-hidden pt-1 pb-4 px-4">
      <main className={`flex-1 mx-auto w-full flex flex-col space-y-2 ${step === "QUIZ" ? "justify-start my-0 pt-5" : "justify-center my-auto"} ${step === "OFFER" ? "max-w-[720px]" : "max-w-md"}`}>
        {step === "OPT_IN" && (
          <div className="space-y-0 w-full animate-fade-in">
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-2">
                <div className="text-center space-y-2 -translate-y-6 mb-6">
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
          <div className="w-full min-h-screen animate-fade-in">
            <div className="sticky top-0 z-20 bg-[#FDFBF7] pt-5 pb-4 border-b border-transparent">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider px-1">
                <span>Golf Travel Planner</span>
                <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              </div>
              <div className="h-1 w-full bg-[#E8E4DC] rounded-none overflow-hidden mt-4">
                <div className="h-full bg-[#107C41] transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }} />
              </div>
            </div>
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-2.5 pt-12 space-y-6">
                <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-black text-center leading-tight max-w-xs mx-auto">{quizQuestions[currentQuestionIndex].question}</h2>
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
          <div className="w-full space-y-3 animate-fade-in py-2 md:py-5">
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0 space-y-3 md:space-y-4">
                <div className="text-center space-y-2 max-w-[560px] mx-auto">
                  <h1 className="text-2xl md:text-4xl font-sans font-black tracking-tight text-black leading-tight">
                    Your clubs have a way home. Now make sure you do too.
                  </h1>
                  <div className="h-[3px] w-20 bg-[#E5C158] mx-auto" />
                  <p className="text-sm md:text-lg text-[#3A4A3D] font-serif font-bold leading-snug px-2">
                    TPC Members get year-round travel support, family-first call guidance, everyday member benefits, and a $75 ShipSticks voucher after activation.
                  </p>
                </div>

                <div className="w-full max-w-[560px] mx-auto border-[3px] border-[#13263A] bg-white shadow-md rounded-none overflow-hidden">
                  <div className="bg-[#13263A] text-white text-center py-3 px-2 text-xs md:text-lg font-black uppercase tracking-[0.18em]">
                    Your First Year TPC Member Scorecard
                  </div>
                  <div className="grid grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr] bg-[#FDFBF7] border-b-[3px] border-[#13263A] text-[#13263A]">
                    <div className="p-2 border-r-2 border-[#13263A]" />
                    <div className="p-2 border-r-2 border-[#13263A] flex items-center justify-center text-center font-serif text-sm md:text-xl font-black uppercase">Gross</div>
                    <div className="p-2 border-r-2 border-[#13263A] flex items-center justify-center text-center font-serif text-sm md:text-xl font-black uppercase">HCP</div>
                    <div className="p-2 flex items-center justify-center text-center font-serif text-sm md:text-xl font-black uppercase">Net</div>
                  </div>
                  <div className="grid grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr] min-h-[78px] md:min-h-[96px] text-[#1C2B21] border-b-2 border-[#13263A]">
                    <div className="p-1.5 md:p-2 border-r-2 border-[#13263A] flex items-center justify-center text-center text-base md:text-2xl font-black text-black leading-tight" style={scorecardTextStyle}>Non-<br />Member</div>
                    <div className="p-1.5 md:p-2 border-r-2 border-[#13263A] flex items-center justify-center text-center text-xl md:text-3xl font-black text-black" style={scorecardTextStyle}>${NON_MEMBER_SCORE}</div>
                    <div className="p-1.5 md:p-2 border-r-2 border-[#13263A] flex items-center justify-center text-center text-lg md:text-2xl font-black text-black" style={scorecardTextStyle}>+${NON_MEMBER_HCP}</div>
                    <div className="p-1.5 md:p-2 flex items-center justify-center text-center text-xl md:text-3xl font-black text-black" style={scorecardTextStyle}>${NON_MEMBER_NET}</div>
                  </div>
                  <div className="grid grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr] min-h-[86px] md:min-h-[104px] bg-[#EAF7EE] text-[#107C41]">
                    <div className="p-1.5 md:p-2 border-r-2 border-[#13263A] flex items-center justify-center">
                      <img src={LOGOS.tpc} alt="TPC" className="h-14 w-14 md:h-20 md:w-20 object-contain" />
                    </div>
                    <div className="p-1.5 md:p-2 border-r-2 border-[#13263A] flex items-center justify-center text-center text-xl md:text-3xl font-black text-[#107C41]" style={scorecardTextStyle}>${SALE_PRICE}</div>
                    <div className="p-1.5 md:p-2 border-r-2 border-[#13263A] flex items-center justify-center text-center text-xl md:text-3xl font-black text-red-600" style={scorecardTextStyle}>-${GOLF_SHIPPING_CREDIT}</div>
                    <div className="p-1 flex items-center justify-center text-center relative overflow-hidden">
                      <span className="relative inline-flex items-center justify-center text-xl md:text-3xl font-black text-[#107C41] px-1.5 py-1" style={scorecardTextStyle}>
                        ${EFFECTIVE_FIRST_YEAR_COST}
                        <span className="absolute -inset-x-1 -inset-y-0.5 border-[3px] border-red-600 rounded-[20%] rotate-[3deg] pointer-events-none" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 max-w-[560px] mx-auto">
                  <Button onClick={handleCheckoutStart} className="w-full min-h-[58px] md:min-h-[64px] bg-[#107C41] hover:bg-[#0C6233] text-white font-black text-sm md:text-xl tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-3 cursor-pointer whitespace-normal text-center leading-tight active:scale-[0.97] transition-all px-4 py-3">
                    <span>Activate My TPC Membership</span>
                    <ChevronRight className="w-5 h-5 shrink-0" />
                  </Button>
                  <p className="text-[10px] md:text-xs text-center text-[#5C6B5E] font-bold uppercase tracking-wider">Activate now to unlock your $75 ShipSticks voucher after enrollment.</p>
                </div>

                <div className="space-y-2 pt-2 max-w-[560px] mx-auto">
                  <h3 className="text-xs md:text-base font-bold text-[#5C6B5E] uppercase tracking-[0.18em] text-center">Your Annual TPC Member Benefits</h3>
                  <p className="text-[10px] md:text-xs text-center text-[#5C6B5E] font-bold uppercase tracking-wider leading-relaxed">An 18-hole member course of travel protection, family-first guidance, health support, and everyday savings.</p>
                  <div className="space-y-2">
                    {includedBenefits.map((benefit, index) => (
                      <div key={benefit.title} className="flex gap-3 items-start bg-[#FAF8F5] p-3 md:p-4 border border-[#E8E4DC] rounded-none">
                        <div className="h-9 w-9 md:h-10 md:w-10 bg-[#EAF7EE] text-[#107C41] shrink-0 mt-0.5 flex items-center justify-center rounded-full border border-[#107C41]/20 font-black text-sm md:text-base" style={scorecardTextStyle}>{index + 1}</div>
                        <div>
                          <div className="text-[9px] md:text-[10px] text-[#107C41] font-black uppercase tracking-[0.22em] mb-1">Hole {index + 1}</div>
                          <h4 className="text-sm md:text-lg font-bold text-black uppercase tracking-wider">{benefit.title}</h4>
                          <p className="text-sm md:text-base text-[#5C6B5E] leading-normal mt-1 font-serif">{benefit.body}</p>
                        </div>
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
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-none p-2.5 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#5C6B5E]"><span>Annual TPC Membership</span><span>${SALE_PRICE.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[11px] text-[#107C41] font-bold"><span>Includes $75 ShipSticks Voucher</span><span>Included</span></div>
                  <div className="border-t border-[#E8E4DC] pt-1 flex justify-between text-xs font-bold text-[#1C2B21]"><span>Total Due Today</span><span>${SALE_PRICE.toFixed(2)}</span></div>
                </div>
                <p className="text-[9px] text-[#5C6B5E] leading-normal text-center px-1">Your $75 ShipSticks voucher will be delivered after activation. Terms apply.</p>
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
                  <div className="border-b border-[#E8E4DC] pb-2"><button onClick={() => setFaqOpen(!faqOpen)} className="w-full flex justify-between items-center py-2 text-left text-xs font-bold text-[#5C6B5E] uppercase tracking-wider cursor-pointer"><span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-[#107C41]" />Frequently Asked Questions</span><ChevronDown className={`w-4 h-4 text-[#5C6B5E] transition-transform ${faqOpen ? "rotate-180" : ""}`} /></button>{faqOpen && (<div className="pt-2 pb-1 text-[11px] text-[#5C6B5E] space-y-3 leading-relaxed animate-fade-in"><div><p className="font-bold text-black">Q: Is this only for repatriation?</p><p className="mt-0.5">A: No. The package now positions repatriation/return coordination as one serious-family-protection benefit inside a broader golf travel package.</p></div><div><p className="font-bold text-black">Q: What travel benefits are represented?</p><p className="mt-0.5">A: The page represents travel assistance, travel savings, roadside support, health advocacy, telehealth, legal support resources, counseling, WorkLife, diagnostic savings, pharmacy savings, everyday deals, and family-first guidance.</p></div><div><p className="font-bold text-black">Q: Is this insurance?</p><p className="mt-0.5">A: This page intentionally describes the offer as a membership and non-insured benefit package. Final supplier-approved language should be used before launch.</p></div></div>)}</div>
                  <div className="border-b border-[#E8E4DC] pb-2"><button onClick={() => setTermsOpen(!termsOpen)} className="w-full flex justify-between items-center py-2 text-left text-xs font-bold text-[#5C6B5E] uppercase tracking-wider cursor-pointer"><span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#107C41]" />Membership Terms & Disclosures</span><ChevronDown className={`w-4 h-4 text-[#5C6B5E] transition-transform ${termsOpen ? "rotate-180" : ""}`} /></button>{termsOpen && (<div className="pt-2 pb-1 text-[10px] text-[#5C6B5E] leading-relaxed space-y-2 animate-fade-in"><p>By enrolling in the annual Travel Protection Club Golf Travel Benefits Package, you agree to the displayed ${SALE_PRICE.toFixed(2)} membership fee and renewal terms shown during final checkout.</p><p>Benefits are subject to supplier terms, eligibility rules, geographic limits, activation requirements, and availability. Services must be coordinated through the designated benefit provider when applicable.</p><p>The golf club shipping voucher is a promotional activation bonus and is subject to redemption instructions, supplier rules, and expiration terms.</p></div>)}</div>
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
