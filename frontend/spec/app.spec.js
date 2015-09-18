import React from 'react/addons';
import App from '../app';

require('./specHelper');

const TestUtils = React.addons.TestUtils;

describe('The IMDB word2vec visualizer', () => {
  describe('Searching for a word', () => {
    let app;
    beforeEach(() => {
      app = React.render(<App />, root)
    });

    it('makes a request and shows related words if it is successful', () => {
      app.doWordRequest('abcdef');

      const request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({
        status: 200,
        responseText: JSON.stringify({'foo': .5})
      });

      expect(request).toBeDefined();
      expect(request.url).toContain('similarity/abcdef');

      expect($('.similar-words').text()).toContain('foo');
    });

    it('makes a request and shows an error if it fails jsonly', () => {
      app.doWordRequest('abcdef');

      const request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({
        status: 500,
        responseText: JSON.stringify({error: 'Some error'})
      });

      expect($('h1').text()).toEqual('Error');
      expect($('h3').text()).toEqual('Some error');
    });

    it('makes a request and shows an error if it fails textily', () => {
      app.doWordRequest('abcdef');

      const request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({
        status: 500,
        responseText: 'Something bad happened'
      });

      expect($('h1').text()).toEqual('Error');
      expect($('h3').text()).toEqual('Something bad happened');
    });
  });
});