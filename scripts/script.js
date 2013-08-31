(function(){
	$(function() {
	    var soundObj = {},
	    	count = 0,
	    	timer,
	    	isPlaying = false,
	    	pickColor = '',
	    	select_id = '',
	    	$dummy = $('#dummy'),
	    	$seekBox = $('#sequencer').find('div'),
	    	drugFlag = false,
	    	interval = 0,
	    	bpm = 120,
	    	targetNUm = 0,
	    	dropNum = 0,
	    	isSwing = false,
	    	swing = 0,
	    	volFlag = false,
	    	volPosY = 0,
	    	volVal = 0,
	    	volume = 0.5,
	    	$swingSlider = $('#swing').find('.slider'),
	    	$tempoSlider = $('#tempo').find('.slider'),
	    	$bpmText = $('#bpm').find('p'),
	    	mainSwich = true,
	    	snd = new Audio(),
	    	PLAYER_EVENTS,
	    	SOUND_EVENTS,
	    	nowSounds = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
	    	patternArray = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
	    	soundName = [
		        'TR_808',
		        'Electro'
		    ],
	    	selectedSound = 0,
	    	nowSound = soundName[selectedSound],
	    	bank = {
	        patern1: [
	        	1,null,3,1,
	        	2,3,3,1,
	        	1,null,1,3,
	        	2,1,4,null
	        ],
	        patern2: [
	        	1,3,4,1,
	        	2,3,4,null,
	        	1,3,4,1,
	        	2,3,4,null
	        ],
	        patern3: [],
	        patern4: []
	    };
	
	    /* Player Events
	     * --------------------------------------------------------------------------------------------------------- */
	    PLAYER_EVENTS = {
	        mouseDownHandler: function(e) {
	            if ($(e.target).parent().attr('id')==='materials') {
	                dropNum = parseInt($(e.target).attr('id').split('p')[1]);
	                drugFlag = true;
	            }
	        },
	        mouseUpHandler: function(e) {
	            $dummy.css({'top': e.pageY+'px', 'left': e.pageX+'px'}).hide();
	            PLAYER_EVENTS.getTarget(e.pageY, e.pageX);
	            drugFlag = false;
	        },
	        mouseMoveHandler: function(e) {
	            if (drugFlag===true) {
	                $dummy.css({'top': e.pageY-($dummy.height()/2)-50+'px', 'left': e.pageX-($dummy.width()/2)-50+'px'}).show();
	            }
	        },
	        seekBoxClickHandler: function(e) {
	            $(e.target).css({'background': '#fefdd0'}).removeClass('box-on').addClass('box-off');;
	            SOUND_EVENTS.setSound(parseInt($(e.target).attr('id').split('m')[1])-1, null);
	            pickColor = '';
	            select_id = '';
	        },
	        play: function() {
	            count = 0;
	            if (isPlaying) return;
	            SOUND_EVENTS._setInterval(bpm);
	            SOUND_EVENTS.setBeat();
	            isPlaying = true;
	        },
	        stop: function() {
	            clearTimeout(timer);
	            isPlaying = false;
	        },
	        getTarget: function(top, left) {
	            for (var i=0;i<16;i++) {
	                var t = Math.abs($seekBox.eq(i).offset().top-top);
	                var l = Math.abs($seekBox.eq(i).offset().left-left);
	                if ((t+l)<50) {
	                    if (drugFlag)PLAYER_EVENTS.sequencerSetColor(i);
	                    targetNUm = i;
	                    SOUND_EVENTS.setSoundObjct(i);
	                    return false;
	                }
	            }
	        },
	        sequencerSetColor: function(n) {
	            $('#sequencer').find('div').eq(n).css({'background': pickColor}).removeClass('box-off').addClass('box-on');
	        },
	        dummysetParams: function() {
	            $dummy.css({'background': pickColor});
	        },
	        setColor: function() {
	            for (var i=0; i<16;i++) {
	                $('.box').eq(i).css({'background': ('#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6))});
	            }
	        }
	    };
	
	    /* Sound Events
	     * --------------------------------------------------------------------------------------------------------- */
	    SOUND_EVENTS = {
	        setSoundObjects: function(obj) {
	            soundObj = obj;
	        },
	        tenmetsu: function(c) {
	            if (c==0||c==4||c==8||c==12) $('.ramp').css({'background-color':'#ff0000'})
	            else $('.ramp').css({'background-color':'#eeeeee'})
	        },
	        call: function(s, count) {
	            if (s!=null||s!=undefined) {
	                if (isSwing==true) {
	                    if (count==1||count==3||count==5||count==7||count==9||count==11||count==13||count==15) {
	                        SOUND_EVENTS.setSwing(s);
	                    } else {
	                        SOUND_EVENTS.shot(s);
	                    }
	                } else {
	                    SOUND_EVENTS.shot(s);
	                }
	            }
	        },
	        shot: function(s) {
	        	snd = new Audio(s);
	        	snd.volume = volume;
	        	snd.play();
	        },
	        setSwing: function(s) {
	            setTimeout(function(){
	                SOUND_EVENTS.shot(s);
	            }, bpm/swing);
	        },
	        setBeat: function() {
	            timer = setTimeout(SOUND_EVENTS.beat, interval);
	        },
	        beat: function() {
	            var con = count*0.1;
	            $seekBox.css({'opacity':'1'}).eq(con).css({'opacity':'0.8'});
	            SOUND_EVENTS.call(nowSounds[con], con);
	            count++;
	            if (count==160) count = 0;
	            SOUND_EVENTS.setBeat();
	        },
	        setSoundObjct: function(n) {
	            SOUND_EVENTS.setSound(n,soundObj['s'+dropNum],dropNum);
	        },
	        setSound: function(n, s, dn) {
	        	if (dn==undefined) dn = null;
	            nowSounds.splice(n, 1, s);
	            patternArray.splice(n, 1, dn);
	        },
	        initTempo: function() {
	            $tempoSlider.slider({max: 200, min: 40, value:120, tooltip:'hide'}).on('slide', function(e){
	                SOUND_EVENTS.setBpm(240-this.value);
	                if (this.value!==undefined) $bpmText.text(this.value+'.0');
	            });
	        },
	        setBpm: function(val) {
	            bpm = val;
	            SOUND_EVENTS._setInterval(bpm);
	        },
	        _setInterval: function(_bpm) {
	            interval = _bpm/10;
	        },
	        initSwing: function() {
	            $swingSlider.slider({max: 8, min: 2, value: 2, tooltip:'hide'}).on('slide', SOUND_EVENTS.swingSlide);
	        },
	        swingSlide: function(e){
	        	if (this.value==undefined) return false;
	        	var sval = 10-this.value;
	            if (sval==8) {
	                isSwing = false;
	            } else {
	                swing = sval;
	                isSwing = true;
	            }
	        },
	        setPatern: function(ptn, ptnName) {
	            SOUND_EVENTS.clear();
	            patternArray = [];
	            for (var i=0;i<16;i++) {
	                nowSounds.push(sounds[nowSound]['s'+ptn[i]]);
	                patternArray.push(ptn[i]);
	                var color = $('#p'+ptn[i]).css('background');
	                if (bank[ptnName][i]!=null) $seekBox.eq(i).css({'background': color}).removeClass('box-off').addClass('box-on');
	            }
	            SOUND_EVENTS.setPatternParams(ptnName);
	        },
	        setPatternParams: function(pn) {
				if (pn=='patern1') {
					$swingSlider.slider('setValue', 8);
					swing = 2;
					isSwing = true;
					$tempoSlider.slider('setValue', 110);
					$bpmText.text('110.0')
				} else if (pn=='patern2') {
					$swingSlider.slider('setValue', 6);
					swing = 4;
					isSwing = true;
					$tempoSlider.slider('setValue', 127);
					$bpmText.text('127.0')
				}
	        },
	        soundChange: function(name){
	            nowSound = name;
	            SOUND_EVENTS.setSoundObjects(sounds[nowSound]);
	        },
	        clear: function(){
	            $('#sequencer').find('div').css({'background': '#fefdd0'}).removeClass('box-on').addClass('box-off');
	            nowSounds = [];
	            pickColor = '';
	            select_id = '';
	        },
	        padShot: function(n){
	            SOUND_EVENTS.shot(soundObj['s'+n]);
	        },
	        onSelectSoundHandler: function() {
	        	selectedSound++;
	        	if (selectedSound==soundName.length) selectedSound = 0;
				SOUND_EVENTS.soundChange(soundName[selectedSound]);
				$('#select-sound-text').text(soundName[selectedSound]);
				nowSounds = [];
				for (var i=0;i<16;i++) {
					nowSounds.push(sounds[nowSound]['s'+patternArray[i]]);
				}
				
	        }
	    };
	    
	    /* Mouse Events
	     * --------------------------------------------------------------------------------------------------------- */
	    function addMouseEvents() {
	        $('#play-btn').on('click', PLAYER_EVENTS.play);
	        $('#stop-btn').on('click', PLAYER_EVENTS.stop);
	        $('#clearBtn').on('click', SOUND_EVENTS.clear);
	        $('#materials').on('mousedown', function(e){
	        	var $t = $(e.target);
	            pickColor = $t.css('background');
	            select_id = $t.attr('id');
	            PLAYER_EVENTS.dummysetParams();
	        });
	        $(document).on('mousedown', PLAYER_EVENTS.mouseDownHandler)
	                    .on('mouseup', PLAYER_EVENTS.mouseUpHandler)
	                    .on('mousemove', PLAYER_EVENTS.mouseMoveHandler);
	        $('#sequencer').find('div').on('mouseup', function(e){$(e.target).attr('id')});
	        $seekBox.on('click', PLAYER_EVENTS.seekBoxClickHandler);
	        $('#bank').find('.minibox').on('click', function(){
	            var pattern = 'patern'+(parseInt($('#bank').find('.minibox').index(this))+1);
	            SOUND_EVENTS.setPatern(bank[pattern], pattern);
	            $('#sample-pattern-name').text('SAMPLE '+(parseInt($('#bank').find('.minibox').index(this))+1));
	        })
	        $('#pad-container').find('div').on('mousedown', function(){
	            $(this).css({'opacity': '0.8'});
	            SOUND_EVENTS.padShot(parseInt($(this).attr('id').split('p')[1]));
	        }).on('mouseup', function(){
	            $(this).css({'opacity': '1.0'});
	        });
	        $('#stop-btn, #play-btn, #bank div').on('mousedown', function(){
	        	$(this).css({'opacity': '0.8'});
	        }).on('mouseup', function(){
	        	$(this).css({'opacity': '1.0'});
	        });
	        $('#volume').on('mousedown', function(e){
	        	if ($(e.target).attr('id')=='volume') {
		            volFlag = true;
		            volPosY = e.pageY;
	        	}
	        })
	        $(document.body).on('mousemove', function(e){
	            if (volFlag) {
		            var angle = (volPosY - e.pageY)/5;
		            volVal += angle;
		            if (volVal>150) {
		            	volVal = 150;
			            return false;
		            } else if (volVal<-150) {
		            	volVal = -150;
			            return false;
		            }
		            $('#volume').animate({rotate: volVal+'deg'}, 0);
	            	volume = ((volVal+150)/300)
	            }
	        }).on('mouseup mouseleave', function(){
	            volFlag = false;
	            volPosY = 0
	        });
	        $('#select-sound-btn').on('click', SOUND_EVENTS.onSelectSoundHandler);
	        $('#swich').on('click', function(){
	        	if (mainSwich === false) {
		        	$(this).html('●&nbsp;&nbsp;OFF');
		        	PLAYER_EVENTS.stop();
		        	$('.disable').css({'pointer-events': 'none'})
	        	} else if (mainSwich === true) {
		        	$(this).html('ON&nbsp;&nbsp;&nbsp;&nbsp;●');
		        	$('.disable').css({'pointer-events': 'all'})
	        	}
		        mainSwich = !mainSwich;
	        });
	        
	        onResizeHandler();
	        $(window).resize(onResizeHandler)
	    }
	    
	    function onResizeHandler() {
	        $('#bg').width($(window).width());
	    }
	
	
	
	    /* initialize
	     * --------------------------------------------------------------------------------------------------------- */
	    var agent='',
			ua=navigator.userAgent
		if(ua.search(/Safari/) != -1){
			if (ua.search(/Chrome/) != -1){
				agent='Chrome';
			}
		}
		if (agent!=='Chrome') {
			$('#container').empty().remove();
			$(document.body).append('<div><strong>Chromeで見てー！</strong></div>');
			$('div').css({
				'font-size': '300px',
				'color': '#121212'
			})
			return;
		}

	    init();
	    function init() {
	        SOUND_EVENTS.setSoundObjects(sounds[nowSound]);
	        SOUND_EVENTS.initSwing();
	        SOUND_EVENTS.setBpm(bpm);
	        SOUND_EVENTS.initTempo();
	        addMouseEvents();
	    }
	});	
})()