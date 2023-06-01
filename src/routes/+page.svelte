<script lang="ts">
    import { Buffer } from 'buffer';
    import { login } from "../auth";
    import { passportStore, providerStore } from "../store";
	import { get } from 'svelte/store';

    if (typeof window !== 'undefined') {
        window.global = window;
        window.Buffer = Buffer;
    }

    let loggedIn:boolean = false;
</script>
{#if $passportStore}
    <span>
        <button on:click={login}>Connect Passport</button>
    </span>
{:else}
    <h2>Passport does not exist</h2>
{/if}
<div class="container">
    {#if loggedIn}
        <h2>Logged in</h2>
    {:else}
        <h2>Not logged in</h2>
    {/if}
</div>