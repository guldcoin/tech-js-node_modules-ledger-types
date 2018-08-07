module.exports = [
  {
    target: 'web',
    entry: {
      index: './types.js'
    },
    output: {
      filename: 'ledger-types.min.js',
      path: __dirname,
      library: 'ledgerTypes',
      libraryTarget: 'var'
    }
  }
]
