<script>
    import { browser } from "$app/environment";
    import { navigating, page } from "$app/stores";
    import User from "$components/User.svelte";
    import { LoadingLayout } from "$components/ui/LoadingLayout";
    import NavigationBar from "$components/ui/NavigationBar/NavigationBar.svelte";
    import { TooltipProvider } from "$components/ui/tooltip";
    import Store from "$lib/modules/Store";
    import { loading, userWalletBalance } from "$lib/store";
    import "../app.postcss";

    if (browser) {
        navigating.subscribe(() => {
            $loading = $navigating ? true : false;
        });
    }

    if (browser) {
        Store.refetchUserWalletBalance();
    }

    let excludedNavigationPaths = ["/onboarding", "/login"];

    $: isNavigationExcluded = excludedNavigationPaths.includes(
        $page.url.pathname
    );
</script>

{#if $loading}
    <LoadingLayout />
{/if}

<TooltipProvider>
    <div class="flex max-w-screen max-h-screen max-md:flex-col">
        <User>
            {#if isNavigationExcluded === false}
                <NavigationBar
                    actions={[
                        {
                            name: "Home",
                            icon: "line-md:home-twotone",
                            href: "/",
                        },
                        {
                            name: "Explore",
                            icon: "ic:twotone-explore",
                            href: "/explore",
                        },
                        {
                            name: "Create",
                            icon: "line-md:plus",
                            href: "/create",
                        },
                    ]}
                />
            {/if}
        </User>
        <div class="w-full min-h-full overflow-y-auto">
            <slot />
        </div>
    </div>
</TooltipProvider>
