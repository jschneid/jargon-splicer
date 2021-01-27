import React from 'react';

export default class SelectionStats extends React.Component {
  constructor(props) {
    super(props);
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

  render() {
    return (
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
    );
  }
}