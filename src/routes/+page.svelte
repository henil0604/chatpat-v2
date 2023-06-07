<script lang="ts">
    import NavigationBar from "$components/ui/NavigationBar/NavigationBar.svelte";
    import { Button } from "$components/ui/button";
    import { trpc } from "$lib/trpc/client";
</script>

<NavigationBar
    actions={[
        { name: "Pre-register", icon: "mdi:register", href: "/pre-register" },
    ]}
/>
