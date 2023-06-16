<script lang="ts">
    import type System from "$lib/modules/System";
    import Section from "./Section.Block.Body.svelte";

    export let block: ReturnType<(typeof System)["transformChats"]>[number];
</script>

<div class="my-2">
    <div class="text-center w-full italic text-chat-section-label">
        {block.label}
    </div>
    <div class="my-2" />
    <div class="flex flex-col">
        {#each block.sections as section}
            <Section {section} />
        {/each}
    </div>
</div>
