import { IdleUpWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class ProgressBar extends Widget {
    private _track!: Rect;
    private _fill!: Rect;
    private _labelText!: Text;
    private _eventRect!: Rect;

    private posX: number = 0;
    private posY: number = 0;

    private _value: number = 0;
    private _incrementValue: number = 10;

    private _trackColor: string = "#e0e7ff";
    private _fillColor: string = "#4f46e5";
    private _borderColor: string = "#312e81";
    private _textColor: string = "#111827";

    private _onIncrement?: (value: number) => void;
    private _onStateChange?: (stateName: string) => void;

    constructor(parent: Window) {
        super(parent);

        this.width = 260;
        this.height = 34;

        this.role = RoleType.button;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get value(): number {
        return this._value;
    }

    set value(newValue: number) {
        this._value = Math.max(0, Math.min(100, newValue));
        this.update();
    }

    get progressWidth(): number {
        return this.width;
    }

    set progressWidth(newWidth: number) {
        this.width = newWidth;
        this.update();
    }

    get incrementValue(): number {
        return this._incrementValue;
    }

    set incrementValue(value: number) {
        this._incrementValue = value;
    }

    onIncrement(callback: (value: number) => void): void {
        this._onIncrement = callback;
    }

    onStateChange(callback: (stateName: string) => void): void {
        this._onStateChange = callback;
    }

    increment(amount: number = this._incrementValue): void {
        this._value = Math.max(0, Math.min(100, this._value + amount));
        this.update();

        const event = new EventArgs(this);
        this.raise(event);

        if (this._onIncrement) {
            this._onIncrement(this._value);
        }
    }

    override move(x: number, y: number): void {
        this.posX = x;
        this.posY = y;
        this.update();
    }

    private notifyStateChange(stateName: string): void {
        if (this._onStateChange) {
            this._onStateChange(stateName);
        }
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._track = this._group.rect(this.width, this.height);
        this._fill = this._group.rect(0, this.height);
        this._labelText = this._group.text("0%");

        this.outerSvg = this._group;

        this._eventRect = this._group
            .rect(this.width, this.height)
            .opacity(0)
            .attr("id", "progress-event");

        this.registerEvent(this._eventRect);

        this.update();
    }

    override update(): void {
        const fillWidth = this.width * (this._value / 100);

        this._track
            .x(this.posX)
            .y(this.posY)
            .width(this.width)
            .height(this.height)
            .radius(10)
            .fill(this._trackColor)
            .stroke({
                color: this._borderColor,
                width: 2
            });

        this._fill
            .x(this.posX)
            .y(this.posY)
            .width(fillWidth)
            .height(this.height)
            .radius(10)
            .fill(this._fillColor);

        this._labelText.text(`${this._value}%`);
        this._labelText.font({
            size: 14,
            weight: "700"
        });
        this._labelText.fill(this._textColor);
        this._labelText.x(this.posX + this.width + 12);
        this._labelText.y(this.posY + 6);

        this._eventRect
            .x(this.posX)
            .y(this.posY)
            .width(this.width)
            .height(this.height);

        super.update();
    }

    pressReleaseState(): void {
        // ProgressBar itself does not need to change value on click.
        // It is incremented by calling increment().
    }

    idleupState(): void {
        this._trackColor = "#e0e7ff";
        this._fillColor = "#4f46e5";
        this.notifyStateChange("idle");
        this.update();
    }

    idledownState(): void {
        this._trackColor = "#c7d2fe";
        this._fillColor = "#4338ca";
        this.notifyStateChange("idle down");
        this.update();
    }

    hoverState(): void {
        this._trackColor = "#c7d2fe";
        this._fillColor = "#6366f1";
        this.notifyStateChange("hover");
        this.update();
    }

    pressedState(): void {
        this._trackColor = "#a5b4fc";
        this._fillColor = "#312e81";
        this.notifyStateChange("pressed");
        this.update();
    }

    hoverPressedState(): void {
        this._trackColor = "#a5b4fc";
        this._fillColor = "#312e81";
        this.notifyStateChange("hover pressed");
        this.update();
    }

    pressedoutState(): void {
        this._trackColor = "#c7d2fe";
        this._fillColor = "#6366f1";
        this.notifyStateChange("pressed out");
        this.update();
    }

    moveState(): void {
        this.notifyStateChange("move");
        this.update();
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        this.notifyStateChange("keyup");
        this.idleupState();
    }
}

export { ProgressBar };