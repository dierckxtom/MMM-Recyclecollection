const Log = require("logger");
const NodeHelper = require("node_helper");
const currentDate = new Date();


module.exports = NodeHelper.create({
  start: function () {
    Log.log("MMM-Recyclecollection helper started...");
    
    this.getCollectionData();

    // Schedule getCollectionData to run every 24 hours (in milliseconds: 24 * 60 * 60 * 1000)
    setInterval(() => {
      Log.log("[MMM-Recyclecollection] Running scheduled job every 24 hours");
      this.getCollectionData();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  },

  // Handle socket notifications from the frontend
  socketNotificationReceived: function (notification, payload) {
    Log.log("[MMM-Recyclecollection] Node Helper received notification:", notification);
    if (notification === "GET_COLLECTION_DATA") {
      Log.log("[MMM-Recyclecollection] Fetching collection data...");
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
    const UNTIL = new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000) // Add 6 days
      .toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    const SIZE = '3'; //Number of records to return on screen
    const X_SECRET = 'recycleapp.be';
    const X_CONS = 'recycleapp.be';


    
    try {
      Log.log("[MMM-Recyclecollection] Making API request with parameters:", {
        zipcodeId: ZIPCODE_ID,
        streetId: STREET,
        houseNumber: HOUSE_ID,
        fromDate: FROM,
        untilDate: UNTIL,
        size: SIZE,
      });
      const queryParams = new URLSearchParams({
        zipcodeId: ZIPCODE_ID,
        streetId: STREET,
        houseNumber: HOUSE_ID,
        fromDate: FROM,
        untilDate: UNTIL,
        size: SIZE,
      });

      const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
        headers: {
          'x-secret': X_SECRET,
          'x-consumer': X_CONS,
        },
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      Log.log("[MMM-Recyclecollection] API response status:", response.status);
      Log.log(`[MMM-Recyclecollection] Fetching data from: ${FROM} until: ${UNTIL}`);
      Log.log("[MMM-Recyclecollection] Full API response data:", JSON.stringify(response.data, null, 2));

      if (data && data.items) {
        const collections = data.items;
        if (collections.length > 0) {
          const collectionData = collections.map(item => ({
            fractionName: item.fraction.name.nl,
            timestamp: new Date(item.timestamp).toLocaleDateString(), // Format timestamp
          }));
          Log.log("[MMM-Recyclecollection] Processed collection data:", collectionData);
          this.sendSocketNotification("COLLECTION_DATA", collectionData);
        } else {
          Log.log("[MMM-Recyclecollection] No collections found.");
          this.sendSocketNotification("COLLECTION_DATA", []); // Send empty data if no collections
        }
      } else {
        Log.warn("[MMM-Recyclecollection] Unexpected API response structure.");
        this.sendSocketNotification("COLLECTION_ERROR", "Unexpected API response structure");
      }
    } catch (error) {
      if (error.response) {
        Log.error("[MMM-Recyclecollection] API responded with an error:", error.response.status, error.response.data);
        this.sendSocketNotification("COLLECTION_ERROR", `API error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        Log.error("[MMM-Recyclecollection] No response received:", error.request);
        this.sendSocketNotification("COLLECTION_ERROR", "No response received from API");
      } else {
        Log.error("[MMM-Recyclecollection] Error during request setup:", error.message);
        this.sendSocketNotification("COLLECTION_ERROR", `Request error: ${error.message}`);
      }
    }
  }
});
