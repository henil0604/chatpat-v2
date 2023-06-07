<script>
    import { LoadingLayout } from "$components/ui/LoadingLayout";
    import { TooltipProvider } from "$components/ui/tooltip";
    import { loading } from "$lib/store";
    import "../app.postcss";
</script>

{#if $loading}
    <LoadingLayout />
{/if}

<TooltipProvider>
    <slot />
</TooltipProvider>
