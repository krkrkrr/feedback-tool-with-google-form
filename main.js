const DOCUMENT_ID = ScriptProperties.getProperty('DOCUMENT_ID')

function test() {
  UrlFetchApp.fetch('https://www.soundhouse.co.jp/products/detail/item/165356/')
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
function setToDiary() {
  const form_response = getLatestResponse()
  const par = DocumentApp.openById(DOCUMENT_ID)
    .getBody()
    .appendParagraph(form_response.text + form_response.tags + '\n')
  par.editAsText().setUnderline(false)
  if (form_response.tags.length > 0) {
    par
      .editAsText()
      .setUnderline(
        form_response.text.length,
        form_response.text.length + form_response.tags.length - 1,
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
