const DOCUMENT_ID =
  PropertiesService.getScriptProperties().getProperty('DOCUMENT_ID')

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
  const urlRowRegexp = /\s(https?:\/\/.+)\s/g
  for (const matchObj of [...text.matchAll(urlRowRegexp)].reverse()) {
    const url = matchObj[1]
    const startIndex = matchObj.index + 1
    paragraph.editAsText().deleteText(startIndex, startIndex + url.length - 1)
    if (isTweet(url)) {
      const tweetEmbedText = getTweetEmbedText(url)
      paragraph.editAsText().insertText(startIndex, tweetEmbedText)
      paragraph
        .editAsText()
        .setLinkUrl(
          startIndex + tweetEmbedText.length - url.length,
          startIndex + tweetEmbedText.length - 1,
          url
        )
    } else {
      const title = getPageTitle(url)
      paragraph.editAsText().insertText(startIndex, title)
      paragraph
        .editAsText()
        .setLinkUrl(startIndex, startIndex + title.length - 1, url)
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
    if (String(value).length === 0) {
      return ''
    }
    return value + '\n'
  }

  const paragraphContent = ifUndefToEmpty(formResponse.なかみ)
  const paragraphKpt = ifUndefToEmpty(
    ['Keep', 'Problem', 'Try']
      .filter((key) => formResponse[key])
      .map((key) => '\n' + key + ': ' + formResponse[key])
      .join('')
  )
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
