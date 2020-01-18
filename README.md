# Schrift
## Plugin for Tailwind CSS

This Tailwind CSS plugin adds additional utility classes for a fluid font system using modular scales. The font base sizes and necessary scales as well as the ratios between them can be configured.

### Installation

*Schrift* is part of the npm registry and can be installed using *npm* or *yarn*:

```
npm install tailwindcss-schrift
```
or
```
yarn add tailwindcss-schrift
```

Then you can require the plugin in your Tailwind config:

```
plugins: [
  require('tailwindcss-schrift')
]
```

### Usage

*Schrift* will generate one utility class for each configured scale following the scheme `text-ms-{number of scale}`. For example `text-ms-0` and `text-ms-1` relate to scale 0 and scale 1, respectively.

Negative scales are also possible (e.g. `text-ms--1`).

### Settings
The font base sizes and necessary scales as well as the ratios between them can be adjusted on project basis in your `tailwind.config.js` file. The following section contains a list of all options, which can be used to tweak the font sizes.

#### Available Settings

| Setting       | Description                                                            |
|---------------|------------------------------------------------------------------------|
| minFontSize   | Defines the font-size for the configured minimum breakpoint and below. |
| maxFontSize   | Defines the font-size for the configured maximum breakpoint and above. |
| minRatio      | Ratio used for the minimum breakpoint and below.                       |
| maxRatio      | Ratio used for the maximum breakpoint and above.                       |
| scales        | All the scales for which utility classes should be created.            |
| minBreakpoint | Minimum breakpoint, where the font should start to scale.              |
| maxBreakpoint | Maximum breakpoint, where the font should stop to scale.               |

Between `minBreakpoint` and `maxBreakpoint` the font-size and ratio is interpolated linearly.

#### Default Configuration
If no custom settings are defined, *Schrift* defaults to the following values:
```
schrift: {
  minFontSize: '16px',
  maxFontSize: '18px',
  minRatio: 1.1,
  maxRatio: 1.15,
  scales: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
  minBreakpoint: '320px',
  maxBreakpoint: '1200px',
}
```




