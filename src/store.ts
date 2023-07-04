import { writable } from 'svelte/store';
import { Passport, type IMXProvider, ImmutableConfiguration, Environment } from '@imtbl/sdk';

const passportConfig = {
	baseConfig: new ImmutableConfiguration({
		environment: Environment.SANDBOX
	}),
	clientId: import.meta.env.VITE_CLIENT_ID,
	redirectUri: import.meta.env.VITE_REDIRECT_URL,
	logoutRedirectUri: import.meta.env.VITE_LOGOUT_URL,
	audience: 'platform_api',
	scope: 'openid offline_access email transact'
};

const passport = typeof window !== 'undefined' ? new Passport(passportConfig) : undefined

export const providerStore = writable<IMXProvider | null>(null);
export const passportStore = writable<Passport>(passport);
export const buttonState = writable<string>("Connect Passport");