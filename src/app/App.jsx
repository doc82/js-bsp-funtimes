import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { ShapeFactory } from '../geometry';
import SceneManagerService from './scene-manager.service';
import WebGL from './components/WebGL.jsx';

const DEFAULT_CONFIG = {
  width: 500,
  height: 500,
  depth: 10
};
const { Cube } = ShapeFactory;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // List of Polygons
    this.scene = [];
    this.sceneManager = null;
    this.sceneManager = new SceneManagerService(
      this.scene,
      DEFAULT_CONFIG.width,
      DEFAULT_CONFIG.height,
      DEFAULT_CONFIG.depth
    );
  }

  componentDidMount() {
    const cube = new Cube();
    this.scene.push(cube);
    this.sceneManager.updateScene(this.scene);
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
