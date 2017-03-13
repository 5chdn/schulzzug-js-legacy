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

	var newGameResultKey = firebase.database().ref().child('game-results').push().key;

	var updates = {}
	updates['/game-results/user-' + userId + '/key' + newGameResultKey] = gameResult;

	return firebase.database().ref().update(updates)
}

function fetchActiveUserCount(callback) {
	var connections = firebase.database().ref('connections');
	connections.on('value', function(snapshot) {
		var count = snapshot.numChildren();
		callback(count);
	});
}

function fetchGameStats(callback) {
	var gameResultsRef = firebase.database().ref('stats');
	gameResultsRef.once('value', function(snapshot) {
        var newTotalScore = snapshot.val().totalScore;
		var newTotalDistance = snapshot.val().totalDistance;
		callback(newTotalScore, newTotalDistance);
	});
}
