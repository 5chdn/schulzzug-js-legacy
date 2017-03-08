var webservice = {
	baseUrl: "http://example.com",
	updateScore: function(score) {

	},
	fetchCurrentScore: function() {

	},
	fetchToken: function() {
		return request("POST", "/token")
	},
	request: function(method, route, data = null) {
		return new Promise(function(resolve, reject) {
			var url = baseUrl + route
			$.ajax({
				type: method,
				url: url,
				data: data,
				success: function(response) {
					resolve(response);
				},
				failure: function(xhr, status, error) {
					reject(thrownError);
				}
			});
		});
	}
}

