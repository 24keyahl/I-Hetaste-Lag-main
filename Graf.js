const { AgCharts } = agCharts;

const chartOptions1 = {
  container: document.getElementById("TempChart"),
  data: [],
  title: {
    text: "Temperature in °C",
    color: "black",
  },
  background: {
    fill: '#ffffff',
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
      xKey: "date1",
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
    text: "Humidity in %",
    color: "black",
  },
  background: {
    fill: '#ffffff',
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
      xKey: "date1",
      yKey: "hum2",
      yName: " ",
      xName: "Time",
    },
  ], 
};

let agTempChart = AgCharts.create(chartOptions1);

let agHumChart = AgCharts.create(chartOptions2);