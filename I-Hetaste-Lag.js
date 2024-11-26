
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
let chartRef = db.ref("/chart");
let inRef = db.ref("/therm/input");
let delMax = 300;
let delMin = 2;

let chartOptions = new Map();
let chartOptionsTo;
let l;

let dateIn1 = document.getElementById('dateChart1');

let dateIn2 = document.getElementById('dateChart2');


thermRef.on("value", (snapshot) => {
      let json = snapshot.val();
      let temp = json.value.temp;
      let hum = json.value.hum;
      let delay = json.input;
      delay.delay /= 1000;
      document.getElementById("tempValue").innerHTML = "Temp: " + temp + "°C";
      document.getElementById("humValue").innerHTML = "Hum: " + hum + "%";
      document.getElementById("delValue").innerHTML = delay.delay + ": seconds";
});

function newDelay(indelay){
      if (!indelay) {
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
      inRef.update({delay: parseFloat(indelay)});    
}


function Chart() {
      chartRef.once("value", (snapshot) => {
            let chartData = snapshot.val();
            if (dateIn1.value || dateIn2.value) {
                  chartOptions.clear();
            }
            if (dateIn1.value) {
                  let [chartDate1Year, chartDate1Month, chartDate1Day] = dateIn1.value.split('-');
                  let dateChart1 = chartData[chartDate1Year][chartDate1Month][chartDate1Day];
                  for (i in dateChart1) {
                        l = String(i).padStart(2, '0');
                        chartOptions.set(l, {
                              ...chartOptions.get(l) || {}, 
                              temp1: dateChart1[i]['temp'],
                              date1: l + ":00",
                              hum1: dateChart1[i]['hum'],
                        });
                  }
            }
            if (dateIn2.value) {
                  let [chartDate2Year, chartDate2Month, chartDate2Day] = dateIn2.value.split('-');
                  let dateChart2 = chartData[chartDate2Year][chartDate2Month][chartDate2Day]; 
                  for (i in dateChart2) {        
                        l = String(i).padStart(2, '0');
                        chartOptions.set(l, {
                              ...chartOptions.get(l) || {}, 
                              temp2: dateChart2[i]['temp'],
                              date2: l + ":00",
                              hum2: dateChart2[i]['hum'],
                        });
                        
                  } 
            }
            chartOptionsTo = Array.from(chartOptions.values());
            if (dateIn1.value || dateIn1.value && dateIn2.value) {
                  chartOptionsTo.sort((a, b) => {
                        let dateA = new Date(`1970-01-01T${a.date1}`);
                        let dateB = new Date(`1970-01-01T${b.date1}`);
                        return dateA - dateB;
                  });
            }
            else if (dateIn2.value)  {
                  chartOptionsTo.sort((a, b) => {
                        let dateA = new Date(`1970-01-01T${a.date2}`);
                        let dateB = new Date(`1970-01-01T${b.date2}`);
                        return dateA - dateB;
                  });
            }

            chartOptions1.data = chartOptionsTo;
            chartOptions2.data = chartOptionsTo;
            agTempChart.update(chartOptions1);
            agHumChart.update(chartOptions2);
      });
}