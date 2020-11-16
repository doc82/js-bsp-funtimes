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
    this.camX = x;
    this.camY = y;
    this.camZ = z;
    this.camPitch = pitch;
    this.camRoll = roll;
    this.camYaw = yaw;
    this.camNear = near;
    this.camFar = far;
    this.camFov = fov;
    debugger;
    this.projectionMatrix = this.buildProjectionMatrix();
    this.viewMatrix = this.buildTransformationMatrix();

    // TODO: we want WASD keyboard next!
    // Listen to drag/wheel events!
    mouseService.subscribe({
      wheelListener: this.handleWheel,
      dragListener: this.handleDrag
    });
  }

  handleDrag = (dX, dY) => {
    this.camX += dX * CAMERA_OPTIONS.acclX;
    this.camY -= dY * CAMERA_OPTIONS.acclY;
    this.buildMatrix();
  };

  handleWheel = (e) => {
    this.camZ += e.deltaY * CAMERA_OPTIONS.acclZ;
    this.buildMatrix();
  };

  buildMatrix = () => {
    this.projectionMatrix = this.buildProjectionMatrix();
    this.viewMatrix = this.buildTransformationMatrix();
  };

  buildTransformationMatrix = () => {
    const matrix = [];
    mat4.identity(matrix);
    mat4.rotateX(matrix, matrix, toRadians(this.pitch));
    mat4.rotateY(matrix, matrix, toRadians(this.yaw));
    mat4.rotateZ(matrix, matrix, toRadians(this.roll));
    mat4.translate(matrix, matrix, vec3.fromValues(-this.x, -this.y, -this.z));
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
    debugger;
    const { viewMatrix, projectionMatrix } = this;
    shader.applyViewProjectionMatrices(viewMatrix, projectionMatrix);
  };
}
