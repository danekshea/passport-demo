import { writable } from 'svelte/store';
import { Passport, type IMXProvider, ImmutableConfiguration, Environment } from '@imtbl/sdk';

const passportConfig = {
	baseConfig: new ImmutableConfiguration({
		environment: Environment.SANDBOX
	}),
	clientId: 'dc4a9kyam6B8IGrA36ZKZRs39ESdZpM4', // import.meta.env.VITE_CLIENT_ID,
	redirectUri: 'http://127.0.0.1:8080/login', //"https://stately-gingersnap-077133.netlify.app/login", // import.meta.env.VITE_REDIRECT_URL,
	logoutRedirectUri: 'http://127.0.0.1', //"https://stately-gingersnap-077133.netlify.app", //import.meta.env.VITE_LOGOUT_URL,
	audience: 'platform_api',
	scope: 'openid offline_access email transact'
};

let passport;
if (typeof window !== 'undefined') {
	console.log('Window is defined, initializing Passport...');
	passport = new Passport(passportConfig);
	console.log('Passport has been initialized:', passport);
} else {
	console.log('Window is undefined, skipping Passport initialization.');
}

export const providerStore = writable<IMXProvider | null>(null);
export const passportStore = writable<Passport>(passport);
