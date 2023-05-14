/**
 * Retrieves the latest response from a Google Form and returns an object containing
 * its item responses with their respective titles as keys.
 * @function
 * @returns {Object} An object containing the item responses of the latest response from a Google Form.
 * The keys are the titles of the items and the values are the responses.
 */
function getLatestResponse() {
  const form_responses = FormApp.getActiveForm().getResponses()

  const latest_response = form_responses.pop()
  const item_responses = latest_response.getItemResponses()

  const switchItemFunction = {
    なかみ: (item_response) => {
      return '  ' + item_response.getResponse()
    },
    つながり: (item_response) => {
      return (
        '\n' +
        [...item_response.getResponse()].map((tag) => '#' + tag).join(' ')
      )
    },
    Keep: (item_response) => {
      return item_response.getResponse()
    },
    Problem: (item_response) => {
      return item_response.getResponse()
    },
    Try: (item_response) => {
      return item_response.getResponse()
    },
  }

  return Object.fromEntries(
    item_responses
      .filter((item_response) => {
        return item_response
      })
      .map((item_response) => {
        const title = item_response.getItem().getTitle()
        return [title, switchItemFunction[title](item_response)]
      })
  )
}
