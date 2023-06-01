<script lang="ts">
    import type { IMXProvider } from "@imtbl/sdk";
    import { login } from "../auth";
    import { passportStore, providerStore } from "../store";

    type UserInformation = {
        address: string
    }

    let user: UserInformation | undefined;

    const setUserInformation = async (provider: IMXProvider | null) => {
        if(provider === null) return user = undefined

        return user = {
            address: await provider.getAddress()
        }
    }

    $: setUserInformation($providerStore)
</script>

{#if $passportStore}
    <span>
        <button on:click={login}>Connect Passport</button>
    </span>
{:else}
    <h2>Passport does not exist</h2>
{/if}

<div class="container">
    {#if user}
        <h2>Logged in as {user.address}</h2>
    {:else}
        <h2>Not logged in</h2>
    {/if}
</div>