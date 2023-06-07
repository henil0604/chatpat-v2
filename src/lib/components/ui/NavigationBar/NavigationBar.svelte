<script lang="ts">
    import { Button } from "$components/ui/button";
    import Icon from "@iconify/svelte";
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from "$components/ui/tooltip";
    import { page } from "$app/stores";
    import User from "$components/User.svelte";
    import { signIn } from "@auth/sveltekit/client";
    import LoginButton from "$components/LoginButton.svelte";
    import UserProfile from "$components/UserProfile.svelte";

    interface Action {
        name: string;
        icon: string;
        href: string;
    }
    export let actions: Action[] = [];

    export let showTitle = true;
</script>

<!-- SideBar -->
<div class="max-md:hidden h-screen w-fit border-r">
    <div class="flex flex-col min-w-[70px] h-full justify-between">
        <!-- HEAD -->
        <div class="head h-fit">
            {#if showTitle}
                <div class="flex-center text-xl font-semibold text-center p-3">
                    ChatPat
                </div>
            {/if}
        </div>
        <!-- BODY -->
        <div class="flex-grow h-full">
            {#each actions as action}
                <Tooltip>
                    <TooltipTrigger class="w-full h-fit">
                        <Button
                            href={action.href}
                            class="w-full rounded-none py-7 text-2xl {$page.url
                                .pathname === action.href
                                ? 'bg-blue-600 text-white hover:bg-blue-600 '
                                : 'bg-secondary text-white hover:bg-secondary hover:text-secondary-foreground'}"
                        >
                            <Icon icon={action.icon} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{action.name}</TooltipContent>
                </Tooltip>
            {/each}
        </div>
        <!-- Footer -->
        <div class="h-fit flex justify-end">
            <User>
                <div class="flex-center w-full h-fit py-2">
                    <UserProfile />
                </div>

                <svelte:fragment slot="signedOut">
                    <LoginButton>
                        <Button class="w-full rounded-none py-7 text-3xl">
                            <Icon icon="material-symbols:login" />
                        </Button>
                    </LoginButton>
                </svelte:fragment>
            </User>
        </div>
    </div>
</div>

<div class="md:hidden w-full h-fit border-b">
    <div class="flex min-h-[50px] w-full justify-between">
        <!-- HEAD -->
        <div class="head w-fit h-fit">
            {#if showTitle}
                <div class="flex-center text-xl font-semibold text-center p-3">
                    ChatPat
                </div>
            {/if}
        </div>
        <!-- content -->
        <div class="flex-grow h-full" />
        <!-- footer -->
        <div class="w-fit flex items-end">
            <User>
                <div class="flex-center w-full h-fit p-2">
                    <UserProfile tooltipSide="bottom" />
                </div>

                <svelte:fragment slot="signedOut">
                    <LoginButton>
                        <Button class="w-full rounded-none py-7 text-3xl">
                            <Icon icon="material-symbols:login" />
                        </Button>
                    </LoginButton>
                </svelte:fragment>
            </User>
        </div>
    </div>
</div>
