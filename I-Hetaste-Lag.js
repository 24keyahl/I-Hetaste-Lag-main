
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
let y;
let averageTemp1 = [];
let averageHum1 = [];
let averageTemp2 = [];
let averageHum2 = [];

let averageRTemp1;
let averageRHum1;
let averageRTemp2;
let averageRHum2;

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

document.getElementById("averageTemp1").innerHTML = "°C";
document.getElementById("averageHum1").innerHTML = "%";
document.getElementById("averageTemp2").innerHTML = "°C";
document.getElementById("averageHum2").innerHTML = "%";



function getAverage(array) {
      let sum = 0;
      for (i in array) {
        sum += array[i];
      }
      return sum / array.length;
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
                  averageTemp1 = [];
                  averageHum1 = [];
                  y = 0;
                  for (i in dateChart1) {
                        if (dateChart1[i]['temp'] != null) {
                              averageTemp1[y] = dateChart1[i]['temp'];
                              averageHum1[y] = dateChart1[i]['hum'];
                              y++;
                        }
                        l = String(i).padStart(2, '0');
                        chartOptions.set(l, {
                              ...chartOptions.get(l) || {}, 
                              temp1: dateChart1[i]['temp'],
                              date1: l + ":00",
                              hum1: dateChart1[i]['hum'],
                        });
                  }
                  averageRTemp1 = getAverage(averageTemp1);
                  document.getElementById("averageTemp1").innerHTML = Math.round(averageRTemp1 * 10) / 10 + "°C";
                  averageRHum1 = getAverage(averageHum1);
                  document.getElementById("averageHum1").innerHTML = Math.round(averageRHum1 * 10) / 10 + "%";
            }
            if (dateIn2.value) {
                  let [chartDate2Year, chartDate2Month, chartDate2Day] = dateIn2.value.split('-');
                  let dateChart2 = chartData[chartDate2Year][chartDate2Month][chartDate2Day]; 
                  averageTemp2 = [];
                  averageHum1 = [];
                  y = 0;
                  for (i in dateChart2) {   
                        if (dateChart2[i]['temp'] != null) {
                              averageTemp2[y] = dateChart2[i]['temp'];
                              averageHum2[y] = dateChart2[i]['hum'];
                              y++;
                        }
                        l = String(i).padStart(2, '0');
                        chartOptions.set(l, {
                              ...chartOptions.get(l) || {}, 
                              temp2: dateChart2[i]['temp'],
                              date1: l + ":00",
                              hum2: dateChart2[i]['hum'],
                        });   
                  } 
                  averageRTemp2 = getAverage(averageTemp2);
                  document.getElementById("averageTemp2").innerHTML = Math.round(averageRTemp2 * 10) / 10 + "°C";
                  averageRHum2 = getAverage(averageHum2);
                  document.getElementById("averageHum2").innerHTML = Math.round(averageRHum2 * 10) / 10 + "%";
            }
            chartOptionsTo = Array.from(chartOptions.values());
            if (dateIn1.value && dateIn2.value) {
                  chartOptionsTo.sort((a, b) => {
                        let dateA = new Date(`1970-01-01T${a.date1}`);
                        let dateB = new Date(`1970-01-01T${b.date1}`);
                        return dateA - dateB;
                  });
            }
            else if (dateIn1.value) {
                  chartOptionsTo.sort((a, b) => {
                        let dateA = new Date(`1970-01-01T${a.date1}`);
                        let dateB = new Date(`1970-01-01T${b.date1}`);
                        return dateA - dateB;
                  });
            }
            else if (dateIn2.value) {
                  chartOptionsTo.sort((a, b) => {
                        let dateA = new Date(`1970-01-01T${a.date1}`);
                        let dateB = new Date(`1970-01-01T${b.date1}`);
                        return dateA - dateB;
                  });
            }
            chartOptions1.data = chartOptionsTo;
            chartOptions2.data = chartOptionsTo;
            agTempChart.update(chartOptions1);
            agHumChart.update(chartOptions2);
      });
}