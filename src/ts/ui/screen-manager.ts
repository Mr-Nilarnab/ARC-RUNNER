import type { AppState } from "@/ts/core/types/app.types";
import type { DomElements } from "@/ts/ui/dom-elements";

export class ScreenManager {
    private currentScreen: AppState = "boot";

    public constructor(private readonly dom: DomElements) {}

    public getCurrentScreen(): AppState {
        return this.currentScreen;
    }

    public showScreen(name: AppState): void {
        this.currentScreen = name;

        const { screens, hudTop, hudBottom } = this.dom;
        screens.boot.classList.toggle("screen--active", name === "boot");
        screens.menu.classList.toggle("screen--active", name === "menu");
        screens.exit.classList.toggle("screen--active", name === "exit");
        screens.game.classList.toggle("screen--active", name === "game");

        hudTop.classList.toggle("hud__top--in-game", name === "game");
        hudBottom.classList.toggle("hud__bottom--show", name === "game");
    }
}
