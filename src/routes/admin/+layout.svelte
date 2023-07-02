<script>
    import { NavigationBar } from "$components/ui/NavigationBar";
</script>

<div class="w-full h-full flex max-md:flex-col">
    <NavigationBar
        actions={[
            {
                name: "Dashboard",
                icon: "material-symbols:dashboard",
                href: "/admin",
            },
            {
                name: "Rooms",
                icon: "material-symbols:meeting-room",
                href: "/admin/rooms",
            },
        ]}
    />

    <slot />
</div>
