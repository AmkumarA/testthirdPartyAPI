const { TwitterApi } = require('twitter-api-v2');

exports.twitterLogin = async (req, res) => {
    try {
        // Always reset previous session
        req.session.oauth_token = null;
        req.session.oauth_token_secret = null;

        const client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
        });

        const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
            process.env.TWITTER_CALLBACK_URL,
            { forceLogin: true } // ensures re-login prompt
        );

        // Save these in session
        req.session.oauth_token = oauth_token;
        req.session.oauth_token_secret = oauth_token_secret;

        res.redirect(url);
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Twitter login failed');
    }
};

exports.twitterCallback = async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;

    // 1. Validate session tokens
    if (
        !oauth_token ||
        !oauth_verifier ||
        !req.session.oauth_token ||
        !req.session.oauth_token_secret ||
        req.session.oauth_token !== oauth_token
    ) {
        return res.status(400).send('Invalid or expired session or token');
    }

    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
            accessToken: req.session.oauth_token,
            accessSecret: req.session.oauth_token_secret,
        });

        // Login using oauth_verifier
        const { client: loggedClient } = await client.login(oauth_verifier);

        const user = await loggedClient.currentUser();

        const following = await loggedClient.v2.following(user.id);
        const isFollower = following.data?.some(
            (f) => f.id === process.env.TARGET_TWITTER_ID
        );

        // Optional: Clear session after use
        req.session.oauth_token = null;
        req.session.oauth_token_secret = null;

        res.send(
            isFollower
                ? `✅ ${user.name}, you are following our Twitter page.`
                : `❌ ${user.name}, you are NOT following our Twitter page.`
        );
    } catch (err) {
        console.error('Callback error:', err);
        res.status(500).send('Twitter callback failed');
    }
};


