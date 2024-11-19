# MMM-DIFTAR-AFVALOPHALING

De correcte straatinforamtie moet worden aangevuld in de node_helper.
Zie hiervoor in de bijgevoegde csv (in de zip) en gebruik de huidige helper als referentie.

Toont de volgende ophaaldagen voor Diftar via Recycleapp.be API

Ontwikkeld in Node.JS en geport naar magicMirror

Installatie:

cd ~/MagicMirror/modules 
git clone https://github.com/dierckxtom/MMM-Recyclecollection.git

cd MMM-Recyclecollection
npm install 


npm install axios
cd

**Config file:**

{
  module: "RecycleCollection",
  position: "top_right", // You can place it anywhere on the screen
  config: {
    // You can add additional configuration here if needed
  }
}

