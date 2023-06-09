<script lang="ts">
    import type { IMXProvider } from "@imtbl/sdk";
    import { login } from "../auth";
    import { passportStore, providerStore } from "../store";
    import type { UnsignedOrderRequest, UnsignedTransferRequest, NftTransferDetails, GetSignableCancelOrderRequest, TokenAmount, ETHAmount, GetSignableTradeRequest } from "@imtbl/core-sdk";
    import { get } from "svelte/store";
    import '../lib/global.css'
    import { AccordionItem, Accordion, Input, Label, Helper, Button, Hr } from 'flowbite-svelte';
    import PassportLogo from "../comps/PassportLogo.svelte";

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
    let registerOffChainReuslt = '';
    let batchResult = '';

    let batchTokenNumber1 = '';
    let batchTokenNumber2 = '';

    let batchReceiver1 = '';
    let batchReceiver2 = '';

    let batchCollectionAddress1 = '';
    let batchCollectionAddress2 = '';


    let isRegisteredOnChain: string | undefined;
    let getAddress: string | undefined;

    const setAddressInformation = async (provider: IMXProvider | null) => {
        if(provider === null) return getAddress = undefined

        return getAddress = await provider.getAddress()
        }

    const updateOnChainStatus = async (provider: IMXProvider | null) => {
        if(provider !== null) {
            try {
                isRegisteredOnChain = await provider.isRegisteredOnchain() ? 'true' : 'false';
            }
            catch (e) {
                if (e instanceof Error) {
                    isRegisteredOnChain = e.message;
                } else {
                    isRegisteredOnChain = 'An error occurred';
                }
            }
        }
    }

    const registerOffChainresult = async (provider: IMXProvider | null) => {
        if(provider !== null) {
            try {
                const result = await provider?.registerOffchain();
                registerOffChainReuslt = JSON.stringify(result);
            }
            catch (e) {
                if (e instanceof Error) {
                        registerOffChainReuslt = e.message;
                    } else {
                        registerOffChainReuslt = 'An error occurred';
                    }
            }
        }
    }

    $: setAddressInformation($providerStore)
    $: updateOnChainStatus($providerStore)
    $: registerOffChainresult($providerStore)

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
        let tknamt:TokenAmount = {
            type: "ERC721",
            tokenAddress: collectionAddress,
            tokenId: tokenNumber
        }
        const orderRequest: UnsignedOrderRequest = {
            sell: tknamt,
            buy: {
                amount: buyamt
            } as ETHAmount,
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
        if(getAddress) {
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
                tokenAddress: batchCollectionAddress1,
            },
            {
                receiver: batchReceiver2,
                tokenId: batchTokenNumber2,
                tokenAddress: batchCollectionAddress2,
            }
        ];

        try {
            const result = await provider?.batchNftTransfer(batchTXDetails);
            batchResult = JSON.stringify(result);
        }
        catch (e) {
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
        }
        catch (e) {
            if (e instanceof Error) {
                    withdrawalResult = e.message;
                } else {
                    withdrawalResult = 'An error occurred';
                }
            }
        }
</script>

