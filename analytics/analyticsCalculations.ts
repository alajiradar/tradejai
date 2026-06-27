// analytics/analyticsCalculations.ts
import { Trade, MarketCategory, TradingSession } from '../types/trade';
import { TradingAnalytics, PsychologyBreakdown, MarketBreakdown, SessionBreakdown } from './analyticsTypes';

export function calculateAnalytics(trades: Trade[]): TradingAnalytics {
  const closedTrades = trades.filter(t => t.pnl !== null && t.status !== null);
  const totalTrades = closedTrades.length;

  // 1. Initial Default Values for Empty States
  const defaultAnalytics: TradingAnalytics = {
    performance: { netPnl: 0, grossProfit: 0, grossLoss: 0, winRate: 0, breakEvenRate: 0, profitFactor: 0, averageWin: 0, averageLoss: 0 },
    riskAndActivity: { bestTrade: 0, worstTrade: 0, averageRiskReward: 0, totalTrades: 0, weeklyTrades: 0, monthlyTrades: 0 },
    markets: [],
    sessions: [],
    psychology: []
  };

  if (totalTrades === 0) return defaultAnalytics;

  // 2. Performance & Risk Calculations
  let grossProfit = 0;
  let grossLoss = 0;
  let wins = 0;
  let losses = 0;
  let breakEvens = 0;
  let netPnl = 0;
  let bestTrade = 0;
  let worstTrade = 0;
  let totalRiskRewardRatio = 0;
  let tradesWithRR = 0;

  closedTrades.forEach(trade => {
    const pnl = trade.pnl || 0;
    netPnl += pnl;

    // Gross Profit & Loss
    if (pnl > 0) {
      grossProfit += pnl;
      wins++;
      if (pnl > bestTrade) bestTrade = pnl;
    } else if (pnl < 0) {
      grossLoss += Math.abs(pnl);
      losses++;
      if (pnl < worstTrade) worstTrade = pnl;
    } else {
      breakEvens++;
    }

    // Risk Reward Calculation (Planned based on Entry, SL, TP if available)
    if (trade.entry_price && trade.stop_loss && trade.take_profit) {
      const risk = Math.abs(trade.entry_price - trade.stop_loss);
      const reward = Math.abs(trade.take_profit - trade.entry_price);
      if (risk > 0) {
        totalRiskRewardRatio += reward / risk;
        tradesWithRR++;
      }
    }
  });

  const winRate = (wins / totalTrades) * 100;
  const breakEvenRate = (breakEvens / totalTrades) * 100;
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  const averageWin = wins === 0 ? 0 : grossProfit / wins;
  const averageLoss = losses === 0 ? 0 : grossLoss / losses;
  
  // Realized RR fallback if no planned RR is set
  const averageRiskReward = tradesWithRR > 0 ? totalRiskRewardRatio / tradesWithRR : (averageLoss === 0 ? 0 : averageWin / averageLoss);

  // 3. Activity Metrics (Weekly / Monthly Averages)
  const tradeDates = closedTrades
    .map(t => t.entry_time || t.created_at)
    .filter(Boolean)
    .map(d => new Date(d!).getTime());

  let weeklyTrades = totalTrades;
  let monthlyTrades = totalTrades;

  if (tradeDates.length > 0) {
    const minDate = Math.min(...tradeDates);
    const maxDate = Math.max(...tradeDates);
    const timeDiffInMs = Math.max(maxDate - minDate, 1); // Avoid 0
    
    const totalWeeks = Math.max(timeDiffInMs / (1000 * 60 * 60 * 24 * 7), 1);
    const totalMonths = Math.max(timeDiffInMs / (1000 * 60 * 60 * 24 * 30.44), 1);

    weeklyTrades = totalTrades / totalWeeks;
    monthlyTrades = totalTrades / totalMonths;
  }

  // 4. Market & Session Breakdown Aggregators
  const marketMap: Record<MarketCategory, { pnl: number; wins: number; total: number }> = {} as any;
  const sessionMap: Record<TradingSession, { pnl: number; wins: number; total: number }> = {} as any;
  const psychologyMap: Record<string, { pnl: number; wins: number; total: number }> = {};

  closedTrades.forEach(trade => {
    const pnl = trade.pnl || 0;
    const isWin = trade.status === 'WIN';

    // Market
    if (!marketMap[trade.market_category]) {
      marketMap[trade.market_category] = { pnl: 0, wins: 0, total: 0 };
    }
    marketMap[trade.market_category].pnl += pnl;
    marketMap[trade.market_category].total++;
    if (isWin) marketMap[trade.market_category].wins++;

    // Session
    if (trade.trading_session) {
      if (!sessionMap[trade.trading_session]) {
        sessionMap[trade.trading_session] = { pnl: 0, wins: 0, total: 0 };
      }
      sessionMap[trade.trading_session].pnl += pnl;
      sessionMap[trade.trading_session].total++;
      if (isWin) sessionMap[trade.trading_session].wins++;
    }

    // Psychology Tags (Split comma-separated strings)
    if (trade.psychology_tags) {
      const tags = trade.psychology_tags.split(',').map(t => t.trim()).filter(Boolean);
      tags.forEach(tag => {
        if (!psychologyMap[tag]) {
          psychologyMap[tag] = { pnl: 0, wins: 0, total: 0 };
        }
        psychologyMap[tag].pnl += pnl;
        psychologyMap[tag].total++;
        if (isWin) psychologyMap[tag].wins++;
      });
    }
  });

  // Convert Maps to Arrays
  const markets: MarketBreakdown[] = Object.keys(marketMap).map(key => {
    const m = marketMap[key as MarketCategory];
    return { market: key as MarketCategory, totalTrades: m.total, winRate: (m.wins / m.total) * 100, netPnl: m.pnl };
  });

  const sessions: SessionBreakdown[] = Object.keys(sessionMap).map(key => {
    const s = sessionMap[key as TradingSession];
    return { session: key as TradingSession, totalTrades: s.total, winRate: (s.wins / s.total) * 100, netPnl: s.pnl };
  });

  const psychology: PsychologyBreakdown[] = Object.keys(psychologyMap).map(key => {
    const p = psychologyMap[key];
    return { tag: key, count: p.total, winRate: (p.wins / p.total) * 100, netPnl: p.pnl };
  }).sort((a, b) => b.count - a.count); // Sort by most used psychology tags

  return {
    performance: { netPnl, grossProfit, grossLoss, winRate, breakEvenRate, profitFactor, averageWin, averageLoss },
    riskAndActivity: { bestTrade, worstTrade, averageRiskReward, totalTrades, weeklyTrades, monthlyTrades },
    markets,
    sessions,
    psychology
  };
}