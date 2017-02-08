$(function(){
  var iosocket = io.connect();
  var UserConnect = null;
  iosocket.on('connect', function () {
    $('#entradaChat').append($('<li>Conectado com sucesso</li>'));
    $('#saidaChat').attr('placeholder','Digite sua mensagem...');
    $('#saidaChat').removeAttr('readonly');
    $('#saidaChat').focus();

    //iosocket.emit('connect');
    iosocket.on('connectUser', function (user){
      debugger;
      UserConnect = user;
      console.log(UserConnect);
    });

    iosocket.on('countusers', function(c) {
      $(".numberusers").text(c + ' online');
    });

    iosocket.on('messageToClient', function(message) {
      WriteMessage(message, false, UserConnect.id);
      window.focus();
      PlaySound();
    });
    iosocket.on('disconnect', function() {
      $('#entradaChat').append('<li>Desconectado</li>');
      alert('Você desconectou do chat, sua página será recarregada!');
      location.reload();
    });
  });

  $('#saidaChat').keyup(function(event) {
    var max = 250;
    var l = $('#saidaChat').val().length;
    $('.cont').text(250 - l);
    if(event.which == 13) {
      event.preventDefault();
      var message = $('#saidaChat').val();
      if(message.length > 0){
        iosocket.emit('message', { user: UserConnect, msg:message });
        WriteMessage(message, true, UserConnect.id);
        $('#saidaChat').val('');
        $('.cont').text(250);
      }
    }
  });

  $('.config').click(function (){
    $('.option').toggle("slow");
  })
});

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

var WriteMessage = function (message, my, id){
  var classMy = "";
  if(my) {
    classMy = "myli";
  }
  var InsertNewMessage = function (li){
    li.css('display','none');
    var data = new Date().toLocaleString();
    li.prepend('<div class="clock" title="'+data+'"></div>')
    $('#entradaChat').prepend(li);
    li.slideToggle();
  }
  if(message.indexOf('.jpg') > -1 || message.indexOf('.png') > -1 || message.indexOf('.jpeg') > -1 || message.indexOf('.gif') > -1){
    var srcimg = GetImage(message);
    var img = '<img src="'+GetImage(message)+'"/>';
    if(message.replace(srcimg, '').length > 0){
      InsertNewMessage($('<li id-user="'+id+'" class="'+classMy+'"></li>').text(message.replace(srcimg, '')));  
    }
    InsertNewMessage($('<li id-user="'+id+'" class="'+classMy+'"></li>').html(img));
  } else if(message.indexOf('www.youtube.com/watch?v=') > -1 || message.indexOf('youtu.be/') > -1){
    var srcvideo = GetVideo(message);
    var video = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+srcvideo+'" frameborder="0" allowfullscreen></iframe>';
    InsertNewMessage($('<li id-user="'+id+'" class="'+classMy+'"></li>').text(message));  
    InsertNewMessage($('<li id-user="'+id+'" class="'+classMy+'"></li>').html(video));
  } else if(message.indexOf('grooveshark:') > -1){
    var srcmusic = GetMusic(message);
    InsertNewMessage($('<li id-user="'+id+'" class="'+classMy+'"></li>').html(srcmusic));
  } else {
    InsertNewMessage($('<li id-user="'+id+'" class="'+classMy+'"></li>').text(message));
  }
}

var GetImage = function (message){
  var recurs = function (p, e){
    var img = "";
    var imgNew = "";
    for (var i = p; i >= 0; i--) {
      if(message[i] == ' '){
        i = -1;
      } else {
        img += message[i];
      }
    };
    for (var i = img.length - 1; i >= 0; i--) {
      imgNew += img[i];
    };
    imgNew += e;
    return imgNew;
  }
  if (message.indexOf('.jpg') > -1) {
    return recurs(message.indexOf('.jpg'), 'jpg');
  } else if(message.indexOf('.jpeg') > -1){
    return recurs(message.indexOf('.jpeg', 'jpeg'));
  } else if(message.indexOf('.png') > -1){
    return recurs(message.indexOf('.png'), 'png');
  } else if(message.indexOf('.gif') > -1){
    return recurs(message.indexOf('.gif'), 'gif');
  }
}

var GetVideo = function (message){
  var recurs = function (p, e){
    var video = "";
    var msgNew = message.replace('www.youtube.com/watch?v=', '').replace('youtu.be/', '');
    for (var i = p; i < msgNew.length; i++) {
      if(msgNew[i] == ' '){
        i = msgNew.length;
      } else {
        video += msgNew[i];
      }
    };
    console.log(video)
    return video.trim();
  }
  if (message.indexOf('www.youtube.com/watch?v=') > -1) {
    return recurs(message.indexOf('www.youtube.com/watch?v='));
  } else if(message.indexOf('youtu.be/') > -1){
    return recurs(message.indexOf('youtu.be/'));
  }
}

var GetMusic = function (message) {
  var id = message.split('grooveshark:');
  if (id.length > 1) {
    var obj = '<object width="560" height="40" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="gsSong3441829137" name="gsSong3441829137"><param name="movie" value="http://grooveshark.com/songWidget.swf" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=grooveshark.com&songID='+id[1]+'&style=wood&p=0" /><object type="application/x-shockwave-flash" data="http://grooveshark.com/songWidget.swf" width="250" height="40"><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="hostname=grooveshark.com&songID='+id[1]+'&style=wood&p=0" /><span><a href="http://grooveshark.com/search/song?q=Hardwell%20Spaceman" title=""></a></span></object></object>';
    return obj;
  } else {
    return message;
  }
}

var PlaySound = function() {
  if($('#notification').get(0).checked){
    $('#embed').remove();
    var embed = document.getElementById("embed");
    if (!embed) {
        var embed = document.createElement("embed");
            embed.id= "embed";
            embed.setAttribute("src", "/sounds/bip.mp3");
            embed.setAttribute("hidden", "true");
        document.getElementById('body-etalk2me').appendChild(embed);
    } else {
        embed.parentNode.removeChild(embed);
    }
  }
}
