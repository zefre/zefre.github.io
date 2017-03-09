
$( document ).ready(function() {


            /*GLOBAL STATE VARS */
            mode = "none";
            pauseButtonState = "pause";
            hasCalib = false;
            log = [];
            inBetweenSpeech = 5; //seconds
            timeOut = 1.5; //seconds
            successCount = 0; //count of # of times in bounds
            loopRun = 0;
            loopSuccessRun = 0;
            wasInBounds = false;
            /*END GLOBAL STATE */

            /* BUTTON LISTENERS */


            $("#calibMode").click(function(){
                if(!hasCalib){
                    //var msg = new SpeechSynthesisUtterance('Move your cursor and follow it with your eyes');
                    //setTimeout(window.speechSynthesis.speak(msg), 2000);
                    //msg = new SpeechSynthesisUtterance('Click in various spots while looking at the cursor');
                    //setTimeout(window.speechSynthesis.speak(msg), 10000);
                    //msg = new SpeechSynthesisUtterance('Make sure you get points on and around the eyes and face');
                    //setTimeout(window.speechSynthesis.speak(msg), 10000);
                }
                mode = "calibration";
                //$('#videobox').css({'display':'block','float':'right','width': '400px','height':'400px','color':'black'});
                webgazer.showPredictionPoints(true);
                $('#gazedot').css('opacity',0.7);
                hasCalib = true;
            });


            $("#useMode").click(function(){
                if(!hasCalib){
                    alert("Please calibrate first");
                    return false;
                }
                else{
                    if(mode !== "use"){
                        loopRun= 0; //reset, so that speech doesn't go bonkers
                    }
                    mode = "use";
                    webgazer.showPredictionPoints(true);
                    $('#gazedot').css('opacity',0);
                }
            });


            $("#pause").click(function(){
                if(pauseButtonState === "pause"){
                    mode = "pause";
                    pauseButtonState = "resume";
                    webgazer.pause();
                    $("#pause").html('RESUME');
                }
                else if(pauseButtonState === "resume"){
                    mode = "resume";
                    pauseButtonState = "pause";
                    webgazer.resume();
                    $("#pause").html('PAUSE');
                }
            });

            $("#devMode").click(function(){
                if(mode !== "developer" && mode !== "forceOut" && mode !== "forceIn"){
                    mode = "developer";
                    console.log(mode);
                    $('#gazedot').css('opacity',0.7);
                }
                else{
                    mode = "use";
                    $('#gazedot').css('opacity',0);
                }

            });

            $("#forceIn").click(function(){
                if(mode !== "developer" && mode !== "forceOut"){
                    alert("You must be in developer mode to use this feature");
                }
                else mode = "forceIn";
                console.log(mode);
            });


            $("#forceOut").click(function(){
                if(mode !== "developer" && mode !== "forceIn"){
                    alert("You must be in developer mode to use this feature");
                }
                else mode = "forceOut";
                console.log(mode);
            });


            $('#relinquish').click(function(){
                if(mode == "developer" || mode == "forceIn" || mode == "forceOut"){
                    mode = "use";
                }
            });
            /*END LISTENERS*/


            function getTransform(el) {
                var results = $(el).css('-webkit-transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/)

                if(!results) return /*[0, 0, 0]*/undefined;
                if(results[1] == '3d') return results.slice(2,5);

                results.push(0);
                return results.slice(5, 8);
            }
            setInterval(updatePosDisplay, 100);
            function updatePosDisplay(){
                var transform = getTransform('#gazedot');
                ++loopRun;
                $('#pos').text(transform);
                console.log(transform);
                console.log(isInBounds(transform));
                //$('#isinbounds').text(isInBounds(transform)) removed
                if(isInBounds(transform) && mode !== "forceOut" || mode === "forceIn"){
                    $('#pos').css('background-color','blue');
                    log.push(true);
                    if(mode !== "calibration"){
                        ++loopSuccessRun;
                            if(loopSuccessRun >= timeOut * 10){
                                $('#buttonbox').css('background-color', 'green');
                                console.log("success");
                                window.location.href = 'success.html';
                            }
                    }
                    if(loopRun % (10*inBetweenSpeech) === 0|| loopRun === 0||!wasInBounds){
                        if(mode !== "calibration"){
                            //var msg = new SpeechSynthesisUtterance('Good');
                            //window.speechSynthesis.speak(msg);
                        }
                        wasInBounds = true;
                    }
                }
                else if(!isInBounds(transform) && mode !== "forceIn" || mode === "forceOut"){
                    $('#pos').css('background-color','red');
                    log.push(false);
                    if(loopRun % (10*inBetweenSpeech) === 0|| loopRun === 0||wasInBounds){
                        if(mode !== "calibration"){
                            loopSuccessRun = 0;
                            //var msg = new SpeechSynthesisUtterance('Make eye contact');
                            //window.speechSynthesis.speak(msg);
                        }
                    }
                    wasInBounds = false;
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
