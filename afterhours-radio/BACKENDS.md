# NoiRave backend choices

The current app code is wired to Supabase. Firebase and MongoDB use different security and realtime models, so they are not drop-in connection-string swaps. Choose a provider before wiring production credentials.

## Firebase

Use Firebase Authentication for accounts and Cloud Firestore for profiles, posts, public chat, private conversations, replies, and reactions. Firestore listeners can keep chat current in real time. Deploy Firestore Security Rules so private conversation reads and writes require membership.

Firestore's current no-cost quota includes 1 GiB stored data, 50,000 document reads/day, 20,000 writes/day, 20,000 deletes/day, and 10 GiB/month outbound transfer. Cloud Storage for Firebase requires the Blaze pay-as-you-go plan, even though some no-cost usage remains available on Blaze. That means Firebase file uploads are not available on the no-billing Spark plan.

## MongoDB Atlas

Use an Atlas Free cluster for document data, with a small Node API between the browser and database. Never put an Atlas connection string or database password in `index.html`. Authenticate API requests with a verified identity token and enforce conversation membership in every private-chat route. Add WebSockets or server-sent events for realtime updates; MongoDB alone does not provide a browser-ready chat subscription API.

Atlas Free clusters currently have 0.5 GB storage, up to 100 operations/second, a 10 GB inbound and 10 GB outbound rolling seven-day transfer limit, and can pause after 30 days without connections. Audio files need object storage; keep large audio out of MongoDB documents.

## Combining them

Firebase Authentication can issue identities for a MongoDB-backed API, but this still needs a Node server and token verification. Firebase can also provide Firestore and Authentication by itself. The simplest setup to maintain is to choose Firebase or MongoDB as the app data backend; use both together only if you want Firebase to own sign-in while MongoDB stores application records.

Current official details: [Firebase Firestore quotas](https://firebase.google.com/docs/firestore/quotas), [Firebase Storage billing requirement](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024), [Atlas Free cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/), and [MongoDB Node.js driver](https://www.mongodb.com/docs/drivers/node/current/get-started/).
