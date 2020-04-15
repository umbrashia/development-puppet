/// <reference path="../../../tds-files/node_modules/@types/jquery/index.d.ts" />


$(document).ready(function () {


    var f;



    $("#importDataForm").submit(function (event) {
        event.preventDefault();
        readSingleFile();

    });


    $("#exportSettingForm").submit(function (event) {
        event.preventDefault();
        do_export();

    });

    $("#saveSettingForm button").click(function () {
        globSubmitVal = $(this).attr("value").trim();

    });

    function reset_url() {
        $("#saveSettingForm").find("[name='resetLoginUrl']").removeAttr("readonly");
    }

    function resetEmailsSite() {
    }


    function do_export() {
        alert('sss');
        chrome.storage.sync.get(['umbrashiaSiteData'], function (result) {
            console.log(result.umbrashiaSiteData);
            var link = document.createElement('a');
            link.download = 'data.json';
            var blob = new Blob([result.umbrashiaSiteData], { type: 'text/plain' });
            link.href = window.URL.createObjectURL(blob);
            link.click();
        });

    }

    function readSingleFile() {
        if (f) {
            var r = new FileReader();
            r.onload = function(e) { 
                var contents = e.target.result;
                chrome.storage.sync.set({ umbrashiaSiteData: contents }, function () {
                    window.close();
                });
            }
            r.readAsText(f);
          } else { 
            alert("Failed to load file");
          }
       
      }
    
      document.getElementById('fileinput').addEventListener('change', function(evt){
        f = evt.target.files[0];
      }, false);

});