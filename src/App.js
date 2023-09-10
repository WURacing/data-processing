import './App.css';
import DataViewerChart from './Components/DataViewerChart';

function App() {
  return (
    <div className="App">
      <DataViewerChart date="2019-11-24" resolution="10s"/>
    </div>
  );
}

export default App;
