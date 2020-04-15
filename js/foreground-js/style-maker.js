/// <reference path="../../../tds-files/node_modules/@types/jquery/index.d.ts" />


$(document).ready(function () {
    var tempSettingData = {
        siteName: null,
        siteUrl: null,
        siteLoginResetUrl: null,
        siteEmails: [],
        siteStyleData: null
    };
    var globSubmitVal = "";
    var allSettingData = [];
    chrome.tabs.getSelected(null, function (tab) {
        var tempDomainUrl = tab.url.split("//")[1];
        tempDomainUrl = tempDomainUrl.split("/")[0] + '/' + tempDomainUrl.split("/")[1];;
        $("#saveSettingForm").find("[name='newSiteUrl']").val(tempDomainUrl);
        tempSettingData.siteLoginResetUrl = tempDomainUrl;
        $("#saveSettingForm").find("[name='resetLoginUrl']").val(tab.url.split("//")[0] + '//' + tempDomainUrl);
        tempSettingData.siteUrl = tempDomainUrl;
        tempSettingData.siteName = tempDomainUrl;
        chrome.storage.sync.get(['umbrashiaSiteData'], function (result) {
            console.log(result.umbrashiaSiteData);
            // debugger;
            if (result.umbrashiaSiteData) {
                var data = JSON.parse(result.umbrashiaSiteData);
                allSettingData = data;

                data = data.find(function (ar) {
                    return ar['siteUrl'] === tempDomainUrl;
                });
                if (data) {
                    tempSettingData = data;
                    $("#saveSettingForm").find("[name='resetLoginUrl']").val(tempSettingData.siteLoginResetUrl);
                    $("#saveEmailsForm").find("[name='newSiteEmails']").val(tempSettingData.siteEmails.join(","));
                    for (var key in tempSettingData.siteEmails) {
                        if (tempSettingData.siteEmails.hasOwnProperty(key)) {
                            var element = tempSettingData.siteEmails[key];
                            $("#clientEmails").append(new Option(element, element));
                        }
                    }
                }
            }
        });
    });




    $("#saveEmailsForm").submit(function (event) {
        event.preventDefault();
        resetEmailsSite();

    });


    $("#saveSettingForm").submit(function (event) {
        event.preventDefault();
        switch (globSubmitVal) {
            case "do_reset":
                do_reset();
                break;
            default:
                break;
        }
    });

    $("#saveSettingForm button").click(function () {
        globSubmitVal = $(this).attr("value").trim();
        switch (globSubmitVal) {
            case "reset_url":
                reset_url();
                break;
            default:
                break;
        }
    });

    function reset_url() {
        $("#saveSettingForm").find("[name='resetLoginUrl']").removeAttr("readonly");
    }

    function resetEmailsSite() {
        tempSettingData.siteLoginResetUrl = $("#saveSettingForm").find("[name='resetLoginUrl']").val();
        var allEmils = $("#saveEmailsForm").find("[name='newSiteEmails']").val().trim().toString();
        if (allEmils !== "")
            tempSettingData.siteEmails = allEmils.split(",").map(function (ar) { return ar.trim(); });
        var key;
        key = allSettingData.findIndex(function (ar) {
            return ar.siteUrl === tempSettingData.siteUrl;
        })
        if (key !== -1)
            allSettingData.splice(key, 1);
        allSettingData.unshift(tempSettingData);
        var jsonData = JSON.stringify(allSettingData);
        // alert(jsonData);
        chrome.storage.sync.set({ umbrashiaSiteData: jsonData }, function () {
            window.close();
        });
    }

    function saveData() {

    }

    function do_reset() {
        var browseEmail = $('#resetEmail').val().toString().trim();;
        tempSettingData.siteLoginResetUrl = $("#saveSettingForm").find("[name='resetLoginUrl']").val();



        chrome.tabs.update(null, {
            url: tempSettingData.siteLoginResetUrl + browseEmail
        }, function () {
            var key;
            key = allSettingData.findIndex(function (ar) {
                return ar.siteUrl === tempSettingData.siteUrl;
            })
            tempSettingData.siteEmails.push(browseEmail);
            if (key !== -1) {
                allSettingData.splice(key, 1);
                key = tempSettingData.siteEmails.findIndex(function (ar) {
                    return ar === browseEmail;
                })
                if (key !== -1)
                    tempSettingData.siteEmails.splice(key, 1);

            }
            allSettingData.unshift(tempSettingData);
            var jsonData = JSON.stringify(allSettingData);
            // alert(jsonData);
            chrome.storage.sync.set({ umbrashiaSiteData: jsonData }, function () {
                window.close();
            });
        });

    }

});