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

  // Reformat the janky text that are the typical result of copying multiple lines out of a 
  // Claude Code terminal (as of May 2026). e.g.: Hard line breaks where lines wrap in the terminal; 
  // 3-space gaps between words in places where those breaks were after manually removing them.
  fixClaudeCopiedText() {
    const arrayOfLines = this.props.text.split(/\r?\n/);

    // Remove 2-space paragraph indenting.
    // (Make an effort to NOT do this for stuff that isn't paragraphs.)
    for (let lineIndex = 0; lineIndex < arrayOfLines.length; lineIndex++) {
      // mid-paragraph text with a 2-space ident + a 1-space word break 
      if (arrayOfLines[lineIndex].startsWith('   ') 
        && !arrayOfLines[lineIndex].startsWith('    ')) {
          arrayOfLines[lineIndex] = arrayOfLines[lineIndex].substring(3);
      } 
      else if (arrayOfLines[lineIndex].startsWith('  ') 
        && !arrayOfLines[lineIndex].startsWith('   ') 
        && !arrayOfLines[lineIndex].startsWith('  ⎿')) {
          arrayOfLines[lineIndex] = arrayOfLines[lineIndex].substring(2);
      } 
    }

    // Join lines that were broken by Claude's terminal but are actually part of the same paragraph.
    let inCodeBlock = false;
    for (let lineIndex = arrayOfLines.length - 1; lineIndex > 0; lineIndex--) {
      if (arrayOfLines[lineIndex].trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }

        if (arrayOfLines[lineIndex].trim().length > 0 
          && arrayOfLines[lineIndex - 1].trim().length > 0 
          && arrayOfLines[lineIndex].trim().charAt(0) !== '⎿'
          && arrayOfLines[lineIndex].slice(0, 4) !== '    '
          && arrayOfLines[lineIndex].slice(0, 2) !== '- ' // bulleted list item 
          && !inCodeBlock
        ) {
            arrayOfLines[lineIndex - 1] = arrayOfLines[lineIndex - 1] + " " + arrayOfLines[lineIndex];
            arrayOfLines.splice(lineIndex, 1);
        }
    }

    var result = arrayOfLines.join('\n');
    this.props.setText(result);
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

  render() {
    return (
      <fieldset className="well well-sm">
        <legend>Programming</legend>
        <p>
          Fix ¶s copied from Claude Code terminal 
          <span className="label">beta</span>
          <input type="button" className="btn btn-primary" onClick={() => this.fixClaudeCopiedText()} value="Format" />
        </p>
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
      </fieldset>
    );
  }
}