// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const router = useRouter();
  

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Registration successful! Please check your email for the confirmation link.");
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Tradejai</h1>
          <p className="text-xs text-slate-400 mt-1.5">Create your advanced multi-asset journal account</p>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs text-center font-medium">{error}</div>}
        {message && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs text-center font-medium">{message}</div>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition font-mono"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition font-bold py-3 px-4 rounded-xl text-sm mt-2 shadow-lg shadow-blue-600/10 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">Log In</Link>
        </p>
      </div>
    </div>
  );
}