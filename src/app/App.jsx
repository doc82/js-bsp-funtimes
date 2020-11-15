import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import ModelFactory from './models/model.factory';
import SceneManagerService from './scene-manager.service';
import WebGL from './components/WebGL.jsx';
import WebGlManagerService from './services/webgl-manager.service';

const DEFAULT_CONFIG = {
  width: 500,
  height: 500,
  depth: 10
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // List of Model-classes to toss into the scene
    // TODO: is this even the right spot to put this? maybe a singleton "model manager service thingymabob"
    this.modelRegistry = {};
    this.sceneManager = null;
    this.sceneManager = new SceneManagerService(
      this.models,
      DEFAULT_CONFIG.width,
      DEFAULT_CONFIG.height,
      DEFAULT_CONFIG.depth
    );
    WebGlManagerService.init(this.sceneManager.gl);
  }

  componentDidMount() {
    // Create a the-goat cube
    this.modelRegistry['cube'] = ModelFactory.generateBruceCube();
    this.sceneManager.updateScene(this.models);
  }

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
