audio-reader-js
===============

**audio-reader-js** is a 'low-level' implementation that enables browsers
to read and play AIFF, CAFF, SUN AU, IFF-8SVX and multi-channel WAVE
audio files directly in the client.

**audio-reader-js** uses JavaScript and the HTML5 Audio API to parse and provide
the files as audio buffers.

**audio-reader-js** is primarily intended for developers who wish to implement
and support high-quality professional audio file formats, as well as legacy
audio file formats natively.


Features
--------

- Loads various professional and legacy audio files natively in the browser:
- **Amiga IFF** (8SVX) files (8 bits mono/stereo, PCM)
- **Apple AIFF** files (8/24/16/32 bits multi channel, PCM)
- **Apple CAFF** files (8/24/16/32 bits multi channel, PCM/µLaw/A-law) (limited to 32-bit file size)
- **Sun AU/SND** files (8/16/24/32 bits multi-channel, PCM/µLaw/A-law)
- **Windows WAVE**<sup>1</sup> files (8/24/16/32 bits multi channel, PCM)
- Tries supported formats first internally (MP3, OGG etc.)
- Optional noise-dithering of 8-bit data
- All sample data is directly normalized to floating point buffer to preserve the highest quality
- Uses binary check to determine file type (extension and mime is ignored)
- Built-in fast waveform render
- Uses promises.
- Small size

The new fast wave render plugin:

![Waveform](https://i.imgur.com/Q5EQWL3.png)

**Notes**

- <sup>1)</sup> Although WAVE file is supported in most browsers there are
limitations to things such as bit formats etc.
- Parsing 32/64 floating point data not supported (yet)
- No buffering. The complete file is loaded into memory.
- Chrome issue: detects and accepts some audio formats but cannot decode them. Currently, these files are forced through AudioReader to fix.
- Chrome issue: does not support surround audio (5.1 etc.) (try run it with the `--force-wave-audio` or `--disable-audio-output-resampler` option). No fix.
- Chrome issue: (webkit)onended handler seem to only be called when stop() is issued, not when actually ending. No fix (use setTimeout as a work-around if needed).
- IE issue: does not support Audio API at all, nor promises (polyfills may work - untested)


Install
-------

**audio-reader-js** can be installed using:

- Git over HTTPS: `git clone https://github.com/epistemex/audio-reader-js.git`
- Git over SSH: `git clone git@github.com:epistemex/audio-reader-js.git`
- Download [zip archive](https://github.com/epistemex/audio-reader-js/archive/master.zip) and extract.


Usage
-----

**audio-reader-js** uses promises and provides an `AudioBuffer` that can be used with
the Audio API. An example showing how you can load and play an audio file:

    AudioReader("http://path.to/audio.iff").then(function(res) {

        const actx = res.audioContext;              // the shared audio context
        const source = actx.createBufferSource();   // create a playback buffer

        source.buffer = res.buffer;                 // use parsed file as data source
        source.connect(actx.destination);           // default output
        source.start(0);                            // play
    },
    alert);

or use the built-in convenience method to do the same:

    AudioReader("http://path.to/audio.au").then(function(res) {
        res.createPlayerObject().start();
    },
    alert);

Issues
------

The current code base can be considered experimental in the sense it needs
refactoring and more testing.

Although the parsing and generated data appear to be stable we won't recommend
production usage at the moment - you'll use it at your own risk.

If you find it to not work with certain samples it claims support for, feel
free to provide a downloadable link in issues (please check the list above
first as not all versions of a single format is necessarily intended to be
supported).


Requirements
------------

An "evergreen" browser with support for Web Audio API (HTML5).
It will work in recent Firefox, Chrome, Safari, Edge and Opera.

IE, Opera Mini and Android Browser does not support the Audio API.


License
-------

Released under [MIT license](http://choosealicense.com/licenses/mit/). You may use this class in both commercial and non-commercial projects provided that full header (minified and developer versions) is included.

The included music is copyrighted by Ken Nilsen/Epistemex and may be distributed freely for test use.


*&copy; 2015-2016, 2024 Epistemex*

![Epistemex](https://i.imgur.com/wZSsyt8.png)
