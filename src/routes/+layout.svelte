<script>
    import { browser } from "$app/environment";
    import { navigating } from "$app/stores";
    import User from "$components/User.svelte";
    import { LoadingLayout } from "$components/ui/LoadingLayout";
    import NavigationBar from "$components/ui/NavigationBar/NavigationBar.svelte";
    import { TooltipProvider } from "$components/ui/tooltip";
    import { loading } from "$lib/store";
    import "../app.postcss";

    if (browser) {
        navigating.subscribe(() => {
            $loading = $navigating ? true : false;
        });
    }
</script>

{#if $loading}
    <LoadingLayout />
{/if}

<TooltipProvider>
    <div class="flex w-full h-full max-md:flex-col">
        <User>
            <NavigationBar
                actions={[
                    { name: "Home", icon: "line-md:home-twotone", href: "/" },
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
        </User>
        <slot />
    </div>
</TooltipProvider>
