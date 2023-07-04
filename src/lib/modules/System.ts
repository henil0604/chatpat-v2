import { ProtectedRoutes } from "$lib/const";
import { userStore } from "$lib/store";
import { globalChannel, roomChannel, roomPresenceChannel } from "$lib/store/pusher";
import type { chats } from "$lib/store/room";
import CryptoJS from 'crypto-js'
import { get } from "svelte/store";
import pusher from "$lib/modules/pusher";
import ClientRoom from "./Room";
import type { PresenceChannel } from "pusher-js";

class System {
    private constructor() { }

    public static isProtectedRoute(url: string, Routes: string[] = ProtectedRoutes) {
        return Routes.some(route => {
            if (route === '*') {
                // Wildcard match - all routes are protected
                return true;
            } else if (route.endsWith('*')) {
                // Prefix wildcard match - match all routes that start with the prefix
                const prefix = route.slice(0, -1);
                return url.startsWith(prefix);
            } else if (route.startsWith('*')) {
                // Suffix wildcard match - match all routes that end with the suffix
                const suffix = route.slice(1);
                return url.endsWith(suffix);
            } else {
                // Exact match
                return url === route;
            }
        });
    }

    public static randomString(length: number, current?: string): string {
        current = current ? current : '';
        return length ? System.randomString(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
    }

    public static hash(text: string) {
        return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex)
    }

    public static encryptAES(text: string, password: string) {
        return CryptoJS.AES.encrypt(text, password).toString();
    }

    public static decryptAES(text: string, password: string) {
        return CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8);
    }

    public static isToday(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const d = date.getDate();

        const now = new Date();
        if (now.getDate() === d && now.getMonth() === month && now.getFullYear() === year) {
            return true;
        }

        return false;
    }

    public static transformChats(chats: chats) {
        interface block {
            label: string,
            sections: section[]
        }
        interface section {
            owner: FlatArray<chats, 1>["owner"],
            chats: chats
        }

        let blocks: block[] = [];

        chats.forEach(chat => {
            const label = System.isToday(new Date(chat.createdAt)) ? "Today" : new Date(chat.createdAt).toDateString()
            let block = blocks.find(b => b.label === label);

            if (!block) {
                block = {
                    label,
                    sections: []
                }
                blocks.push(block);
            }

            let sectionIndex = block.sections.findLastIndex(s => s.owner.id === chat.owner.id);
            let section = block.sections[sectionIndex];
            let nextSection = block.sections[sectionIndex + 1];
            if (!section || (nextSection && nextSection.owner.id != section.owner.id)) {
                section = { owner: chat.owner, chats: [] };
                block.sections.push(section);
            }

            section.chats.push(chat);
        });

        return blocks
    }

    public static playNotificationAudio() {
        let audio = new Audio('/audio/ding.mp3');
        audio.volume = 0.5;
        audio.play();
    }

    public static initGlobalPusher() {
        if (get(globalChannel)) {
            get(globalChannel)?.disconnect();
            globalChannel.set(null);
        }

        const gc = pusher.subscribe("private-global");

        gc.bind("pusher:subscription_succeeded", () => {
            console.log(`Subscribed to global channel`)
        })

        gc.bind("pusher:subscription_error", console.error);

        (window as any).globalChannel = gc;
        globalChannel.set(gc);
    }

    public static initRoomPusher(roomName: string) {
        let returnPromises = [];

        returnPromises[0] = new Promise(resolve => {

            if (get(roomChannel)) {
                get(roomChannel)?.disconnect();
                roomChannel.set(null);
            }

            const rc = pusher.subscribe(`private-r-${roomName}`);

            rc.bind("pusher:subscription_succeeded", () => {
                ClientRoom.onSubscriptionSucceeded(roomName)
                resolve(true);
            })

            rc.bind("pusher:subscription_error", console.error)

            rc.bind('client-new-chat', ClientRoom.newChatHandler);
            rc.bind('client-chat-unsend', ClientRoom.chatUnsendHandler);
            rc.bind('client-typing-start', ClientRoom.typingStartHandler);
            rc.bind('client-typing-stop', ClientRoom.typingStopHandler);

            rc.bind("pusher:disconnected", () => {
                ClientRoom.onDisconnect(roomName);
            });

            (window as any).roomChannel = rc;
            roomChannel.set(rc);
        })

        returnPromises[1] = new Promise(resolve => {
            // Presence Channel Setup
            const rpc = pusher.subscribe(`presence-r-${roomName}`) as PresenceChannel;

            rpc.bind("pusher:subscription_succeeded", () => {
                ClientRoom.onPresenceChannelSubscriptionSucceeded(roomName);
                resolve(true);
            });
            rpc.bind("pusher:member_added", ClientRoom.userJoinHandler);
            rpc.bind("pusher:member_removed", ClientRoom.userLeaveHandler);

            (window as any).roomPresenceChannel = rpc;
            roomPresenceChannel.set(rpc);
        })

        return returnPromises
    }

    public static setDarkMode(value: boolean) {
        let html = document.querySelector("html");
        if (!html) return value;
        // setting dark mode
        if (value) {
            html.classList.add("dark");
        }

        // setting light mode
        if (!value) {
            html.classList.remove("dark");
        }

        return value;
    }

    public static copyTextToClipboard(text: string) {
        function fallbackCopyTextToClipboard(text: string) {
            var textArea = document.createElement("textarea");
            textArea.value = text;

            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }

            document.body.removeChild(textArea);
        }
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            console.log('Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

}

export default System;