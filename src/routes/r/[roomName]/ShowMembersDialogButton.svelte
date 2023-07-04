<script lang="ts">
    import { SimpleTooltip } from "$components/ui/SimpleTooltip";
    import { Avatar, AvatarFallback, AvatarImage } from "$components/ui/avatar";
    import { Button } from "$components/ui/button";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$components/ui/dialog";
    import { userStore } from "$lib/store";
    import { roomPresenceChannel } from "$lib/store/pusher";
    import { showMembers } from "$lib/store/room";
    import Icon from "@iconify/svelte";

    $: members = $roomPresenceChannel?.members!;

    $: console.log(members);
</script>

<Dialog>
    <DialogTrigger>
        <SimpleTooltip message="Show Members" side="bottom">
            <Button
                class="h-fit flex-center p-1 bg-green-500 hover:bg-green-600"
            >
                <Icon class="text-lg" icon="ic:sharp-people" />
            </Button>
        </SimpleTooltip>
    </DialogTrigger>
    <DialogContent class="max-h-screen">
        <DialogHeader>
            <DialogTitle>Room Members</DialogTitle>
            <DialogDescription>
                There {members.count > 1 ? "are" : "is"} currently {members.count}
                member{members.count > 1 ? "s" : ""}
            </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col overflow-y-auto">
            {#each Object.keys(members.members) as id}
                {@const member = members.get(id).info}
                <div
                    class="w-full h-fit p-3 flex items-center gap-2 hover:bg-secondary rounded-md"
                >
                    <Avatar class="w-8 h-8">
                        <AvatarImage src={member.image || ""} alt="" />
                    </Avatar>
                    @{member.username}
                    {#if member.username === $userStore?.username}
                        <span class="italic">(You)</span>
                    {/if}
                </div>
            {/each}
        </div>
    </DialogContent>
</Dialog>
