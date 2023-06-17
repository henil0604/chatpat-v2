<script lang="ts">
    import { page } from "$app/stores";
    import type System from "$lib/modules/System";
    import { chatsMetaStore } from "$lib/store/room";
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";

    let div: HTMLDivElement;

    onMount(() => {
        div?.scrollIntoView();
    });

    export let section: ReturnType<
        (typeof System)["transformChats"]
    >[number]["sections"][number];

    export let chat: ReturnType<
        (typeof System)["transformChats"]
    >[number]["sections"][number]["chats"][number];
    export let index: number;
    const user = $page.data.user!;

    $: meta = $chatsMetaStore.find((e) => e.id === chat.id) || null;

    $: first = index == 0;
    $: last = index == section.chats.length - 1;
    $: mid = !first && !last;
    $: owner = chat.owner.id === user.id;
</script>

<div
    bind:this={div}
    data-chat-id={chat.id}
    class="flex flex-col justify-between w-fit max-w-lg max-md:max-w-md max-sm:max-w-sm h-fit text-sm px-2 py-1 pb-1.5 rounded-md mb-1 {owner
        ? 'bg-message-sent-box text-message-sent-box-foreground rounded-tr-none'
        : 'bg-message-received text-message-received-box-foreground rounded-tl-none'}"
>
    <!-- header -->
    <div class="mb-1">
        {#if first}
            <div
                class="text-sm font-semibold {owner
                    ? 'text-message-sent-username'
                    : 'text-message-received-username'}"
            >
                @{chat.owner.username}
            </div>
        {/if}
        <!--  -->
    </div>

    <div class="flex items-end">
        <div class="flex flex-grow text-sm">
            {chat.content}
        </div>

        <div
            class="flex text-[10px] justify-end items-end min-w-fit h-fit pl-3 gap-1"
        >
            <div class="font-thin tracking-tighter leading-3 w-fit h-fit">
                {new Date(chat.createdAt).toLocaleTimeString(undefined, {
                    timeStyle: "short",
                })}
            </div>
            {#if meta?.sending}
                <Icon icon="icon-park-outline:timer" />
            {/if}
        </div>
    </div>
</div>
