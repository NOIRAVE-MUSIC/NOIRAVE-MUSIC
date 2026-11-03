# MongoDB Atlas backend option

MongoDB Atlas should sit behind a small Node API. Do not connect the browser directly to Atlas or expose a connection string. The current `index.html` is not yet wired to this API; this folder documents the backend contract for a MongoDB app variant.

## Verify the Atlas connection

1. In this folder, copy `.env.example` to `.env` and replace `<db_username>` and `<db_password>` with the database user's credentials. If the password contains reserved URL characters, URL-encode it. The `.env` file is ignored by Git.
2. In Atlas, add your development IP address under **Network Access** and confirm the database user has access to the cluster.
3. Open a terminal in this folder, run `npm install`, then `npm start`.
4. Open `http://localhost:3001/api/health`. A successful connection returns `{"status":"ok","database":"connected"}`.

`connection.mjs` exports `connectToMongoDB()` and `disconnectFromMongoDB()`. `server.mjs` is only a connection check; it does not yet provide NoiRave's posts/chat API or switch the frontend from Supabase.

## Suggested setup

1. Create an Atlas Free cluster and a database user with access only to the NoiRave database.
2. Add an API server (Node.js/Express or a serverless Node function) and keep `MONGODB_URI` in server-side environment variables.
3. Verify Firebase Authentication ID tokens at the API boundary, or implement a separate trusted authentication service. Never trust a user ID sent in JSON without verifying the token.
4. Enforce membership checks before every private conversation read, send, reply, or reaction.
5. Use Socket.IO or server-sent events for chat updates and presence; Atlas collections by themselves do not push updates to browser clients.
6. Store audio in a file service or GridFS. Keep file-size limits and content-type checks on the server.

## Suggested collections

- `profiles`: `_id` is the verified auth UID; public fields only
- `posts`: `authorId`, `kind`, `title`, `description`, `audioUrl`, `createdAt`
- `roomMessages`: `authorId`, `body`, `replyTo`, `reactions`, `createdAt`
- `conversations`: sorted two-member `memberIds`, `createdAt`, `updatedAt`
- `directMessages`: `conversationId`, `senderId`, `body`, `replyTo`, `reactions`, `createdAt`

Add a unique index on `conversations.memberIds` for one-to-one pairs and an index on `directMessages: { conversationId: 1, createdAt: 1 }`. The backend comparison documents current Atlas Free cluster limits.
