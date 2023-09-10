import { Component } from 'react';
import './BrakeHeat.css';
//npm install --save react-circular-progressbar
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export class BrakeHeat extends Component{

    constructor(props) {
        super(props);
        this.state = {
            MaxHeat: 200,
            FL: 25,
            FR: 50,
            BL: 75,
            BR: 100,
            FMod: 1,
            BMod: 1,
        };
    }
    
    componentDidMount(){
        setInterval(() => this.updateHeat(), 100)
    }

    updateHeat(){
        if(this.state.FR >= this.state.MaxHeat || this.state.FL >= this.state.MaxHeat){
            this.state.FMod =  -1;
        }
        if(this.state.FL <= 0 || this.state.FR <= 0){
            this.state.FMod =  1;
        }
        if(this.state.BR >= this.state.MaxHeat || this.state.BL >= this.state.MaxHeat){
            this.state.BMod =  -1;
        }
        if(this.state.BL <= 0 || this.state.BL <= 0){
            this.state.BMod =  1;
        }
        this.setState(state =>{
            state.FR += this.state.FMod;
            state.FL += this.state.FMod;
            state.BL += this.state.BMod;
            state.BR += this.state.BMod;
            return state;
        });
    }

    render(){
        document.getElementById('background-color')
        const FRred = Math.round(this.state.FR/this.state.MaxHeat*255);
        const FRblue = 255-FRred;
        const FLred = Math.round(this.state.FL/this.state.MaxHeat*255);
        const FLblue = 255-FLred;
        const BRred = Math.round(this.state.BR/this.state.MaxHeat*255);
        const BRblue = 255-BRred;
        const BLred = Math.round(this.state.FR/this.state.MaxHeat*255);
        const BLblue = 255-BLred;
        return(
            <>
                <div class="brake-container">
                    <CircularProgressbar
                        value={this.state.FL}
                        maxValue={this.state.MaxHeat}
                        text={`${this.state.FL}°F`}
                        styles={{
                            root: {},
                            path: {
                                stroke: `rgba(${FLred}, 0, ${FLblue}, 1)`,
                                strokeLinecap: 'butt',
                                transition: 'stroke-dashoffset 0.25s ease 0s',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                            },
                            trail: {
                                stroke: '#d6d6d6',
                                strokeLinecap: 'butt',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                              },
                              text: {
                                fill: '#000',
                                fontSize: '16px',
                              },
                              background: {
                                fill: '#000',
                              },
                        }}
                    />
                    <CircularProgressbar
                        value={this.state.FR}
                        maxValue={this.state.MaxHeat}
                        text={`${this.state.FR}°F`}
                        counterClockwise={true}
                        styles={{
                            root: {},
                            path: {
                                stroke: `rgba(${FRred}, 0, ${FRblue}, 1)`,
                                strokeLinecap: 'butt',
                                transition: 'stroke-dashoffset 0.25s ease 0s',
                                transform: 'rotate(0.75turn)',
                                transformOrigin: 'center center',
                            },
                            trail: {
                                stroke: '#d6d6d6',
                                strokeLinecap: 'butt',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                              },
                              text: {
                                fill: '#000',
                                fontSize: '16px',
                              },
                              background: {
                                fill: '#000',
                              },
                        }}
                    />
                    <CircularProgressbar
                        value={this.state.BL}
                        maxValue={this.state.MaxHeat}
                        text={`${this.state.BL}°F`}
                        styles={{
                            root: {},
                            path: {
                                stroke: `rgba(${BLred}, 0, ${BLblue}, 1)`,
                                strokeLinecap: 'butt',
                                transition: 'stroke-dashoffset 0.25s ease 0s',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                            },
                            trail: {
                                stroke: '#d6d6d6',
                                strokeLinecap: 'butt',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                              },
                              text: {
                                fill: '#000',
                                fontSize: '16px',
                              },
                              background: {
                                fill: '#000',
                              },
                        }}
                    />
                    <CircularProgressbar
                        value={this.state.BR}
                        maxValue={this.state.MaxHeat}
                        text={`${this.state.BR}°F`}
                        counterClockwise={true}
                        styles={{
                            root: {},
                            path: {
                                stroke: `rgba(${BRred}, 0, ${BRblue}, 1)`,
                                strokeLinecap: 'butt',
                                transition: 'stroke-dashoffset 0.25s ease 0s',
                                transform: 'rotate(0.75turn)',
                                transformOrigin: 'center center',
                            },
                            trail: {
                                stroke: '#d6d6d6',
                                strokeLinecap: 'butt',
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                              },
                              text: {
                                fill: '#000',
                                fontSize: '16px',
                              },
                              background: {
                                fill: '#000',
                              },
                        }}
                    />
                </div>
            </>
        );
    }
}
export default BrakeHeat;