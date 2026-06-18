// types/trade.ts

export type MarketCategory = 'Forex' | 'Crypto' | 'Stocks' | 'Indices' | 'Commodities' | 'Futures' | 'Options';
export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'WIN' | 'LOSS' | 'BE';
export type TradingSession = 'London' | 'New York' | 'Asian' | 'Overnight';

export interface Trade {
  id?: string;                 // UUID daga Supabase
  created_at?: string;         // Timestamp daga Supabase
  market_category: MarketCategory;
  asset: string;
  trade_type: TradeType;
  entry_price: number;
  exit_price: number | null;
  pnl: number | null;
  status: TradeStatus;
  strategy: string | null;
  notes: string | null;
  position_size: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  psychology_tags: string | null;
  trading_session: TradingSession;
  fee: number;                 // NUMERIC DEFAULT 0
  entry_time: string | null;   // TIMESTAMPTZ
  exit_time: string | null;    // TIMESTAMPTZ
  image_before: string | null; // TEXT (URL)
  image_after: string | null;  // TEXT (URL)
}

export interface DashboardMetrics {
  totalTrades: number;
  netPnl: number;
  winRate: string;
  profitFactor: string;
}

export interface EquityPoint {
  name: string;
  'Net P&L': number;
}