// Utils
function getTextArea() {
    const q = document.querySelector('textarea[placeholder="Enter a prompt here"]');
    if (!q) {
        console.log(document.URL);
        console.warn('Bard inputs not found.');
    }
    return q;
}

function getSubmitButton() {
    const button = document.querySelector('button[mattooltip="Submit"]');
    if (!button) {
        console.log(document.URL);
        console.warn('Bard submit button not found.');
    }
    return button;
}

function sendUpdateText(e) {
    chrome.runtime.sendMessage({
        publisher: kPublisherBard,
        method: kMethodUpdateText,
        text: e.target.value
    });
}

function sendSubmit() {
    chrome.runtime.sendMessage({
        publisher: kPublisherBard,
        method: kMethodSubmit
    });
}

function sendEnterSubmit(e) {
    if (e.key == 'Enter') {
        sendSubmit()
    }
}

// Methods
function updateText(text) {
    const q = getTextArea();
    if (!q) {
        console.warn('Bard failed to update text.');
        return;
    }
    q.value = text;
}

function submit() {
    const button = getSubmitButton();
    if (!button) {
        console.warn('Bard failed to submit.');
        return;
    }
    const t = getTextArea();
    if (t) {
        t.dispatchEvent(new Event('input'))
    }
    button.click();
}

function registerRuntimeMessagePublisher() {
    const q = getTextArea();
    if (q) {
        q.addEventListener('input', sendUpdateText);
        q.addEventListener('keydown', sendEnterSubmit);
    } else {
        console.warn('Bard failed to register runtime events with text areas.');
    }
    const button = getSubmitButton();
    if (button) {
        button.addEventListener('mousedown', sendSubmit);
    } else {
        console.warn('Bard failed to register runtime events with submit button.');
    }
}
// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherBard, updateText, submit);

document.addEventListener('DOMContentLoaded', registerRuntimeMessagePublisher);
document.body.addEventListener('click', registerRuntimeMessagePublisher);

// Experimental - sync when on focus. This is needed because chatgpt can sometimes clear my inputs.
function updateTextWhenOnFocus() {
    if (document.hasFocus()) {
        const q = getTextArea();
        if (q) {
            chrome.runtime.sendMessage({
                publisher: kPublisherBard,
                method: kMethodUpdateText,
                text: q.value
            });
        }
    }
}
setInterval(updateTextWhenOnFocus, 10);
setInterval(registerRuntimeMessagePublisher, 1000);
