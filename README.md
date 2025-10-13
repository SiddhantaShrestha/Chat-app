<!-- {
  "name": "chat-app",
  "version": "1.0.0",
  "main": "index.js",
  "engines": {
    "node":">=20.0.0"
  },
  "scripts": {
    "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "npm run start --prefix backend"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
} -->

the build script is to install node modules in both frontend and backend first
start is only done in backend and frontend will be deployed within backend(backend will be the entry point for deployment)

"engines": {
"node":">=20.0.0"
},
this is done as vite requires at least node v 20 but we are using 18...
