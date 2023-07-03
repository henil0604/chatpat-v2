<script>
    import System from "$lib/modules/System";
    import { chatsStore, recentAlert } from "$lib/store/room";
    import { slide } from "svelte/transition";
    import Block from "./Block.Body.svelte";
</script>

<div
    id="body"
    class="relative flex-grow w-full max-h-full flex flex-col py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
>
    {#each System.transformChats($chatsStore) as block}
        <Block {block} />
    {/each}
</div>

<style scoped>
    #body::-webkit-scrollbar-thumb {
        transition: 3s;
        visibility: hidden;
    }
    #body::-webkit-scrollbar-thumb:hover {
        visibility: visible;
    }
</style>
