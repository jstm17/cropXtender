$.fn.cropxtender = function(options) {
    return this.each(function() {
        const fileInput = $(this);
        console.log(options);

        const dataURLtoBlob = (dataUrl) => {
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }

        const objectToCssString = (styles) => {
            let cssString = "{ ";
            $.each(styles, function(property, value) {
                cssString += `${property}: ${value}; `;
            });
            cssString += "}";
            return cssString;
        }

        const cropperOption = (croppingAspectRatio = false) => {
            const elm = $("#cxt-preview-elm");
            if (croppingAspectRatio) {
                elm.width( elm.width() * croppingAspectRatio.x);
                elm.height( elm.height() * croppingAspectRatio.y);
            }

            elm.resizable({
                containment: "parent",
                aspectRatio: croppingAspectRatio ? true : false,
                stop: function (event, ui) {
                    updateClip(ui.position.left, ui.position.top, ui.size.width, ui.size.height);
                }
            }).draggable({
                containment: "parent",
                stop: function (event, ui) {
                    updateClip(ui.position.left, ui.position.top, $("#cxt-preview-elm").width(), $("#cxt-preview-elm").height());
                }
            }).css({
                "display": "block",
            });

            if (options && options.resize === false) {
                elm.resizable("disable");
            }
        }

        const updateClip = (left, top, width, height) => {
            $("#cxt-preview-img").css('clip', 'rect(' + top + 'px, ' + (left + width) + 'px, ' + (top + height) + 'px, ' + left + 'px)');
            const rTop = (top * $("#cxt-img").width() / $("#cxt-preview-img").width());
            const rLeft = (left * $("#cxt-img").height() / $("#cxt-preview-img").height());
            const rWidth = (width * ($("#cxt-img").width() / $("#cxt-preview-img").width()));
            const rHeight = (height * ($("#cxt-img").height() / $("#cxt-preview-img").height()));
            $("#cxt-img").css('clip', 'rect(' + rTop + 'px, ' + (rLeft + rWidth) + 'px, ' + (rTop + rHeight) + 'px, ' + rLeft + 'px)');
            $("#cxt-img").attr("data-top", rTop);
            $("#cxt-img").attr("data-left", rLeft);
            $("#cxt-img").attr("data-width", rWidth);
            $("#cxt-img").attr("data-height", rHeight);
        }

        fileInput.change(function() {
            if (fileInput[0].files[0].type === "image/jpeg" || fileInput[0].files[0].type === "image/png") {
                const image = fileInput[0].files[0];

                let bodyHTML = `    
                    <div id="cropxtender">
                        <div id="cxt-backdrop"></div>
                        <div id="cxt-modal">
                            <div id="cxt-preview">
                                <div id="cxt-preview-elm"></div>
                            </div>
                            <div id="cxt-options">
                                <button id="cxt-crop-btn">Crop</button>
                                <button id="cxt-rotate-btn">Rotate</button>
                                <button id="cxt-flip-btn">Flip</button>
                                <button id="cxt-zoom-btn">Zoom</button>
                                <button id="cxt-filter-btn">Filter</button>
                                <button id="cxt-ia-btn">IA</button>
                            </div>
                            <div id="cxt-actions">
                                <button id="cxt-close">Annuler</button>
                                <button id="cxt-save">Valider</button>
                            </div>
                        </div>
                        <img id="cxt-img" src="">
                    </div>
                `;

                if (!(options && options.jqueryUiImport === false)) {
                    bodyHTML += `<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>`;
                }

                if (!(options && options.cssImport === false)) {
                    $("head").append(`
                        <link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"/>
                    `);
                }

                $("body").append(bodyHTML);
                

                if (options && options.saveButtonText && typeof options.saveButtonText === "string") {
                    $("#cxt-save").html(options.saveButtonText);
                }
                if (options && options.closeButtonText && typeof options.closeButtonText === "string") {
                    $("#cxt-close").html(options.closeButtonText);
                }
                if (options && options.croppingButtonText && typeof options.croppingButtonText === "string") {
                    $("#cxt-crop-btn").html(options.croppingButtonText);
                }
                if (options && options.rotatingButtonText && typeof options.rotatingButtonText === "string") {
                    $("#cxt-rotate-btn").html(options.rotatingButtonText);
                }
                if (options && options.flippingButtonText && typeof options.flippingButtonText === "string") {
                    $("#cxt-flip-btn").html(options.flippingButtonText);
                }
                if (options && options.zoomingButtonText && typeof options.zoomingButtonText === "string") {
                    $("#cxt-zoom-btn").html(options.zoomingButtonText);
                }
                if (options && options.filteringButtonText && typeof options.filteringButtonText === "string") {
                    $("#cxt-filter-btn").html(options.filteringButtonText);
                }
                if (options && options.iaGeneratingButtonText && typeof options.iaGeneratingButtonText === "string") {
                    $("#cxt-ia-btn").html(options.iaGeneratingButtonText);
                }

                let rules = `
                #cropxtender {
                    display           : flex;
                    flex-direction    : column;
                    width             : 100%;
                    height            : 100vh;
                    position          : absolute;
                    z-index           : 98;
                    top               : 0;
                    left              : 0;
                }
                #cxt-backdrop {
                    width             : 100%;
                    height            : 100vh;
                    background-color  : #000;
                    opacity           : 0.3;
                    position          : absolute;
                    top               : 0;
                    left              : 0;
                    z-index           : 99;
                    cursor            : pointer;
                }
                #cxt-modal {
                    background-color  : #fff;
                    position          : absolute;
                    top               : 50%;
                    left              : 50%;
                    transform         : translate(-50%, -50%);
                    z-index           : 100;
                    display           : flex;
                    flex-direction    : column;
                    justify-content   : center;
                    align-items       : center;
                    padding: 1rem;
                }
                #cxt-preview {
                    max-width: 500px;
                    max-height: 450px;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    position: relative;
                }
                #cxt-preview img {
                    width: 100% !important;
                    height: auto !important;
                }
                #cxt-preview-elm {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    border: 2px #adf dashed;
                    top: 0;
                    box-shadow: 0px 0px 0px 500px rgba(0, 0, 0, 0.5);
                    display: none;
                }
                #cxt-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    width: 100%;
                    padding-top: 1rem;
                }
                #cxt-img {
                    position: absolute;
                    top: 100vh;
                    left: 0;
                }
                `;

                if (options.saveButtonStyle) {
                    const css = objectToCssString(options.saveButtonStyle);
                    rules += "#cxt-save " + css;
                }

                if (options.closeButtonStyle) {
                    const css = objectToCssString(options.closeButtonStyle);
                    rules += "#cxt-close " + css;
                }

                if (options.modalStyle) {
                    const css = objectToCssString(options.modalStyle);
                    rules += "#cxt-modal " + css;
                }

                if (options.modalStyle) {
                    const css = objectToCssString(options.modalStyle);
                    rules += "#cxt-modal " + css;
                }

                if (options.optionButtonStyle) {
                    const css = objectToCssString(options.optionButtonStyle);
                    rules += "#cxt-options button" + css;
                }
                if (options.optionButtonContainerStyle) {
                    const css = objectToCssString(options.optionButtonContainerStyle);
                    rules += "#cxt-options " + css;
                }

                if ($("style").length > 0) {
                    if (!$("style").text().includes(rules)) {
                        $("style").append(rules);
                    }
                } else {
                    $("head").append(`<style>${rules}</style>`);
                }

                const reader = new FileReader();

                reader.onload = function(e){
                    $("#cxt-img").attr("src", e.target.result);
                    $("#cxt-preview").prepend(`<img id="cxt-preview-img" src="${e.target.result}" />`);
                }

                reader.readAsDataURL(image);

                $("#cropxtender").css("overflow", "visible");

                setTimeout(() => {
                    updateClip(0, 0, $("#cxt-preview-img").width(), $("#cxt-preview-img").height());
                    setTimeout(() => {
                        $("#cxt-preview-elm").css({
                            width: $("#cxt-preview").width() - 7,
                            height: $("#cxt-preview").height() - 7,
                        });
                    }, (500));
                    
                }, 500);

                $("#cropxtender").css("overflow", "hidden");

                $("#cxt-backdrop").click(function() {
                    $("#cropxtender").remove();
                    fileInput.val("");
                });
 
                if (options && options.closeFunction && typeof options.closeFunction === "function") {
                    $("#cxt-close").click(function() {
                        options.closeFunction.call();
                    });
                } else {
                    $("#cxt-close").click(function() {
                        $("#cropxtender").remove();
                        fileInput.val("");
                    });
                }

                if (!(options && options.cropping === false)) {
                    $("#cxt-crop-btn").click(function() {
                        $("#cxt-preview-elm").css("display", "none");
                        if (options.croppingAspectRatio) {
                            cropperOption(options.croppingAspectRatio);
                        } else {
                            cropperOption();
                        }
                    })
                } else {
                    $("#cxt-crop-btn").remove();
                }

                if (options && options.rotating === true) {
                    $("#cxt-rotate-btn").attr("data-rotate", 0);
                    $("#cxt-rotate-btn").click(function() {
                        const elm = $('#cxt-preview-img, #cxt-preview-elm');
                        $("#cxt-preview-elm").css("display", "none");
                        const currentAngle = parseInt($("#cxt-rotate-btn").attr("data-rotate"));
                        elm.css("transform", "rotate("+ (currentAngle + 90) +"deg)");
                        const rotationAngle = ((currentAngle + 90) % 360) * Math.PI / 180;
                        elm.attr("data-rotate", rotationAngle);
                        $("#cxt-rotate-btn").attr("data-rotate", currentAngle + 90);
                    });
                } else {
                    $("#cxt-rotate-btn").remove();
                }

                if (options && options.flipping === true) {
                } else {
                    $("#cxt-flip-btn").remove();
                }

                if (options && options.zooming === true) {
                } else {
                    $("#cxt-zoom-btn").remove();
                }

                if (options && options.filtering === true) {
                } else {
                    $("#cxt-filter-btn").remove();
                }

                if (options && options.iaGenerating === true) {
                } else {
                    $("#cxt-ia-btn").remove();
                }

                if (options && options.saveFunction && typeof options.saveFunction === 'function') {
                    $("#cxt-save").click(function() {
                        options.saveFunction.call();
                    });
                } else {
                    $("#cxt-save").click(function() {
                        const left = $("#cxt-img").attr("data-left");
                        const top = $("#cxt-img").attr("data-top");
                        const width = $("#cxt-img").attr("data-width");
                        const height = $("#cxt-img").attr("data-height");

                        const canvas = $("<canvas>").attr("width", width).attr("height", height);
                        const ctx = canvas[0].getContext('2d');
            
                        const reader = new FileReader();

                        reader.onload = function (e) {
                            const dataUrl = e.target.result;

                            const img = new Image();
                            img.src = dataUrl;

                            img.onload = function () {
                                if (options && options.rotating === true) {
                                    const rotationAngle = $("#cxt-preview-img").attr("data-rotate");
                                    let x = width / 2;
                                    let y = height / 2;
                                    if ($("#cxt-rotate-btn").attr("data-rotate") % 90 === 0) {
                                        canvas[0].width = height;
                                        canvas[0].height = width;
                                        x = height / 2;
                                        y = width / 2;
                                    }
                                    if ($("#cxt-rotate-btn").attr("data-rotate") % 180 === 0) {
                                        canvas[0].width = width;
                                        canvas[0].height = height;
                                        x = width / 2;
                                        y = height / 2;
                                    }
                                    ctx.translate(x, y);
                                    ctx.rotate(rotationAngle);
                                    ctx.drawImage(img, -((width) / 2) - left, -(height / 2) - top);
                                    ctx.rotate(-rotationAngle);
                                    ctx.translate(-x, -y);
                                } else {
                                    ctx.drawImage(img, -left, -top);
                                }

                                const dataUrl = canvas[0].toDataURL();
                                $("#result").attr("src", dataUrl);
                                const dataTransfer = new DataTransfer();
                                const blob = dataURLtoBlob(dataUrl);
                                const file = new File([blob], 'image.png', { type: 'image/png' });
                                dataTransfer.items.add(file);
                                fileInput[0].files = dataTransfer.files;
                                $("#cropxtender").remove();
                            };
                        };

                        reader.readAsDataURL(image);
                    });
                }
            }
        });
    });
};
