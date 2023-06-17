<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import type ServerRoom from "$lib/modules/server/Room";
    import { chatsStore, roomAccess, roomStore } from "$lib/store/room";
    import { blur, fly, scale, slide } from "svelte/transition";
    import IdleState from "./IdleState.svelte";
    import PasswordProtection from "./PasswordProtection.svelte";
    import RoomNotFound from "./RoomNotFound.svelte";
    import { onDestroy } from "svelte";
    import { loading } from "$lib/store";
    import System from "$lib/modules/System";
    import { roomChannel } from "$lib/store/pusher";

    const room: Awaited<ReturnType<(typeof ServerRoom)["getByName"]>> =
        $page.data.room;

    const chats: Awaited<ReturnType<(typeof ServerRoom)["getSortedChats"]>> =
        $page.data.chats;

    if (browser) {
        $roomStore = room;
        $chatsStore = chats;
        if (room?.visibility !== "private") {
            $roomAccess = true;
        }

        if (room) {
            System.initRoomPusherChannel(room.name);
        }
    }

    onDestroy(() => {
        $roomAccess = false;
        $roomStore = null;
        $chatsStore = [];

        if ($roomChannel) {
            $roomChannel.disconnect();
            $roomChannel = null;
        }
    });
</script>

{#if !room}
    <div class="flex-center w-full h-full">
        <RoomNotFound />
    </div>
{:else if $roomAccess === false}
    <div in:scale class="flex-center w-full h-full">
        <IdleState hashedPassword={room.password} />
    </div>
{/if}

{#if $roomAccess}
    <div class="w-full h-full flex-center flex-col p-5 max-md:p-0">
        <slot />
    </div>
{/if}
