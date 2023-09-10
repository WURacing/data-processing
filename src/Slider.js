import React from "react";
import { Form } from 'react-bootstrap';

class Slider extends React.Component{

    render(){
        return(
            <Form>
                <Form.Group controlId="formBasicRange">
                    <Form.Label>Range</Form.Label>
                    <Form.Control type="range" onChange={()=>this.updateData()} />
                </Form.Group>
            </Form>
        );
    }
}
export default Slider;