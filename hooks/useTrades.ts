"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useTrades() {
  const [allTrades, setAllTrades] = useState<any[]>([]);
  const [fetchingTrades, setFetchingTrades] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all trades ordered by entry time
  const fetchTradesData = async () => {
    setFetchingTrades(true);
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("entry_time", { ascending: false });

    if (!error && data) {
      setAllTrades(data);
    }
    setFetchingTrades(false);
  };

  useEffect(() => {
    fetchTradesData();
  }, []);

  // Insert a new trade into the database
  const addTrade = async (newTrade: any) => {
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        asset: newTrade.asset ? newTrade.asset.toUpperCase() : null,
        market_category: newTrade.market_category || newTrade.category,
        trade_type: newTrade.trade_type || newTrade.type,
        pnl: newTrade.pnl !== undefined ? parseFloat(newTrade.pnl) : null,
        status: newTrade.status,
        entry_price: newTrade.entry_price ? parseFloat(newTrade.entry_price) : null,
        exit_price: newTrade.exit_price ? parseFloat(newTrade.exit_price) : null,
        stop_loss: newTrade.stop_loss ? parseFloat(newTrade.stop_loss) : null,
        take_profit: newTrade.take_profit ? parseFloat(newTrade.take_profit) : null,
        strategy: newTrade.strategy,
        psychology_tags: newTrade.psychology_tags,
        notes: newTrade.notes,
        entry_time: newTrade.entry_time || newTrade.date,
        exit_time: newTrade.exit_time,
        trading_session: newTrade.trading_session,
        position_size: newTrade.position_size ? parseFloat(newTrade.position_size) : null,
        fee: newTrade.fee ? parseFloat(newTrade.fee) : 0,
        image_before: newTrade.image_before,
        image_after: newTrade.image_after,
      };

      const { data, error } = await supabase
        .from("trades")
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setAllTrades((prevTrades) => [data[0], ...prevTrades]);
        setMessage("✓ Success: Trade logged successfully!");
      }
    } catch (error: any) {
      console.error("Error adding trade:", error);
      setMessage(`Failed to log trade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing trade record
  const updateTrade = async (id: string, updatedTrade: any) => {
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        asset: updatedTrade.asset ? updatedTrade.asset.toUpperCase() : null,
        market_category: updatedTrade.market_category || updatedTrade.category,
        trade_type: updatedTrade.trade_type || updatedTrade.type,
        pnl: updatedTrade.pnl !== undefined ? parseFloat(updatedTrade.pnl) : null,
        status: updatedTrade.status,
        entry_price: updatedTrade.entry_price ? parseFloat(updatedTrade.entry_price) : null,
        exit_price: updatedTrade.exit_price ? parseFloat(updatedTrade.exit_price) : null,
        stop_loss: updatedTrade.stop_loss ? parseFloat(updatedTrade.stop_loss) : null,
        take_profit: updatedTrade.take_profit ? parseFloat(updatedTrade.take_profit) : null,
        strategy: updatedTrade.strategy,
        psychology_tags: updatedTrade.psychology_tags,
        notes: updatedTrade.notes,
        entry_time: updatedTrade.entry_time || updatedTrade.date,
        exit_time: updatedTrade.exit_time,
        trading_session: updatedTrade.trading_session,
        position_size: updatedTrade.position_size ? parseFloat(updatedTrade.position_size) : null,
        fee: updatedTrade.fee ? parseFloat(updatedTrade.fee) : 0,
        image_before: updatedTrade.image_before,
        image_after: updatedTrade.image_after,
      };

      const { data, error } = await supabase
        .from("trades")
        .update(payload)
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setAllTrades((prevTrades) =>
          prevTrades.map((trade) => (trade.id === id ? data[0] : trade))
        );
        setMessage("✓ Success: Trade updated successfully!");
      }
    } catch (error: any) {
      console.error("Error updating trade:", error);
      setMessage(`Failed to update trade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete a trade from database and sync state
  const deleteTrade = async (id: string) => {
    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabase
        .from("trades")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAllTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== id));
      setMessage("✓ Success: Trade deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting trade:", error);
      setMessage(`Failed to delete trade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle chart screenshot uploads
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

  // --- TIME-BASED FILTERS & COUNTS ENGINE ---
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // 1. Weekly Logic (Start from Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // 2. Monthly Logic
  const startOfMonth = new Date(currentYear, now.getMonth(), 1);

  // 3. Last Year Logic (Centralized Filter)
  const lastYearTarget = currentYear - 1;

  const weeklyCount = allTrades.filter(t => t.entry_time && new Date(t.entry_time) >= startOfWeek).length;
  const monthlyCount = allTrades.filter(t => t.entry_time && new Date(t.entry_time) >= startOfMonth).length;
  const lastYearCount = allTrades.filter(t => {
    if (!t.entry_time) return false;
    return new Date(t.entry_time).getFullYear() === lastYearTarget;
  }).length;

  // --- EQUITY CURVE DATA ---
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
    weeklyCount,      // Dynamic weekly total
    monthlyCount,     // Dynamic monthly total
    lastYearCount,    // Dynamic last year total
    equityCurveData,
    fetchTradesData,
    uploadImage,
    addTrade,
    updateTrade,
    deleteTrade
  };
}