import React from 'react';
import { getData, getMetadata } from '../api';
import ReactGrid from './ReactGrid';

class DataViewerChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const metadata = await getMetadata(this.props.date);
    const data = await getData(metadata.date, metadata.start, metadata.end, '1m');

    const traceNames = Object.keys(data[0]).filter((name) => name !== 'time');
    const traceValues = Array(traceNames.length);
    for (let i = 0; i < traceNames.length; i++) {
      traceValues[i] = [];
    }
    data.forEach((d) => {
      Object.entries(d).forEach(([key, value]) => {
        if (key === 'time') return;
        traceValues[traceNames.indexOf(key)].push(value);
      });
    });
    this.setState({ metadata, traceNames, traceValues });
  }

  render() {
    if (this.state.metadata) {
      return (
        <ReactGrid data={this.state.traceValues} keys={this.state.traceNames}></ReactGrid>
      );
    }
    return <p>loading...</p>;
  }
}

export default DataViewerChart;
