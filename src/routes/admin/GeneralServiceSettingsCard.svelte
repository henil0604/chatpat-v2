<script lang="ts">
    import { browser } from "$app/environment";
    import { Label } from "$components/ui/label";
    import { Switch } from "$components/ui/switch";
    import { userStore } from "$lib/store";
    import { globalChannel } from "$lib/store/pusher";
    import { trpc } from "$trpc/client";
    import type { RouterOutput } from "$trpc/router";
    import { writable } from "svelte/store";

    let settings = writable<
        NonNullable<RouterOutput["service"]["getServiceSettings"]>
    >({
        underMaintenance: false,
    });

    if (browser) {
        (async () => {
            $settings = (await trpc().service.getServiceSettings.query())!;

            settings.subscribe(async (e) => {
                if (browser) {
                    (await trpc().service.setServiceSettings.query($settings))!;
                    $globalChannel?.trigger("client-change-service-settings", {
                        changedBy: $userStore?.email,
                    });
                    console.log($settings);
                }
            });
        })();
    }
</script>

<div
    class="shadow-md p-3 rounded-md bg-slate-800 text-white w-fit h-fit flex flex-col"
>
    <h1 class="font-bold">Service Settings</h1>
    <hr class="my-3 bg-gray-800" />
    <!-- Under Maintenance -->
    <div class="flex items-center space-x-2">
        <Switch
            id="settings:underMaintenance"
            bind:rootChecked={$settings.underMaintenance}
        />
        <Label for="settings:underMaintenance">Under Maintenance</Label>
    </div>
</div>
