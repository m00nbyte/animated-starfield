# Animated Starfield

## Description

This package is a customizable animated starry background effect for web pages. It allows you to create an interactive and dynamic background of blinking stars, with customizable options such as background color, star amount, star size, blink duration, and animation direction.

### Demos

![demos](/test/demos.gif)

## Usage

#### **Option 1: Using ES Module**

```html
<div class="starfield">
    <!-- content -->
</div>
```

```js
import animatedStarField from 'https://cdn.jsdelivr.net/gh/m00nbyte/animated-starfield@latest/dist/index.es.min.js';

const options = {
    container: '.starfield',
    ...
};

animatedStarField(options);
```

#### **Option 2: Using IIFE**

```html
<div class="starfield">
    <!-- content -->
</div>

<script src="https://cdn.jsdelivr.net/gh/m00nbyte/animated-starfield@latest/dist/index.iife.min.js"></script>
```

```js
const options = {
    container: '.starfield',
    ...
};

window.animatedStarField(options);
```

## Default options

```js
const options = {
    container: null,
    background: '#141d27',
    direction: 0,
    sizes: {
        amount: 50,
        color: '#ffffff',
        speed: 0.8,
        blink: 2000
    },
    medium: {
        amount: 50,
        color: '#ffffff',
        speed: 0.6,
        blink: 2000
    },
    large: {
        amount: 50,
        color: '#ffffff',
        speed: 0.5,
        blink: 2000
    }
};
```

## Properties

The animatedStarField function accepts an options object with the following properties:

### `container`

Type: `String`<br />

A CSS selector for the container element where the star animation will be rendered. This parameter is required and cannot be updated later.

### `background`

Type: `String`<br />

The background color for the stars animation. Any valid CSS color value is accepted.

### `direction`

Type: `Number | null`<br />

The direction in which the stars move in degrees:

-   `0` points directly `down`
-   `90` points to the `left`
-   `180` points directly `up`
-   `270` points to the `right`
-   `360` brings it back to `down`

If you set it to `-1`, the stars will move randomly.
If you set it to `null`, the stars will stop moving.

### `sizes`

Type: `Object`<br />

Configures the stars' appearance and behavior for different star sizes: `small`, `medium` and `large`.

Each size has the following properties:

#### `amount`

Type: `Number`<br />

The number of stars of that size.

#### `color`

Type: `String`<br />

The color for the stars. Any valid CSS color value is accepted.

#### `speed`

Type: `Number`<br />

The speed at which the stars move across the screen. A higher value increases the speed, while a lower value slows it down.

#### `blink`

Type: `Number`<br />

The duration (in milliseconds) for a star of that size to blink. To disable set to `0`.

## Update options

#### `updateOptions`

Type: `Function`<br />

This function allows you to dynamically update the options of the animated stars after the initial animation has started. This is useful for making real-time changes to the star background, such as modifying the speed, direction, or star appearance without needing to restart the animation.

Just pass an object containing the properties to update. You can provide any combination of the options defined in the initial options. Only the specified properties will be updated, the others will remain unchanged.

```js
const options = {
    container: '#star-container',
    ...
};

const starsInstance = animatedStarField(options);

// update the options anytime
if (starFieldInstance) {
    starFieldInstance.updateOptions({
        sizes: {
            small: {
                amount: 60,
                blink: 1500
            }
        }
    });
}
```

## Contribution

Feel free to submit issues or pull requests.

## Like my work?

This project needs a :star: from you.
Don't forget to leave a star.

<a href="https://www.buymeacoffee.com/m00nbyte" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="217" height="60">
</a>

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
