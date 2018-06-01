import React from 'react';

export default class Email extends React.Component {

  addLeadingAngleBracketAndSpaceToEachLine() {
    const arrayOfLines = this.props.text.split(/\r?\n/);
    arrayOfLines.forEach(function (line, index, arrayOfLines) {
      arrayOfLines[index] = "> " + line;
    });
    const result = arrayOfLines.join('\n');
    this.props.setText(result);
}

  render() {
    return (
      <fieldset className="well well-sm">
        <legend>Communication</legend>
        Prefix each line with <code>&gt; </code>&nbsp;
        <input type="button" className="btn btn-primary" onClick={() => this.addLeadingAngleBracketAndSpaceToEachLine()} value="Quote" />
      </fieldset>
    );
  }
}