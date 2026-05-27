import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, 
  ShieldCheck, 
  Plane, 
  Gift, 
  ArrowRight, 
  CheckCircle, 
  Lock, 
  CreditCard,
  PhoneCall,
  User,
  HeartHandshake
} from "lucide-react";

// Funnel Steps
type FunnelStep = 
  | "LANDING"          // Pure $75 Voucher claim, no Global 360 branding
  | "QUIZ_1"           // Travel frequency
  | "QUIZ_2"           // Equipment value
  | "QUIZ_3"           // Crisis awareness
  | "QUIZ_4"           // Family emergency contact preference
  | "OFFER"            // The reveal: Join the Travel Protection Club to unlock voucher
  | "STRIPE_CHECKOUT"  // Secure Stripe checkout
  | "SUCCESS";         // Active voucher code & welcome info

export default function Home() {
  const [step, setStep] = useState<FunnelStep>("LANDING");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quiz Answers
  const [travelFreq, setTravelFreq] = useState("");
  const [equipmentValue, setEquipmentValue] = useState("");
  const [crisisAwareness, setCrisisAwareness] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Stripe Card Simulation
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Auto-scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Handle Landing Opt-In Submission (Natively posts to YAT?STATS)
  const handleLandingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in both Name and Email to reserve your voucher.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Background submission to YAT?STATS native form to ensure lead is captured
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone || "");
      formData.append("formId", "H634urGOeGS6U0BpCfBS");

      // Post in background natively
      await fetch("https://api.armsreachdigital.com/widget/form/H634urGOeGS6U0BpCfBS", {
        method: "POST",
        body: formData,
        mode: "no-cors" // Prevent CORS preflight blocks while ensuring submission dispatches
      });

      toast.success("Voucher Reserved! Let's complete your profile.");
      setStep("QUIZ_1");
    } catch (err) {
      console.error("Submission error:", err);
      // Fail-safe: always advance the demo even if network fails
      setStep("QUIZ_1");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreFillCard = () => {
    setCardNumber("4242 •••• •••• 4242");
    setCardExpiry("12 / 29");
    setCardCvc("123");
    toast.success("Demo credit card pre-filled.");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast.error("Please fill in all card details.");
      return;
    }

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setStep("SUCCESS");
      toast.success("Membership Activated! Your $75 Voucher is unlocked.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-stone-900 font-serif selection:bg-emerald-800 selection:text-white flex flex-col justify-between">
      {/* 1. Header: Completely clean, NO Global 360 or Repatriation branding to avoid friction */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-emerald-800" />
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-stone-500">
              GOLF TRAVEL REWARDS
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-500 text-xs font-sans">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Secure Voucher Activation Portal</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* STEP 1: LANDING - Pure Voucher Claim Hook */}
          {step === "LANDING" && (
            <Card className="border-stone-200 shadow-xl overflow-hidden bg-white">
              {/* Luxury Golf Banner */}
              <div className="relative h-48 bg-stone-900 flex items-end">
                <img 
                  src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=1200" 
                  alt="Luxury Golf Course" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent" />
                <div className="relative p-6 text-white">
                  <span className="text-xs font-sans uppercase tracking-widest bg-emerald-800/80 text-emerald-50 px-2 py-1 rounded">
                    Exclusive Invitation Only
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold mt-2 leading-tight">
                    Your $75 Golf Travel Shipping Voucher Is Reserved
                  </h1>
                </div>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                <p className="text-stone-600 font-sans text-sm md:text-base leading-relaxed">
                  Congratulations! Your invitation qualifies you for a **$75 credit** toward premium golf club shipping. Ensure your cherished clubs travel safely, stress-free, and arrive directly at your next course destination.
                </p>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 space-y-2">
                  <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-800" />
                    Instant Voucher Reservation
                  </h3>
                  <p className="text-xs text-stone-500 font-sans leading-relaxed">
                    Secure your credit code first. Once registered, you can apply this $75 credit directly to your next golf club shipment.
                  </p>
                </div>

                <form onSubmit={handleLandingSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input 
                        id="name"
                        placeholder="e.g., Andrew Miller"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-9 font-sans border-stone-300 focus:border-emerald-800 focus:ring-emerald-800/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input 
                        id="email"
                        type="email"
                        placeholder="e.g., andrew@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-9 font-sans border-stone-300 focus:border-emerald-800 focus:ring-emerald-800/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold">
                      Mobile Number <span className="text-stone-400 font-normal">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input 
                        id="phone"
                        type="tel"
                        placeholder="e.g., (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 font-sans border-stone-300 focus:border-emerald-800 focus:ring-emerald-800/20"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-sans uppercase tracking-widest text-xs py-6 mt-2 transition-all duration-300 shadow-md active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Securing Voucher...
                      </>
                    ) : (
                      <>
                        Secure Your $75 Voucher
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: QUIZ 1 - Travel Frequency */}
          {step === "QUIZ_1" && (
            <Card className="border-stone-200 shadow-xl bg-white p-6 md:p-8 space-y-6">
              <div className="space-y-2 text-center">
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-emerald-800">
                  Step 1 of 4: Travel Profile
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-stone-900">
                  How often do you travel with your golf clubs annually?
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 font-sans">
                {[
                  { label: "Occasionally (1-2 trips per year)", val: "occasionally" },
                  { label: "Regularly (3-5 trips per year)", val: "regularly" },
                  { label: "Frequently (6+ trips per year)", val: "frequently" }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setTravelFreq(opt.val);
                      setStep("QUIZ_2");
                    }}
                    className="w-full text-left p-4 rounded-lg border border-stone-200 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all text-sm font-medium focus:outline-none"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* STEP 3: QUIZ 2 - Equipment Value */}
          {step === "QUIZ_2" && (
            <Card className="border-stone-200 shadow-xl bg-white p-6 md:p-8 space-y-6">
              <div className="space-y-2 text-center">
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-emerald-800">
                  Step 2 of 4: Equipment Value
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-stone-900">
                  What is the estimated replacement value of your golf equipment?
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 font-sans">
                {[
                  { label: "Under $2,500", val: "under_2500" },
                  { label: "$2,500 - $5,000", val: "2500_5000" },
                  { label: "Over $5,000 (Custom fitted/Premium)", val: "over_5000" }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setEquipmentValue(opt.val);
                      setStep("QUIZ_3");
                    }}
                    className="w-full text-left p-4 rounded-lg border border-stone-200 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all text-sm font-medium focus:outline-none"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* STEP 4: QUIZ 3 - Crisis Awareness */}
          {step === "QUIZ_3" && (
            <Card className="border-stone-200 shadow-xl bg-white p-6 md:p-8 space-y-6">
              <div className="space-y-2 text-center">
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-emerald-800">
                  Step 3 of 4: Crisis Coordination
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-stone-900">
                  Do you currently have a plan to coordinate and pay for emergency medical transportation back to your local hospital in a travel crisis?
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 font-sans">
                {[
                  { label: "Yes, I assume my health insurance covers it", val: "assume_covered" },
                  { label: "No, I do not have a dedicated plan", val: "no_plan" },
                  { label: "Unsure of how repatriation works", val: "unsure" }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setCrisisAwareness(opt.val);
                      setStep("QUIZ_4");
                    }}
                    className="w-full text-left p-4 rounded-lg border border-stone-200 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all text-sm font-medium focus:outline-none"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* STEP 5: QUIZ 4 - Emergency Contact Preference */}
          {step === "QUIZ_4" && (
            <Card className="border-stone-200 shadow-xl bg-white p-6 md:p-8 space-y-6">
              <div className="space-y-2 text-center">
                <span className="font-sans text-xs uppercase tracking-widest font-bold text-emerald-800">
                  Step 4 of 4: Family Preparedness
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-stone-900">
                  If an unforeseen emergency occurs, would you prefer your loved ones to coordinate medical logistics, or have a professional single-point-of-contact handle everything?
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 font-sans">
                {[
                  { label: "I want a professional team to handle everything", val: "professional" },
                  { label: "My family can coordinate with hospitals/airlines", val: "family" }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setEmergencyContact(opt.val);
                      setStep("OFFER");
                    }}
                    className="w-full text-left p-4 rounded-lg border border-stone-200 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all text-sm font-medium focus:outline-none"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* STEP 6: THE OFFER REVEAL */}
          {step === "OFFER" && (
            <Card className="border-stone-200 shadow-2xl overflow-hidden bg-white">
              {/* Premium Branding Header */}
              <div className="bg-emerald-950 text-white p-6 text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-sans font-bold">
                  Exclusive Invitation Benefit
                </span>
                <h2 className="text-2xl font-bold">GLOBAL 360</h2>
                <p className="text-xs text-stone-300 font-sans italic">Travel Protection Club</p>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-stone-900 text-center">
                    Activate Your $75 Shipping Voucher by Securing Your Peace of Mind
                  </h3>
                  <p className="text-stone-600 font-sans text-xs md:text-sm leading-relaxed">
                    Andrew, as a responsible golfer, you plan ahead to protect your expensive clubs. But what about protecting **yourself**? 
                  </p>
                  <p className="text-stone-600 font-sans text-xs md:text-sm leading-relaxed">
                    Standard health insurance does **not** pay to fly you or your remains back home in a medical crisis. The cost of medical repatriation can exceed **$50,000**.
                  </p>
                  <p className="text-stone-600 font-sans text-xs md:text-sm leading-relaxed">
                    To activate your **$75 ShipSticks-style voucher**, we invite you to join the **Global 360 Travel Protection Club**. Your annual membership is normally $150—but once you apply your $75 rebate credit, you are securing a full year of elite protection for **half price**.
                  </p>
                </div>

                {/* Core Benefits List */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3 font-sans">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700">
                    What is Included in Your Membership:
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                      <span><strong>Elite Global Medical Repatriation:</strong> Complete air ambulance coordination to bring you and your remains back to your local home hospital.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                      <span><strong>First-Call Emergency Assistance:</strong> A single, dedicated professional emergency coordinator available 24/7 to manage hospital logistics.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                      <span><strong>$75 Shipping Voucher:</strong> Unlocked instantly upon activation to use on your next premium golf club shipment.</span>
                    </li>
                  </ul>
                </div>

                {/* Pricing Comparison */}
                <div className="border border-emerald-100 rounded-lg bg-emerald-50/40 p-4 flex justify-between items-center font-sans">
                  <div>
                    <span className="text-xs text-stone-500 line-through">Standard Price: $150/yr</span>
                    <div className="text-lg font-bold text-emerald-950">
                      Your Price: $150 <span className="text-xs font-normal text-stone-500">(Includes $75 Voucher Rebate)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded">
                      Net Cost: $75
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Button 
                    onClick={() => setStep("STRIPE_CHECKOUT")}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-sans uppercase tracking-widest text-xs py-6 shadow-md active:scale-[0.98]"
                  >
                    Accept Offer & Activate Voucher
                  </Button>
                  <button 
                    onClick={() => {
                      toast.info("Thank you. We have saved your voucher reservation. Check your inbox for your Plan B follow-up!");
                      setStep("LANDING");
                    }}
                    className="text-stone-400 hover:text-stone-600 text-xs font-sans underline transition-colors py-1"
                  >
                    No thanks, I will forfeit my $75 shipping voucher
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 7: SECURE STRIPE CHECKOUT */}
          {step === "STRIPE_CHECKOUT" && (
            <Card className="border-stone-200 shadow-2xl overflow-hidden bg-white">
              {/* Stripe Header */}
              <div className="bg-stone-900 text-white p-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span className="font-sans text-xs uppercase tracking-widest font-bold">
                    Secure Stripe Checkout
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 font-sans">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>SSL Encrypted</span>
                </div>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Order Summary */}
                <div className="border-b border-stone-100 pb-4 space-y-2 font-sans">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Travel Protection Club (Annual Membership)</span>
                    <span className="font-semibold">$150.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-800 font-semibold bg-emerald-50 p-2 rounded">
                    <span>Golf Travel Voucher Rebate Included</span>
                    <span>-$75.00 Value</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>Amount Due Today</span>
                    <span>$150.00</span>
                  </div>
                </div>

                {/* Simulated Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-number" className="font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold">
                      Card Number
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input 
                        id="card-number"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        className="pl-9 font-sans border-stone-300 focus:border-emerald-800 focus:ring-emerald-800/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="card-expiry" className="font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold">
                        Expiration
                      </Label>
                      <Input 
                        id="card-expiry"
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        className="font-sans border-stone-300 focus:border-emerald-800 focus:ring-emerald-800/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="card-cvc" className="font-sans text-xs uppercase tracking-wider text-stone-600 font-semibold">
                        CVC
                      </Label>
                      <Input 
                        id="card-cvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                        className="font-sans border-stone-300 focus:border-emerald-800 focus:ring-emerald-800/20"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handlePreFillCard}
                      className="flex-1 font-sans text-xs uppercase tracking-wider py-5 border-stone-300 hover:bg-stone-50"
                    >
                      Pre-fill Demo Card
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isPaying}
                      className="flex-[2] bg-emerald-800 hover:bg-emerald-900 text-white font-sans uppercase tracking-widest text-xs py-5 shadow-md active:scale-[0.98]"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Authorizing...
                        </>
                      ) : (
                        "Pay $150.00 Securely"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 8: SUCCESS / VOUCHER REVEAL */}
          {step === "SUCCESS" && (
            <Card className="border-stone-200 shadow-2xl overflow-hidden bg-white">
              <div className="bg-emerald-900 text-white p-8 text-center space-y-3">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto" />
                <h2 className="text-2xl font-bold">MEMBERSHIP ACTIVATED!</h2>
                <p className="text-xs text-stone-300 font-sans max-w-xs mx-auto leading-relaxed">
                  Thank you, **{name || "Peter DeLuca"}**. Your first-year Travel Protection Club membership is active. Your family is now fully protected.
                </p>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Active Voucher Code Box */}
                <div className="border-2 border-dashed border-emerald-800 rounded-xl p-6 text-center space-y-3 bg-emerald-50/30">
                  <span className="font-sans text-xs uppercase tracking-widest font-bold text-emerald-800">
                    Your $75 Shipping Voucher
                  </span>
                  <div className="text-2xl md:text-3xl font-mono font-bold tracking-wider text-stone-900">
                    SS-GOLF-75-ACTIVE
                  </div>
                  <p className="text-xs text-stone-500 font-sans leading-relaxed">
                    Copy this code to use on your next golf travel shipment. An activation link has also been sent to **{email || "your email"}**.
                  </p>
                </div>

                {/* What Happens Next */}
                <div className="space-y-3 font-sans">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700">
                    What Happens Next:
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-800 shrink-0" />
                      <span>Check your inbox for the digital welcome packet.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-800 shrink-0" />
                      <span>Download and share the 1-Page Family Instruction sheet.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-800 shrink-0" />
                      <span>Your physical membership card will arrive in 5-7 business days.</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setPhone("");
                    setCardNumber("");
                    setCardExpiry("");
                    setCardCvc("");
                    setStep("LANDING");
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-sans uppercase tracking-widest text-xs py-5 mt-2 transition-all"
                >
                  Simulate Next Scan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-stone-400">
          <p>© 2026 Golf Travel Rewards. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-stone-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-stone-600 transition-colors">Voucher Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
