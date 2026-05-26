import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF7] text-[#1E2B22] p-6 text-center">
      <div className="h-16 w-16 bg-[#1A331E]/5 rounded-full flex items-center justify-center border border-[#1A331E]/10 mb-4">
        <AlertCircle className="h-8 w-8 text-[#1A331E]" />
      </div>
      
      <h1 className="font-serif-display text-2xl font-bold text-[#1A331E] mb-2">Page Not Found</h1>
      <p className="text-sm text-[#4A5D4E] max-w-xs mb-6 font-serif-body">
        The requested presentation page or demo step could not be found. Let's return to the pitch deck.
      </p>

      <Link to="/">
        <Button className="bg-[#1A331E] hover:bg-[#2D4A32] text-white border border-[#C2B280] px-6 py-4 rounded-sm font-sans-ui text-xs uppercase tracking-wider font-bold">
          Return to Pitch Deck
        </Button>
      </Link>
    </div>
  );
}
