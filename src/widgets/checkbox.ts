import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class CheckBox extends Widget {
    private _box!: Rect;
    private _checkMark!: Text;
    private _labelText!: Text;
    private _eventRect!: Rect;

    private _checked: boolean = false;
    private _label: string = "Check Box";
    private _fontSize: number = 16;

    private _boxFill: string = "#ffffff";
    private _boxStroke: string = "#4f46e5";
    private _textColor: string = "#111827";

    private _onChange?: (checked: boolean) => void;

    private boxSize: number = 24;
    private posX: number = 0;
    private posY: number = 0;

    constructor(parent: Window) {
        super(parent);

        this.width = 240;
        this.height = 34;
        this.role = RoleType.button;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this.update();
    }

    get checked(): boolean {
        return this._checked;
    }

    set checked(value: boolean) {
        this._checked = value;
        this.update();
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    onChange(callback: (checked: boolean) => void): void {
        this._onChange = callback;
    }

    override move(x: number, y: number): void {
        this.posX = x;
        this.posY = y;
        this.update();
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._box = this._group.rect(this.boxSize, this.boxSize);
        this._checkMark = this._group.text("");
        this._labelText = this._group.text(this._label);

        this.outerSvg = this._group;

        this._eventRect = this._group
            .rect(this.width, this.height)
            .opacity(0)
            .attr("id", "checkbox-event");

        this.registerEvent(this._eventRect);

        this.update();
    }

    override update(): void {
        this._box
            .x(this.posX)
            .y(this.posY + 4)
            .width(this.boxSize)
            .height(this.boxSize)
            .radius(5)
            .fill(this._checked ? "#4f46e5" : this._boxFill)
            .stroke({ color: this._boxStroke, width: 2 });

        this._checkMark.text(this._checked ? "✓" : "");
        this._checkMark.font({ size: 18, weight: "700" });
        this._checkMark.fill("#ffffff");
        this._checkMark.x(this.posX + 5);
        this._checkMark.y(this.posY + 2);

        this._labelText.text(this._label);
        this._labelText.font({ size: this._fontSize });
        this._labelText.fill(this._textColor);
        this._labelText.x(this.posX + 36);
        this._labelText.y(this.posY + 5);

        this._eventRect
            .x(this.posX)
            .y(this.posY)
            .width(this.width)
            .height(this.height);

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this._checked = !this._checked;
            this.update();

            const event = new EventArgs(this);
            this.raise(event);

            if (this._onChange) {
                this._onChange(this._checked);
            }
        }
    }

    idleupState(): void {
        this._boxFill = "#ffffff";
        this._boxStroke = "#4f46e5";
        this.update();
    }

    idledownState(): void {
        this._boxFill = "#eef2ff";
        this._boxStroke = "#4338ca";
        this.update();
    }

    hoverState(): void {
        this._boxFill = "#eef2ff";
        this._boxStroke = "#6366f1";
        this.update();
    }

    pressedState(): void {
        this._boxFill = "#c7d2fe";
        this._boxStroke = "#312e81";
        this.update();
    }

    hoverPressedState(): void {
        this._boxFill = "#c7d2fe";
        this._boxStroke = "#312e81";
        this.update();
    }

    pressedoutState(): void {
        this._boxFill = "#eef2ff";
        this._boxStroke = "#6366f1";
        this.update();
    }

    moveState(): void {
        this.update();
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        this.idleupState();
    }
}

export { CheckBox };