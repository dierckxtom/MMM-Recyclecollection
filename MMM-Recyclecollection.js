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
    if (notification === "COLLECTION_DATA") {
      this.collectionData = payload;
      this.updateDom(); // Update the DOM to show the new data
    }
    if (notification === "COLLECTION_ERROR") {
      this.collectionData = [{ fractionName: "Error", timestamp: payload }];
      this.updateDom();
    }
  },

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.style.fontSize = "18px";
    wrapper.style.fontFamily = "Arial, sans-serif";

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
