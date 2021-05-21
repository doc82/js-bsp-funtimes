import SHADER_CONSTANTS from './shader.constants';

export default `
    precision mediump float;
    attribute vec3 ${SHADER_CONSTANTS.POSITION};
    attribute vec2 ${SHADER_CONSTANTS.TEXTURE_COORDS};
    attribute vec3 ${SHADER_CONSTANTS.NORMAL};
    varying vec3 surfaceNormal;
    varying vec3 lightVector;
    varying vec2 pass_textureCoords;
    uniform mat4 ${SHADER_CONSTANTS.TRANSFORMATION_MATRIX};
    uniform mat4 ${SHADER_CONSTANTS.VIEW_MATRIX};
    uniform mat4 ${SHADER_CONSTANTS.PROJECTION_MATRIX};
    uniform vec3 ${SHADER_CONSTANTS.LIGHT_POSITION};
    vec4 getWorldPosition() {
        return ${SHADER_CONSTANTS.PROJECTION_MATRIX} * ${SHADER_CONSTANTS.VIEW_MATRIX} * ${SHADER_CONSTANTS.TRANSFORMATION_MATRIX} * vec4(${SHADER_CONSTANTS.POSITION}, 1.0);
    }
    vec3 getSurfaceNormal() {
        return (${SHADER_CONSTANTS.PROJECTION_MATRIX} * ${SHADER_CONSTANTS.VIEW_MATRIX} * ${SHADER_CONSTANTS.TRANSFORMATION_MATRIX} * vec4(${SHADER_CONSTANTS.NORMAL}, 0.0)).xyz;
    }
    void main(void) {
        vec4 worldPos = getWorldPosition();
        surfaceNormal = getSurfaceNormal();
        lightVector = ${SHADER_CONSTANTS.LIGHT_POSITION} - worldPos.xyz;
        gl_Position = worldPos;
        pass_textureCoords = ${SHADER_CONSTANTS.TEXTURE_COORDS};
    }
`;
