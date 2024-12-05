chrome.storage.sync.get({ rules: [] }, function (data) {
  const currentUrl = window.location.href

  // Loop through each rule and check if it's active
  data.rules.forEach(({ url, dbName, active }) => {
    if (active) {
      // Only proceed if the rule is active
      const regex = new RegExp(url)

      // If the current URL matches the rule's URL
      if (regex.test(currentUrl)) {
        console.log(
          `Deleting IndexedDB: ${dbName} on regex-matched URL: ${url}`
        )

        indexedDB.deleteDatabase(dbName).onsuccess = function () {
          console.log(`Successfully deleted IndexedDB: ${dbName}`)
        }

        indexedDB.deleteDatabase(dbName).onerror = function () {
          console.error(`Failed to delete IndexedDB: ${dbName}`)
        }

        indexedDB.deleteDatabase(dbName).onblocked = function () {
          console.warn(`Deletion of IndexedDB '${dbName}' is blocked.`)
        }
      }
    }
  })
})
