
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
let chartRef = db.ref("/chart");
let delMax = 300;
let delMin = 2;


let dateIn1 = document.getElementById('dateChart1');

let dateIn2 = document.getElementById('dateChart2');


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
      thermRef.update({delay: parseFloat(indelay)});    
}



function Chart() {
      chartRef.once("value", (snapshot) => {
            let chartData = snapshot.val();
            if (dateIn1.value) {
                  humOptions.data = [];
                  tempOptions.data = [];
                  let [chartDate1Year, chartDate1Month, chartDate1Day] = dateIn1.value.split('-');
                  let dateChart1 = chartData[chartDate1Year][chartDate1Month][chartDate1Day];
                  for (i in dateChart1) {
                        let fortime = i.toLocaleString('sv-SE', {mininumIntegerDigits: 2, useGruping: false});
                        tempOptions.data.push({
                              temp1: dateChart1[i]['temp'],
                              date1: fortime + ":00",
                              hum1: dateChart1[i]['hum'],
                        });
                        humOptions.data.push({
                              hum1: dateChart1[i]['hum'],
                              date1: fortime + ":00",
                              temp1: dateChart1[i]['temp'],
                        });
                  }
            }
            if (dateIn2.value) {
                  let [chartDate2Year, chartDate2Month, chartDate2Day] = dateIn2.value.split('-');
                  let dateChart2 = chartData[chartDate2Year][chartDate2Month][chartDate2Day]; 
                  for (i in dateChart2) {        
                        let fortime = i.toLocaleString('sv-SE', {mininumIntegerDigits: 2, useGruping: false});
                        tempOptions.data.push({
                              temp2: dateChart2[i]['temp'],
                              date2: fortime + ":00",
                              hum2: dateChart2[i]['hum'],
                        });
                        humOptions.data.push({
                              hum2: dateChart2[i]['hum'],
                              date2: fortime + ":00",
                              temp2: dateChart2[i]['temp'],
                        });
                  } 
            }
            console.log(tempOptions.data);
            console.log(humOptions.data);
            agTempChart.update(tempOptions);
            agHumChart.update(humOptions);
      });
}