const DOCUMENT_ID =
  PropertiesService.getScriptProperties().getProperty('DOCUMENT_ID')

function test() {
  onSubmitForm()
}

function onSubmitForm() {
  const form_response = getLatestResponse()
  writeDiary(form_response)
  setKptSheet(form_response)
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
function writeDiary(form_response = getLatestResponse()) {
  if (
    !(
      form_response.なかみ ||
      form_response.Keep ||
      form_response.Problem ||
      form_response.Try
    )
  ) {
    return
  }

  const ifUndefToEmpty = (value = '') => {
    return value
  }

  const paragraph_content = form_response.なかみ
    ? form_response.なかみ + '\n'
    : ''
  const paragraph_kpt = ['Keep', 'Problem', 'Try']
    .filter((key) => form_response[key])
    .map((key) => key + ': ' + form_response[key])
    .join('\n')
  const par = DocumentApp.openById(DOCUMENT_ID)
    .getBody()
    .appendParagraph(
      paragraph_content +
        paragraph_kpt +
        ifUndefToEmpty(form_response.つながり) +
        '\n'
    )
  par.editAsText().setUnderline(false)
  if (form_response.つながり) {
    par
      .editAsText()
      .setUnderline(
        paragraph_content.length + paragraph_kpt.length,
        paragraph_content.length +
          paragraph_kpt.length +
          form_response.つながり.length -
          1,
        true
      )
  }
  replaceLink(par)
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
