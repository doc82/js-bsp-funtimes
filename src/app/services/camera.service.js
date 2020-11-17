import { vec3, mat4 } from 'gl-matrix';
import mouseService from './mouse-listener.service';
import webglMgrService from '../services/webgl-manager.service';

const CAMERA_OPTIONS = {
  acclX: 0.01,
  acclY: 0.1,
  acclZ: 0.1
};
const { toRadians } = webglMgrService;

export default class Camera {
  constructor(
    x = 0,
    y = 0,
    z = 3,
    pitch = 0,
    yaw = 0,
    roll = 0,
    near = 0.1,
    far = 1000,
    fov = 40
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.pitch = pitch;
    this.roll = roll;
    this.yaw = yaw;
    this.near = near;
    this.far = far;
    this.fov = fov;
    this.buildMatrix();

    mouseService.subscribe({
      wheelListener: this.handleWheel,
      dragListener: this.handleDrag
    });
  }

  handleDrag = (dX, dY) => {
    this.x += dX * CAMERA_OPTIONS.acclX;
    this.y -= dY * CAMERA_OPTIONS.acclY;
    this.buildMatrix();
  };

  handleWheel = (e) => {
    this.z += e.deltaY * CAMERA_OPTIONS.acclZ;
    this.buildMatrix();
  };

  buildMatrix = () => {
    this.projectionMatrix = this.buildProjectionMatrix();
    this.viewMatrix = this.buildTransformationMatrix();
  };

  buildTransformationMatrix = () => {
    const { pitch, yaw, roll, x, y, z } = this;
    const matrix = [];
    mat4.identity(matrix);
    mat4.rotateX(matrix, matrix, toRadians(pitch));
    mat4.rotateY(matrix, matrix, toRadians(yaw));
    mat4.rotateZ(matrix, matrix, toRadians(roll));
    mat4.translate(matrix, matrix, vec3.fromValues(-x, -y, -z));
    return matrix;
  };

  buildProjectionMatrix = () => {
    const { fov, near, far } = this;
    const { gl } = webglMgrService;
    const matrix = [];
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    mat4.perspective(matrix, toRadians(fov), aspectRatio, near, far);
    return matrix;
  };

  apply = (shader) => {
    const { viewMatrix, projectionMatrix } = this;
    shader.applyViewProjectionMatrices(viewMatrix, projectionMatrix);
  };
}
