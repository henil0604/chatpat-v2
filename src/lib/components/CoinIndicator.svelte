<script lang="ts">
    import Icon from "@iconify/svelte";

    let divRef: HTMLDivElement;

    export function animateDiff(amount: number) {
        let classes =
            amount > 0
                ? ["bg-lime-300", "text-black"]
                : ["bg-red-500", "text-black"];
        divRef.classList.add(...classes);

        setTimeout(() => {
            divRef.classList.remove(...classes);
        }, 300);
    }

    export let amount = 0;
</script>

<div
    bind:this={divRef}
    class="py-1 px-1 shadow-md border rounded-md flex-center gap-1 w-fit h-fit text-sm"
>
    {amount}
    <Icon class="h-fit w-fit" icon="openmoji:coin" />
</div>
