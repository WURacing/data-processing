import React from 'react';
import { getData, getMetadata } from '../api';
import ReactGrid from './ReactGrid';

class DataViewerChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      traceValues: [],
      traceNames: [],
      metadata: {},
      dataLoaded: false,
    };
  }

  async componentDidMount() {
    const metadata = await getMetadata(this.props.date);
    const data = await getData(metadata.date, metadata.start, metadata.end, this.props.resolution);
    const traceNames = Object.keys(data[0]).filter((name) => name !== 'time');
    data.forEach((dataPoint) => {
      dataPoint.time = new Date(dataPoint.time);
    });
    this.setState({
      metadata, traceNames, traceValues: data, dataLoaded: true,
    });
  }

  render() {
    if (this.state.dataLoaded) {
      return (
        <ReactGrid data={this.state.traceValues} keys={this.state.traceNames}/>
      );
    }
    return <p>loading...</p>;
  }
}

export default DataViewerChart;
