import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class RadioButton extends Widget {
    private _outerButtons: Rect[] = [];
    private _innerDots: Rect[] = [];
    private _labelTexts: Text[] = [];
    private _eventRects: Rect[] = [];

    private _labels: string[];
    private _selectedIndex: number = 0;
    private _pressedIndex: number = -1;

    private _fontSize: number = 16;
    private _accentColor: string = "#4f46e5";
    private _borderColor: string = "#4f46e5";
    private _textColor: string = "#111827";

    private _onChange?: (index: number, label: string) => void;

    private optionHeight: number = 36;
    private circleSize: number = 22;

    private posX: number = 0;
    private posY: number = 0;

    constructor(parent: Window, labels: string[] = ["Option 1", "Option 2"]) {
        super(parent);

        this._labels = labels.length >= 2 ? labels : ["Option 1", "Option 2"];

        this.width = 240;
        this.height = this._labels.length * this.optionHeight;

        this.role = RoleType.button;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get label(): string[] {
        return this._labels;
    }

    set label(values: string[]) {
        if (values.length >= 2) {
            this._labels = values;
            this.height = this._labels.length * this.optionHeight;
            this.update();
        }
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(index: number) {
        if (index >= 0 && index < this._labels.length) {
            this._selectedIndex = index;
            this.update();
        }
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    onChange(callback: (index: number, label: string) => void): void {
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

        for (let i = 0; i < this._labels.length; i++) {
            let outer = this._group.rect(this.circleSize, this.circleSize);
            outer.radius(this.circleSize / 2);
            this._outerButtons.push(outer);

            let dot = this._group.rect(10, 10);
            dot.radius(5);
            this._innerDots.push(dot);

            let labelText = this._group.text(this._labels[i]);
            this._labelTexts.push(labelText);

            let eventRect = this._group
                .rect(this.width, this.optionHeight)
                .opacity(0)
                .attr("id", `radio-${i}`);

            eventRect.on("mousedown", () => {
                this._pressedIndex = i;
            });

            this._eventRects.push(eventRect);
            this.registerEvent(eventRect);
        }

        this.update();
    }

    override update(): void {
        for (let i = 0; i < this._labels.length; i++) {
            let localY = i * this.optionHeight;
            let checked = i === this._selectedIndex;

            this._outerButtons[i]
                .x(this.posX)
                .y(this.posY + localY + 5)
                .width(this.circleSize)
                .height(this.circleSize)
                .radius(this.circleSize / 2)
                .fill("#ffffff")
                .stroke({
                    color: checked ? this._accentColor : this._borderColor,
                    width: 2
                });

            this._innerDots[i]
                .x(this.posX + 6)
                .y(this.posY + localY + 11)
                .width(10)
                .height(10)
                .radius(5)
                .fill(checked ? this._accentColor : "#ffffff");

            this._labelTexts[i]
                .text(this._labels[i])
                .font({ size: this._fontSize })
                .fill(this._textColor)
                .x(this.posX + 36)
                .y(this.posY + localY + 5);

            this._eventRects[i]
                .x(this.posX)
                .y(this.posY + localY)
                .width(this.width)
                .height(this.optionHeight);
        }

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState && this._pressedIndex !== -1) {
            if (this._selectedIndex !== this._pressedIndex) {
                this._selectedIndex = this._pressedIndex;
                this.update();

                const event = new EventArgs(this);
                this.raise(event);

                if (this._onChange) {
                    this._onChange(this._selectedIndex, this._labels[this._selectedIndex]);
                }
            }

            this._pressedIndex = -1;
        }
    }

    idleupState(): void {
        this._accentColor = "#4f46e5";
        this._borderColor = "#4f46e5";
        this.update();
    }

    idledownState(): void {
        this._accentColor = "#4338ca";
        this._borderColor = "#4338ca";
        this.update();
    }

    hoverState(): void {
        this._accentColor = "#6366f1";
        this._borderColor = "#6366f1";
        this.update();
    }

    pressedState(): void {
        this._accentColor = "#312e81";
        this._borderColor = "#312e81";
        this.update();
    }

    hoverPressedState(): void {
        this._accentColor = "#312e81";
        this._borderColor = "#312e81";
        this.update();
    }

    pressedoutState(): void {
        this._accentColor = "#6366f1";
        this._borderColor = "#6366f1";
        this.update();
    }

    moveState(): void {
        this.update();
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        this.idleupState();
    }
}

export { RadioButton };