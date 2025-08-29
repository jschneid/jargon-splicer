import React from 'react';
import Email from './Tools/Email.js';
import Lists from './Tools/Lists.js';
import Paragraphs from './Tools/Paragraphs.js';
import Programming from './Tools/Programming.js';

export default class Tools extends React.Component {
  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="low-profile">Manipulation</h3>
        </div>
        <div className="panel-body">
          <div className="row">
            <div className="col-md-6">
              <Lists text={this.props.text} setText={this.props.setText()} />
              <Paragraphs text={this.props.text} setText={this.props.setText()} />
            </div>
            <div className="col-md-6">
              <Programming text={this.props.text} setText={this.props.setText()} />
              <Email text={this.props.text} setText={this.props.setText()} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}