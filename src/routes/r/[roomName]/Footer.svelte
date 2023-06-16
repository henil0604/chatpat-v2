<script lang="ts">
    import { page } from "$app/stores";
    import { Button } from "$components/ui/button";
    import { Input } from "$components/ui/input";
    import System from "$lib/modules/System";
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

    async function handleSend() {
        if (!$roomStore) return;
        if (message.trim() === "") return;
        $isMessageBeingSent = true;
        let msg = message;
        message = "";

        const id = System.randomString(21);

        $chatsStore = [
            ...$chatsStore,
            {
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
            },
        ];

        $chatsMetaStore = [
            ...$chatsMetaStore,
            {
                id,
                failed: false,
                sending: true,
            },
        ];

        console.log(id);
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
                    e.sending = false;
                    e.failed = true;
                }
                return e;
            });
            $isMessageBeingSent = false;
            return;
        }

        $chatsMetaStore = $chatsMetaStore.map((e) => {
            if (e.id === id) {
                e.sending = false;
            }
            return e;
        });

        $isMessageBeingSent = false;
    }
</script>

<div class="flex z-[2]">
    <Input
        class="rounded-none !border-t-2 py-6 text-lg outline-none box-border"
        bind:value={message}
        type="text"
        placeholder="Type Something..."
        on:keypress={(e) => {
            if (e.keyCode === 13) handleSend();
        }}
    />
    <Button
        disabled={$isMessageBeingSent}
        on:click={handleSend}
        class="rounded-none text-xl px-2 !h-full"
        ><Icon icon="mingcute:send-fill" /></Button
    >
</div>
