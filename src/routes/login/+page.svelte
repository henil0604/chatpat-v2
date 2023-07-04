<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import CardOfLoginButton from "$components/Card.LoginButton.svelte";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$components/ui/card";
    import { loading } from "$lib/store";
    import { onMount } from "svelte";

    const url = $page.url.searchParams.get("redirectTo") || "/";

    if (browser && $page?.data?.user) {
        goto(url);
    }

    onMount(() => {
        $loading = false;
    });
</script>

<div class="w-full min-h-screen flex-center">
    <Card>
        <CardHeader>
            <CardTitle>Login With...</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="flex gap-2">
                <CardOfLoginButton />
            </div>
        </CardContent>
    </Card>
</div>
