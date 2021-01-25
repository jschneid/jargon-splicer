import React from 'react';
import Editor from './Editor.js';
import StatisticsDisplay from './StatisticsDisplay.js';
import Tools from './Tools.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // This is the "Controlled component" pattern: https://reactjs.org/docs/forms.html
    this.state = { text: '' };

    this.editorRef = React.createRef();
    this.selectNeeded = false;
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  setText(text) {
    this.setState({text: text});

    this.selectNeeded = true;
  }

  componentDidUpdate() {
    if (this.selectNeeded) {
      this.editorRef.current.focus();
      this.editorRef.current.select();
      this.selectNeeded = false;
    }
  }

  render() {
    return (
      <div>
        <Editor 
          text={this.state.text} 
          onChange={(e) => this.handleChange.bind(this)} 
          editorRef={this.editorRef}
        />
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
