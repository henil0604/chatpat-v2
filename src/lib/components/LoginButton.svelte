<script lang="ts">
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$components/ui/dialog";
    export let open = false;
    import CardOfLoginButton from "$components/Card.LoginButton.svelte";

    export let callbackPath: string | undefined = undefined;
    export let title = "Login with...";
</script>

<Dialog {open}>
    <DialogTrigger class="w-full">
        <slot />
    </DialogTrigger>
    <DialogContent class="h-fit">
        <DialogHeader>
            <DialogTitle class="mb-5">{title}</DialogTitle>
            <DialogDescription class="grid grid-cols-2 gap-2">
                <CardOfLoginButton {callbackPath} />
            </DialogDescription>
        </DialogHeader>
    </DialogContent>
</Dialog>
