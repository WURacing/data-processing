import React from "react";
import { Form } from 'react-bootstrap';


class VehicleSpeed extends React.Component{
    constructor (props){
        super (props)
        this.state={VSX: 0,
        VSY:0
       }  
    }
    updateData(){
        this.setState(state => {
            
                this.state.VSX += 0.1;
                this.state.VSY+=0.2;
                this.state.VSX=Math.round(this.state.VSX *10)/10.0
                this.state.VSY=Math.round(this.state.VSY *10)/10.0
                return state;
            
            })
    }

    reset(){
        this.setState(state=>{
            this.state.VSX =0;
                this.state.VSY=0;
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
    <p>The X direction velocity is {this.state.VSX}mph</p>
    <p>The Y directions velocity is {this.state.VSY}mph</p>
    <p>The magnitude of the velicity is {Math.round(10*Math.sqrt(Math.pow(this.state.VSX,2)+Math.pow(this.state.VSY,2)))/10.0}mph</p>

    </>
    );
}
}
export default VehicleSpeed;