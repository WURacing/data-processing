import React from 'react';

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
                <label htmlFor={this.props.name}>{this.props.name}</label>
                <input onChange={this.handleSelected}
                    type="checkbox"
                    id={this.props.id}
                    name={this.props.name}
                ></input>
            </div>
      );
    }
}

export default Checkbox;
