import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronRight, Lock, ArrowRight, Shield, PhoneCall, FileText, Check, AlertCircle } from "lucide-react";
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
  const [webhookUrl, setWebhookUrl] = useState(() => {
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

    // Send payload to YAT?STATS/HighLevel Webhook if configured
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
        toast.success("Live contact pushed to YAT?STATS!");
      } catch (err) {
        console.error("Webhook submit failed:", err);
      }
    } else {
      toast.success("Contact captured in demo engine!");
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

  const saveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("arms_webhook_url", url);
    toast.success("YAT?STATS Webhook URL updated!");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2B21] font-sans antialiased flex flex-col justify-between">
      {/* 1. Header with Official Ship Sticks Logo */}
      <header className="border-b border-[#E8E4DC] bg-white py-4 px-6 sticky top-0 z-50 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368558979/TncsUA3wJWw3btME2gSgvv/shipsticks_logo-EsmX8YxH468XGfG9G4e7Y7.png" 
              alt="Ship Sticks Logo" 
              className="h-10 object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#107C41] bg-[#EAF7EE] px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Official Invitation Benefit
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 py-8 px-4 max-w-4xl mx-auto w-full flex flex-col justify-center">
        {step === "OPT_IN" && (
          <div className="space-y-6 max-w-xl mx-auto w-full animate-fade-in">
            {/* Elegant Golf Course Hero Banner Image */}
            <div className="rounded-xl overflow-hidden shadow-md border border-[#E8E4DC] relative h-48 md:h-56">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663368558979/TncsUA3wJWw3btME2gSgvv/luxury_golf_bg-A89ErcbS3N7Dbe9S79e8E8.png" 
                alt="Luxury Golf Course" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-[#E5C158] uppercase tracking-widest bg-black/40 px-2.5 py-1 rounded-sm">
                    Exclusive Golf Invitation
                  </span>
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-white mt-2">
                    Activate Your $75 Golf Travel Voucher
                  </h1>
                </div>
              </div>
            </div>

            {/* Clean, Frictionless Opt-In Form Card */}
            <Card className="border border-[#E8E4DC] shadow-lg bg-white overflow-hidden rounded-xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#107C41] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#1C2B21] uppercase tracking-wider">
                      Instant Voucher Reservation
                    </h3>
                    <p className="text-xs text-[#5C6B5E] mt-1 leading-relaxed">
                      Secure your credit code first. Once registered, you can apply this $75 credit directly to your next golf club shipment.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleOptInSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold text-[#5C6B5E] tracking-wider uppercase">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Andrew Miller"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12 border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-1 focus:ring-[#107C41] rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-[#5C6B5E] tracking-wider uppercase">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., andrew@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-1 focus:ring-[#107C41] rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-[#5C6B5E] tracking-wider uppercase">
                      Mobile Number <span className="text-[#A4B3A7] font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g., (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] focus:ring-1 focus:ring-[#107C41] rounded-md"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#107C41] hover:bg-[#0C6233] active:scale-[0.98] transition-all text-white font-bold text-sm tracking-wider uppercase rounded-md shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Securing..." : "Secure Your $75 Voucher"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "QUIZ_INTRO" && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <Card className="border border-[#E8E4DC] shadow-lg bg-white rounded-xl overflow-hidden">
              <div className="bg-[#107C41] text-white p-6 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto text-[#E5C158]" />
                <h2 className="text-xl font-serif font-bold mt-3">Voucher Reserved Successfully!</h2>
                <p className="text-xs text-[#EAF7EE] mt-1">Your $75 credit is held under: <span className="font-bold text-white">{formData.email}</span></p>
              </div>
              <CardContent className="p-6 md:p-8 space-y-6 text-center">
                <p className="text-sm text-[#5C6B5E] leading-relaxed">
                  To complete your voucher activation and claim your official code, please complete our brief 4-question Golf Travel Planner. 
                </p>
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg p-4 text-left space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#1C2B21]">
                    <Shield className="w-4 h-4 text-[#107C41]" />
                    EXCLUSIVE MEMBER BENEFIT
                  </div>
                  <p className="text-xs text-[#5C6B5E] leading-relaxed">
                    By completing this planner, you will also be evaluated for complimentary trial enrollment in the **Travel Protection Club (TPC)**.
                  </p>
                </div>
                <Button 
                  onClick={() => setDemoStep("QUIZ")}
                  className="w-full h-12 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-sm tracking-wider uppercase rounded-md shadow-md flex items-center justify-center gap-2"
                >
                  Start Travel Planner
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "QUIZ" && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            {/* Progress Indicator */}
            <div className="flex justify-between items-center text-xs font-bold text-[#5C6B5E] uppercase tracking-wider px-1">
              <span>Golf Travel Planner</span>
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            </div>
            <div className="h-1.5 w-full bg-[#E8E4DC] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#107C41] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            <Card className="border border-[#E8E4DC] shadow-lg bg-white rounded-xl overflow-hidden">
              <CardContent className="p-6 md:p-8 space-y-6">
                <h2 className="text-lg md:text-xl font-serif font-bold text-[#1C2B21] leading-snug">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-3">
                  {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full p-4 text-left border border-[#E8E4DC] hover:border-[#107C41] hover:bg-[#EAF7EE]/30 active:scale-[0.99] transition-all rounded-lg text-sm font-medium text-[#1C2B21] flex items-center justify-between group"
                    >
                      <span>{option}</span>
                      <ChevronRight className="w-4 h-4 text-[#A4B3A7] group-hover:text-[#107C41] transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "OFFER" && (
          <div className="max-w-2xl mx-auto w-full space-y-6 animate-fade-in">
            {/* Exclusive Offer Card */}
            <Card className="border border-[#E5C158] shadow-xl bg-white rounded-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-[#E5C158] text-[#1C2B21] font-bold text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-bl-lg">
                Exclusive Package
              </div>

              <div className="bg-[#1C2B21] text-white p-6 md:p-8 text-center">
                <span className="text-xs font-bold text-[#E5C158] tracking-widest uppercase">
                  Travel Protection Club
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mt-2">
                  Activate Your Travel Protection Club Membership
                </h2>
                <p className="text-xs text-[#A4B3A7] mt-2 max-w-md mx-auto leading-relaxed">
                  Your travel profile qualifies you for our exclusive member bundle. Spend less time worrying about your health, and more time enjoying the game.
                </p>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Value Comparison Table */}
                <div className="border border-[#E8E4DC] rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 bg-[#FAF8F5] border-b border-[#E8E4DC] p-3 text-xs font-bold text-[#5C6B5E] tracking-wider uppercase">
                    <span>Benefit Item</span>
                    <span className="text-center">Standard Value</span>
                    <span className="text-right text-[#107C41]">Your Bundle</span>
                  </div>
                  <div className="divide-y divide-[#E8E4DC] text-xs">
                    <div className="grid grid-cols-3 p-3 text-[#1C2B21]">
                      <span className="font-semibold">1-Yr TPC Travel Membership</span>
                      <span className="text-center text-[#5C6B5E] line-through">$150.00</span>
                      <span className="text-right font-bold text-[#107C41]">$150.00</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 text-[#1C2B21] bg-[#EAF7EE]/20">
                      <span className="font-semibold text-[#107C41]">Ship Sticks Voucher Credit</span>
                      <span className="text-center text-[#5C6B5E]">-</span>
                      <span className="text-right font-bold text-[#107C41]">-$75.00 Rebate</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 bg-[#FAF8F5] font-bold text-sm text-[#1C2B21]">
                      <span>Net Effective Cost</span>
                      <span className="text-center text-[#5C6B5E]">$150.00</span>
                      <span className="text-right text-[#107C41]">$75.00</span>
                    </div>
                  </div>
                </div>

                {/* Core Pillars List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#5C6B5E] uppercase tracking-widest">
                    What is Included in Your Membership:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="p-1 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1C2B21]">Elite Medical Repatriation</h4>
                        <p className="text-[11px] text-[#5C6B5E] mt-0.5 leading-relaxed">
                          In a crisis, we coordinate and pay to fly you and your equipment back to your home hospital.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="p-1 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1C2B21]">First-Call Emergency Response</h4>
                        <p className="text-[11px] text-[#5C6B5E] mt-0.5 leading-relaxed">
                          One dedicated phone number connects you instantly to global crisis coordination experts.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="p-1 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1C2B21]">Physical Membership Pack</h4>
                        <p className="text-[11px] text-[#5C6B5E] mt-0.5 leading-relaxed">
                          Receive heavy-duty engraved metal luggage tags and emergency wallet cards.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="p-1 bg-[#EAF7EE] rounded-full text-[#107C41] shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1C2B21]">Verified Ship Sticks Voucher</h4>
                        <p className="text-[11px] text-[#5C6B5E] mt-0.5 leading-relaxed">
                          Get an active $75 voucher code immediately to use on your very next club shipment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Acceptance & CTA */}
                <div className="space-y-4 pt-2">
                  <p className="text-[10px] text-[#849387] text-center leading-relaxed">
                    By clicking below, you agree to join the Travel Protection Club and pay the $150 first-year membership fee. Once confirmed, your $75 Ship Sticks voucher will be instantly issued.
                  </p>
                  <Button 
                    onClick={() => setDemoStep("STRIPE_CHECKOUT")}
                    className="w-full h-12 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-sm tracking-wider uppercase rounded-md shadow-md flex items-center justify-center gap-2"
                  >
                    Accept Offer & Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "STRIPE_CHECKOUT" && (
          <div className="max-w-md mx-auto w-full space-y-6 animate-fade-in">
            <Card className="border border-[#E8E4DC] shadow-lg bg-white rounded-xl overflow-hidden">
              <div className="bg-[#FAF8F5] border-b border-[#E8E4DC] p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#107C41]" />
                  <span className="text-xs font-bold text-[#1C2B21] tracking-wider uppercase">Secure Stripe Checkout</span>
                </div>
                <div className="text-xs font-bold text-[#107C41] bg-[#EAF7EE] px-2.5 py-1 rounded-sm">
                  SSL Encrypted
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-xs text-[#5C6B5E]">
                    <span>1-Year TPC Membership</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#107C41] font-bold">
                    <span>Ship Sticks Voucher</span>
                    <span>-$75.00 Rebate Held</span>
                  </div>
                  <div className="border-t border-[#E8E4DC] pt-2 flex justify-between text-sm font-bold text-[#1C2B21]">
                    <span>Total Due Today</span>
                    <span>$150.00</span>
                  </div>
                  <p className="text-[10px] text-[#849387] leading-relaxed pt-1">
                    *Your $75 Ship Sticks voucher will be delivered instantly upon payment confirmation.
                  </p>
                </div>

                <form onSubmit={handleStripeSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={stripeData.cardNumber}
                      onChange={(e) => setStripeData({ ...stripeData, cardNumber: e.target.value })}
                      required
                      className="h-11 border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider">Expiration Date</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={stripeData.expiry}
                        onChange={(e) => setStripeData({ ...stripeData, expiry: e.target.value })}
                        required
                        className="h-11 border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-md"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvc" className="text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider">Security Code (CVC)</Label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        value={stripeData.cvc}
                        onChange={(e) => setStripeData({ ...stripeData, cvc: e.target.value })}
                        required
                        className="h-11 border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prefillStripeDemo}
                      className="flex-1 h-11 border-[#E8E4DC] text-xs font-bold text-[#5C6B5E] hover:bg-[#FAF8F5] active:scale-[0.98]"
                    >
                      Pre-fill Demo Card
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-11 bg-[#107C41] hover:bg-[#0C6233] text-white font-bold text-xs tracking-wider uppercase rounded-md shadow-md active:scale-[0.98]"
                    >
                      Authorize Payment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "SUCCESS" && (
          <div className="max-w-xl mx-auto w-full space-y-6 animate-fade-in">
            <Card className="border border-[#107C41] shadow-xl bg-white rounded-xl overflow-hidden">
              <div className="bg-[#107C41] text-white p-8 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 mx-auto text-[#E5C158] animate-bounce" />
                <h2 className="text-2xl font-serif font-bold">Welcome to the Club!</h2>
                <p className="text-xs text-[#EAF7EE] max-w-xs mx-auto">
                  Your TPC Travel Protection membership is active and your Ship Sticks voucher has been issued.
                </p>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Active Voucher Code Box */}
                <div className="bg-[#FAF8F5] border-2 border-dashed border-[#107C41] rounded-lg p-6 text-center space-y-3">
                  <span className="text-[10px] font-bold text-[#107C41] tracking-widest uppercase">
                    Your Active Ship Sticks Voucher Code
                  </span>
                  <div className="text-3xl font-mono font-extrabold text-[#1C2B21] tracking-wider select-all">
                    TPC-75-GOLF
                  </div>
                  <p className="text-xs text-[#5C6B5E]">
                    Apply this code at checkout on **ShipSticks.com** to receive your $75 discount instantly.
                  </p>
                </div>

                {/* Membership Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#5C6B5E] uppercase tracking-widest">
                    Next Steps & Fulfillment:
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 bg-[#EAF7EE] text-[#107C41] font-bold rounded-full flex items-center justify-center shrink-0">1</div>
                      <p className="text-[#5C6B5E] leading-relaxed">
                        An official welcome email with your digital TPC membership card has been dispatched to **{formData.email}**.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 bg-[#EAF7EE] text-[#107C41] font-bold rounded-full flex items-center justify-center shrink-0">2</div>
                      <p className="text-[#5C6B5E] leading-relaxed">
                        Your physical member pack (engraved metal luggage tags and emergency wallet cards) will ship via premium ground in 3-5 business days.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 bg-[#EAF7EE] text-[#107C41] font-bold rounded-full flex items-center justify-center shrink-0">3</div>
                      <p className="text-[#5C6B5E] leading-relaxed">
                        Save our 24/7 First-Call emergency coordinator hotline: **1-800-555-GOLF** directly to your phone.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setDemoStep("OPT_IN");
                    setFormData({ name: "", email: "", phone: "" });
                    setQuizAnswers([]);
                    setCurrentQuestionIndex(0);
                    setStripeData({ cardNumber: "", expiry: "", cvc: "" });
                  }}
                  className="w-full h-12 bg-[#1C2B21] hover:bg-black text-white font-bold text-sm tracking-wider uppercase rounded-md shadow-md"
                >
                  Restart Demo Flow
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* 3. Collapsible YAT?STATS Integration Drawer */}
      <footer className="bg-white border-t border-[#E8E4DC] p-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#5C6B5E]">
            <span className="font-bold text-[#1C2B21]">Demo Controls:</span>
            <span>Current Step: <strong className="text-[#107C41]">{step}</strong></span>
          </div>

          <div className="w-full md:w-auto flex items-center gap-2">
            <Label htmlFor="webhook-url" className="text-[10px] font-bold text-[#5C6B5E] uppercase tracking-wider shrink-0">
              YAT?STATS Webhook URL:
            </Label>
            <Input
              id="webhook-url"
              type="text"
              placeholder="Paste Inbound Webhook URL here..."
              value={webhookUrl}
              onChange={(e) => saveWebhook(e.target.value)}
              className="h-8 text-xs border-[#E8E4DC] bg-[#FAF8F5] focus:bg-white focus:border-[#107C41] w-full md:w-64 rounded-sm"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
