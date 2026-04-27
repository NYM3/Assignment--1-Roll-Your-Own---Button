import { IdleUpWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class ScrollBar extends Widget {
    private _upButton!: Rect;
    private _downButton!: Rect;
    private _track!: Rect;
    private _thumb!: Rect;

    private _upText!: Text;
    private _downText!: Text;

    private _upEvent!: Rect;
    private _downEvent!: Rect;
    private _trackEvent!: Rect;

    private posX: number = 0;
    private posY: number = 0;

    private _scrollHeight: number = 240;
    private _thumbPosition: number = 0;

    private buttonSize: number = 36;
    private thumbHeight: number = 44;
    private barWidth: number = 42;

    private _trackColor: string = "#e0e7ff";
    private _buttonColor: string = "#4f46e5";
    private _thumbColor: string = "#6366f1";
    private _borderColor: string = "#312e81";

    private _onMove?: (position: number, direction: string) => void;

    constructor(parent: Window) {
        super(parent);

        this.width = this.barWidth;
        this.height = this._scrollHeight;
        this.role = RoleType.button;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get scrollHeight(): number {
        return this._scrollHeight;
    }

    set scrollHeight(value: number) {
        this._scrollHeight = Math.max(140, value);
        this.height = this._scrollHeight;
        this.update();
    }

    get thumbPosition(): number {
        return this._thumbPosition;
    }

    onMove(callback: (position: number, direction: string) => void): void {
        this._onMove = callback;
    }

    override move(x: number, y: number): void {
        this.posX = x;
        this.posY = y;
        this.update();
    }

    private get trackTop(): number {
        return this.posY + this.buttonSize;
    }

    private get trackHeight(): number {
        return this._scrollHeight - this.buttonSize * 2;
    }

    private get maxThumbTravel(): number {
        return this.trackHeight - this.thumbHeight;
    }

    private notifyMove(direction: string): void {
        const event = new EventArgs(this);
        this.raise(event);

        if (this._onMove) {
            this._onMove(this._thumbPosition, direction);
        }
    }

    private setThumbPosition(value: number, direction: string): void {
        const oldPosition = this._thumbPosition;

        this._thumbPosition = Math.max(0, Math.min(100, value));
        this.update();

        if (this._thumbPosition !== oldPosition) {
            this.notifyMove(direction);
        }
    }

    private moveThumbBy(delta: number, direction: string): void {
        this.setThumbPosition(this._thumbPosition + delta, direction);
    }

    private jumpToTrackClick(event: MouseEvent): void {
        const svgNode = (this.parent as Window).window.node as SVGSVGElement;
        const svgTop = svgNode.getBoundingClientRect().top;
        const clickY = event.clientY - svgTop;

        let localY = clickY - this.trackTop - this.thumbHeight / 2;
        let percent = (localY / this.maxThumbTravel) * 100;

        let direction = percent > this._thumbPosition ? "down by track" : "up by track";
        this.setThumbPosition(percent, direction);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._upButton = this._group.rect(this.barWidth, this.buttonSize);
        this._downButton = this._group.rect(this.barWidth, this.buttonSize);
        this._track = this._group.rect(this.barWidth, this.trackHeight);
        this._thumb = this._group.rect(this.barWidth - 10, this.thumbHeight);

        this._upText = this._group.text("▲");
        this._downText = this._group.text("▼");

        this.outerSvg = this._group;

        this._upEvent = this._group.rect(this.barWidth, this.buttonSize).opacity(0).attr("id", "scroll-up");
        this._downEvent = this._group.rect(this.barWidth, this.buttonSize).opacity(0).attr("id", "scroll-down");
        this._trackEvent = this._group.rect(this.barWidth, this.trackHeight).opacity(0).attr("id", "scroll-track");

        this._upEvent.on("click", () => {
            this.moveThumbBy(-10, "up button");
        });

        this._downEvent.on("click", () => {
            this.moveThumbBy(10, "down button");
        });

        this._trackEvent.on("click", (event: MouseEvent) => {
            this.jumpToTrackClick(event);
        });

        this.registerEvent(this._upEvent);
        this.registerEvent(this._downEvent);
        this.registerEvent(this._trackEvent);

        this.update();
    }

    override update(): void {
        const thumbY = this.trackTop + (this.maxThumbTravel * this._thumbPosition / 100);

        this._upButton
            .x(this.posX)
            .y(this.posY)
            .width(this.barWidth)
            .height(this.buttonSize)
            .radius(8)
            .fill(this._buttonColor)
            .stroke({ color: this._borderColor, width: 2 });

        this._downButton
            .x(this.posX)
            .y(this.posY + this._scrollHeight - this.buttonSize)
            .width(this.barWidth)
            .height(this.buttonSize)
            .radius(8)
            .fill(this._buttonColor)
            .stroke({ color: this._borderColor, width: 2 });

        this._track
            .x(this.posX)
            .y(this.trackTop)
            .width(this.barWidth)
            .height(this.trackHeight)
            .fill(this._trackColor)
            .stroke({ color: this._borderColor, width: 2 });

        this._thumb
            .x(this.posX + 5)
            .y(thumbY)
            .width(this.barWidth - 10)
            .height(this.thumbHeight)
            .radius(8)
            .fill(this._thumbColor)
            .stroke({ color: this._borderColor, width: 1 });

        this._upText.text("▲");
        this._upText.font({ size: 16, weight: "700" });
        this._upText.fill("#ffffff");
        this._upText.x(this.posX + 11);
        this._upText.y(this.posY + 6);

        this._downText.text("▼");
        this._downText.font({ size: 16, weight: "700" });
        this._downText.fill("#ffffff");
        this._downText.x(this.posX + 11);
        this._downText.y(this.posY + this._scrollHeight - this.buttonSize + 6);

        this._upEvent
            .x(this.posX)
            .y(this.posY)
            .width(this.barWidth)
            .height(this.buttonSize);

        this._downEvent
            .x(this.posX)
            .y(this.posY + this._scrollHeight - this.buttonSize)
            .width(this.barWidth)
            .height(this.buttonSize);

        this._trackEvent
            .x(this.posX)
            .y(this.trackTop)
            .width(this.barWidth)
            .height(this.trackHeight);

        super.update();
    }

    pressReleaseState(): void {
        // Movement is handled by the up, down, and track click handlers.
    }

    idleupState(): void {
        this._buttonColor = "#4f46e5";
        this._thumbColor = "#6366f1";
        this._trackColor = "#e0e7ff";
        this.update();
    }

    idledownState(): void {
        this._buttonColor = "#4338ca";
        this._thumbColor = "#4f46e5";
        this._trackColor = "#c7d2fe";
        this.update();
    }

    hoverState(): void {
        this._buttonColor = "#6366f1";
        this._thumbColor = "#818cf8";
        this._trackColor = "#c7d2fe";
        this.update();
    }

    pressedState(): void {
        this._buttonColor = "#312e81";
        this._thumbColor = "#4f46e5";
        this._trackColor = "#a5b4fc";
        this.update();
    }

    hoverPressedState(): void {
        this._buttonColor = "#312e81";
        this._thumbColor = "#4f46e5";
        this._trackColor = "#a5b4fc";
        this.update();
    }

    pressedoutState(): void {
        this._buttonColor = "#6366f1";
        this._thumbColor = "#818cf8";
        this._trackColor = "#c7d2fe";
        this.update();
    }

    moveState(): void {
        this.update();
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        this.idleupState();
    }
}

export { ScrollBar };