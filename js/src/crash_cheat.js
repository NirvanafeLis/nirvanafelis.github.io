<!--崩溃欺骗-->
 var OriginTitle = document.title;
 var titleTime;
 document.addEventListener('visibilitychange', function () {
     if (document.hidden) {
         document.title = '别走(っ °Д °;)っ';
         clearTimeout(titleTime);
     }
     else {
         document.title = '你回来啦╰(*°▽°*)╯' + OriginTitle;
         titleTime = setTimeout(function () {
             document.title = OriginTitle;
         }, 2000);
     }
 });
