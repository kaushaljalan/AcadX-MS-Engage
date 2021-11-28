const nodemailer = require('nodemailer')
import {google} from 'googleapis';

const OAuth2 = google.auth.OAuth2;

export const createTransporter = async () => {
	const oauth2Client = new OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		"https://developers.google.com/oauthplayground"
	);
	
	oauth2Client.setCredentials({
		refresh_token: process.env.EMAIL_REFRESH_TOKEN
	});
	
	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				reject();
			}
			resolve(token);
		});
	});

	return await nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: process.env.EMAIL_ID,
			accessToken,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			refreshToken: process.env.EMAIL_REFRESH_TOKEN
		}
	});
};

export const sendMail = async ({ subject, text, to, html }) => {
	const transporter = await createTransporter();
	return transporter.sendMail({
		subject,
		text,
		to,
		html,
		from: process.env.EMAIL_ID
	})
}