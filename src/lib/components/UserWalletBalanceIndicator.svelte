<script lang="ts">
    import { userWalletBalance } from "$lib/store";
    import CoinIndicator from "$components/CoinIndicator.svelte";
</script>

<CoinIndicator amount={$userWalletBalance} />
