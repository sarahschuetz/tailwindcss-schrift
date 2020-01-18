const postcss = require('postcss');
const defaultConfig = require('../default.config');

const VARIANT = 'schrift';
const TEXT_CLASS_BASE = 'text-ms-';

const calcScale = (base, ratio, scale) => parseInt(base, 10) * (ratio ** scale);

const calcFluid = (minFontSize, maxFontSize, minBreakPoint, maxBreakPoint) => `calc(${minFontSize}px + ${maxFontSize - minFontSize} * ((100vw - ${parseInt(minBreakPoint, 10)}px) / ${parseInt(maxBreakPoint, 10) - parseInt(minBreakPoint, 10)}))`;

const addSchriftVariant = (addVariant, e, theme, schrift) => {
  addVariant(VARIANT, ({ container }) => {
    // remove duplicated classes in root
    Array.from(container.nodes).forEach((node) => {
      node.remove();
    });

    const {
      minFontSize,
      maxFontSize,
      scales,
      minRatio,
      maxRatio,
      minBreakpoint,
      maxBreakpoint,
    } = schrift;

    const fluidMediaRule = postcss.atRule({ name: 'media', params: `(min-width: ${minBreakpoint})` });
    const maxMediaRule = postcss.atRule({ name: 'media', params: `(min-width: ${maxBreakpoint})` });

    scales.forEach((scale) => {
      const selector = `.${TEXT_CLASS_BASE}${scale}`;
      const minFontSizeScaled = calcScale(minFontSize, minRatio, scale);
      const maxFontSizeScaled = calcScale(maxFontSize, maxRatio, scale);

      // set fluid size for font
      const fontSizeFluidBreakpoint = calcFluid(minFontSizeScaled,
        maxFontSizeScaled, minBreakpoint, maxBreakpoint);

      const fluidRule = new postcss.rule({ selector }); // eslint-disable-line
      fluidRule.append({ prop: 'font-size', value: `${fontSizeFluidBreakpoint}` });

      // set max size for font
      const maxRule = new postcss.rule({ selector }); // eslint-disable-line
      maxRule.append({ prop: 'font-size', value: `${maxFontSizeScaled}px` });

      fluidMediaRule.append(fluidRule);
      maxMediaRule.append(maxRule);
      container.append(fluidMediaRule);
      container.append(maxMediaRule);
    });
  });
};

const addModularScaleTextClasses = ({
  addUtilities,
  e,
  addVariant,
  theme,
}) => {
  const schrift = { ...defaultConfig, ...theme('schrift', {}) };

  const {
    minFontSize,
    minRatio,
    scales,
  } = schrift;

  const textUtilities = {};
  scales.forEach((scale) => {
    const selector = `.${TEXT_CLASS_BASE}${scale}`;
    const fontSize = calcScale(minFontSize, minRatio, scale);

    textUtilities[selector] = {
      fontSize: `${fontSize}px`,
    };
  });

  addUtilities(textUtilities, [VARIANT]);
  addSchriftVariant(addVariant, e, theme, schrift);
};

module.exports = addModularScaleTextClasses;
