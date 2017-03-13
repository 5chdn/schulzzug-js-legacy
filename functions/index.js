const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.updateTotalScore = functions.database.ref('/game-results/{userId}/score')
    .onWrite(event => {
      const newScore = event.data.val();
      const scoreRef = functions.database.ref('/statistics/total-score')
    return scoreRef.transaction(function(currentScore) {
        console.log('currentScore', currentScore);
        return (currentScore || 0) + newScore;
    });
  });

exports.updateTotalDistance = functions.database.ref('/game-results/{userId}/distance')
    .onWrite(event => {
      const newDistance = event.data.val();
      const distanceRef = functions.database.ref('/statistics/total-distance')
    return distanceRef.transaction(function(currentDistance) {
        console.log('currentDistance', currentDistance);
        return (currentDistance || 0) + newDistance;
    });
  });
