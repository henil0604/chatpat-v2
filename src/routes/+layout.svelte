<script>
    import { browser } from "$app/environment";
    import { navigating, page } from "$app/stores";
    import User from "$components/User.svelte";
    import { LoadingLayout } from "$components/ui/LoadingLayout";
    import NavigationBar from "$components/ui/NavigationBar/NavigationBar.svelte";
    import { TooltipProvider } from "$components/ui/tooltip";
    import Store from "$lib/modules/Store";
    import System from "$lib/modules/System";
    import {
        darkMode,
        loading,
        userStore,
        userWalletBalance,
    } from "$lib/store";
    import "../app.postcss";

    page.subscribe((p) => {
        $userStore = p.data.user;

        if (browser && $userStore) {
            Store.refetchUserWalletBalance();
        }
    });

    $: browser && System.setDarkMode($darkMode);

    $: user = $page.data.user;

    $: if (browser && $userStore) {
        System.initGlobalPusher();
    }

    if (browser) {
        navigating.subscribe(() => {
            if ($navigating) {
                $loading = true;
            }
        });
    }

    let excludedNavigationPaths = ["/onboarding", "/login", "/r", "/admin"];

    $: isNavigationExcluded = excludedNavigationPaths
        .map((e) => {
            return $page.url.pathname.startsWith(e);
        })
        .some(Boolean);
</script>

{#if $loading}
    <LoadingLayout />
{/if}

<TooltipProvider>
    <div class="flex w-full h-full max-md:flex-col">
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
                            name: "Create",
                            icon: "line-md:plus",
                            href: "/create",
                        },
                    ]}
                />
            {/if}
        </User>
        <div class="w-full min-h-full max-h-full">
            <slot />
        </div>
    </div>
</TooltipProvider>
