const { TwitterApi } = require('twitter-api-v2');

exports.twitterLogin = async (req, res) => {
    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
        });

        const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
            process.env.TWITTER_CALLBACK_URL,
            { forceLogin: true }  // Optional: forces login prompt
        );

        req.session.oauth_token = oauth_token;
        req.session.oauth_token_secret = oauth_token_secret;

        res.redirect(url); // ✅ Redirects to Twitter login
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Twitter login failed');
    }
};

exports.twitterCallback = async (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    const access_token = '1921139152718098432-vetuz2vIImzq7EWOXpwNSBhLaNbMz9'
    const access_secret = 'Omfn7piBZ4AtIdSHmLJm8yFGsvIi78OOe9nQQ5aDiBXiq'
    if (!oauth_token || !oauth_verifier || !access_token) {
        return res.status(400).send('Missing or expired session/token');
    }

    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
            accessToken: access_token,
            accessSecret: access_secret,
        });

        const { client: loggedClient } = await client.login(oauth_verifier);
        const user = await loggedClient.currentUser();

        const following = await loggedClient.v2.following(user.id);
        const isFollower = following.data?.some(f => f.id === process.env.TARGET_TWITTER_ID);

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
