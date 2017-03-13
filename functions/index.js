var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.updateTotalScore = functions.database.ref('/game_results/{gameResultId}/score')
    .onWrite(event => {
    	const newScore = event.data.val();
    	const scoreRef = functions.database.ref('/stats/total_score')
		return scoreRef.transaction(function(currentScore) {
  			return currentScore + newScore;
		});
	});

exports.updateTotalDistance = functions.database.ref('/game_results/{gameResultId}/distance')
    .onWrite(event => {
    	const newDistance = event.data.val();
    	const distanceRef = functions.database.ref('/stats/total_distance')
		return distanceRef.transaction(function(currentDistance) {
  			return currentDistance + newDistance;
		});
	});