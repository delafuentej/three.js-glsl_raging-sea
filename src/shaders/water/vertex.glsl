 //The 3 uniforms matrices are:
   // 1.modelMatrix: transformations relative to the Mesh(position, rotation, scale)
   //2.viewMatrix: transformations relative to the Camera(position, rotation, field of view, near, far)
   // 3.projectionMatrix:transformation to the clip space coordinates
//  uniform mat4 projectionMatrix;
//  uniform mat4 viewMatrix;
//  uniform mat4 modelMatrix;
uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrecuency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrecuency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//

#include ../includes/cnoise.glsl


 
 void main(){

   
    //convertion gl_Position to a vec4:
   vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //Elevation variable in order to use it to colorize the waves
    float elevation = sin(modelPosition.x * uBigWavesFrecuency.x + uTime * uBigWavesSpeed) * 
                        sin(modelPosition.z * uBigWavesFrecuency.y + uTime * uBigWavesSpeed) * 
                        uBigWavesElevation;

    // for() loop
    for(float i = 1.0; i <= uSmallIterations; i++){
        // we have to use the iteration = i to control the elevation and the frecuency

        //using the cnoise with a vec3:
    // when the frecuency is to small we have to change: modelPosition.xz
    // as the waves are to high we have to multiplying the cnoise function * 0.15
    // to more realistic use abs() function. Realistic waves have rounded troughs and high crests
    
        elevation -= abs(
            cnoise(
                vec3(
                    modelPosition.xz * uSmallWavesFrecuency * i, 
                    uTime * uSmallWavesSpeed
                    )
                ) * uSmallWavesElevation /i
        );

    }
    
    
    modelPosition.y += elevation;
   //we create the modelPosition by applying the modelMatrix
   vec4 viewPosition = viewMatrix * modelPosition;
   //
   vec4 projectedPosition = projectionMatrix * viewPosition;



    //gl_Position contain the position of the vertex on the screen (renderer coordinates)
    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
 }