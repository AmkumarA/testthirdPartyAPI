const { google } = require('googleapis');
require('dotenv').config()
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'http://localhost:3000/oauth2callback'
);


// Step 2: Login Route - Redirect to Google OAuth consent screen
exports.login = (req, res) => {
    const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.redirect(url);
};

exports.oauthCallback = async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client,
        });

        const targetChannelId = 'UCzzT6IYVxsISGIKOlnDomwA'; // Replace with your channel ID

        const result = await youtube.subscriptions.list({
            part: 'snippet',
            mine: true,
            forChannelId: targetChannelId,
        });

        if (result.data.items && result.data.items.length > 0) {
            res.status(200).json({
                success: true,
                message: '✅ User is SUBSCRIBED to your channel.',
                channel: targetChannelId,
            });
        } else {
            res.status(200).json({
                success: false,
                message: '❌ User is NOT subscribed to your channel.',
                channel: targetChannelId,
            });
        }
    } catch (error) {
        console.error('OAuth Callback Error:', error);
        res.status(500).json({
            success: false,
            message: '❌ Failed to check subscription.',
            error: error.message,
        });
    }
};