const DOCUMENT_ID =
  PropertiesService.getScriptProperties().getProperty('DOCUMENT_ID')

function test() {
  const testTweetUrl =
    'https://twitter.com/shishirobotan/status/1681567718280138752?s=20'
  console.log(getTweetEmbedText(testTweetUrl))
}

/**
 * Handles the submission of a form.
 * @function
 * @returns {void}
 */
function onSubmitForm() {
  const formResponse = getLatestResponse()
  writeDiary(formResponse)
  setKptSheet(formResponse)
}

/**
 * Replaces URLs in a paragraph with their corresponding page titles as links.
 * @function
 * @param {GoogleAppsScript.Document.Paragraph} paragraph - The paragraph to replace the links in.
 * @returns {void}
 */
function replaceLink(paragraph) {
  const text = paragraph.getText()
  const urlRowRegexp = /\s(https?:\/\/.+\S)/g
  for (const matchObj of [...text.matchAll(urlRowRegexp)].reverse()) {
    const url = matchObj[1]
    const startIndex = matchObj.index
    paragraph.editAsText().deleteText(startIndex, startIndex + url.length)
    if (isTweet(url)) {
      const tweetEmbedText = getTweetEmbedText(url)
      paragraph.editAsText().insertText(startIndex, tweetEmbedText)
      paragraph
        .editAsText()
        .setLinkUrl(
          startIndex + tweetEmbedText.length - url.length,
          startIndex + tweetEmbedText.length,
          url
        )
    } else {
      const title = getPageTitle(url)
      paragraph.editAsText().insertText(startIndex, title)
      paragraph
        .editAsText()
        .setLinkUrl(startIndex, startIndex + title.length, url)
    }
  }
}

/**
 * Writes the form response to a diary document.
 * @function
 * @param {Object} formResponse - An object containing the form response. It has the following properties:
 *   - なかみ {string} (optional) - The response to the 'なかみ' question.
 *   - Keep {string} (optional) - The response to the 'Keep' question.
 *   - Problem {string} (optional) - The response to the 'Problem' question.
 *   - Try {string} (optional) - The response to the 'Try' question.
 *   - つながり {string} (optional) - The response to the 'つながり' question.
 * @returns {void}
 */
function writeDiary(formResponse = getLatestResponse()) {
  if (
    !(
      formResponse.なかみ ||
      formResponse.Keep ||
      formResponse.Problem ||
      formResponse.Try
    )
  ) {
    return
  }

  const ifUndefToEmpty = (value = '') => {
    return value
  }

  const paragraphContent = ifUndefToEmpty(formResponse.なかみ)
  const paragraphKpt = ['Keep', 'Problem', 'Try']
    .filter((key) => formResponse[key])
    .map((key) => '\n' + key + ': ' + formResponse[key])
    .join('')
  const paragraph = DocumentApp.openById(DOCUMENT_ID)
    .getBody()
    .appendParagraph(
      paragraphContent +
        paragraphKpt +
        ifUndefToEmpty(formResponse.つながり) +
        '\n'
    )
  paragraph.editAsText().setUnderline(false)
  if (formResponse.つながり) {
    paragraph
      .editAsText()
      .setUnderline(
        paragraphContent.length + paragraphKpt.length + 1,
        paragraphContent.length +
          paragraphKpt.length +
          formResponse.つながり.length,
        true
      )
  }
  replaceLink(paragraph)
}

/**
 * Adds a heading with the current date to the document body.
 * @function
 * @returns {void}
 */
function addHeadDate() {
  const title = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'YYYY.MM.dd')
  const head_date = DocumentApp.openById(DOCUMENT_ID)
    .getBody()
    .appendParagraph(title)
  head_date.setHeading(DocumentApp.ParagraphHeading.HEADING2)
}
