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
