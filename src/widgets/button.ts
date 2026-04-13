import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, Box } from "../core/ui";

class Button extends Widget {
    private _rect!: Rect;
    private _eventRect!: Rect;
    private _text!: Text;

    private _input: string;
    private _fontSize: number;
    private _text_y: number = 0;
    private _text_x: number = 0;

    private _clickHandler?: (e: EventArgs) => void;

    private _fillColor: string = "#4f46e5";
    private _borderColor: string = "#312e81";
    private _textColor: string = "#ffffff";

    private defaultText: string = "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 80;
    private defaultHeight: number = 30;

    constructor(parent: Window) {
        super(parent);

        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;

        this.role = RoleType.button;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get label(): string {
        return this._input;
    }

    set label(value: string) {
        this._input = value;
        this.update();
    }

    get size(): { width: number; height: number } {
        return {
            width: this.width,
            height: this.height
        };
    }

    set size(value: { width: number; height: number }) {
        this.width = value.width;
        this.height = value.height;
        this.update();
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    private positionText() {
        let box: Box = this._text.bbox();

        this._text_x = (+this._rect.x() + (+this._rect.width() / 2) - (box.width / 2));
        this._text_y = (+this._rect.y() + (+this._rect.height() / 2) - (box.height / 2));

        this._text.x(this._text_x);
        this._text.y(this._text_y);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke({ color: this._borderColor, width: 2 });
        this._rect.fill(this._fillColor);
        this._rect.radius(10);

        this._text = this._group.text(this._input);

        this.outerSvg = this._group;

        this._eventRect = this._group
            .rect(this.width, this.height)
            .opacity(0)
            .attr("id", 0);

        this.registerEvent(this._eventRect);
        this.update();
    }

    override update(): void {
        if (this._rect != null) {
            this._rect.width(this.width);
            this._rect.height(this.height);
            this._rect.fill(this._fillColor);
            this._rect.stroke({ color: this._borderColor, width: 2 });
            this._rect.radius(10);
        }

        if (this._eventRect != null) {
            this._eventRect.width(this.width);
            this._eventRect.height(this.height);
        }

        if (this._text != null) {
            this._text.text(this._input);
            this._text.font({
                size: this._fontSize,
                weight: "700"
            });
            this._text.fill(this._textColor);
            this.positionText();
        }

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            const event = new EventArgs(this);
            this.raise(event);

            if (this._clickHandler) {
                this._clickHandler(event);
            }
        }
    }

    onClick(callback: (e: EventArgs) => void): void {
        this._clickHandler = callback;
    }

    idleupState(): void {
        this._fillColor = "#4f46e5";
        this._borderColor = "#312e81";
        this._textColor = "#ffffff";
        this.update();
    }

    idledownState(): void {
        this._fillColor = "#4338ca";
        this._borderColor = "#312e81";
        this._textColor = "#ffffff";
        this.update();
    }

    pressedState(): void {
        this._fillColor = "#312e81";
        this._borderColor = "#1e1b4b";
        this._textColor = "#ffffff";
        this.update();
    }

    hoverState(): void {
        this._fillColor = "#6366f1";
        this._borderColor = "#312e81";
        this._textColor = "#ffffff";
        this.update();
    }

    hoverPressedState(): void {
        this._fillColor = "#3730a3";
        this._borderColor = "#1e1b4b";
        this._textColor = "#ffffff";
        this.update();
    }

    pressedoutState(): void {
        this._fillColor = "#6366f1";
        this._borderColor = "#312e81";
        this._textColor = "#ffffff";
        this.update();
    }

    moveState(): void {
        this.positionText();
        this.update();
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        this.idleupState();
    }
}

export { Button };