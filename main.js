const DOCUMENT_ID =
  PropertiesService.getScriptProperties().getProperty('DOCUMENT_ID')

function test() {
  onSubmitForm()
}

function onSubmitForm() {
  const formResponse = getLatestResponse()
  writeDiary(formResponse)
  setKptSheet(formResponse)
}

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
 * Appends the latest form response to a Google Document as a new paragraph.
 * @function
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

function addHeadDate() {
  // 「(年).(月).(日)」の文字列を作る。
  const title = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'YYYY.MM.dd')
  // 文書に文字列を追加。
  const head_date = DocumentApp.openById(DOCUMENT_ID)
    .getBody()
    .appendParagraph(title)
  // 追加した文字を大きくする。
  head_date.setHeading(DocumentApp.ParagraphHeading.HEADING2)
}
