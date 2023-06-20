<script lang="ts">
    import { page } from "$app/stores";
    import { Avatar, AvatarFallback, AvatarImage } from "$components/ui/avatar";
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from "$components/ui/tooltip";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$components/ui/dialog";
    import { Input } from "$components/ui/input";
    import { Label } from "$components/ui/label";
    import { Button } from "$components/ui/button";
    import { Switch } from "$components/ui/switch";

    import { darkMode, loading } from "$lib/store";
    import { signOut } from "@auth/sveltekit/client";
    import UserWalletBalanceIndicator from "$components/UserWalletBalanceIndicator.svelte";

    const user = $page.data.user!;

    let initials = user.name
        ?.split(" ")
        .map((e) => e.charAt(0).toUpperCase())
        .join("");

    function handleSignout() {
        $loading = true;
        signOut();
    }

    export let tooltipSide = "right";

    export let avatarSize = 8;
</script>

<Dialog>
    <DialogTrigger class="w-full">
        <Tooltip>
            <TooltipTrigger>
                <Avatar class="w-{avatarSize} h-{avatarSize}">
                    <AvatarImage src={user.image || ""} alt="" />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>
                {user.name}
            </TooltipContent>
        </Tooltip>
    </DialogTrigger>
    <DialogContent class="h-fit max-sm:h-full max-md:w-full shadow-xl">
        <DialogHeader>
            <DialogTitle class="mb-5 text-left"
                >Hey, <span class="highlight">{user.name}</span></DialogTitle
            >
            <DialogDescription>
                <div
                    class="w-full h-full flex gap-5 max-md:flex-col max-md:items-center"
                >
                    <!-- Avatar -->
                    <Avatar class="w-40 h-40">
                        <AvatarImage src={user.image || ""} alt="" />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div class="flex [&>div]:items-start flex-col w-full gap-3">
                        <div class="flex flex-col w-full gap-1.5">
                            <Label for="username">Username</Label>
                            <Input
                                disabled
                                readonly
                                type="text"
                                id="username"
                                placeholder="username"
                                class="w-full"
                                value={user.username}
                            />
                        </div>
                        <div class="flex flex-col w-full gap-1.5">
                            <Label for="email">Email</Label>
                            <Input
                                disabled
                                readonly
                                type="email"
                                id="email"
                                placeholder="email"
                                class="w-full"
                                value={user.email}
                            />
                        </div>

                        <div class="my-1 flex items-center space-x-2">
                            <Switch
                                bind:rootChecked={$darkMode}
                                id="dark-mode"
                            />
                            <Label for="dark-mode">Dark Mode</Label>
                        </div>

                        <UserWalletBalanceIndicator />

                        <div class="mt-3" />
                        <Button
                            on:click={handleSignout}
                            class="w-fit"
                            variant="destructive">Logout</Button
                        >
                    </div>
                </div>
            </DialogDescription>
        </DialogHeader>
    </DialogContent>
</Dialog>
