<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import Body from "./Body.svelte";
    import Footer from "./Footer.svelte";

    import Header from "./Header.svelte";
    import {
        getChat,
        recentAlert,
        replyChatId,
        showMembers,
        typingUsers,
    } from "$lib/store/room";
    import Icon from "@iconify/svelte";
    import { Button } from "$components/ui/button";
</script>

<div
    in:slide
    class="w-full h-full flex flex-col border rounded-md shadow-xl max-md:min-w-none max-md:w-full max-md:h-full"
>
    <Header />
    {#if $recentAlert.length > 0}
        <div
            in:slide
            out:slide
            class="w-full backdrop-blur-md h-fit py-1 text-[13px] bg-slate-900 text-center text-white shadow-lg"
        >
            {$recentAlert}
        </div>
    {/if}
    <Body />
    {#if $typingUsers.length > 0}
        <div
            in:slide
            out:slide
            class="w-fit rounded-t-md backdrop-blur-md h-fit px-2 py-1 text-[13px] bg-slate-900 text-white shadow-lg flex items-center"
        >
            <Icon icon="svg-spinners:3-dots-bounce" class="mr-2" />
            <span class="italic mr-1">{$typingUsers.join(", ")}</span>
            {$typingUsers.length > 1 ? "are" : "is"} typing...
        </div>
    {/if}
    {#if $replyChatId}
        {@const { chat } = getChat($replyChatId)}
        <!-- wrapper -->
        <div in:slide out:slide class="w-full h-fit flex justify-end">
            <!-- reply box -->
            <div
                class="w-fit h-fit border shadow-lg p-3 rounded-l-md flex flex-col"
            >
                <!-- header -->
                <div class="flex justify-between">
                    <div class="text-xs">
                        Replying to <span class="italic"
                            >@{chat?.owner.username}</span
                        >
                    </div>
                    <Button
                        on:click={() => ($replyChatId = null)}
                        size="sm"
                        class="h-full p-1 ml-12"
                    >
                        <Icon icon="mdi:close" />
                    </Button>
                </div>
                <div>
                    {chat?.content}
                </div>
            </div>
        </div>
    {/if}
    <Footer />
</div>
