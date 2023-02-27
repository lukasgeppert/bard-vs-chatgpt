// Utils
function getTextArea() {
    var textareas = document.getElementsByTagName("textarea");
    if (textareas.length == 0) {
        console.warn("Chatgpt inputs not found.");
    } else if (textareas.length > 1) {
        console.warn("Chatgpt inputs unexpected.");
    }
    return textareas[0];
}

function getSubmitButton() {
    var polygons = Array.from(document.getElementsByTagName("polygon")).filter(p => p.parentElement.parentElement.type == "submit");
    if (polygons.length == 0) {
        console.warn("Chatgpt button not found.");
    } else if (polygons.length > 1) {
        console.warn("Chatgpt inputs unexpected.");
    }
    return polygons[0].parentElement.parentElement;
}

// Methods
function updateText(text) {
    getTextArea().value = text;
}

function submit() {
    getSubmitButton().click();
}

function registerRuntimeMessagePublisher() {
    var t = getTextArea();
    t.addEventListener("input", function (e) {
        chrome.runtime.sendMessage({
            publisher: kPublisherChatGPT,
            method: kMethodUpdateText,
            text: e.target.value
        });
    });
    t.addEventListener("keydown", function (e) {
        if (e.key == "Enter") {
            chrome.runtime.sendMessage({
                publisher: kPublisherChatGPT,
                method: kMethodSubmit
            });
        }
    });
    getSubmitButton().addEventListener("click", function (e) {
        chrome.runtime.sendMessage({
            publisher: kPublisherChatGPT,
            method: kMethodSubmit
        });
    });
}

// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherChatGPT, updateText, submit);

registerRuntimeMessagePublisher();
document.body.addEventListener("click", registerRuntimeMessagePublisher);
