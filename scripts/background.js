// TODO - create somewhere unified for these constants.
const kPublisherGoogleSearch = "Google Search";
const kPublisherChatGPT = "ChatGPT";

var pubsub = {}

chrome.action.onClicked.addListener(async (tab) => {
    // chrome.tabs.create({
    //     url: chrome.runtime.getURL("ui/side-by-side.html")
    // });

    // Get the screen dimensions
    const screens = await chrome.system.display.getInfo();
    const screenWidth = screens[0].bounds.width;
    const screenHeight = screens[0].bounds.height;

    // Calculate the window dimensions and positions
    const windowWidth = Math.round(screenWidth / 2);
    const windowHeight = screenHeight;
    const leftWindowLeft = 0;
    const rightWindowLeft = windowWidth;

    var google_window = await chrome.windows.create({
        url: "https://www.google.com",
        type: 'normal',
        left: leftWindowLeft,
        top: 0,
        width: windowWidth,
        height: windowHeight
    });
    var google_window_id = google_window.tabs[0].id;

    var openai_window = await chrome.windows.create({
        url: "https://chat.openai.com/chat",
        type: 'normal',
        left: rightWindowLeft,
        top: 0,
        width: windowWidth,
        height: windowHeight
    });
    var openai_window_id = openai_window.tabs[0].id;
    
    pubsub[google_window_id] = Array.of(openai_window_id);
    pubsub[openai_window_id] = Array.of(google_window_id);
});

// Register eventbus.
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        console.log(sender);
        pubsub[sender.tab.id].forEach(tab_id => {
            chrome.tabs.sendMessage(tab_id, request);
        });
    }
);