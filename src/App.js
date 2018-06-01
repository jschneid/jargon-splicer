import React from 'react';
import Editor from './Editor.js';
import StatisticsDisplay from './StatisticsDisplay.js';
import Tools from './Tools.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  setText(text) {
    this.setState({text: text});
  }

  render() {
    return (
      <div>
        <Editor text={this.state.text} onChange={(e) => this.handleChange.bind(this)} />
        <div className="row">
          <div className="col-md-3">
            <StatisticsDisplay text={this.state.text} />
          </div>
          <div className="col-md-9">
            <Tools text={this.state.text} setText={(text) => this.setText.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}
