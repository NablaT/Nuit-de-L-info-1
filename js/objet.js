var objets = [];
var tilt = 90;
var spin = 0;
    
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

	var objetTexture;
function initObjetTexture() {
        objetTexture = gl.createTexture();
        objetTexture.image = new Image();
        objetTexture.image.onload = function () {
            handleLoadedTexture(objetTexture)
        }

        mudTexture.image.src = "image/nehe.gif";
        objetTexture.image.src = "image/star.gif";
    }
function handleLoadedTexture(texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, null);
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
      drawObjet();
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

    function initBuffers() {
        objetVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, objetVertexPositionBuffer);
        vertices = [
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        objetVertexPositionBuffer.itemSize = 3;
        objetVertexPositionBuffer.numItems = 4;

        objetVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, objetVertexTextureCoordBuffer);
        var textureCoords = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        objetVertexTextureCoordBuffer.itemSize = 2;
        objetVertexTextureCoordBuffer.numItems = 4;
    }

var objetVertexTextureCoordBuffer;
var objetVertexPositionBuffer;	
function drawObjet() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, objetTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, objetVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, objetVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, objetVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, objetVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, objetVertexPositionBuffer.numItems);
}

/*precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 uColor;

void main(void) {
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = textureColor * vec4(uColor, 1.0);
}*/
