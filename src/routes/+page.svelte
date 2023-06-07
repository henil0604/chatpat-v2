<script lang="ts">
    import NavigationBar from "$components/ui/NavigationBar/NavigationBar.svelte";
    import { Button } from "$components/ui/button";
    import { trpc } from "$lib/trpc/client";
</script>

<div class="flex max-md:flex-col w-full h-full">
    <NavigationBar showTitle={true} actions={[]} />

    <div class="w-full h-full flex flex-col items-center py-10 pt-36">
        <h1>Chatpat</h1>
        <div class="my-2" />
        <h5 class="italic text-lg">Flavour of Privacy</h5>
    </div>
</div>

<style lang="postcss">
    h1 {
        @apply text-8xl font-bold;
    }
</style>
