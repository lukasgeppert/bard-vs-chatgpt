// Utils
function getTextArea() {
    const t = Array.from(document.getElementsByName("q")).find(e => e.type == "text");
    if (!t) {
        console.warn("Google search inputs not found.");
    }
    return t;
}

function getSearchButtons() {
    const buttons = Array.from(
        document.getElementsByTagName("input"))
        .filter(b => b.ariaLabel == "Google Search" && b.role == "button")
        .concat(
            Array.from(
                document.getElementsByTagName("button"))
                .filter(b => b.ariaLabel == "Search"));
    if (buttons.length == 0) {
        console.warn("Google search button not found.");
    }
    return buttons;
}

// Methods
function updateText(text) {
    const q = getTextArea();
    if (!q) {
        console.warn("Google search failed to update text.");
        return;
    }
    q.value = text;
}

function submit() {
    const buttons = getSearchButtons();
    if (buttons.length == 0) {
        console.warn("Google search failed to submit.");
        return;
    }
    buttons[0].click();
}

function registerRuntimeMessagePublisher() {
    const q = getTextArea();
    if (q) {
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
    } else {
        console.warn("Google search failed to register runtime events with text areas.");
    }
    const buttons = getSearchButtons();
    if (buttons.length > 0) {
        getSearchButtons().forEach(button => button.addEventListener("mousedown", function (e) {
            chrome.runtime.sendMessage({
                publisher: kPublisherGoogleSearch,
                method: kMethodSubmit
            });
        }
        ));
    } else {
        console.warn("Google search failed to register runtime events with search buttons.");
    }
}


// Register publisher and subscriber.
subscribeRuntimeMessages(kPublisherGoogleSearch, updateText, submit);

registerRuntimeMessagePublisher();
document.body.addEventListener("click", registerRuntimeMessagePublisher);
