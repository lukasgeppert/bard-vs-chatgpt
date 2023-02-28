// Utils
function getTextArea() {
    const textareas = document.getElementsByTagName("textarea");
    if (textareas.length == 0) {
        console.warn("ChatGPT inputs not found.");
    } else if (textareas.length > 1) {
        console.warn("ChatGPT inputs unexpected.");
    }
    return textareas[0];
}

function getSubmitButton() {
    const polygons = Array.from(document.getElementsByTagName("polygon")).filter(p => p.parentElement.parentElement.type == "submit");
    if (polygons.length == 0) {
        console.warn("ChatGPT button not found.");
    } else if (polygons.length > 1) {
        console.warn("ChatGPT inputs unexpected.");
    }
    return polygons[0].parentElement.parentElement;
}

function isSideBarVisible() {
    return Array.from(document.getElementsByTagName("span")).filter(e => e.innerHTML == "Open sidebar").length == 0;
}

// Methods
function updateText(text) {
    const t = getTextArea();
    if (!t) {
        console.warn("ChatGPT failed to update text.");
        return;
    }
    t.value = text;
}

function submit() {
    const b = getSubmitButton();
    if (!b) {
        console.warn("ChatGPT failed to submit.");
        return;
    }
    b.click();
}

function registerRuntimeMessagePublisher() {
    const t = getTextArea();
    if (t) {
        t.addEventListener("input", function (e) {
            chrome.runtime.sendMessage({
                publisher: kPublisherChatGPT,
                method: kMethodUpdateText,
                text: e.target.value
            });
        });
        t.addEventListener("keydown", function (e) {
            if (e.key == "Enter" && isSideBarVisible()) {
                chrome.runtime.sendMessage({
                    publisher: kPublisherChatGPT,
                    method: kMethodSubmit
                });
            }
        });
    } else {
        console.warn("ChatGPT failed to register runtime events.");
    }
    const button = getSubmitButton();
    if (button) {
        button.addEventListener("click", function (e) {
            chrome.runtime.sendMessage({
                publisher: kPublisherChatGPT,
                method: kMethodSubmit
            });
        });
    } else {
        console.warn("ChatGPT failed to register runtime events with search buttons.");
    }
}

// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherChatGPT, updateText, submit);

document.addEventListener('DOMContentLoaded', registerRuntimeMessagePublisher);
document.body.addEventListener("click", registerRuntimeMessagePublisher);


// Experimental - sync when on focus. This is needed because chatgpt can sometimes clear my inputs.
function updateTextWhenOnFocus() {
    if (document.hasFocus()) {
        const q = getTextArea();
        if (q) {
            chrome.runtime.sendMessage({
                publisher: kPublisherChatGPT,
                method: kMethodUpdateText,
                text: q.value
            });
        }
    }
}
setInterval(updateTextWhenOnFocus, 10);
