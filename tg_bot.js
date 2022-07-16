const https = require("https");

const TOKEN = process.env.TG_TOKEN;
(CHAT_ID = "2126810553"), (BASE_URL = "api.telegram.org");

var options = {
	host: BASE_URL,
	path: `/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=defef`,
	method: "GET",
};

var request = https.request(options, function (response) {
	var str = "";
	response.on("data", function (data) {
		str += data;
	});
	response.on("end", function () {
		console.log(str);
	});
});

request.on("error", function (e) {
	console.log("Problem with request: " + e.message);
});

request.end();
