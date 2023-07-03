<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import Body from "./Body.svelte";
    import Footer from "./Footer.svelte";

    import Header from "./Header.svelte";
    import { recentAlert } from "$lib/store/room";
</script>

<div
    in:slide
    class="w-full h-full flex flex-col border rounded-md shadow-xl max-md:min-w-none max-md:w-full max-md:h-full"
>
    <Header />
    {#if $recentAlert.length > 0}
        <div
            in:slide
            out:slide
            class="w-full backdrop-blur-md h-fit py-1 text-[13px] bg-slate-900 text-center text-white shadow-lg"
        >
            {$recentAlert}
        </div>
    {/if}
    <Body />
    <Footer />
</div>
