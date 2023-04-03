console.log('CAD:','background script loaded');
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 
	console.log('CAD:','Listener loaded');
    if (tab.url && tab.url.startsWith('https://cafebazaar.ir/app/') && changeInfo.status == 'complete') {
		console.log('CAD:','script injecting by background script');
        browser.tabs.executeScript(null, {
            file: '/src/injectScript.js',
            runAt: 'document_end'
        })
    }
})