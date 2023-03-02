// Utils
function getTextArea() {
    const textareas = document.querySelector('textarea');
    if (!textareas) {
        console.warn('ChatGPT inputs not found.');
        return;
    }
    return textareas;
}

function getSubmitButton() {
    const button = document.querySelector('button:has(svg line + polygon)')
    if (!button) {
        console.warn('ChatGPT button not found.');
        return;
    }
    return button
}

function isSideBarVisible() {
    return document.querySelectorAll('button:has(span + svg line + line + line)').length == 0;
}

function sendUpdateText(e) {
    chrome.runtime.sendMessage({
        publisher: kPublisherChatGPT,
        method: kMethodUpdateText,
        text: e.target.value
    });
}

function sendSubmit() {
    chrome.runtime.sendMessage({
        publisher: kPublisherChatGPT,
        method: kMethodSubmit
    });
}

function sendEnterSubmit(e) {
    if (e.key == 'Enter' && isSideBarVisible()) {
        sendSubmit()
    }
}

// Methods
function updateText(text) {
    const t = getTextArea();
    if (!t) {
        console.warn('ChatGPT failed to update text.');
        return;
    }
    t.value = text;
}

function submit() {
    const b = getSubmitButton();
    if (!b) {
        console.warn('ChatGPT failed to submit.');
        return;
    }
    b.click();
}

function registerRuntimeMessagePublisher() {
    const t = getTextArea();
    if (t) {
        t.addEventListener('input', sendUpdateText);
        t.addEventListener('keydown', sendEnterSubmit);
    } else {
        console.warn('ChatGPT failed to register runtime events.');
    }
    const button = getSubmitButton();
    if (button) {
        button.addEventListener('mousedown', sendSubmit);
    } else {
        console.warn('ChatGPT failed to register runtime events with search buttons.');
    }
}

// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherChatGPT, updateText, submit);

document.addEventListener('DOMContentLoaded', registerRuntimeMessagePublisher);
document.body.addEventListener('click', registerRuntimeMessagePublisher);


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
setInterval(registerRuntimeMessagePublisher, 1000);
