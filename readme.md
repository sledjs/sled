# Sled
Slide smooth like sled upon 45 degress hill.

## modules 
##### sled contains three modules

* [core](https://github.com/sledjs/core)
* [slides](https://github.com/sledjs/slides)
* [keys](https://github.com/sledjs/keys)

# installation
## cdn
#### [sled.js](https://npmcdn.com/sled/lib/sled.js) and [sled.css](https://npmcdn.com/sled/lib/sled.css)

```html
<link rel='stylesheet' href='https://npmcdn.com/sled/lib/sled.css'>
<script src='https://npmcdn.com/sled/lib/sled.js'></script>
<script> 
let slider = new Sled($slider);

/* write here */ 
</script>
```

## npm
```sh
$ npm i sled
```

```js
const Sled = require('sled');

let slider = new Sled($slider);
```

tested with webpack

## usage

```html
<div class='sled'>
  <div class='slides'>

    <img class='slide' src='...'>
    <img class='slide' src='...'>
    <div class='slide'>
      <img src='...'>
    </div>
    <div class='slide'>
      <span> content </span>
      <img src='...'>
    </div>

  </div>
</div>
<script>
  let $slider = document.querySelector('.sled');

  let slider = new Sled($slider);
</script>
```
##### slides
```js
let slides = slider.module('slides'); // slider.modules.slides

slides.next();
slides.prev();
slides.next();
slides.next();

slides.changeTo(2); // slide to second slide

// Also you're can change slides with arrow Keys.

```
