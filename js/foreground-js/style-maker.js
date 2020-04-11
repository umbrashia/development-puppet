/// <reference path="../../../tds-files/node_modules/@types/jquery/index.d.ts" />


$(document).ready(function () {
    var tempSettingData = {
        siteName: null,
        siteUrl: null,
        siteLoginResetUrl: null,
        siteEmails: [],
        siteStyleData: null
    };
    var allSettingData = [];
    chrome.storage.local.get(['umbrashiaSiteData'], function(result) {
        console.log('Value currently is ' + result.);
      });
    $.getJSON("testData.json", function (data) {
        allSettingData = data;
        chrome.tabs.getSelected(null, function (tab) {
            var tempDomainUrl = tab.url.split("//")[1].split("/")[0];
            data = data.filter(function (ar) {
                return ar['siteUrl'] === tempDomainUrl;
            });
            if (data.length > 0) {
                tempSettingData = data[0];
                for (var key in tempSettingData.siteEmails) {
                    if (tempSettingData.siteEmails.hasOwnProperty(key)) {
                        var element = tempSettingData.siteEmails[key];
                        $("#clientEmails").append(new Option(element, element));
                    }
                }
            }
        });
    });

    $("#resetLogin").click(function () {
        var browseEmail = $('#resetEmail').val().toString().trim();;

        chrome.tabs.update(null, {
            url: window.location.href = tempSettingData.siteLoginResetUrl + browseEmail
        }, function () {
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
            chrome.storage.sync.set({ umbrashiaSiteData: JSON.stringify(allSettingData) }, function () {
                window.close();
            });
        });

    });
});
