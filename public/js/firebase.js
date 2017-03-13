// CONFIGURATION
let config = {
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
	let connections = firebase.database().ref('connections');
	let connectedRef = firebase.database().ref('.info/connected');
	connectedRef.on('value', function(snap) {
  		if (snap.val() === true) {
	  		let con = connections.push(true);
    		con.onDisconnect().remove();
  		}
	});
}

// EXPORTED FUNCTIONS
function updateGameResult(score, distance) {
	let userId = firebase.auth().currentUser.uid;
	let timestamp = firebase.database.ServerValue.TIMESTAMP;

	let gameResult = {
		score: score,
		distance: distance,
		timestamp: timestamp
	}

	let newGameResultKey = firebase.database().ref().child('game-results').push().key;

	let updates = {}
  updates['/game_results/' + newGameResultKey] = gameResult; //Merging: ist diese Zeile hier noch richtig oder habe ich die falsch reingemacht?
	updates['/game-results/user-' + userId + '/key' + newGameResultKey] = gameResult;

	return firebase.database().ref().update(updates)
}

function fetchActiveUserCount(callback) {
	let connections = firebase.database().ref('connections');
	connections.on('value', function(snapshot) {
		let count = snapshot.numChildren();
		callback(count);
	});
}

function fetchGameStats(callback) {
	let gameResultsRef = firebase.database().ref('stats');
	gameResultsRef.once('value', function(snapshot) {
        let newTotalScore = snapshot.val().totalScore;
		let newTotalDistance = snapshot.val().totalDistance;
		callback(newTotalScore, newTotalDistance);
	});
}
