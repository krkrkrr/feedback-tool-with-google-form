/**
 * Checks if a given URL is a Twitter tweet URL.
 * @function
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is a Twitter tweet URL, otherwise false.
 */
function isTweet(url) {
  const tweetUrlPattern = /https:\/\/[x|twitter].com\/.+\/status\/.+/
  return tweetUrlPattern.test(url)
}

/**
 * Convert to Twitter URL.
 * @function
 * @param {string} url - The URL to check.
 * @returns {string} Twitter URL.
 */
function toTwitterUrl(url) {
  const tweetUrlPattern = /https:\/\/[x|twitter].com\/.+\/status\/.+/
  return url.replace(
    /https:\/\/[x|twitter].com\/(.+)\/status\/(.+)/,
    'https://twitter.com/$1/status/$2'
  )
}

/**
 * Get Tweet contents.
 * @function
 * @param {string} url - The URL to check.
 * @returns {string} Tweet contents.
 */
function getTweetEmbedHtml(url) {
  const getApiUrl =
    'https://publish.twitter.com/oembed?url=' + toTwitterUrl(url)
  const response = UrlFetchApp.fetch(getApiUrl)
  const json = JSON.parse(response.getContentText())
  return json.html
}

/**
 * Embed Tweet html to Text for Google Docs.
 * @function
 * @param {string} url - The URL to check.
 * @returns {string} Tweet User and contents.
 */
function getTweetEmbedText(url) {
  const tweetEmbedHtml = getTweetEmbedHtml(url)
  const allMatchObj = [...tweetEmbedHtml.matchAll(/<p.*?>(.+)<\/p>(.+?)</g)]
  for (const matchObj of allMatchObj) {
    return (
      matchObj[1].replaceAll(/<br>/g, '\n') +
      '\n' +
      matchObj[2].replaceAll(/&mdash;/gu, '─') +
      '\n' +
      url
    )
  }
  return url
}

/**
 * get image by twitter image url.
 * @function
 * @param {string} url - The URL to check.
 * @returns {Blob} image.
 */
function getImageBlob(url) {
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true })
  console.log(response.getResponseCode())
  console.log(response.getHeaders())
  console.log(response.getContentText())
  return response.getBlob()
}
