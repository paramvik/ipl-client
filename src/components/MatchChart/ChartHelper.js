import * as d3 from 'd3';
import {teamNames} from '../../utils/valueMap';
import '../../utils/teamColors.css';

export const dualBarChart = (dataset, node, meta) => { 
  const margin = {
    top: 40,
    right: 20,
    bottom: 50,
    left: 40
  };
  
  const width = 1800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.right;

  const xScale0 = d3.scaleLinear()
                  .domain([0, d3.max(dataset, d => d._id.over)])
                  .rangeRound([0, width]);

  const xScale1 = d3.scaleBand()
                    .domain(d3.range(2))
                    .rangeRound([0, xScale0.bandwidth()])
                    .paddingInner(0.01);

  const yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, d => d.runs)])
                  .range([height, 0]);

  const xAxis = d3.axisBottom(xScale0);
  const yAxis = d3.axisLeft(yScale);

  let svg = d3.select(node)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll(".tick text").attr("transform", "rotate(-90)").attr('dx', "-2.5em").attr('dy', 0);
  
  svg.append('g')
    .call(yAxis)
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .attr('fill', 'black')
    .style('text-anchor', 'end')
    .text(meta.label);
  
  svg.append('g')
    .selectAll('g')
    .data(dataset)
    .enter().append('g')
      .attr('transform', function(d) { return "translate(" + xScale0(d._id.over) + ",0)"; })
      .selectAll('rect')
      .data(function(d) { return d.runs.reverse() })
      .enter().append('rect')
        .attr('x', function(d) {return xScale1(d._id)})
        .attr('y', function(d) { return yScale(d.runs)})
        .attr("width", xScale1.bandwidth())
        .attr("height", function(d) { return height - yScale(d.runs); })
        .attr('class', function(d) {
          let matchData = d3.select(this.parentNode).datum();
          let teams = [matchData.Team_Name_Id, matchData.Opponent_Team_Id];
          if(d._id === 1) {
            if(matchData.Toss_Decision === 'bat') return teamNames[teams[0] - 1];
            else return teamNames[teams[1] - 1];
          } else {
            if(matchData.Toss_Decision === 'bat') return teamNames[teams[1] - 1];
            else return teamNames[teams[0] - 1];
          }
          
        });
  
    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(teamNames)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
    legend.append("rect")
        .attr("x", width + margin.right - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("class", function(d){return d; });
  
    legend.append("text")
        .attr("x", width+margin.right - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
};