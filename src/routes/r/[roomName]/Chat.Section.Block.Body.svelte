<script lang="ts">
    import { page } from "$app/stores";
    import { Avatar, AvatarFallback, AvatarImage } from "$components/ui/avatar";
    import { Button } from "$components/ui/button";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
    } from "$components/ui/dialog";
    import type System from "$lib/modules/System";
    import { roomChannel } from "$lib/store/pusher";
    import { chatsMetaStore, removeChat } from "$lib/store/room";
    import { trpc } from "$trpc/client";
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";

    let div: HTMLDivElement;
    let showMenu = false;

    onMount(() => {
        div?.scrollIntoView();

        div.oncontextmenu = () => {
            showMenu = true;
            return false;
        };
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

    async function handleUnsend() {
        showMenu = false;
        $roomChannel?.trigger("client-chat-unsend", {
            id: chat.id,
        });

        removeChat(chat.id);

        const unsendResponse = await trpc().room.unsendMessage.query({
            id: chat.id,
        });

        console.log(unsendResponse);
    }
</script>

<Dialog bind:open={showMenu}>
    <DialogContent>
        <DialogHeader />
        <div
            class="w-full border rounded-sm my-5 p-2 shadow-lg flex gap-2 {owner
                ? 'flex-row-reverse'
                : 'flex-row'}"
        >
            <Avatar class="w-8 h-8 max-md:w-6 max-md:h-6">
                <AvatarImage
                    src={section.owner.image || ""}
                    alt="@{section.owner.username || ''}"
                />
            </Avatar>
            {@html div.outerHTML}
        </div>
        <hr />

        <div class="flex flex-col">
            {#if owner}
                <Button
                    on:click={handleUnsend}
                    variant="destructive"
                    class="w-full h-fit p-2 flex justify-start gap-2"
                >
                    <Icon icon="mdi:delete" class="text-lg" /> Unsend
                </Button>
            {/if}
        </div>
    </DialogContent>
</Dialog>

<div
    bind:this={div}
    data-chat-id={chat.id}
    class="flex flex-col justify-between w-fit max-w-lg max-md:max-w-md max-sm:max-w-sm h-fit text-sm px-2 py-1 pb-1.5 rounded-md mb-1 select-none {owner
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
        <div class="flex flex-grow text-sm break-all">
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
            {#if meta}
                {#if !meta.broadcasted}
                    <Icon icon="icon-park-outline:timer" />
                {/if}
                {#if meta.broadcasted && !meta.stored}
                    <Icon icon="material-symbols:check" />
                {/if}
                {#if meta.stored}
                    <Icon icon="material-symbols:check" />
                {/if}
            {:else if owner}
                <Icon icon="material-symbols:check" />
            {/if}
        </div>
    </div>
</div>
