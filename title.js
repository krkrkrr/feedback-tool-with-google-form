/**
 * Retrieves the title of a web page given its URL.
 * @param {string} url - The URL of the web page to retrieve the title for.
 * @returns {string} The title of the web page, or the URL if the title cannot be retrieved.
 */
function getPageTitle(url) {
  // Attempt to fetch the web page
  const response = tryFetch(url, 0)
  // If the web page was successfully retrieved, extract the title from its HTML content
  if (response) {
    const html = getHtmlFromResponse(response)
    const titleRegexp = new RegExp('<title>(.+)</title>', 'g')
    const title = getMatchText(html, titleRegexp)
    if (title != '') {
      return title
    }
  }
  return url
}

/**
 * Extracts HTML from a HTTP response and returns it as a string.
 * @param {HTTPResponse} response - The HTTP response object to extract HTML from.
 * @returns {string} - The HTML content of the response as a string.
 */
function getHtmlFromResponse(response) {
  const OTHER_CHARSET_LIST = ['Shift_JIS', 'EUC-JP']
  const encodingUtf8 = response.getContentText()
  const charsetRegexp = /charset=(.+)[s"]/g
  const charset = getMatchText(encodingUtf8, charsetRegexp)
  if (OTHER_CHARSET_LIST.includes(charset)) {
    return response.getContentText(charset)
  }
  return encodingUtf8
}

/**
 * Return the first matched string in the given text using the specified pattern.
 * @param {string} text - The text to search for matches.
 * @param {RegExp} pattern - The regular expression pattern to match against the text.
 * @returns {string} - The first matched string found in the text, or an empty string if no matches are found.
 */
function getMatchText(text, pattern) {
  const allMatchObj = [...text.matchAll(pattern)]
  for (const matchObj of allMatchObj) {
    return matchObj[1]
  }
  return ''
}

/**
 * Attempts to fetch the content at the specified URL using the UrlFetchApp service, with optional retries.
 * @param {string} url - The URL to fetch.
 * @param {number} retryCount - The number of times to retry the fetch operation if it fails. Defaults to 0.
 * @returns {(HTTPResponse|boolean)} - The HTTP response object returned by the fetch operation, or false if the fetch operation failed and retry attempts were exhausted.
 */
function tryFetch(url, retryCount = 0) {
  if (retryCount >= 2) {
    return false
  }
  try {
    return UrlFetchApp.fetch(url)
  } catch (e) {
    Utilities.sleep(12000)
    tryFetch(url, retryCount + 1)
  }
}
