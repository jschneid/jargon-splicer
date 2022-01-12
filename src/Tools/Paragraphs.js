import React from 'react';

export default class Paragraphs extends React.Component {

  // Removes "duplicate" blank (whitespace-only or empty) newlines such that places
  // where there were two or more blank lines between paragraphs are replaced with
  // a single empty line.
  removeDuplicateBlankLines() {
    const result = this.props.text.replace(/(\n\s*)+\n/g, '\n\n');
    this.props.setText(result);
  }

  removeBlankLines() {
    const result = this.props.text.replace(/^\s*[\r\n]/gm, '');
    this.props.setText(result);
  }

  duplicateNewlines() {
    const result = this.props.text.replaceAll('\n', '\n\n');
    this.props.setText(result);
  }

  // Trims leading and trailing whitespace from each line of the text.
  trimLines() {
    let arrayOfLines = this.props.text.split(/\r?\n/);
    arrayOfLines.forEach(function (line, index, arrayOfLines) {
      arrayOfLines[index] = line.trim();
    });
    const result = arrayOfLines.join('\n');
    this.props.setText(result);
  }

  // For each adjacent non-blank line of the input, joins those lines into a single line.
  // (Useful for fixing up a document of blank-line-separated paragraphs with some single
  // newline characters present in mid-paragraph.)
  joinAdjacentLines() {
    const arrayOfLines = this.props.text.split(/\r?\n/);
    for (let lineIndex = arrayOfLines.length - 1; lineIndex > 0; lineIndex--) {
        if (arrayOfLines[lineIndex].trim().length > 0 && arrayOfLines[lineIndex - 1].trim().length > 0) {
            arrayOfLines[lineIndex - 1] = arrayOfLines[lineIndex - 1] + " " + arrayOfLines[lineIndex];
            arrayOfLines.splice(lineIndex, 1);
        }
    }
    var result = arrayOfLines.join('\n');
    this.props.setText(result);
  }
 
  render() {
    return (
   <fieldset className="well well-sm">
      <legend>Paragraphs</legend>
      <p>
          Remove duplicate blank lines <input type="button" className="btn btn-primary" onClick={() => this.removeDuplicateBlankLines()} value="Remove" />
      </p>
      <p>
          Remove all blank lines <input type="button" className="btn btn-primary" onClick={() => this.removeBlankLines()} value="Remove" />
      </p>
      <p>
        Duplicate newlines <input type="button" className="btn btn-primary" onClick={() => this.duplicateNewlines()} value="Duplicate" />
      </p>
      <p>
          Trim each line <input type="button" className="btn btn-primary" onClick={() => this.trimLines()} value="Trim" />
      </p>
      Join adjacent lines <input type="button" className="btn btn-primary" onClick={() => this.joinAdjacentLines()} value="Join" />
    </fieldset>
    );
  }
}