import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import ModelFactory from './models/model.factory';
import SceneManagerService from './scene-manager';
import WebGL from './components/WebGL.jsx';
import modelRegistry from './models/model.registry.js';
import utils from './utils';

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
      window.innerWidth || DEFAULT_CONFIG.width,
      window.innerHeight || DEFAULT_CONFIG.height,
      DEFAULT_CONFIG.depth
    );
    modelRegistry.registerModelClass(id, ModelFactory.generateBruceCube());

    sceneManager.addModelInstance(
      id,
      { x: 0, y: 0, z: 0 },
      { rx: 0, ry: 0, rz: 0 },
      0.4
    );
    for (let i = 0; i < 100; i += 1) {
      sceneManager.addModelInstance(
        id,
        {
          x: utils.getRandomInt(-50, 50),
          y: utils.getRandomInt(i * -2, 50),
          z: utils.getRandomInt(i * -2, 50)
        },
        {
          rx: utils.getRandomInt(0, 360),
          ry: utils.getRandomInt(0, 360),
          rz: utils.getRandomInt(0, 360)
        },
        0.4
      );
    }

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
