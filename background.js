const kPublisherGoogleSearch = "googlesearch";
const kPublisherChatGPT = "chatgpt";

var tab_id_links = {}

chrome.action.onClicked.addListener(async (tab) => {
    // chrome.tabs.create({
    //     url: chrome.runtime.getURL("hello.html")
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
    
    tab_id_links[google_window_id] = Array.of(openai_window_id);
    tab_id_links[openai_window_id] = Array.of(google_window_id);
});

// Register request router.
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        console.log(sender);
        tab_id_links[sender.tab.id].forEach(tab_id => {
            chrome.tabs.sendMessage(tab_id, request);
        });
    }
);