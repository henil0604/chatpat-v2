<script>
    import { browser } from "$app/environment";
    import { navigating, page } from "$app/stores";
    import User from "$components/User.svelte";
    import { LoadingLayout } from "$components/ui/LoadingLayout";
    import NavigationBar from "$components/ui/NavigationBar/NavigationBar.svelte";
    import { TooltipProvider } from "$components/ui/tooltip";
    import { ADMIN_EMAILS } from "$lib/const";
    import Store from "$lib/modules/Store";
    import System from "$lib/modules/System";
    import {
        darkMode,
        loading,
        settingsStore,
        userStore,
        userWalletBalance,
    } from "$lib/store";
    import "../app.postcss";

    page.subscribe((p) => {
        $userStore = p.data.user;

        if (browser && $userStore) {
            Store.refetchUserWalletBalance();
            Store.fetchServiceSettings();
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

    $: isAdmin = ADMIN_EMAILS.includes(user?.email || "");
</script>

{#if $loading}
    <LoadingLayout />
{/if}

{#if $settingsStore?.underMaintenance === true && !isAdmin}
    <div
        class="fixed top-0 left-0 w-screen h-screen bg-slate-950 text-white flex-center z-[999] cursor-not-allowed p-4 flex-col text-center"
    >
        <h1 class="text-2xl font-bold flex flex-wrap text-center">
            System is Under Maintenance!
        </h1>
        Please wait while we do our thing.
    </div>
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
