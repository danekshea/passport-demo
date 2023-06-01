import { providerStore, passportStore } from "./store";
import { get } from "svelte/store";

export async function login(): Promise<void> {
    const passport = get(passportStore);
    let provider = await passport.connectImxSilent();
    console.log("provider after silent connect", provider)
    if (!provider) {
        provider = await passport.connectImx();
        console.log("provider after popup connect", provider);
    }
    providerStore.set(provider);
}

export async function handleLoginCallback(): Promise<void> {
    try {
        console.log("login callback");
        const passport = get(passportStore);
        await passport.loginCallback();
    }
    catch (err) {
        console.error("login callback error", err);
    }
}