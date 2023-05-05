/**
 * Retrieves the latest response from a Google Form and extracts text and tags from it.
 * @function
 * @returns {Object} A dictionary containing the extracted text and tags.
 *   - 'text': a string representing the response to the first question in the form
 *   - 'tags': a string representing the response to the second question in the form,
 *             with each tag preceded by a '#' symbol and separated by a space
 *             (or an empty string if the second question is not present in the response)
 */
function getLatestResponse() {
  // Retrieve the responses for the active form
  let form_responses = FormApp.getActiveForm().getResponses()

  // Get the latest response and its item responses
  const latest_response = form_responses.pop()
  const item_responses = latest_response.getItemResponses()

  // Extract the text and tags from the item responses
  const text = '  ' + item_responses[0].getResponse()
  const tags = item_responses[1]
    ? '\n' +
      item_responses[1]
        .getResponse()
        .map((tag) => '#' + tag)
        .join(' ')
    : ''

  return {
    text: text,
    tags: tags,
  }
}
