<script lang="ts">
    import { Spinner } from "$components/ui/Spinner";

    export let size = 40;
</script>

<div
    class="flex-center absolute top-0 left-0 backdrop-blur-sm z-[999999] w-full h-full"
>
    <Spinner {size} />
</div>
