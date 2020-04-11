chrome.tabs.executeScript(null,
    { code: "document.body.style.backgroundColor='red'" });
    var key;
            for (key in allSettingData) {
                if (allSettingData.hasOwnProperty(key)) {
                    var element = allSettingData[key];
                    if (element.siteName == tempSettingData.siteName) {
                        if (!tempSettingData.siteEmails.includes(browseEmail))
                            tempSettingData.siteEmails.push(browseEmail);
                        break;
                    }
                }
            }
            allSettingData.splice(key, 1);
            allSettingData.unshift(tempSettingData);
            console.log(allSettingData);