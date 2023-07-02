browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url && tab.url.startsWith('https://cafebazaar.ir/app/') && (changeInfo.status == 'complete')) {
        browser.tabs.executeScript(null, {
            file: '/src/injectScript.js',
            runAt: 'document_end'
        })
    }
})
