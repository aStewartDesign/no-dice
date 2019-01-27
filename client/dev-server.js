// likely this will get called from another directory. cd here.
process.chdir(__dirname);

const hb = require('handlebars');
const fs = require('fs');
const index = fs.readFileSync('./index.hbs', {encoding: 'utf8'});
const wp = require('webpack');
const wpConfig = require('./webpack.config');
const bs = require('browser-sync').create();
// const express = require('express');
// const app = express();

// app.use(express.static('./public'));

const ct = hb.compile(index);
const state = {
    name: 'World',
    adj: 'beautiful'
};
const data = {
    data: JSON.stringify(state),
    content: '',
    title: 'Hello world!',
    isBrowserSyncOn: true,
    stylesheets: [
        'https://cdn.rawgit.com/tonsky/FiraCode/1.205/distr/fira_code.css',
        './app.css'
    ],
    scripts: [
        './client.js'
    ]
};
fs.writeFileSync('./public/index.html', ct(data), {encoding: 'utf8'});

const compiler = wp(wpConfig);
console.log('Webpack starting...');
compiler.watch({
    aggregateTimeout: 500,
    poll: 500
}, (err, stats) => {
    // Print watch/build result here...
    console.log('Webpack built! Watching...');
    bs.reload();
});

console.log('Initializing bs!');
bs.init({server: './public'}, () => {
    console.log('browser-sync init!');
});

// app.listen(8080, () => console.log('Example app listening on port 8080!'));

