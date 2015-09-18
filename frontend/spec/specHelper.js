import 'babel/polyfill';
import 'jasmine-ajax';

Object.assign(global, {$: require('jquery'), React: require('react')});

beforeEach(function() {
  jasmine.Ajax.install();
  $('body').find('#root').remove().end().append('<div id="root"/>');
});

afterEach(function() {
  jasmine.Ajax.uninstall();
  React.unmountComponentAtNode(root);
});
