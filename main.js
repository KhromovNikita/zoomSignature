const express = require('express');
const crypto = require('crypto')
var bodyParser = require('body-parser')
const app = express()
//app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: false
}));
const PORT = process.env.PORT || 5000
let data, API_KEY, API_SECRET, meet_number, role_id;

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
	const timestamp = new Date().getTime() - 30000
	const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
	const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
	const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

	return signature;
}

app.get('/', (req, res) => {
	res.send({ message: 'You should to use post request:)' });
});

app.post('/', (req, res) => {
	// Здесь будем создавать заметку.
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	res.setHeader('Access-Control-Allow-Origin', '*');

	data = req.body;
	API_KEY = data["api_key"];
	API_SECRET = data["api_secret"];
	meet_number = data["meet_number"];
	role_id = data["role_id"];

	if (data && API_KEY && API_SECRET && meet_number && role_id != undefined) {
		res.send(generateSignature(API_KEY, API_SECRET, meet_number, role_id));
	}
	else
		res.send("Failed! Check your posted data.")

});

app.listen(PORT, () => {
	console.log('We are live on ' + PORT);
});



