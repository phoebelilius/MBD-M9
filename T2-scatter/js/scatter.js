/**
 * Author: Phoebe Lilius
 * ChatGPT has been used in creation of this code.
 *
 * ~~~ Scatter plot ~~~
 *
 * This visualisation plots a scatter plot of GrLivArea against SalePrice
 * for a dataset of homes.
 *
 * Additional functionality:
 * - Added a line at GrLivArea = 3500
 * - On hover over a data point, the coordinates of the data point are displayed
 * - Responsive based on screen size on load
 */

// Define the data source
const DATA_SOURCE =
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv";

// Set up the SVG element
const margin = { top: 20, right: 70, bottom: 50, left: 70 };

// Define a function to change label visibility
function changeVisibility(className, visibility) {
  d3.selectAll(`.${className}`).style("display", visibility);
}

// Load and parse the CSV data
d3.csv(DATA_SOURCE)
  .then((data) => {
    // Define the container size based on the size of the parent element
    const plotWidth = document.getElementById("scatter-plot").offsetWidth;
    const containerWidth = plotWidth - plotWidth * 0.1;
    const containerHeight = containerWidth * 0.5;

    // Calculate the actual width and height of the SVG element
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3
      .select("#scatter-plot")
      .append("svg")
      .attr("class", "scatter-plot")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales for x and y axes
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.GrLivArea)])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.SalePrice)])
      .range([height, 0]);

    // Create circles for each data point under 3500 with label on hover
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(+d.GrLivArea))
      .attr("cy", (d) => yScale(+d.SalePrice))
      .attr("r", 5)
      .on("mouseover", function (event, d) {
        // Show label on hover for data points under 3500
        if (d.GrLivArea <= 3500) {
          changeVisibility(`labels-${d.GrLivArea}-${d.SalePrice}`, "block");
        }
      })
      .on("mouseout", function (event, d) {
        // Hide label on mouseout for data points under 3500
        if (d.GrLivArea <= 3500) {
          changeVisibility(`labels-${d.GrLivArea}-${d.SalePrice}`, "none");
        }
      });

    // Add labels to circles (initially hidden)
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => `(${d.GrLivArea}, ${d.SalePrice})`)
      .attr("x", (d) => xScale(+d.GrLivArea) + 5)
      .attr("y", (d) => yScale(+d.SalePrice) - 5)
      .attr("class", (d) => `labels-${d.GrLivArea}-${d.SalePrice}`)
      .style("display", function (d) {
        // set label visibility based on GrLivArea
        if (d.GrLivArea <= 3500) {
          return "none";
        }
        return "block";
      });

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Add x-axis label
    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .style("text-anchor", "middle")
      .text("GrLivArea (m)");

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("SalePrice ($)");

    // Add vertical line marking filter for GrLivArea > 3500
    svg
      .append("line")
      .attr("x1", xScale(3500))
      .attr("y1", 0)
      .attr("x2", xScale(3500))
      .attr("y2", height)
      .attr("stroke", "red")
      .attr("stroke-dasharray", "5,5");
  })

  .catch((error) => {
    console.error("Error loading data:", error);
  });
