# MMM-Recyclecollection

## Screenshot

![screenshot](images/screenshot.png)

De correcte straatinformatie moet worden aangevuld in de node_helper. (postcode, straat, nr)
Zie hiervoor in de bijgevoegde csv (in de zip) en gebruik de huidige helper als referentie.

Toont de volgende ophaaldagen voor Diftar via Recycleapp.be API

Ontwikkeld in Node.JS en geport naar magicMirror

Installatie:

cd ~/MagicMirror/modules
git clone https://github.com/dierckxtom/MMM-Recyclecollection

**Config file:**

{
  module: "MMM-Recyclecollection",
  position: "top_right", // You can place it anywhere on the screen
  config: {
    // You can add additional configuration here if needed
  }
}

