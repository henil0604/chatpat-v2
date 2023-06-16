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
    import System from "$lib/modules/System";
    import { roomAccess } from "$lib/store/room";

    const password = {
        value: "",
        message: "Hi",
        color: "gray",
    };

    export let hashedPassword: string;

    function passwordChange() {
        if (System.hash(password.value) === hashedPassword) {
            $roomAccess = true;
        }
    }
</script>

<Card
    class="w-[400px] max-md:w-full max-md:h-full max-md:rounded-none max-md:border-none"
>
    <CardHeader>
        <CardTitle>Room is private</CardTitle>
        <CardDescription>Please enter password to continue</CardDescription>
    </CardHeader>
    <CardContent>
        <div class="grid w-full items-center gap-1.5">
            <Input
                type="password"
                id="password"
                bind:value={password.value}
                placeholder="secret"
                on:input={passwordChange}
            />
            {#if password.message === ""}
                <p class="text-sm text-{password.color}-500">
                    {password.message}
                </p>
            {/if}
        </div>
    </CardContent>
</Card>
