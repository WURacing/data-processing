import React from 'react';
import { HotTable } from '@handsontable/react';
import ChartWrapper from './ChartWrapper';
import Checkbox from './Checkbox';
import StrokePicker from './StrokePicker';

class ReactGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        [10, 1, 15, 30, 40],
        [15, 10, 30, 12, 13],
        [5, 20, 11, 14, 13],
        [0, 30, 15, 12, 13],
      ],
      traceIndex: [],
      traceSelector: [],
      traceLabels: [],
      strokes: [],
      file: NaN,
      rowOneDataLabel: false,
      downloadFileName: 'data',
      currentChartType: 'Line',
      composedLines: [],
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
      newTraceSelector[index] = e.target.checked;
      const newTraceIndex = [];
      for (let key = 0; key < newTraceSelector.length; key++) {
        if (newTraceSelector[key] === true) {
          newTraceIndex.push(key);
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
      const index = parseInt(e.target.id);
      const newTraceLabels = this.state.traceLabels;
      const newTraceLabel = e.target.value;
      newTraceLabels[index] = newTraceLabel;
      this.setState({ traceLabels: newTraceLabels });
    }

    handleComposedType = (e) => {
      const index = parseInt(e.target.id);
      const newComposedTypes = this.state.composedLines;
      const newType = e.target.value;
      newComposedTypes[index] = newType;
      console.log(newComposedTypes);
      this.setState({ composedLines: newComposedTypes });
    }

    traceOptions() {
      const checkBoxes = [];
      for (let index = 0; index < this.state.data[0].length; index++) {
        checkBoxes.push(
          <div className = "Selectors">
            <Checkbox class="traces" name={this.indexToLabel(index)} id={index} />
            <StrokePicker id={`${index}_Stroke`} onChange={this.handleStrokePicker} />
              <label htmlFor="traceLabel">Trace Label</label>
              <input key={index} id={`${index}_Label`} type="text" maxLength="50" name="traceLabel" className="TraceLabel" onChange={this.handleTraceLabel}/>
          </div>,
        );
        if (this.state.currentChartType === 'Composed') {
          checkBoxes.push(
            <div className="ComposedType">
              <label>Trace Line Type</label>
                <select name="ComposedLineType" id={index} onChange={this.handleComposedType}>
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

    getCSV(newData) {
      const fileName = this.state.downloadFileName;
      fetch('/csv', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(newData),
        cache: 'no-cache',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      })
        .then((response) => {
          if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
          }
          response.blob().then((data) => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.csv`;
            // we need to append the element to the dom -> otherwise it will not work in firefox
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
        })
        .catch((error) => {
          console.log(`Fetch error: ${error}`);
        });
    }

    getJSON(newData) {
      const fileName = this.state.downloadFileName;
      fetch('/json', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(newData),
        cache: 'no-cache',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      })
        .then((response) => {
          if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
          }
          response.blob().then((data) => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.json`;
            // we need to append the element to the dom -> otherwise it will not work in firefox
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
        })
        .catch((error) => {
          console.log(`Fetch error: ${error}`);
        });
    }

    handleFileChange = (e) => {
      this.setState({
        file: e.target.files[0],
      });
    }

    handleDownloadFileNameChange = (e) => {
      e.preventDefault();
      let fileName = e.target[0].value;
      fileName = fileName.replace(/<[^>]+>/g, '');
      this.setState({
        downloadFileName: fileName,
      });
    }

    handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', this.state.file);
      fetch('/import', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => this.setState({ data }))
        .catch(console.log('Error could not get json data'));
    }

    expandTableVertical() {
      this.setState({ data: [...this.state.data, []] });
    }

    expandTableHorizontal() {
      const newData = this.state.data;
      newData.forEach((element) => {
        element.length++;
      });
      this.setState({ data: newData });
    }

    onTableChange = (changes) => {
      if (changes === null) { return; }
      const newData = this.state.data;
      changes.forEach(([row, prop, oldValue, newValue]) => {
        const newRow = newData[row];
        if (newRow[prop] === oldValue) {
          newRow[prop] = newValue;
        }
        newData[row] = newRow;
      });
      console.log(newData);
      this.setState({ data: newData });
    }

    handleChartType = (e) => {
      this.setState({ currentChartType: e });
    }

    render() {
      return (
            <div className="reactGrid">
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="fileUpload">Upload CSV or Json</label>
                  <input name="fileUpload" type="file" id="file" onChange={this.handleFileChange}/>
                  <button type='submit'>Submit</button>
                </form>
                <form onSubmit={this.handleDownloadFileNameChange}>
                  <label htmlFor="downloadFileName">Download File Name</label>
                  <input name="downloadFileName" type="text" id="file" />
                  <button type='submit'>Submit</button>
                </form>
                <form className="tracesGroup" onChange={this.handleTraceSelectorForm}>{this.traceOptions()}</form>
                <HotTable
                  manualColumnResize={true}
                  manualRowResize={true}
                  data={this.state.data}
                  ref={this.hot}
                  afterChange={this.onTableChange}
                  colHeaders={true}
                  rowHeaders={true}
                />
                <div className="GridOptions">
                  <button onClick={() => { this.getCSV(this.state.data); }}>CSV</button>
                  <button onClick={() => { this.getJSON(this.state.data); }}>JSON</button>
                  <button onClick={() => { this.expandTableVertical(); }}>Add Row</button>
                  <button onClick={() => { this.expandTableHorizontal(); }}>Add Col</button>
                </div>
                <ChartWrapper
                  onChange={this.handleChartType}
                  strokes={this.state.strokes}
                  data={this.state.data}
                  traceIndex={this.state.traceIndex}
                  traceLabels={this.state.traceLabels}
                  composedLines={this.state.composedLines}/>
            </div>
      );
    }
}
export default ReactGrid;
