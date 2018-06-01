import React from 'react';

export default class Lists extends React.Component {

  // Adapted from http://stackoverflow.com/a/1144788/12484
  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
  }

  unescapeRegExp(str) {
    return str.replace(/\\([.*+?^=!:${}()|[\]/\\])/g, "$1");
  }

  replaceWhitespaceWithComma() {
    let result = this.props.text.trim();
    result = this.escapeRegExp(result);  // Avoid regex-meaningful chars in the input messing us up.
    result = result.replace(/\s+/g, ','); // Replaces sequences of /s
    result = this.unescapeRegExp(result);  // Get rid of the backslashes added by escapeRegExp (not necessarily ALL backslashes).
    this.props.setText(result);
  }

  sortCsv() {
    const whitespaceAfterCommaRemoved = this.props.text.replace(/,\s+/g, ',');
    const csvArray = whitespaceAfterCommaRemoved.split(',');
    const sortedArray = csvArray.sort();
    const sortedCsv = sortedArray.join(',');
    this.props.setText(sortedCsv);
  }

  render() {
    return (
      <fieldset className="well well-sm">
        <legend>Lists</legend>
        <p>
          Convert whitespace-separated string to comma-separated
          <input type="button" className="btn btn-primary" onClick={() => this.replaceWhitespaceWithComma()} value="Convert" />
        </p>
        Sort comma-separated <input type="button" className="btn btn-primary" onClick={() => this.sortCsv()} value="Sort" />
       </fieldset>
    );
  }
}