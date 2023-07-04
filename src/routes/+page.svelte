<script lang="ts">
    import User from "$components/User.svelte";
    import { onMount } from "svelte";
    import Dashboard from "./Dashboard.svelte";
    import LandingPageContent from "./LandingPageContent.svelte";
    import { loading } from "$lib/store";

    onMount(() => {
        $loading = false;
    });
</script>

<User let:user>
    <Dashboard />
    <svelte:fragment slot="signedOut">
        <LandingPageContent />
    </svelte:fragment>
</User>
