const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
  start: function () {
    console.log("RecycleCollection helper started...");
  },

  // Fetch collection data from the API
  getCollectionData: async function () {
    const API_URL = 'https://api.fostplus.be/recyclecms/public/v1/collections';
    const ZIPCODE_ID = '2323-13014'; // Example
    const STREET = 'https://data.vlaanderen.be/id/straatnaam-14879';
    const HOUSE_ID = '18';
    const FROM = '2024-11-15';
    const UNTIL = '2024-11-29';
    const SIZE = '2'; 
    const X_SECRET = 'recycleapp.be';
    const X_CONS = 'recycleapp.be';

    try {
      const response = await axios.get(API_URL, {
        params: {
          zipcodeId: ZIPCODE_ID,
          streetId: STREET,
          houseNumber: HOUSE_ID,
          fromDate: FROM,
          untilDate: UNTIL,
          size: SIZE
        },
        headers: {
          'x-secret': X_SECRET,
          'x-consumer': X_CONS,
        },
        timeout: 5000
      });

      const collections = response.data.items;
      // Return only the relevant collection data (fraction name and timestamp)
      const collectionData = collections.map(item => ({
        fractionName: item.fraction.name.nl,
        timestamp: new Date(item.timestamp).toLocaleDateString()
      }));

      // Send data to frontend via socket notification
      this.sendSocketNotification("COLLECTION_DATA", collectionData);
    } catch (error) {
      console.error("Error fetching collection data:", error);
      this.sendSocketNotification("COLLECTION_ERROR", error.message);
    }
  }
});

