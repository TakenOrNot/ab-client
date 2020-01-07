import { FLAGS_CODE_TO_ISO } from "../../ab-protocol/src/lib";
import { BrowserContext } from "../browser-context";
import { Renderer } from "../renderers/renderer";
import { ChatInput } from "./chat-input";

export class PlayerDropDownMenu {
    private readonly menu: HTMLDivElement;
    private readonly menuTitle: HTMLDivElement;

    private currentId: number;
    private currentName: string;

    constructor(private context: BrowserContext, private chatInput: ChatInput, private renderer: Renderer) {
        this.menu = document.getElementById("player-context-menu") as HTMLDivElement;
        this.menuTitle = document.getElementById("menu-title") as HTMLDivElement;

        // add handlers
        const items = this.menu.getElementsByClassName("menu-item");
        for (const item of items) {
            item.addEventListener("click", () => this.onMenuItemClicked(item));
        }
    }

    public show(x: number, y: number, id: string, name: string) {
        this.menu.style.left = x + "px";
        this.menu.style.top = y + "px";
        this.menu.style.display = "block";

        this.menuTitle.innerText = decodeURI(name);
        this.currentId = Number(id);
        this.currentName = name;
    }

    public hide() {
        this.menu.style.display = "none";
    }

    private onMenuItemClicked(item: Element) {
        this.hide();

        const player = this.context.state.getPlayerById(this.currentId);

        if (!player || player.name === "Server") {
            return;
        }

        switch (item.id) {
            case "menu-flag":
                this.context.connection.sendCommand("flag", FLAGS_CODE_TO_ISO["" + player.flag]);
                break;

            case "menu-whisper":
                this.chatInput.startChat(`/w ${this.currentName} `);
                break;

            case "menu-ignore":
                this.renderer.ignorePlayer(player.id);
                this.renderer.addMessageToPlayer("Player chats will be ignored for player " + player.name);
                break;

            case "menu-unignore":
                this.renderer.unignorePlayer(player.id);
                this.renderer.addMessageToPlayer("Removed player from the ignore list.");
                break;

            case "menu-votemute":
                this.context.connection.voteMute(player.id);
                this.renderer.addMessageToPlayer("You have voted to mute player " + player.name);
                break;

            case "menu-locate":
                this.renderer.highlightPlayerOnMinimap(player.id);
                break;

        }
    }

}