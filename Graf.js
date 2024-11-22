const { AgCharts } = agCharts;

const tempOptions = {
  container: document.getElementById("TempChart"),
  data: [],
  title: {
    text: "Temperature",
  },
  series: [
    {
      type: "line",
      xKey: "date1",
      yKey: "temp1",
      yName: " ",
    },
    {
      type: "line",
      xKey: "date2",
      yKey: "temp2",
      yName: " ",
    },
  ],
};

const humOptions = {
  container: document.getElementById("HumChart"),
  data: [],
  title: {
    text: "Humidity",
  },
  series: [
    {
      type: "line",
      xKey: "date1",
      yKey: "hum1",
      yName: " ",
    },
    {
      type: "line",
      xKey: "date2",
      yKey: "hum2",
      yName: " ",
    },
  ], 
};

let agTempChart = AgCharts.create(tempOptions);

let agHumChart = AgCharts.create(humOptions);