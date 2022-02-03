const http = require('http')
const crypto = require('crypto')
var qs = require('querystring');

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
	const timestamp = new Date().getTime() - 30000
	const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
	const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
	const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

	return signature;
}

 // server
const hostname = '127.0.0.1'
const server = http.createServer((request, response) => {
	let data, API_KEY, API_SECRET, meet_number, role_id;

	// загрузка данных
	request.on("data", chunk => {
		data += chunk;
		data = qs.parse(data);
		API_KEY = data["api_key"];
		API_SECRET = data["api_secret"];
		meet_number = data["meet_number"];
		role_id = data["role_id"];
	});

	// в конце загрузки данных посылаем запрос по targetUrl
	request.on("end", () => {
		response.statusCode = 200
		response.setHeader('Content-Type', 'text/plain')
		response.setHeader('Access-Control-Allow-Origin', '*');
		let signature = generateSignature(API_KEY, API_SECRET, meet_number, role_id)
		response.end(signature);
	});
})
server.listen(process.env.PORT || 5000, hostname, () => {
	console.log(`Server running at http://${hostname}:${process.env.PORT}/`)
})



