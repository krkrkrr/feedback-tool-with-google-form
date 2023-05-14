const DOCUMENT_ID =
  PropertiesService.getScriptProperties().getProperty('DOCUMENT_ID')

function test() {
  onSubmitForm()
}

function onSubmitForm() {
  const form_response = getLatestResponse()
  setToDiary(form_response)
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
function setToDiary(form_response = getLatestResponse()) {
  console.log(form_response)
  const par = DocumentApp.openById(DOCUMENT_ID)
    .getBody()
    .appendParagraph(form_response.なかみ + form_response.つながり + '\n')
  par.editAsText().setUnderline(false)
  if (form_response.つながり.length > 0) {
    par
      .editAsText()
      .setUnderline(
        form_response.なかみ.length,
        form_response.なかみ.length + form_response.つながり.length - 1,
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
