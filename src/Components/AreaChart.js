import React from 'react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import domtoimage from 'dom-to-image';
import fileDownload from 'js-file-download';

class RenderAreaChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartTile: '',
      lineWeight: 2,
      lineTypes: ['monotone', 'basis', 'basisClosed', 'basisOpen', 'linear', 'linearClosed', 'natural', 'monotoneX', 'monotoneY', 'step', 'stepBefore', 'stepAfter'],
      lineType: 'monotone',
      XAxisLabel: '',
      YAxisLabel: '',
      YAxisWidth: 100,
      YAxisOrientation: 'Left',
      data: props.data,
    };
  }

  renderLines() {
    const lines = [];
    if (this.props.traceIndex === undefined) { return undefined; }
    this.props.traceIndex.forEach((key) => {
      let stroke = '#8884d8';
      let label = key;
      if (this.props.strokes !== undefined) {
        if (this.props.strokes[key] !== undefined) {
          stroke = this.props.strokes[key];
        }
      }
      if (this.props.traceLabels !== undefined) {
        if (this.props.traceLabels[key] !== undefined) {
          label = this.props.traceLabels[key];
        }
      }

      lines.push(<Area
                type={this.state.lineType}
                key={key}
                dataKey={key}
                stroke={stroke}
                name={label}
                strokeWidth={this.state.lineWeight}
                fill={stroke}
                />);
    });
    return lines;
  }

  lineTypeDropDownOptions() {
    const options = this.state.lineTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
    ));
    return options;
  }

    handleChartTitle = (e) => {
      e.preventDefault();
      this.setState({ chartTile: e.target.value });
    }

    handleLineWeight = (e) => {
      e.preventDefault();
      this.setState({ lineWeight: e.target.value });
    }

    handleLineType = (e) => {
      e.preventDefault();
      this.setState({ lineType: e.target.value });
    }

    handleXAxisTitle = (e) => {
      e.preventDefault();
      this.setState({ XAxisLabel: e.target.value });
    }

    handleYAxisTitle = (e) => {
      e.preventDefault();
      this.setState({ YAxisLabel: e.target.value });
    }

    handleDomainMinChange =(e) => {
      e.preventDefault();
      this.setState({ Domain: [e.target.value, this.state.Domain[1]] });
    }

    handleDomainMaxChange = (e) => {
      e.preventDefault();
      this.setState({ Domain: [this.state.Domain[0], e.target.value] });
    }

    exportPNG() {
      domtoimage.toBlob(document.getElementsByClassName('downloadTarget')[0])
        .then((blob) => {
          fileDownload(blob, 'Chart.png');
        });
    }

    render() {
      return (
                <div className="ChartRender">
                    <div className="chartTitleForm">
                        <div className="formGroup">
                        <label htmlFor="chartTile">Chart Title </label>
                        <input name="chartTitle" type="text" onChange={this.handleChartTitle}></input>
                        <label htmlFor="XAxisLabel">X Axis Label </label>
                        <input name="XAxisLabel" type="text" onChange={this.handleXAxisTitle}></input>
                        <label htmlFor="YAxisLabel">Y Axis Label </label>
                        <input name="YAxisLabel" type="text" onChange={this.handleYAxisTitle}></input>
                        </div>
                        <label htmlFor="lineWeight">Line Weight</label>
                        <input name="lineWeight" type="number" max="50" onChange={this.handleLineWeight}></input>

                        <select name="lineType" onChange={this.handleLineType}>{this.lineTypeDropDownOptions()}</select>
                    </div>
                    <h4>{this.state.chartTile}</h4>
                    <div className="downloadTarget" id="LineChartTarget">
                        <AreaChart
                          width={this.props.graphWidth}
                          height={this.props.graphHeight}
                          data={this.props.data} margin={{
                            top: 5, right: 20, bottom: 5, left: 0,
                          }}>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" fill="white"/>
                            <XAxis label={this.state.XAxisLabel} domain={this.state.Domain}/>
                            <YAxis label={this.state.YAxisLabel} />
                            <Tooltip />
                            {this.renderLines()}
                            <Legend verticalAlign="top"/>
                        </AreaChart>
                    </div>
                    <button onClick={this.exportPNG}>PNG</button>
                </div>
      );
    }
}

export default RenderAreaChart;
