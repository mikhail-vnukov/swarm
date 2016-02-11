'use strict';

describe('ExchApp', () => {
  let React = require('react/addons');
  let ExchApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ExchApp = require('components/ExchApp.js');
    component = React.createElement(ExchApp);
  });

  it('should create a new instance of ExchApp', () => {
    expect(component).toBeDefined();
  });
});
