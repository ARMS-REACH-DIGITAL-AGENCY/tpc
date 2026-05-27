import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Shield, Plane, HelpCircle, PhoneCall, Award, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

type FunnelStep = "OPT_IN" | "QUIZ_1" | "QUIZ_2" | "QUIZ_3" | "QUIZ_4" | "OFFER" | "STRIPE_CHECKOUT" | "SUCCESS";

export default function Home() {
  const [step, setStep] = useState<FunnelStep>("OPT_IN");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Quiz answers
  const [travelFreq, setQuizTravelFreq] = useState("3-5");
  const [gearValue, setQuizGearValue] = useState("$2,000-$5,000");
  const [hasPlan, setQuizHasPlan] = useState("no");
  const [plannerMindset, setQuizPlannerHasMindset] = useState("yes");

  // Webhook trigger URL (saved locally)
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("yatstats_webhook_url") || "";
  });

  useEffect(() => {
    localStorage.setItem("yatstats_webhook_url", webhookUrl);
  }, [webhookUrl]);

  // Submit contact to YAT?STATS HighLevel Form in the background
  const handleOptInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    toast.info("Verifying invitation and reserving voucher...");

    // Send background webhook payload if configured
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            source: "Ship Sticks Voucher Funnel",
            tag: "Golf_Wedge_Launch",
            timestamp: new Date().toISOString()
          })
        });
        toast.success("Live contact pushed to YAT?STATS!");
      } catch (err) {
        console.error("Webhook submission failed:", err);
      }
    } else {
      // Free form submission fallback (Post directly to the YAT?STATS form endpoint in the background)
      try {
        const bodyData = new URLSearchParams();
        bodyData.append("formId", "H634urGOeGS6U0BpCfBS");
        bodyData.append("full_name", formData.name);
        bodyData.append("email", formData.email);
        if (formData.phone) bodyData.append("phone", formData.phone);

        // Standard HighLevel Form Post
        fetch("https://api.armsreachdigital.com/widget/form/H634urGOeGS6U0BpCfBS", {
          method: "POST",
          mode: "no-cors", // Prevents CORS blocks for standard post
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: bodyData.toString()
        });
        
        toast.success("Voucher Reserved! Contact logged in YAT?STATS.");
      } catch (err) {
        console.error("Form background post failed:", err);
      }
    }

    // Instantly advance to the quiz with zero extra clicks
    setStep("QUIZ_1");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2D1F] font-serif flex flex-col selection:bg-[#E6DFD3] selection:text-[#1C2D1F]">
      {/* Premium Minimal Header */}
      <header className="border-b border-[#EAE4D8] py-4 px-6 bg-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/manus-storage/shipsticks_logo_ffe81851.png" 
            alt="Ship Sticks" 
            className="h-10 object-contain"
          />
          <div className="h-6 w-px bg-[#EAE4D8]" />
          <span className="text-xs tracking-[0.2em] uppercase text-[#6B7F6D] font-sans font-semibold">
            Fulfillment Partner
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#6B7F6D] font-sans font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Secure Verification Portal
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center py-12 px-4 max-w-4xl mx-auto w-full">
        {step === "OPT_IN" && (
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#EAE4D8] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300">
            {/* Elegant Hero Wedge Banner */}
            <div className="bg-[#1C2D1F] text-white p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-[#E6DFD3]/10 border border-[#E6DFD3]/20 rounded-full text-[10px] tracking-[0.2em] uppercase text-[#E6DFD3] font-sans font-semibold mb-4">
                  Exclusive Invitation Only
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 font-serif">
                  YOUR $75 SHIP STICKS VOUCHER IS RESERVED
                </h1>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-[#4A5D4E] font-sans text-base leading-relaxed text-center">
                Congratulations! Your invitation scan qualifies you for a **$75 credit** toward premium golf club shipping with **Ship Sticks**. Ensure your cherished clubs travel safely, stress-free, and arrive directly at your next course destination.
              </p>

              <div className="bg-[#F9F7F2] border border-[#EAE4D8] rounded-xl p-5 flex gap-4 items-start">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-[#1C2D1F] uppercase tracking-wider mb-1">
                    Instant Voucher Reservation
                  </h3>
                  <p className="text-xs text-[#6B7F6D] font-sans leading-relaxed">
                    Secure your credit first. Once registered, you can apply this $75 credit directly to your next golf club shipment.
                  </p>
                </div>
              </div>

              {/* Custom Seamless React Form */}
              <form onSubmit={handleOptInSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs tracking-wider uppercase text-[#6B7F6D] font-sans font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g., Andrew Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-[#EAE4D8] focus:border-[#1C2D1F] focus:ring-0 rounded-lg bg-white font-sans text-sm py-5"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs tracking-wider uppercase text-[#6B7F6D] font-sans font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g., andrew@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-[#EAE4D8] focus:border-[#1C2D1F] focus:ring-0 rounded-lg bg-white font-sans text-sm py-5"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="phone" className="text-xs tracking-wider uppercase text-[#6B7F6D] font-sans font-semibold">
                      Mobile Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </Label>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-[#EAE4D8] focus:border-[#1C2D1F] focus:ring-0 rounded-lg bg-white font-sans text-sm py-5"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#1C2D1F] hover:bg-[#2C3F30] text-white py-6 rounded-lg font-sans font-bold tracking-wider uppercase text-xs transition-all duration-200 mt-4 active:scale-[0.98]"
                >
                  Secure Your $75 Voucher →
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Quiz Steps */}
        {step === "QUIZ_1" && (
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#EAE4D8] p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans tracking-widest text-[#6B7F6D] uppercase font-bold">Step 1 of 4</span>
              <span className="text-xs font-sans tracking-widest text-emerald-600 uppercase font-bold">Verification In Progress</span>
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight">How often do you travel for golf excursions each year?</h2>
            <RadioGroup value={travelFreq} onValueChange={setQuizTravelFreq} className="space-y-3 pt-2">
              {[
                { value: "1-2", label: "1 to 2 times a year" },
                { value: "3-5", label: "3 to 5 times a year" },
                { value: "6+", label: "6 or more times a year" }
              ].map((opt) => (
                <Label key={opt.value} className="flex items-center justify-between p-4 border border-[#EAE4D8] rounded-xl cursor-pointer hover:bg-[#F9F7F2] transition-colors font-sans text-sm">
                  <span>{opt.label}</span>
                  <RadioGroupItem value={opt.value} />
                </Label>
              ))}
            </RadioGroup>
            <Button onClick={() => setStep("QUIZ_2")} className="w-full bg-[#1C2D1F] hover:bg-[#2C3F30] text-white py-5 rounded-lg font-sans font-bold tracking-wider uppercase text-xs">
              Continue
            </Button>
          </div>
        )}

        {step === "QUIZ_2" && (
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#EAE4D8] p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans tracking-widest text-[#6B7F6D] uppercase font-bold">Step 2 of 4</span>
              <span className="text-xs font-sans tracking-widest text-emerald-600 uppercase font-bold">Verification In Progress</span>
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight">What is the estimated replacement value of your golf clubs & travel gear?</h2>
            <RadioGroup value={gearValue} onValueChange={setQuizGearValue} className="space-y-3 pt-2">
              {[
                { value: "under-2k", label: "Under $2,000" },
                { value: "$2,000-$5,000", label: "$2,000 to $5,000" },
                { value: "over-5k", label: "Over $5,000" }
              ].map((opt) => (
                <Label key={opt.value} className="flex items-center justify-between p-4 border border-[#EAE4D8] rounded-xl cursor-pointer hover:bg-[#F9F7F2] transition-colors font-sans text-sm">
                  <span>{opt.label}</span>
                  <RadioGroupItem value={opt.value} />
                </Label>
              ))}
            </RadioGroup>
            <Button onClick={() => setStep("QUIZ_3")} className="w-full bg-[#1C2D1F] hover:bg-[#2C3F30] text-white py-5 rounded-lg font-sans font-bold tracking-wider uppercase text-xs">
              Continue
            </Button>
          </div>
        )}

        {step === "QUIZ_3" && (
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#EAE4D8] p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans tracking-widest text-[#6B7F6D] uppercase font-bold">Step 3 of 4</span>
              <span className="text-xs font-sans tracking-widest text-emerald-600 uppercase font-bold">Verification In Progress</span>
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight">Do you currently have a guaranteed medical repatriation plan in place for travel emergencies?</h2>
            <RadioGroup value={hasPlan} onValueChange={setQuizHasPlan} className="space-y-3 pt-2">
              {[
                { value: "yes", label: "Yes, I am fully covered" },
                { value: "no", label: "No, or I am unsure if my insurance covers it" }
              ].map((opt) => (
                <Label key={opt.value} className="flex items-center justify-between p-4 border border-[#EAE4D8] rounded-xl cursor-pointer hover:bg-[#F9F7F2] transition-colors font-sans text-sm">
                  <span>{opt.label}</span>
                  <RadioGroupItem value={opt.value} />
                </Label>
              ))}
            </RadioGroup>
            <Button onClick={() => setStep("QUIZ_4")} className="w-full bg-[#1C2D1F] hover:bg-[#2C3F30] text-white py-5 rounded-lg font-sans font-bold tracking-wider uppercase text-xs">
              Continue
            </Button>
          </div>
        )}

        {step === "QUIZ_4" && (
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#EAE4D8] p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs font-sans tracking-widest text-[#6B7F6D] uppercase font-bold">Step 4 of 4</span>
              <span className="text-xs font-sans tracking-widest text-emerald-600 uppercase font-bold">Verification In Progress</span>
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight">Would you value complete peace of mind knowing you and your remains would be returned home to your family in an unforeseen medical crisis?</h2>
            <RadioGroup value={plannerMindset} onValueChange={setQuizPlannerHasMindset} className="space-y-3 pt-2">
              {[
                { value: "yes", label: "Yes, protecting my family from logistical/financial crisis is essential" },
                { value: "maybe", label: "I would like to learn more about how it works" }
              ].map((opt) => (
                <Label key={opt.value} className="flex items-center justify-between p-4 border border-[#EAE4D8] rounded-xl cursor-pointer hover:bg-[#F9F7F2] transition-colors font-sans text-sm">
                  <span>{opt.label}</span>
                  <RadioGroupItem value={opt.value} />
                </Label>
              ))}
            </RadioGroup>
            <Button onClick={() => setStep("OFFER")} className="w-full bg-[#1C2D1F] hover:bg-[#2C3F30] text-white py-5 rounded-lg font-sans font-bold tracking-wider uppercase text-xs">
              Complete Verification
            </Button>
          </div>
        )}

        {/* Value-Stacked Offer Page */}
        {step === "OFFER" && (
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#EAE4D8] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300">
            <div className="bg-[#1C2D1F] text-white p-8 text-center">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#E6DFD3] font-sans font-semibold mb-2 block">Verification Successful</span>
              <h2 className="text-3xl font-bold font-serif tracking-tight">YOUR $75 SHIP STICKS VOUCHER IS UNLOCKED</h2>
              <p className="text-[#A3B899] font-sans text-sm mt-2">Exclusive Member Benefit: Save 50% on Your First Year</p>
            </div>

            <div className="p-8 space-y-6">
              {/* The Hook, Story, Offer */}
              <div className="space-y-4">
                <p className="text-sm font-sans text-[#4A5D4E] leading-relaxed">
                  As a golfer, you understand the importance of preparation. You protect your cherished golf clubs with premium shipping. But what about protecting **yourself** and your loved ones during your travels?
                </p>
                <p className="text-sm font-sans text-[#4A5D4E] leading-relaxed">
                  Standard health insurance and travel credit cards **do not cover** medical repatriation. If an unforeseen medical crisis occurs away from home, getting you or your remains back to your local hospital can cost your family upwards of **$50,000** in cash, plus immense logistical stress.
                </p>
                <p className="text-sm font-sans text-[#4A5D4E] leading-relaxed font-semibold text-[#1C2D1F]">
                  The **Travel Protection Club** is your ultimate safety plan. For a standard annual membership of $150, you gain guaranteed, zero-cost medical repatriation and 24/7 emergency coordination. 
                </p>
              </div>

              {/* The Value Stack Box */}
              <div className="bg-[#F9F7F2] border border-[#EAE4D8] rounded-xl p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#1C2D1F] border-b border-[#EAE4D8] pb-2">Your Value-Stacked Offer</h3>
                <div className="space-y-2 font-sans text-sm">
                  <div className="flex justify-between text-[#4A5D4E]">
                    <span>1-Year Travel Protection Club Membership</span>
                    <span className="font-semibold">$150.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Your Unlocked Ship Sticks Rebate Credit</span>
                    <span>-$75.00</span>
                  </div>
                  <div className="border-t border-[#EAE4D8] pt-3 flex justify-between text-[#1C2D1F] font-bold text-base">
                    <span>Net Investment After Rebate</span>
                    <span className="text-emerald-800">$75.00</span>
                  </div>
                </div>
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { icon: Shield, title: "Elite Repatriation", desc: "Guaranteed air transport home" },
                  { icon: Plane, title: "Worldwide Coverage", desc: "Protected anywhere on earth" },
                  { icon: HelpCircle, title: "Family Peace of Mind", desc: "Zero financial burden left behind" }
                ].map((p, idx) => (
                  <div key={idx} className="text-center p-3 border border-[#EAE4D8] rounded-xl bg-white">
                    <p.icon className="w-5 h-5 mx-auto text-[#6B7F6D] mb-1" />
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-[#1C2D1F]">{p.title}</h4>
                    <p className="text-[10px] text-[#6B7F6D] font-sans mt-0.5">{p.desc}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <Button onClick={() => setStep("STRIPE_CHECKOUT")} className="w-full bg-[#1C2D1F] hover:bg-[#2C3F30] text-white py-6 rounded-lg font-sans font-bold tracking-wider uppercase text-xs transition-all active:scale-[0.98]">
                  Activate Membership & Claim Voucher →
                </Button>
                <p className="text-center text-[10px] text-[#6B7F6D] font-sans">
                  By clicking, you agree to join the Travel Protection Club. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Simulated Stripe Checkout Screen */}
        {step === "STRIPE_CHECKOUT" && (
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#EAE4D8] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300">
            {/* Stripe Header */}
            <div className="bg-[#F8F9FC] border-b border-[#EAE4D8] p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="font-sans font-bold text-sm text-[#1C2D1F] tracking-tight">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-sans uppercase tracking-wider font-semibold">
                <Lock className="w-3 h-3 text-emerald-500" />
                SSL Encrypted
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Summary */}
              <div className="space-y-3 font-sans">
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  <span>Product</span>
                  <span>Price</span>
                </div>
                <div className="flex justify-between text-sm text-[#1C2D1F] font-semibold">
                  <span>Travel Protection Club (Annual)</span>
                  <span>$150.00</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-700 font-semibold">
                  <span>Ship Sticks Rebate Applied</span>
                  <span>-$75.00</span>
                </div>
                <div className="border-t border-dashed border-[#EAE4D8] pt-3 flex justify-between text-[#1C2D1F] font-bold text-lg">
                  <span>Total Due Today</span>
                  <span>$150.00</span>
                </div>
                <p className="text-[10px] text-[#6B7F6D] leading-relaxed">
                  *Your card will be charged $150.00 today. Your physical welcome packet will arrive in 5-7 days, containing your official membership cards and your **guaranteed $75 Ship Sticks rebate code** to apply directly to your next shipment.
                </p>
              </div>

              {/* Payment Form */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs font-sans font-semibold text-gray-500">Cardholder Name</Label>
                  <Input 
                    type="text" 
                    defaultValue={formData.name || "Andrew Miller"} 
                    className="border-[#EAE4D8] rounded-lg font-sans text-sm bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-sans font-semibold text-gray-500">Card Information</Label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="4242  4242  4242  4242" 
                      className="border-[#EAE4D8] rounded-lg font-sans text-sm bg-white pr-10"
                    />
                    <CreditCard className="w-5 h-5 text-gray-300 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-sans font-semibold text-gray-500">Expiration</Label>
                    <Input 
                      type="text" 
                      placeholder="MM / YY" 
                      className="border-[#EAE4D8] rounded-lg font-sans text-sm bg-white text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-sans font-semibold text-gray-500">CVC</Label>
                    <Input 
                      type="text" 
                      placeholder="123" 
                      className="border-[#EAE4D8] rounded-lg font-sans text-sm bg-white text-center"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => setStep("SUCCESS")} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-lg font-sans font-bold tracking-wider uppercase text-xs mt-2"
                >
                  Pay $150.00 & Claim Rebate
                </Button>

                <div className="flex justify-center items-center gap-2 pt-2 text-[10px] text-gray-400 font-sans">
                  <span>Powered by</span>
                  <span className="font-bold text-gray-500 tracking-tight text-xs">stripe</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success / Voucher Page */}
        {step === "SUCCESS" && (
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#EAE4D8] p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-emerald-600 font-sans font-bold">Membership Activated</span>
              <h2 className="text-3xl font-bold font-serif tracking-tight">WELCOME TO THE CLUB</h2>
              <p className="text-sm font-sans text-[#4A5D4E] leading-relaxed">
                Thank you, **{formData.name || "Peter DeLuca"}**. Your first-year Travel Protection Club membership is active. Your family is now fully protected.
              </p>
            </div>

            {/* Voucher Code Box */}
            <div className="bg-[#F9F7F2] border-2 border-dashed border-[#EAE4D8] rounded-xl p-6 space-y-3 relative overflow-hidden">
              <span className="text-[9px] tracking-[0.15em] uppercase text-[#6B7F6D] font-sans font-bold block">Your $75 Shipping Voucher</span>
              <div className="bg-white border border-[#EAE4D8] py-3 px-4 rounded-lg font-mono text-lg font-bold tracking-widest text-[#1C2D1F] select-all">
                SS-GOLF-75-ACTIVE
              </div>
              <p className="text-[10px] text-[#6B7F6D] font-sans leading-relaxed">
                Copy this code to use on your next golf travel shipment. An activation link has been sent to **{formData.email || "pdeluca@gmail.com"}**.
              </p>
            </div>

            <div className="text-left bg-[#F9F7F2]/50 border border-[#EAE4D8] rounded-xl p-4 space-y-3 font-sans text-xs">
              <h4 className="font-bold text-[#1C2D1F] uppercase tracking-wider">What Happens Next:</h4>
              <ul className="space-y-2 text-[#4A5D4E] list-disc list-inside">
                <li>Check your inbox for the digital welcome packet.</li>
                <li>Download and share the 1-Page Family Instruction sheet.</li>
                <li>Your physical member card will arrive in 5-7 business days.</li>
              </ul>
            </div>

            <Button onClick={() => {
              setStep("OPT_IN");
              setFormData({ name: "", email: "", phone: "" });
            }} className="w-full bg-[#1C2D1F] hover:bg-[#2C3F30] text-white py-5 rounded-lg font-sans font-bold tracking-wider uppercase text-xs">
              Simulate Next Scan ↻
            </Button>
          </div>
        )}
      </main>

      {/* Embedded Webhook configuration helper (hidden elegant tray in bottom left) */}
      <div className="fixed bottom-4 left-4 z-50">
        <details className="bg-white border border-[#EAE4D8] rounded-xl shadow-lg font-sans text-xs max-w-sm overflow-hidden group">
          <summary className="p-3 font-bold cursor-pointer select-none bg-[#F9F7F2] hover:bg-[#E6DFD3]/30 transition-colors flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-700" />
            <span>&lt;&gt; YAT?STATS WEBHOOK INTEGRATION</span>
          </summary>
          <div className="p-4 space-y-3 border-t border-[#EAE4D8] bg-white">
            <p className="text-[11px] text-[#6B7F6D] leading-relaxed">
              Paste your YAT?STATS Inbound Webhook URL here to send live contact data directly to your CRM when submitting the form!
            </p>
            <Input
              type="text"
              placeholder="https://services.leadconnectorhq.com/hooks/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="border-[#EAE4D8] focus:border-[#1C2D1F] rounded-lg text-xs"
            />
            {webhookUrl && (
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Live webhook active!
              </p>
            )}
          </div>
        </details>
      </div>

      {/* Premium Minimal Footer */}
      <footer className="border-t border-[#EAE4D8] py-6 px-6 text-center text-[10px] text-[#6B7F6D] font-sans tracking-wider uppercase bg-white">
        © 2026 Travel Protection Club. All rights reserved. Fulfillment powered by Ship Sticks®.
      </footer>
    </div>
  );
}
