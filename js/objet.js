var objets = [];
function initWorldObjects() {
	var numObjet = 50;

    for (var i=0; i < numObjet; i++) {
		objets.push(new Objet((i / numObjet) * 5.0, i / numObjet));
    }
}

function Objet(startingDistance, rotationSpeed) {
    this.angle = 0;
    this.dist = startingDistance;
    this.rotationSpeed = rotationSpeed;
    // Set the colors to a starting value.
    this.randomiseColors();
}

Objet.prototype.draw = function(/*tilt, spin,*/ twinkle) {
    mvPushMatrix();
	// Move to the star's position
    mat4.rotate(mvMatrix, degToRad(this.angle), [0.0, 1.0, 0.0]);
    mat4.translate(mvMatrix, [this.dist, 0.0, 0.0]);
    // Rotate back so that the star is facing the viewer
    mat4.rotate(mvMatrix, degToRad(-this.angle), [0.0, 1.0, 0.0]);
    mat4.rotate(mvMatrix, degToRad(-tilt), [1.0, 0.0, 0.0]);
    if (twinkle) {
      // Draw a non-rotating star in the alternate "twinkling" color
      gl.uniform3f(shaderProgram.colorUniform, this.twinkleR, this.twinkleG, this.twinkleB);
      drawStar();
    }

    // All stars spin around the Z axis at the same rate
    mat4.rotate(mvMatrix, degToRad(spin), [0.0, 0.0, 1.0]);

    // Draw the star in its main color
    gl.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);
    drawObjet();
    mvPopMatrix();
};

var effectiveFPMS = 60 / 1000;
Objet.prototype.animate = function(elapsedTime) {
	this.angle += this.rotationSpeed * effectiveFPMS * elapsedTime;
	// Decrease the distance, resetting the star to the outside of
    // the spiral if it's at the center.
    this.dist -= 0.01 * effectiveFPMS * elapsedTime;
    if (this.dist < 0.0) {
		this.dist += 5.0;
		this.randomiseColors();
    }
};

Objet.prototype.randomiseColors = function() {
    // Give the star a random color for normal
    // circumstances...
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();
    // When the star is twinkling, we draw it twice, once
    // in the color below (not spinning) and then once in the
    // main color defined above.
    this.twinkleR = Math.random();
    this.twinkleG = Math.random();
    this.twinkleB = Math.random();
};

function drawObjet() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,null/* objetTexture*/);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, starVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, starVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 0/*starVertexPositionBuffer.numItems*/);
}

/*precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 uColor;

void main(void) {
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = textureColor * vec4(uColor, 1.0);
}*/
