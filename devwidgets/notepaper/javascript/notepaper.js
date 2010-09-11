/**
 * notepaper模块
 * 1.适当添加注释
 * 2.commit
 */
var sakai = sakai || {};

sakai.notepaper = function(tuid, showSettinds) {
    var notepaper = "#notepaper";
    var notepaperTemplate = notepaper + "_template";
    var notepaperArea = notepaper + "_area";
    var $editArea = $(notepaperArea);
    
    var loadData = function() {
        $.ajax({
            url:"/system/notepaper",
            type: "GET",
            success: function(data) {
                var json = jQuery.parseJSON(data);
                if(json.message){
                    $editArea.val(json.message);
                    $("#time").html(json.modifyTime);
                }else{
                    $("#timeDIV").hide();
                }
                $editArea.scrollTop(1000);
                $editArea.height($editArea.height() + $editArea.scrollTop());
            },
            error: function() {
                alert("error");
            },
        });
    };
    
    var saveData = function(message) {
        $.ajax({
            url:"/system/notepaper",
            type: "POST",
            data: {
                "message": message
            },
            success: function(data) {
                var json = jQuery.parseJSON(data);
                $("#time").html(json.modifyTime);
                $("#timeDIV").show();
            },
            error: function() {
                alert("Error:can not save your message :" + message);
            },
        });
    };
    
    var autoresize = function(){
        
        var settings = {
                            animate : true,
                            animateDuration : 150,
                            extraSpace : 16,
                            limit: 1000
                        };
        var lastScrollTop = null;
        var origHeight = $editArea.height();
        var clone = $editArea.clone().insertBefore(notepaperArea);
        
        var updateSize = function() {
            clone.height(0).val($editArea.val()).scrollTop(1000);
            var scrollTop = Math.max(clone.scrollTop(), origHeight) + settings.extraSpace;
            if (lastScrollTop === scrollTop) { return; }
            lastScrollTop = scrollTop;
            if ( scrollTop >= settings.limit ) {
                $(this).css('overflow-y','');
                return;
            }
            settings.animate && $editArea.css('display') === 'block' ?
                $editArea.stop().animate({height:scrollTop}, settings.animateDuration)
                : $editArea.height(scrollTop);
        };
        
        $editArea.live("keyup", updateSize);
        
    };
    
    var init = function() {
        loadData();
        autoresize();
        
        $editArea.live("focus", function() {
            $(this).css({"background-color":"#454a4f","color":"white","border":"1px solid #d5d5d5"});
        });
         
        $editArea.live("blur", function() {
            $(this).css({"background-color":"#F0F0F0","color":"black","border":"0px"});
        });
        
        $editArea.live("change", function() {
            saveData($(this).val());
        });
    };
    
    init();
    
};

sakai.api.Widgets.widgetLoader.informOnLoad("notepaper");