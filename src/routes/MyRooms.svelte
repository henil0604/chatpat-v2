<script lang="ts">
    import { browser } from "$app/environment";
    import MyRoomCard from "./Card.MyRooms.svelte";
    import { trpc } from "$trpc/client";
    import type { Router, RouterOutput } from "$trpc/router";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$components/ui/card";
    import { Skeleton } from "$components/ui/skeleton";

    let roomsLoading = false;
    let rooms: RouterOutput["user"]["getRooms"]["data"] = [];
    let error: any = null;

    async function fetchRooms() {
        const getRoomsResponse = await trpc().user.getRooms.query();

        if (getRoomsResponse.error) {
            error = getRoomsResponse.message;
        }

        return getRoomsResponse.data;
    }

    if (browser) {
        (async () => {
            roomsLoading = true;
            rooms = await fetchRooms();
            roomsLoading = false;
        })();
    }

    async function handleDelete({ detail }: any) {
        rooms = rooms!.filter((e) => e.name !== detail.room.name);
        rooms = await fetchRooms();
    }
</script>

<div class="w-full">
    <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">My Rooms</h3>
    <hr class="my-2 mb-4" />
    <div class="grid-container">
        {#if roomsLoading === false && rooms}
            {#each rooms as room}
                <MyRoomCard on:delete={handleDelete} {room} />
            {/each}
        {:else}
            {#each Array(8) as _}
                <Card>
                    <CardHeader class="p-5">
                        <CardTitle>
                            <Skeleton class="h-4 w-[100px]" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton class="h-3 w-[140px]" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="p-5">
                        <div class="flex justify-end gap-2">
                            <Skeleton class="h-10 w-10" />
                            <Skeleton class="h-10 w-10" />
                        </div>
                    </CardContent>
                </Card>
            {/each}
        {/if}
    </div>
</div>

<style lang="postcss">
    .grid-container {
        /**
        * User input values.
        */
        --grid-layout-gap: 10px;
        --grid-column-count: 5;
        --grid-item--min-width: 300px;

        /**
        * Calculated values.
        */
        --gap-count: calc(var(--grid-column-count) - 1);
        --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
        --grid-item--max-width: calc(
            (100% - var(--total-gap-width)) / var(--grid-column-count)
        );

        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(
                max(var(--grid-item--min-width), var(--grid-item--max-width)),
                1fr
            )
        );
        grid-gap: var(--grid-layout-gap);
    }
</style>
