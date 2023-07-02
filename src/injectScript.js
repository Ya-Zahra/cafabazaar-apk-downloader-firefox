
// CAD : Cafebazaar Apk Downloader
// https://github.com/Ya-Zahra/cafabazaar-apk-downloader-firefox
// MPL-2.0 license

/* participants
Ali Borhani (https://github.com/alibo) - first developer (Google Chrome)
Ya Zahra (https://github.com/Ya-Zahra) - developer (Firefox)
Issue 1: Muhammad Hussein Ammari (https://github.com/xmha97) - Firefox for android
 */
const _devMode = false;

function log(...args) {
    if (_devMode)
        console.log('CAD:', ...args);
}

function waitForElement(selector) {
    log('Waiting for Element - selector:', selector);
    return new Promise(function (resolve, reject) {
        let element = document.querySelectorAll(selector)

            if (element && element.length > 0) {
                log('found without wait - number of elements:' + element.length);
                resolve(element)
                return;
            }
            let timeOut = 0;
        const interval = setInterval(() => {
            timeOut += 100;
            let element = document.querySelectorAll(selector);

            if (element && element.length > 0) {
                clearInterval(interval)
                log('found with wait ' + timeOut + ' ms - number of elements:' + element.length);
                resolve(element)
                return;
            }
            if (timeOut > 20000) {
                clearInterval(interval);
                log('element not found, timeOut - selector:', selector);
                reject("element not found, timeOut");
                return;
            }
        }, 100)
    });
}

function waitForParent(parentN) {
    log('Waiting for parent');
    return new Promise(function (resolve, reject) {

        if (parentN.parentNode) {
            log('parent found without wait');
            resolve(parentN.parentNode)
            return;
        }
        let timeOut = 0;
        const interval = setInterval(() => {
            timeOut += 100;
            if (parentN.parentNode) {
                clearInterval(interval)
                log('parentN found with wait ' + timeOut + ' ms');
                resolve(parentN.parentNode)
                return;
            }
            if (timeOut > 20000) {
                clearInterval(interval);
                log('parent not found, timeOut');
                reject("parent not found, timeOut");
                return;
            }
        }, 100)
    });
}

//AppInstallBtn newbtn
//
//.AppInstallBtn
//div.DetailsPageHeader__buttons:nth-child(2) > a:nth-child(1)
//div.DetailsPageHeader__buttons:nth-child(3) > a:nth-child(1)
//.AppInstallBtn
//AppInstallBtn newbtn
log('(Cafebazaar Apk Downloader) Started');
//function AIO() {
waitForElement('.AppInstallBtn.newbtn').then(btns => {
    let url = btns[0].getAttribute('href')
        log('btn href', url);
    let pkg = new URL(url).searchParams.get('id')
        log('pkg', pkg);
    if (!pkg) {
        log('nul pkg - url is:', url);
        return;
    }

    log('Request AppDownloadInfo');

    fetch('https://api.cafebazaar.ir/rest-v1/process/AppDownloadInfoRequest', {
        mode: 'cors',
        method: 'post',
        headers: {
            'Accept': 'application/json',
            "Content-type": 'application/json'
        },
        body: JSON.stringify({
            properties: {
                language: 2,
                clientVersionCode: 1100301,
                androidClientInfo: {
                    sdkVersion: 23,
                    cpu: 'x86,armeabi-v7a,armeabi'
                },
                clientVersion: "11.3.1",
                isKidsEnabled: false,
            },
            singleRequest: {
                appDownloadInfoRequest: {
                    downloadStatus: 1,
                    packageName: pkg,
                    referrers: [],
                }
            }
        })
    }).then(async response => {
        let res = await response.json()
            /*
            if (!res.properties || !res.properties.statusCode || res.properties.statusCode != 200) {
            log('!res.properties || res.properties.statusCode != 200', res)
            //return
            }
             */
            if (!res.singleReply) {
                log('response.singleReply is nul - return', res)
                return;
            }

            //alert(JSON.stringify(res));
            let token = res.singleReply.appDownloadInfoReply.token
            let cdnPrefix = res.singleReply.appDownloadInfoReply.cdnPrefix[0]
            let packageSize = res.singleReply.appDownloadInfoReply.packageSize / 1024 / 1024
            let versionCode = res.singleReply.appDownloadInfoReply.versionCode || 0
            let downloadTitle;
        let downloadTooltip;
        if (document.documentElement.lang == 'en') {
            log('UI English');
            downloadTitle = 'Download';
            downloadTooltip = 'Happiness of the soul of the Imam and the martyrs SALAWAT';
        } else {
            log('UI Farsi');
            downloadTitle = 'دانلود';
            downloadTooltip = 'شادی روح امام و شهدا صلوات';
        }

        let downloadLink = `${cdnPrefix}apks/${token}.apk`
            log('APK download link:', downloadLink)

            /*
            let downloadBtn = document.createElement("a")
            downloadBtn.setAttribute('class', 'btn btn-primary btn-large')
            downloadBtn.setAttribute('href', downloadLink)
            downloadBtn.setAttribute('title', downloadTooltip)
            downloadBtn.textContent = `${downloadTitle} (${packageSize.toFixed(2)} MB)`
             */

            /*
            // downloadfn = Download FileName
            let downloadfn = document.querySelector('.AppName').innerText
            downloadfn += ' ' + document.querySelector('.AppSubtitles__item').innerText
            downloadBtn.setAttribute('download',downloadfn)
             */

            /*
            waitForParent(btn).then(pele => {
            pele.insertBefore(downloadBtn, pele.childNodes[0]);
            pele.removeChild(btn);
            },
            err=> {
            log('(parent) - rejected with err:',err)
            btn.setAttribute('class', 'btn btn-primary btn-large')
            btn.setAttribute('href', downloadLink)
            btn.setAttribute('title', downloadTooltip)
            btn.textContent = `${downloadTitle} (${packageSize.toFixed(2)} MB)`
            log('btn',btn);

            });
             */

            btns.forEach(function (btn, index) {
                if (btn) { //.parentNode
                    while (btn.attributes.length > 0) {
                        btn.removeAttribute(btn.attributes[0].name);
                    }
                    btn.setAttribute('class', 'btn btn-primary btn-large')
                    btn.setAttribute('href', downloadLink)
                    btn.setAttribute('title', downloadTooltip)
                    btn.textContent = `${downloadTitle} (${packageSize.toFixed(2)} MB)`
                        btn.replaceWith(btn.cloneNode(true));
                    /*
                    btn.parentNode.insertBefore(downloadBtn, btn.parentElement.childNodes[0])
                    btn.parentNode.removeChild(btn)
                     */
                    log('Done for btn ' + index)
                } else {
                    log('nul btn ' + index)

                    //AIO();
                }
            });

    }).catch(err => {
        //		alert(err);
        log('error:', err)
    })
}, err => {
    log('rejected with err:', err)
})
//}
//AIO();
