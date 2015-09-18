import React from 'react'
import App from './app'

let getQueryParameters = () => {
  return document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
};

let app = React.render(<App />, document.querySelector('body'));
app.doWordRequest(getQueryParameters()['query']);
