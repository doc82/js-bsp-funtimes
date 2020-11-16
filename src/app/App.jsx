import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import ModelFactory from './models/model.factory';
import SceneManagerService from './scene-manager';
import WebGL from './components/WebGL.jsx';
import modelRegistry from './models/model.registry.js';

const DEFAULT_CONFIG = {
  width: 500,
  height: 500,
  depth: 10
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const id = 'bruceCube';
    const sceneManager = new SceneManagerService(
      'js-bsp-funtimes',
      this.models,
      DEFAULT_CONFIG.width,
      DEFAULT_CONFIG.height,
      DEFAULT_CONFIG.depth
    );
    modelRegistry.registerModelClass(id, ModelFactory.generateBruceCube());
    sceneManager.addModelInstance(
      id,
      { x: 0, y: 0, z: 0 },
      { rx: 0, ry: 0, rz: 0 },
      0.4
    );

    this.sceneManager = sceneManager;
    // Kick-off the animation loop
    window.requestAnimationFrame(this.triggerWebglRender);
  }

  triggerWebglRender = () => {
    const { sceneManager } = this;
    sceneManager.onRender();
    window.requestAnimationFrame(this.triggerWebglRender);
  };

  render() {
    return (
      <Fragment>
        <WebGL
          height={DEFAULT_CONFIG.height}
          width={DEFAULT_CONFIG.width}
        ></WebGL>
      </Fragment>
    );
  }
}
