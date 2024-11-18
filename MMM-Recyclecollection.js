Module.register("MMM-Recyclecollection", {
  // Default configuration
  defaults: {
    updateInterval: 10000, // Update every 10 seconds
  },

  start: function () {
    this.sendSocketNotification("GET_COLLECTION_DATA");
  },

  // Handle the data received from node_helper.js
socketNotificationReceived: function (notification, payload) {
  console.log("Notification received:", notification);  // Log notification name
  console.log("Payload received:", payload);           // Log the payload

socketNotificationReceived: function (notification, payload) {
  if (notification === "COLLECTION_DATA") {
    console.log("Received collection data:", JSON.stringify(payload, null, 2));  // Use JSON.stringify for better readability
    this.collectionData = payload;
    this.updateDom(); // Update the DOM after data is set
  }
  if (notification === "COLLECTION_ERROR") {
    console.error("Error fetching collection data:", payload); // Log the error
    this.collectionData = [{ fractionName: "Error", timestamp: payload }];
    this.updateDom(); // Update the DOM in case of an error
  }
},

getDom: function () {
  var wrapper = document.createElement("div");
  wrapper.style.fontSize = "18px";
  wrapper.style.fontFamily = "Arial, sans-serif";

  console.log("Collection Data in getDom:", this.collectionData);  // Add this log to debug

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

});
