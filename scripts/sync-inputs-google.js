// Utils
function getTextArea() {
    const q = document.querySelector('input[name="q"][type="text"]');
    if (!q) {
        console.log(document.URL);
        console.warn('Google search inputs not found.');
    }
    return q;
}

function getSearchButtons() {
    const buttons = document.querySelectorAll('input[aria-label="Google Search"][role="button"],button[aria-label="Search"]');
    if (buttons.length == 0) {
        console.warn('Google search button not found.');
    }
    return buttons;
}

function getAutoCompletions() {
    return document.querySelectorAll('div[role="presentation"] ul li');
}

function sendUpdateText(e) {
    chrome.runtime.sendMessage({
        publisher: kPublisherGoogleSearch,
        method: kMethodUpdateText,
        text: e.target.value
    });
}

function sendSubmit() {
    chrome.runtime.sendMessage({
        publisher: kPublisherGoogleSearch,
        method: kMethodSubmit
    });
}

function sendEnterSubmit(e) {
    if (e.key == 'Enter') {
        sendSubmit()
    }
}

async function autoCompletionSendUpdateAndSubmit(e) {
    const span = e.currentTarget.querySelector("div div div span");
    if (!span) {
        console.warn("Google search failed to detect auto complete text.")
    }
    await chrome.runtime.sendMessage({
        publisher: kPublisherGoogleSearch,
        method: kMethodUpdateText,
        text: span.textContent
    });
    sendSubmit();
}

// Methods
function updateText(text) {
    const q = getTextArea();
    if (!q) {
        console.warn('Google search failed to update text.');
        return;
    }
    q.value = text;
}

function submit() {
    const buttons = getSearchButtons();
    if (buttons.length == 0) {
        console.warn('Google search failed to submit.');
        return;
    }
    buttons[0].click();
}

function registerRuntimeMessagePublisher() {
    const q = getTextArea();
    if (q) {
        q.addEventListener('input', sendUpdateText);
        q.addEventListener('keydown', sendEnterSubmit);
    } else {
        console.warn('Google search failed to register runtime events with text areas.');
    }
    const buttons = getSearchButtons();
    if (buttons.length > 0) {
        getSearchButtons().forEach(button => button.addEventListener('mousedown', sendSubmit));
    } else {
        console.warn('Google search failed to register runtime events with search buttons.');
    }
    const auto_completions = getAutoCompletions();
    auto_completions.forEach(a => a.addEventListener('mousedown', autoCompletionSendUpdateAndSubmit));
}
// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherGoogleSearch, updateText, submit);

document.addEventListener('DOMContentLoaded', registerRuntimeMessagePublisher);
document.body.addEventListener('click', registerRuntimeMessagePublisher);


// Experimental - sync when on focus. This is needed because chatgpt can sometimes clear my inputs.
function updateTextWhenOnFocus() {
    if (document.hasFocus()) {
        const q = getTextArea();
        if (q) {
            chrome.runtime.sendMessage({
                publisher: kPublisherGoogleSearch,
                method: kMethodUpdateText,
                text: q.value
            });
        }
    }
}
setInterval(updateTextWhenOnFocus, 10);
setInterval(registerRuntimeMessagePublisher, 1000);
