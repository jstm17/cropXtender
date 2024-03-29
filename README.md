<p align='center'> <a href="https://imgbb.com/"><img src="https://cdn.discordapp.com/attachments/890222905089216584/1195383372525080576/Group_22.png?ex=65b3ca85&is=65a15585&hm=3924acafb3007231d671eaecffe97ac841268abcb4d5a27cc752ccaa87445bf1&" alt="logo-eat2gether" border="0"></a></p>

# CropXtender

CropXtender is a jQuery package for extending and customizing image cropping functionality. It allows users to crop images with additional features such as resizing, rotating, flipping, zooming, and more.

Visit the [CropXtender Documentation](https://cropxtender.netlify.app/docs.html) for detailed information on installation, configuration, and usage.

## Features

- Image cropping with customizable options.
- Resizing, rotating, and flipping functionalities.
- Zooming and filtering options.
- Easy integration with jQuery.
- Responsive design for various devices.
- Customizable plugin settings to fit your specific project requirements.

## Demo

Explore the [CropXtender Demo](https://cropxtender.netlify.app/editor.html) to see the plugin in action.


## Getting Started

### Prerequisites

- jQuery library

### Installation

Include the jQuery library and CropXtender plugin files in your project:

```bash
npm install cropxtender
```
```html
<!-- Include jQuery -->
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

<!-- Include CropXtender plugin -->
<script src="path/to/cropxtender.js"></script>
```

### Usage

```javascript
$("#cropxtender-input").cropxtender({
    // Configuration options go here
});
```

### Configuration Options

- **saveFunction**: Custom function to be executed when the user clicks the save button.
- **closeFunction**: Custom function to be executed when the user clicks the close button.
- **saveButtonText**: Text for the save button.
- **closeButtonText**: Text for the close button.
- **saveButtonStyle**: Styles for the save button.
- **closeButtonStyle**: Styles for the close button.
- **modalStyle**: Styles for the modal.
- **cropping**: Enable or disable cropping.
- **croppingAspectRatio**: Enable or disable aspect ratio for cropping.
- **croppingButtonText**: Text for the cropping button.
- **rotating**: Enable or disable rotating.
- **rotatingButtonText**: Text for the rotating button.
- **flippingX**: Enable or disable horizontal flipping.
- **flippingXButtonText**: Text for the horizontal flipping button.
- **flippingY**: Enable or disable vertical flipping.
- **flippingYButtonText**: Text for the vertical flipping button.
- **zooming**: Enable or disable zooming.
- **zoomingButtonText**: Text for the zooming button.
- **defaultZoom**: Default zoom params.
- **filtering**: Enable or disable filtering.
- **filteringButtonText**: Text for the filtering button.
- **defaultFilter**: Default filter params.
- **iaGenerating**: Enable or disable image generation using AI (WIP)
- **iaGeneratingButtonText**: Text for the AI image generation button.
- **optionButtonStyle**: Styles for the option buttons.
- **optionButtonContainerStyle**: Styles for the container of option buttons.
- **optionSliderStyle**: Styles for the option slider.
- **jqueryUiImport**: Import jQuery UI (true/false).
- **cssImport**: Import additional CSS (true/false).
- **forceDisableCSS**: Forcefully disable CSS (true/false).

### Examples

```javascript
$("#cropxtender-input").cropxtender({
    saveFunction: function (image) { console.log(image); },
    saveButtonText: "Yes",
    closeButtonText: "No",
    croppingAspectRatio: {x: 1, y: 1},
    croppingButtonText: "Crop & resize",
    rotating: true,
    rotatingButtonText: "Rotate 90deg"
});
```

More examples are available in examples folder

### Contributing

Feel free to contribute to this project. Submit issues for bug reports or feature requests, and create pull requests for improvements.

