# CropXtender

CropXtender is a jQuery plugin for extending and customizing image cropping functionality. It allows users to crop images with additional features such as resizing, rotating, flipping, zooming, and more.

## Features

- Image cropping with customizable options.
- Resizing, rotating, and flipping functionalities.
- Zooming and filtering options.
- Easy integration with jQuery.
- Responsive design for various devices.

## Getting Started

### Prerequisites

- jQuery library

### Installation

Include the jQuery library and CropXtender plugin files in your project:

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

- saveButtonText: Text for the save button.
- closeButtonText: Text for the close button.
- saveButtonStyle: Styles for the save button.
- closeButtonStyle: Styles for the close button.
- croppingAspectRatio: Aspect ratio for cropping.
- resize: Enable or disable resizing.
- cropping: Enable or disable cropping.
- rotating: Enable or disable rotating.
- flipping: Enable or disable flipping.
- zooming: Enable or disable zooming.
- filtering: Enable or disable filtering.

### Examples

```javascript
$("#cropxtender-input").cropxtender({
    croppingAspectRatio: { x: 1, y: 1 },
    resize: true,
    cropping: true,
    rotating: true,
    flipping: true,
    zooming: true,
    filtering: true,
});
```
### Contributing

Feel free to contribute to this project. Submit issues for bug reports or feature requests, and create pull requests for improvements.

