const fs = require('fs');
const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function (source) {
  this.cacheable();
  const callback = this.async();

  const options = loaderUtils.getOptions(this) || {};
  const optionsIconPath = options.iconPath || '';
  const context = this.rootContext;

  let newSource = source.toString();
  const firstMatch = newSource.matchAll(/<(svg[^-]([\s\w\d\"\'\!\.\-\_=*{}\[\]\$\(\);]*)icon=\"(.*)\")([\s\w]*)>[\s]*<\/svg>/g);

  const found = [...firstMatch];
  if (found && found.length) {
    for (let i = 0; i < found.length; i++) {
      const element = found[i];
      const iconName = element[3];
      const iconAttributes = element[2];
      const leaveFillAttribute = element[4].includes('fill');
      const pathToIcon = loaderUtils.urlToRequest(optionsIconPath + iconName + '.svg');
      const fullPathToIcon = path.resolve(context, pathToIcon);

      this.addDependency(fullPathToIcon);
      let currentIcon = fs.readFileSync(fullPathToIcon, 'utf-8')
      currentIcon = '###' + currentIcon
      if (!leaveFillAttribute) {
        currentIcon = currentIcon.replace(/fill=".*?"/g, '')
      }
      currentIcon = currentIcon.replace(/\s\s+/g, ' ');
      newSource = newSource.replace(/<(svg[^-]([\s\w\d\"\'\!\.\-\_=*{}\[\]\$\(\);]*)icon=\"(.*)\")([\s\w]*)>[\s]*<\/svg>/, currentIcon);
      newSource = newSource.replace('###<svg', '<svg ' + iconAttributes)
    }
    callback(null, newSource);
  }
  else {
    callback(null, newSource);
  }
};

module.exports.raw = true;
