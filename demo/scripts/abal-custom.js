
$( document ).ready(function() {
            var mode = "none";
            var pauseButtonState = "pause";
            var hasCalib = false;
            $("#calibMode").click(function(){
                hasCalib = true;
                webgazer.showPredictionPoints(true);
                $('#gazedot').css('opacity',0.7);
            });
            $("#useMode").click(function(){
                if(!hasCalib){
                    alert("Please calibrate first");
                    return false;
                }
                else{
                    webgazer.showPredictionPoints(true);
                    $('#gazedot').css('opacity',0);
                }
            });
            $("#pause").click(function(){
                if(pauseButtonState === "pause"){
                    pauseButtonState = "resume";
                    webgazer.pause();
                    $("#pause").html('RESUME');
                }
                else if(pauseButtonState === "resume"){
                    pauseButtonState = "pause";
                    webgazer.resume();
                    $("#pause").html('PAUSE');
                }
            });
            
            function getTransform(el) {
                var results = $(el).css('-webkit-transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/)

                if(!results) return /*[0, 0, 0]*/undefined;
                if(results[1] == '3d') return results.slice(2,5);

                results.push(0);
                return results.slice(5, 8);
            }
            setInterval(updatePosDisplay, 100);
            function updatePosDisplay(){
                var inBoundsTimeOut = 5; //seconds
                var outOfBoundsTimeOut = 1; //seconds
                var outOfBoundsCount = 0;
                var inBetweenSpeech = 3;
                var isInBoundsCount = 0;
                var transform = getTransform('#gazedot');
                $('#pos').text(transform);
                console.log(transform);
                console.log(isInBounds(transform));
                //$('#isinbounds').text(isInBounds(transform)) removed
                if(isInBounds(transform)){
                    $('#pos').css('background-color','blue');
                }
                else{
                    $('#pos').css('background-color','red');   
                }
                }
                
            
            function isInBounds(coords){
                var w = window.innerWidth;
                var h = window.innerHeight;
                var topBound = .66115702478*h;
                var bottomBound = .38567493112*h;
                var leftBound = .30769230769*w;
                var rightBound = .69336723881*w;
                var left = coords[0];
                var top = coords[1];
                var x = left;
                var y = h- top;
                console.log('x: '+x);
                console.log('y: '+y);
                console.log('bottom: '+bottomBound);
                console.log('top: '+topBound);
                return x >= leftBound && x <= rightBound && y >= bottomBound && y <= topBound;
            }
});