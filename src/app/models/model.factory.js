/* eslint-disable prettier/prettier */
import Model from './model';
const vertices = [
  // Front 
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  
  // Back 
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,
  
  // Top 
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
  
  // Bottom 
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,
  
  // Right 
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
  
  // Left 
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
];

const indices = [
  0,  1,  2,      0,  2,  3,    // Front
  4,  5,  6,      4,  6,  7,    // Back
  8,  9,  10,     8,  10, 11,   // Top
  12, 13, 14,     12, 14, 15,   // Bottom
  16, 17, 18,     16, 18, 19,   // Right
  20, 21, 22,     20, 22, 23,   // Left
];

const normals = [
  // Front
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,

  // Back
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,

  // Top
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,

  // Bottom
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,

  // Right
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,

  // Left
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0
];

const textureCoords = [
  // Front
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Back
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Top
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Bottom
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Right
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
  // Left
  0.0,  0.0,
  1.0,  0.0,
  1.0,  1.0,
  0.0,  1.0,
];

const Cube = {
  vertices,
  indices,
  normals,
  textureCoords
};

export default {
  generateBruceCube: () => {
    const vertices = Cube.vertices;
    const indices = Cube.indices;
    const normals = Cube.normals;
    const textureCoords = Cube.textureCoords;
    const bruceCube = new Model(
      indices,
      normals,
      textureCoords,
      './assets/images/goat.jps',
      vertices
    );
    return bruceCube;
  }
};
