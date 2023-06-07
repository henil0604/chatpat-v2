<script lang="ts">
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$components/ui/dialog";
    import { Button } from "$components/ui/button";
    import Icon from "@iconify/svelte";
    import { signIn } from "@auth/sveltekit/client";
    import { loading } from "$lib/store";

    function handleLogin(provider: string) {
        $loading = true;
        signIn(provider);
    }
</script>

<Dialog>
    <DialogTrigger class="w-full">
        <slot />
    </DialogTrigger>
    <DialogContent class="h-fit">
        <DialogHeader>
            <DialogTitle class="mb-5">Login with...</DialogTitle>
            <DialogDescription>
                <Button
                    on:click={() => handleLogin("github")}
                    variant="outline"
                    class="h-fit flex gap-3 text-lg"
                >
                    <Icon class="text-5xl" icon="mdi:github" />
                    Github
                </Button>
            </DialogDescription>
        </DialogHeader>
    </DialogContent>
</Dialog>
