import React from 'react';
import StrokePicker from './StrokePicker';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      id: props.id,
    };
  }

  handleSelected = (e) => {
    this.setState({ selected: e.target.checked }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });
  }

  render() {
    return (
      <div className={this.props.class}>
        <input onChange={this.handleSelected}
          type="checkbox"
          id={this.props.id}
          name={this.props.name}
        />
        <StrokePicker id={`${this.props.id}_Stroke`} onChange={this.props.handleStrokePicker} />
        <label htmlFor={this.props.id}>{this.props.name}</label>
      </div>
    );
  }
}

export default Checkbox;
