# Puju Birthday Website — Firebase Shared Photo Gallery

## What changed
- Kept the existing birthday website design and interactions.
- Moved page styling into `style.css`, Tailwind configuration into `tailwind.config.js`, and application code into `app.js`.
- Replaced browser-only photo storage with Firebase Storage + Cloud Firestore.
- The gallery uses **Cloud Firestore** with a real-time listener, so new photos appear for all visitors without refreshing.
- Anyone can view shared photos. Anonymous Firebase users can upload; each uploader can delete only their own photos.

## Firebase setup
1. Open https://console.firebase.google.com/ and create/select a project.
2. In Project settings → General → Your apps, create a Web App and copy its config.
3. Your supplied Firebase Web App configuration is already added to `app.js`; no placeholder replacement is needed.
4. In Build → Authentication → Sign-in method, enable **Anonymous**.
5. In Build → Firestore Database, create a database. This project uses Firestore, not Realtime Database.
6. In Build → Storage, get started and create the default bucket.
7. In Firestore Database → Rules, paste `firestore.rules` and click Publish.
8. In Storage → Rules, paste `storage.rules` and click Publish.

## Deploy
Upload `index.html`, `style.css`, `tailwind.config.js`, and `app.js` together to Firebase Hosting (or another static host). Keep all three files in the same directory. Do not open the page as a `file://` URL; use a local web server or hosted HTTPS website.

For Firebase Hosting, run `firebase init hosting`, select the project and this folder as the public directory, then run `firebase deploy`.

## Important
- Firebase config values are public identifiers; the security rules control access.
- Anyone can view gallery photos because this is a public gallery. Only upload photos you have permission to share.
- Storage rules limit uploads to image files under 5 MB. The form rejects original files larger than 10 MB.
