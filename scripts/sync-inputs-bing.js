// Utils
function getTextArea() {
    const t = document.querySelector('#sb_form_q');
    if (!t) {
        console.warn('Bing search inputs not found.');
    }
    return t;
}

function getSearchButton() {
    const button = document.querySelector('label[aria-label=\'Search the web\']:has(svg),div#sb_search a div input');
    if (!button) {
        console.warn('Bing search button not found.');
        return;
    }
    return button;
}

function getAutoCompletions() {
    return document.querySelectorAll('ul[aria-label="Suggestions"] li[role="option"]');
}

function sendUpdateText(e) {
    chrome.runtime.sendMessage({
        publisher: kPublisherBing,
        method: kMethodUpdateText,
        text: e.target.value
    });
}

function sendSubmit() {
    chrome.runtime.sendMessage({
        publisher: kPublisherBing,
        method: kMethodSubmit
    });
}

function sendEnterSubmit(e) {
    if (e.key == 'Enter') {
        sendSubmit()
    }
}

async function autoCompletionSendUpdateAndSubmit(e) {
    const span = e.currentTarget.querySelector('div span[class="sa_tm_text"]');
    if (!span) {
        console.warn("Bing search failed to detect auto complete text.")
    }
    await chrome.runtime.sendMessage({
        publisher: kPublisherBing,
        method: kMethodUpdateText,
        text: span.textContent
    });
    sendSubmit();
}

// Methods
function updateText(text) {
    const q = getTextArea();
    if (!q) {
        console.warn('Bing search failed to update text.');
        return;
    }
    q.value = text;
}

function submit() {
    console.log("bing submit");
    const button = getSearchButton();
    console.log(button);
    if (!button) {
        console.warn('Bing search failed to submit.');
        return;
    }
    button.click();
    if (button.parentElement.submit) {
        button.parentElement.submit();
    }
}

function registerRuntimeMessagePublisher() {
    const q = getTextArea();
    if (q) {
        q.addEventListener('input', sendUpdateText);
        q.addEventListener('keydown', sendEnterSubmit);
        q.addEventListener('keydown', registerRuntimeMessagePublisher);
    } else {
        console.warn('Bing search failed to register runtime events with text areas.');
    }
    const button = getSearchButton();
    if (button) {
        button.addEventListener('mousedown', sendSubmit);
    } else {
        console.warn('Bing search failed to register runtime events with search .');
    }
    const auto_completions = getAutoCompletions();
    auto_completions.forEach(a => a.addEventListener('mousedown', autoCompletionSendUpdateAndSubmit));
}
// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherBing, updateText, submit);

document.addEventListener('DOMContentLoaded', registerRuntimeMessagePublisher);
document.body.addEventListener('click', registerRuntimeMessagePublisher);


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
setInterval(registerRuntimeMessagePublisher, 1000);
