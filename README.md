# replace-svg-in-html-loader

The `replace-svg-in-html-loader` finds SVG placeholders in HTML templates and replaces them with SVG file contents.

## Getting Started

To begin, you'll need to install `replace-svg-in-html-loader`:

```console
npm install --save-dev @kmaraz/replace-svg-in-html-loader
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
       {
          test: /\.html$/i,
          use: [{
            loader: '@kmaraz/replace-svg-in-html-loader'
          }],
          exclude: [/node_modules/]
        }
    ],
  },
};
```

### `iconPath`

You can also specify the preferred icon path:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [{
          loader: '@kmaraz/replace-svg-in-html-loader',
          options: {
            iconPath: '~assets/icons/'
          }
        }],
        exclude: [/node_modules/]
      }
    ],
  },
};
```

## How it works?

`replace-svg-in-html-loader` searches for SVG icons in HTML template.

### Example #1

**index.html** in our source.

```html
<div>
  <!-- full path will be ~assets/icons/md-add.svg -->
  <svg class="icon-size14" icon="md-add"></svg>
</div>
```

**index.html** with replaced icons.

```html
<div>
  <svg class="icon-size14" viewBox="659 4098.5 24 24">
    <g transform="translate(659 4098.5)">
      <path d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z"/>
    </g>
  </svg>
</div>
```

### Example #2 (with default fill)

**index.html** in our source.

```html
<div>
  <!-- full path will be ~assets/icons/md-add.svg -->
  <svg class="icon-size14" icon="md-add" fill></svg>
</div>
```

**index.html** with replaced icons.

```html
<div>
  <svg class="icon-size14" viewBox="659 4098.5 24 24">
    <g transform="translate(659 4098.5)">
      <path fill="#123456" d="M19,13H13v6H11V13H5V11h6V5h2v6h6Z"/>
    </g>
  </svg>
</div>
```

## IMPORTANT!

Sorry, but order of attributes in the icon placeholder is strict in a sense, that
* `icon` must be at the end
* `fill` is optional and must be the very last attribute after `icon`.

### Valid
```html
<div>
  <svg icon="md-add"></svg>
  <svg class="icon-size14" icon="md-add"></svg>
  <svg class="icon-size14" icon="md-add" fill></svg>
  <svg icon="md-add" fill></svg>
  <svg *ngIf="test" class="icon-size14" icon="md-add" fill></svg>
</div>
```

### Invalid
```html
<div>
  <svg icon="md-add" class="icon-size14"></svg>
  <!-- This will work, but without default fill -->
  <svg fill icon="md-add"></svg>
  <!-- This will not work -->
  <svg *ngIf="test" icon="md-add" class="icon-size14"></svg>
</div>
```
