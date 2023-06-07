<script>
    import {
        Tooltip,
        TooltipTrigger,
        TooltipContent,
    } from "$components/ui/tooltip";
    export let message = "";
    export let side = "top";
</script>

<Tooltip>
    <TooltipTrigger class="w-full h-fit">
        <slot />
    </TooltipTrigger>
    <TooltipContent {side}>{message}</TooltipContent>
</Tooltip>
