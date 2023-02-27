// TODO - create somewhere unified for these constants.
const kPublisherGoogleSearch = "Google Search";
const kPublisherChatGPT = "ChatGPT";

function convertPublisherToSite(publisher) {
    switch (publisher) {
        case kPublisherGoogleSearch:
            return "https://www.google.com/"
        case kPublisherChatGPT:
            return "https://chat.openai.com/chat"
    }
    console.warn("unknown publisher " + publisher);
}

const urlParams = new URLSearchParams(window.location.search);
const leftIframe = document.getElementById('left-panel');
leftIframe.src = convertPublisherToSite(urlParams.get('leftPanel'))
const rightIframe = document.getElementById('right-panel');
rightIframe.src = convertPublisherToSite(urlParams.get('rightPanel'))