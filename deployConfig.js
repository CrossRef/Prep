var babelCompatibility = {
  presets: ['env', 'stage-0', "react"]
}

var babelDev = {
  presets: ["react"],
  plugins: [
    'transform-do-expressions',
    'transform-object-rest-spread',
    'transform-class-properties',
    'transform-es2015-modules-commonjs'
  ]
}


var presets = {
  production: {
    baseUrl: '',
    apiBaseUrl: '',
    babelConfig: babelCompatibility
  },

  staging: {
    baseUrl: '/participationreports/',
    apiBaseUrl: '',
    babelConfig: babelDev
  }
}

//Set preset here:
module.exports = presets.staging
