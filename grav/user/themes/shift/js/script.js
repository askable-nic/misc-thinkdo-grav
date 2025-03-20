var swiperV = new Swiper('.swiper-container-v', {
    // pagination: '.swiper-pagination-v',
    // paginationClickable: true,
    direction: 'vertical',
    nextButton: '.container-button.swiper-button-next',
    prevButton: '.container-button.swiper-button-prev',
    keyboardControl: true,
    mousewheelControl: true,
    lazyLoading: true,
    lazyLoadingInPrevNext: true,
    hashnav: true
    // spaceBetween: 50
});
$('.swiper-container-h').each(function(){
  new Swiper($(this), {
      // pagination: $(this).find('.swiper-pagination-h'),
      // paginationClickable: true,
      nextButton: $(this).find('.horizontal-slider-button.swiper-button-next'),
      prevButton: $(this).find('.horizontal-slider-button.swiper-button-prev'),
      keyboardControl: true,
      lazyLoading: true,
      lazyLoadingInPrevNext: true

      // mousewheelControl: true
      // spaceBetween: 50
  });
});

function isSwiper(swiper){
  try{
    return swiperV.container.length > 0;
  }
  catch(e){
    console.log('container length error');
    return false;
  }
}

function swiperVswitch(on){
  if(!isSwiper(swiperV)){
    return false;
  }
  if(on){
    swiperV.attachEvents();
    swiperV.enableMousewheelControl();
    swiperV.enableKeyboardControl();
  }else{
    swiperV.detachEvents();
    swiperV.disableMousewheelControl();
    swiperV.disableKeyboardControl();
  }
}

// $("#intro-btn").click(function(){
//   swiperV.slideTo(1);
// });
$(document).ready(function(){

  // if(isSwiper(swiperV)){
  //   symbolBgSize = 1 + 0.1 * (swiperV.slides.length - 1);
  //   $("#bg-symbols .container").height((symbolBgSize*100)+'%');
  //   for(i=0;i<=12*symbolBgSize;i++){
  //     x = Math.random()*0.35;
  //     if(Math.random() > 0.5){
  //       x = 1-x;
  //     }
  //     $("#bg-symbols .container").append('<span class="symbol icm icon-'+Math.ceil(Math.random()*12)+'" style="top:'+Math.round(Math.random() * 100)+'%;left:'+Math.round(x * 100)+'%;"></span>');
  //   }
  //   swiperV.on('onProgress', function (target, event) {
  //       // console.log(event);
  //       translate = ((-100 + 100 / symbolBgSize) * event);
  //       $("#bg-symbols .container").css('transform','translateY('+translate+'%)');
  //   });
  // }
  // $("#bg-symbols .container").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend','.symbol',function(){
  //   // console.log($(this).css('opacity'));
  //   var symbol = $(this);
  //   setTimeout(function(){
  //     // console.log(symbol.css('opacity'))
  //     symbol.css({
  //       opacity:Math.random()*0.6+0.3,
  //       transform: 'translate('+Math.round(Math.random()*200-100)+'%,'+Math.round(Math.random()*200-100)+'%) rotate('+Math.round(Math.random()*60-30)+'deg)'
  //     });
  //   },Math.ceil(Math.random()*200+100));
  // });
  // setTimeout(function(){
  //   $("#bg-symbols .container .symbol").each(function(){
  //     $(this).css('opacity',Math.random()*0.5+0.4);
  //   });
  // },1000);

  if($("#countdown-timer").length > 0){
    $("#countdown-timer").data('timer',null)
    $("#countdown-timer").data('pagetitle',document.title)
    $("#countdown-timer").click(function(){
      timer = $(this);
      if(!timer.data('timer')){
        timer.find('small').remove();
        timer.data('start',moment());
        tickTimer(timer);
      }
    });
  }

  function tickTimer(timer){
    time = moment.duration(timer.data('time') - moment().diff(timer.data('start')));
    if(time<=0){
      timer.text("0:00");
      return false;
    }
    hours = Math.floor(time.asHours()).toString();
    minutes = time.minutes().toString();
    if(hours == "0"){
      hours = "";
    }else{
      hours = hours+":";
      while(minutes.length < 2){
        minutes = "0"+minutes;
      }
    }
    seconds = time.seconds().toString();
    while(seconds.length < 2){
      seconds = "0"+seconds;
    }
    timeDisplay = hours+minutes+":"+seconds;
    timer.text(timeDisplay);
    document.title = timeDisplay+" - "+timer.data('pagetitle');

    t = setTimeout(tickTimer, 1000, timer);
    timer.data('timer',t);
  }

  function shuffle(a){
    var j,x,i;
    for(i=a.length;i;i-=1){
      j=Math.floor(Math.random()*i);
      x = a[i-1];
      a[i-1]=a[j];
      a[j]=x;
    }
    return a;
  }
  function roundRobin(names){
    if(names.length % 2 == 1){
      names.push('-');
    }
    var numRounds = names.length - 1;
    var combos = [];
    var loopSafety = Math.pow(10,numRounds);
    var safety = loopSafety;
    var pairs = [];
    while(combos.length < numRounds && safety > 0){
      var combo = [];
      var pool = shuffle(Object.keys(names));
      while(pool.length>0){
        var pair = pool.splice(0,2);
        pair.sort();
        combo.push(pair.join(""));
      }
      combo.sort();
      unique = combos.indexOf(combo.join("")) === -1;
      for(i=0;i<combo.length;i++){
        unique = unique && pairs.indexOf(combo[i]) === -1
      }
      if(unique){
        combos.push(combo.join(""));
        for(i=0;i<combo.length;i++){
          pairs.push(combo[i]);
        }
      }
      safety--;
    }
    combos.sort();
    // return combos;
    rounds = [];
    for(i=0;i<combos.length;i++){
      var combo = combos[i].split("");
      var round = [];
      while(combo.length>0){
        var pair = combo.splice(0,2);
        round.push([
          names[pair[0]],
          names[pair[1]]
        ]);
      }
      rounds.push(round);
    }
    // console.log(rounds.length,(loopSafety - safety)/loopSafety);
    // return JSON.stringify(rounds,undefined,2);
    if(rounds.length == numRounds){
      return rounds;
    }else{
      return false;
    }
  }
  function roundRobinForceResult(names,i){
    result = roundRobin(names);
    if(result){
      return result;
    }
    if(i<100){
      return roundRobinForceResult(names,i+1);
    }else{
      return false;
    }
  }

  $("#round-robin form").submit(function(){
    names = $(this).find('input:first').val();
    names = names.replace(/\s*\,\s*/,',').split(',');
    var rounds = roundRobin(names);
    // console.log(JSON.stringify(rounds));
    $("#round-robin").html('<table class="schedule"></table>');
    if(rounds){
      for(i=0;i<rounds.length;i++){
        $("#round-robin table").append('<tr></tr>');
        $("#round-robin tr:last").append('<th>Round '+(i+1)+'</th>');
        for(j=0;j<rounds[i].length;j++){
          $("#round-robin tr:last").append('<td>'+rounds[i][j].join(' & ')+'</td>');
        }
      }
    }else{
      alert("whoops, failed. try again please");
    }
  });

});
