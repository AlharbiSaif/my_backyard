document.getElementById("fimg").style.display = "none";

$("#text").text("Upload an image of a flower to see what kind of flower it is. This returns 5 results from the image recognition program with the highest level of confidence. \n\n Click anywhere to close this message.");
on();

function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.src = e.target.result;
           img.onload = function() {
             var imgWidth = img.naturalWidth;
             var screenWidth  = $(window).width() - 20;
             var scaleX = 1;
             if (imgWidth > screenWidth){scaleX = screenWidth/imgWidth;}
             var imgHeight = img.naturalHeight;
             var screenHeight = $(window).height() - canvas.offsetTop-10;
             var scaleY = 1;
             if (imgHeight > screenHeight){scaleY = screenHeight/imgHeight;}
             var scale = scaleY;
             if(scaleX < scaleY){scale = scaleX;}
             if(scale < 1){
               imgHeight = imgHeight*scale;
               imgWidth = imgWidth*scale;
             }
             canvas.height = imgHeight;
             canvas.width = imgWidth;
             ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0,0, imgWidth, imgHeight);
             document.getElementById("fimg").style.display = "block";
           };
        };
        FR.readAsDataURL( this.files[0] );
    }
}

var fileUpload = document.getElementById('in');
var canvas  = document.getElementById('fcanvas');
var ctx = canvas.getContext("2d");

function up() {
  fileUpload.click();
  fileUpload.onchange = readImage;

}

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}


$(document).ready(function () {

   var subKey = 'd73860db3f5c4ce0b22c77368c26cd54';

    function makeblob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    $('#in').change(function () {
        var reader = new FileReader();
        var file = this.files[0];
        console.log(file);
        reader.onload=  function() {
            var resultData = this.result;
            //console.log(resultData);
            resultData = resultData.split(',')[1];
            processImage(resultData);};
        reader.readAsDataURL(file);
    });

    processImage = function(binaryImage) {
      var uriBase = "https://flowers.cognitiveservices.azure.com/vision/v2.0/analyze";
      var params = {
          "visualFeatures": "Tags",
          "details": "",
          "language": "en",
        };

        $.ajax({
            url: "https://flowers.cognitiveservices.azure.com/vision/v2.0/analyze?" + $.param(params),

           method: "POST",
           type: "POST",
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subKey);

            },
            contentType: "application/octet-stream",
            mime: "application/octet-stream",
            data: makeblob(binaryImage, 'image/png'),
            cache: false,
            processData: false


        }) .done(function(data) {
           da = JSON.stringify(data, null, 2);
           var obj = JSON.parse(da);
           daa = JSON.stringify(obj, null, 2);

           var res = obj.tags[0].name+", "+obj.tags[1].name+", "+ obj.tags[2].name+", "+ obj.tags[3].name+", "+ obj.tags[4].name;
           console.log(res)

           $("#text").text("This image might be: "+res);
           on();

           alert("Success");
         })

         .fail(function(jqXHR, textStatus, errorThrown) {
            var errorString = (errorThrown === "") ? "Error. " :
                errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
                jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });

    }
});
