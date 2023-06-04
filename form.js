/**
 * Retrieves the latest response from a Google Form and returns an object containing
 * its item responses with their respective titles as keys.
 * @function
 * @returns {Object} An object containing the item responses of the latest response from a Google Form.
 * The keys are the titles of the items and the values are the responses.
 */
function getLatestResponse() {
  const formResponses = FormApp.getActiveForm().getResponses()

  const latestResponse = formResponses.pop()
  const itemResponses = latestResponse.getItemResponses()

  const switchItemFunction = {
    なかみ: (itemResponse) => {
      return '  ' + itemResponse.getResponse()
    },
    つながり: (itemResponse) => {
      return (
        '\n' + [...itemResponse.getResponse()].map((tag) => '#' + tag).join(' ')
      )
    },
    Keep: (itemResponse) => {
      return itemResponse.getResponse()
    },
    Problem: (itemResponse) => {
      return itemResponse.getResponse()
    },
    Try: (itemResponse) => {
      return itemResponse.getResponse()
    },
  }

  return Object.fromEntries(
    itemResponses
      .filter((itemResponse) => {
        return itemResponse
      })
      .map((itemResponse) => {
        const title = itemResponse.getItem().getTitle()
        return [title, switchItemFunction[title](itemResponse)]
      })
  )
}
