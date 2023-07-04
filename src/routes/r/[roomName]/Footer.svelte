<script lang="ts">
    import { page } from "$app/stores";
    import { Button } from "$components/ui/button";
    import { Input } from "$components/ui/input";
    import Store from "$lib/modules/Store";
    import System from "$lib/modules/System";
    import { roomChannel } from "$lib/store/pusher";
    import {
        chatsMetaStore,
        chatsStore,
        isMessageBeingSent,
        roomStore,
    } from "$lib/store/room";
    import { trpc } from "$trpc/client";
    import Icon from "@iconify/svelte";

    let message = "";

    const user = $page.data.user!;
    console.log(user);

    async function handleSend() {
        $roomChannel?.trigger(`client-typing-stop`, {
            username: user.username,
            timestamp: Date.now(),
        });
        if (!$roomStore) return location.reload();
        if (!user) return location.reload();
        if (message.trim() === "") return;
        $isMessageBeingSent = true;
        let msg = message;
        message = "";

        const id = System.randomString(21);

        let data = {
            id,
            content: msg,
            createdAt: new Date(),
            owner: {
                id: user.id as string,
                email: user.email as string,
                emailVerified: null,
                image: user.image as string,
                name: user.name as string,
                username: user.username as string,
            },
            ownerId: user.id as string,
            roomName: $roomStore.name,
            reactions: [],
            roomId: $roomStore.id,
            updatedAt: new Date(),
        };

        $chatsStore = [
            ...$chatsStore,
            {
                ...data,
            },
        ];

        $chatsMetaStore = [
            ...$chatsMetaStore,
            {
                id,
                failed: false,
                stored: false,
                broadcasted: false,
            },
        ];

        let trigger = $roomChannel?.trigger("client-new-chat", {
            id: id,
            content: msg,
            createdAt: data.createdAt,
            owner: user,
            room: $roomStore,
            ownerId: user.id as string,
            roomId: $roomStore.id,
        });

        $chatsMetaStore = $chatsMetaStore.map((e) => {
            if (e.id === id) {
                e.broadcasted = trigger || false;
            }
            return e;
        });

        try {
            const sendResponse = await trpc().room.sendMessage.query({
                id,
                message: msg,
                createdAt: Date.now(),
                roomName: $roomStore.name,
            });
        } catch (e) {
            $chatsMetaStore = $chatsMetaStore.map((e) => {
                if (e.id === id) {
                    e.stored = false;
                    e.failed = true;
                }
                return e;
            });
            $isMessageBeingSent = false;
            return;
        }

        $chatsMetaStore = $chatsMetaStore.map((e) => {
            if (e.id === id) {
                e.stored = true;
            }
            return e;
        });

        Store.refetchUserWalletBalance();

        $isMessageBeingSent = false;
    }

    function keyDownHandler(e: KeyboardEvent) {
        if (e.keyCode === 13) handleSend();
    }

    let inputTimeout: any;
    function inputHandler(e: Event) {
        clearTimeout(inputTimeout);
        if (!inputTimeout) {
            // trigger start typing event
            $roomChannel?.trigger(`client-typing-start`, {
                username: user.username,
                timestamp: Date.now(),
            });
        }

        inputTimeout = setTimeout(() => {
            // trigger stop typing event
            $roomChannel?.trigger(`client-typing-stop`, {
                username: user.username,
                timestamp: Date.now(),
            });
            inputTimeout = null;
        }, 900);
    }
</script>

<div class="flex z-[2] p-5 max-md:p-3">
    <Input
        class="rounded-none rounded-tl-lg rounded-bl-lg border-sky-500 outline-none box-border"
        bind:value={message}
        type="text"
        placeholder="Share Something..."
        on:keydown={keyDownHandler}
        on:input={inputHandler}
    />
    <Button on:click={handleSend} class="rounded-none text-xl px-2 !h-full"
        ><Icon icon="mingcute:send-fill" /></Button
    >
</div>
