import { useState, useEffect } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProfile, SavedRecommendation } from '../types'

export function useUserData(supabase: SupabaseClient, userId: string | undefined) {
  const [preferences, setPreferences] = useState<Partial<UserProfile> | null>(null)
  const [savedRecs, setSavedRecs] = useState<SavedRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    loadPreferences()
    loadSavedRecs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  async function loadPreferences() {
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    setPreferences(data || {})
    setLoading(false)
  }

  async function savePreferences(updates: Partial<UserProfile>) {
    const { data } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single()
    setPreferences(data)
  }

  async function loadSavedRecs() {
    const { data } = await supabase
      .from('saved_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    setSavedRecs(data || [])
  }

  async function saveRecommendation(
    cardIds: string[],
    reasoning: string,
    profileSnapshot: UserProfile
  ): Promise<SavedRecommendation | null> {
    const { data } = await supabase
      .from('saved_recommendations')
      .insert({ user_id: userId, card_ids: cardIds, reasoning, profile_snapshot: profileSnapshot })
      .select()
      .single()
    if (data) setSavedRecs(prev => [data, ...prev])
    return data
  }

  return { preferences, savedRecs, loading, savePreferences, saveRecommendation, loadSavedRecs }
}
