/**
 * Pass in object with the property `data` set with the result object
 * returned from audio-reader.
 *
 * Increasing quality will give a more accurate result, but slow down
 * render time. Likewise, to speed up render you can set maxChannels to
 * f.ex. 1.
 *
 * @param {object} options - option object
 * @param {object} options.data - takes the result object from an AudioReader promise
 * @param {number} [options.width=640] - width of resulting image in number of pixels
 * @param {number} [options.height=64] - height of resulting image in number of pixels
 * @param {number} [options.quality=2] - quality mode, higher is better [1, n].
 * @param {number} [options.opacity] - opacity used for each channel. If none is set, or 0, the opacity will be split on number of channels and quality
 * @param {number} [options.maxChannels] - maximum number of channels to render. Default is all channels.
 * @param {string} [options.color="#000"] - draw color
 * @param {string} [options.bgColor] - background color. If none is set the background will be transparent.
 * @param {string} [options.mode==="bars"] - graph mode, can be "bars" (default), "mirror"
 * @returns {HTMLCanvasElement}
 * @global
 */
AudioReader.render = function(options) {

	var result = options.data,
		abuffer = result.buffer,
		channels = Math.min(options.maxChannels || 99, result.channels),
		quality = options.quality || 1,
		opacity = options.opacity || 1 / (channels * quality),
		w = options.width || 640,
		h = options.height || 64,
		h2 = h >> 1,
		len = abuffer.getChannelData(0).length,
		step = Math.max(1, len / w),
		subStep = step / quality,
		channel, k = 0, t = 0, i, x, v, offset = 0,
		mode = options.mode || "bars",
		canvas = document.createElement("canvas"),
		ctx = canvas.getContext("2d");

	canvas.width = w;
	canvas.height = h;

	if (options.bgColor) {
		ctx.fillStyle = options.bgColor;
		ctx.fillRect(0, 0, w, h)
	}

	ctx.fillStyle = options.color || "#000";

	ctx.globalAlpha = opacity;
	ctx.translate(0, h2);

	if (mode === "mirror") {
		while(k++ < quality) {
			t = 0;
			while(t < channels) {
				channel = abuffer.getChannelData(t++);
				ctx.beginPath();
				ctx.moveTo(0, 0);
				for(i = offset, x = 0; i < len; i += step) {
					v = Math.abs((channel[i|0] * h2)|0);
					ctx.lineTo(x++, -v);
				}
				ctx.lineTo(w, 0);
				ctx.fill();
				ctx.scale(1, -1);
				ctx.drawImage(canvas, 0, -h2);
				ctx.scale(1, -1);
			}
			offset += subStep;
		}
	}
	else {
		while(k++ < quality) {
			t = 0;
			while(t < channels) {
				channel = abuffer.getChannelData(t++);
				ctx.beginPath();
				for(i = offset, x = 0; i < len; i += step) {
					v = Math.abs((channel[i|0] * h2)|0);
					ctx.rect(x++, -v, 1, v<<1)
				}
				ctx.fill();
			}
			offset += subStep;
		}
	}

	ctx.beginPath();
	ctx.strokeStyle = ctx.fillStyle;
	ctx.globalAlpha = 1;
	ctx.moveTo(0, 0.5);
	ctx.lineTo(w, 0.5);
	ctx.stroke();

	return canvas
};
