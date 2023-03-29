function waitForElement(selector) {
    return new Promise(function (resolve, reject) {
        let element = document.querySelector(selector)

        if (element) {
            resolve(element)
            return;
        }

        const interval = setInterval(() => {
            let element = document.querySelector(selector);

            if (element) {
                clearInterval(interval)
                resolve(element)
                return;
            }
        }, 100)
    });
}
//AppInstallBtn newbtn
//
//.AppInstallBtn
//div.DetailsPageHeader__buttons:nth-child(2) > a:nth-child(1)
waitForElement('.AppInstallBtn').then(btn => {
    let url = btn.getAttribute('href')

    let pkg = new URL(url).searchParams.get('id')

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

        if (!res.properties || res.properties.statusCode != 200) {
            console.log('Invalid response:', res)
            //return
        }

        let token = res.singleReply.appDownloadInfoReply.token
        let cdnPrefix = res.singleReply.appDownloadInfoReply.cdnPrefix[0]
        let packageSize = res.singleReply.appDownloadInfoReply.packageSize / 1024 / 1024
        let versionCode = res.singleReply.appDownloadInfoReply.versionCode || 0
        let downloadTitle = (document.documentElement.lang == 'en') ? 'Download' : 'دانلود'
        let downloadTooltip = (document.documentElement.lang == 'en') ? 'Happiness of the soul of the Imam and the martyrs SALAWAT' : 'شادی روح امام و شهدا صلوات'

        let downloadLink = `${cdnPrefix}apks/${token}.apk`

        console.log('APK download link:', downloadLink)

        let downloadBtn = document.createElement("a")
        downloadBtn.setAttribute('class', 'btn btn-primary btn-large')
        downloadBtn.setAttribute('href', downloadLink)
        downloadBtn.setAttribute('title', downloadTooltip)
        downloadBtn.textContent = `${downloadTitle} (${packageSize.toFixed(2)} MB)`
		let downloadfn = document.querySelector('.AppName').innerText
		downloadfn += ' ' + document.querySelector('.AppSubtitles__item').innerText
		downloadBtn.setAttribute('download',downloadfn)

        btn.parentNode.insertBefore(downloadBtn, btn.parentNode.childNodes[0])
        btn.parentNode.removeChild(btn)

    }).catch(err => console.log('Request failed', err))
})
