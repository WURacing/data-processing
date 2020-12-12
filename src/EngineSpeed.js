import { Component } from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import 'bootstrap/dist/css/bootstrap.min.css';


export class EngineSpeed extends Component{

    constructor(props) {
        super(props);
        this.state = {
            Rpm: 4000,
            MaxRpm: 8000,
            Mod: 5,
            engineLoad: 50,
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
            //rounded to prevent constant changing of # of digits which jitters the text and makes it unreadable
            state.engineLoad = Math.round(100*state.Rpm/this.state.MaxRpm);
            return state;
        });
    }

    render(){
        return(
            <>
                <div>
                    <ReactSpeedometer 
                        value={this.state.Rpm} 
                        currentValueText={`${this.state.engineLoad}% ${this.state.Rpm}RPM`}
                        startColor="green" 
                        endColor="red" 
                        needleColor="steelblue" 
                        maxValue={this.state.MaxRpm}
                        needleTransitionDuration={0}
                    />
                </div>
            </>
        );
    }
}
export default EngineSpeed;