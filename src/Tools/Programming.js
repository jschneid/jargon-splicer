import React from 'react';

export default class Programming extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docCommentLineLength: 120,
      docCommentLineLengthError: false
    };

    this.handleDocCommentLineLengthChange = this.handleDocCommentLineLengthChange.bind(this);
  }

  handleDocCommentLineLengthChange(e) {
    this.setState({docCommentLineLengthError: !this.isNormalInteger(e.target.value)});
    this.setState({docCommentLineLength: e.target.value});
  }

  getDocCommentLineLength() {
    if (this.isNormalInteger(this.state.docCommentLineLength)) {
      return this.state.docCommentLineLength;
    } 
    else {
      return 120;
    }
  }

  // Credit: T.J. Crowder - https://stackoverflow.com/a/10834843/12484
  isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  stripAngleBracketTags() {
    let htmlDocument = document.implementation.createHTMLDocument().body;
    htmlDocument.innerHTML = this.props.text.trim();
    const result = htmlDocument.textContent || htmlDocument.innerText || "";
    this.props.setText(result);
  } 

  // Converts a C#-format documentation comment to plain paragraphs of text.
  // (This is a partial implementation; only "summary" elements are handled currently)
  convertDocCommentToParagraph() {
    let result = this.props.text;
    // Strip "<summary>", "</summary>"
    result = result.replace(/<summary>/g, '');
    result = result.replace(/<\/summary>/g, '');
    // Strip "<para>", "</para>"
    result = result.replace(/<para>/g, '');
    result = result.replace(/<\/para>/g, '');
    // Strip "///"
    result = result.replace(/\/\/\//g, '');
    // Strip extra consecutive spaces
    result = result.replace(/[ \t]+/g, ' ');
    // Delete whitespace from blank lines
    result = result.replace(/\n\s+\n/g, '\n\n');
    // Delete single newlines (leaving multi-newline paragraph breaks).
    // (Credit: Tim Pietzcker - http://stackoverflow.com/a/18012521/12484 )
    result = result.replace(/(^|[^\n])\n(?!\n)/g, "$1");
    // Clean up remaining leading whitespace on each line
    result = result.replace(/\n[ \t]+/g, '\n');
    result = result.trim();
    this.props.setText(result);
  }

  convertToCSharpDocComment() {
    let outputLines = [];
    outputLines.push("/// <summary>");
    outputLines.push("/// ");
    let outputLineIndex = 1;
    let paragraphStarted = false;

    const docCommentLineLength = this.getDocCommentLineLength();

    const inputLines = this.props.text.split(/\r?\n/);
    for (let inputLineIndex = 0; inputLineIndex < inputLines.length; inputLineIndex++) {

      const inputLineWords = this.splitStringWithCSharpDocStuffRemoved(inputLines[inputLineIndex]);

      if (inputLineWords.length === 0 && inputLineIndex > 0 && inputLineIndex + 1 < inputLines.length) {
        if (paragraphStarted) {
            outputLines[outputLineIndex] = outputLines[outputLineIndex] + "</para>";
        }

        outputLines.push("///");
        outputLines.push("/// <para> ");
        outputLineIndex += 2;
        paragraphStarted = true;
      }
      else {
        for (let wordIndex = 0; wordIndex < inputLineWords.length; wordIndex++) {
          outputLines[outputLineIndex] = outputLines[outputLineIndex] + inputLineWords[wordIndex] + " ";

          if (wordIndex + 1 < inputLineWords.length) {
            if (outputLines[outputLineIndex].length + inputLineWords[wordIndex + 1].length > docCommentLineLength) {
              outputLines.push("/// ");
              outputLineIndex++;
            }
          }
        }
      }
    }

    if (paragraphStarted) {
        outputLines[outputLineIndex] = outputLines[outputLineIndex] + "</para>";
    }

    outputLines.push("/// </summary> ");

    const result = outputLines.join('\n');
    this.props.setText(result);
  }

  splitStringWithCSharpDocStuffRemoved(input) {
    // Split the input line into whitespace-separated words
    const inputWords = input.match(/\S+/g) || [];

    let nonDocCommentWords = [];
    for (var inputWordIndex = 0; inputWordIndex < inputWords.length; inputWordIndex++) {
        if (inputWords[inputWordIndex] !== '///'
            && inputWords[inputWordIndex] !== '<summary>'
            && inputWords[inputWordIndex] !== '</summary>'
            && inputWords[inputWordIndex] !== '<para>'
            && inputWords[inputWordIndex] !== '</para>') {
            nonDocCommentWords.push(inputWords[inputWordIndex]);
        }
    }
    return nonDocCommentWords;
  }

  convertCommaSeparatedParamListToCStyleDebugOutputString() {
    const whitespaceAfterCommaRemoved = this.props.text.replace(/,\s+/g, ',');
    const csvArray = whitespaceAfterCommaRemoved.split(',');
    let result = "";

    for (var i = 0; i < csvArray.length; i++) {
      var wordArray = csvArray[i].match(/\S+/g);
      var variableName = wordArray[wordArray.length - 1];

      result = result + variableName + ': [" + ' + variableName + ' + "]'

      if (i < csvArray.length - 1) {
        result = result + ', ';
      }
    }

    this.props.setText(result);
  }

  githubDiffKeepLeftHandSide() {
    this.githubDiffKeepLinesWith('-');
  }

  githubDiffKeepRightHandSide() {
    this.githubDiffKeepLinesWith('+');
  }

  githubDiffKeepLinesWith(marker) {
    const lines = this.props.text.split(/\r?\n/);
    const resultLines = [];

    for (let line = 0; line < lines.length; line++) {
      if (lines[line][0] === '+' || lines[line][0] === '-') {
        if (lines[line][0] === marker) {
          // This is a line we want to keep, with the marker removed
          const lineWithMarkerRemoved = lines[line].substring(1);
          resultLines.push(lineWithMarkerRemoved);
        }
        else {
          // This is a line from the other side of the diff; ignore it
        }
      }
      else {
        // This is an unchanged line. Add it; but don't add the next line if it is identical
        const lineWithPaddingRemoved = lines[line].substring(1);
        resultLines.push(lineWithPaddingRemoved);


        if (line < (lines.length - 1) && lines[line] === lines[line + 1]) {
          // The next line is the same, skip it.
          line++;
        }
      }
    }

    const result = resultLines.join('\n');
    this.props.setText(result);
  }

  render() {
    return (
      <fieldset className="well well-sm">
        <legend>Programming</legend>
        <p>
          Strip HTML tags <input type="button" className="btn btn-primary" onClick={() => this.stripAngleBracketTags()} value="Strip" />
        </p>
        <p>
          Convert C# doc comment to plain text <input type="button" className="btn btn-primary" onClick={() => this.convertDocCommentToParagraph()} value="Convert" />
        </p>
        <p>
          Convert text to C# doc comment with line length:&nbsp;
          <input type="text" className={this.state.docCommentLineLengthError ? 'error' : ''} value={this.state.docCommentLineLength} size="3" onChange={(e) => this.handleDocCommentLineLengthChange(e)} />
          <input type="button" className="btn btn-primary" onClick={() => this.convertToCSharpDocComment()} value="Convert" />
        </p>
        <p>
        Convert CSV param list to C-style debug output string
        <input type="button" className="btn btn-primary" onClick={() => this.convertCommaSeparatedParamListToCStyleDebugOutputString()} value="Convert" />
        </p>

        GitHub.com diff: Clean text from clipboard copy&nbsp;

        <input type="button" className="btn btn-primary" onClick={() => this.githubDiffKeepLeftHandSide()} value="&#x2796; Get Left-Hand Side" />&nbsp;
        <input type="button" className="btn btn-primary" onClick={() => this.githubDiffKeepRightHandSide()} value="&#x2795; Get Right-Hand Side" />

      </fieldset>
    );
  }
}