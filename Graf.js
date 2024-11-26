const { AgCharts } = agCharts;

const chartOptions1 = {
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
      xName: "Time",
    },
    {
      type: "line",
      xKey: "date2",
      yKey: "temp2",
      yName: " ",
      xName: "Time",
    },
  ],
};

const chartOptions2 = {
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
      xName: "Time",
    },
    {
      type: "line",
      xKey: "date2",
      yKey: "hum2",
      yName: " ",
      xName: "Time",
    },
  ], 
};

let agTempChart = AgCharts.create(chartOptions1);

let agHumChart = AgCharts.create(chartOptions2);