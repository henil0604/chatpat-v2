<script lang="ts">
    import { Button } from "$components/ui/button";
    import Icon from "@iconify/svelte";
    import { signIn } from "@auth/sveltekit/client";
    import { loading } from "$lib/store";

    export let callbackPath: string | undefined = undefined;

    function handleLogin(provider: string) {
        $loading = true;
        signIn(provider, {
            callbackUrl: callbackPath
                ? window.location.origin + callbackPath
                : undefined,
        });
    }
</script>

<Button
    on:click={() => handleLogin("github")}
    variant="outline"
    class="h-fit flex gap-3 text-lg"
>
    <Icon class="text-5xl" icon="mdi:github" />
    Github
</Button>
<Button
    on:click={() => handleLogin("google")}
    variant="outline"
    class="h-fit flex gap-3 text-lg"
>
    <Icon class="text-5xl" icon="mdi:google" />
    Google
</Button>
