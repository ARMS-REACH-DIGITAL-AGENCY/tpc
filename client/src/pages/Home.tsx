import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronRight, Lock, ArrowRight, Shield, Check } from "lucide-react";
import { toast } from "sonner";

type DemoStep = "OPT_IN" | "QUIZ_INTRO" | "QUIZ" | "OFFER" | "STRIPE_CHECKOUT" | "SUCCESS";

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

  const handleOptInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            source: "ShipSticks_TPC_Launch",
            tag: "Golf_Wedge_Launch"
          })
        });
        toast.success("Voucher registered successfully!");
      } catch (err) {
        console.error("Webhook submit failed:", err);
      }
    } else {
      toast.success("Voucher registered successfully!");
    }

    setIsSubmitting(false);
    setDemoStep("QUIZ_INTRO");
  };

  const handleQuizAnswer = (answer: string) => {
    const updatedAnswers = [...quizAnswers, { questionId: quizQuestions[currentQuestionIndex].id, answer }];
    setQuizAnswers(updatedAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setDemoStep("OFFER");
    }
  };

  const handleStripeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripeData.cardNumber || !stripeData.expiry || !stripeData.cvc) {
      toast.error("Please enter your card details.");
      return;
    }
    toast.success("Payment Authorized Successfully!");
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2B21] font-sans antialiased flex flex-col justify-between overflow-x-hidden py-4 px-4">
      {/* Main Content Area - Centered, Tightened Spacing, Warm Sand Aesthetics */}
      <main className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center my-auto space-y-4">
        {step === "OPT_IN" && (
          <div className="space-y-4 w-full animate-fade-in">
            {/* Pure, Frictionless Opt-In Form Card - Sharp Corners, Rich Cream Background */}
            <Card className="border border-[#E8E4DC] shadow-[0_8px_30px_rgba(28,43,33,0.02)] bg-white rounded-none">
              <CardContent className="p-5 md:p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h1 className="text-lg md:text-xl font-serif font-bold tracking-tight text-[#1C2B21] leading-snug">
                    The next time your precious clubs need to get home safely... think of us!
                  </h1>
                  <div className="h-[1px] w-12 bg-[#E5C158] mx-auto" />
                </div>

                <form onSubmit={handleOptInSubmit} className="space-y-3.5">
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
                      className="h-10 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]"
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
                      className="h-10 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]"
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
                      className="h-10 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-0 rounded-none font-medium placeholder:text-[#C1C9C3]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full min-h-11 py-2.5 px-4 bg-[#107C41] hover:bg-[#0C6233] active:scale-[0.98] transition-all text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer whitespace-normal text-center leading-normal"
                  >
                    <span>{isSubmitting ? "Securing..." : "ACTIVATE YOUR $75 SHIP STICKS REBATE NOW!"}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Bottom Section: Grouped Co-branded Logos & Elegant Footnote */}
            <div className="space-y-3 pt-1">
              {/* Row of Logos */}
              <div className="flex items-center justify-center gap-6 md:gap-8 opacity-80">
                {/* Logo 1: TPC */}
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-[#107C41] stroke-[2]" />
                  <span className="text-[9px] font-bold tracking-widest text-[#1C2B21] uppercase">
                    TPC
                  </span>
                </div>

                {/* Divider */}
                <div className="h-3 w-[1px] bg-[#E8E4DC]" />

                {/* Logo 2: Ship Sticks */}
                <img 
                  src="/manus-storage/shipsticks_logo_cd6c897a.png" 
                  alt="Ship Sticks" 
                  className="h-5 object-contain"
                />

                {/* Divider */}
                <div className="h-3 w-[1px] bg-[#E8E4DC]" />

                {/* Logo 3: ASB */}
                <div className="flex items-center gap-1">
                  <img 
                    src="/manus-storage/ASB_logo_circle_37213318.png" 
                    alt="ASB Logo" 
                    className="h-5 w-5 object-contain rounded-full"
                  />
                  <span className="text-[9px] font-bold tracking-widest text-[#1C2B21] uppercase">
                    ASB
                  </span>
                </div>
              </div>

              {/* Text Footnote */}
              <div className="text-center px-4">
                <span className="text-[9px] md:text-[10px] text-[#5C6B5E] font-bold tracking-wider uppercase block leading-relaxed">
                  COMPLEMENT of <br />
                  The TRAVEL PROTECTION CLUB & ASB ATHLETICS <br />
                  <span className="text-[#A4B3A7] font-medium text-[8px] md:text-[9px]">in conjunction with SHIP STICKS</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {step === "QUIZ_INTRO" && (
          <div className="w-full space-y-4 animate-fade-in">
            <Card className="border border-[#E8E4DC] shadow-[0_12px_40px_rgba(28,43,33,0.03)] bg-white rounded-none overflow-hidden">
              <div className="bg-[#107C41] text-white p-5 text-center">
                <CheckCircle2 className="w-10 h-10 mx-auto text-[#E5C158] mb-1.5" />
                <h2 className="text-lg font-serif font-bold">Voucher Reserved!</h2>
                <p className="text-xs text-[#EAF7EE] mt-0.5">Your $75 credit is held under: <span className="font-bold text-white">{formData.email}</span></p>
              </div>
              <CardContent className="p-5 space-y-4 text-center">
                <p className="text-xs text-[#5C6B5E] leading-relaxed">
                  To complete your voucher activation and claim your official code, please complete our brief 4-question Golf Travel Planner. 
                </p>
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-none p-3 text-left space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1C2B21]">
                    <Shield className="w-3.5 h-3.5 text-[#107C41]" />
                    EXCLUSIVE MEMBER BENEFIT
                  </div>
                  <p className="text-[11px] text-[#5C6B5E] leading-relaxed">
                    By completing this planner, you will also be evaluated for complimentary trial enrollment in the **Travel Protection Club (TPC)**.
                  </p>
                </div>
                <Button 
                  onClick={() => setDemoStep("QUIZ")}
                  className="w-full h-11 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Start Travel Planner
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "QUIZ" && (
          <div className="w-full space-y-3 animate-fade-in">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider px-1">
              <span>Golf Travel Planner</span>
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            </div>
            <div className="h-1 w-full bg-[#E8E4DC] rounded-none overflow-hidden">
              <div 
                className="h-full bg-[#107C41] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            <Card className="border border-[#E8E4DC] shadow-[0_12px_40px_rgba(28,43,33,0.03)] bg-white rounded-none overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <h2 className="text-sm md:text-base font-serif font-bold text-[#1C2B21] leading-snug">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-2">
                  {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full p-3 text-left border border-[#E8E4DC] hover:border-[#107C41] hover:bg-[#EAF7EE]/20 active:scale-[0.99] transition-all rounded-none text-xs font-semibold text-[#1C2B21] flex items-center justify-between group cursor-pointer"
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
          <div className="w-full space-y-3 animate-fade-in">
            <Card className="border border-[#E5C158] shadow-[0_16px_48px_rgba(28,43,33,0.06)] bg-white rounded-none overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-[#E5C158] text-[#1C2B21] font-bold text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-none">
                Exclusive Package
              </div>

              <div className="bg-[#1C2B21] text-white p-5 text-center">
                <span className="text-[10px] font-bold text-[#E5C158] tracking-widest uppercase">
                  Travel Protection Club
                </span>
                <h2 className="text-base font-serif font-bold tracking-tight mt-0.5">
                  Activate Your TPC Membership
                </h2>
                <p className="text-[11px] text-[#A4B3A7] mt-1 max-w-xs mx-auto leading-relaxed">
                  Your travel profile qualifies you for our exclusive member bundle. Spend less time worrying, and more time playing.
                </p>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Value Comparison Table */}
                <div className="border border-[#E8E4DC] rounded-none overflow-hidden">
                  <div className="grid grid-cols-3 bg-[#FAF8F5] border-b border-[#E8E4DC] p-2.5 text-[9px] font-bold text-[#5C6B5E] tracking-wider uppercase">
                    <span>Benefit Item</span>
                    <span className="text-center">Standard Value</span>
                    <span className="text-right text-[#107C41]">Your Bundle</span>
                  </div>
                  <div className="divide-y divide-[#E8E4DC] text-[11px]">
                    <div className="grid grid-cols-3 p-2.5 text-[#1C2B21]">
                      <span className="font-semibold">1-Yr TPC Travel Membership</span>
                      <span className="text-center text-[#5C6B5E] line-through">$150.00</span>
                      <span className="text-right font-bold text-[#107C41]">$150.00</span>
                    </div>
                    <div className="grid grid-cols-3 p-2.5 text-[#1C2B21] bg-[#EAF7EE]/10">
                      <span className="font-semibold text-[#107C41]">Ship Sticks Voucher Credit</span>
                      <span className="text-center text-[#5C6B5E]">-</span>
                      <span className="text-right font-bold text-[#107C41]">-$75.00 Rebate</span>
                    </div>
                    <div className="grid grid-cols-3 p-2.5 bg-[#FAF8F5] font-bold text-xs text-[#1C2B21]">
                      <span>Net Effective Cost</span>
                      <span className="text-center text-[#5C6B5E]">$150.00</span>
                      <span className="text-right text-[#107C41]">$75.00</span>
                    </div>
                  </div>
                </div>

                {/* Core Pillars List */}
                <div className="space-y-2">
                  <h3 className="text-[9px] font-bold text-[#5C6B5E] uppercase tracking-widest">
                    What is Included in Your Membership:
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex gap-2 items-start">
                      <div className="p-0.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-[#1C2B21]">Elite Medical Repatriation</h4>
                        <p className="text-[10px] text-[#5C6B5E] leading-relaxed">
                          We pay to fly you and your equipment back to your home hospital in a crisis.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="p-0.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-[#1C2B21]">First-Call Emergency Response</h4>
                        <p className="text-[10px] text-[#5C6B5E] leading-relaxed">
                          One dedicated number connects you instantly to global crisis experts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Acceptance & CTA */}
                <div className="space-y-2 pt-0.5">
                  <p className="text-[9px] text-[#5C6B5E] text-center leading-relaxed">
                    By clicking below, you agree to join the Travel Protection Club and pay the $150 first-year membership fee. Once confirmed, your $75 Ship Sticks voucher will be instantly issued.
                  </p>
                  <Button 
                    onClick={() => setDemoStep("STRIPE_CHECKOUT")}
                    className="w-full h-11 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Accept Offer & Proceed to Checkout
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "STRIPE_CHECKOUT" && (
          <div className="w-full max-w-sm mx-auto space-y-3 animate-fade-in">
            <Card className="border border-[#E8E4DC] shadow-[0_12px_40px_rgba(28,43,33,0.03)] bg-white rounded-none overflow-hidden">
              <div className="bg-[#FAF8F5] border-b border-[#E8E4DC] p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#107C41]" />
                  <span className="text-xs font-bold text-[#1C2B21] tracking-wider uppercase">Secure Stripe Checkout</span>
                </div>
                <div className="text-[9px] font-bold text-[#107C41] bg-[#EAF7EE] px-2 py-0.5 rounded-none">
                  SSL Encrypted
                </div>
              </div>

              <CardContent className="p-4 space-y-3.5">
                {/* Order Summary */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-none p-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs text-[#5C6B5E]">
                    <span>1-Year TPC Membership</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#107C41] font-bold">
                    <span>Ship Sticks Voucher</span>
                    <span>-$75.00 Rebate Held</span>
                  </div>
                  <div className="border-t border-[#E8E4DC] pt-1.5 flex justify-between text-sm font-bold text-[#1C2B21]">
                    <span>Total Due Today</span>
                    <span>$150.00</span>
                  </div>
                </div>

                <form onSubmit={handleStripeSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="cardNumber" className="text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={stripeData.cardNumber}
                      onChange={(e) => setStripeData({ ...stripeData, cardNumber: e.target.value })}
                      required
                      className="h-10 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="expiry" className="text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider">Expiration</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={stripeData.expiry}
                        onChange={(e) => setStripeData({ ...stripeData, expiry: e.target.value })}
                        required
                        className="h-10 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cvc" className="text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider">CVC</Label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        value={stripeData.cvc}
                        onChange={(e) => setStripeData({ ...stripeData, cvc: e.target.value })}
                        required
                        className="h-10 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prefillStripeDemo}
                      className="flex-1 h-10 border-[#E8E4DC] text-[10px] font-bold text-[#5C6B5E] hover:bg-[#FAF8F5] active:scale-[0.98] rounded-none transition-all cursor-pointer"
                    >
                      Pre-fill Demo Card
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-10 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-[10px] tracking-wider uppercase rounded-none shadow-md active:scale-[0.98] transition-all cursor-pointer"
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
          <div className="w-full space-y-4 animate-fade-in">
            <Card className="border border-[#107C41] shadow-[0_12px_40px_rgba(28,43,33,0.04)] bg-white rounded-none overflow-hidden">
              <div className="bg-[#107C41] text-white p-5 text-center space-y-1.5">
                <CheckCircle2 className="w-12 h-10 mx-auto text-[#E5C158] animate-bounce" />
                <h2 className="text-lg font-serif font-bold">Welcome to the Club!</h2>
                <p className="text-xs text-[#EAF7EE] max-w-xs mx-auto">
                  Your TPC membership is active and your Ship Sticks voucher has been issued.
                </p>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Active Voucher Code Box */}
                <div className="bg-[#FAF8F5] border-2 border-dashed border-[#107C41] rounded-none p-4 text-center space-y-1.5">
                  <span className="text-[9px] font-bold text-[#107C41] tracking-widest uppercase">
                    Your Active Ship Sticks Voucher Code
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-[#1C2B21] tracking-wider select-all">
                    TPC-75-GOLF
                  </div>
                  <p className="text-xs text-[#5C6B5E]">
                    Apply this code at checkout on **ShipSticks.com** to receive your $75 discount instantly.
                  </p>
                </div>

                <Button 
                  onClick={() => {
                    setDemoStep("OPT_IN");
                    setFormData({ name: "", email: "", phone: "" });
                    setQuizAnswers([]);
                    setCurrentQuestionIndex(0);
                    setStripeData({ cardNumber: "", expiry: "", cvc: "" });
                  }}
                  className="w-full h-11 bg-[#1C2B21] hover:bg-black text-white font-bold text-xs tracking-wider uppercase rounded-none shadow-md transition-all cursor-pointer"
                >
                  Restart Demo Flow
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
