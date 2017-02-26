var cv = require('opencv'); // OpenCV ported for node
var robot = require("robotjs"); // Tools to control mouse

var lowThresh = 10;
var highThresh = 100;
var nIters = 1;
var minArea = 4000;
var maxArea = 7000;

const lineType = 8;
const maxLevel = 0;
const thickness = 1;

var BLACK = [0, 0, 0]; // B, G, R
var RED = [0, 0, 255]; // B, G, R
var GREEN = [0, 255, 0]; // B, G, R
var BLUE = [255, 0, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R

try {
	// Opens the window that shows everything processed
	var camera = new cv.VideoCapture(0);
	var window = new cv.NamedWindow('Video', 0)

	setInterval(function() {
		camera.read(function(err, im) {
			if (err) throw err;
			if (im.size()[0] > 0 && im.size()[1] > 0) {

				if (err) throw err;

				width = im.width()
				height = im.height()
				if (width < 1 || height < 1) throw new Error('Image has no size');

				var out = new cv.Matrix(height, width);

				im.convertGrayscale();
				im_canny = im.copy();
				im_canny.canny(lowThresh, highThresh);
				im_canny.dilate(nIters);

				contours = im_canny.findContours();
				
				// Checks through the image for countouring and to set location of + crosshairs
				for (i = 0; i < contours.size(); i++) {
					if (contours.area(i) < minArea) continue;

					if (contours.area(i) > maxArea) {
						var moments = contours.moments(i);
						var cgx = Math.round(moments.m10 / moments.m00);
						var cgy = Math.round(moments.m01 / moments.m00);

						out.drawContour(contours, i, RED, thickness, lineType, maxLevel, [0, 0]);
						out.line([cgx - 5, cgy], [cgx + 5, cgy], BLUE);
						out.line([cgx, cgy - 5], [cgx, cgy + 5], BLUE);
					}
					
					var arcLength = contours.arcLength(i, true);
					contours.approxPolyDP(i, 0.05 * arcLength, true);

					switch (contours.cornerCount(i)) {
						case 3:
							out.drawContour(contours, i, GREEN);
							robot.moveMouse(cgx, cgy + 80);
							break;
						case 4:
							out.drawContour(contours, i, WHITE);
							break;
						default:
							out.drawContour(contours, i, WHITE);
					}
				}

				window.show(out);
			}
			window.blockingWaitKey(0, 50);
		});
	}, 20);

} catch (e) {
	console.log("Couldn't start camera:", e)
}
