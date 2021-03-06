import React, { Component } from 'react';
import { drawBarChart } from './d3Helper';
import styles from './AllSeasonChart.module.css';

class AllSeasonChart extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  componentDidMount() {
    drawBarChart(this.props.data, this.node.current, this.props.meta);
  }

  render() {
    return (
      <div className={styles.Chart} >
        <h2>{this.props.meta.title}</h2>
        <svg ref={this.node}></svg>
      </div>
    );
  }
}

export default AllSeasonChart;