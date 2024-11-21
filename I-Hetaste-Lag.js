
const firebaseConfig = {
      apiKey: "AIzaSyAFuDhYCjBOwIV-xddClDVW_fdpHtlZjBU",
      authDomain: "i-hetaste-lag.firebaseapp.com",
      databaseURL: "https://i-hetaste-lag-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "i-hetaste-lag",
      storageBucket: "i-hetaste-lag.firebasestorage.app",
      messagingSenderId: "657383983583",
      appId: "1:657383983583:web:349608ccc1670300775c6a",
      measurementId: "G-G7GFYGPS8X"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

let thermRef = db.ref("/therm");
let chartTempRef = db.ref("/chart");
let delMax = 300;
let delMin = 2;



thermRef.on("value", (snapshot) => {
      let json = snapshot.val();
      let temp = json.temp;
      let hum = json.hum;
      let delay = json.delay;
      document.getElementById("tempValue").innerHTML = "Temp: " + temp + "°C";
      document.getElementById("humValue").innerHTML = "Hum: " + hum + "%";
      newDelay(delay / 1000);
});


function newDelay(indelay){
      if (!indelay) {
            return; 
      }
      else if (typeof(indelay)!= "number") {
            return;
      }
      else if (indelay < delMin){
            indelay = delMin;
      }
      else if (indelay > delMax) {
            indelay = delMax;
      }
      document.getElementById("delValue").innerHTML = indelay + ": seconds";
      indelay *= 1000;
      delayRef.update({delay: parseFloat(indelay)});     
}

function tempChart() {
      return [];
}

function humChart() {
      return[];
}