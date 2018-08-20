// likely this will get called from another directory. cd here.
process.chdir(__dirname);

const hb = require('handlebars');
const fs = require('fs');
const index = fs.readFileSync('./index.hbs', {encoding: 'utf8'});
const express = require('express');
const app = express();

app.use(express.static('./public'));

const ct = hb.compile(index);
const state = {
    name: 'World',
    adj: 'beautiful'
};
const data = {
    data: JSON.stringify(state),
    content: '',
    title: 'Hello world!',
    stylesheets: [
        'https://cdn.rawgit.com/tonsky/FiraCode/1.205/distr/fira_code.css',
        './app.css'
    ],
    scripts: [
        './client.js'
    ]
};
fs.writeFileSync('./public/index.html', ct(data), {encoding: 'utf8'});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

