<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import ErrorCardGenerator from "$components/ErrorCardGenerator.svelte";
    import { Button } from "$components/ui/button";
    import {
        Card,
        CardHeader,
        CardContent,
        CardTitle,
    } from "$components/ui/card";
    import { Input } from "$components/ui/input";
    import { Label } from "$components/ui/label";
    import { CODE } from "$lib/const";
    import { loading } from "$lib/store";
    import { trpc } from "$lib/trpc/client";
    import { redirect } from "@sveltejs/kit";
    import { debounce } from "lodash-es";
    import { onMount } from "svelte";

    const user = $page.data.user!;

    let error: any = null;

    const defaultUsername = (user.email || "").split("@")[0];

    let username = {
        checking: false,
        value: defaultUsername,
        valid: false,
        message: "Please choose a username",
        color: "gray",
    };

    const checkUsername = debounce(async () => {
        username.checking = true;
        const isValidUsername = await trpc().user.isValidUsername.query({
            username: username.value,
        });

        username.valid = isValidUsername.valid;
        username.color = username.valid ? "lime" : "red";
        username.message = isValidUsername.message;

        username.checking = false;
    }, 500);

    $: canSubmit = username.valid && !username.checking;

    const handleContinue = async () => {
        if (!canSubmit) return;

        $loading = true;

        const submit = await trpc().user.onBoardingComplete.query({
            username: username.value,
        });

        if (submit.error) {
            error = {
                title: "OOPS!",
                message: `${submit.message} (CODE: ${submit.code})`,
            };
        }

        if (submit.code === CODE.DONE) {
            goto("/");
        }

        $loading = false;
    };

    if (browser) {
        checkUsername();
    }

    onMount(() => {
        $loading = false;
    });
</script>

<div class="w-full min-h-screen flex justify-center md:py-10 md:pt-32">
    <Card
        class="min-w-[400px] h-fit max-md:min-w-full max-md:min-h-screen max-md:rounded-none max-md:border-none"
    >
        <CardHeader>
            <CardTitle
                >Welcome Aboard, <span class="highlight italic"
                    >{user.name}</span
                ></CardTitle
            >
        </CardHeader>
        <CardContent>
            <hr class="mb-4" />

            <ErrorCardGenerator bind:error />

            <div class="mb-4" />

            <div class="grid w-full items-center gap-1.5">
                <Label for="username">Username</Label>
                <Input
                    type="text"
                    id="username"
                    bind:value={username.value}
                    on:input={checkUsername}
                    placeholder={defaultUsername}
                />
                {#if username.checking}
                    <p class="text-sm text-muted-foreground">Checking...</p>
                {:else}
                    <p class="text-sm text-{username.color}-500">
                        {username.message}
                    </p>
                {/if}
            </div>

            <div class="mt-5" />

            <div class="flex justify-end">
                <Button disabled={!canSubmit} on:click={handleContinue}
                    >Continue</Button
                >
            </div>
        </CardContent>
    </Card>
</div>
