const axios = require('axios');
require('dotenv').config();

const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

exports.facebookLogin = (req, res) => {
    const redirectUri = 'http://localhost:3000/api/facebook/callback';
    const fbLoginUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${redirectUri}&scope=public_profile,email,pages_show_list,pages_read_engagement`;

    res.redirect(fbLoginUrl);
};

exports.facebookCallback = async (req, res) => {
    const code = req.query.code;
    const redirectUri = 'http://localhost:3000/api/facebook/callback';

    try {
        // Step 1: Get user access token
        const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
            params: {
                client_id: FB_APP_ID,
                redirect_uri: redirectUri,
                client_secret: FB_APP_SECRET,
                code
            }
        });

        const userAccessToken = tokenResponse.data.access_token;

        // Step 2: Get user profile
        const userProfile = await axios.get(`https://graph.facebook.com/me`, {
            params: {
                access_token: userAccessToken
            }
        });

        const userId = userProfile.data.id;

        // Step 3: Check if user likes/follows the page (might not work in all cases)
        const result = await axios.get(`https://graph.facebook.com/${FB_PAGE_ID}/likes/${userId}`, {
            params: {
                access_token: FB_PAGE_ACCESS_TOKEN
            }
        });

        if (result.data && result.data.data.length > 0) {
            res.send('✅ User follows your page');
        } else {
            res.send('❌ User does not follow your page');
        }
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Something went wrong during Facebook auth');
    }
};
