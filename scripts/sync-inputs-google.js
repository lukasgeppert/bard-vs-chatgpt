// Utils
function getTextArea() {
    var t = Array.from(document.getElementsByName("q")).find(e => e.type == "text");
    if (!t) {
        console.warn("Google search inputs not found.");
    }
    return t;
}

function getSearchButtons() {
    var buttons = Array.from(document.getElementsByTagName("input")).filter(b => b.ariaLabel == "Google Search" && b.role == "button");
    buttons = buttons.concat(Array.from(document.getElementsByTagName("button")).filter(b => b.ariaLabel == "Search"));
    if (buttons.length == 0) {
        console.warn("Google search button not found.");
    }
    return buttons;
}

// Methods
function updateText(text) {
    getTextArea().value = text;
}

function submit() {
    var buttons = getSearchButtons();
    buttons[0].click();
}

function registerRuntimeMessagePublisher() {
    var q = getTextArea();
    q.addEventListener("input", function (e) {
        chrome.runtime.sendMessage({
            publisher: kPublisherGoogleSearch,
            method: kMethodUpdateText,
            text: e.target.value
        });
    });
    q.addEventListener("keydown", function (e) {
        if (e.key == "Enter") {
            chrome.runtime.sendMessage({
                publisher: kPublisherGoogleSearch,
                method: kMethodSubmit
            });
        }
    });
    getSearchButtons().forEach(button => button.addEventListener("mousedown", function (e) {
        chrome.runtime.sendMessage({
            publisher: kPublisherGoogleSearch,
            method: kMethodSubmit
        });
    }
    ));
}


// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherGoogleSearch, updateText, submit);

registerRuntimeMessagePublisher();
document.body.addEventListener("click", registerRuntimeMessagePublisher);
