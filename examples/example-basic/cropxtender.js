$.fn.cropxtender = function (options) {
    return this.each(function () {
        const fileInput = $(this);
  
        const dataURLtoBlob = (dataUrl) => {
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            });
        }
  
        const objectToCssString = (styles) => {
            let cssString = "{ ";
            $.each(styles, function (property, value) {
                cssString += `${property}: ${value}; `;
            });
            cssString += "}";
            return cssString;
        }
  
        const cropperOption = (croppingAspectRatio = false) => {
            const elm = $("#cxt-preview-elm");
            if (croppingAspectRatio) {
                elm.width(elm.width() * croppingAspectRatio.x);
                elm.height(elm.height() * croppingAspectRatio.y);
            }
            if (elm.resizable("instance")) {
                elm.resizable("destroy");
            }
            if (elm.draggable("instance")) {
                elm.draggable("destroy");
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
  
        const updateFilter = (element, filterType, newValue) => {
            $("#cxt-" + filterType + "-value").val(parseInt(newValue.slice(0, -1)));
            const currentFilter = element.css("filter");
            const regex = new RegExp(filterType + "\\([^)]*\\)");
  
            if (currentFilter.match(regex)) {
                const updatedFilter = currentFilter.replace(regex, filterType + "(" + newValue + ")");
                element.css("filter", updatedFilter);
            } else {
                element.css("filter", (currentFilter === "none" ? "" : currentFilter + " ") + filterType + "(" + newValue + ")");
            }
        }
        
        const updateZoom = (value) => {
          const elm = $('#cxt-preview-img');
          const zoom = value / 100;
          const flipY = elm.attr("data-flip-y") === "y";
          const flipX = elm.attr("data-flip-x") === "x";
          const rotate = parseInt($("#cxt-rotate-btn").attr("data-rotate"));
          elm.css("transform", `${rotate ? "rotate("+rotate+"deg)" : ""} scale(${flipX ? '-' + (zoom) : (zoom)}, ${flipY ? '-' + (zoom) : (zoom)})`);
          elm.attr("data-zoom", zoom);
        }
  
        fileInput.change(function () {
            if (fileInput[0].files[0].type === "image/jpeg" || fileInput[0].files[0].type === "image/png") {
                const image = fileInput[0].files[0];
  
                let bodyHTML = `    
                    <div id="cropxtender">
                        <div id="cxt-backdrop"></div>
                        <div id="cxt-modal">
                            <div id="cxt-preview">
                                <div id="cxt-preview-elm"></div>
                            </div>
                            <div id="cxt-actions">
                                <div id="cxt-sliders"></div>
                                <div id="cxt-buttons">
                                    <button id="cxt-close">Annuler</button>
                                    <div id="cxt-options">
                                        <button id="cxt-crop-btn">Crop</button>
                                        <button id="cxt-rotate-btn">Rotate</button>
                                        <button id="cxt-flip-x-btn">Flip X</button>
                                        <button id="cxt-flip-y-btn">Flip Y</button>
                                        <button id="cxt-zoom-btn">Zoom</button>
                                        <button id="cxt-filter-btn">Filter</button>
                                        <button id="cxt-ia-btn">IA</button>
                                    </div>
                                    <button id="cxt-save">Valider</button>
                                </div>
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
                if (options && options.flippingXButtonText && typeof options.flippingXButtonText === "string") {
                    $("#cxt-flip-x-btn").html(options.flippingXButtonText);
                }
                if (options && options.flippingYButtonText && typeof options.flippingYButtonText === "string") {
                    $("#cxt-flip-y-btn").html(options.flippingYButtonText);
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
  
                if (options.optionButtonStyle) {
                    const css = objectToCssString(options.optionButtonStyle);
                    rules += "#cxt-options button" + css;
                }
                if (options.optionButtonContainerStyle) {
                    const css = objectToCssString(options.optionButtonContainerStyle);
                    rules += "#cxt-options " + css;
                }
                if (options.optionSliderStyle) {
                    rules += options.optionSliderStyle;
                }
  
                if (!(options.forceDisableCSS === true)) {
                    if ($("style").length > 0) {
                        if (!$("style").text().includes(rules)) {
                            $("style").append(rules);
                        }
                    } else {
                        $("head").append(`<style>${rules}</style>`);
                    }
                }
  
                const reader = new FileReader();
  
                reader.onload = function (e) {
                    $("#cxt-img").attr("src", e.target.result);
                    $("#cxt-preview").prepend(`<img id="cxt-preview-img" src="${e.target.result}" />`);
                }
  
                reader.readAsDataURL(image);
  
                $("#cropxtender").css("overflow", "visible");
  
                setTimeout(() => {
                    updateClip(0, 0, $("#cxt-preview-img").width(), $("#cxt-preview-img").height());
                    if (options && options.defaultZoom && typeof options.defaultZoom === "number") {
                        updateZoom(options.defaultZoom);
                    }
                    if (options && options.defaultFilter && typeof options.defaultFilter === "object") {
                        const filtersToApply = options.defaultFilter;
                        for (let filterType in filtersToApply) {
                            if (filtersToApply.hasOwnProperty(filterType)) {
                                updateFilter($('#cxt-preview-img'), filterType, filtersToApply[filterType] + "%");
                                $('#cxt-preview-img').attr("data-"+filterType, filtersToApply[filterType] + "%");
                            }
                        }
  
                    }
                    setTimeout(() => {
                        $("#cxt-preview-elm").css({
                            width: $("#cxt-preview").width() - 7,
                            height: $("#cxt-preview").height() - 7,
                        });
                    }, (250));
  
                }, 250);
  
                $("#cropxtender").css("overflow", "hidden");
  
                $("#cxt-backdrop").click(function () {
                    $("#cropxtender").remove();
                    fileInput.val("");
                });
  
                if (options && options.closeFunction && typeof options.closeFunction === "function") {
                    $("#cxt-close").click(function () {
                        options.closeFunction.call();
                    });
                } else {
                    $("#cxt-close").click(function () {
                        $("#cropxtender").remove();
                        fileInput.val("");
                    });
                }
  
                $("#cxt-crop-btn, #cxt-zoom-btn, #cxt-filter-btn").click(function () {
                  $("button[id$='btn']").removeClass("button-click")
                  $(this).addClass("button-click")
                })
  
                if (!(options && options.cropping === false)) {
                    $("#cxt-crop-btn").click(function () {
                        $("#cxt-preview-elm").css("display", "none");
                        $("#cxt-zoom").css("display", "none");
                        $("#cxt-filter").css("display", "none");
  
                        if (options.croppingAspectRatio) {
                            cropperOption(options.croppingAspectRatio);
                        } else {
                            cropperOption();
                        }
  
                        $('#cxt-preview-img').css("transform", "");
                    })
                } else {
                    $("#cxt-crop-btn").remove();
                }
  
                if (options && options.rotating === true) {
                    $("#cxt-rotate-btn").attr("data-rotate", 0);
                    $("#cxt-rotate-btn").click(function () {
                        const elm = $('#cxt-preview-img');
                        $("#cxt-preview-elm").css("display", "none");
                        $("#cxt-filter").css("display", "none");
                        $("#cxt-zoom").css("display", "none");
  
                        const currentAngle = parseInt($(this).attr("data-rotate"));
                        const flipX = elm.attr("data-flip-x") === "x";
                        const flipY = elm.attr("data-flip-y") === "y";
                        const zoom = elm.attr("data-zoom") ? parseFloat(elm.attr("data-zoom")) : 1;
                        elm.css("transform", `rotate(${currentAngle + 90}deg) scale(${flipX ? "-" + zoom : zoom}, ${flipY ? "-" + zoom : zoom})`);
                        const rotationAngle = ((currentAngle + 90) % 360) * Math.PI / 180;
                        elm.attr("data-rotate", rotationAngle);
                        $(this).attr("data-rotate", currentAngle + 90);
                    });
                } else {
                    $("#cxt-rotate-btn").remove();
                }
  
                if (options && options.flippingX === true) {
                    $("#cxt-flip-x-btn").click(function () {
                        const elm = $('#cxt-preview-img');
                        $("#cxt-preview-elm").css("display", "none");
                        $("#cxt-filter").css("display", "none");
                        $("#cxt-zoom").css("display", "none");
  
                        const flipX = elm.attr("data-flip-x") === "x";
                        const flipY = elm.attr("data-flip-y") === "y";
                        const rotate = parseInt($("#cxt-rotate-btn").attr("data-rotate"));
                        const zoom = elm.attr("data-zoom") ? parseFloat(elm.attr("data-zoom")) : 1;
                        elm.css("transform", `${rotate ? "rotate("+rotate+"deg)" : ""} scale(${flipX ? zoom : '-' + zoom}, ${flipY ? '-' + zoom : zoom})`);
                        elm.attr("data-flip-x", flipX ? "" : "x");
                    });
                } else {
                    $("#cxt-flip-x-btn").remove();
                }
  
                if (options && options.flippingY === true) {
                    $("#cxt-flip-y-btn").click(function () {
                        const elm = $('#cxt-preview-img');
                        $("#cxt-preview-elm").css("display", "none");
                        $("#cxt-filter").css("display", "none");
                        $("#cxt-zoom").css("display", "none");
  
                        const flipY = elm.attr("data-flip-y") === "y";
                        const flipX = elm.attr("data-flip-x") === "x";
                        const rotate = parseInt($("#cxt-rotate-btn").attr("data-rotate"));
                        const zoom = elm.attr("data-zoom") ? parseFloat(elm.attr("data-zoom")) : 1;
                        elm.css("transform", `${rotate ? "rotate("+rotate+"deg)" : ""} scale(${flipX ? '-' + zoom : zoom}, ${flipY ? zoom : '-' + zoom})`);
                        elm.attr("data-flip-y", flipY ? "" : "y");
                    });
                } else {
                    $("#cxt-flip-y-btn").remove();
                }
  
                if (options && options.zooming === true) {
                    $("#cxt-zoom-btn").click(function () {
                      let defaultZoom = 100;
                      if (options && options.defaultZoom && typeof options.defaultZoom === "number") {
                          defaultZoom = options.defaultZoom;
                      }
                        if ($("#cxt-zoom").length == 0) {
                            $("#cxt-sliders").append(`
                            <div id="cxt-zoom">
                                <label for="cxt-zoom-slider">Zoom</label>
                                <div class="cxt-sliders-inputs">
                                  <input id="cxt-zoom-slider" type="range" min="1" max="200" value="${defaultZoom}">
                                  <input id="cxt-zoom-value" type="number" value="${defaultZoom}">
                                </div>
                            </div>`);
                        } else {
                          $("#cxt-zoom").css("display", "block");
                        }
                        $("#cxt-preview-elm").css("display", "none");
                        $("#cxt-filter").css("display", "none");
                        $("#cxt-zoom-slider").off();
  
                          $("#cxt-zoom-slider").on("input", function () {
                              $("#cxt-zoom-value").val($(this).val());
                              updateZoom($(this).val());
                          });
                          $("#cxt-zoom-value").on("keyup", function () {
                              $("#cxt-zoom-slider").val($(this).val());
                              updateZoom($(this).val());
                          });
                    });
                } else {
                    $("#cxt-zoom-btn").remove();
                }
  
                if (options && options.filtering === true) {
                    $("#cxt-filter-btn").click(function () {
                        if ($("#cxt-filter").length == 0) {
                            $("#cxt-sliders").append(`<div id="cxt-filter"></div>`);
                        }
                        $("#cxt-preview-elm").css("display", "none");
                        $("#cxt-zoom").css("display", "none");
                        $("#cxt-filter").css("display", "flex");
                           let defaultFilter = {
                              brightness: 100,
                              contrast: 100,
                              grayscale: 0,
                              opacity: 100,
                              saturate: 100,
                              sepia: 0,
                          };
                          if (options && options.defaultFilter && typeof options.defaultFilter === "object") {
                              for (var filterType in options.defaultFilter) {
                                  if (options.defaultFilter.hasOwnProperty(filterType) && defaultFilter.hasOwnProperty(filterType)) {
                                      defaultFilter[filterType] = options.defaultFilter[filterType];
                                  }
                              }
                          }
                        if ($("#cxt-brightness-slider").length == 0) {
                            $("#cxt-filter").append(`
                            <div class="cxt-filter-slider">
                                <label for="cxt-brightness-slider">Luminosité</label>
                                <div class="cxt-sliders-inputs">
                                <input id="cxt-brightness-slider" type="range" min="0" max="200" value="${defaultFilter.brightness}">
                                <input id="cxt-brightness-value" type="number" value="${defaultFilter.brightness}">
                                </div>
                            </div>
                            <div class="cxt-filter-slider">
                                <label for="cxt-contrast-slider">Contraste</label>
                                <div class="cxt-sliders-inputs">
                                <input id="cxt-contrast-slider" type="range" min="0" max="200" value="${defaultFilter.contrast}">
                                <input id="cxt-contrast-value" type="number" value="${defaultFilter.contrast}">
                                </div>
                            </div>
                            <div class="cxt-filter-slider">
                            <label for="cxt-grayscale-slider">Niveaux de gris</label>
                                <div class="cxt-sliders-inputs">
                                <input id="cxt-grayscale-slider" type="range" min="0" max="100" value="${defaultFilter.grayscale}">
                                <input id="cxt-grayscale-value" type="number" value="${defaultFilter.grayscale}">
                                </div>
                            </div>
                            <div class="cxt-filter-slider">
                            <label for="cxt-opacity-slider">Opacité</label>
                                <div class="cxt-sliders-inputs">
                                <input id="cxt-opacity-slider" type="range" min="0" max="100" value="${defaultFilter.opacity}">
                                <input id="cxt-opacity-value" type="number" value="${defaultFilter.opacity}">
                                </div>
                            </div>
                            <div class="cxt-filter-slider">
                            <label for="cxt-saturate-slider">Saturation</label>
                                <div class="cxt-sliders-inputs">
                                <input id="cxt-saturate-slider" type="range" min="0" max="200" value="${defaultFilter.saturate}">
                                <input id="cxt-saturate-value" type="number" value="${defaultFilter.saturate}">
                                </div>
                            </div>
                            <div class="cxt-filter-slider">
                            <label for="cxt-sepia-slider">Sépia</label>
                                <div class="cxt-sliders-inputs">
                                <input id="cxt-sepia-slider" type="range" min="0" max="100" value="${defaultFilter.sepia}">
                                <input id="cxt-sepia-value" type="number" value="${defaultFilter.sepia}">
                                </div>
                            </div>
                            `);
                        }
  
                        $("#cxt-brightness-slider, #cxt-contrast-slider, #cxt-grayscale-slider, #cxt-opacity-slider, #cxt-saturate-slider, #cxt-sepia-slider").off();
  
                        $("#cxt-brightness-slider").on("input", function () {
                            updateFilter($('#cxt-preview-img'), "brightness", $(this).val() + "%");
                            $('#cxt-preview-img').attr("data-brightness", $(this).val() + "%");
                        });
                        $("#cxt-contrast-slider").on("input", function () {
                            updateFilter($('#cxt-preview-img'), "contrast", $(this).val() + "%");
                            $('#cxt-preview-img').attr("data-contrast", $(this).val() + "%");
                        });
                        $("#cxt-grayscale-slider").on("input", function () {
                            updateFilter($('#cxt-preview-img'), "grayscale", $(this).val() + "%");
                            $('#cxt-preview-img').attr("data-grayscale", $(this).val() + "%");
                        });
                        $("#cxt-opacity-slider").on("input", function () {
                            updateFilter($('#cxt-preview-img'), "opacity", $(this).val() + "%");
                            $('#cxt-preview-img').attr("data-opacity", $(this).val() + "%");
                        });
                        $("#cxt-saturate-slider").on("input", function () {
                            updateFilter($('#cxt-preview-img'), "saturate", $(this).val() + "%");
                            $('#cxt-preview-img').attr("data-saturate", $(this).val() + "%");
                        });
                        $("#cxt-sepia-slider").on("input", function () {
                            updateFilter($('#cxt-preview-img'), "sepia", $(this).val() + "%");
                            $('#cxt-preview-img').attr("data-sepia", $(this).val() + "%");
                        });
  
                        $("#cxt-brightness-value, #cxt-contrast-value, #cxt-grayscale-value, #cxt-opacity-value, #cxt-saturate-value, #cxt-sepia-value").off();
  
                        $("#cxt-brightness-value").on("keyup", function () {
                            updateFilter($('#cxt-preview-img'), "brightness", $(this).val() + "%");
                            $("#cxt-brightness-slider").val($(this).val());
                        });
                        $("#cxt-contrast-value").on("keyup", function () {
                            updateFilter($('#cxt-preview-img'), "contrast", $(this).val() + "%");
                            $("#cxt-contrast-slider").val($(this).val());
                        });
                        $("#cxt-grayscale-value").on("keyup", function () {
                            updateFilter($('#cxt-preview-img'), "grayscale", $(this).val() + "%");
                            $("#cxt-grayscale-slider").val($(this).val());
                        });
                        $("#cxt-opacity-value").on("keyup", function () {
                            updateFilter($('#cxt-preview-img'), "opacity", $(this).val() + "%");
                            $("#cxt-opacity-slider").val($(this).val());
                        });
                        $("#cxt-saturate-value").on("keyup", function () {
                            updateFilter($('#cxt-preview-img'), "saturate", $(this).val() + "%");
                            $("#cxt-saturate-slider").val($(this).val());
                        });
                        $("#cxt-sepia-value").on("keyup", function () {
                            updateFilter($('#cxt-preview-img'), "sepia", $(this).val() + "%");
                            $("#cxt-sepia-slider").val($(this).val());
                        });
                    });
                } else {
                    $("#cxt-filter-btn").remove();
                }
  
                if (options && options.iaGenerating === true) {} else {
                    $("#cxt-ia-btn").remove();
                }
  
                
                $("#cxt-save").click(function () {
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
                              let zoom = 1;
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
  
                              if (options.flippingX === true || options.flippingY === true) {
                                  const flipX = $("#cxt-preview-img").attr("data-flip-x") === "x";
                                  const flipY = $("#cxt-preview-img").attr("data-flip-y") === "y";
                                  if (options.zooming === true && $("#cxt-preview-img").attr("data-zoom")) {
                                      zoom = parseFloat($("#cxt-preview-img").attr("data-zoom"));
                                  }
                                  ctx.scale(flipX ? -zoom : zoom, flipY ? -zoom : zoom);
                              }
  
                              if (options.filtering === true) {
                                  const brightness = $("#cxt-preview-img").attr("data-brightness");
                                  const contrast = $("#cxt-preview-img").attr("data-contrast");
                                  const grayscale = $("#cxt-preview-img").attr("data-grayscale");
                                  const opacity = $("#cxt-preview-img").attr("data-opacity");
                                  const saturate = $("#cxt-preview-img").attr("data-saturate");
                                  const sepia = $("#cxt-preview-img").attr("data-sepia");
  
                                  ctx.filter = `${brightness ? "brightness("+brightness+")" : ""} ${contrast ? "contrast("+contrast+")" : ""} ${grayscale ? "grayscale("+grayscale+")" : ""} ${opacity ? "opacity("+opacity+")" : ""} ${saturate ? "saturate("+saturate+")" : ""} ${sepia ? "sepia("+sepia+")" : ""}`;
                              }
  
                              ctx.drawImage(img, -(width / 2) - left, -(height / 2) - top);
  
                              if (options.flippingX === true || options.flippingY === true) {
                                  const flipX = $("#cxt-preview-img").attr("data-flip-x") === "x";
                                  const flipY = $("#cxt-preview-img").attr("data-flip-y") === "y";
                                  if (options.zooming === true && $("#cxt-preview-img").attr("data-zoom")) {
                                      zoom = parseFloat($("#cxt-preview-img").attr("data-zoom"));
                                  }
                                  ctx.scale(flipX ? zoom : -zoom, flipY ? zoom : -zoom);
                              }
  
                              if (options.filtering === true) {
                                  ctx.filter = "none";
                              }
  
                              ctx.rotate(-rotationAngle);
                              ctx.translate(-x, -y);
                          } else {
                              let x = width / 2;
                              let y = height / 2;
                              let zoom = 1;
                              ctx.translate(x, y);
                              if (options.flippingX === true || options.flippingY === true) {
                                  const flipX = $("#cxt-preview-img").attr("data-flip-x") === "x";
                                  const flipY = $("#cxt-preview-img").attr("data-flip-y") === "y";
                                  if (options.zooming === true && $("#cxt-preview-img").attr("data-zoom")) {
                                      zoom = parseFloat($("#cxt-preview-img").attr("data-zoom"));
                                  }
                                  ctx.scale(flipX ? -zoom : zoom, flipY ? -zoom : zoom);
                              }
                              if (options.filtering === true) {
                                  const brightness = $("#cxt-preview-img").attr("data-brightness");
                                  const contrast = $("#cxt-preview-img").attr("data-contrast");
                                  const grayscale = $("#cxt-preview-img").attr("data-grayscale");
                                  const opacity = $("#cxt-preview-img").attr("data-opacity");
                                  const saturate = $("#cxt-preview-img").attr("data-saturate");
                                  const sepia = $("#cxt-preview-img").attr("data-sepia");
  
                                  ctx.filter = `${brightness ? "brightness("+brightness+")" : ""} ${contrast ? "contrast("+contrast+")" : ""} ${grayscale ? "grayscale("+grayscale+")" : ""} ${opacity ? "opacity("+opacity+")" : ""} ${saturate ? "saturate("+saturate+")" : ""} ${sepia ? "sepia("+sepia+")" : ""}`;
                              }
                              ctx.drawImage(img, -(width / 2) - left, -(height / 2) - top);
                              if (options.flippingX === true || options.flippingY === true) {
                                  const flipX = $("#cxt-preview-img").attr("data-flip-x") === "x";
                                  const flipY = $("#cxt-preview-img").attr("data-flip-y") === "y";
                                  if (options.zooming === true && $("#cxt-preview-img").attr("data-zoom")) {
                                      zoom = parseFloat($("#cxt-preview-img").attr("data-zoom"));
                                  }
                                  ctx.scale(flipX ? zoom : -zoom, flipY ? zoom : -zoom);
                              }
                              if (options.filtering === true) {
                                  ctx.filter = "none";
                              }
                              ctx.translate(-x, -y);
                          }
  
                          const dataUrl = canvas[0].toDataURL();
  
                          if (options && options.saveFunction && typeof options.saveFunction === 'function') {
                              options.saveFunction(dataUrl);
                              $("#cropxtender").remove();
                          } else {
                              const dataTransfer = new DataTransfer();
                              const blob = dataURLtoBlob(dataUrl);
                              const file = new File([blob], 'image.png', {
                                  type: 'image/png'
                              });
                              dataTransfer.items.add(file);
                              fileInput[0].files = dataTransfer.files;
                              $("#cropxtender").remove();
                          }
                      };
                  };
  
                  reader.readAsDataURL(image);
              });
            }
        });
    });
  };