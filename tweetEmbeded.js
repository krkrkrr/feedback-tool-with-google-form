/**
 * Checks if a given URL is a Twitter tweet URL.
 * @function
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is a Twitter tweet URL, otherwise false.
 */
function isTweet(url) {
  const tweetUrlPattern = /https:\/\/twitter.com\/.+\/status\/.+/
  return tweetUrlPattern.test(url)
}

/**
 * Get Tweet contents.
 * @function
 * @param {string} url - The URL to check.
 * @returns {string} Tweet contents.
 */
function getTweetContents(url) {
  const getApiUrl = 'https://publish.twitter.com/oembed?url=' + url
  const response = UrlFetchApp.fetch(getApiUrl)
  const json = JSON.parse(response.getContentText())
  return json.html
}
