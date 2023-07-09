const DOCUMENT_ID =
  PropertiesService.getScriptProperties().getProperty('DOCUMENT_ID')

function test() {
  onSubmitForm()
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
  const urlRowRegexp = new RegExp('https?://.+', 'g')
  for (const matchObj of [...text.matchAll(urlRowRegexp)].reverse()) {
    const url = matchObj[0]
    const startIndex = matchObj.index
    const title = getPageTitle(url)
    paragraph.editAsText().deleteText(startIndex, startIndex + url.length)
    paragraph.editAsText().insertText(startIndex, title + '\n')
    paragraph
      .editAsText()
      .setLinkUrl(startIndex, startIndex + title.length, url)
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

  const paragraphContent = formResponse.なかみ ? formResponse.なかみ + '\n' : ''
  const paragraphKpt = ['Keep', 'Problem', 'Try']
    .filter((key) => formResponse[key])
    .map((key) => key + ': ' + formResponse[key])
    .join('\n')
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
        paragraphContent.length + paragraphKpt.length,
        paragraphContent.length +
          paragraphKpt.length +
          formResponse.つながり.length -
          1,
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
