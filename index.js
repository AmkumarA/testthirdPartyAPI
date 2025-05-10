
const express = require('express');
const youtubeRoutes = require('./routes/youtube.routes');
const facebookRoutes = require('./routes/facebook.routes');
const app = express();
const port = 3000;
// Step 1: Configure OAuth2


const path = require('path');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/facebook', facebookRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
