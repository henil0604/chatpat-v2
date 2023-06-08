<script>
    import { browser } from "$app/environment";
    import { navigating } from "$app/stores";
    import { LoadingLayout } from "$components/ui/LoadingLayout";
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
    <slot />
</TooltipProvider>
