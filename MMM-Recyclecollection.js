Module.register("MMM-Recyclecollection", {
  // Default configuration
  defaults: {
    updateInterval: 10000, // Update every 10 seconds
  },

  start: function () {

    this.collectionData = [];  // Initialize collectionData to avoid undefined errors
    this.sendSocketNotification("GET_COLLECTION_DATA");
    
  },

  // Handle the data received from node_helper.js
socketNotificationReceived: function (notification, payload) {
      console.log("aaa");
  console.log("Notification received:", notification);  // Log notification name
  console.log("Payload received:", payload);           // Log the payload

  if (notification === "COLLECTION_DATA") {
    console.log("Received collection data:", JSON.stringify(payload, null, 2));
    this.collectionData = payload;

    // Ensure data is set before updating the DOM
    if (this.collectionData && this.collectionData.length > 0) {
      console.log("Collection Data is valid");
      this.updateDom();
    } else {
      console.log("Collection Data is empty or invalid");
    }
  }

  if (notification === "COLLECTION_ERROR") {
    console.error("Error fetching collection data:", payload);
    this.collectionData = [{ fractionName: "Error", timestamp: payload }];
    this.updateDom();
  }
},

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.style.fontSize = "24px";
    wrapper.style.fontFamily = "Arial, sans-serif";

    console.log("Collection Data in getDom:", this.collectionData);  // Add this log to debug

    if (this.collectionData && this.collectionData.length > 0) {
      this.collectionData.forEach(item => {
        var collectionItem = document.createElement("div");
        collectionItem.classList.add("collection-item");
        collectionItem.innerHTML = `
          <div><strong>Fractie: ${item.fractionName}</strong></div>
          <div>Ophaaldatum: ${item.timestamp}</div>
        `;

        //add image func
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
