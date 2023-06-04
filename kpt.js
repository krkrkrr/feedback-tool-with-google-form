const KPT_SHEET_ID =
  PropertiesService.getScriptProperties().getProperty('KPT_SHEET_ID')

/**
  Set a new row with the latest KPT (Keep, Problem, Try) form responses on the KPT spreadsheet.
  @param {Object} formResponse - An object containing the responses from the KPT form. It has the following properties:
    Keep {string} - The response from the 'Keep' question.
    Problem {string} - The response from the 'Problem' question.
    Try {string} - The response from the 'Try' question.
  @returns {void}
*/
function setKptSheet(formResponse = getLatestResponse()) {
  if (!(formResponse.Keep || formResponse.Problem || formResponse.Try)) {
    return
  }
  const ifUndefToEmpty = (value = '') => {
    return value
  }
  const row = [
    ifUndefToEmpty(formResponse.Keep),
    ifUndefToEmpty(formResponse.Problem),
    ifUndefToEmpty(formResponse.Try),
    new Date(),
  ]
  SpreadsheetApp.openById(KPT_SHEET_ID).getSheets()[0].appendRow(row)
}
