import SHADER_CONSTANTS from './shader.constants';

export default `
    precision mediump float;
    
    varying vec2 pass_textureCoords;
    varying vec3 surfaceNormal;
    varying vec3 lightVector;
    
    uniform sampler2D ${SHADER_CONSTANTS.DIFFUSE_TEXTURE};
    uniform int ${SHADER_CONSTANTS.HAS_DIFFUSE_TEXTURE};
    uniform float ${SHADER_CONSTANTS.LIGHT_AMBIENT};
    uniform vec3 ${SHADER_CONSTANTS.LIGHT_COLOR};
    vec4 getDiffuseTexture(){
        if(${SHADER_CONSTANTS.HAS_DIFFUSE_TEXTURE} == 1) {
            return texture2D(${SHADER_CONSTANTS.DIFFUSE_TEXTURE},pass_textureCoords);
        }
        return vec4(0.4, 0.4, 0.4, 1.0);
    }
    float _nDot() {
        vec3 unitNormal = normalize(surfaceNormal);
        vec3 unitLightVector = normalize(lightVector);
        return dot(unitNormal, unitLightVector);
    }
    vec4 diffuseLighting(){
        float brightness = max(_nDot(), ${SHADER_CONSTANTS.LIGHT_AMBIENT});
        return vec4(${SHADER_CONSTANTS.LIGHT_COLOR}.rgb * brightness, 1.0);
    }
    void main(void) {
        gl_FragColor = getDiffuseTexture() * diffuseLighting();
    }
`;
