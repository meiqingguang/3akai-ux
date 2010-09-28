var sakai = sakai || {};

sakai.news = function(){
    var mceNum = 0;
    var newsEditID = "";
    var allNews = [];
    var news = "news";
    var newsClass = ".news";
    var newsID = "#news";
    
    var newsTable = newsID + "_table";
    var newsTableTR = newsClass + "_tr";
    var newsListContainer = newsID + "_list_container";
    var newsTableTemplate = news + "_" + news + "_template";
    var newsDetailBacktoList = newsID + "_detail_backto_news_list";
    
    var newsTitle = newsClass + "_title";
    var newsDetail = newsID + "_detail";
    var newsDetailTitle = newsDetail + "_title";
    var newsDetailBody = newsDetail + "_body";
    var newsDetailContainer = newsDetail + "_container";
    var newsDetailContent = newsDetail + "_content";
    var newsDetailContentTemplate = newsDetailContent + "_template";
    
    var newsOperation = newsClass + "_operation";
    var newsOperationIconEdit = newsOperation + "_icon_edit";
    var newsOperationIconDelete = newsOperation + "_icon_delete";
    
    var createNews =  "#createnews";
    var createNewsLink = createNews + "_link";
    var createNewsContainer = createNews + "_container";
    var createNewsAdd = createNews + "_add";
    var createNewsAddTitle = createNewsAdd + "_title";
    var createNewsAddContent = createNewsAdd + "_content";
    
    var createnewsAddSuccess = createNewsAdd + "_success";
    var createnewsAddProcess = createNewsAdd + "_process";
    
    var createNewsTipNew = createNews + "_tip_new";
    var createNewsTipEdit = createNews + "_tip_edit";
    var createNewsAddSave = createNewsAdd + "_save";
    var createnewsAddSaveNew = createNewsAddSave + "_new";
    var createnewsAddSaveEdit = createNewsAddSave + "_edit";
    var createnewsAddSaveCancel = createNewsAddSave + "_cancel";
    
    ///////////////////////////
    // Load and display news //
    ///////////////////////////
    
    // Gets a specific news from the JCR and display
    var loadNewsByID = function(newsid) {
        $.ajax({
            //url: "/devwidgets/news/pages/data/onenews.json",
            url: "/system/news",
            type: "GET",
            data:{
                "action":"get",
                "id":newsid,
            },
            success: function(data) {
                var news = data.news;
                if(data.success === true){
                    $(newsDetailContent).html($.TemplateRenderer(newsDetailContentTemplate, news));
                    $(newsDetailContent).show();
                }
            },
            error: function(xhr, textStatus, thrownError) {
                alert("error");
            }
        });
    };
    
    // Gets all the news from the JCR.
    var loadNewsList = function() {
        $.ajax({
            //url: "/devwidgets/news/pages/data/sakainews.json",
            url: "/system/news",
            type: "GET",
            data:{
              "action":"allList"
            },
            success: function(data) {
                if(data.success === true){
                    if (data.newsList) {
                        initPager(data.newsList);
                        allNews = data.newsList;
                    }
                }
            },
            error: function(xhr, textStatus, thrownError) {
                showGeneralMessage($(inboxGeneralMessagesErrorGeneral).text());
                $(inboxResults).html(sakai.api.Security.saneHTML($(inboxGeneralMessagesErrorGeneral).text()));
            }
        });
    };
    
    sakai.news.getEditorID = function() {
        return 'mce_' + (mceNum*2 - 1);
    };
    
    var getEditNews = function(id){
        $.ajax({
//          url: "/devwidgets/news/pages/data/onenews.json",
            url: "/system/news",
            data: {
                "action":"get",
                "id":id,
            },
            type: "GET",
            success: function(data){
                if(data.success == true)
                {
                    var news = data.news;
                    $(createNewsAddTitle).val(news.title);
                    tinyMCE.getInstanceById(sakai.news.getEditorID()).getBody().innerHTML = news.content;
                    // $(createNewsAddContent).val(news.content);
                }
            },
            error: function(data){
                alert("error");
            },
        });
    };
    
    var saveEditNews = function(id,title,content,pictureURI){
        $.ajax({
            url: "/system/news",
            data: {
                "action":"update",
                "id":id,
                "title":title,
                "content":content,
                "pictureURI":pictureURI,
            },
            type: "POST",
            success: function(data){
              if(data.success === true)
                {
                  showSuccess(true);
                  window.location.reload();
                  // loadNewsList();
                }
            },
            error: function(data){
                alert("error");
            },
        });
    };
    
    /////////////////
    // Delete news //
    /////////////////
    var deleteNews = function(newsid){
        $.ajax({
//          url: "/devwidgets/news/pages/data/onenews.json",
            url: "/system/news",
            type: "POST",
            data: {
                "action": "delete",
                "id": newsid
            },
            success: function(data) {
              if(data.success === true)
                {
                  // alert("ok");
                  // window.location.reload();
                  
                  loadNewsList();
                }
            },
            error: function(xhr, textStatus, thrownError) {
                alert("Cann't delete the news!");
            }
        });
    };
    
    ///////////////////////
    // Utility functions //
    ///////////////////////

    var showProcess = function(show, type){
        if(show){
            $(createnewsAddSaveEdit).hide();
            $(createnewsAddSaveNew).hide();
            $(createnewsAddSaveCancel).hide();
            $(createnewsAddProcess).show();
        } else {
            $(createnewsAddProcess).hide();
            if(type === "new"){
                $(createnewsAddSaveCancel).show();
                $(createnewsAddSaveNew).show();
            }else if(type === "edit"){
                $(createnewsAddSaveCancel).show();
                $(createnewsAddSaveEdit).show();
            }
        }
    };
    
    var showSuccess = function(show, type){
        if(show){
            $(createnewsAddSaveEdit).hide();
            $(createnewsAddSaveNew).hide();
            $(createnewsAddSaveCancel).hide();
            $(createnewsAddSuccess).show();
        } else {
            $(createnewsAddSuccess).hide();
            if(type === "new"){
                $(createnewsAddSaveCancel).show();
                $(createnewsAddSaveNew).show();
            }else if(type === "edit"){
                $(createnewsAddSaveCancel).show();
                $(createnewsAddSaveEdit).show();
            }
        }
    };
    
    // Switch to the list or a specific news
    var showContainer = function(type) {
        if(type === "undefined"){return;}
        if(type === "list"){
            $(newsDetailContainer).hide();
            $(newsListContainer).show();
            newsOperationAction();
        }else if(type === "detail"){
            $(newsDetailContainer).show();
            $(newsListContainer).hide();
        }
    };
    
    // This function will redirect the user to the login page.
    var redirectToLoginPage = function() {
        document.location = sakai.config.URL.GATEWAY_URL;
    };
    
    var getIDByTitle = function(title) {
        for(var i = 0; i < allNews.length ; i++){
            if(allNews[i].title === title){
                return allNews[i].id;
            }
        }
    };
    
    ////////////////////
    // Event Handling //
    ////////////////////
    
    //add the edit and delete icon
    var newsOperationAction = function(){
        $(newsTableTR).live("mouseover", function(e){
            $(this).children(newsOperation).children(newsOperationIconEdit).show();
            $(this).children(newsOperation).children(newsOperationIconDelete).show();
        });
        $(newsTableTR).live("mouseout", function(e){
            $(this).children(newsOperation).children(newsOperationIconEdit).hide();
            $(this).children(newsOperation).children(newsOperationIconDelete).hide();
        });
    };
    
    //edit a news
    $(newsOperationIconEdit).live("click", function(ev){

        sakai.createnews.initialise();
        mceNum++;
        // $(createNewsContainer).jqmShow();
        $(createNewsTipEdit).show();
        $(createnewsAddSaveEdit).show();
        $(createNewsTipNew).hide();
        $(createnewsAddSaveNew).hide();
        $(createnewsAddSaveCancel).show(); 
        showProcess(false, "edit");
        
        var title = $(this).parent().siblings("#news_title_td").children()[0].text;
        var id = getIDByTitle(title);
        getEditNews(id);
        getEditNews(id);
        // setTimeout("getEditNews('"+id+"')",3000);
        
        $(createnewsAddSaveEdit).live("click", function(ev){
            var Title = $(createNewsAddTitle).val();
            var Content = tinyMCE.activeEditor.getContent();
            var pictureURI = "";
            showProcess(true, "edit");
            saveEditNews(id,Title,Content,pictureURI);
            showProcess(false, "edit");
            showSuccess(false, "edit");
        });
        
    });
    
    //add a news
    $(createNewsLink).live("click", function(ev){
        // $("#creategroupcontainer").show();
        // Load the creategroup widget.
        sakai.createnews.initialise();
        mceNum++;
        // $(createNewsContainer).jqmShow();
        $(createNewsTipEdit).hide();
        $(createnewsAddSaveEdit).hide();
        $(createNewsTipNew).show(); 
        $(createnewsAddSaveNew).show(); 
        $(createnewsAddSaveCancel).show(); 
        
        $(createNewsAddTitle).val("");
        $(createNewsAddContent).val("");
        
    });
    
    // Delete a news
    $(newsOperationIconDelete).live("click", function(){
        var title = $(this).parent().siblings("#news_title_td").children()[0].text;
        var id = getIDByTitle(title);
        deleteNews(id);
        $(this).parent().parent().remove();
        // loadNewsList();
    });
    
    // Show a specific news
    $(newsTitle).live("click", function(e){
        showContainer("detail");
        var id = getIDByTitle(e.target.text);
        loadNewsByID(id);
    });
    
    // Show news list
    $(newsDetailBacktoList).live("click", function(e){
        showContainer("list");
    });
    
    //////////////////////////////////////////////
    // Fluid Pager and News List Initialization //
    //////////////////////////////////////////////
    var initPager = function (userTable) {
        var options = {
            dataModel: userTable,
            columnDefs: "explode",
            bodyRenderer: {
              type: "fluid.pager.selfRender",
              options: {
                selectors: {
                    root: "#body-template"
                },
                row: "row:"
              }
            },
            pagerBar: {type: "fluid.pager.pagerBar", options: {
              pageList: {type: "fluid.pager.renderedPageList",
                options: { 
                  linkBody: "a"
                }
              }
            }}
        };
        
        fluid.pager("#news_pager", options);
    };
    
    // Initialization
    var init = function(){
        
        // Check if we are logged in or out.
        var person = sakai.data.me;
        var uuid = person.user.userid;
        if (!uuid || person.user.anon) {
            redirectToLoginPage();
        }else {
            loadNewsList();
            var qs = new Querystring();
            var newsid = qs.get("news");
            if (newsid) {
                showContainer("detail");
                loadNewsByID(newsid);
            } else {
                showContainer("list");
            }
        }
    };
    init();
    
};


sakai.api.Widgets.Container.registerForLoad("sakai.news");