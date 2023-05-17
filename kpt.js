const KPT_SHEET_ID =
  PropertiesService.getScriptProperties().getProperty('KPT_SHEET_ID')

/**
  Set a new row with the latest KPT (Keep, Problem, Try) form responses on the KPT spreadsheet.
  @param {Object} form_response - An object containing the responses from the KPT form. It has the following properties:
    Keep {string} - The response from the 'Keep' question.
    Problem {string} - The response from the 'Problem' question.
    Try {string} - The response from the 'Try' question.
  @returns {void}
*/
function setKptSheet(form_response = getLatestResponse()) {
  if (!(form_response.Keep || form_response.Problem || form_response.Try)) {
    return
  }
  const ifUndefToEmpty = (value = '') => {
    return value
  }
  const row = [
    ifUndefToEmpty(form_response.Keep),
    ifUndefToEmpty(form_response.Problem),
    ifUndefToEmpty(form_response.Try),
    new Date(),
  ]
  SpreadsheetApp.openById(KPT_SHEET_ID).getSheets()[0].appendRow(row)
}
