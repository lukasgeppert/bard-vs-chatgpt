// Utils
function getTextArea() {
    const t = document.getElementById("sb_form_q");
    if (!t) {
        console.warn("Bing search inputs not found.");
    }
    return t;
}

function getSearchButton() {
    const button = Array.from(
        document.getElementsByTagName("svg"))
        .find(s => s.parentElement.ariaLabel == "Search the web");
    if (button) {
        return button;
    }
    const button_div = document.getElementById("sb_search");
    if (button_div) {
        return button_div;
    }
    console.warn("Bing search button not found.");
    return;
}

// Methods
function updateText(text) {
    const q = getTextArea();
    if (!q) {
        console.warn("Bing search failed to update text.");
        return;
    }
    q.value = text;
}

function submit() {
    const button = getSearchButton();
    if (buttons.length == 0) {
        console.warn("Bing search failed to submit.");
        return;
    }
    button.click();
}

function registerRuntimeMessagePublisher() {
    const q = getTextArea();
    if (q) {
        q.addEventListener("input", function (e) {
            chrome.runtime.sendMessage({
                publisher: kPublisherBing,
                method: kMethodUpdateText,
                text: e.target.value
            });
        });
        q.addEventListener("keydown", function (e) {
            if (e.key == "Enter") {
                chrome.runtime.sendMessage({
                    publisher: kPublisherBing,
                    method: kMethodSubmit
                });
            }
        });
    } else {
        console.warn("Bing search failed to register runtime events with text areas.");
    }
    const button = getSearchButton();
    if (button) {
        button.addEventListener("mousedown", function (e) {
            chrome.runtime.sendMessage({
                publisher: kPublisherBing,
                method: kMethodSubmit
            });
        });
    } else {
        console.warn("Bing search failed to register runtime events with search buttons.");
    }
}
// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherBing, updateText, submit);

document.addEventListener('DOMContentLoaded', registerRuntimeMessagePublisher);
document.body.addEventListener("click", registerRuntimeMessagePublisher);


// Experimental - sync when on focus. This is needed because chatgpt can sometimes clear my inputs.
function updateTextWhenOnFocus() {
    if (document.hasFocus()) {
        const q = getTextArea();
        if (q) {
            chrome.runtime.sendMessage({
                publisher: kPublisherBing,
                method: kMethodUpdateText,
                text: q.value
            });
        }
    }
}
setInterval(updateTextWhenOnFocus, 10);
