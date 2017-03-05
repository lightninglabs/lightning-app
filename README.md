
### Developing Locally

First start by pulling down the git repo:
```
git clone https://github.com/lightningnetwork/lightning-app.git
```

Then go inside the project folder and run npm install (grab a coffee, this might take a while):
```
cd lightning-app
npm run setup
```

After everything has installed you can run the app in dev mode:
```
npm start
```

### Errors

If you get any errors related to GRPC on startup, run:
```
npm run setup
```

If the window doesn't load after running `npm start`: try clicking on dev tools window and hitting `cmd-r` to refresh the window. 
