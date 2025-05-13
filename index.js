
const express = require('express');
const youtubeRoutes = require('./routes/youtube.routes');
const facebookRoutes = require('./routes/facebook.routes');

const session = require('express-session');
const app = express();
const port = 3000;
// Step 1: Configure OAuth2


const path = require('path');
app.use(express.static('public'));
// twitter session
app.use(session({
    secret: 'amkumarA',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // for localhost only; use `true` in production with HTTPS
}));
const twitterRoutes = require('./routes/twitter.routes');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/facebook', facebookRoutes);
app.use('/api/twitter', twitterRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
