import { writable } from 'svelte/store';
import { config, passport, provider } from '@imtbl/sdk';

const passportConfig = {
	baseConfig: new config.ImmutableConfiguration({
		environment: config.Environment.SANDBOX
	}),
	clientId: import.meta.env.VITE_CLIENT_ID,
	redirectUri: import.meta.env.VITE_REDIRECT_URL,
	logoutRedirectUri: import.meta.env.VITE_LOGOUT_URL,
	audience: 'platform_api',
	scope: 'openid offline_access email transact'
};

const passportInstance = typeof window !== 'undefined' ? new passport.Passport(passportConfig) : undefined

export const providerStore = writable<provider.IMXProvider | null>(null);
export const passportStore = writable<passport.Passport>(passportInstance);
export const buttonState = writable<string>("Connect Passport");