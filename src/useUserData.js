import { useState, useEffect } from 'react'

export function useUserData(supabase, userId) {
  const [preferences, setPreferences] = useState(null)
  const [savedRecs, setSavedRecs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    loadPreferences()
    loadSavedRecs()
  }, [userId])

  async function loadPreferences() {
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()        // ← was .single()
    setPreferences(data || {})
    setLoading(false)
  }

  async function savePreferences(updates) {
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

  async function saveRecommendation(cardIds, reasoning, profileSnapshot) {
    const { data } = await supabase
      .from('saved_recommendations')
      .insert({ user_id: userId, card_ids: cardIds, reasoning, profile_snapshot: profileSnapshot })
      .select()
      .single()
    setSavedRecs(prev => [data, ...prev])
    return data
  }

  return { preferences, savedRecs, loading, savePreferences, saveRecommendation }
}