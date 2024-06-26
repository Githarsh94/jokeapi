const express = require('express');
const http = require('http');
const cors = require('cors');
const port = 8000;

const app = express();

app.use(cors());

app.get('/joke', (req, res) => {
    var options = {
        'method': 'GET',
        'hostname': 'official-joke-api.appspot.com',
        'path': '/random_joke',
        'headers': {},
        'maxRedirects': 20
    };

    var req = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            var joke = JSON.parse(body);
            var jokeContent = joke.setup + '\n' + joke.punchline;
            res.json({ jokeContent });
        });

        response.on("error", function (error) {
            console.error(error);
            res.status(500).send('Error fetching joke');
        });
    });

    req.end();
});

app.use('/', (req, res) => {
    res.redirect('/joke');
});

app.listen(port, (err) => {
    if (err) {
        console.log('Error in running the server', err);
        return;
    }
    console.log('Server is running on port:', port);
});
