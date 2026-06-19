"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useTrades() {
  const [allTrades, setAllTrades] = useState<any[]>([]);
  const [fetchingTrades, setFetchingTrades] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTradesData = async () => {
    setFetchingTrades(true);
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAllTrades(data);
    }
    setFetchingTrades(false);
  };

  useEffect(() => {
    fetchTradesData();
  }, []);

  // --- SABON TSARI: FUNCTION ƊIN DA ZAI AJIYE TRADES A SUPABASE ---
  const addTrade = async (newTrade: any) => {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("trades")
        .insert([
          {
            asset: newTrade.asset,
            category: newTrade.category,
            type: newTrade.type,
            pnl: newTrade.pnl,
            status: newTrade.status,
            date: newTrade.date,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Sabunta allTrades state nan take ba tare da an sake yin refresh ba
        setAllTrades((prevTrades) => [data[0], ...prevTrades]);
        setMessage("An yi nasarar ajiye trade dinka!");
      }
    } catch (error: any) {
      console.error("Error adding trade:", error);
      setMessage(`An sami matsala wajen ajiye trade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, prefix: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${prefix}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("trade-images")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from("trade-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- DYNAMIC DASHBOARD ANALYTICS CALCULATIONS ---
  const totalTrades = allTrades.length;
  const netPnl = allTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  
  const effectiveWins = allTrades.filter((t) => 
    t.status === "WIN" || (t.status === "BE" && (t.pnl || 0) > 0)
  ).length;

  const winRate = totalTrades > 0 
    ? ((effectiveWins / totalTrades) * 100).toFixed(1) 
    : "0.0";

  const grossProfit = allTrades.reduce((sum, t) => (t.pnl && t.pnl > 0 ? sum + t.pnl : sum), 0);
  const grossLoss = allTrades.reduce((sum, t) => (t.pnl && t.pnl < 0 ? sum + Math.abs(t.pnl) : sum), 0);
  const profitFactor = grossLoss > 0 
    ? (grossProfit / grossLoss).toFixed(2) 
    : grossProfit > 0 ? grossProfit.toFixed(2) : "0.00";

  let cumulativeValue = 0;
  const equityCurveData = [
    { name: "Start", "Net P&L": 0 },
    ...[...allTrades].reverse().map((t, idx) => {
      cumulativeValue += (t.pnl || 0);
      return {
        name: `T-${idx + 1}`,
        "Net P&L": cumulativeValue
      };
    })
  ];

  // ANAN AN SAKAR MA `page.tsx` DAMAR GANIN `addTrade` GABA ƊAYA
  return {
    allTrades,
    fetchingTrades,
    loading,
    setLoading,
    message,
    setMessage,
    totalTrades,
    netPnl,
    winRate,
    profitFactor,
    equityCurveData,
    fetchTradesData,
    uploadImage,
    addTrade // <-- Ga shi nan mun dawo da shi!
  };
}