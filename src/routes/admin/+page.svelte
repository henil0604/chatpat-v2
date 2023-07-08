<script lang="ts">
    import { browser } from "$app/environment";
    import { loading } from "$lib/store";
    import GeneralServiceSettingsCard from "./GeneralServiceSettingsCard.svelte";

    if (browser) {
        $loading = false;
    }
</script>

<div class="flex flex-wrap p-5">
    <!-- General Service Settings -->
    <GeneralServiceSettingsCard />
</div>
