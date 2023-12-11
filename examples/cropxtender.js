$.fn.cropxtender = function(options) {
    return this.each(function() {
        const fileInput = $(this);
        let getCanvas;
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

        fileInput.change(function() {
            if (fileInput[0].files[0].type === "image/jpeg" || fileInput[0].files[0].type === "image/png") {
                const image = fileInput[0].files[0];

                $("body").append(`
                    <div id="cropxtender">
                        <div id="cxt-backdrop"></div>
                        <div id="cxt-modal">
                            <div id="cxt-preview"></div>
                            <div id="cxt-actions">
                                <button id="cxt-close">Annuler</button>
                                <button id="cxt-save">Valider</button>
                            </div>
                        </div>
                        <div id="cxt-builder">
                            <div id="cxt-bg">
                                <img id="cxt-img" src="">
                            </div>
                        </div>
                    </div>
                `);

                if (options && options.saveButtonText && typeof options.saveButtonText === "string") {
                    $("#cxt-save").text(options.saveButtonText);
                }
                if (options && options.closeButtonText && typeof options.closeButtonText === "string") {
                    $("#cxt-close").text(options.closeButtonText);
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
                    width : 100%;
                    max-height: 450px;
                }
                #cxt-preview canvas {
                    width: 100% !important;
                    height: auto !important;
                }
                #cxt-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    width: 100%;
                    padding-top: 1rem;
                }
                #cxt-builder {
                    position: absolute;
                    top: 100vh;
                    width: 1000px;
                    height: 1000px;
                    background: #f0f0f0;
                }
                #cxt-bg {
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    justify-content: center;
                    top: 0px;
                    margin: 0 auto;
                    height: 100%;
                    display: flex;
                }
                #cxt-img {
                    position: absolute;
                    max-height: 100%;
                    object-fit: fill;
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
                }

                reader.readAsDataURL(image);

                $("#cropxtender").css("overflow", "visible");


                setTimeout(() => {
                    const element = $("#cxt-builder");
                    $("#cxt-bg").width($("#cxt-img").width());
                    $("#cxt-bg").height($("#cxt-img").height());
                    
                    $("#cxt-builder").width($("#cxt-img").width());
                    $("#cxt-builder").height($("#cxt-img").height());

                    html2canvas(element.get(0)).then(function(canvas) {
                        $("#cxt-preview").html(canvas);
                        getCanvas = canvas;
                    });
                }, 500);

                $("#cropxtender").css("overflow", "hidden");

                $("#cxt-backdrop").click(function() {
                    $("#cropxtender").remove();
                    fileInput.val("");
                });
 
                $("#cxt-close").click(function() {
                    $("#cropxtender").remove();
                    fileInput.val("");
                });

                if (options && options.saveFunction && typeof options.saveFunction === 'function') {
                    $("#cxt-save").click(function() {
                        options.saveFunction.call();
                    });
                } else {
                    $("#cxt-save").click(function() {
                        const dataTransfer = new DataTransfer();
                        const dataUrl = getCanvas.toDataURL("image/png");
                        const blob = dataURLtoBlob(dataUrl);
                        const file = new File([blob], 'image.png', { type: 'image/png' });
                        dataTransfer.items.add(file);
                        fileInput[0].files = dataTransfer.files;
                        $("#cropxtender").remove();
                    });
                }
            }
        });
    });
};
