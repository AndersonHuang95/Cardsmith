import { createContext, useContext } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'

interface SessionContextValue {
  session: Session | null;
  supabase: SupabaseClient;
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionContext.Provider')
  return ctx
}
