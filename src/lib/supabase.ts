import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null;

export async function incrementWorldVisit(worldId: string): Promise<number | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc('increment_world_visit', {
      p_world_id: worldId,
    });
    if (error) {
      console.warn('[supabase] increment error:', error.message);
      return null;
    }
    return data as number;
  } catch {
    return null;
  }
}

export async function fetchWorldVisits(): Promise<Record<string, number>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from('world_visits')
      .select('world_id, visit_count');
    if (error) {
      console.warn('[supabase] fetch error:', error.message);
      return {};
    }
    const visits: Record<string, number> = {};
    if (data) {
      for (const row of data) {
        visits[row.world_id] = row.visit_count;
      }
    }
    return visits;
  } catch {
    return {};
  }
}
