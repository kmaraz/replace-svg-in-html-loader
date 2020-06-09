const fs = require('fs');
const loaderUtils = require('loader-utils');
const path = require('path');
const attributeValueRegexp = '[^"]*?';
const htmlAttributeRegexp = `\\s*[^\\s="]+="${attributeValueRegexp}"`;
const iconAttributeRegexp = `icon="(${attributeValueRegexp})"`;
const regexp = new RegExp(
  `<svg((?:${htmlAttributeRegexp})+)\\s+${iconAttributeRegexp}([\s\w]*)>[\\s]*<\\/svg>`
);
const regexpGlobal = new RegExp(regexp.source, `${regexp.flags}g`);

/** @type {Map<string, string>} */
const iconCache = new Map();

/** @type {import('webpack').loader.Loader} */
module.exports = function (source) {
  this.cacheable();
  const callback = this.async();

  const options = loaderUtils.getOptions(this) || {};
  const optionsIconPath = options.iconPath || '';
  const context = this.rootContext;

  let newSource = source.toString();
  const firstMatch = newSource.matchAll(regexpGlobal);

  const found = [...firstMatch];
  if (found && found.length) {
    for (let i = 0; i < found.length; i++) {
      const element = found[i];
      const iconName = element[2];
      const iconAttributes = element[1];
      const leaveFillAttribute = (element[3] || '').includes('fill');
      const pathToIcon = loaderUtils.urlToRequest(optionsIconPath + iconName + '.svg');
      const fullPathToIcon = path.resolve(context, pathToIcon);

      this.addDependency(fullPathToIcon);

      let currentIcon = iconCache.get(fullPathToIcon);
      if (!currentIcon) {
        currentIcon = '###' + fs.readFileSync(fullPathToIcon, 'utf-8');
        iconCache.set(fullPathToIcon, currentIcon);
      }

      if (!leaveFillAttribute) {
        currentIcon = currentIcon.replace(/fill=".*?"/g, '')
      }
      currentIcon = currentIcon.replace(/\s\s+/g, ' ');
      newSource = newSource.replace(regexp, currentIcon);
      newSource = newSource.replace('###<svg', '<svg ' + iconAttributes.trim())
    }
    callback(null, newSource);
  }
  else {
    callback(null, newSource);
  }
};

module.exports.raw = true;
