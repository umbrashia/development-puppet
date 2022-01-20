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

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {

          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
      }

    chrome.tabs.getSelected(null, function (tab) {
        // console.log(tab.url);

        var tempDomainUrl = tab.url.split("//")[1];
        tempDomainUrl = tempDomainUrl.split("/")[0] + '/' + tempDomainUrl.split("/")[1];;
        $("#saveSettingForm").find("[name='newSiteUrl']").val(tempDomainUrl);
        tempSettingData.siteLoginResetUrl = tempDomainUrl;
        $("#saveSettingForm").find("[name='resetLoginUrl']").val(tab.url.split("//")[0] + '//' + tempDomainUrl);
        tempSettingData.siteUrl = tempDomainUrl;
        tempSettingData.siteName = tempDomainUrl;
        chrome.storage.sync.get(['umbrashiaSiteData'], function (result) {
            // console.log(result.umbrashiaSiteData);
            debugger;
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
                    autocomplete(document.getElementById("resetEmail"), tempSettingData.siteEmails);

                    
                    // for (var key in tempSettingData.siteEmails) {
                    //     if (tempSettingData.siteEmails.hasOwnProperty(key)) {
                    //         var element = tempSettingData.siteEmails[key];
                    //         $("#clientEmails").append(new Option(element, element));
                    //     }
                    // }
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
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.update(null, {
                url: tempSettingData.siteLoginResetUrl + browseEmail + "&redirectUrl=" + encodeURIComponent(tab.url)
            }, function () {
                var key;
                key = allSettingData.findIndex(function (ar) {
                    return ar.siteUrl === tempSettingData.siteUrl;
                })

                if (key !== -1) {
                    allSettingData.splice(key, 1);
                    key = tempSettingData.siteEmails.findIndex(function (ar) {
                        return ar === browseEmail;
                    })
                    if (key == -1)
                        tempSettingData.siteEmails.push(browseEmail);

                }
                allSettingData.unshift(tempSettingData);
                var jsonData = JSON.stringify(allSettingData);
                // alert(jsonData);
                chrome.storage.sync.set({ umbrashiaSiteData: jsonData }, function () {
                    window.close();
                });
            });
        });

    }

});