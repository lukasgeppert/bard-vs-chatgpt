const kPublisherGoogleSearch = "Google Search";
const kPublisherChatGPT = "ChatGPT";

const kMethodUpdateText = "update_text";
const kMethodSubmit = "submit";

function subscribeRuntimeMessages(publisher, update_text_handler, submit_handler) {
    chrome.runtime.onMessage.addListener(
        function (request, _sender, _sendResponse) {
            // console.log(publisher + "/" + JSON.stringify(request));
            // console.log(publisher + " has focus = " + document.hasFocus());
            // No need to subscribe messages from its own.
            if (request.publisher == publisher) {
                return;
            }
            switch (request.method) {
                case kMethodUpdateText:
                    update_text_handler(request.text)
                    break;
                case kMethodSubmit:
                    submit_handler()
                    break;
            }
        }
    );
}