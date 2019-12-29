require(['gitbook', 'jquery'], function (gitbook, $) {
    var configs;
    var anchorClickFlag;
    //生成内容导航
    function generateSectionNavigator() {
        var $archorBody = $(".book-anchor-body");
        $archorBody.append("<p class='book-anchor-title'>在这篇文章中：</p>");
        $(".page-inner .markdown-section").find("h1,h2,h3").each(function () {
            var cls = "anchor-h1";
            if ($(this).is("h2")) {
                cls = "anchor-h2";
            }
            if ($(this).is("h3")) {
                cls = "anchor-h3";
            }
            var text = $(this).text();
            var id = $(this).attr("id");
            $archorBody.append("<a id='an_" + id + "' class='anchor-text " + cls + "' title='" + text + "'  href='#" + id + "'>" + text + "</a>")
        });
        
        $(".book-anchor-body>a").click(function () {
            $(".book-anchor-body>a").removeClass("selected");
            var id = $(this).attr("href");
            anchorClickFlag = true;
            setScrollPosition(id, 800)
            setTimeout(function(){
                anchorClickFlag = false;
            }, 800)
        });



        $('.body-inner').on('scroll', function () {
            if(anchorClickFlag) return;

            var titleScrollTopList = $(".page-inner .markdown-section").find("h1,h2,h3").map(function(i, item) {
                return item.offsetTop;
            });

            if ($(this).scrollTop() > 100) {
                var scrollTop =$(this)[0].scrollTop;
                var activeIndex = 0;
                for(var i=0; i< titleScrollTopList.length; i++) {
                    if(scrollTop - titleScrollTopList[i] < 0) {
                        activeIndex = i;
                        break;
                    }
                }
                
                $(".book-anchor-body>a").removeClass("selected");
                $(".book-anchor-body>a").eq(activeIndex-1).addClass("selected")

                // 当滚动条到底部的时候显示最后一个
                if($(this)[0].scrollTop + $(this)[0].clientHeight === $(this)[0].scrollHeight) {
                    $(".book-anchor-body>a").removeClass("selected");
                    $(".book-anchor-body>a:last-child").addClass("selected")
                }
            }

            // 当滚动条到顶部的时候显示一个
            if($(this)[0].scrollTop === 0) {
                $(".book-anchor-body>a").removeClass("selected");
                $(".book-anchor-body>a").eq(0).addClass("selected")
            }
        });


        //获取hash值定向到指定位置
        var hash = decodeURIComponent(location.hash);
        setScrollPosition(hash, 100)
    }

    //基础设置
    function setBaseLayout() {

        //标题
        var $title = $(".header-inner .title");
        $title.text(gitbook.state.config.title);

        //搜索框
        var $searchIcon = $("#searchIcon");
        var $search = $('#book-search-input');
        var $searchInput = $search.find("input");
        var placeholder = configs.pluginsConfig["theme-archeros"]["search-placeholder"] || "输入关键字搜索"
        $searchInput.attr("placeholder", placeholder);
        $searchIcon.click(function (e) {
            $search.fadeIn();
            $searchIcon.hide();
            $searchInput.focus();
        });
        $searchInput.blur(function (e) {
            $search.hide();
            $searchIcon.fadeIn();
        });

        //去掉gitbook-link
        $(".summary .gitbook-link").hide();
        $(".summary .divider").hide();
    }

    //获取hash值定向到指定位置
    function setScrollPosition(id, millisec) {
        var $title = $(id);
        if($title.length) {
            var scrollTop = $title[0].offsetTop || 0
            $('.book-body,.body-inner').animate({
                scrollTop: scrollTop
            }, millisec);
            var selAnchorId = id.replace("#", '#an_')
            $(selAnchorId).addClass("selected");
        } else {
           $('.book-anchor-body a').eq(0).addClass("selected");
        }
    }

    //获取url参数
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    gitbook.events.on('start', function () {
    });

    gitbook.events.on('page.change', function () {
        configs = gitbook.state.config;
        setBaseLayout();
        generateSectionNavigator();
        // 遇到一些特定参数
        var isRightRef = $(window.frameElement).attr("isrightref");
        if (isRightRef == "true") {
            $(".header-inner").hide();
            $(".book-summary, .book-body").css("top", "0px");
            $(".book-anchor").hide();
            $("body>div").removeClass("with-summary");
            $(".js-toolbar-action").hide();
        }
    });
});
