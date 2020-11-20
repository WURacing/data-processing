import { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';


export class EngineSpeed extends Component{

    constructor(props) {
        super(props);
        this.state = {
            Rpm: 4000,
            MaxRpm: 8000,
            Redline: 6000,
            Mod: 5,
        };
    }
    
    componentDidMount(){
        setInterval(() => this.updateRpm(), 10)
    }


    updateRpm(){
        if(this.state.Rpm === this.state.MaxRpm){
            this.state.Mod =  -5;
        }
        if(this.state.Rpm === 0){
            this.state.Mod = 5;
        }
        this.setState(state =>{
            state.Rpm += this.state.Mod;
            return state;
        });
    }

    render(){
        if (this.state.Rpm <= this.state.Redline){
            return(
                <>
                    <div style={{width: 400, margin: 20}}>
                        <p>Engine Load: {100*this.state.Rpm/this.state.MaxRpm}%</p>
                        <p>Engine Speed(rpm): {this.state.Rpm}</p>
                        <ProgressBar>
                            <ProgressBar variant="warning" now={this.state.Rpm} max={this.state.MaxRpm} key={1}/>
                        </ProgressBar>
                    </div>
                </>
            );
        } else {
            return(
                <>
                    <div style={{width: 400, margin: 20}}>
                        <p>Engine Load: {100*this.state.Rpm/this.state.MaxRpm}%</p>
                        <p>Engine Speed(rpm): {this.state.Rpm}</p>
                        <ProgressBar>
                            <ProgressBar variant="warning" now={this.state.Redline} max={this.state.MaxRpm} key={1}/>
                            <ProgressBar variant="danger" now={this.state.Rpm-this.state.Redline} max={this.state.MaxRpm} key={2}/>
                        </ProgressBar>
                    </div>
                </>
            );
        }
    }
}
export default EngineSpeed;