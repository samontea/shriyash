//Default replacements
var replacements = [
	["facebook", "shriyash"],
	["Facebook", "Shriyash"],
	["PAGES", "Shriyash's Face"],
	["APPS", "Shriyash's Hobbies ;)"],
	["GROUPS", "The friends Shriyash doesn't have."],
	["Profile", "Shriyash"]
];
//Default Blacklist
var whitelisted_sites = ["www.facebook.com"];

debug = false;

function checkBlackList(url, blacklist) {
    url = url.toLowerCase() || "";
    blacklist = blacklist || [];
    for (var i = blacklist.length - 1; i >= 0; i--) {
        if (url.indexOf(blacklist[i]) > -1) {
            return false;
        }
    }
    return true;
}

function injectionScript(tabId, info, tab) {
    if (debug) console.log("injection fire");
    chrome.storage.sync.get(null, function(result) {
        if (result["status"] === "enabled" && !checkBlackList(tab.url, whitelisted_sites)) {
            chrome.tabs.executeScript(tabId, {
                file: "js/substitutions.js",
                runAt: "document_end"
            });
        }
    });
}

function addMessage(request, sender, sendResponse) {
    if (debug) console.log("message fire");
    chrome.storage.sync.get(null, function(result) {
        if (request === "config" && replacements) {
            sendResponse(replacements);
        }
    });
    return true;
}

function fixDataCorruption() {
    if (debug) console.log("updateStore");
    chrome.storage.sync.get(null, function(result) {
        if (!result["status"]) {
            chrome.storage.sync.set({
                "status": "enabled"
            });
        }
    });
}

function toggleActive() {
    if (debug) console.log("clickfire");
    chrome.storage.sync.get("status", function(result) {
        if (result["status"] === null) {
            status = "enabled";
        } else {
            status = result["status"];
        }
        if (status === "enabled") {
            icon = {
                "path": "images/disabled.jpg"
            };
            message = {
                "title": "click to enable shriyash"
            };
            status = "disabled";
        } else if (status === "disabled") {
            icon = {
                "path": "images/shriyash.jpg"
            };
            message = {
                "title": "click to disable shriyash"
            };
            status = "enabled";
        }
        chrome.browserAction.setIcon(icon);
        chrome.browserAction.setTitle(message);
        chrome.storage.sync.set({
            "status": status
        });
    });
}

chrome.browserAction.onClicked.addListener(toggleActive);
chrome.runtime.onMessage.addListener(addMessage);
chrome.tabs.onUpdated.addListener(injectionScript);
chrome.runtime.onInstalled.addListener(fixDataCorruption);
chrome.runtime.onStartup.addListener(fixDataCorruption);
