const { TwitterApi } = require('twitter-api-v2');

exports.twitterLogin = async (req, res) => {
    try {
        // Clear previous session tokens if any
        req.session.oauth_token = null;
        req.session.oauth_token_secret = null;

        const client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
        });

        const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
            process.env.TWITTER_CALLBACK_URL,
            { forceLogin: true }
        );

        // Save new tokens
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

    // Validate session tokens
    if (
        !oauth_token ||
        !oauth_verifier ||
        oauth_token !== req.session.oauth_token
    ) {
        return res.status(400).send('Invalid or expired session/token');
    }

    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
            accessToken: req.session.oauth_token,
            accessSecret: req.session.oauth_token_secret,
        });

        const { client: loggedClient, accessToken, accessSecret } =
            await client.login(oauth_verifier);

        const user = await loggedClient.currentUser();
        const following = await loggedClient.v2.following(user.id);

        const isFollower = following.data?.some(
            (f) => f.id === process.env.TARGET_TWITTER_ID
        );

        if (isFollower) {
            res.send(`✅ ${user.name}, you are following our Twitter page.`);
        } else {
            res.send(`❌ ${user.name}, you are NOT following our Twitter page.`);
        }
    } catch (err) {
        console.error('Callback error:', err);
        res.status(500).send('Twitter callback failed');
    }
};

