// JonSchneider's JavaScript JargonSplicer - .js file

function updateStats() {
    var text = document.getElementById("text").value;

    document.getElementById("characterCount").innerHTML = text.length;
    document.getElementById("lineCount").innerHTML = occurrences(text, "\n", false) + 1;
    document.getElementById("wordCount").innerHTML = getWordCount(text);

    var stringToSearchFor = document.getElementById("stringToSearchFor").value;
    if (text.length > 0 && stringToSearchFor.length > 0) {

        document.getElementById("occurrenceCount").innerHTML = occurrences(text, stringToSearchFor, false);
        document.getElementById("occurrenceCountWithOverlaps").innerHTML = occurrences(text, stringToSearchFor, true);
    }
    else {
        document.getElementById("occurrenceCount").innerHTML = "";
        document.getElementById("occurrenceCountWithOverlaps").innerHTML = "";
    }
}
        
function setResult(result) {
    document.getElementById("text").value = result;
    updateStats();
    document.getElementById("text").focus();
}


/** Counts the occurrences of substring in a string.
    * @param {String} string   Required. The string;
    * @param {String} subString    Required. The string to search for;
    * @param {Boolean} allowOverlapping    Optional. Default: false;
    * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
    */
function occurrences(string, subString, allowOverlapping) {

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

function getWordCount(str) {
    if (str.trim().length == 0) {
        return 0;
    }
    var wordCount = str.match(/(\w+)/g).length;
    return wordCount;
}

// http://stackoverflow.com/a/1144788/12484
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function unescapeRegExp(str) {
    return str.replace(/\\([.*+?^=!:${}()|\[\]\/\\])/g, "$1");
}

function replaceWhitespaceWithComma(input) {
    var result = input.trim();
    var result = escapeRegExp(result);  // Avoid regex-meaningful chars in the input messing us up.
    result = result.replace(/\s+/g, ","); // Replaces sequences of /s
    result = unescapeRegExp(result);  // Get rid of the backslashes added by escapeRegExp (not necessarily ALL backslashes).
    setResult(result);
}

// Removes "duplicate" blank (whitespace-only or empty) newlines such that places
// where there were two or more blank lines between paragraphs are replaced with
// a single empty line.
function removeDuplicateBlankLines(input) {
    var result = input.replace(/(\n\s*)+\n/g, '\n\n');
    setResult(result);
}
        
function removeBlankLines(input) {
    var result = input.replace(/^\s*[\r\n]/gm, '');
    setResult(result);
}
        
// Converts a C#-format documentation comment to plain paragraphs of text.
// (This is a partial implementation; only "summary" elements are handled currently)
function convertDocCommentToParagraph(input) {
    var result = input;
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
    setResult(result);
}

function convertToCSharpDocComment(input, lineLength) {

    var outputLines = [];
    outputLines.push("/// <summary>");
    outputLines.push("/// ");
    var outputLineIndex = 1;
    var paragraphStarted = false;

    var inputLines = input.split(/\r?\n/);
    for (var inputLineIndex = 0; inputLineIndex < inputLines.length; inputLineIndex++) {

        var inputLineWords = splitStringWithCSharpDocStuffRemoved(inputLines[inputLineIndex]);

        if (inputLineWords.length == 0 && inputLineIndex > 0 && inputLineIndex + 1 < inputLines.length) {

            if (paragraphStarted) {
                outputLines[outputLineIndex] = outputLines[outputLineIndex] + "</para>";
            }

            outputLines.push("///");
            outputLines.push("/// <para> ");
            outputLineIndex += 2;
            paragraphStarted = true;
        }
        else {
            var currentLineLength = 0;
            for (var wordIndex = 0; wordIndex < inputLineWords.length; wordIndex++) {

                outputLines[outputLineIndex] = outputLines[outputLineIndex] + inputLineWords[wordIndex] + " ";

                if (wordIndex + 1 < inputLineWords.length) {
                    if (outputLines[outputLineIndex].length + inputLineWords[wordIndex + 1].length > lineLength) {
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

    var result = outputLines.join('\n');
    setResult(result);
}

function splitStringWithCSharpDocStuffRemoved(input) {
    // Split the input line into whitespace-separated words
    var inputWords = input.match(/\S+/g) || [];

    var nonDocCommentWords = [];
    for (var inputWordIndex = 0; inputWordIndex < inputWords.length; inputWordIndex++) {
        if (inputWords[inputWordIndex] !== '///'
            && inputWords[inputWordIndex] !== '<summary>'
            && inputWords[inputWordIndex] !== '</summary>'
            && inputWords[inputWordIndex] !== '<para>'
            && inputWords[inputWordIndex] !== '</para>') {
            nonDocCommentWords.push(inputWords[inputWordIndex]);
        }
    }
    var result = nonDocCommentWords;

    return result;
}

function stripAngleBracketTags(input) {
    var tmp = document.implementation.createHTMLDocument().body;
    tmp.innerHTML = input.trim();
    var result = tmp.textContent || tmp.innerText || "";
    setResult(result);
}
        
function sortCsv(input) {
    var whitespaceAfterCommaRemoved = input.replace(/,\s+/g, ',');
    var csvArray = whitespaceAfterCommaRemoved.split(',');
    var sortedArray = csvArray.sort();
    var sortedCsv = sortedArray.join(", ");
    setResult(sortedCsv);
}

// Trims leading and trailing whitespace from each line of the input.
function trimLines(input) {
    var arrayOfLines = input.split(/\r?\n/);
    arrayOfLines.forEach(function (line, index, arrayOfLines) {
        arrayOfLines[index] = line.trim();
    });
    var result = arrayOfLines.join('\n');
    setResult(result);
}

// For each adjacent non-blank line of the input, joins those lines into a single line.
// (Useful for fixing up a document of blank-line-separated paragraphs with some single
// newline characters present in mid-paragraph.)
function joinAdjacentLines(input) {
    var arrayOfLines = input.split(/\r?\n/);
    for (lineIndex = arrayOfLines.length - 1; lineIndex > 0; lineIndex--) {
        if (arrayOfLines[lineIndex].trim().length > 0 && arrayOfLines[lineIndex - 1].trim().length > 0) {
            arrayOfLines[lineIndex - 1] = arrayOfLines[lineIndex - 1] + " " + arrayOfLines[lineIndex];
            arrayOfLines.splice(lineIndex, 1);
        }
    }
    var result = arrayOfLines.join('\n');
    setResult(result);
}

function addLeadingAngleBracketAndSpaceToEachLine(input) {
    var arrayOfLines = input.split(/\r?\n/);
    arrayOfLines.forEach(function (line, index, arrayOfLines) {
        arrayOfLines[index] = "> " + line;
    });
    var result = arrayOfLines.join('\n');
    setResult(result);
}

function convertCommaSeparatedParamListToCStyleDebugOutputString(input) {
    var whitespaceAfterCommaRemoved = input.replace(/,\s+/g, ',');
    var csvArray = whitespaceAfterCommaRemoved.split(',');
    var result = "";

    for (var i = 0; i < csvArray.length; i++) {
        result = result + csvArray[i] + ': [" + ' + csvArray[i] + ' + "]'

        if (i < csvArray.length - 1) {
            result = result + ', ';
        }
    }

    setResult(result);
}
