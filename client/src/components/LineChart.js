import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .domain(data.map(d => d.time))
      .range([0, width]);

    const kpiNames = Object.keys(data[0]).filter(key => key !== 'time');
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(kpiNames, name => d[name]))])
      .nice()
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add lines for each KPI
    kpiNames.forEach((kpiName, index) => {
      const kpiData = data.map(d => ({
        time: d.time,
        value: d[kpiName] || 0
      }));

      g.append("path")
        .datum(kpiData)
        .attr("fill", "none")
        .attr("stroke", colors(index))
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add dots
      g.selectAll(`.dot-${index}`)
        .data(kpiData)
        .enter().append("circle")
        .attr("class", `dot-${index}`)
        .attr("cx", d => x(d.time))
        .attr("cy", d => y(d.value))
        .attr("r", 3)
        .attr("fill", colors(index));
    });

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add y-axis
    g.append("g")
      .call(d3.axisLeft(y));

    // Add legend
    const legend = g.selectAll(".legend")
      .data(kpiNames)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => colors(i));

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => d);

    svg.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);

  }, [data]);

  return <svg ref={svgRef} className="line-chart"></svg>;
};

export default LineChart;