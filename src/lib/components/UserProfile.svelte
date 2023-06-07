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
    import { loading } from "$lib/store";
    import { signOut } from "@auth/sveltekit/client";

    const user = $page.data.user!;

    let initials = user.name
        ?.split(" ")
        .map((e) => e.charAt(0).toUpperCase())
        .join("");

    function handleSignout() {
        $loading = true;
        signOut();
    }
</script>

<Dialog>
    <DialogTrigger class="w-full">
        <Tooltip>
            <TooltipTrigger>
                <Avatar>
                    <AvatarImage src={user.image || ""} alt="" />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
                {user.name}
            </TooltipContent>
        </Tooltip>
    </DialogTrigger>
    <DialogContent class="h-fit">
        <DialogHeader>
            <DialogTitle class="mb-5">Hey {user.name}</DialogTitle>
            <DialogDescription>
                <div class="w-full h-full flex gap-5">
                    <!-- Avatar -->
                    <Avatar class="w-40 h-40">
                        <AvatarImage src={user.image || ""} alt="" />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div class="flex flex-col w-full gap-3">
                        <div class="grid w-full max-w-sm items-center gap-1.5">
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
