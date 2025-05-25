// Replaced with localStorage implementation
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

export const mockSupabase = {
  // Mock method for simple logging
  logEvent: (eventName: string, data: any) => {
    console.info(`Event logged (previously Supabase): ${eventName}`, data);
    return { error: null };
  }
};
