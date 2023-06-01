import type { IMXProvider } from "@imtbl/sdk";
import { providerStore, passportStore } from "./store";
import { get } from "svelte/store";

export async function login(): Promise<void> {
    const passport = get(passportStore);
    console.log(passport);
    let provider = await passport.connectImxSilent();
    if(!provider) {
        provider = await passport.connectImx();
    }
    console.log(provider);
    providerStore.set(provider);
  }

export async function handleLoginCallback(): Promise<void> {
    try {
        console.log("login callback");
        const passport = get(passportStore);
        await passport.loginCallback();
    }
    catch (err) {
        console.error(err);
    }
}