# Sled
Slide smooth like sled upon 45 degress hill.
# installation
## cdn
#### [sled.js](https://npmcdn.com/sled/lib/sled.js) and [sled.css](https://npmcdn.com/sled/lib/sled.css)

```html
<link rel='stylesheet' href='https://npmcdn.com/sled/lib/sled.css'>
<script src='https://npmcdn.com/sled/lib/sled.js'></script>
<script>

let slider = new Sled($slider);

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

  new Sled($slider);
</script>
```
