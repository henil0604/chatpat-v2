<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import Body from "./Body.svelte";
    import Footer from "./Footer.svelte";

    import Header from "./Header.svelte";
</script>

<div
    in:slide
    class="w-full h-full flex flex-col border rounded-md shadow-xl max-md:min-w-none max-md:w-full max-md:h-full"
>
    <Header />
    <Body />
    <Footer />
</div>
