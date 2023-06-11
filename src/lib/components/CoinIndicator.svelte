<script>
    import Icon from "@iconify/svelte";

    export let amount = 0;
</script>

<div class="py-1 px-2 border rounded-md flex-center gap-1 w-fit h-fit">
    {amount}
    <Icon class="h-fit w-fit" icon="openmoji:coin" />
</div>
