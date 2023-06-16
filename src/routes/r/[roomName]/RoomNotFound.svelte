<script lang="ts">
    import { Button } from "$components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$components/ui/card";
</script>

<Card
    class="w-[400px] max-md:w-full max-md:h-full max-md:rounded-none max-md:border-none"
>
    <CardHeader>
        <CardTitle>Room not found</CardTitle>
        <CardDescription>404</CardDescription>
    </CardHeader>
    <CardContent>
        <blockquote class="border-l-2 pl-4 flex gap-2 items-center">
            Unfortunately! The Room you are trying to access does not exists in
            ChatPat Servers!
        </blockquote>
        <div class="my-3" />
        <blockquote class="border-l-2 pl-4 flex gap-2 items-center">
            If you think this is mistake, please consider notifying us about
            this issue.
        </blockquote>
    </CardContent>
    <CardFooter class="flex-center mt-3">
        <Button href="/">Go to Dashboard</Button>
    </CardFooter>
</Card>