<main class="flex flex-col justify-center items-center min-h-screen space-y-4">
    {#if $passportStore}
        <Button on:click={login}><PassportLogo/>Connect Passport</Button>
    {:else}
        <h2>Loading...</h2>
    {/if}
    <div class="w-full md:w-3/4 lg:w-1/2 xl:w-1/5 mx-auto">
    {#if getAddress}
        <Accordion>
            <AccordionItem>
                <h3 slot="header">getAddress()</h3>
                <p class="mb-2 text-gray-500 dark:text-gray-400">{getAddress}</p>
            </AccordionItem>
            <AccordionItem>
                <h3 slot="header">transfer()</h3>
                <fieldset>
                    <Label for="amount" class="mb-2">Amount</Label>
                    <Input type="number" id="amount" bind:value={amount} required  />
                    <Label for="receiver" class="mb-2">Receiver</Label>
                    <Input type="text" id="receiver" bind:value={receiver} required  />
                    <Button type="submit" on:click={transfer}>Transfer</Button>
                </fieldset>
            </AccordionItem>
            <AccordionItem>
                <h3 slot="header">createOrder()</h3>
                <fieldset>
                    <Label for="tokenAddress" class="mb-2">Token Address</Label>
                    <Input type="text" id="tokenAddress" bind:value={collectionAddress} required />
                    <Label for="tokenNumber" class="mb-2">Token ID</Label>
                    <Input type="number" id="tokenNumber" bind:value={tokenNumber} required />
                    <Label for="buyamt" class="mb-2">Buy Amount</Label>
                    <Input type="number" id="buyamt" bind:value={buyamt} required />
                    <Button type="submit" on:click={createOrder}>Create Sell Order</Button>
                </fieldset>
            </AccordionItem>

            <AccordionItem>
                <h3 slot="header">cancelOrder()</h3>
                <fieldset>
                    <Label for="cancelOrderId" class="mb-2">Order ID</Label>
                    <Input type="number" id="cancelOrderId" bind:value={cancelOrderId} required />
                    <Button type="submit" on:click={cancelOrder}>Cancel Order</Button>
                </fieldset>
            </AccordionItem>

            <AccordionItem>
                <h3 slot="header">createTrade()</h3>
                <fieldset>
                    <Label for="tradeOrderId" class="mb-2">Order ID</Label>
                    <Input type="number" id="tradeOrderId" bind:value={tradeOrderId} required />
                    <Button type="submit" on:click={createTrade}>Create Trade</Button>
                </fieldset>
            </AccordionItem>

            <AccordionItem>
                <h3 slot="header">batchNftTransfer()</h3>
                <fieldset>
                    <Label for="receiver1" class="mb-2">Receiver 1</Label>
                    <Input type="text" id="batchReceiver1" bind:value={batchReceiver1} required />
                    <Label for="token1" class="mb-2">Token ID</Label>
                    <Input type="number" id="batchTokenNumber1" bind:value={batchTokenNumber1} required />
                    <Label for="tokenAddress1" class="mb-2">Token Address 1</Label>
                    <Input type="text" id="batchCollectionAddress1" bind:value={batchCollectionAddress1} required />
                    <Hr class="my-8" height="h-px" />
                    <Label for="receiver2" class="mb-2">Receiver 2</Label>
                    <Input type="text" id="batchReceiver2" bind:value={batchReceiver2} required />
                    <Label for="token2" class="mb-2">Token ID 2</Label>
                    <Input type="number" id="batchTokenNumber2" bind:value={batchTokenNumber2} required />
                    <Label for="tokenAddress2" class="mb-2">Token Address 2</Label>
                    <Input type="text" id="batchCollectionAddress2" bind:value={batchCollectionAddress2} required />
                    <Button type="submit" on:click={batchNFTTransfer}>Batch Transfer</Button>
                    {#if batchResult}
                        <p class="mb-2 text-gray-500 dark:text-gray-400">{batchResult}</p>
                    {/if}
                </fieldset>
            </AccordionItem>

            <AccordionItem class="bg-red-100">
                <h3 slot="header">isRegisteredOnChain() - Operation not supported</h3>
                <p class="mb-2 text-gray-500 dark:text-gray-400">{isRegisteredOnChain}</p>
            </AccordionItem>

            <AccordionItem class="bg-red-100">
                <h3 slot="header">registerOffchain() - Operation not supported</h3>
                <p class="mb-2 text-gray-500 dark:text-gray-400">{registerOffChainReuslt}</p>
            </AccordionItem>

            <AccordionItem class="bg-red-100">
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

            <AccordionItem class="bg-red-100">
                <h3 slot="header">prepareWithdrawal() - Operation not supported</h3>
                <fieldset>
                    <Label for="withdrawalAmt" class="mb-2">Amount</Label>
                    <Input type="number" id="withdrawalAmt" bind:value={withdrawalAmt} required />
                    <Button type="submit" on:click={prepareWithdrawal}>Withdraw</Button>
                    {#if withdrawalResult}
                        <p class="mb-2 text-gray-500 dark:text-gray-400">{withdrawalResult}</p>
                    {/if}
                </fieldset>
            </AccordionItem>
        </Accordion>
    {/if}
</div>
</main>



  
