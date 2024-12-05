// Event listener for adding a new rule
document.getElementById("addRule").addEventListener("click", function () {
  const url = document.getElementById("url").value
  const dbName = document.getElementById("dbName").value

  if (!url || !dbName) {
    alert("Both URL and Database Name are required.")
    return
  }

  // Get current rules and add the new one with "active" state set to true by default
  chrome.storage.sync.get({ rules: [] }, function (data) {
    const rules = data.rules
    rules.push({ url, dbName, active: true })

    // Save the updated list of rules
    chrome.storage.sync.set({ rules }, function () {
      alert(`Rule added: ${url} -> ${dbName}`)
      displayRules() // Refresh the table display
    })
  })
})

// Function to display the rules in a table format
function displayRules() {
  chrome.storage.sync.get({ rules: [] }, function (data) {
    const tableBody = document
      .getElementById("rulesTable")
      .getElementsByTagName("tbody")[0]

    // Clear the table body before populating it with updated rules
    tableBody.innerHTML = ""

    // Loop through all stored rules and add them as rows in the table
    data.rules.forEach((rule, index) => {
      const row = tableBody.insertRow()

      // Create the editable URL cell with textarea
      const urlCell = row.insertCell(0)
      const urlInput = document.createElement("textarea")
      urlInput.value = rule.url
      urlInput.rows = 2 // Allow multiple rows to see the full URL
      urlInput.cols = 40 // Set the width of the textarea
      urlInput.style.resize = "vertical" // Prevent horizontal resizing
      urlInput.addEventListener("blur", function () {
        saveChanges(index, "url", urlInput.value)
      })
      urlCell.appendChild(urlInput)

      // Create the editable database name cell
      const dbNameCell = row.insertCell(1)
      const dbNameInput = document.createElement("input")
      dbNameInput.type = "text"
      dbNameInput.value = rule.dbName
      dbNameInput.addEventListener("blur", function () {
        saveChanges(index, "dbName", dbNameInput.value)
      })
      dbNameCell.appendChild(dbNameInput)

      // Create the active checkbox cell
      const activeCell = row.insertCell(2)
      const activeCheckbox = document.createElement("input")
      activeCheckbox.type = "checkbox"
      activeCheckbox.checked = rule.active
      activeCheckbox.addEventListener("change", function () {
        toggleActiveState(index, activeCheckbox.checked)
      })
      activeCell.appendChild(activeCheckbox)

      // Create the action cell with a delete button
      const actionCell = row.insertCell(3)
      const deleteButton = document.createElement("button")
      deleteButton.className = "delete-btn"
      deleteButton.textContent = "Delete"
      deleteButton.onclick = () => removeRule(index) // Bind the delete function for the current rule
      actionCell.appendChild(deleteButton)
    })
  })
}

// Function to save the changes made to the rule (URL or Database Name)
function saveChanges(index, field, value) {
  chrome.storage.sync.get({ rules: [] }, function (data) {
    const rules = data.rules
    rules[index][field] = value // Update the specific field (url or dbName)

    // Save the updated list of rules
    chrome.storage.sync.set({ rules }, function () {
      displayRules() // Refresh the table display after the change
    })
  })
}

// Function to toggle the active state of a rule
function toggleActiveState(index, isActive) {
  chrome.storage.sync.get({ rules: [] }, function (data) {
    const rules = data.rules
    rules[index].active = isActive // Update the active state of the rule

    // Save the updated list of rules
    chrome.storage.sync.set({ rules }, function () {
      displayRules() // Refresh the table display after the change
    })
  })
}

// Function to remove a rule by its index
function removeRule(index) {
  chrome.storage.sync.get({ rules: [] }, function (data) {
    // Remove the rule from the list
    data.rules.splice(index, 1)

    // Save the updated list of rules
    chrome.storage.sync.set({ rules: data.rules }, function () {
      displayRules() // Refresh the table display after removal
    })
  })
}

// Display the rules when the popup is loaded
document.addEventListener("DOMContentLoaded", displayRules)
