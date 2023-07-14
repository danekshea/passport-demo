import { providerStore, passportStore, buttonState } from "./store";
import { get } from "svelte/store";
import type { UnsignedTransferRequest, ETHAmount } from "@imtbl/core-sdk";

export async function login(): Promise<void> {
    buttonState.update(() => "Connecting...");
    const passport = get(passportStore);
    let provider = await passport.connectImxSilent();
    console.log("provider after silent connect", provider)
    if (!provider) {
        try {
            provider = await passport.connectImx();
            console.log('provider after popup connect', provider);
        } catch (err) {
            // Error handling for user closing the popup
            if (err.message === 'AUTHENTICATION_ERROR: Popup closed by user') {
                buttonState.update(() => 'Connect');
                return;
            } else {
                console.log(err);
                throw err; // re-throw error to handle it in the outer catch block
            }
        }
    }
    providerStore.set(provider);
    buttonState.update(() => "Connected");
}
export async function logout(): Promise<void> {
    const passport = get(passportStore);
    await passport.logout();
    providerStore.set(null);
    buttonState.update(() => "Connect Passport");
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