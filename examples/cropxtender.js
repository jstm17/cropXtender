$.fn.cropxtender = function(options) {
    return this.each(function() {
        const fileInput = $(this);
        fileInput.change(function() {
            console.log(options);
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

                const rules = `
                #cropxtender {
                    display           : flex;
                    flex-direction    : column;
                    width             : 100%;
                    height: 100vh;
                    position: absolute;
                    z-index: 98;
                    top: 0;
                    left: 0;
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
                    width : 450px;
                    height: 450px;
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
                    width     : 1000px;
                    height    : 1000px;
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
                    height: 100%;
                    object-fit: fill;
                }
                `;

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
                    html2canvas(element.get(0)).then(function(canvas) {
                        $("#cxt-preview").html(canvas);
                    });    
                }, 500);

                $("#cropxtender").css("overflow", "hidden");

                $("#cxt-backdrop").click(function() {
                    $("#cropxtender").remove();
                    fileInput.val("");
                })
                $("#cxt-close").click(function() { 
                    $("#cropxtender").remove();
                    fileInput.val("");
                });
            }
        });
    });
};
