import { App } from '@capacitor/app';

export function registerNativeAuth(supabase) {
  const finishAuth = async (link) => {
    try {
      const callback = new URL(link);
      const query = new URLSearchParams(callback.search);
      const fragment = new URLSearchParams(callback.hash.slice(1));
      const get = key => fragment.get(key) || query.get(key);
      const code = get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      } else if (get('access_token') && get('refresh_token')) {
        const { error } = await supabase.auth.setSession({
          access_token: get('access_token'),
          refresh_token: get('refresh_token')
        });
        if (error) throw error;
      }
      const requested = query.get('next') || 'index.html';
      const safeTarget = /^(index|profile|settings|chats|login|signup|forgot-password)\.html(?:\?|$)/.test(requested)
        ? requested
        : 'index.html';
      window.location.replace(new URL(safeTarget, window.location.href).href);
    } catch (error) {
      console.error('NoiRave could not finish mobile sign-in.', error);
    }
  };

  App.addListener('appUrlOpen', ({ url }) => finishAuth(url));
  App.getLaunchUrl().then(launch => {
    if (launch?.url) finishAuth(launch.url);
  }).catch(error => console.error('NoiRave could not read its mobile launch link.', error));
}
