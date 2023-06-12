<script lang="ts">
    import { LoadingLayout } from "$components/ui/LoadingLayout";
    import { Button } from "$components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$components/ui/card";
    import { trpc } from "$trpc/client";

    import type { RouterOutput } from "$trpc/router";
    import Icon from "@iconify/svelte";
    import moment from "moment";
    import { createEventDispatcher } from "svelte";

    let roomLoading = false;

    type ArrayElement<ArrayType extends readonly unknown[]> =
        ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

    export let room: ArrayElement<
        NonNullable<RouterOutput["user"]["getRooms"]["data"]>
    >;

    const dispatch = createEventDispatcher();

    async function deleteRoom() {
        let conf = confirm("Do you really want to delete this room?");
        if (!conf) return;
        roomLoading = true;

        const deleteResponse = await trpc().room.delete.query({
            roomName: room.name,
        });

        if (deleteResponse.error) {
            alert(deleteResponse.message);
        }

        dispatch("delete", {
            room,
        });
        roomLoading = false;
    }
</script>

<Card class="relative">
    {#if roomLoading}
        <LoadingLayout />
    {/if}

    <CardHeader class="p-5">
        <CardTitle>{room.name}</CardTitle>
        <CardDescription class="italic"
            >Created {moment(room.createdAt).fromNow()}</CardDescription
        >
    </CardHeader>
    <CardContent class="p-5 ">
        <div class="flex justify-end gap-1">
            <!-- TODO: add this after AlertDialogAction has on:click event exposed in shadcn-svelte -->

            <!-- <AlertDialog>
                <AlertDialogTrigger>
                    <Button size="sm" variant="destructive" class="text-xl px-2"
                        ><Icon icon="mdi:delete" /></Button
                    >
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle
                        >Are you sure you want to delete this room?</AlertDialogTitle
                        >
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the room and remove all chats from our
                            servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction on:click={deleteRoom}
                            >Yes, I am sure</AlertDialogAction
                        >
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> -->
            <Button
                on:click={deleteRoom}
                size="sm"
                variant="destructive"
                class="text-xl px-2"><Icon icon="mdi:delete" /></Button
            >

            <Button size="sm" href="/r/{room.name}">Join</Button>
        </div>
    </CardContent>
</Card>
