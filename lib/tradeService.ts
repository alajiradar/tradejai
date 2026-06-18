// lib/tradeService.ts
import { supabase } from './supabase';
import { Trade } from '../types/trade';

export const tradeService = {
  // 1. Ɗauko duka kasuwanci (Trades) na takamaiman mutumin da ke kan kishin shiga (Logged in user)
  async getTrades(): Promise<Trade[]> {
    // Muna samun bayanai da ID na mutumin da ke shige a yanzu
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Dole sai ka yi login don ganin trades ɗinka.');
    }

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id) // Tace trades ɗin wannan user ɗin kawai
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Kuskure wajen ɗauko trades:', error.message);
      throw error;
    }
    return data as Trade[];
  },

  // 2. Shigar da sabon Trade zuwa Database tare da liƙa masa user_id
  async addTrade(trade: Trade): Promise<Trade> {
    // Muna samun bayanai da ID na mutumin da ke shige a yanzu
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Dole sai ka yi login kafin ka iya sanya trade.');
    }

    const { data, error } = await supabase
      .from('trades')
      .insert([
        { 
          ...trade, 
          user_id: user.id // Muna ƙara user_id na gaske a nan kafin ya tafi database
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Kuskure wajen sanya trade:', error.message);
      throw error;
    }
    return data as Trade;
  },

  // 3. Tura Hoto (Chart) zuwa Supabase Storage Bucket
  async uploadImage(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('trade-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Kuskure wajen loda hoto:', error.message);
      throw error;
    }

    // Samo cikakken URL na hoton da aka loda domin amfani da shi a UI
    const { data: publicUrlData } = supabase.storage
      .from('trade-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }
};