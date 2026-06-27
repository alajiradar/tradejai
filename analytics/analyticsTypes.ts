// analytics/analyticsTypes.ts
import { MarketCategory, TradingSession } from '../types/trade';

export interface PerformanceMetrics {
  netPnl: number;
  grossProfit: number;
  grossLoss: number;
  winRate: number;        // Alamar kashi (e.g., 65.5 for 65.5%)
  breakEvenRate: number;  // Alamar kashi
  profitFactor: number;   // Gross Profit / Gross Loss
  averageWin: number;
  averageLoss: number;
}

export interface RiskAndActivityMetrics {
  bestTrade: number;      // Mafi girman riba a trade guda
  worstTrade: number;     // Mafi girman asara a trade guda
  averageRiskReward: number; 
  totalTrades: number;
  weeklyTrades: number;   // Matsakaicin yawan trades a mako guda
  monthlyTrades: number;  // Matsakaicin yawan trades a wata guda
}

export interface MarketBreakdown {
  market: MarketCategory;
  totalTrades: number;
  winRate: number;
  netPnl: number;
}

export interface SessionBreakdown {
  session: TradingSession;
  totalTrades: number;
  winRate: number;
  netPnl: number;
}

export interface PsychologyBreakdown {
  tag: string;
  count: number;          // Sau nawa aka yi amfani da tag ɗin
  winRate: number;
  netPnl: number;
}

// Babban tsarin da zai haɗe dukkan bayanan Analytics na Tradejai
export interface TradingAnalytics {
  performance: PerformanceMetrics;
  riskAndActivity: RiskAndActivityMetrics;
  markets: MarketBreakdown[];
  sessions: SessionBreakdown[];
  psychology: PsychologyBreakdown[];
}