/**
 * Author: Phoebe Lilius
 * Copilot has been used while developing this code.
 *
 * ~~~ Scatter plot ~~~
 * This code creates a scatter plot from weather data.
 *
 * Additional functionality:
 * - Dropdown menu to select the x-axis metric
 * - Tooltips on hover to display the data point values
 */

/* CONSTANTS AND GLOBAL VARIABLES */
const index = d3.local();
const DATA_SOURCE = "data/data.json";
const y_metric = "apparentTemperatureHigh";
let x_metric = "humidity";

const margin = { top: 20, right: 70, bottom: 50, left: 70 };
const plotWidth = document.getElementById("scatter-plot").offsetWidth;
const containerWidth = plotWidth - plotWidth * 0.1;
const containerHeight = containerWidth * 0.5;
const width = containerWidth - margin.left - margin.right;
const height = containerHeight - margin.top - margin.bottom;

/* GETTERS */
function getXMetric(d) {
  return d.daily.data[0][x_metric];
}

function getYMetric(d) {
  return d.daily.data[0][y_metric];
}

function getMetric(d, metric) {
  if (metric === x_metric) {
    return getXMetric(d);
  } else {
    return getYMetric(d);
  }
}

async function getData() {
  const data = await d3.json(DATA_SOURCE);
  return data;
}

/* HELPER FUNCTIONS */
function getScaleDomain(data, metric) {
  // Define scales for x and y axes
  let domain = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +getMetric(d, metric))]);
  return domain;
}

function getXscale(data, metric) {
  return getScaleDomain(data, metric).range([0, width]);
}

function getYscale(data, metric) {
  return getScaleDomain(data, metric).range([height, 0]);
}

function changeVisibility(className, visibility) {
  d3.selectAll(`.${className}`).style("display", visibility);
}

/* PLOT FUNCTIONS */
function initPlot(data) {
  // Create SVG element
  const svg = d3
  .select("#scatter-plot")
  .append("svg")
  .attr("class", "scatter-plot")
  .attr("width", containerWidth)
  .attr("height", containerHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add y-axis
  yScale = getYscale(data, y_metric);
  svg.append("g").call(d3.axisLeft(yScale));

  // Add y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(y_metric);

    return svg;
}

function updatePlot(data, svg) {
  // Create a new group for the updateable elements
  parent = svg.append("g").attr("class", "updateable"); // Add class for removing on update

  // Add x-axis
  xScale = getXscale(data, x_metric);
  parent
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add x-axis label
  parent
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .style("text-anchor", "middle")
    .text(x_metric);

  // Create circles for each data point with label on hover
  parent
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(+getXMetric(d)))
    .attr("cy", (d) => yScale(+getYMetric(d)))
    .attr("r", 5)
    .each(function (d, i) {
      index.set(this, i); // Store data points index in local variable
    })
    .on("mouseover", function () {
      // Show label on hover
      changeVisibility(`labels-${index.get(this)}`, "block");
    })
    .on("mouseout", function () {
      // Hide label on mouseout
      changeVisibility(`labels-${index.get(this)}`, "none");
    });

  // Add labels for each data point (hidden by default)
  parent
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text((d) => `(${getXMetric(d)}, ${getYMetric(d)})`)
    .attr("x", (d) => xScale(+getXMetric(d)) + 5)
    .attr("y", (d) => yScale(+getYMetric(d)) - 5)
    .attr("class", (d, i) => `labels-${i}`) // Add class to hide/show labels
    .style("display", "none");
}

/* EVENT LISTENERS */
function dropDownWatcher(data) {
  // Watch for changes in the dropdown menu
  d3.select("#metric").on("change", function () {
    // Update the x_metric based on the dropdown selection
    x_metric = this.value;

    // Remove all changing elements
    d3.select(".updateable").remove();

    // Update the scatter plot
    updatePlot(data, plot);
  });
}

/* MAIN */
getData()
  .then((data) => {
    plot = initPlot(data);
    updatePlot(data, plot);
    dropDownWatcher(data, plot);
  })
  .catch((error) => {
    console.error("Error loading data:", error);
  });
