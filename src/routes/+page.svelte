<script lang="ts">
    import { Environment, Passport, ImmutableConfiguration } from "@imtbl/sdk";
    import { onMount } from 'svelte';
    import { Buffer } from 'buffer';

    if (typeof window !== 'undefined') {
        window.global = window;
        window.Buffer = Buffer;
    }

    let passport: Passport;

    const passportConfig = {
        clientId: "O5XZ085OlEurDuungFcIffMY5A9JwIry",
        redirectUri: "http://127.0.0.1:5173/login",
        logoutRedirectUri: "http://127.0.0.1:5173",
        scope: "transact openid offline_access email",
        audience: "platform_api",
        baseConfig: new ImmutableConfiguration({
        environment: Environment.SANDBOX, // Set the appropriate environment value
        apiKey: "", // Provide the apiKey if required
        }),
    };

    onMount(() => {
        passport = new Passport(passportConfig);
    });
</script>
<h1>Passport demo</h1>
<button on:click={passport.connectImx}>Connect Passport</button>