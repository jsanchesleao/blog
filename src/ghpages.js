const ghpages = require('gh-pages')

ghpages.publish('public', (err) => {
  if (err) {
    console.log(err)
  }
  else {
    console.log('Successfully pushed blog to GitHub Pages')
  }
})
