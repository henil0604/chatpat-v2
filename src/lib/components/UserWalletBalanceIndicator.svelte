<script lang="ts">
    import { userStore, userWalletBalance } from "$lib/store";
    import CoinIndicator from "$components/CoinIndicator.svelte";
    import Store from "$lib/modules/Store";
    import { onDestroy, onMount } from "svelte";

    let interval: any;
    let coinIndicatorComponent: any;

    onMount(() => {
        interval = setInterval(async () => {
            Store.refetchUserWalletBalance();
        }, 10000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    $: if (!$userStore) {
        clearInterval(interval);
    }

    let lastBal = $userWalletBalance;

    userWalletBalance.subscribe((bal) => {
        const diff = bal - lastBal;

        if (isNaN(diff)) return;

        coinIndicatorComponent?.animateDiff?.(diff);
        lastBal = bal;
    });
</script>

<CoinIndicator
    bind:this={coinIndicatorComponent}
    amount={parseFloat(lastBal.toFixed(2))}
/>
