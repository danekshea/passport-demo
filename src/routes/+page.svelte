<script lang="ts">
	import { PassportError, type IMXProvider } from '@imtbl/sdk';
	import { login, logout } from '../auth';
	import { passportStore, providerStore, buttonState } from '../store';
	import type {
		UnsignedOrderRequest,
		UnsignedTransferRequest,
		NftTransferDetails,
		GetSignableCancelOrderRequest,
		TokenAmount,
		ETHAmount,
		GetSignableTradeRequest
	} from '@imtbl/core-sdk';
	import { get } from 'svelte/store';
	import { AccordionItem, Accordion, Input, Label, Helper, Button, Hr, Spinner } from 'flowbite-svelte';
	import PassportLogo from '../comps/PassportLogo.svelte';

	let amount = '';
	let receiver = '';
	let cancelOrderId = 0;
	let collectionAddress = '';
	let tokenNumber = '';
	let buyamt = '';
	let tradeOrderId = '';
	let depositAmt = '';
	let depositResult = '';
	let withdrawalAmt = '';
	let withdrawalResult = '';
	let registerOffChainResult = '';
	let batchResult = '';
	let IDToken = '';

	let batchTokenNumber1 = '';
	let batchTokenNumber2 = '';

	let batchReceiver1 = '';
	let batchReceiver2 = '';

	let batchCollectionAddress1 = '';
	let batchCollectionAddress2 = '';

	let isRegisteredOnChain: string | undefined;
	let getAddress: string | undefined;

	const setAddressInformation = async (provider: IMXProvider | null) => {
		if (provider === null) return (getAddress = undefined);

		return (getAddress = await provider.getAddress());
	};

	const updateOnChainStatus = async (provider: IMXProvider | null) => {
		if (provider !== null) {
			try {
				isRegisteredOnChain = (await provider.isRegisteredOnchain()) ? 'true' : 'false';
			} catch (e) {
				if (e instanceof Error) {
					isRegisteredOnChain = e.message;
				} else {
					isRegisteredOnChain = 'An error occurred';
				}
			}
		}
	};

	const registerOffChainresult = async (provider: IMXProvider | null) => {
		if (provider !== null) {
			try {
				const result = await provider?.registerOffchain();
				registerOffChainResult = JSON.stringify(result);
			} catch (e) {
				if (e instanceof Error) {
					registerOffChainResult = e.message;
				} else {
					registerOffChainResult = 'An error occurred';
				}
			}
		}
	};

	$: setAddressInformation($providerStore);
	$: updateOnChainStatus($providerStore);
	$: registerOffChainresult($providerStore);
	$: getIDtoken($providerStore);

	const getIDtoken = async (provider: IMXProvider | null) => {
		if (provider !== null) {
			const passport = get(passportStore);
			console.log(passport.getIdToken());
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key && key.startsWith('oidc.user:https://auth.immutable.com')) {
					const fullData = sessionStorage.getItem(key);
					if (fullData) {
						const parsedData = JSON.parse(fullData);
						IDToken = JSON.stringify(parsedData.profile, null, 2);
					} else {
						IDToken = '';
					}
				}
			}
		}
	};


	async function transfer(): Promise<void> {
		const provider = get(providerStore);
		const transferRequest: UnsignedTransferRequest = {
			type: 'ETH',
			amount: amount,
			receiver: receiver
		};
		const result = await provider!.transfer(transferRequest);
		console.log(result);
	}

	async function createOrder(): Promise<void> {
		const provider = get(providerStore);
		let tknamt: TokenAmount = {
			type: 'ERC721',
			tokenAddress: collectionAddress,
			tokenId: tokenNumber
		};
		const orderRequest: UnsignedOrderRequest = {
			sell: tknamt,
			buy: {
				amount: buyamt
			} as ETHAmount
		};
		const result = await provider!.createOrder(orderRequest);
		console.log(result);
	}

	async function cancelOrder(): Promise<void> {
		const provider = get(providerStore);
		const orderRequest: GetSignableCancelOrderRequest = {
			order_id: cancelOrderId
		};
		const result = provider!.cancelOrder(orderRequest);
		console.log(result);
	}

	async function createTrade(): Promise<void> {
		const provider = get(providerStore);
		if (getAddress) {
			const tradeRequest: GetSignableTradeRequest = {
				order_id: parseInt(tradeOrderId),
				user: getAddress
			};
			const result = await provider!.createTrade(tradeRequest);
			console.log(result);
		}
	}

	async function batchNFTTransfer(): Promise<void> {
		const provider = get(providerStore);
		let batchTXDetails: NftTransferDetails[] = [
			{
				tokenId: batchTokenNumber1,
				receiver: batchReceiver1,
				tokenAddress: batchCollectionAddress1
			},
			{
				receiver: batchReceiver2,
				tokenId: batchTokenNumber2,
				tokenAddress: batchCollectionAddress2
			}
		];

		try {
			const result = await provider?.batchNftTransfer(batchTXDetails);
			batchResult = JSON.stringify(result);
		} catch (e) {
			if (e instanceof Error) {
				batchResult = e.message;
			} else {
				batchResult = 'An error occurred';
			}
		}
	}

	async function deposit(): Promise<void> {
		const provider = get(providerStore);
		let tknamt = {
			amount: depositAmt
		} as ETHAmount;

		try {
			const result = await provider?.deposit(tknamt);
			depositResult = JSON.stringify(result);
		} catch (e) {
			if (e instanceof Error) {
				depositResult = e.message;
			} else {
				depositResult = 'An error occurred';
			}
		}
	}

	async function prepareWithdrawal(): Promise<void> {
		const provider = get(providerStore);
		let tknamt = {
			amount: depositAmt
		} as ETHAmount;
		try {
			const result = await provider?.prepareWithdrawal(tknamt);
			withdrawalResult = JSON.stringify(result);
		} catch (e) {
			if (e instanceof Error) {
				withdrawalResult = e.message;
			} else {
				withdrawalResult = 'An error occurred';
			}
		}
	}
