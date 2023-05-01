const exe = require('@angablue/exe');
const build = exe({
    entry: 'src/index.js',
    out: 'build/Whatsappautobot.exe',
    pkg: ['--public'], // Specify extra pkg arguments
    version: '0.4.3',
    target: 'node18-win-x64',
    icon: 'build/icons/whatsappautobot.ico', // Application icons must be in .ico format

});

build.then(() => console.log('Build completed!'));