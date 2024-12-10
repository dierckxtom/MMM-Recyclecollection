Module.register("MMM-Recyclecollection", {
  // Default configuration
  defaults: {
    updateInterval: 10000*60, // Update every 6 minutes
  },

  start: function () {

    this.collectionData = [];  // Initialize collectionData to avoid undefined errors
    this.sendSocketNotification("GET_COLLECTION_DATA");
    
  },

  // Handle the data received from node_helper.js
socketNotificationReceived: function (notification, payload) {
  Log.log("[MMM-Recyclecollection] Notification received:", notification);  // Log notification name
  Log.log("[MMM-Recyclecollection] Payload received:", payload);            // Log the payload

  if (notification === "COLLECTION_DATA") {
    Log.log("[MMM-Recyclecollection] Received collection data:", JSON.stringify(payload, null, 2));
    this.collectionData = payload;

    // Ensure data is set before updating the DOM
    if (this.collectionData && this.collectionData.length > 0) {
      Log.log("[MMM-Recyclecollection] Collection Data is valid");
      this.updateDom();
    } else {
      Log.log("[MMM-Recyclecollection] Collection Data is empty or invalid");
    }
  }

  if (notification === "COLLECTION_ERROR") {
    Log.error("[MMM-Recyclecollection] Error fetching collection data:", payload);
    this.collectionData = [{ fractionName: "Error", timestamp: payload }];
    this.updateDom();
  }
},

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.style.fontSize = "24px";
    wrapper.style.fontFamily = "Arial, sans-serif";

    Log.log("[MMM-Recyclecollection] Collection Data in getDom:", this.collectionData);  // Add this log to debug

    if (this.collectionData && this.collectionData.length > 0) {
      this.collectionData.forEach(item => {
        var collectionItem = document.createElement("div");
        collectionItem.classList.add("collection-item");
        collectionItem.innerHTML = `
          <div><strong><span style="color: green;">Fractie:</span> ${item.fractionName}</strong></div>
          <div><span style="color: green;">Ophaaldatum:</span> ${item.timestamp}</div>
        `;

        //add image function - not operational yet
         if (item.fractionName === 'PMD') {
    var image = document.createElement("img");
    image.src = "./modules/MMM-Recyclecollection/images/bin.jpg"; // Adjust path as per your structure
    image.alt = "";
    image.style.width = "100px";
    image.style.height = "auto";
    collectionItem.appendChild(image);

}
        
        wrapper.appendChild(collectionItem);
      });
    } else {
      wrapper.innerHTML = "No collection data available.";
    }
    return wrapper;
  }
});