</script>

<main class="flex min-h-screen flex-col items-center justify-center space-y-4 text-white">
	{#if $passportStore}
		{#if getAddress}
			<Button on:click={logout} class="connectbutton largerText"><PassportLogo />Logout</Button>
		{:else if $buttonState === 'Connecting...'}
			<Button class="connectbutton largerText"><div class="spinner-container"><Spinner size={"6"} color="white" /></div>{$buttonState}</Button>
		{:else}
			<Button on:click={login} class="connectbutton largerText"><PassportLogo />{$buttonState}</Button>
		{/if}
	{:else}
		<h2>Loading...</h2>
	{/if}
	<div class="mx-auto w-full md:w-3/4 lg:w-2/3 xl:w-2/3 max-w-[950px]">
		{#if getAddress}
			<Accordion>
				<AccordionItem
					class="border-3 border-immutable-white bg-immutable-near-black hover:bg-orange-500"
				>
					<h3 slot="header" class="text-white">ID Token</h3>
					<p class="mb-2 text-white dark:text-gray-400">
						{@html `<pre><code>${IDToken}</code></pre>`}
					</p>
				</AccordionItem>
				<AccordionItem class="border-3 border-immutable-white bg-immutable-near-black hover:bg-orange-500">
					<h3 slot="header" class="text-white">getAddress()</h3>
					<p class="mb-2 text-white dark:text-gray-400">{getAddress}</p>
				</AccordionItem>
				<AccordionItem class="border-3 border-immutable-white bg-immutable-near-black hover:bg-orange-500">
					<h3 slot="header" class="text-white">transfer()</h3>
					<fieldset>
						<Label for="amount" class="mb-2 text-white">Amount</Label>
						<Input type="number" id="amount" bind:value={amount} required />
						<Label for="receiver" class="mb-2 text-white">Receiver</Label>
						<Input type="text" id="receiver" bind:value={receiver} required />
						<Button type="submit" on:click={transfer}>Transfer</Button>
					</fieldset>
				</AccordionItem>
				<AccordionItem class="border-3 border-immutable-white bg-immutable-near-black hover:bg-orange-500">
					<h3 slot="header" class="text-white">createOrder()</h3>
					<fieldset>
						<Label for="tokenAddress" class="mb-2 text-white">Token Address</Label>
						<Input type="text" id="tokenAddress" bind:value={collectionAddress} required />
						<Label for="tokenNumber" class="mb-2 text-white">Token ID</Label>
						<Input type="number" id="tokenNumber" bind:value={tokenNumber} required />
						<Label for="buyamt" class="mb-2 text-white">Buy Amount</Label>
						<Input type="number" id="buyamt" bind:value={buyamt} required />
						<Button type="submit" on:click={createOrder}>Create Sell Order</Button>
					</fieldset>
				</AccordionItem>

				<AccordionItem class="border-3 border-immutable-white bg-immutable-near-black hover:bg-orange-500">
					<h3 slot="header" class="text-white">cancelOrder()</h3>
					<fieldset>
						<Label for="cancelOrderId" class="mb-2 text-white">Order ID</Label>
						<Input type="number" id="cancelOrderId" bind:value={cancelOrderId} required />
						<Button type="submit" on:click={cancelOrder}>Cancel Order</Button>
					</fieldset>
				</AccordionItem>

				<AccordionItem class="border-3 border-immutable-white bg-immutable-near-black hover:bg-orange-500">
					<h3 slot="header" class="text-white">createTrade()</h3>
					<fieldset>
						<Label for="tradeOrderId" class="text-immutable-white">Order ID</Label>
						<Input type="number" id="tradeOrderId" bind:value={tradeOrderId} required />
						<Button type="submit" on:click={createTrade}>Create Trade</Button>
					</fieldset>
				</AccordionItem>

				<AccordionItem class="border-3 border-immutable-white bg-immutable-near-black hover:bg-orange-500">
					<h3 slot="header" class="text-white">batchNftTransfer()</h3>
					<fieldset>
						<Label for="receiver1" class="mb-2 text-white">Receiver 1</Label>
						<Input type="text" id="batchReceiver1" bind:value={batchReceiver1} required />
						<Label for="token1" class="mb-2 text-white">Token ID</Label>
						<Input type="number" id="batchTokenNumber1" bind:value={batchTokenNumber1} required />
						<Label for="tokenAddress1" class="mb-2 text-white">Token Address 1</Label>
						<Input
							type="text"
							id="batchCollectionAddress1"
							bind:value={batchCollectionAddress1}
							required
						/>
						<Hr class="my-8" height="h-px" />
						<Label for="receiver2" class="mb-2 text-white">Receiver 2</Label>
						<Input type="text" id="batchReceiver2" bind:value={batchReceiver2} required />
						<Label for="token2" class="mb-2 text-white">Token ID 2</Label>
						<Input type="number" id="batchTokenNumber2" bind:value={batchTokenNumber2} required />
						<Label for="tokenAddress2" class="mb-2 text-white">Token Address 2</Label>
						<Input
							type="text"
							id="batchCollectionAddress2"
							bind:value={batchCollectionAddress2}
							required
						/>
						<Button type="submit" on:click={batchNFTTransfer}>Batch Transfer</Button>
						{#if batchResult}
							<p class="mb-2 text-white dark:text-gray-400">{batchResult}</p>
						{/if}
					</fieldset>
				</AccordionItem>
<!-- 
				<AccordionItem class="bg-red-500 text-immutable-white">
					<h3 slot="header">isRegisteredOnChain() - Operation not supported</h3>
					<p class="mb-2 text-gray-500 dark:text-gray-400">{isRegisteredOnChain}</p>
				</AccordionItem>

				<AccordionItem class="bg-red-500 text-immutable-white">
					<h3 slot="header">registerOffchain() - Operation not supported</h3>
					<p class="mb-2 text-gray-500 dark:text-gray-400">{registerOffChainResult}</p>
				</AccordionItem>

				<AccordionItem class="bg-red-500 text-immutable-white">
					<h3 slot="header">deposit() - Operation not supported</h3>
					<fieldset>
						<Label for="depositAmt" class="mb-2">Amount</Label>
						<Input type="number" id="depositAmt" bind:value={depositAmt} required />
						<Button type="submit" on:click={deposit}>Deposit</Button>
						{#if depositResult}
							<p class="mb-2 text-gray-500 dark:text-gray-400">{depositResult}</p>
						{/if}
					</fieldset>
				</AccordionItem>

				<AccordionItem class="bg-red-500 text-immutable-white">
					<h3 slot="header">prepareWithdrawal() - Operation not supported</h3>
					<fieldset>
						<Label for="withdrawalAmt" class="mb-2">Amount</Label>
						<Input type="number" id="withdrawalAmt" bind:value={withdrawalAmt} required />
						<Button type="submit" on:click={prepareWithdrawal}>Withdraw</Button>
						{#if withdrawalResult}
							<p class="mb-2 text-gray-500 dark:text-gray-400">{withdrawalResult}</p>
						{/if}
					</fieldset>
				</AccordionItem> -->
			</Accordion>
		{/if}
	</div>
	<!-- GitHub logo with a link -->
	<div class="github-logo">
		<a href="https://github.com/danekshea/passport-demo" target="_blank">
		  <img src="/github.png" alt="GitHub logo">
		</a>
	  </div>
</main>

<style>
	:global(.connectbutton) {
		color: #0d0d0d;
		background-image: linear-gradient(137deg, #f191fa, #83e3f0);
		min-width: 140px;
		height: 48px;
		background-color: #0d0d0d;
		border: 0px #0d0d0d;
		border-radius: 48px;
		margin-left: 0;
		margin-right: 0;
		padding: 8px 20px 8px 16px;
		font-weight: 400;
		text-decoration: none;
		display: flex;
		align-items: center;
	}
	:global(.largerText) {
		font-size: 20px; /* Adjust the size as per your requirement */
	}
	.github-logo {
    position: fixed;
    bottom: 0;
    right: 0;
	padding: 15px;
  }
  .github-logo img {
	width: 40px;
	height: 40px;
  }
  .spinner-container {
	padding: 5px;
  }

</style>
