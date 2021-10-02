import React from 'react';
import RenderLineChart from './LineChart';
import RenderAreaChart from './AreaChart';
import RenderBarChart from './BarChart';
import RenderScatterChart from './ScatterPlot';
import RenderComposedChart from './ComposedChart';

class ChartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartTypes: ['Line', 'Area', 'Bar', 'Scatter', 'Composed'],
      currentChartType: 'Line',
      graphWidth: 600,
      graphHeight: 300,
    };
  }

  chartTypeDropDownOptions() {
    const options = this.state.chartTypes.map((type) => (
      <option key={type} value={type}>{type}</option>
    ));
    return options;
  }

  handleChartTypeChange = (e) => {
    e.preventDefault();
    this.setState({ currentChartType: e.target.value }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.currentChartType);
      }
    });
  }

  renderChart() {
    switch (this.state.currentChartType) {
      case 'Line':
        return <RenderLineChart
                  strokes={this.props.strokes}
                  data={this.props.data}
                  traceIndex={this.props.traceIndex}
                  traceLabels={this.props.traceLabels}
                  graphHeight={this.state.graphHeight}
                  graphWidth={this.state.graphWidth}/>;
      case 'Area':
        return <RenderAreaChart
                  strokes={this.props.strokes}
                  data={this.props.data}
                  traceIndex={this.props.traceIndex}
                  traceLabels={this.props.traceLabels}
                  graphHeight={this.state.graphHeight}
                  graphWidth={this.state.graphWidth}/>;
      case 'Bar':
        return <RenderBarChart
                strokes={this.props.strokes}
                data={this.props.data}
                traceIndex={this.props.traceIndex}
                traceLabels={this.props.traceLabels}
                graphHeight={this.state.graphHeight}
                graphWidth={this.state.graphWidth}/>;
      case 'Scatter':
        return <RenderScatterChart
                strokes={this.props.strokes}
                data={this.props.data}
                traceIndex={this.props.traceIndex}
                traceLabels={this.props.traceLabels}
                graphHeight={this.state.graphHeight}
                graphWidth={this.state.graphWidth}/>;
      case 'Composed':
        return <RenderComposedChart
                strokes={this.props.strokes}
                data={this.props.data}
                traceIndex={this.props.traceIndex}
                traceLabels={this.props.traceLabels}
                graphHeight={this.state.graphHeight}
                graphWidth={this.state.graphWidth}
                composedLines={this.props.composedLines}/>;
      default:
        return <h3>No chart type selected somehow</h3>;
    }
  }

  handleWidth = (e) => {
    if (isNaN(e.target.value)) { return; }
    this.setState({ graphWidth: parseInt(e.target.value) });
  }

  handleHeight = (e) => {
    if (isNaN(e.target.value)) { return; }
    this.setState({ graphHeight: parseInt(e.target.value) });
  }

  noTyping = (e) => {
    e.target.value = Math.abs(e.target.value);
  }

  render() {
    return (
          <div className="ChartWrapper">
              <div className="chartSelector">
                  <label htmlFor="ChartSelector">Select Chart Type</label>
                  <select onChange={this.handleChartTypeChange} defaultValue="Line" name="ChartSelector">{this.chartTypeDropDownOptions()}</select>
                  <label htmlFor="width">Width</label>
                  <input name="width" type="number" min="100" max="1920" onChange={this.handleWidth} step="10" oninput={this.noTyping}></input>
                  <label htmlFor="height">Height</label>
                  <input name="height" type="number" max="1080" min="100" onChange={this.handleHeight} step="10" onKeyDown={this.noTyping}></input>
              </div>
              {this.renderChart()}
          </div>
    );
  }
}

export default ChartWrapper;
