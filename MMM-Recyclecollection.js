Module.register("MMM-RecycleCollection", {
  // Default configuration
  defaults: {
    updateInterval: 10000, // Update every 10 seconds
  },

  start: function () {
    this.sendSocketNotification("GET_COLLECTION_DATA");
  },

  // Handle the data received from node_helper.js
  socketNotificationReceived: function (notification, payload) {
    if (notification === "COLLECTION_DATA") {
      console.log("Received collection data:", payload);  // Log received data
      this.collectionData = payload;
      this.updateDom(); // Update the DOM to show the new data
    }
    if (notification === "COLLECTION_ERROR") {
      console.error("Error fetching collection data:", payload);  // Log error message
      this.collectionData = [{ fractionName: "Error", timestamp: payload }];
      this.updateDom();
    }
  },

  /* getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.style.fontSize = "44px";
    wrapper.style.fontFamily = "Arial, sans-serif";
    wrapper.style.color = "red";
    wrapper.style.backgroundColor = "white";  // Just to make sure it's visible




    if (this.collectionData && this.collectionData.length > 0) {
      this.collectionData.forEach(item => {
        var collectionItem = document.createElement("div");
        collectionItem.classList.add("collection-item");
        collectionItem.innerHTML = `
          <div><strong>${item.fractionName}</strong></div>
          <div>Collection Date: ${item.timestamp}</div>
        `;
        wrapper.appendChild(collectionItem);
      });
    } else {
      wrapper.innerHTML = "No collection data available.";
    }
    return wrapper;
  }

  */

getDom: function () {
  console.log("Entering getDom()"); // Log entry to getDom()

  // Create a wrapper div
  var wrapper = document.createElement("div");

  // Apply inline styles to ensure visibility
  wrapper.style.fontSize = "18px";
  wrapper.style.fontFamily = "Arial, sans-serif";
  wrapper.style.color = "black";  // Make sure text is visible
  wrapper.style.backgroundColor = "white"; // Make sure background is visible
  wrapper.style.padding = "20px"; // Add padding for clarity

  // Static data for testing rendering
  const staticData = [
    { fractionName: "Plastic", timestamp: "2024-11-20" },
    { fractionName: "Paper", timestamp: "2024-11-21" }
  ];

  console.log("Rendering static data:", staticData); // Log the static data being rendered

  staticData.forEach(item => {
    console.log(`Rendering item: ${item.fractionName} - ${item.timestamp}`); // Log each item

    var collectionItem = document.createElement("div");
    collectionItem.classList.add("collection-item");
    collectionItem.innerHTML = `
      <div><strong>${item.fractionName}</strong></div>
      <div>Collection Date: ${item.timestamp}</div>
    `;
    wrapper.appendChild(collectionItem);
  });

  // Return the wrapper containing all the items
  return wrapper;
}

  
});
