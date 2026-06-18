// components/TradeForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

interface TradeFormProps {
  isDark: boolean;
  loading: boolean;
  setLoading: (l: boolean) => void;
  message: string;
  setMessage: (m: string) => void;
  uploadImage: (file: File, prefix: string) => Promise<string>;
  onSuccess: () => void;
}

export function TradeForm({ isDark, loading, setLoading, message, setMessage, uploadImage, onSuccess }: TradeFormProps) {
  const [marketCategory, setMarketCategory] = useState("Forex");
  const [asset, setAsset] = useState("");
  const [tradeType, setTradeType] = useState("BUY");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [pnl, setPnl] = useState("");
  const [status, setStatus] = useState("WIN");
  const [strategy, setStrategy] = useState("");
  const [notes, setNotes] = useState("");
  const [positionSize, setPositionSize] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [psychologyTags, setPsychologyTags] = useState("");
  const [tradingSession, setTradingSession] = useState("London");
  const [fee, setFee] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [imageBeforeFile, setImageBeforeFile] = useState<File | null>(null);
  const [imageAfterFile, setImageAfterFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageBeforeUrl = null;
      let imageAfterUrl = null;

      if (imageBeforeFile) {
        setMessage("Uploading 'Before' chart...");
        imageBeforeUrl = await uploadImage(imageBeforeFile, "before");
      }

      if (imageAfterFile) {
        setMessage("Uploading 'After' chart...");
        imageAfterUrl = await uploadImage(imageAfterFile, "after");
      }

      setMessage("Saving all trade logs to database...");

      const { error } = await supabase.from("trades").insert([
        {
          market_category: marketCategory,
          asset: asset.toUpperCase(),
          trade_type: tradeType,
          entry_price: entryPrice ? parseFloat(entryPrice) : null,
          exit_price: exitPrice ? parseFloat(exitPrice) : null,
          pnl: pnl ? parseFloat(pnl) : null,
          status: status,
          strategy: strategy || null,
          notes: notes || null,
          position_size: positionSize ? parseFloat(positionSize) : null,
          stop_loss: stopLoss ? parseFloat(stopLoss) : null,
          take_profit: takeProfit ? parseFloat(takeProfit) : null,
          psychology_tags: psychologyTags || null,
          trading_session: tradingSession,
          fee: fee ? parseFloat(fee) : 0,
          entry_time: entryTime || null,
          exit_time: exitTime || null,
          image_before: imageBeforeUrl,
          image_after: imageAfterUrl,
        },
      ]);

      if (error) throw error;

      setMessage("✓ Success! Trade successfully logged with advanced metrics.");
      
      setAsset("");
      setEntryPrice("");
      setExitPrice("");
      setPnl("");
      setStrategy("");
      setNotes("");
      setPositionSize("");
      setStopLoss("");
      setTakeProfit("");
      setPsychologyTags("");
      setFee("");
      setEntryTime("");
      setExitTime("");
      setImageBeforeFile(null);
      setImageAfterFile(null);
      
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input: any) => (input.value = ""));

      onSuccess();
    } catch (err: any) {
      setMessage(`Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border rounded-2xl p-6 shadow-xl transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
      <h2 className={`text-lg font-bold mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>Log New Trade</h2>
      <p className={`text-xs mb-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Record your advanced trade execution metrics carefully</p>

      {message && (
        <div className={`p-3 rounded-xl text-sm text-center mb-5 font-medium border ${
          message.startsWith("✓") 
            ? isDark ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/60" : "bg-emerald-50 text-emerald-700 border-emerald-200"
            : isDark ? "bg-rose-950/50 text-rose-400 border-rose-800/60" : "bg-rose-50 text-rose-700 border-rose-200"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Market Category</label>
          <select value={marketCategory} onChange={(e) => setMarketCategory(e.target.value)} className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`}>
            <option value="Forex">💱 Forex</option>
            <option value="Crypto">🚀 Crypto</option>
            <option value="Stocks">🏢 Stocks</option>
            <option value="Indices">📊 Indices</option>
            <option value="Commodities">🔥 Commodities</option>
            <option value="Futures">📈 Futures</option>
            <option value="Options">🧪 Options</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Asset / Ticker</label>
            <input type="text" value={asset} onChange={(e) => setAsset(e.target.value)} required placeholder="e.g. EURUSD, BTC" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Trading Session</label>
            <select value={tradingSession} onChange={(e) => setTradingSession(e.target.value)} className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`}>
              <option value="London">London</option>
              <option value="New York">New York</option>
              <option value="Asian">Asian</option>
              <option value="Overnight">Overnight</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Trade Type</label>
            <select value={tradeType} onChange={(e) => setTradeType(e.target.value)} className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`}>
              <option value="BUY">BUY / LONG</option>
              <option value="SELL">SELL / SHORT</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Outcome</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`}>
              <option value="WIN">🟢 WIN</option>
              <option value="LOSS">🔴 LOSS</option>
              <option value="BE">⚪ BREAKEVEN</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Position Size</label>
            <input type="number" step="any" value={positionSize} onChange={(e) => setPositionSize(e.target.value)} placeholder="Lots/Units" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Strategy System</label>
            <input type="text" value={strategy} onChange={(e) => setStrategy(e.target.value)} placeholder="e.g. Trendline, Breakout" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Entry Price</label>
            <input type="number" step="any" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} required placeholder="Price" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Exit Price</label>
            <input type="number" step="any" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} placeholder="Price" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Stop Loss (SL)</label>
            <input type="number" step="any" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="SL Level" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Take Profit (TP)</label>
            <input type="number" step="any" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="TP Level" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Net PnL ($)</label>
            <input type="number" step="any" value={pnl} onChange={(e) => setPnl(e.target.value)} placeholder="e.g. 250 or -100" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Commissions / Fee ($)</label>
            <input type="number" step="any" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="e.g. 5.50" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Entry Date & Time</label>
            <input type="datetime-local" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Exit Date & Time</label>
            <input type="datetime-local" value={exitTime} onChange={(e) => setExitTime(e.target.value)} className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Before Chart (Setup)</label>
            <input type="file" accept="trade-images/*" onChange={(e) => setImageBeforeFile(e.target.files ? e.target.files[0] : null)} className={`w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold transition ${isDark ? "text-slate-400 file:bg-slate-800 file:text-slate-200" : "text-slate-500 file:bg-slate-200 file:text-slate-700"}`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>After Chart (Outcome)</label>
            <input type="file" accept="trade-images/*" onChange={(e) => setImageAfterFile(e.target.files ? e.target.files[0] : null)} className={`w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold transition ${isDark ? "text-slate-400 file:bg-slate-800 file:text-slate-200" : "text-slate-500 file:bg-slate-200 file:text-slate-700"}`} />
          </div>
        </div>
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Psychology Tag</label>
          <input type="text" value={psychologyTags} onChange={(e) => setPsychologyTags(e.target.value)} placeholder="e.g. FOMO, Calm" className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`} />
        </div>

        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Trade Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Reasoning..." className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none ${isDark ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600"}`}></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl p-3 text-sm transition shadow-lg shadow-blue-500/20 disabled:opacity-50">
          {loading ? "Processing..." : "Save Trade Entry"}
        </button>
      </form>
    </div>
  );
}