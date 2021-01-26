import React from 'react';

export default class StatisticsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };

    this.handleSearchStringChange = this.handleSearchStringChange.bind(this);
  }

  componentDidMount() {
    this.editor = this.props.editorRef.current;

    // Update the selected character count when the selection might have changed
    this.editor.addEventListener('select', () => {
      this.forceUpdate();
    });

    // Update the selected character count when the selection might have changed
    this.editor.addEventListener('keyup', () => {
      this.forceUpdate();
    });

    // Update the selected character count when the selection might have changed
    this.editor.onclick = () => {
      this.forceUpdate();
    };

    // Update the selected character count as the user is dragging the mouse around. Seems performant enough!
    this.editor.addEventListener('mousemove', (e) => {
      if (e.button == 0) {
        this.forceUpdate();
      }
    });
  }

  getCharacterCount() {
    return this.props.text.length;
  }

  getWordCount() {
    if (this.props.text.trim().length === 0) {
      return 0;
    }
    const words = this.props.text.match(/(\w+)/g);
    if (words == null)
    {
      return 0;
    }
    const wordCount = this.props.text.match(/(\w+)/g).length;
    return wordCount;
  }

  getLineCount() {
    return this.occurrences(this.props.text, "\n", false) + 1
  }

  getOccurrenceCount() {
    if (this.props.text.length > 0 && this.state.searchString.length > 0) {
      return this.occurrences(this.props.text, this.state.searchString, false);
    }
    return '';
  }

  getOccurrenceCountIncludingOverlaps() {
    if (this.props.text.length > 0 && this.state.searchString.length > 0) {
      return this.occurrences(this.props.text, this.state.searchString, true);
    }
    return '';
  }

  /* Counts the occurrences of substring in a string.
    Author: Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
  */
  occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }

    return n;
  }

  handleSearchStringChange(e) {
    this.setState({searchString: e.target.value});
  }

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="low-profile">Statistics</h3>
        </div>
        <div className="panel-body">
          Character count: <span className="big">{this.getCharacterCount()}</span>
          <br />
          Word count: <span className="big">{this.getWordCount()}</span>
          <br />
          Line count: <span className="big">{this.getLineCount()}</span>

          <fieldset className="well well-sm">
            <legend>Selection</legend>

            {(this.editor && (this.editor.selectionEnd - this.editor.selectionStart) > 0) &&
              <div>
                Character count: <span className="big">{this.editor.selectionEnd - this.editor.selectionStart}</span>
              </div>
            }
            {(this.editor == null || (this.editor.selectionEnd - this.editor.selectionStart) <= 0) &&
              <div>
                (None)
              </div>
            }
          </fieldset>

          <fieldset className="well well-sm">
            <legend>Substring</legend>
            <input type="text" value={this.state.searchString} onChange={(e) => this.handleSearchStringChange(e)} />
            <br />
            Occurrence count: <strong><span className="big">{this.getOccurrenceCount()}</span></strong>
            <br />
            Including overlaps: <strong><span className="big">{this.getOccurrenceCountIncludingOverlaps()}</span></strong>
          </fieldset>
        </div>
      </div>
    );
  }
}