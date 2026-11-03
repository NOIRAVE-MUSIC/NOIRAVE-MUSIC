# Firebase backend option

The supplied Firebase web configuration is in `firebase-client.js`. It exports Firebase Authentication, Cloud Firestore, Cloud Storage, and optional Analytics clients using Firebase browser modules. The current `index.html` still runs against Supabase or local demo mode; Firebase services need the app data adapter before they can replace Supabase.

## Setup

1. The Firebase web app is already registered. If you switch to another Firebase project, update `firebase-client.js` with that project's web configuration.
2. Enable Email/Password and Anonymous providers under Authentication.
3. Create a Cloud Firestore database and deploy `firestore.rules` with the Firebase CLI.
4. If you need public audio uploads, create a Firebase Storage bucket and deploy `storage.rules`. Firebase requires the Blaze billing plan to use Cloud Storage; review its usage and billing before enabling uploads.
5. For true online/offline indicators, create a Realtime Database and deploy `database.rules.json`. The browser should set `/presence/{uid}` and register an `onDisconnect()` removal.

## Firestore document shape

- `profiles/{uid}`: `displayName`, `bio`, `favoriteGenres`, `updatedAt`
- `posts/{postId}`: `userId`, `authorName`, `kind`, `title`, `description`, `audioUrl`, `createdAt`
- `roomMessages/{messageId}`: `userId`, `authorName`, `body`, `replyTo`, `createdAt`; reactions live under `reactions/{uid}_{emoji}`
- `conversations/{conversationId}`: two-item `memberIds`, `memberNames`, `createdAt`; messages and their reactions live in the nested `messages` collection

The rules limit reads of private conversations and their nested messages to the two listed members. Firestore's free tier has daily read/write limits; see [the backend comparison](../BACKENDS.md).
