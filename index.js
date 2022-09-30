const r = require(`./resolver`);

function preset(context, options = {}) {
  const {
    browser = false,
    debug = false,
    nodeVersion = `18.6.0`,
    esm = false
  } = options;
  const {NODE_ENV, BABEL_ENV} = process.env;

  const IS_TEST = (BABEL_ENV || NODE_ENV) === `test`;

  const browserConfig = {
    useBuiltIns: false
  };

  if (browser) {
    if (esm) {
      browserConfig.targets = {
        esmodules: true
      };
    } else {
      browserConfig.targets = {
        browsers: [
          `last 3 versions`,
          `not ie <= 11`,
          `not android 4.4.3`,
          `safari >= 6`
        ]
      };
    }
  }

  const nodeConfig = {
    corejs: 3,
    useBuiltIns: `usage`,
    targets: {
      node: nodeVersion
    }
  };

  return {
    presets: [
      [
        r(`@babel/preset-env`),
        Object.assign(
          {
            loose: true,
            debug: !!debug,
            shippedProposals: true,
            modules: esm ? false : `commonjs`,
            bugfixes: esm
          },
          browser ? browserConfig : nodeConfig
        )
      ],
      [
        r(`@babel/preset-react`),
        Object.assign({
          runtime: 'automatic'
        })
      ]
    ],
    plugins: [
      [
        r(`@babel/plugin-proposal-class-properties`),
        Object.assign({
          loose: true
        })
      ],
      r(`@babel/plugin-transform-runtime`),
      r(`@babel/plugin-syntax-dynamic-import`),
      r(`babel-plugin-css-modules-transform`),
      [
        r(`@babel/plugin-proposal-decorators`),
        Object.assign({
          decoratorsBeforeExport: true
        })
      ],
      [
        r(`@compiled/babel-plugin`),
        Object.assign({
          importReact: false
        })
      ],
      IS_TEST && r(`babel-plugin-dynamic-import-node`)
    ].filter(Boolean),
    overrides: [
      {
        test: [`**/*.ts`, `**/*.tsx`],
        plugins: [[`@babel/plugin-transform-typescript`, {isTSX: true}]]
      }
    ]
  };
}

module.exports = preset;
