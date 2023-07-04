<script lang="ts">
    import { page } from "$app/stores";
    import UserProfile from "$components/UserProfile.svelte";
    import UserWalletBalanceIndicator from "$components/UserWalletBalanceIndicator.svelte";
    import { SimpleTooltip } from "$components/ui/SimpleTooltip";
    import { Badge } from "$components/ui/badge";
    import { Button } from "$components/ui/button";
    import type ServerRoom from "$lib/modules/server/Room";
    import { recentAlert, roomAccess, showMembers } from "$lib/store/room";
    import Icon from "@iconify/svelte";
    import { slide } from "svelte/transition";

    const room: Awaited<ReturnType<(typeof ServerRoom)["getByName"]>> =
        $page.data.room!;

    const chats: Awaited<ReturnType<(typeof ServerRoom)["getSortedChats"]>> =
        $page.data.chats!;
</script>

<div
    class="p-3 py-1 max-md:p-2 border-b-2 shadow-lg z-[2] flex justify-between"
>
    <!-- Left -->
    <div class="flex">
        <SimpleTooltip message="Go to Dashboard" side="bottom">
            <Button href="/" class="p-2 h-fit" size="sm" variant="outline">
                <Icon icon="mingcute:left-fill" />
            </Button>
        </SimpleTooltip>

        <div class="mx-1.5" />

        <div class="text-lg flex-center">{room?.name}</div>
    </div>
    <!-- Right -->
    <div class="flex-center gap-1">
        <UserWalletBalanceIndicator />
        <SimpleTooltip message="Go Idle" side="bottom">
            <Button
                on:click={() => ($roomAccess = false)}
                class="h-fit flex-center p-1 bg-amber-500 hover:bg-amber-600"
            >
                <Icon class="text-lg" icon="ph:moon-fill" />
            </Button>
        </SimpleTooltip>
        <SimpleTooltip message="Show Members" side="bottom">
            <Button
                on:click={() => ($showMembers = true)}
                class="h-fit flex-center p-1 bg-green-500 hover:bg-green-600"
            >
                <Icon class="text-lg" icon="ic:sharp-people" />
            </Button>
        </SimpleTooltip>
        <div class="mx-0.5 max-md:mx-0" />
        <UserProfile tooltipSide="bottom" />
    </div>
</div>
