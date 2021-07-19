# Poker Game
- ReactJS
- Firebase


## Set Up
```
npm install
```

### Firebase Config
Create an account [firebase console.](https://console.firebase.google.com/) Create a web app, copy and paste configs into FirebaseConfig.js
```
# example conig 
export const firebaseApp = {
    apiKey: "XXXXXXXXXX",
    authDomain: "XXXXXXXXXX",
    projectId: "XXXXXXXXXX",
    storageBucket: "XXXXXXXXXX",
    messagingSenderId: "XXXXXXXXXX",
    appId: "XXXXXXXXXX",
    measurementId: "XXXXXXXXXX"
};

```

### Firebase Tools
Next, install firebase tools and login. Follow instructions for [firebase tools.](https://firebase.google.com/docs/cli/)
```
# install package
npm install -g firebase-tools
```
```
# login
firebase login
```

### Run Locally
```
npm start
```

### Firebase Emulator
You can set up a firebase emulator locally. [Documentation](https://firebase.google.com/docs/rules/emulator-setup)
<br >Set up connection in index.js.
```
# index.js
let auth = firebase.auth();
auth.useEmulator("http://localhost:9099");

let db = firebase.firestore();
if (window.location.hostname === "localhost") {
  db.useEmulator("localhost", 8080);
}

```

```
# start emulator
firebase emulators:start
```

### Build and Deploy
```
npm run build
firebase deploy
```

## Notes
- Rooms page: Join or create a game. After creating a room wait for the link to "go to game" appears.
- After joinning or creating, go to "Game" page.
- To delete a room, just create or join another room.
- All players get a default $100 per room. 
- Minimum of two people to start a game.
- Using hand evaluation package.
- React testing, few tests component were unable to test, becuase the component couldnt render without firebase.
- Bots are unable to swap cards. They will skip round two.
- Need to click on the heroku url to start heroku, then bots will start responding.
- If you are the room owner and bots are in game. You can see the bots actions at the top of the page and the url that it is posting to.

## Known Bugs
- When creating rooms, if you leave the page too quickly the room may not get created properly or is still in the process of being created.
- Bots are dependant on player to keep playing. If human player folds before round 2, bots will keep going in an endless loop.
- If the bots do not respond or send a post request to the api, refresh the browser. 
- If the bot does not respond, it sometimes folds and skips its turn.
- If game restart buttons is clicked to early the game will not deal players cards. To deal with this room owner can stop game. (bottom left corner)
- If all players balance is 0 except one player has money, the player with the money plays on his own.
- If all players blance is 0, game will start an endless loop through each player.
- Betting is little buggy, if the last person raises, all players will have to call the same amount, this is wrong. The other players should match the difference not the whole amount.

# References
- https://www.npmjs.com/package/poker-hand-evaluator/v/1.0.0
- https://github.com/codeKonami/poker-hand