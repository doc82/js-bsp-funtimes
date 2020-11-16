import VertexShader from './vertex.shader';
import FragmentShader from './fragment.shader';
import Locations from './shader.constants';
import webglService from '../services/webgl-manager.service';

export default class ShaderService {
  constructor() {
    // build fragment shader first then vertex
    const fragmentShader = webglService.createFragmentShader();
    webglService.addShaderSource(fragmentShader, FragmentShader);
    webglService.compileShader(fragmentShader);
    this.compileStatus(fragmentShader);

    const vertexShader = webglService.createVertexShader();
    webglService.addShaderSource(vertexShader, VertexShader);
    webglService.compileShader(vertexShader);
    this.compileStatus(vertexShader);

    const prog = webglService.createShaderProg();
    webglService.attachShaderToProg(prog, vertexShader);
    webglService.attachShaderToProg(prog, fragmentShader);
    webglService.linkProg(prog);

    this.positionAttribute = webglService.getProgAttrbLocation(
      prog,
      Locations.POSITION
    );
    this.textureCoordsAttribute = webglService.getProgAttrbLocation(
      prog,
      Locations.TEXTURE_COORDS
    );
    this.normalAttribute = webglService.getProgAttrbLocation(
      prog,
      Locations.NORMAL
    );

    // Transformation, View, and Projection matrices
    this.transformationMatrix = webglService.getUniformLocation(
      prog,
      Locations.TRANSFORMATION_MATRIX
    );
    this.viewMatrix = webglService.getUniformLocation(
      prog,
      Locations.VIEW_MATRIX
    );
    this.projectionMatrix = webglService.getUniformLocation(
      prog,
      Locations.PROJECTION_MATRIX
    );

    // Lighting
    this.lightPosition = webglService.getUniformLocation(
      prog,
      Locations.LIGHT_POSITION
    );
    this.lightColor = webglService.getUniformLocation(
      prog,
      Locations.LIGHT_COLOR
    );
    this.lightAmbient = webglService.getUniformLocation(
      prog,
      Locations.LIGHT_AMBIENT
    );
    // Texture Diffusing!
    this.diffuseTexture = webglService.getUniformLocation(
      prog,
      Locations.DIFFUSE_TEXTURE
    );
    this.hasDiffuseTexture = webglService.getUniformLocation(
      prog,
      Locations.HAS_DIFFUSE_TEXTURE
    );
    this.prog = prog;
  }

  applyTextureCoords = () => {
    const { textureCoordsAttribute } = this;
    webglService.applyVertexAttribArray(textureCoordsAttribute);
    webglService.pointToAttribute(textureCoordsAttribute, 2);
  };

  applyPosition = () => {
    const { positionAttribute } = this;
    webglService.applyVertexAttribArray(positionAttribute);
    webglService.pointToAttribute(positionAttribute, 3);
  };

  applyShader = () => {
    const { prog } = this;
    webglService.useProg(prog);
  };

  applyNormals = () => {
    const { normalAttribute } = this;
    webglService.applyVertexAttribArray(normalAttribute);
    webglService.pointToAttribute(normalAttribute, 3);
  };

  applyTransformationMatrix = (matrix) => {
    const { transformationMatrix } = this;
    webglService.uploadMatrix4fv(transformationMatrix, matrix);
  };

  applyViewProjectionMatrices = (view, projection) => {
    const { viewMatrix, projectionMatrix } = this;
    webglService.uploadMatrix4fv(viewMatrix, view);
    webglService.uploadMatrix4fv(projection, projectionMatrix);
  };

  applyLight = (light) => {
    const { lightPosition, lightColor, lightAmbient } = this;
    webglService.uploadVec3f(lightPosition, light.getPosition());
    webglService.uploadVec3f(lightColor, light.getColor());
    webglService.uploadFloat(lightAmbient, light.getAmbient());
  };

  compileStatus = (shader) => {
    if (
      !webglService.gl.getShaderParameter(
        shader,
        webglService.gl.COMPILE_STATUS
      )
    ) {
      // eslint-disable-next-line no-console
      console.error('Error! Failed to compile shader!');
      console.error(webglService.gl.getShaderInfoLog(shader));
    }
  };
}
