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
    import System from "$lib/modules/System";
    import { roomChannel } from "$lib/store/pusher";
    import {
        chatsMetaStore,
        getChat,
        removeChat,
        replyChatId,
        updateChat,
    } from "$lib/store/room";
    import { trpc } from "$trpc/client";
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { draggable, type DragOptions } from "@neodrag/svelte";
    import { tweened } from "svelte/motion";
    import { sineIn } from "svelte/easing";
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from "$components/ui/tooltip";

    let div: HTMLDivElement;
    let showMenu = false;
    let showReactionsMenu = false;

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

    async function handleCopy() {
        showMenu = false;
        System.copyTextToClipboard(chat.content);
    }

    const drag_x = tweened(0, { easing: sineIn });

    function handleSetReply() {
        $replyChatId = chat.id;
    }

    function handleReply() {
        showMenu = false;
        handleSetReply();
    }

    async function handleUnreact(reaction: string) {
        showMenu = false;
        $roomChannel?.trigger("client-chat-reaction-remove", {
            id: chat.id,
            reaction,
            reactedBy: user.username,
        });

        updateChat(chat.id, {
            reactions: [
                ...(getChat(chat.id).chat?.reactions || []).filter((e) => {
                    return e != `${user.username}:${reaction}`;
                }),
            ],
        });

        const response = await trpc().room.removeReaction.query({
            id: chat.id,
            reaction: reaction,
        });

        console.log(response);
    }

    async function handleReact(reaction: string) {
        if (!chat.reactions) {
            chat.reactions = [];
        }
        if (chat.reactions.includes(`${user.username}:${reaction}`))
            return handleUnreact(reaction);

        showMenu = false;
        $roomChannel?.trigger("client-chat-reaction-add", {
            id: chat.id,
            reaction,
            reactedBy: user.username,
        });

        updateChat(chat.id, {
            reactions: [
                ...(getChat(chat.id).chat?.reactions || []),
                `${user.username}:${reaction}`,
            ],
        });

        chat = getChat(chat.id).chat!;

        const response = await trpc().room.addReaction.query({
            id: chat.id,
            reaction: reaction,
        });

        console.log(response);
    }

    const instantReactions = ["😂", "❤️", "👍", "😥", "🙏", "💯"];

    $: console.log(chat);
</script>

<Dialog bind:open={showReactionsMenu}>
    <DialogContent>
        <DialogHeader />
        <div class="flex flex-col gap-2">
            {#if chat.reactions && chat.reactions.length > 0}
                {#each chat.reactions as reactionItem}
                    {@const by = reactionItem.split(":")[0]}
                    {@const reaction = reactionItem.split(":")[1]}
                    <div
                        class="flex border-b justify-between items-center gap-2 p-1"
                    >
                        <span
                            class="text-sm font-semibold {by === user.username
                                ? 'text-message-sent-username'
                                : 'text-message-received-username'}"
                        >
                            @{by}
                        </span>
                        <div class="text-lg">
                            {reaction}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </DialogContent>
</Dialog>

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
        <div class="flex-center gap-2">
            {#each instantReactions as instantReaction}
                <Button
                    on:click={() => {
                        handleReact(instantReaction);
                    }}
                    variant={chat.reactions.includes(
                        `${user.username}:${instantReaction}`
                    )
                        ? "default"
                        : "outline"}
                    class="h-fit p-2 rounded-full text-lg"
                >
                    {instantReaction}
                </Button>
            {/each}
        </div>
        <hr />

        <div class="flex flex-col gap-1">
            <Button
                on:click={handleReply}
                variant="outline"
                class="w-full h-fit p-2 flex justify-start gap-2"
            >
                <Icon icon="ic:baseline-reply" class="text-lg" /> Reply
            </Button>
            <Button
                on:click={handleCopy}
                variant="outline"
                class="w-full h-fit p-2 flex justify-start gap-2"
            >
                <Icon icon="iconamoon:copy-bold" class="text-lg" /> Copy
            </Button>
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

<div class="flex flex-col mb-1">
    <div
        bind:this={div}
        data-chat-id={chat.id}
        class="relative cursor-grab flex flex-col justify-between w-fit max-w-lg max-md:max-w-md max-sm:max-w-sm h-fit text-sm px-2 py-1 pb-1.5 rounded-md select-none {owner
            ? 'bg-message-sent-box text-message-sent-box-foreground rounded-tr-none'
            : 'bg-message-received text-message-received-box-foreground rounded-tl-none'}"
        use:draggable={{
            axis: "x",
            position: { x: $drag_x, y: 0 },
        }}
        on:neodrag={(e) => {
            // We don't want it lagging while dragging, so duration: 0
            drag_x.set(e.detail.offsetX, { duration: 0 });
        }}
        on:neodrag:end={(e) => {
            if (Math.abs(e.detail.offsetX) > 100) {
                handleSetReply();
            }
            $drag_x = 0;
        }}
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
        </div>

        <!-- Reply Box -->
        {#if chat.repliedChat}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                on:click={() => {
                    const div = document.querySelector(
                        `[data-chat-id="${chat.repliedChat?.id}"]`
                    );
                    if (!div) return;

                    div.scrollIntoView();
                }}
                class="p-2 py-1 flex flex-col w-full rounded-r-md pr-7 border-l-4 my-1 {chat
                    .repliedChat.owner.id === user.id
                    ? 'bg-message-sent-reply-box text-message-sent-reply-box-foreground'
                    : 'bg-message-received-reply-box text-message-received-reply-box-foreground'}"
            >
                <div class="text-[10px]">
                    Replying to <span class="italic"
                        >{chat.repliedChat.owner.id === user.id
                            ? "self"
                            : `@${chat.repliedChat.owner.username}`}
                    </span>
                </div>
                <div class="text-[12px] pl-1">
                    {chat.repliedChat.content}
                </div>
            </div>
        {/if}

        <div class="flex items-end">
            <div class="flex flex-grow text-sm break-all">
                {chat.content}
            </div>

            <div
                class="flex text-[10px] justify-end items-end min-w-fit h-fit pl-3 gap-1"
            >
                <!-- timestamp -->
                <div class="font-thin tracking-tighter leading-3 w-fit h-fit">
                    {new Date(chat.createdAt).toLocaleTimeString(undefined, {
                        timeStyle: "short",
                    })}
                </div>
                <!-- status -->
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
    <div class="flex {owner ? 'justify-end pr-1' : 'justify-start pl-1'}">
        <!-- reactions -->
        {#if chat.reactions && chat.reactions.length > 0}
            {@const allReactionsArray = chat.reactions.map(
                (e) => e.split(":")[1]
            )}
            {@const reactions = allReactionsArray
                .sort()
                .filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })
                .join("")}

            <Button
                on:click={() => (showReactionsMenu = true)}
                class="w-fit h-fit p-0.5 px-1 text-xs rounded-none rounded-b-md"
            >
                {reactions} <span class="ml-1">{chat.reactions.length}</span>
            </Button>
        {/if}
    </div>
</div>
