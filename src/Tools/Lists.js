import React from 'react';

export default class Lists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotationMark: "'"
    };
    this.handleQuotationMarkChange = this.handleQuotationMarkChange.bind(this);
  }

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

  quoteListItems() {
    const lines = this.props.text.split(/\r?\n/);
    const quotationMark = this.state.quotationMark;
    lines.forEach(function (line, index, lines) {
      line = line.trim();
      if (line !== '') { 
        line = line.replaceAll(',', (quotationMark + ',' + quotationMark));
        line = quotationMark + line + quotationMark;
        lines[index] = line;
      }
    });
    const result = lines.join('\n');
    this.props.setText(result);
  }

  handleQuotationMarkChange(event) {
    this.setState({quotationMark: event.target.value});  
  }

  render() {
    return (
      <fieldset className="well well-sm">
        <legend>Lists</legend>
        <p>
          Convert whitespace-separated to comma-separated
          <input type="button" className="btn btn-primary" onClick={() => this.replaceWhitespaceWithComma()} value="Convert" />
        </p>
        <p>
          Sort comma-separated <input type="button" className="btn btn-primary" onClick={() => this.sortCsv()} value="Sort" />
        </p>
        Surround each item with{' '}
        <select value={this.state.quotationMark} onChange={this.handleQuotationMarkChange}>
          <option value="'">'</option>
          <option value='"'>"</option>
        </select>{' '}
        <input type="button" className="btn btn-primary" onClick={() => this.quoteListItems()} value="Quote" />
       </fieldset>
    );
  }
}