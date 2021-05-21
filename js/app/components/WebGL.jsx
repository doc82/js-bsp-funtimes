import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

function WebGL(props) {
  return (
    <Fragment>
      <canvas
        id="js-bsp-funtimes"
        width={props.width || 400}
        height={props.height || 400}
        style={props.style || { border: '1px solid black' }}
      ></canvas>
    </Fragment>
  );
}

WebGL.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object
};

export default WebGL;
