import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://znkyrizhylsmfsbteene.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_V91MFsO1rck8q69vBt2Gkw_5x9n0e0R';
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

// Create a profile if this is the member's first visit, without overwriting an existing profile.
export async function ensureProfile(user) {
  if (!user || user.is_anonymous) return null;
  const display_name = String(
    user.user_metadata?.display_name || user.email?.split('@')[0] || 'Member'
  ).trim().slice(0, 40) || 'Member';
  const { error: insertError } = await supabase.from('profiles').upsert(
    { user_id: user.id, display_name },
    { onConflict: 'user_id', ignoreDuplicates: true }
  );
  if (insertError) throw insertError;
  const { data, error } = await supabase.from('profiles')
    .select('user_id,display_name,bio,favorite_genres,is_verified,avatar_url,custom_status,profile_note')
    .eq('user_id', user.id).single();
  if (error) throw error;
  return data;
}

export async function uploadProfilePhoto(user, file) {
  if (!user || user.is_anonymous) throw new Error('Sign in with an email account to add a profile photo.');
  const allowed = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  if (!allowed[file?.type]) throw new Error('Choose a JPG, PNG, WebP, or GIF image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Profile photos must be 5 MB or smaller.');
  const path = `${user.id}/avatar.${allowed[file.type]}`;
  const { error } = await supabase.storage.from('profile-photos').upload(path, file, {
    upsert: true, contentType: file.type, cacheControl: '3600'
  });
  if (error) throw error;
  const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}
