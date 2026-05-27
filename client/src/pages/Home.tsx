import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, CheckCircle2, Lock, Gift, ArrowRight, CreditCard, ChevronRight, Compass, HelpCircle, PhoneCall } from "lucide-react";
import { toast } from "sonner";

type DemoStep = "LANDING" | "QUIZ_1" | "QUIZ_2" | "QUIZ_3" | "QUIZ_4" | "OFFER" | "STRIPE_CHECKOUT" | "SUCCESS";

export default function Home() {
  const [step, setStep] = useState<DemoStep>("LANDING");
  const [formData, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState({
    frequency: "",
    clubValue: "",
    repatriationKnowledge: "",
    plannerMindset: "",
  });

  // Stripe card state
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });

  // Keep track of submission status to YAT?STATS form
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with local storage for easy demo reload
  useEffect(() => {
    const savedStep = localStorage.getItem("global360_demo_step");
    if (savedStep) {
      // Allow restarting from where they left off if desired, but default to LANDING for clean demo
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  // Pre-fill card for fast presentation flow
  const prefillDemoCard = () => {
    setCardData({
      number: "4242 •••• •••• 4242",
      expiry: "12/28",
      cvc: "123",
    });
    toast.success("Demo card pre-filled securely");
  };

  // Handle background post to YAT?STATS form endpoint natively
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide both name and email to secure your voucher.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create native URLSearchParams to simulate a real form submission
      const bodyParams = new URLSearchParams();
      bodyParams.append("name", formData.name);
      bodyParams.append("email", formData.email);
      bodyParams.append("phone", formData.phone || "");
      bodyParams.append("formId", "H634urGOeGS6U0BpCfBS");

      // Background POST directly to HighLevel/ARMS Form handler
      await fetch("https://api.armsreachdigital.com/widget/form/H634urGOeGS6U0BpCfBS", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyParams.toString(),
        mode: "no-cors" // Bypasses CORS restrictions safely for standard form submissions
      });

      setIsSubmitted(true);
      toast.success("Voucher Code Reserved! Let's complete your profile.");
      setStep("QUIZ_1");
    } catch (err) {
      console.error("Form submit error:", err);
      // Fallback transition so the demo is never blocked even if network fails
      setIsSubmitted(true);
      setStep("QUIZ_1");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2D1F] font-serif flex flex-col selection:bg-[#C5A880] selection:text-[#1C2D1F]">
      {/* Premium Minimalist Header */}
      <header className="border-b border-[#E8E3DD] bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#C5A880] font-semibold">Fulfillment Partner:</span>
          <span className="text-sm font-sans font-bold tracking-wider text-[#1C2D1F]">SHIP STICKS®</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#C5A880]" />
          <span className="text-xs font-sans tracking-widest uppercase text-[#5C6E58]">Secure Verification Portal</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl mx-auto">
          
          {/* LANDING STEP - Pure, Frictionless Ship Sticks Voucher Claim */}
          {step === "LANDING" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden transition-all duration-300">
              <div className="relative h-48 bg-[#1C2D1F] flex items-center justify-center p-6 text-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-sans uppercase tracking-[0.2em] font-bold">
                    Exclusive Invitation Only
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#FDFBF7] tracking-tight">
                    Your $75 Ship Sticks Voucher is Reserved
                  </h1>
                </div>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                <p className="text-sm md:text-base text-[#5C6E58] font-sans leading-relaxed text-center">
                  Congratulations! Your invitation scan qualifies you for a **$75 credit** toward premium golf club shipping with **Ship Sticks**. Ensure your cherished clubs travel safely, stress-free, and arrive directly at your next course destination.
                </p>

                <div className="bg-[#F4F1EA] p-4 rounded-lg border border-[#E8E3DD] space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-sans font-bold text-[#1C2D1F]">Instant Voucher Reservation</h4>
                      <p className="text-xs text-[#5C6E58] font-sans mt-0.5">
                        Secure your credit code first. Once registered, you can apply this $75 credit directly to your next golf club shipment.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs uppercase tracking-wider font-sans text-[#5C6E58]">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="e.g., Andrew Miller" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-[#E8E3DD] focus:border-[#C5A880] focus:ring-[#C5A880] bg-[#FDFBF7] font-sans text-sm h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider font-sans text-[#5C6E58]">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="e.g., andrew@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-[#E8E3DD] focus:border-[#C5A880] focus:ring-[#C5A880] bg-[#FDFBF7] font-sans text-sm h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-sans text-[#5C6E58]">Mobile Number <span className="text-[#C5A880]">(Optional)</span></Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="e.g., (555) 123-4567" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-[#E8E3DD] focus:border-[#C5A880] focus:ring-[#C5A880] bg-[#FDFBF7] font-sans text-sm h-11"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#1C2D1F] hover:bg-[#2C3D2F] text-white font-sans text-sm font-bold uppercase tracking-widest transition-all duration-200 mt-2 active:scale-[0.98]"
                  >
                    {isSubmitting ? "Securing Voucher..." : "Secure Your $75 Voucher"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="bg-[#FDFBF7] border-t border-[#E8E3DD] p-4 flex justify-center items-center space-x-2 text-[10px] text-[#8C9E88] font-sans uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL Secured & Verified • Real-Time Activation</span>
              </CardFooter>
            </Card>
          )}

          {/* QUIZ STEP 1 - Travel Frequency */}
          {step === "QUIZ_1" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden">
              <div className="p-1 bg-[#C5A880]"></div>
              <CardHeader className="p-6 md:p-8 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A880] font-bold">Step 1 of 4</span>
                  <span className="text-xs font-sans text-[#8C9E88]">Travel Profile</span>
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold text-[#1C2D1F] tracking-tight">
                  How often do you travel with your golf clubs annually?
                </CardTitle>
                <CardDescription className="font-sans text-xs text-[#5C6E58]">
                  This helps customize your Ship Sticks fulfillment routing.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-6">
                <RadioGroup 
                  onValueChange={(val) => {
                    setQuizAnswers({ ...quizAnswers, frequency: val });
                    setTimeout(() => setStep("QUIZ_2"), 300);
                  }}
                  className="space-y-3"
                >
                  {[
                    { value: "1-2", label: "1 to 2 times a year" },
                    { value: "3-5", label: "3 to 5 times a year (Frequent)" },
                    { value: "6+", label: "6+ times a year (Elite Traveler)" }
                  ].map((opt) => (
                    <Label 
                      key={opt.value}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#E8E3DD] hover:border-[#C5A880] bg-[#FDFBF7] cursor-pointer transition-all duration-200"
                    >
                      <span className="font-sans text-sm font-medium text-[#1C2D1F]">{opt.label}</span>
                      <RadioGroupItem value={opt.value} className="text-[#C5A880] border-[#E8E3DD] focus:ring-[#C5A880]" />
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* QUIZ STEP 2 - Value of Equipment */}
          {step === "QUIZ_2" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden">
              <div className="p-1 bg-[#C5A880]"></div>
              <CardHeader className="p-6 md:p-8 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A880] font-bold">Step 2 of 4</span>
                  <span className="text-xs font-sans text-[#8C9E88]">Asset Valuation</span>
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold text-[#1C2D1F] tracking-tight">
                  What is the estimated value of your golf clubs & gear?
                </CardTitle>
                <CardDescription className="font-sans text-xs text-[#5C6E58]">
                  We use this to calculate the optimal transit protection tier.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-6">
                <RadioGroup 
                  onValueChange={(val) => {
                    setQuizAnswers({ ...quizAnswers, clubValue: val });
                    setTimeout(() => setStep("QUIZ_3"), 300);
                  }}
                  className="space-y-3"
                >
                  {[
                    { value: "under-1500", label: "Under $1,500" },
                    { value: "1500-3000", label: "$1,500 to $3,000" },
                    { value: "3000-5000", label: "$3,000 to $5,000" },
                    { value: "5000-plus", label: "Over $5,000 (Custom/Premium)" }
                  ].map((opt) => (
                    <Label 
                      key={opt.value}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#E8E3DD] hover:border-[#C5A880] bg-[#FDFBF7] cursor-pointer transition-all duration-200"
                    >
                      <span className="font-sans text-sm font-medium text-[#1C2D1F]">{opt.label}</span>
                      <RadioGroupItem value={opt.value} className="text-[#C5A880] border-[#E8E3DD] focus:ring-[#C5A880]" />
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* QUIZ STEP 3 - Repatriation Knowledge */}
          {step === "QUIZ_3" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden">
              <div className="p-1 bg-[#C5A880]"></div>
              <CardHeader className="p-6 md:p-8 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A880] font-bold">Step 3 of 4</span>
                  <span className="text-xs font-sans text-[#8C9E88]">Safety Awareness</span>
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold text-[#1C2D1F] tracking-tight">
                  Do you have a plan to get your remains home in an unforeseen crisis?
                </CardTitle>
                <CardDescription className="font-sans text-xs text-[#5C6E58]">
                  If you value shipping your clubs safely, what about yourself?
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-6">
                <RadioGroup 
                  onValueChange={(val) => {
                    setQuizAnswers({ ...quizAnswers, repatriationKnowledge: val });
                    setTimeout(() => setStep("QUIZ_4"), 300);
                  }}
                  className="space-y-3"
                >
                  {[
                    { value: "yes-covered", label: "Yes, I assume my health insurance covers it" },
                    { value: "no-plan", label: "No, I do not have a dedicated plan in place" },
                    { value: "not-sure", label: "I am not sure what repatriation involves" }
                  ].map((opt) => (
                    <Label 
                      key={opt.value}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#E8E3DD] hover:border-[#C5A880] bg-[#FDFBF7] cursor-pointer transition-all duration-200"
                    >
                      <span className="font-sans text-sm font-medium text-[#1C2D1F]">{opt.label}</span>
                      <RadioGroupItem value={opt.value} className="text-[#C5A880] border-[#E8E3DD] focus:ring-[#C5A880]" />
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* QUIZ STEP 4 - Planner Mindset */}
          {step === "QUIZ_4" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden">
              <div className="p-1 bg-[#C5A880]"></div>
              <CardHeader className="p-6 md:p-8 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A880] font-bold">Step 4 of 4</span>
                  <span className="text-xs font-sans text-[#8C9E88]">Peace of Mind</span>
                </div>
                <CardTitle className="text-xl md:text-2xl font-bold text-[#1C2D1F] tracking-tight">
                  Would you value having a guaranteed crisis plan in place for your family?
                </CardTitle>
                <CardDescription className="font-sans text-xs text-[#5C6E58]">
                  Being responsible means protecting both your gear and your loved ones.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-6">
                <RadioGroup 
                  onValueChange={(val) => {
                    setQuizAnswers({ ...quizAnswers, plannerMindset: val });
                    setTimeout(() => setStep("OFFER"), 300);
                  }}
                  className="space-y-3"
                >
                  {[
                    { value: "essential", label: "Absolutely, peace of mind is priceless" },
                    { value: "interested", label: "Yes, if the investment is reasonable" },
                    { value: "neutral", label: "I would like to learn more about the savings" }
                  ].map((opt) => (
                    <Label 
                      key={opt.value}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#E8E3DD] hover:border-[#C5A880] bg-[#FDFBF7] cursor-pointer transition-all duration-200"
                    >
                      <span className="font-sans text-sm font-medium text-[#1C2D1F]">{opt.label}</span>
                      <RadioGroupItem value={opt.value} className="text-[#C5A880] border-[#E8E3DD] focus:ring-[#C5A880]" />
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* THE OFFER STEP - Value Stack & Transition to Travel Protection Club */}
          {step === "OFFER" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden">
              <div className="relative bg-[#1C2D1F] text-[#FDFBF7] p-6 md:p-8 text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-sans uppercase tracking-[0.2em] font-bold">
                  Profile Complete • Voucher Unlocked
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Your $75 Ship Sticks Credit is Ready
                </h2>
                <p className="text-xs md:text-sm text-[#8C9E88] font-sans">
                  Apply your credit to get a premium $150 membership for just $75 net.
                </p>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Educational Core / Story */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#C5A880]">
                    <Compass className="w-5 h-5" />
                    <h3 className="text-sm uppercase tracking-wider font-sans font-bold text-[#1C2D1F]">
                      Why Travel Protection Club?
                    </h3>
                  </div>
                  
                  <p className="text-xs md:text-sm text-[#5C6E58] font-sans leading-relaxed">
                    You've taken the responsible step to ship your cherished clubs safely with **Ship Sticks**. But as an active golfer who travels, have you protected your most valuable asset? 
                  </p>

                  <blockquote className="border-l-2 border-[#C5A880] pl-4 py-1 my-3 text-xs md:text-sm text-[#1C2D1F] italic font-medium">
                    "If you value a $75 voucher to get your clubs home safely, wouldn't you value a plan to get yourself home to your loved ones in an unforeseen crisis?"
                  </blockquote>

                  <p className="text-xs md:text-sm text-[#5C6E58] font-sans leading-relaxed">
                    Most golfers don't realize that **standard health insurance and Medicare do not cover medical repatriation**. Getting you and your remains home in a crisis can cost your family upwards of **$20,000 to $50,000** out of pocket. 
                  </p>
                </div>

                {/* The Value Stack */}
                <div className="border-t border-[#E8E3DD] pt-6 space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-sans font-bold text-[#1C2D1F]">
                    Your Premium Member Package Includes:
                  </h4>

                  <div className="space-y-3">
                    {[
                      { title: "Elite Medical Repatriation Coverage", desc: "Guaranteed crisis coordination to return you to your local hospital in an emergency." },
                      { title: "First-Call™ 24/7 Crisis Assistance", desc: "One call handles all foreign medical logistics so your family doesn't have to." },
                      { title: "Guaranteed $75 Ship Sticks Voucher", desc: "Direct rebate credit to use on your next golf travel shipment." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-sans text-[#1C2D1F]">{item.title}</strong>
                          <p className="text-[#5C6E58] font-sans mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Pricing Box */}
                <div className="bg-[#F4F1EA] p-5 rounded-lg border border-[#E8E3DD] flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#5C6E58] font-bold">First Year Membership</span>
                    <h3 className="text-lg font-bold text-[#1C2D1F]">Travel Protection Club</h3>
                    <p className="text-[10px] text-[#8C9E88] font-sans">Includes $75 Ship Sticks Voucher Rebate</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#8C9E88] line-through font-sans block">$150.00</span>
                    <span className="text-2xl font-bold text-[#1C2D1F]">$150.00</span>
                    <span className="text-[10px] text-[#C5A880] font-sans block font-bold">($75 Net Cost)</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setStep("STRIPE_CHECKOUT")}
                  className="w-full h-12 bg-[#1C2D1F] hover:bg-[#2C3D2F] text-white font-sans text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
                >
                  Join the Club & Claim Voucher <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STRIPE CHECKOUT SIMULATION STEP */}
          {step === "STRIPE_CHECKOUT" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden">
              <div className="bg-[#FDFBF7] border-b border-[#E8E3DD] p-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#C5A880]" />
                  <span className="text-xs uppercase tracking-widest font-sans font-bold text-[#1C2D1F]">Secure Stripe Checkout</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-[#8C9E88] font-sans">
                  <Lock className="w-3 h-3" />
                  <span>SSL 256-Bit</span>
                </div>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Summary Box */}
                <div className="bg-[#F4F1EA] p-4 rounded-lg border border-[#E8E3DD] space-y-2">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-[#5C6E58]">Travel Protection Club Membership</span>
                    <span className="text-[#1C2D1F] font-bold">$150.00</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans border-t border-[#E8E3DD] pt-2">
                    <span className="text-[#C5A880] font-bold">Ship Sticks Voucher (Locked)</span>
                    <span className="text-[#C5A880] font-bold">-$75.00 Value</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans border-t border-[#E8E3DD] pt-2 font-bold">
                    <span className="text-[#1C2D1F]">Total Charged Now</span>
                    <span className="text-[#1C2D1F]">$150.00</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-xs uppercase tracking-wider font-sans text-[#5C6E58]">Card Number</Label>
                    <div className="relative">
                      <Input 
                        id="cardNumber" 
                        name="number" 
                        placeholder="4242 4242 4242 4242" 
                        value={cardData.number}
                        onChange={handleCardChange}
                        className="border-[#E8E3DD] focus:border-[#C5A880] focus:ring-[#C5A880] bg-[#FDFBF7] font-sans text-sm h-11 pl-10"
                      />
                      <CreditCard className="w-4 h-4 text-[#8C9E88] absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-xs uppercase tracking-wider font-sans text-[#5C6E58]">Expiration</Label>
                      <Input 
                        id="expiry" 
                        name="expiry" 
                        placeholder="MM/YY" 
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        className="border-[#E8E3DD] focus:border-[#C5A880] focus:ring-[#C5A880] bg-[#FDFBF7] font-sans text-sm h-11 text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvc" className="text-xs uppercase tracking-wider font-sans text-[#5C6E58]">CVC</Label>
                      <Input 
                        id="cvc" 
                        name="cvc" 
                        placeholder="123" 
                        value={cardData.cvc}
                        onChange={handleCardChange}
                        className="border-[#E8E3DD] focus:border-[#C5A880] focus:ring-[#C5A880] bg-[#FDFBF7] font-sans text-sm h-11 text-center"
                      />
                    </div>
                  </div>

                  {/* Pre-fill button for fast presentation */}
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={prefillDemoCard}
                      className="text-[10px] font-sans h-7 px-2.5 border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880]/10 bg-transparent"
                    >
                      Pre-fill Demo Card
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    toast.success("Payment authorized successfully!");
                    setStep("SUCCESS");
                  }}
                  className="w-full h-12 bg-[#1C2D1F] hover:bg-[#2C3D2F] text-white font-sans text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
                >
                  Authorize Payment $150.00
                </Button>
              </CardContent>

              <CardFooter className="bg-[#FDFBF7] border-t border-[#E8E3DD] p-4 flex justify-center items-center space-x-2 text-[10px] text-[#8C9E88] font-sans">
                <Shield className="w-3.5 h-3.5" />
                <span>PCI-DSS Compliant • Secure Tokenized Gateway</span>
              </CardFooter>
            </Card>
          )}

          {/* SUCCESS OUTCOME STEP */}
          {step === "SUCCESS" && (
            <Card className="border border-[#E8E3DD] shadow-2xl bg-white overflow-hidden text-center">
              <div className="bg-[#1C2D1F] p-8 text-[#FDFBF7] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#C5A880]/20 flex items-center justify-center mx-auto text-[#C5A880]">
                  <Gift className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Membership Activated!</h2>
                <p className="text-xs text-[#8C9E88] font-sans">
                  Thank you, {formData.name || "Peter DeLuca"}. Your first-year Travel Protection Club membership is active. Your family is now fully protected.
                </p>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="border border-dashed border-[#C5A880] p-6 rounded-lg bg-[#FDFBF7] space-y-3">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#C5A880] font-bold">Your Ship Sticks Voucher Code</span>
                  <div className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-[#1C2D1F] select-all bg-white py-2 border border-[#E8E3DD] rounded">
                    SS-GOLF-75-ACTIVE
                  </div>
                  <p className="text-xs text-[#5C6E58] font-sans">
                    Copy this code to use on your next golf travel shipment. An activation link has been sent to **{formData.email || "pdeluca@gmail.com"}**.
                  </p>
                </div>

                <div className="space-y-4 text-left">
                  <h4 className="text-xs uppercase tracking-wider font-sans font-bold text-[#1C2D1F]">What Happens Next:</h4>
                  <ul className="space-y-2.5 text-xs text-[#5C6E58] font-sans">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>Check your inbox for the digital welcome packet and membership guidelines.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>Download and share the 1-Page Family Instruction sheet.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>Your physical membership card and luggage tags will arrive in 5-7 business days.</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={() => {
                    setStep("LANDING");
                    setForm({ name: "", email: "", phone: "" });
                    setCardData({ number: "", expiry: "", cvc: "" });
                  }}
                  className="w-full h-11 bg-transparent hover:bg-[#F4F1EA] text-[#1C2D1F] border border-[#E8E3DD] font-sans text-xs font-bold uppercase tracking-widest transition-all duration-200"
                >
                  Simulate Next Scan
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-[#E8E3DD] bg-white py-6 px-6 text-center text-[10px] text-[#8C9E88] font-sans uppercase tracking-wider space-y-2">
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-[#1C2D1F] transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-[#1C2D1F] transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-[#1C2D1F] transition-colors">Fulfillment Support</a>
        </div>
        <p className="normal-case tracking-normal font-sans text-[9px] text-[#A0B09C]">
          © 2026 Travel Protection Club. All rights reserved. Ship Sticks® is a registered trademark of Ship Sticks, LLC.
        </p>
      </footer>
    </div>
  );
}
