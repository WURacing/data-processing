import React from 'react';
import ChartWrapper from './ChartWrapper';
import Checkbox from './Checkbox';

class ReactGrid extends React.Component {
  constructor(props) {
    super(props);
    const labels = {};
    this.props.keys.forEach((key) => {
      labels[key] = key;
    });
    this.state = {
      traceIndex: [],
      traceSelector: [],
      traceLabels: labels,
      strokes: [],
      file: NaN,
      rowOneDataLabel: false,
      downloadFileName: 'data',
      currentChartType: 'Line',
      composedLines: {},
    };
  }

  indexToLabel(counter) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    if (counter < alphabet.length) {
      return alphabet[counter];
    }

    return alphabet[Math.floor(counter / alphabet.length)] + alphabet[counter % alphabet.length];
  }

  // may be able to pass in list of keys and kep the data the same

  handleTraceSelectorForm = (e) => {
    const index = parseInt(e.target.id);

    const newTraceSelector = this.state.traceSelector;
    if (e.target.type === 'checkbox') {
      newTraceSelector[index] = e.target.checked;
    }
    const newTraceIndex = [];
    for (let key = 0; key < newTraceSelector.length; key++) {
      if (newTraceSelector[key] === true) {
        newTraceIndex.push(this.props.keys[key]);
      }
    }
    this.setState({
      traceSelector: newTraceSelector,
      traceIndex: newTraceIndex,
    });
  }

  handleStrokePicker = (e) => {
    const index = parseInt(e.id);
    const newStrokes = this.state.strokes;
    newStrokes[index] = e.color;
    this.setState({ strokes: newStrokes });
  }

  handleTraceLabel = (e) => {
    e.preventDefault();
    const { key } = e.target.dataset;
    const newTraceLabels = this.state.traceLabels;
    const newTraceLabel = e.target.value;
    newTraceLabels[key] = newTraceLabel;
    this.setState({ traceLabels: newTraceLabels });
  }

  handleComposedType = (e) => {
    const { key } = e.target.dataset;
    const newComposedTypes = this.state.composedLines;
    const newType = e.target.value;
    newComposedTypes[key] = newType;
    this.setState({ composedLines: newComposedTypes });
  }

  traceOptions() {
    const checkBoxes = [];
    for (let index = 0; index < this.props.keys.length; index++) {
      checkBoxes.push(
        <div className = "Selectors" key={`selector-${index}`}>
          <Checkbox class="traces" name={this.props.keys[index]} id={index} handleStrokePicker={this.handleStrokePicker} />
          <label htmlFor="traceLabel">Trace Label</label>
          <input key={index} data-key={this.props.keys[index]} id={`${index}_Label`} type="text" maxLength="50" name="traceLabel" className="TraceLabel" onChange={this.handleTraceLabel}/>
        </div>,
      );
      if (this.state.currentChartType === 'Composed') {
        checkBoxes.push(
          <div className="ComposedType" key={`composed-${index}`}>
            <label>Trace Line Type</label>
              <select name="ComposedLineType" data-key={this.props.keys[index]} onChange={this.handleComposedType}>
                <option value="Line">Line</option>
                <option value="Area">Area</option>
                <option value="Bar">Bar</option>
                <option value="Scatter">Scatter</option>
              </select>
          </div>,
        );
      }
    }
    return checkBoxes;
  }

  handleChartType = (e) => {
    this.setState({ currentChartType: e });
  }

  render() {
    return (
      <div className="reactGrid">
        <h1>Data Graph</h1>
        <form className="tracesGroup" onChange={this.handleTraceSelectorForm}>{this.traceOptions()}</form>
        <ChartWrapper
          onChange={this.handleChartType}
          strokes={this.state.strokes}
          data={this.props.data}
          traceIndex={this.state.traceIndex}
          traceLabels={this.state.traceLabels}
          composedLines={this.state.composedLines}/>
      </div>
    );
  }
}
export default ReactGrid;
