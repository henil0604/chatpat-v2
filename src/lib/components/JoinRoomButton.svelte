<script lang="ts">
    import { Button } from "$components/ui/button";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$components/ui/dialog";
    import { Label } from "$components/ui/label";
    import { Input } from "$components/ui/input";
    import { trpc } from "$trpc/client";
    import { debounce } from "lodash-es";
    import { goto } from "$app/navigation";

    let className: string | undefined | null = undefined;
    export { className as class };

    let roomName = {
        checking: false,
        value: "",
        valid: false,
        message: "Please enter Room name",
        color: "gray",
    };

    const checkRoomname = debounce(async () => {
        roomName.checking = true;

        const existsResponse = await trpc().room.doesExists.query({
            roomName: roomName.value,
        });

        roomName.valid = existsResponse.exists;
        roomName.color = roomName.valid ? "lime" : "red";
        roomName.message = existsResponse.message;

        roomName.checking = false;
    }, 500);

    $: canJoin = roomName.valid;
</script>

<Dialog>
    <DialogTrigger>
        <Button size="sm" class={className}>Join</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Join Room</DialogTitle>
            <DialogDescription>Join room by its name</DialogDescription>

            <div class="mt-3" />

            <div class="grid w-full items-center gap-1.5">
                <!-- <Label for="roomname">Room Name</Label> -->
                <Input
                    type="text"
                    id="roomname"
                    bind:value={roomName.value}
                    on:input={checkRoomname}
                    placeholder="my-room"
                />
                {#if roomName.checking}
                    <p class="text-sm text-muted-foreground">Checking...</p>
                {:else}
                    <p class="text-sm text-{roomName.color}-500">
                        {roomName.message}
                    </p>
                {/if}
            </div>

            <div class="mt-4" />

            <div class="flex justify-end">
                <Button
                    disabled={!canJoin}
                    on:click={() => goto(`/r/${roomName.value}`)}
                >
                    Join
                </Button>
            </div>
        </DialogHeader>
    </DialogContent>
</Dialog>
