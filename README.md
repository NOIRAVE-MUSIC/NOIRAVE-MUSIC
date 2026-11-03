# NoiRave Community Radio

A small community hub for music and announcement uploads, live chat, and emoji messages. It runs as a static webpage and uses Supabase for the hosted database, anonymous sign-in, file storage, and realtime updates. No server or paid package is required for the starter setup.

Backend choices and setup assets are outlined in [BACKENDS.md](BACKENDS.md), [the Firebase guide](firebase/README.md), and [the MongoDB guide](mongodb/README.md). Firebase Firestore rules are in `firebase/firestore.rules`. The currently runnable page still uses Supabase or local demo mode; these alternatives need a matching client/server adapter before they can replace it.

## Try the local demo

Serve the folder over HTTP before opening the app or account pages; opening them with `file://` blocks browser modules. From this folder, run `python -m http.server 8000` and open `http://localhost:8000`. Demo posts and chat work in that browser session. Demo uploads use temporary browser URLs, so they are not shared with other visitors and disappear when you reload.

For the hosted version, serve the folder over HTTP (ES modules do not load reliably from `file://`). For example, from this folder run `python -m http.server 8000`, then open `http://localhost:8000`. This static app loads `supabase-js` from a CDN, so the React/Vite `npm install` steps in Supabase's example aren't needed here.

## Connect a free Supabase project

1. Create a Supabase project on the [Free plan](https://supabase.com/pricing). Current quotas include 500 MB database, 1 GB file storage, 50,000 monthly active users, and 2 million Realtime messages. Free projects may pause after a week without activity; check current plan details before launch.
2. In Supabase Authentication settings, enable **Anonymous sign-ins**.
3. Email/password sign-up is enabled by default. In Authentication → URL Configuration, allow your deployed site URL and local development URLs such as `http://localhost:8000/**` so email confirmation and password-reset links to `profile.html` return to NoiRave.
4. Open SQL Editor and run `schema.sql`. If you connected a project earlier, run the updated SQL again to add the profiles table and policies; the script is safe to re-run.
5. The supplied project URL and publishable key are already set in `index.html`. The publishable key is intended for browser use; never paste a `service_role` or secret key into this file. If you change projects, update those two constants near the top of the module script.
6. Host the folder on any static web host and share the URL. The app uses HTTPS and Supabase's JS client from a CDN.

The starter storage bucket is public so community audio can play without a login. Uploads are limited to 25 MB and each signed-in user can upload only into their own folder. Keep this app for a trusted community: anonymous sign-in is frictionless, but it does not include moderation, rate limits, private rooms, or abuse reporting. Add those before opening it to a large public audience.

## Account pages

`login.html`, `signup.html`, `forgot-password.html`, `settings.html`, and `profile.html` are standalone account pages. The matching quick dialogs remain available inside `index.html`. They use the shared `supabase-client.js` and need the SQL schema and Supabase Auth settings above.

## Included

- Music/audio and announcement posts
- MP3/WAV/OGG/M4A-style audio selection and playback
- Shared realtime chat with quick emoji insertion
- Separate one-to-one private chats, with membership-checked access policies
- Reply-to-message threads and toggleable emoji reactions in public and private chat
- Realtime online indicators in chat, suggested people, and member profiles; status clears when a client disconnects
- Search across music and announcement posts, plus suggested people from recent room activity
- Email sign-up, sign-in, password reset, account settings, and sign-out when Supabase is connected
- Public profiles with an editable display name, bio, favorite sounds, and recent shares
- In-app notifications for new posts and messages while the app is open
- Display name and compact-list preferences saved in the browser

Private conversations, their participants, messages, and reactions use separate database tables from the public room. The SQL setup creates the `create_direct_conversation` RPC and row-level security policies; run the updated `schema.sql` before using live private chats. The demo stores private chats only in the current browser. Start a private chat from **＋ New** or from another member's profile; use the **Public room** and **Private chats** tabs to switch areas. Reply and reaction controls are attached to each message.
- Supabase Postgres tables protected with row-level security
- Demo mode that works without account setup

## Verified Profile publishing and CEO controls

After updating the schema, members must sign in with an email account and submit a **Verified Profile** request before publishing tracks or announcements. Requests include a short explanation and optional profile or portfolio link. The CEO reviews them from the Settings panel. Approval grants publishing rights; it cannot be set through a user-editable profile field. Supabase row-level security also blocks unverified uploads and post creation.

The account signed in as `ljh.syn5rgy@gmail.com` receives CEO controls automatically: review verification requests, delete any community post or room message, and remove associated community audio files. The CEO check is enforced by Supabase using the authenticated account email. Private conversations remain member-only.

Run the complete `schema.sql` in the Supabase SQL Editor to apply these rules. Re-running it updates existing projects safely.


Email sign-up now automatically creates a profile through a database trigger. The login page also checks for and creates a missing profile without resetting an existing bio or favorite genres. Apply the latest schema.sql so the trigger and profile permissions are installed.


## Profile photos and mobile install

The account Settings page and in-app Settings panel accept JPG, PNG, WebP, and GIF profile photos up to 5 MB. Photos are stored in the public Supabase `profile-photos` bucket and appear on profiles, the people list, and chat. Run the latest `schema.sql` to create the bucket and its per-account storage policies.

The app includes a web manifest, a NoiRave icon, a service worker, touch-friendly controls, safe-area spacing, and responsive layouts. Host it over HTTPS (or `localhost` for development) to enable installation. On supported browsers use **Install NoiRave**; on iPhone/iPad, use Safari’s **Share → Add to Home Screen**.

### Requests, reports, and bug reports

Settings includes links to the CEO Requests, Reports, and Bug reports tabs. Members can report a profile from its profile card, a post from the feed, or a room/private-chat message with its Report button. Signed-in members can send bug reports from Settings. The CEO can review and resolve content reports and mark bugs fixed. Re-run the complete `schema.sql` in Supabase SQL Editor to create the `content_reports` and `bug_reports` tables and their row-level security policies.


### Messaging moderation, timeouts, pins, and groups

The moderation tools include a CEO-only deleted-message archive for public and private chats. The database keeps a moderation copy after deletion; regular members cannot read the archive. A configurable blocked-language list is applied by database triggers to room messages, private/group chat messages, posts, and profile text. The filter normalizes punctuation, common leetspeak, repeated characters, and selected homoglyphs. CEOs can add, pause, or remove terms in **Settings → Language filter** to cover local slang.

CEO community controls can pause room/private chat or announcements for members; the CEO account remains exempt so controls can be turned back on. Member profiles expose 1–4 hour chat and announcement timeouts with explicit enable controls. Room message authors and CEO can pin public messages; conversation members can pin messages in private and group chats.

Create a group from **＋ Group** in the chat header, give it a name, and select at least two other members. Apply the latest full `schema.sql` in Supabase SQL Editor for the moderation archive, text filters, timeouts, global switches, pinned messages, and group-chat RPC.

### Profile status, notes, and audio player

Members can set a 60-character profile status and a 120-character profile note from the in-app or full Settings page. Both appear on profile views. The home feed includes a persistent audio player with play/pause, previous/next, seeking, and volume controls. People to know has been removed from the sidebar. The connection label reads **ONLINE**.

CEO moderation reports include **Send warning** and **Punish · 4h timeout** actions. Warnings appear in the recipient's NoiRave notifications. Punishment pauses the related chat or announcement capability for up to four hours.

### Separate Chats page

Public and private chats now live at `chats.html`, separate from the music and announcement feed on the index page. The new page keeps the existing chat controls and supports the installed app shell cache.
