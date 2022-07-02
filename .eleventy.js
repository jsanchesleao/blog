const { DateTime } = require('luxon')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.addPassthroughCopy('./src/css/')
  eleventyConfig.addWatchTarget('./src/css/')

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`)

  eleventyConfig.addFilter('postDate', (dateObj) => {
    if (!dateObj) {
      return "Draft"
    }
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  const now = new Date()

  eleventyConfig.addCollection("posts", (collection) => {
    return collection.getFilteredByGlob('./src/posts/*.md')
      .filter(post => !post.data.draft || process.env.ALLOW_DRAFT === "true")
      .sort((a, b) => {
        (b.data.date || now).valueOf() - (a.data.date || now).valueOf()
      })
  })

  return {
    dir: {
      input: 'src',
      output: 'public'
    }
  }
}
