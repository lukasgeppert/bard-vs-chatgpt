// TODO - create somewhere unified for these constants.
const kPublisherGoogleSearch = "Google Search";
const kPublisherChatGPT = "ChatGPT";

async function restoreOptions() {
    const form = document.querySelector('form');
    const leftPanelSelect = form.elements['left-panel'];
    const rightPanelSelect = form.elements['right-panel'];
    const compactViewCheckbox = form.elements['compact-view'];

    // TODO - dedup default settings
    if (!(await chrome.storage.sync.get()).hasOwnProperty("options")) {
        chrome.storage.sync.set({
            "options": {
                leftPanel: kPublisherChatGPT,
                rightPanel: kPublisherGoogleSearch,
                compactView: true
            }
        });
    }

    const savedSettings = (await chrome.storage.sync.get())["options"];
    leftPanelSelect.value = savedSettings.leftPanel || 'ChatGPT';
    rightPanelSelect.value = savedSettings.rightPanel || 'Google Search';
    compactViewCheckbox.checked = savedSettings.compactView || false;

    leftPanelSelect.addEventListener('click', saveOptions);
    rightPanelSelect.addEventListener('click', saveOptions);
    compactViewCheckbox.addEventListener('click', saveOptions);
}

function saveOptions() {
    const form = document.querySelector('form');
    const leftPanelSelect = form.elements['left-panel'];
    const rightPanelSelect = form.elements['right-panel'];
    const compactViewCheckbox = form.elements['compact-view'];

    // Get the form and its elements
    form.addEventListener('change', () => {
        // Save the selected options to local storage
        const settings = {
            leftPanel: leftPanelSelect.value,
            rightPanel: rightPanelSelect.value,
            compactView: compactViewCheckbox.checked
        };
        chrome.storage.sync.set({ "options": settings })
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);