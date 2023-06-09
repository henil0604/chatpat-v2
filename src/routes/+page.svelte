<script lang="ts">
    import User from "$components/User.svelte";
    import Dashboard from "./Dashboard.svelte";
    import LandingPageContent from "./LandingPageContent.svelte";
</script>

<User let:user>
    <Dashboard />
    <svelte:fragment slot="signedOut">
        <LandingPageContent />
    </svelte:fragment>
</User>
