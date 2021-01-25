import React from 'react';

export default class Editor extends React.Component {
  render() {
    return (
      <textarea 
        value={this.props.text}
        onChange={this.props.onChange()} 
        rows='6' 
        style={{minWidth: '100%'}} 
        placeholder='Paste or enter text here...'
        ref={this.props.editorRef}
        autoFocus>
      </textarea>
    );
  }
}
