import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class StarRating extends Widget {
    private _stars: Text[] = [];
    private _eventRects: Rect[] = [];

    private posX: number = 0;
    private posY: number = 0;

    private _rating: number = 0;
    private _starCount: number = 5;
    private _pressedIndex: number = -1;

    private _fontSize: number = 32;
    private _activeColor: string = "#4f46e5";
    private _inactiveColor: string = "#c7d2fe";

    private _onChange?: (rating: number) => void;

    constructor(parent: Window, starCount: number = 5) {
        super(parent);

        this._starCount = Math.max(3, starCount);
        this.width = this._starCount * 38;
        this.height = 42;

        this.role = RoleType.button;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get rating(): number {
        return this._rating;
    }

    set rating(value: number) {
        this._rating = Math.max(0, Math.min(this._starCount, value));
        this.update();
    }

    onChange(callback: (rating: number) => void): void {
        this._onChange = callback;
    }

    override move(x: number, y: number): void {
        this.posX = x;
        this.posY = y;
        this.update();
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        for (let i = 0; i < this._starCount; i++) {
            let star = this._group.text("☆");
            this._stars.push(star);

            let eventRect = this._group
                .rect(36, 42)
                .opacity(0)
                .attr("id", `star-${i}`);

            eventRect.on("mousedown", () => {
                this._pressedIndex = i;
            });

            this._eventRects.push(eventRect);
            this.registerEvent(eventRect);
        }

        this.update();
    }

    override update(): void {
        for (let i = 0; i < this._starCount; i++) {
            let filled = i < this._rating;

            this._stars[i].text(filled ? "★" : "☆");
            this._stars[i].font({
                size: this._fontSize,
                weight: "700"
            });
            this._stars[i].fill(filled ? this._activeColor : this._inactiveColor);
            this._stars[i].x(this.posX + i * 38);
            this._stars[i].y(this.posY);

            this._eventRects[i]
                .x(this.posX + i * 38)
                .y(this.posY)
                .width(36)
                .height(42);
        }

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState && this._pressedIndex !== -1) {
            this._rating = this._pressedIndex + 1;
            this.update();

            const event = new EventArgs(this);
            this.raise(event);

            if (this._onChange) {
                this._onChange(this._rating);
            }

            this._pressedIndex = -1;
        }
    }

    idleupState(): void {
        this._activeColor = "#4f46e5";
        this._inactiveColor = "#c7d2fe";
        this.update();
    }

    idledownState(): void {
        this._activeColor = "#4338ca";
        this._inactiveColor = "#a5b4fc";
        this.update();
    }

    hoverState(): void {
        this._activeColor = "#6366f1";
        this._inactiveColor = "#a5b4fc";
        this.update();
    }

    pressedState(): void {
        this._activeColor = "#312e81";
        this._inactiveColor = "#818cf8";
        this.update();
    }

    hoverPressedState(): void {
        this._activeColor = "#312e81";
        this._inactiveColor = "#818cf8";
        this.update();
    }

    pressedoutState(): void {
        this._activeColor = "#6366f1";
        this._inactiveColor = "#a5b4fc";
        this.update();
    }

    moveState(): void {
        this.update();
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        this.idleupState();
    }
}

export { StarRating };