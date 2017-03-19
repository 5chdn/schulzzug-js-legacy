// CONFIGURATION
var config = {
    apiKey: "AIzaSyAo0p0M13L2_zPK-YJ5IITd-WczdJTUFPA",
    authDomain: "schulzzug-b84fc.firebaseapp.com",
    databaseURL: "https://schulzzug-b84fc.firebaseio.com",
    storageBucket: "schulzzug-b84fc.appspot.com",
    messagingSenderId: "188834675814"
};
firebase.initializeApp(config);

firebase.auth().signInAnonymously().then(function() {
    configurePresence();
}).catch(function(error) {
    console.log(error.message);
});

function configurePresence() {
  var connections = firebase.database().ref('connections');
  var connectedRef = firebase.database().ref('.info/connected');
  connectedRef.on('value', function(snap) {
      if (snap.val() === true) {
        var con = connections.push(true);
        con.onDisconnect().remove();
      }
  });
}

// EXPORTED FUNCTIONS
function updateGameResult(score, distance) {
  var userId = firebase.auth().currentUser.uid;
  var timestamp = firebase.database.ServerValue.TIMESTAMP;
  var gameResult = {
    score: score,
    distance: distance,
    timestamp: timestamp
  }
  var updates = {}
  updates['/game-results/' + userId] = gameResult;
  return firebase.database().ref().update(updates)
}

// EXPORTED FUNCTIONS
function listenToGameResultCount(callback) {
  var gamesRef = firebase.database().ref('game-results');
  gamesRef.on('value', function(snapshot) {
    callback(snapshot.numChildren());
  });
}

function listenToActiveUserCount(callback) {
  var connectionsRef = firebase.database().ref('connections');
  connectionsRef.on('value', function(snapshot) {
    callback(snapshot.numChildren());
  });
}

function listenToTotalDistance(callback) {
  var totalDistanceRef = firebase.database().ref('statistics/total-distance');
  totalDistanceRef.on('value', function(snapshot) {
    callback(snapshot.val());
  });
}

function listenToTotalScore(callback) {
  var totalScoreRef = firebase.database().ref('statistics/total-score');
  totalScoreRef.on('value', function(snapshot) {
    callback(snapshot.val());
  });
}

