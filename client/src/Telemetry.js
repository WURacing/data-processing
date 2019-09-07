import React, { Component } from 'react';

export class Telemetry extends Component {
    constructor(props) {
        super(props);
        this.state = { connection: 0, error: null, data: {} };
    }

    componentDidMount() {
        this.es = new EventSource(process.env.REACT_APP_API_SERVER + '/api/telemetry');
        this.es.onopen = this.opened.bind(this);
        this.es.onerror = this.error.bind(this);
        this.es.addEventListener("message", this.listener.bind(this));
    }

    componentWillUnmount() {
        this.setState({ connection: 0, error: null });
        this.es.close();
    }

    render() {
        return <div>
            { this.state.connection === 0 && <p>Waiting for first message...</p>}
            { this.state.connection === 2 && <p>Disconnected from server</p>}
            { this.state.error && <p>Error!</p>}
            <ul>{Object.keys(this.state.data).map(key =>
                <li>{key}: {this.state.data[key]}</li>
            )}</ul>
        </div>;
    }

    listener(msg) {
        console.log(msg)
        let data = JSON.parse(msg.data);
        this.setState(state => {
            state.data[data.key] = data.value;
            return state;
        });
    }

    opened() {
        this.setState({ connection: this.es.readyState });
    }

    error(msg) {
        this.setState({ connection: this.es.readyState, error: msg });
    }
}

export default Telemetry;