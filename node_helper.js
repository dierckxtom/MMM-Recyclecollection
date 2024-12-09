const NodeHelper = require("node_helper");
const axios = require("axios");
const currentDate = new Date();


module.exports = NodeHelper.create({
  start: function () {
    console.log("RecycleCollection helper started...");
    
    this.getCollectionData();

    // Schedule getCollectionData to run every 24 hours (in milliseconds: 24 * 60 * 60 * 1000)
    setInterval(() => {
      console.log("Running scheduled job every 24 hours");
      this.getCollectionData();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  },

  // Handle socket notifications from the frontend
  socketNotificationReceived: function (notification, payload) {
    console.log("Node Helper received notification:", notification);
    if (notification === "GET_COLLECTION_DATA") {
      console.log("Fetching collection data...");
      this.getCollectionData(); // Fetch data when requested by frontend
    }
  },

 

  // Fetch collection data from the API
  getCollectionData: async function () {
    const API_URL = 'https://api.fostplus.be/recyclecms/public/v1/collections';
    const ZIPCODE_ID = '2323-13014'; // Example
    const STREET = 'https://data.vlaanderen.be/id/straatnaam-14879';  // Ensure this is the correct format
    const HOUSE_ID = '1';
    const FROM = currentDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    const UNTIL = new Date(currentDate.setDate(currentDate.getDate() + 1)).toISOString().split('T')[0]; // 6 days later
    const SIZE = '3'; //Number of records to return on screen
    const X_SECRET = 'recycleapp.be';
    const X_CONS = 'recycleapp.be';


    
    try {
      console.log("Making API request with parameters:", {
        zipcodeId: ZIPCODE_ID,
        streetId: STREET,
        houseNumber: HOUSE_ID,
        fromDate: FROM,
        untilDate: UNTIL,
        size: SIZE,
      });

      const response = await axios.get(API_URL, {
        params: {
          zipcodeId: ZIPCODE_ID,
          streetId: STREET,
          houseNumber: HOUSE_ID,
          fromDate: FROM,
          untilDate: UNTIL,
          size: SIZE,
        },
        headers: {
          'x-secret': X_SECRET,
          'x-consumer': X_CONS,
        },
        timeout: 5000
      });

      console.log("API response status:", response.status);
      console.log("Full API response data:", JSON.stringify(response.data, null, 2));

      if (response.data && response.data.items) {
        const collections = response.data.items;
        if (collections.length > 0) {
          const collectionData = collections.map(item => ({
            fractionName: item.fraction.name.nl,
            timestamp: new Date(item.timestamp).toLocaleDateString(), // Format timestamp
          }));
          console.log("Processed collection data:", collectionData);
          this.sendSocketNotification("COLLECTION_DATA", collectionData);
        } else {
          console.log("No collections found.");
          this.sendSocketNotification("COLLECTION_DATA", []); // Send empty data if no collections
        }
      } else {
        console.warn("Unexpected API response structure.");
        this.sendSocketNotification("COLLECTION_ERROR", "Unexpected API response structure");
      }
    } catch (error) {
      if (error.response) {
        console.error("API responded with an error:", error.response.status, error.response.data);
        this.sendSocketNotification("COLLECTION_ERROR", `API error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        this.sendSocketNotification("COLLECTION_ERROR", "No response received from API");
      } else {
        console.error("Error during request setup:", error.message);
        this.sendSocketNotification("COLLECTION_ERROR", `Request error: ${error.message}`);
      }
    }
  }
});
