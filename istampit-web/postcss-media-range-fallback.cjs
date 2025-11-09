module.exports = () => {
  const rangePattern = /\(\s*(width|height)\s*([<>]=?)\s*([^\)]+)\)/g;

  const convertCondition = (match, feature, operator, value) => {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return match;
    }

    const comparison = operator.replace(/\s+/g, '');
    if (comparison === '>=' || comparison === '>') {
      return `(min-${feature}: ${normalizedValue})`;
    }

    if (comparison === '<=' || comparison === '<') {
      return `(max-${feature}: ${normalizedValue})`;
    }

    return match;
  };

  return {
    postcssPlugin: 'postcss-media-range-fallback',
    AtRule: {
      media(atRule) {
        if (!rangePattern.test(atRule.params)) {
          rangePattern.lastIndex = 0;
          return;
        }

        rangePattern.lastIndex = 0;
        const converted = atRule.params.replace(rangePattern, convertCondition);

        if (converted !== atRule.params) {
          atRule.params = converted;
        }
      },
    },
  };
};

module.exports.postcss = true;
