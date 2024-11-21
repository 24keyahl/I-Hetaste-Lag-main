const { AgCharts } = agCharts;

const dateFormatter = new Intl.DateTimeFormat("en-US");
const tooltip = {
  renderer: ({ title, datum, xKey, yKey }) => ({
    title,
    content: `${dateFormatter.format(datum[xKey])}: ${datum[yKey]}`,
  }),
};

const tempOpt = {
  container: document.getElementById("TempChart"),
  data: [tempChart()],
  title: {
    text: "Temperature",
  },
  series: [
    {
      type: "line",
      xKey: "time",
      yKey: "Temperature",
      tooltip,
    },
    {
      type: "line",
      xKey: "time",
      yKey: "Temperature",
      tooltip,
    },
  ],
  axes: [
    {
      position: "bottom",
      type: "time",
      title: {
        text: "Date",
      },
      label: {
        format: "%b",
      },
    },
    {
      position: "left",
      type: "number",
      title: {
        text: "Temperature in °C",
      },
    },
  ],
};

AgCharts.create(tempOpt);

const humOpt = {
  container: document.getElementById("HumChart"),
  data: [humChart()],
  title: {
    text: "Humidity",
  },
  series: [
    {
      type: "line",
      xKey: "time",
      yKey: "Humidity",
      tooltip,
    },
    {
      type: "line",
      xKey: "time",
      yKey: "Humidity",
      tooltip,
    },
  ],
  axes: [
    {
      position: "bottom",
      type: "time",
      title: {
        text: "Date",
      },
      label: {
        format: "%b",
      },
    },
    {
      position: "left",
      type: "number",
      title: {
        text: "Humidity in %",
      },
    },
  ],
};

AgCharts.create(humOpt);