window.onload = function() {
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('audio');
    var audioSource = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    // analyser.fftSize = 2048;

    audioSource.connect(analyser);
    audioSource.connect(audioCtx.destination);

    // var frequencyDataSize = analyser.frequencyBinCount
    var frequencyData = new Uint8Array(1024);
    // console.log(frequencyData.length);

    var svgHeight = '300';
    var svgWidth =  '1200';
    var barPadding = '0';

    function createSvg(parent, height, width) {
        return d3.select(parent).append('svg').attr('height', height).attr('width', width);
    }

    svg = createSvg('#display', svgHeight, svgWidth);

    svg.selectAll('rect')
        .data(frequencyData)
        .enter()
        .append('rect')
        .attr('x', function(d, i) {
            return i * (svgWidth / frequencyData.length);
        })
        .attr('width', svgWidth / frequencyData.length - barPadding);

    function renderChart() {
        requestAnimationFrame(renderChart);

        // Copy frequency data to frequencyData array.
        analyser.getByteFrequencyData(frequencyData);

        // Update d3 chart with new data.
        svg.selectAll('rect')
            .data(frequencyData)
            .attr('y', function(d) {
                return svgHeight - d;
            })
            .attr('height', function(d) {
                return d;
            })
            .attr('fill', function(d) {
                return 'rgb(0, 0, 200)';
            });
    }

    // Run the loop
    renderChart();
}
