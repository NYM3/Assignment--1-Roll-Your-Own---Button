import { Window } from "./core/ui";
import { Button } from "./widgets/button";
import { Heading } from "./widgets/heading";
import { CheckBox } from "./widgets/checkbox";
import { RadioButton } from "./widgets/radioButton";
import { ProgressBar } from "./widgets/progressBar";
import { ScrollBar } from "./widgets/scrollBar";
import { StarRating } from "./widgets/starRating";

let w = new Window(window.innerHeight - 10, "100%");

// Page title
let title = new Heading(w);
title.text = "Toolkit Demo";
title.tabindex = 1;
title.fontSize = 18;
title.move(20, 20);

// CheckBox section
let checkBox = new CheckBox(w);
checkBox.tabindex = 2;
checkBox.label = "Enable notifications";
checkBox.move(20, 70);

let checkStatus = new Heading(w);
checkStatus.text = "CheckBox is unchecked";
checkStatus.tabindex = 3;
checkStatus.fontSize = 14;
checkStatus.move(20, 120);

checkBox.onChange((checked: boolean) => {
    console.log("CheckBox changed:", checked);
    checkStatus.text = `CheckBox is ${checked ? "checked" : "unchecked"}`;
});

// Button section
let btn = new Button(w);
btn.tabindex = 4;
btn.fontSize = 14;
btn.label = "Click Me";
btn.size = { width: 140, height: 48 };
btn.move(20, 170);

let buttonStatus = new Heading(w);
buttonStatus.text = "Button has not been clicked";
buttonStatus.tabindex = 5;
buttonStatus.fontSize = 14;
buttonStatus.move(20, 240);

let clickCount = 0;
btn.onClick(() => {
    clickCount++;
    console.log("Button clicked:", clickCount);
    buttonStatus.text = `Button clicked ${clickCount} time(s)`;
});

// RadioButton section
let radio = new RadioButton(w, ["Small", "Medium", "Large"]);
radio.tabindex = 6;
radio.move(20, 310);

let radioStatus = new Heading(w);
radioStatus.text = "Radio selected: Small";
radioStatus.tabindex = 7;
radioStatus.fontSize = 14;
radioStatus.move(20, 430);

radio.onChange((index: number, label: string) => {
    console.log("RadioButton selected:", index, label);
    radioStatus.text = `Radio selected: ${label}`;
});

// ProgressBar section
let progress = new ProgressBar(w);
progress.tabindex = 8;
progress.progressWidth = 260;
progress.incrementValue = 10;
progress.move(20, 500);

let progressButton = new Button(w);
progressButton.tabindex = 9;
progressButton.fontSize = 14;
progressButton.label = "Increase Progress";
progressButton.size = { width: 180, height: 46 };
progressButton.move(20, 560);

let progressStatus = new Heading(w);
progressStatus.text = `Progress: ${progress.value}%`;
progressStatus.tabindex = 10;
progressStatus.fontSize = 14;
progressStatus.move(20, 625);

progressButton.onClick(() => {
    progress.increment(progress.incrementValue);
});

progress.onIncrement((value: number) => {
    console.log("ProgressBar incremented:", value);
    progressStatus.text = `Progress: ${value}%`;
});

progress.onStateChange((stateName: string) => {
    console.log("ProgressBar state changed:", stateName);
});

// ScrollBar section
let scrollBar = new ScrollBar(w);
scrollBar.tabindex = 11;
scrollBar.scrollHeight = 260;
scrollBar.move(380, 70);

let scrollStatus = new Heading(w);
scrollStatus.text = "Scroll position: 0";
scrollStatus.tabindex = 12;
scrollStatus.fontSize = 14;
scrollStatus.move(340, 350);

scrollBar.onMove((position: number, direction: string) => {
    console.log("ScrollBar moved:", direction, position);
    scrollStatus.text = `Scroll: ${Math.round(position)}% (${direction})`;
});

// Custom Widget: Star Rating section
let rating = new StarRating(w, 5);
rating.tabindex = 13;
rating.move(340, 420);

let ratingStatus = new Heading(w);
ratingStatus.text = "Rating: 0 stars";
ratingStatus.tabindex = 14;
ratingStatus.fontSize = 14;
ratingStatus.move(340, 475);

rating.onChange((ratingValue: number) => {
    console.log("StarRating changed:", ratingValue);
    ratingStatus.text = `Rating: ${ratingValue} star(s)`;
});