
const express = require('express');
const youtubeRoutes = require('./routes/youtube.routes');
const facebookRoutes = require('./routes/facebook.routes');
const app = express();
const port = 3000;
// Step 1: Configure OAuth2


app.use('/', youtubeRoutes);
app.use('/api/facebook', facebookRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
