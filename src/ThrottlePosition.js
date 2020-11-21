import React from 'react';
import { Form } from 'react-bootstrap';
import Slider from "./Slider";

class ThrottlePosition extends React.Component{
constructor (props){
super (props)
this.state={ThrottleP: 0}

}

maxPosition(){
    if (this.state.ThrottleP>100){
        this.state.ThrottleP=100;
    }

}
updateData() {
    this.setState(state => {
        if (this.state.ThrottleP>100){
            this.state.ThrottleP=100;

            
        }
        if (this.state.ThrottleP<0){
            this.state.ThrottleP=0;

        }
        
        else{
        this.state.ThrottleP += 1;
        return state;
    }
    })
}
reset(){
    this.setState(state=>{
        this.state.ThrottleP=0;
        return state;

    })
}
    render(){

        return(
            <>
            <Form>
            <Form.Group controlId="formBasicRange">
                <Form.Label>Time</Form.Label>
                <Form.Control type="range" onChange={()=>this.updateData()} />
                
            </Form.Group>
        </Form>
        <button name="Reset"  onClick={()=>this.reset()}>Reset</button>
            <div id="ThrottlePosition">
               
                <p>The Throttle Poisiton is {this.state.ThrottleP}%</p>
                
            </div>
        </>
        );
    }
}

export default ThrottlePosition;