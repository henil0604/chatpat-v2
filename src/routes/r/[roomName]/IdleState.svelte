<script lang="ts">
    import { Button } from "$components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$components/ui/card";
    import { Input } from "$components/ui/input";
    import { Label } from "$components/ui/label";
    import System from "$lib/modules/System";
    import { roomAccess } from "$lib/store/room";
    import Icon from "@iconify/svelte";

    export let hashedPassword: string | null;

    const password = {
        value: "",
        message: "",
        color: "gray",
    };

    function checkPassword() {
        if (!hashedPassword) {
            $roomAccess = true;
            return;
        }
        if (password.value === "") {
            password.message = "";
            password.color = "gray";
            return;
        }
        if (System.hash(password.value) === hashedPassword) {
            $roomAccess = true;
        } else {
            password.message = "Invalid Password";
            password.color = "red";
        }
    }
</script>

<Card
    class="w-[400px] max-md:w-full max-md:h-full shadow-xl border-4 max-md:rounded-none max-md:border-none"
>
    <CardHeader>
        <CardTitle class="flex-center gap-2 text-2xl"
            >Hey, You are Idle <Icon
                icon="ph:moon-fill"
                class="text-amber-500"
            /></CardTitle
        >
    </CardHeader>
    <CardContent class="flex-center flex-col gap-4">
        {#if hashedPassword}
            <div class="grid w-full items-center gap-1.5">
                <Label for="password">Password</Label>
                <Input
                    type="password"
                    id="password"
                    bind:value={password.value}
                    on:keypress={(e) => {
                        if (e.keyCode === 13) checkPassword();
                    }}
                    placeholder="secret"
                />
                <p class="text-sm text-{password.color}-500">
                    {password.message}
                </p>
            </div>
        {/if}
        <Button on:click={checkPassword} class="flex-center gap-2"
            >Go Online <Icon icon="fluent-emoji-flat:green-circle" /></Button
        >
    </CardContent>
</Card>
