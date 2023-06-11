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
    import { fly, slide } from "svelte/transition";
    import UserWalletBalanceIndicator from "$components/UserWalletBalanceIndicator.svelte";

    interface Action {
        name: string;
        icon: string;
        href: string;
    }
    export let actions: Action[] = [];

    export let showTitle = true;

    let isDrawerOpen = false;
</script>

<!-- SideBar -->
<div class="max-md:hidden h-screen max-h-screen w-fit border-r">
    <div class="flex flex-col w-[70px] h-full justify-between">
        <!-- HEAD -->
        <div class="head h-fit">
            {#if showTitle}
                <div class="flex-center text-xl font-semibold text-center p-3">
                    <Icon icon="ph:chat-teardrop-dots-duotone" />
                </div>
            {/if}
        </div>
        <!-- BODY -->
        <div class="flex-grow h-full overflow-y-auto">
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
        <div class="h-fit flex flex-col items-center justify-end">
            <User let:user>
                <UserWalletBalanceIndicator />

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

<!-- Mobile Bar -->
<div class="md:hidden w-full h-fit border-b">
    <div class="flex min-h-[50px] w-full justify-between">
        <!-- HEAD -->
        <div class="w-fit h-full">
            {#if showTitle}
                <div
                    class="flex-center h-full text-xl font-semibold text-center p-3"
                >
                    <Icon icon="ph:chat-teardrop-dots-duotone" />
                </div>
            {/if}
        </div>
        <!-- content -->
        <div class="flex-grow h-full" />
        <!-- footer -->
        <div class="w-fit flex-center gap-1 px-2">
            <User let:user>
                <UserWalletBalanceIndicator />
            </User>

            <Button
                on:click={() => (isDrawerOpen = !isDrawerOpen)}
                size="sm"
                class="text-3xl px-1.5"
            >
                <Icon icon="line-md:menu" />
            </Button>
        </div>
    </div>
</div>

<!-- Drawer -->
{#if isDrawerOpen}
    <!-- Wrapper -->
    <div
        class="fixed inset-0 z-[49] w-full h-full max-h-screen backdrop-blur-sm p-4"
    >
        <!-- Drawer -->
        <div
            in:fly={{ x: -300 }}
            out:fly={{ x: 300 }}
            class="bg-secondary w-full h-full rounded-md flex flex-col justify-between"
        >
            <!-- Header -->
            <div class="flex justify-between p-2 px-4 pb-5">
                <!-- Title -->
                <div class="text-3xl font-semibold">ChatPat</div>
                <!-- Close -->
                <Button
                    on:click={() => (isDrawerOpen = false)}
                    size="sm"
                    variant="outline"
                    class="text-3xl px-1.5"
                >
                    <Icon icon="line-md:close" />
                </Button>
            </div>
            <hr />
            <!-- Content -->
            <div class="flex-grow overflow-y-auto">
                {#each actions as action}
                    <Button
                        on:click={() => (isDrawerOpen = false)}
                        href={action.href}
                        class="flex justify-start gap-3 w-full rounded-none py-7 text-xl {$page
                            .url.pathname === action.href
                            ? 'bg-blue-600 text-white hover:bg-blue-600 '
                            : 'bg-secondary text-white hover:bg-secondary hover:text-secondary-foreground'}"
                    >
                        <Icon icon={action.icon} />
                        {action.name}
                    </Button>
                {/each}
            </div>

            <!-- Footer -->
            <hr />
            <div>
                <User let:user>
                    <div class="flex justify-end w-full h-fit p-2">
                        <div class="contents [&>*]:w-fit">
                            <UserProfile tooltipSide="bottom" />
                        </div>
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
{/if}
