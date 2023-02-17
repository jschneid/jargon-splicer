import React from 'react';

export default class Urls extends React.Component {
  removeAnalyticsCruft() {
    let text = this.props.text.trim();

    let sansGoogleAnalytics = this.undoGoogleAnalytics(text);
    if (sansGoogleAnalytics !== text) {
      this.props.setText(sansGoogleAnalytics);
      return;
    }

    let extractedUrl = this.extractRealUrlFromClickthrough(text);
    if (extractedUrl !== text) {
      this.props.setText(extractedUrl);
      return;
    }
  }

  // Clean up URLs like
  // https://www.google.com/url?q=https://www.example.com/a1/b2/c3%26d%3D4%26e%3D5%26f%3D6&sa=D&source=calendar&ust=1651355517546069&usg=AOvVaw3w3wuhdwnFvFPYQpHuzXPX
  undoGoogleAnalytics(text) {
      if (!(text.startsWith('https://www.google.com/url?'))) {
          return text;
      }

      // Trim the leading google.com stuff
      text = text.substr(29);

      // Trim everything including and after the first "&"
      text = text.substr(0, text.indexOf("&"));

      // Turn encoded "?" and "&" and "=" back into real characters
      text = decodeURIComponent(text);

      return text;
  }

  // Extract the "real" URL from tracking/redirecting URLs like:
  // https://www.jdoqocy.com/click-4485850-12465255?sid=3b92102eaf1411ed941312b0c970275b0INT&url=https%3A%2F%2Feyedictive.com%2Fproduct%2Fgunnar-vertex-onyx-rectangle-gaming-computer-glasses%2F
  extractRealUrlFromClickthrough(text) {
    let decoded = decodeURIComponent(text);
    let nonLeadingHttpsIndex = decoded.indexOf('https://', 8);
    let nonLeadingUrl = decoded.substring(nonLeadingHttpsIndex);
    return nonLeadingUrl;
  }

  render() {
    return (
      <fieldset className="well well-sm">
        <legend>URL<span className="small-caps">s</span></legend>
        Remove analytics cruft{' '}
        <span className="small-caps">beta</span>{' '}
        <input type="button" className="btn btn-primary" onClick={() => this.removeAnalyticsCruft()} value="Strip" />
      </fieldset>
    );
  }
}