<script lang="ts">
    import { browser } from "$app/environment";
    import { loading } from "$lib/store";

    if (browser) {
        $loading = false;
    }
</script>

<div class="p-5">Rooms</div>
