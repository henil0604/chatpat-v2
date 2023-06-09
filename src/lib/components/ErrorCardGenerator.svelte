<script lang="ts">
    import { AlertCircle } from "lucide-svelte";
    import { Alert, AlertDescription, AlertTitle } from "$components/ui/alert";

    export let error: any | null | undefined;
</script>

{#if error}
    <Alert variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>{error.title}</AlertTitle>
        <AlertDescription>
            {error.message}
        </AlertDescription>
    </Alert>
{/if}
