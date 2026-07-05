const sharp = require('sharp');
sharp('businesslogo.png')
  .trim()
  .toFile('favicon.png')
  .then(() => console.log('Cropped successfully!'))
  .catch(e => console.error(e));
