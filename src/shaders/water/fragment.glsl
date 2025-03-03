 uniform vec3 uDepthColor;
 uniform vec3 uSurfaceColor;
 uniform float uColorOffset;
 uniform float uColorMultiplier;

 varying float vElevation;
 
 void main (){
    // we are going to create a mix between the uDepthColor & uSurfaceColor
    // according to the wave elevation => we need to know the vElevation from vertex.glsl
    // in the fragment shader, retrieve the varying and create a "color" variable  that
    // mixes the both colors according to the vElevation
    //Issue: we cannot see much diffencies between both colors because vElevation goes from -0.2 to 0.2 =>
    // to fix that => Adding uColorOffset & uColorMultiplier in script.js to uniforms
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;

    //vec3 color = mix(uDepthColor, uSurfaceColor, vElevation);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
   
    gl_FragColor = vec4(color, 1.0);

     #include <colorspace_fragment>
 }