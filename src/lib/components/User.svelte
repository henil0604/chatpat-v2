<script lang="ts">
    import { page } from "$app/stores";

    let user = $page.data.user!;
</script>

{#if user}
    <slot {user} />
{:else}
    <slot name="signedOut" />
{/if}
