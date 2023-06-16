<script lang="ts">
    import { page } from "$app/stores";
    import { Avatar, AvatarFallback, AvatarImage } from "$components/ui/avatar";
    import type System from "$lib/modules/System";
    import Chat from "./Chat.Section.Block.Body.svelte";

    export let section: ReturnType<
        (typeof System)["transformChats"]
    >[number]["sections"][number];

    const user = $page.data.user!;

    $: owner = section.owner.id === user.id;
</script>

<div class="my-2 px-5 flex {owner ? 'flex-row-reverse' : 'flex-row'}">
    <Avatar class="w-8 h-8 max-md:w-6 max-md:h-6">
        <AvatarImage
            src={section.owner.image || ""}
            alt="@{section.owner.username}"
        />
        <AvatarFallback
            >{section.owner.name
                ?.split(" ")
                .map((e) => e.charAt(0).toUpperCase())
                .join("")}</AvatarFallback
        >
    </Avatar>
    <div class="flex flex-col w-full px-2 {owner ? 'items-end' : ''}">
        {#each section.chats as chat, index}
            <Chat {section} {chat} {index} />
        {/each}
    </div>
</div>
