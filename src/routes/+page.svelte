<script lang="ts">
    import LoginButton from "$components/LoginButton.svelte";
    import User from "$components/User.svelte";
    import { SimpleTooltip } from "$components/ui/SimpleTooltip";
    import { Button } from "$components/ui/button";
    import { EMAIL_HANDLE, TWITTER_HANDLE_LINK } from "$lib/const";
    import { trpc } from "$lib/trpc/client";
    import Icon from "@iconify/svelte";
    import { fade } from "svelte/transition";
</script>

<div class="w-full h-full flex flex-col items-center py-10 pt-36 max-md:pt-28">
    <h1 class="text-8xl font-bold max-md:text-5xl">ChatPat</h1>
    <div class="my-2 max-md:my-1" />
    <h5 class="italic text-lg font-extralight max-md:text-base max-sm:text-sm">
        Flavour of Privacy
    </h5>

    <User>
        <svelte:fragment slot="signedOut">
            <div class="mt-10" />
            <LoginButton title="Pre-register with...">
                <Button size="sm">Pre-register</Button>
            </LoginButton>
        </svelte:fragment>
    </User>

    <div class="mt-10" />
    <div class="flex gap-3">
        <SimpleTooltip side="bottom" message="Twitter">
            <Button
                class="w-fit h-fit text-3xl max-md:text-2xl max-md:px-2"
                target="_blank"
                href={TWITTER_HANDLE_LINK}
                ><Icon
                    class="text-blue-500"
                    icon="line-md:twitter-twotone"
                /></Button
            >
        </SimpleTooltip>
        <SimpleTooltip side="bottom" message="Mail">
            <Button
                class="w-fit h-fit text-3xl max-md:text-2xl max-md:px-2"
                target="_blank"
                href="mailto:{EMAIL_HANDLE}"
                ><Icon
                    class="text-red-500"
                    icon="line-md:email-twotone"
                /></Button
            >
        </SimpleTooltip>
    </div>
</div>
