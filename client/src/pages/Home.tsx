import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronRight, Lock, ArrowRight, Shield, Check, Trophy } from "lucide-react";
import { toast } from "sonner";

type DemoStep = "OPT_IN" | "QUIZ_INTRO" | "QUIZ" | "OFFER" | "STRIPE_CHECKOUT" | "SUCCESS";

interface QuizAnswer {
  questionId: number;
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
      id: 1,
      question: "How many times do you travel for golf annually?",
      options: ["1-2 times", "3-5 times", "6+ times", "Rarely"]
    },
    {
      id: 2,
      question: "Do you currently own a high-end, custom set of golf clubs?",
      options: ["Yes, custom fitted ($2,000+ value)", "Yes, standard set", "No, I rent at courses"]
    },
    {
      id: 3,
      question: "In the event of an unforeseen medical emergency while traveling, do you have a plan to safely transport yourself and your equipment back home?",
      options: ["Yes, I have dedicated medical transport coverage", "No, I assume my standard health insurance covers it", "I don't have a plan in place"]
    },
    {
      id: 4,
      question: "What is your primary concern when traveling with your clubs?",
      options: ["Clubs getting lost or damaged by airlines", "High airline baggage fees and hassle", "Unforeseen travel or health disruptions"]
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
    <div className="min-h-screen bg-[#F9F9FB] text-[#1D1D1F] font-sans antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Apple-style Ultra-Clean, Spacious Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#F5F5F7] py-4 px-6 sticky top-0 z-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left: Travel Protection Club */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#107C41] stroke-[2]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#1D1D1F]">
              Travel Protection Club
            </span>
          </div>

          {/* Center: Ship Sticks (High-Res Static Asset) */}
          <div className="flex items-center justify-center">
            <img 
              src="/manus-storage/shipsticks_logo_cd6c897a.png" 
              alt="Ship Sticks" 
              className="h-5 md:h-6 object-contain"
            />
          </div>

          {/* Right: Partner Logo (American Solutions for Business) */}
          <div className="flex items-center gap-2.5">
            <img 
              src="/manus-storage/ASB_logo_circle_37213318.png" 
              alt="ASB Logo" 
              className="h-6 w-6 md:h-7 md:w-7 object-contain rounded-full shadow-xs"
            />
            <span className="text-[10px] font-semibold tracking-widest text-[#86868B] uppercase hidden sm:inline-block">
              ASB
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Extremely Clean, Minimalist, Centered, No Scrolling */}
      <main className="flex-1 py-12 px-4 max-w-md mx-auto w-full flex flex-col justify-center">
        {step === "OPT_IN" && (
          <div className="space-y-6 w-full animate-fade-in">
            {/* Pure, Frictionless Opt-In Form Card */}
            <Card className="border border-[#E8E8ED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden rounded-2xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                    Instant Voucher Reservation
                  </h1>
                  <p className="text-xs text-[#86868B] max-w-xs mx-auto leading-relaxed">
                    Secure your $75 credit code first. Apply this credit directly to your next golf club shipment.
                  </p>
                </div>

                <form onSubmit={handleOptInSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[10px] font-semibold text-[#86868B] tracking-wider uppercase">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Andrew Miller"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11 text-xs border-[#D2D2D7] bg-[#F5F5F7] focus:bg-white focus:border-[#107C41] focus:ring-2 focus:ring-[#107C41]/10 rounded-xl transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] font-semibold text-[#86868B] tracking-wider uppercase">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="andrew@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-11 text-xs border-[#D2D2D7] bg-[#F5F5F7] focus:bg-white focus:border-[#107C41] focus:ring-2 focus:ring-[#107C41]/10 rounded-xl transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[10px] font-semibold text-[#86868B] tracking-wider uppercase">
                      Mobile Number <span className="text-[#A1A1A6] font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 text-xs border-[#D2D2D7] bg-[#F5F5F7] focus:bg-white focus:border-[#107C41] focus:ring-2 focus:ring-[#107C41]/10 rounded-xl transition-all"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-11 bg-[#107C41] hover:bg-[#0C6233] active:scale-[0.98] transition-all text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-sm flex items-center justify-center gap-1.5 mt-2"
                  >
                    {isSubmitting ? "Securing..." : "Secure Your $75 Voucher"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Clean, Modern TPC Footnote */}
            <div className="text-center">
              <span className="text-[10px] text-[#86868B] font-medium tracking-wider uppercase">
                An exclusive offer from the Travel Protection Club
              </span>
            </div>
          </div>
        )}

        {step === "QUIZ_INTRO" && (
          <div className="w-full space-y-4 animate-fade-in">
            <Card className="border border-[#E8E8ED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
              <div className="bg-[#107C41] text-white p-6 text-center">
                <CheckCircle2 className="w-10 h-10 mx-auto text-[#E5C158] mb-2" />
                <h2 className="text-lg font-semibold tracking-tight">Voucher Reserved!</h2>
                <p className="text-[11px] text-[#EAF7EE] mt-1">Your $75 credit is held under: <span className="font-bold text-white">{formData.email}</span></p>
              </div>
              <CardContent className="p-6 space-y-5 text-center">
                <p className="text-xs text-[#515154] leading-relaxed">
                  To complete your voucher activation and claim your official code, please complete our brief 4-question Golf Travel Planner. 
                </p>
                <div className="bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#1D1D1F]">
                    <Shield className="w-3.5 h-3.5 text-[#107C41]" />
                    EXCLUSIVE MEMBER BENEFIT
                  </div>
                  <p className="text-[10px] text-[#515154] leading-relaxed">
                    By completing this planner, you will also be evaluated for complimentary trial enrollment in the **Travel Protection Club (TPC)**.
                  </p>
                </div>
                <Button 
                  onClick={() => setDemoStep("QUIZ")}
                  className="w-full h-11 bg-[#107C41] hover:bg-[#0C6233] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                >
                  Start Travel Planner
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "QUIZ" && (
          <div className="w-full space-y-4 animate-fade-in">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#86868B] uppercase tracking-wider px-1">
              <span>Golf Travel Planner</span>
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            </div>
            <div className="h-1 w-full bg-[#E8E8ED] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#107C41] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            <Card className="border border-[#E8E8ED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <h2 className="text-sm md:text-base font-semibold text-[#1D1D1F] leading-snug">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-2.5">
                  {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full p-3.5 text-left border border-[#E8E8ED] hover:border-[#107C41] hover:bg-[#EAF7EE]/20 active:scale-[0.99] transition-all rounded-xl text-xs font-medium text-[#1D1D1F] flex items-center justify-between group"
                    >
                      <span>{option}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#107C41] transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "OFFER" && (
          <div className="w-full space-y-4 animate-fade-in">
            <Card className="border border-[#E5C158] shadow-[0_12px_40px_rgb(0,0,0,0.06)] bg-white rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-[#E5C158] text-[#1C2B21] font-bold text-[8px] tracking-widest uppercase px-3 py-1 rounded-bl-xl">
                Exclusive Package
              </div>

              <div className="bg-[#1C2B21] text-white p-6 text-center">
                <span className="text-[10px] font-bold text-[#E5C158] tracking-widest uppercase">
                  Travel Protection Club
                </span>
                <h2 className="text-base font-semibold tracking-tight mt-1">
                  Activate Your TPC Membership
                </h2>
                <p className="text-[10px] text-[#A1A1A6] mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Your travel profile qualifies you for our exclusive member bundle. Spend less time worrying, and more time playing.
                </p>
              </div>

              <CardContent className="p-5 space-y-5">
                {/* Value Comparison Table */}
                <div className="border border-[#E8E8ED] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 bg-[#F5F5F7] border-b border-[#E8E8ED] p-3 text-[9px] font-bold text-[#86868B] tracking-wider uppercase">
                    <span>Benefit Item</span>
                    <span className="text-center">Standard Value</span>
                    <span className="text-right text-[#107C41]">Your Bundle</span>
                  </div>
                  <div className="divide-y divide-[#E8E8ED] text-[10px]">
                    <div className="grid grid-cols-3 p-3 text-[#1D1D1F]">
                      <span className="font-semibold">1-Yr TPC Travel Membership</span>
                      <span className="text-center text-[#86868B] line-through">$150.00</span>
                      <span className="text-right font-bold text-[#107C41]">$150.00</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 text-[#1D1D1F] bg-[#EAF7EE]/10">
                      <span className="font-semibold text-[#107C41]">Ship Sticks Voucher Credit</span>
                      <span className="text-center text-[#86868B]">-</span>
                      <span className="text-right font-bold text-[#107C41]">-$75.00 Rebate</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 bg-[#F5F5F7] font-bold text-xs text-[#1D1D1F]">
                      <span>Net Effective Cost</span>
                      <span className="text-center text-[#86868B]">$150.00</span>
                      <span className="text-right text-[#107C41]">$75.00</span>
                    </div>
                  </div>
                </div>

                {/* Core Pillars List */}
                <div className="space-y-3">
                  <h3 className="text-[9px] font-bold text-[#86868B] uppercase tracking-widest">
                    What is Included in Your Membership:
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex gap-2.5 items-start">
                      <div className="p-0.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-[#1D1D1F]">Elite Medical Repatriation</h4>
                        <p className="text-[9px] text-[#86868B] leading-relaxed">
                          We pay to fly you and your equipment back to your home hospital in a crisis.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="p-0.5 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-[#1D1D1F]">First-Call Emergency Response</h4>
                        <p className="text-[9px] text-[#86868B] leading-relaxed">
                          One dedicated number connects you instantly to global crisis experts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Acceptance & CTA */}
                <div className="space-y-3 pt-1">
                  <p className="text-[9px] text-[#86868B] text-center leading-relaxed">
                    By clicking below, you agree to join the Travel Protection Club and pay the $150 first-year membership fee. Once confirmed, your $75 Ship Sticks voucher will be instantly issued.
                  </p>
                  <Button 
                    onClick={() => setDemoStep("STRIPE_CHECKOUT")}
                    className="w-full h-11 bg-[#107C41] hover:bg-[#0C6233] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-sm flex items-center justify-center gap-1.5"
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
          <div className="w-full max-w-sm mx-auto space-y-4 animate-fade-in">
            <Card className="border border-[#E8E8ED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
              <div className="bg-[#F5F5F7] border-b border-[#E8E8ED] p-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#107C41]" />
                  <span className="text-[10px] font-bold text-[#1D1D1F] tracking-wider uppercase">Secure Stripe Checkout</span>
                </div>
                <div className="text-[9px] font-bold text-[#107C41] bg-[#EAF7EE] px-2 py-0.5 rounded-md">
                  SSL Encrypted
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Order Summary */}
                <div className="bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#86868B]">
                    <span>1-Year TPC Membership</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#107C41] font-bold">
                    <span>Ship Sticks Voucher</span>
                    <span>-$75.00 Rebate Held</span>
                  </div>
                  <div className="border-t border-[#E8E8ED] pt-1.5 flex justify-between text-xs font-bold text-[#1D1D1F]">
                    <span>Total Due Today</span>
                    <span>$150.00</span>
                  </div>
                </div>

                <form onSubmit={handleStripeSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="cardNumber" className="text-[9px] font-bold text-[#86868B] uppercase tracking-wider">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={stripeData.cardNumber}
                      onChange={(e) => setStripeData({ ...stripeData, cardNumber: e.target.value })}
                      required
                      className="h-10 text-xs border-[#D2D2D7] bg-[#F5F5F7] focus:bg-white focus:border-[#107C41] rounded-xl transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="expiry" className="text-[9px] font-bold text-[#86868B] uppercase tracking-wider">Expiration</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={stripeData.expiry}
                        onChange={(e) => setStripeData({ ...stripeData, expiry: e.target.value })}
                        required
                        className="h-10 text-xs border-[#D2D2D7] bg-[#F5F5F7] focus:bg-white focus:border-[#107C41] rounded-xl transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cvc" className="text-[9px] font-bold text-[#86868B] uppercase tracking-wider">CVC</Label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        value={stripeData.cvc}
                        onChange={(e) => setStripeData({ ...stripeData, cvc: e.target.value })}
                        required
                        className="h-10 text-xs border-[#D2D2D7] bg-[#F5F5F7] focus:bg-white focus:border-[#107C41] rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prefillStripeDemo}
                      className="flex-1 h-10 border-[#D2D2D7] text-[10px] font-bold text-[#86868B] hover:bg-[#F5F5F7] active:scale-[0.98] rounded-xl transition-all"
                    >
                      Pre-fill Demo Card
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-10 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-[10px] tracking-wider uppercase rounded-xl shadow-sm active:scale-[0.98] transition-all"
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
            <Card className="border border-[#107C41] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
              <div className="bg-[#107C41] text-white p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-[#E5C158] animate-bounce" />
                <h2 className="text-lg font-semibold tracking-tight">Welcome to the Club!</h2>
                <p className="text-[10px] text-[#EAF7EE] max-w-xs mx-auto">
                  Your TPC membership is active and your Ship Sticks voucher has been issued.
                </p>
              </div>

              <CardContent className="p-6 space-y-5">
                {/* Active Voucher Code Box */}
                <div className="bg-[#F5F5F7] border-2 border-dashed border-[#107C41] rounded-xl p-5 text-center space-y-2">
                  <span className="text-[9px] font-bold text-[#107C41] tracking-widest uppercase">
                    Your Active Ship Sticks Voucher Code
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-[#1D1D1F] tracking-wider select-all">
                    TPC-75-GOLF
                  </div>
                  <p className="text-[10px] text-[#86868B]">
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
                  className="w-full h-11 bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-sm transition-all"
                >
                  Restart Demo Flow
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* No footer or visible controls—100% clean consumer experience */}
    </div>
  );
}
