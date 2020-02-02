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

const addModularScaleTextClassesWithMediaQuery = ({
  addUtilities,
  e,
  addVariant,
  theme,
}, schrift) => {
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

const addModularScaleTextClassesWithoutMediaQuery = ({
  addUtilities,
}, schrift) => {
  const {
    minFontSize,
    maxFontSize,
    scales,
    minRatio,
    maxRatio,
    minBreakpoint,
    maxBreakpoint,
  } = schrift;

  const textUtilities = {};
  scales.forEach((scale) => {
    const selector = `.${TEXT_CLASS_BASE}${scale}`;

    const minFontSizeScaled = calcScale(minFontSize, minRatio, scale);
    textUtilities[`${selector}--min`] = {
      fontSize: `${minFontSizeScaled}px`,
    };

    const maxFontSizeScaled = calcScale(maxFontSize, maxRatio, scale);
    textUtilities[`${selector}--max`] = {
      fontSize: `${maxFontSizeScaled}px`,
    };

    const fontSizeFluid = calcFluid(minFontSizeScaled,
      maxFontSizeScaled, minBreakpoint, maxBreakpoint);
    textUtilities[`${selector}--fluid`] = {
      fontSize: fontSizeFluid,
    };
  });

  addUtilities(textUtilities);
};

const addModularScaleTextClasses = (options) => {
  const schrift = { ...defaultConfig, ...options.theme('schrift', {}) };
  addModularScaleTextClassesWithMediaQuery(options, schrift);
  addModularScaleTextClassesWithoutMediaQuery(options, schrift);
};

module.exports = addModularScaleTextClasses;
