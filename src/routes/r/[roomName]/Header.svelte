<script lang="ts">
    import { page } from "$app/stores";
    import UserWalletBalanceIndicator from "$components/UserWalletBalanceIndicator.svelte";
    import { SimpleTooltip } from "$components/ui/SimpleTooltip";
    import { Badge } from "$components/ui/badge";
    import { Button } from "$components/ui/button";
    import type ServerRoom from "$lib/modules/server/Room";
    import { roomAccess } from "$lib/store/room";
    import Icon from "@iconify/svelte";

    const room: Awaited<ReturnType<(typeof ServerRoom)["getByName"]>> =
        $page.data.room!;

    const chats: Awaited<ReturnType<(typeof ServerRoom)["getSortedChats"]>> =
        $page.data.chats!;
</script>

<div class="p-3 max-md:p-2 border-b-2 shadow-lg z-[2] flex justify-between">
    <!-- Left -->
    <div class="flex">
        <SimpleTooltip message="Go to Dashboard" side="bottom">
            <Button href="/" class="p-2 h-fit" size="sm" variant="outline">
                <Icon icon="mingcute:left-fill" />
            </Button>
        </SimpleTooltip>

        <div class="mx-1.5" />

        <div class="text-lg">{room?.name}</div>
    </div>
    <!-- Right -->
    <div class="flex-center gap-1">
        <UserWalletBalanceIndicator />
        <SimpleTooltip message="Go Idle" side="bottom">
            <Button
                on:click={() => ($roomAccess = false)}
                class="h-full flex-center p-0 px-2 bg-amber-500 hover:bg-amber-600"
                variant="destructive"
            >
                <Icon class="text-xl" icon="ph:moon-fill" />
            </Button>
        </SimpleTooltip>
        <div class="mx-1 max-md:mx-0" />

        <SimpleTooltip message="You are online" side="bottom">
            <Icon icon="fluent-emoji-flat:green-circle" class="animate-pulse" />
        </SimpleTooltip>
    </div>
</div>
