<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import CoinIndicator from "$components/CoinIndicator.svelte";
    import ErrorCardGenerator from "$components/ErrorCardGenerator.svelte";
    import { Button } from "$components/ui/button";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$components/ui/card";
    import { Input } from "$components/ui/input";
    import { Label } from "$components/ui/label";
    import { RadioGroup, RadioGroupItem } from "$components/ui/radio-group";
    import { CODE, COST, REGEX } from "$lib/const";
    import Store from "$lib/modules/Store";
    import { loading } from "$lib/store";
    import { trpc } from "$trpc/client";
    import { debounce } from "lodash-es";
    import { onMount } from "svelte";

    const user = $page.data.user!;

    let error: any = null;

    let roomName = {
        checking: false,
        value: "",
        valid: false,
        message: "Please choose Room name",
        color: "gray",
    };

    let visibility = {
        value: "unlisted",
    };

    let password = {
        value: "",
    };

    const checkRoomname = debounce(async () => {
        roomName.checking = true;
        const isValidRoomname = await trpc().room.isValidRoomname.query({
            roomName: roomName.value,
        });

        roomName.valid = isValidRoomname.valid;
        roomName.color = roomName.valid ? "lime" : "red";
        roomName.message = isValidRoomname.message;

        roomName.checking = false;
    }, 500);

    $: passwordValid =
        (visibility.value === "private" && password.value.trim() !== "") ||
        visibility.value !== "private";

    $: hasEnoughMoney = user.wallet.balance >= cost;

    $: canSubmit =
        roomName.valid && !roomName.checking && passwordValid && hasEnoughMoney;

    $: cost =
        COST.CREATE_ROOM[
            visibility.value.toUpperCase() as keyof typeof COST.CREATE_ROOM
        ];

    async function handleCreate() {
        $loading = true;
        const createResponse = await trpc().room.create.query({
            roomName: roomName.value,
            visibility: visibility.value,
            password: password.value,
        });

        Store.refetchUserWalletBalance();

        if (createResponse.error) {
            error = {
                title: "OOPS!",
                message: `${createResponse.message} (CODE: ${createResponse.code})`,
            };
        }

        if (createResponse.code === CODE.DONE) {
            goto(`/r/${roomName.value}`);
        }

        $loading = false;
    }

    if (browser) {
        checkRoomname();
    }

    onMount(() => {
        $loading = false;
    });
</script>

<div class="w-full h-full flex justify-center py-10 pt-5 max-md:p-0">
    <Card
        class="min-w-[600px] h-fit max-md:min-w-full max-md:min-h-full max-md:rounded-none max-md:border-none"
    >
        <CardHeader>
            <CardTitle>Create Room</CardTitle>
        </CardHeader>
        <CardContent>
            <hr class="mb-4" />

            <ErrorCardGenerator bind:error />

            <div class="mb-4" />

            <div class="grid w-full items-center gap-1.5">
                <Label for="roomname">Room Name</Label>
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

            <div class="my-4" />

            <div class="grid w-full items-center gap-3">
                <Label for="visibility">Visibility</Label>
                <RadioGroup bind:value={visibility.value} class="ml-4">
                    <div class="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="r1" />
                        <Label for="r1">Public</Label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <RadioGroupItem value="unlisted" id="r2" />
                        <Label for="r2">Unlisted</Label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="r3" />
                        <Label for="r3">Private</Label>
                    </div>
                </RadioGroup>
            </div>

            <div class="mb-4" />

            {#if visibility.value === "private"}
                <div class="grid w-full items-center gap-1.5">
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        bind:value={password.value}
                        placeholder="secret"
                    />
                    {#if password.value === ""}
                        <p class="text-sm text-red-500">
                            Please Choose password for your room
                        </p>
                    {/if}
                </div>
            {/if}

            <div class="mt-5" />
            <blockquote
                class="mt-6 border-l-2 pl-4 flex gap-2 items-center"
                class:text-red-500={!hasEnoughMoney}
            >
                {#if hasEnoughMoney}
                    This action will cost <CoinIndicator amount={cost} />
                {:else}
                    Not enough coins! you need <CoinIndicator amount={cost} />
                {/if}
            </blockquote>

            <div class="mt-5" />

            <div class="flex justify-end">
                <Button disabled={!canSubmit} on:click={handleCreate}
                    >Create</Button
                >
            </div>
        </CardContent>
    </Card>
</div>
