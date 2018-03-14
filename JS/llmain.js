/* ALLOW FOR ES6 */
$(function() {
    'use strict';
});


$(() => {

    /* PREVENT UNAUTHED USER FROM LOADING LIVELINKS */
    $(firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // No user is signed in.
            alert("NOT SIGNED IN");
            window.location.href = 'index.html';
            //window.location.href = "loginli.html";
        }
    }));

    $("#chatbox").hide();


    /* SET NICK IN IRC COMPONENT */
    let setNick = function(username) {
        if (!setNick.prototype.done) {
            let ifrm = document.getElementById('chatbox');
            ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
            ifrm.document.open();
            ifrm.document.write('Loading...'); // DISPLAY USER FEEDBACK WITHIN iFRAME
            ifrm.document.close();

            $("#chatbox").attr("src", "https://webchat.freenode.net?nick=" + username + "&channels=%23livelinkschat&uio=Mj10cnVldd");
            setNick.prototype.done = true; // CAUSE THIS FUNC TO RUN ONLY ONE TIME
        }
    };


    // HANDLE BUTTON ANIMATION ONCLICK
    $(".nav__btn").click(function(e) {
        e.preventDefault();

        let $this = $(this);

        ($this.find("span").html() === '<i class="fa fa-angle-right" aria-hidden="true"></i>') ? $this.find("span").html('<i class="fa fa-angle-down" aria-hidden="true"></i>'): $this.find("span").html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
    });


    /* TOGGLE CHATBOX FUNCTION */
    $("#btn-ToggleCB").click(e => {
        e.preventDefault();

        // SHOW/HIDE CHATBOX
        $("#chatbox").toggleClass("showCB");

        // FIND USERNAME AND MAKE AVAILABLE TO APP
        setNick(localStorage["user"]); // SET: CHAT (IRC) NICK
    });

    /* SET UP  OBJECT FOR TRACKING */
    let trackStatus = new Function();

    /* SET INITIAL FIELDS FOR TRACKING */
    trackStatus.prototype.linksOpen = true;
    trackStatus.prototype.selectCategory = true;
    trackStatus.prototype.menuOpen = false;


    /* TOGGLE LINKS FUNCTION */
    $("#btn-ToggleLinks").click(e => {
        e.preventDefault();

        // SHOW/HIDE
        $("#holderDiv").toggle();
        $("#form-submit").toggle();

        if (trackStatus.prototype.linksOpen && trackStatus.prototype.menuOpen) {
            $("#btn-ToggleMenu").click();
            $("#btn-ToggleLinks").click();
        } else if (!trackStatus.prototype.linksOpen) {
            trackStatus.prototype.linksOpen = true;
        } else {
            trackStatus.prototype.linksOpen = false;
        }
    });


    $("#btn-ToggleMenu").click((e) => {
        e.preventDefault();

        // TOGGLE SLIDE MENU
        if (trackStatus.prototype.linksOpen) {
            $("#offscreenMenuIcoTop").click();
        } else {
            $("#btn-ToggleLinks").click();
            $("#offscreenMenuIcoTop").click();
        }

        if (!trackStatus.prototype.menuOpen) {
            trackStatus.prototype.menuOpen = true;
        } else {
            trackStatus.prototype.menuOpen = false;
        }
    });

    let curUser;
    let selectedMenuItem = "";
    let uNameFound = false;


    /* MAKE FIREBASE ICON CLICKABLE */
    $('#firebase-ico').click(function(e) {
        e.stopPropagation();
        window.open('http://www.firebase.com/', '_blank');
    });


    /* ENSURES NO MISFIRE RE-OPENING OF SLIDE PANEL MENU DUE   *
     * TO INITIAL AUTO OPEN-CLOSE SEQUENCE ON LOAD             *
     * INSTEAD OF USING NORMAL DUMB .CLICK() ACTION FOR TOGGLE */
    function checkPanelState() {
        if (menuToggleStatus.prototype.menuPanelState === "opened") {
            // Close SP as normal w/ toggle:
            $('#offscreenMenuIco').click();

            return true;
        } else {

            // OR WE DO NOTHING IF SP ALREADY CLOSED FOR CURRENT TOGGLE EVENT:
            return false;
        }
    }


    /* SETS SLIDE MENU STATUS FOR SM BUTTON FUNCTION INTERFACE */
    function menuToggleStatus() {
        if (menuToggleStatus.prototype.menuPanelState !== "opened") {
            menuToggleStatus.prototype.menuPanelState = "opened";
        } else {
            menuToggleStatus.prototype.menuPanelState = "closed";
        }
    }


    /* TOGGLE SLIDE MENU FUNCTION */
    let toggleMenuPanel = $('#togglePanel').scotchPanel({
        containerSelector: 'body', // MAKES APPEAR ON ENTIRE SCREEN
        direction: 'left', // MAKE TOGGLE IN FROM LEFT
        duration: 450, // SPEED IN FROM LEFT
        transition: 'ease-out', // CSS3 TRANSITION TYPE: E.g., linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(P1x,P1y,P2x,P2y)
        clickSelector: '.toggle-panel', // ENABLES TOGGLING WHEN CLICK UPON ELEMENTS OF THIS CLASS
        distanceX: '129px', // SIZE OF TOGGLE
        enableEscapeKey: true // CLICKING ESC CLOSES SLIDE MENU?
    });


    /* ToJSON FORMATTER */
    let constructJson = function(jsonKey, val) {
        let jsonObj = {};
        jsonObj[jsonKey] = val;

        return jsonObj;
    };


    /* LOAD THE SLIDE MENU ON PAGE LOAD: I.E., WILL AUTO-OPEN AFTER 5S.... */
    setTimeout(function() {
        $('#offscreenMenuIco').click();
    }, 500);


    /* ...THEN AUTO-CLOSE SLIDE MENU AFTER SHORT PAUSE */
    setTimeout(function() {
        $('#offscreenMenuIco').click();
    }, 2750);


    /* TOGGLE MENU */
    $('#offscreenMenuIco, #offscreenMenuIcoTop').click(function(e) {
        e.preventDefault();
        e.stopPropagation();

        menuToggleStatus();
        toggleMenuPanel.toggle();
    });

    
    let thisPKey;

    /* CONVERT POST DATA INTO DOM ELEMENTS ON PAGE */
    populatePageWLinks = function(resArray) {
        let storedName = localStorage["user"];

        // WHENEVER A LIKE BUTTON IS CLICKED, DO THIS:
        function runOneTimeEach($this, $this0) {
            let targetPost = $this.parent().parent().parent();
            let uniqueLikeCount = $this.parent().parent().parent().find(".selectNumber").html();
            uniqueLikeCount = (uniqueLikeCount === undefined || uniqueLikeCount === 0) ? 0 : uniqueLikeCount.split("</option").slice(1, uniqueLikeCount.split("</option").length - 1).length; // SPLIT STRING TO ARRAY AND COUNT UNAMES

            let likeCountVal = parseInt($this.parent().parent().parent().find(".likeCount").text()); // GET LIKE COUNT FROM DOM 
            let postID = $this.parent().parent().parent()[0].className.split(" ");
            postAuth = postID[1]; // WHOMEVER ORIGINALLY CREATED THE POST HERE
            postID = postID[3]; // #ID OF DIV BEING CLICKED HERE
            let classNameInfo = "";
            let isPostLikedAlready = classNameInfo = $this[0].className.split(" ");

            // GRAB LOCATION OF ICON IN CLASSNAME ARRAY  
            let indexOfIcon = classNameInfo.indexOf("fa-heart");
            indexOfIcon = (indexOfIcon === -1) ? classNameInfo.indexOf("fa-heart-o") : $.noop();

            isPostLikedAlready = isPostLikedAlready[2]; // IS THIS ICO OF CLASS 'FA-HEART'?

            if (isPostLikedAlready === "fa-heart" || isPostLikedAlready === "fa-heart-o") {
                let isUserListedInLikes = $this.parent().parent().parent().find(".userListed").val();

                // IF USER IS LISTED IN LIKES FOR POST, DO "IF" CLAUSE BELOW
                if ("" + isUserListedInLikes !== "true") { // ...==="false"
                    $this.parent().parent().parent().find(".userListed").val("true");

                    // ADD +1 TO TOTAL DISPLAYED COUNT OF LIKES:	  
                    $this.parent().parent().parent().find('.likeCount').text(function() {
                        uniqueLikeCount++;
                        if (uniqueLikeCount > 1) {

                            return parseInt($this.parent().parent().parent().find(".likeCount").text()) + 1;
                        } else {

                            return 1;
                        }
                    });

                    if (uniqueLikeCount < 0) {
                        alert("ERR: LIKE COUNT INVALID!");

                        return false;
                    } else if (uniqueLikeCount === 1) {
                        // SHOW COUNT, AND REPLACE 'UNLIKED' ICON WITH 'LIKED' ICO
                        $this.parent().parent().parent().find(".likeCount").css('visibility', 'visible');
                        classNameInfo.splice(indexOfIcon, 1, "fa-heart");
                        classNameInfo = classNameInfo.join(" ");
                        let counterrr = 0;

                        //  FORM A DYNAMIC DROPDOWN LIST OF USERS CLICKED 'LIKE':
                        //  ONLY SHOW CURUSER IN THIS CASE:
                        let $userDropToAdd = document.createElement("div"); // CREATE DIV
                        $userDropToAdd.className = "selectNumber"; // GIVE IT STYLE AND GOOD LOOKS
                        let user = localStorage["user"]; // STORE INPUT UNAME FOR USE THEREWITH
                        let post = $this; // WHERE IT GOES

                        let el = document.createElement("option"); // START DIV INNERHTML WITH A SPACER
                        el.className = "firstOptionDD";
                        el.textContent = " ";
                        el.value = " ";
                        $userDropToAdd.appendChild(el); // ADD SPACER ELEMENT IN TOP OF NEW DIV

                        el = null; // RESET EL

                        targetPost.append($userDropToAdd);

                        $this.parent().html('<i class="' + classNameInfo + '\" aria-hidden="true"></i>'); // USED TO BLINDLY DO FA-HEART W/ postAuth
                    }

                    // GATHER POSTED LINK META-DATA:
                    let cN = $this.attr('class').split(' ');
                    let pAuth = cN[0];
                    let url = cN[3];
                    let uidNo = localStorage['uid'] || firebase.auth().currentUser.uid;

                    // ADD USERNAME TO LIKE LIST
                    targetPost.find(".selectNumber").append('<option class="' + localStorage["user"] + '" value="' + localStorage["user"] + '">' + localStorage["user"] + '</option>');

                    $this.parent().parent().parent().find(".selectNumber").find("." + localStorage["user"]).css('display', 'block');

                    // ADD ACTUAL "LIKE" TO DB NEXT; GOES WITH ABOVE METADATA & FOUND USER NAME:
                    $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(responseList) {
                        // CUSTOM DYNAMIC JSON KEY VALUE GENERATOR:
                        function constructJson(jsonKey) {
                            let jsonObj = {};
                            jsonObj[jsonKey] = true;

                            return jsonObj;
                        }

                        // COMPARE AGAINST EXISTING POSTS IN DATABASE TO FIND LIKED POST
                        // UPON FINDING IT, ADD 1 TO ASSOCIATED 'likes' ROW WITHIN DATABASE
                        for (let link in responseList) {
                            responseURL = decodeURIComponent(responseList[link].url);
                            if (responseURL === url && responseList[link].author === pAuth) {
                                let pKey = link;
                                let res = constructJson(pKey);

                                firebase.database().ref('postLikes/' + localStorage["user"]).update(res);

                                break;
                            }
                        }
                    });

                    return;
                } else {
                    // FIRE 'UNLIKE' FUNCTION ONLY IF POST ALREADY LIKED BY CURRENT LOGGED IN USER:
                    $this.parent().parent().parent().find(".selectNumber").find("." + localStorage["user"]).val("");
                    $this.parent().parent().parent().find(".selectNumber").find("." + localStorage["user"]).className = "";
                    $this.parent().parent().parent().find(".selectNumber").find("." + localStorage["user"]).css('display', 'none');

                    $this.parent().parent().parent().find(".selectNumber").find("." + localStorage["user"]).remove("." + localStorage["user"]);
                    $this.parent().parent().parent().find(".userListed").val("false");

                    if (uniqueLikeCount <= 0) {

                        return false; /* <- NOOP */
                    } else if (uniqueLikeCount === 1) {
                        classNameInfo.splice(indexOfIcon, 1, "fa-heart-o");
                        classNameInfo = classNameInfo.join(" ");
                    }

                    // TAKE -1 FROM TOTAL COUNT OF USER LIKES:	  
                    $this.parent().parent().parent().find('.likeCount').text(function() {
                        if (uniqueLikeCount > 1) {

                            return parseInt($this.parent().parent().parent().find(".likeCount").text()) - 1;
                        } else {
                            // ELSE CLEAR USER LIKE LIST, HIDE COUNT, AND REPLACE ICON WITH 'UNLIKED' ICO
                            $this.parent().parent().parent().find(".selectNumber").html('').remove();
                            $this.parent().parent().parent().find(".likeCount").css('visibility', 'hidden'); // HIDE LIKECOUNT NOW
                            $this.parent().html('<i class="' + classNameInfo + '" aria-hidden="true"></i>'); // REPLACE CUR ICO WITH FA-HEART-O (HOLLOW/NO LIKES)

                            return 0;
                        }
                    });

                    // GATHER POST META-DATA
                    let cNm2 = $this.attr('class').split(' ');
                    let auth = cNm2[0];
                    let postedURL = cNm2[3];

                    // REMOVE THE ACTUAL "LIKE" NEXT; GOING FROM ABOVE METADATA & FOUND USER NAME:
                    $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(responseList) {
                        // COMPARE AGAINST EXISTING POSTS IN DATABASE TO FIND LIKED POST
                        // UPON FINDING IT, ADD 1 TO ASSOCIATED 'likes' ROW WITHIN DATABASE      
                        for (let link in responseList) {
                            responseURL = decodeURIComponent(responseList[link].url);
                            if (responseURL === postedURL && responseList[link].author === auth) {
                                let thisPKey = link;
                                firebase.database().ref('postLikes/' + localStorage["user"] + "/" + thisPKey).remove();

                                break;
                            }
                        }
                    });

                    return;
                }
            }
            $("#refreshButton").click();
            $("#refreshButton").click();
        } // END RUNONETIMEEACH() FUNCTION

        $('#linkDisplayDiv').html(""); // WIPE THE OLD LINKS BEFORE RECREATING DISPLAY

        if (resArray) { // RENDER CUSTOM SEARCH RESULTS -> UI

            let resJSON = $.getJSON('https://livelinks01125.firebaseio.com/postLikes.json');
            let userLikeObj = {};
            let likeArray = [];

            resJSON.done(function(snapshot) {
                snapshot = snapshot.responseJSON;

                for (let likedPost in snapshot) {
                    if (snapshot.hasOwnProperty(likedPost)) {
                        userLikeObj[likedPost] = Object.keys(snapshot[likedPost]);
                    }
                }
            });

            let thisUID = localStorage['uid'];
            let outputUName;
            let cachedUNameList;

            cachedUNameList = $.getJSON('https://livelinks01125.firebaseio.com/users.json');

            cachedUNameList.done(function(cachedUNameList) {
                /* POPULATE INITIAL LINKS ON SCREEN */
                let searchAndDestroy;
                let postNo;

                $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(snapshot) {
                    let likeUserList = [];
                    let countDivs = 0;
                    for (let post in resArray) {
                        let resJSONObj = resJSON.responseJSON;
                        let likeUNameList = [];
                        let likeCounter = 0;
                        countDivs++;
                        postNo = post;
                        let usernameCount = 0;
                        // GENERATE A LIST OF LIKES FOR CURRENT LINK/POST
                        for (let likes in resJSONObj) {
                            let usernames = Object.keys(resJSONObj);
                            usernameCount++;
                            let arrLen = Object.keys(resJSONObj[likes]).length;
                            let keys = Object.keys(resJSONObj[likes]);

                            for (let i = 0; i < arrLen; i++) {
                                if (keys[i] === postNo) {
                                    likeUNameList.push(likes);
                                }
                            }
                        }
  
                        // TOGGLE
                        uNameFound = false;
                        if (likeUNameList.indexOf(localStorage["user"]) !== -1) {
                            // AUTHED USER'S UNAME FOUND IN LIKE-LIST FOR CUR POST
                            uNameFound = true;
                        }

                        let numOfLikes = likeUNameList.length;
                        let newPost = document.createElement('div');

                        newPost.id = 'div' + countDivs + 'Init'; //NUMBERS EACH DIV INDIVIDUALLY
                        newPost.pTitle = snapshot[post].title.length >= 42 ? snapshot[post].title.substring(0, 41) + "..." : snapshot[post].title;
                        newPost.xDataMarker = newPost.rawUrl = snapshot[post].url;
                        newPost.prettyURL = decodeURIComponent(snapshot[post].url);
                        newPost.pUrl = snapshot[post].url.length >= 53 ? decodeURIComponent(snapshot[post].url).substring(0, 52) + "..." : decodeURIComponent(snapshot[post].url);
                        newPost.author = snapshot[post].author;
                        newPost.ip = snapshot[post].ip || "0.0.0.0";
                        newPost.category = decodeURIComponent(snapshot[post].category); //<=String of HTML
                        newPost.created_at = snapshot[post].timestamp || new Date();
                        newPost.catName = snapshot[post].catName;
                        newPost.className = 'linkOutputDiv ' + newPost.author + ' ' + newPost.xDataMarker + ' ' + newPost.id + " " + newPost.catName;

                        //  IF NOT ABOVE LIKES === 0, THEN LOAD .FA-HEART-O ICON INSTEAD OF .FA-HEART
                        if (numOfLikes === 0) {
                            newPost.innerHTML = '<h3 class="h3items"><span class="divTitle"><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pTitle + '</a></span></h3><div id="likeIcoWrap" class="' + newPost.pUrl + " " + newPost.author + '"><span class="ico-comment"><i class="fa fa-comment-o" style="display: inline-block;" aria-hidden="true"> </i></span><span class="postCatIcon">' + newPost.category + '</span>  <div class="likeIco"><i class="' + newPost.author + ' fa fa-heart-o ' + newPost.prettyURL + '" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount"></span><input type="text" class="userListed" value="false"/></div></div></div><button type="button" class="xDataDismiss " title="Delete Post">&times;</button><br />';
                            newPost.innerHTML += '<span class=\'divBody\'><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pUrl + '</a></span><span id="newPostAuthor" class="' + newPost.author + '"><a href="javascript:void(0);" class="authorDescribe" title="' + newPost.ip + '">Posted By: ' + newPost.author + ' &middot;  <span class="timestamp" data-livestamp="' + newPost.created_at + '"></span></a></span>';
                        } else { //...LOAD VERSION WITH LIKES INSTEAD, BUT PREVE FURTHER CLICKS:
                            if (likeUNameList.indexOf(localStorage["user"]) !== -1) {
                                newPost.innerHTML = '<h3 class="h3items"><span class="divTitle"><a href="javascript:void(0);" url=' + newPost.rawUrl + '>' + newPost.pTitle + '</a></span></h3><div class="likeIcoWrap ' + newPost.pUrl + " " + newPost.author + '"><span class="ico-comment"><i class="fa fa-comment-o" style="display: inline-block;" aria-hidden="true"> </i></span><span class="postCatIcon">' + newPost.category + '</span>  <div class="likeIco"><i class="' + newPost.author + ' fa fa-heart ' + newPost.prettyURL + '" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount">' + numOfLikes + '</span><input type="text" class="userListed" value="true"/></div></div></div><button type="button" class="xDataDismiss " title="Delete Post">&times;</button><br />';
                                newPost.innerHTML += '<span class=\'divBody\'><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pUrl + '</a></span><span id="newPostAuthor" class="' + newPost.author + '"><a href="javascript:void(0);" class="authorDescribe" title="' + newPost.ip + '">Posted By: ' + newPost.author + ' &middot;  <span class="timestamp" data-livestamp="' + newPost.created_at + '"></span></a></span>';
                            } else {
                                newPost.innerHTML = '<h3 class="h3items"><span class=\'divTitle\'><a href="javascript:void(0);" url=' + newPost.rawUrl + '>' + newPost.pTitle + '</a></span></h3><div class="likeIcoWrap ' + newPost.pUrl + " " + newPost.author + '"><span class="ico-comment"><i class="fa fa-comment-o" style="display: inline-block;" aria-hidden="true"> </i></span><span class="postCatIcon">' + newPost.category + '</span> <div class="likeIco"><i class="' + newPost.author + ' fa fa-heart ' + newPost.prettyURL + '" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount">' + numOfLikes + '</span><input type="text" class="userListed" value="false"/></div></div></div><button type="button" class="xDataDismiss " title="Delete Post">&times;</button><br />';
                                newPost.innerHTML += '<span class="divBody"><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pUrl + '</a></span><span id="newPostAuthor" class="' + newPost.author + '"><a href="javascript:void(0);" class="authorDescribe" title="' + newPost.ip + '">Posted By: ' + newPost.author + ' &middot;  <span class="timestamp" data-livestamp="' + newPost.created_at + '"></span></a></span>';
                            }

                            // FORM A DYNAMIC DROPDOWN LIST OF USERS CLICKED 'LIKE':
                            // FILTER OUT INVALID RESULTS=>
                            if (likeUNameList[0] !== "undefined") {
                                let $select = document.createElement("div");
                                $select.className = "selectNumber";
                                newPost.dropdownUserList = likeUNameList; // <= WHOLE ARRAY AUTOMATICALLY VALID
                                for (let i = 0; i < newPost.dropdownUserList.length + 1; i++) {
                                    let el = document.createElement("option");
                                    if (i === 0) {
                                        el.className = "firstOptionDD";
                                        el.textContent = " ";
                                        el.value = " ";
                                    } else {
                                        let user = newPost.dropdownUserList[i - 1];
                                        el.className = user;
                                        el.textContent = user;
                                        el.value = user;
                                    }
                                    $select.appendChild(el);
                                }
                                newPost.appendChild($select);
                            }
                        }
                        $('#linkDisplayDiv').prepend(newPost);
                    }

                    let uName = false;

                    /* SHOW/HIDE POSTS BY POST AUTHOR WHEN "POST BY..." IS CLICKED UPON */
                    let toggleCategory = function(catTitle) {
                        if (toggleCategory.prototype["togStatus"] === "true") {
                            toggleCategory.prototype["togStatus"] = "false";
                            $('.linkoutputdiv').not('.' + catTitle).show();
                        } else {
                            toggleCategory.prototype["togStatus"] = "true";
                            $('.linkoutputdiv').not('.' + catTitle).hide();
                        }
                    };


                    /* SET POST CATEGORY ON CLICK */
                    $('#dispLinksDiv').delegate('i.postedLink', 'click', function(e) {
                        e.stopPropagation();

                        let catTitle = $(this)[0].title;
                        switch (catTitle) {
                            case "Misc.":
                                toggleCategory("Misc");
                                break;
                            case "Technology":
                                toggleCategory(catTitle);
                                break;
                            case "News":
                                toggleCategory(catTitle);
                                break;
                            case "Science":
                                toggleCategory(catTitle);
                                break;
                            case "Entertainment":
                                toggleCategory(catTitle);
                                break;
                            case "Finance":
                                toggleCategory(catTitle);
                                break;
                            case "Sports":
                                toggleCategory(catTitle);
                                break;
                            case "Politics":
                                toggleCategory(catTitle);
                                break;
                        }
                    });


                    /* HIDE DIV OF LIKED USERS FOR CATEGORIES */
                    $('#dispLinksDiv').delegate('i.postedLink', 'mouseenter', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();


                        $(this).parent().parent().parent().parent().find('.selectNumber').removeClass('fadeIn');
                        $(this).parent().parent().parent().parent().find('.selectNumber').css('visibility', 'hidden');
                    });

                    let hideLikeDisp;


                    /* ON MOUSEOVER OF LIKE ICON, SHOW LIKE LIST */
                    $('#dispLinksDiv').delegate('div.likeIco', 'mouseenter', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();

                        let likeUserCount = $(this).parent().parent().find(".likeCount").text();
                        if (likeUserCount === "") {

                            return false;
                        } else {
                            $(this).parent().parent().find('.selectNumber').addClass('fadeIn');
                            $(this).parent().parent().find('.selectNumber').css('visibility', 'visible');

                            return true;
                        }
                    });


                    /* ON MOUSELEAVE OF LIKE ICON, HIDE LIKE LIST */
                    $('#dispLinksDiv').delegate('div.likeIco', 'mouseleave', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();

                        $(this).parent().parent().find('.selectNumber').removeClass('fadeIn');
                        $(this).parent().parent().find('.selectNumber').css('visibility', 'hidden');
                    });


                    /* ON CLICK OF LIKE ICON, RUN ADD/REMOVE LIKE LOGIC */
                    $('#dispLinksDiv').delegate('i.fa.fa-heart-o, i.fa.fa-heart', 'click', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        evt.stopImmediatePropagation();

                        let $this = $(this);
                        let $this0 = $(this)[0];

                        runOneTimeEach($this, $this0);

                        return false;
                    });


                    /* SHADE DROPDOWN CATEGORIES ON MOUSEOVER */
                    $('#menu').delegate('.ui-menu-item', 'mouseenter', function() {
                        $(this).css('color', 'gray');
                        $(this).find('.dropdownIco').css('color', 'gray');
                    });


                    /* UNSHADE DROPDOWN CATEGORIES ON MOUSELEAVE */
                    $('#menu').delegate('.ui-menu-item', 'mouseleave', function() {
                        $(this).css('color', '#333333');
                        $(this).find('.dropdownIco').css('color', '#333333');
                    });

                    let textRes;


                    /* CAPTURE/RECORD DATA REGARDING DELETION OF POSTS */
                    searchAndDestroy = function(url) {
                        $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(snapshot) {
                            for (let post in snapshot) {
                                // IF URL MATCH SNAPSHOT[POST.url], THEN SAME IS USED TO FORM REF FOR PARENT LINK TO BE .REMOVE()'d
                                if (snapshot[post].url === url) {
                                    // REMOVE POST DATA FROM DB
                                    firebase.database().ref('links/' + post).remove();

                                    // GATHER RELATED METADATA:
                                    let uEmail = localStorage['email'] || firebase.auth().currentUser.email;
                                    let uidNo = localStorage['uid'] || firebase.auth().currentUser.uid;
                                    let delURL = url;

                                    // PUSH EVENT DATA TO DB
                                    firebase.database().ref('deletedposts/').push({
                                        email: uEmail,
                                        url: delURL,
                                        uid: uidNo
                                    });
                                }
                            }
                        });
                    };


                    /* DELETE TARGETED LINK ON 'X' CLICK */
                    $('#dispLinksDiv').delegate('button.xDataDismiss', 'click', function(e) {
                        e.stopPropagation();

                        // FIND THE CORRESPONDING URL TO QUERY:
                        let delMarker = $(this).parent()[0].className.split(" ");
                        let $that = $(this);

                        postAuthor = delMarker[1];
                        delMarker = delMarker[2];
                        curUID = localStorage["uid"] || firebase.auth().currentUser.uid;
                        let userAuthedForPostDel = false;

                        $.getJSON('https://livelinks01125.firebaseio.com/users.json', function(snapshot) {
                            for (let username in snapshot) {
                                if (snapshot[username].uid === curUID) {
                                    if (postAuthor === snapshot[username].user) {
                                        userAuthedForPostDel = true;

                                        break;
                                    }
                                }
                            }

                            if (!userAuthedForPostDel) {
                                $('.deleteRestricted').dialog({
                                    modal: true,
                                    buttons: [{
                                        text: "OK",
                                        click: function() {
                                            $('.deleteRestricted').dialog("close");
                                        },
                                        class: "okBtn"
                                    }]
                                });
                            } else {
                                searchAndDestroy(delMarker);
                                // RUN FB QUERY, .THEN(...) delete and also .hide() associated.
                                $that.parent().css('display', 'none');
                            }
                        });
                    });
                }); // END HERE -- INNER FUNC
            }); // END HERE -- OUTERMOST FUNC
        } else { // NORMAL RENDERING OF ALL LINKS IN DB:

            let resJSON = $.getJSON('https://livelinks01125.firebaseio.com/postLikes.json');
            let userLikeObj = {};
            let likeArray = [];

            resJSON.done(function(snapshot) {
                snapshot = snapshot.responseJSON;

                for (let likedPost in snapshot) {
                    if (snapshot.hasOwnProperty(likedPost)) {
                        userLikeObj[likedPost] = Object.keys(snapshot[likedPost]);
                    }
                }
            });

            let thisUID = localStorage['uid'];
            let outputUName;
            let cachedUNameList;       
            
            cachedUNameList = $.getJSON('https://livelinks01125.firebaseio.com/users.json');

            cachedUNameList.done(function(cachedUNameList) {
                /* POPULATE INITIAL LINKS ON SCREEN */
                let searchAndDestroy;
                let postNo;

                $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(snapshot) {
                    let likeUserList = [];
                    let countDivs = 0;
                    for (let post in snapshot) {
                        // All data available here in the order it was called.    
                        let resJSONObj = resJSON.responseJSON;
                        let likeUNameList = [];
                        let likeCounter = 0;
                        countDivs++;
                        postNo = post;
                        let usernameCount = 0;
                        
                        // CREATE A LIST OF USERS LIKED CURRENT POST
                        for (let likes in resJSONObj) {
                            let usernames = Object.keys(resJSONObj);
                            usernameCount++;
                            let arrLen = Object.keys(resJSONObj[likes]).length;
                            let keys = Object.keys(resJSONObj[likes]);

                            for (let i = 0; i < arrLen; i++) {
                                if (keys[i] === postNo) {
                                    likeUNameList.push(likes);
                                }
                            }
                        }
                        
                        // TOGGLE
                        uNameFound = false;
                        if (likeUNameList.indexOf(localStorage["user"]) !== -1) {
                            // AUTHED USER'S UNAME FOUND IN LIKE-LIST FOR CUR POST
                            uNameFound = true;
                        }

                        // POST ELEMENT CREATION
                        let numOfLikes = likeUNameList.length;
                        let newPost = document.createElement('div');
                        
                        thisCommentCount = 0;
                        
                        newPost.id = 'div' + countDivs + 'Init'; //NUMBERS EACH DIV INDIVIDUALLY
                        newPost.pTitle = snapshot[post].title.length >= 42 ? snapshot[post].title.substring(0, 41) + "..." : snapshot[post].title;
                        newPost.xDataMarker = newPost.rawUrl = snapshot[post].url;
                        newPost.prettyURL = decodeURIComponent(snapshot[post].url);
                        newPost.pUrl = snapshot[post].url.length >= 53 ? decodeURIComponent(snapshot[post].url).substring(0, 52) + "..." : decodeURIComponent(snapshot[post].url);
                        newPost.author = snapshot[post].author;
                        newPost.ip = snapshot[post].ip || "0.0.0.0";
                        newPost.category = decodeURIComponent(snapshot[post].category); //<=String of HTML
                        newPost.created_at = snapshot[post].timestamp || new Date();
                        newPost.catName = snapshot[post].catName;
                        newPost.uniqueID = snapshot[post].uniqueID;
                        newPost.className = 'linkOutputDiv ' + newPost.author + ' ' + newPost.xDataMarker + ' ' + newPost.id + " " + newPost.catName + " " + newPost.uniqueID;
                        newPost.totalComments = (snapshot[post].commentCount > 0) ? snapshot[post].commentCount : '<div id="placeholderDiv" style="display:none;"></div>';  // POST NUMBER > 0 OR NOTHING
                        
                        //  IF NOT ABOVE LIKES === 0, THEN LOAD .FA-HEART-O ICON INSTEAD OF .FA-HEART
                        if (numOfLikes === 0) {
                            newPost.innerHTML = '<h3 class="h3items"><span class="divTitle"><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pTitle + '</a></span></h3><div id="likeIcoWrap" class="' + newPost.pUrl + " " + newPost.author + '"><span class="ico-comment"><i class="fa fa-comment-o" style="display: inline-block;" aria-hidden="true"> </i><span class="div__comment-output"><small><sup id="' + newPost.id + '__comment-output">' + newPost.totalComments + '</small></span></span><span class="postCatIcon">' + newPost.category + '</span> <div class="likeIco"><i class="' + newPost.author + ' fa fa-heart-o ' + newPost.prettyURL + '" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount"></span><input type="text" class="userListed" value="false"/></div></div></div><button type="button" class="xDataDismiss " title="Delete Post">&times;</button><br />';
                            newPost.innerHTML += '<span class=\'divBody\'><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pUrl + '</a></span><span id="newPostAuthor" class="' + newPost.author + '"><a href="javascript:void(0);" class="authorDescribe" title="' + newPost.ip + '">Posted By: ' + newPost.author + ' &middot;  <span class="timestamp" data-livestamp="' + newPost.created_at + '"></span></a></span>';
                        } else { //...LOAD VERSION WITH LIKES INSTEAD, BUT PREVE FURTHER CLICKS:
                            if (likeUNameList.indexOf(localStorage["user"]) !== -1) {
                                newPost.innerHTML = '<h3 class="h3items"><span class="divTitle"><a href="javascript:void(0);" url=' + newPost.rawUrl + '>' + newPost.pTitle + '</a></span></h3><div class="likeIcoWrap ' + newPost.pUrl + " " + newPost.author + '"><span class="ico-comment"><i class="fa fa-comment-o" style="display: inline-block;" aria-hidden="true"> </i><span class="div__comment-output"><small><sup id="' + newPost.id + '__comment-output">' + newPost.totalComments + '</sup></small></span></span><span class="postCatIcon">' + newPost.category + '</span> <div class="likeIco"><i class="' + newPost.author + ' fa fa-heart ' + newPost.prettyURL + '" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount">' + numOfLikes + '</span><input type="text" class="userListed" value="true"/></div></div></div><button type="button" class="xDataDismiss " title="Delete Post">&times;</button><br />';
                                newPost.innerHTML += '<span class=\'divBody\'><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pUrl + '</a></span><span id="newPostAuthor" class="' + newPost.author + '"><a href="javascript:void(0);" class="authorDescribe" title="' + newPost.ip + '">Posted By: ' + newPost.author + ' &middot;  <span class="timestamp" data-livestamp="' + newPost.created_at + '"></span></a></span>';
                            } else {
                                newPost.innerHTML = '<h3 class="h3items"><span class=\'divTitle\'><a href="javascript:void(0);" url=' + newPost.rawUrl + '>' + newPost.pTitle + '</a></span></h3><div class="likeIcoWrap ' + newPost.pUrl + " " + newPost.author + '"><span class="ico-comment"><i class="fa fa-comment-o" style="display: inline-block;" aria-hidden="true"> </i><span class="div__comment-output"><small><sup id="' + newPost.id + '__comment-output">' + newPost.totalComments + '</sup></small></span></span><span class="postCatIcon">' + newPost.category + '</span> <div class="likeIco"><i class="' + newPost.author + ' fa fa-heart ' + newPost.prettyURL + '" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount">' + numOfLikes + '</span><input type="text" class="userListed" value="false"/></div></div></div><button type="button" class="xDataDismiss " title="Delete Post">&times;</button><br />';
                                newPost.innerHTML += '<span class="divBody"><a href="javascript:void(0);" url="' + newPost.rawUrl + '">' + newPost.pUrl + '</a></span><span id="newPostAuthor" class="' + newPost.author + '"><a href="javascript:void(0);" class="authorDescribe" title="' + newPost.ip + '">Posted By: ' + newPost.author + ' &middot; <span class="timestamp" data-livestamp="' + newPost.created_at + '"></span></a></span>';
                            }

                            // FORM A DYNAMIC DROPDOWN LIST OF USERS CLICKED 'LIKE':
                            // FILTER OUT INVALID RESULTS=>
                            if (likeUNameList[0] !== "undefined") {
                                let $select = document.createElement("div");
                                $select.className = "selectNumber";
                                newPost.dropdownUserList = likeUNameList; // <= WHOLE ARRAY AUTOMATICALLY VALID
                                for (let i = 0; i < newPost.dropdownUserList.length + 1; i++) {
                                    let el = document.createElement("option");
                                    if (i === 0) {
                                        el.className = "firstOptionDD";
                                        el.textContent = " ";
                                        el.value = " ";
                                    } else {
                                        let user = newPost.dropdownUserList[i - 1];
                                        el.className = user;
                                        el.textContent = user;
                                        el.value = user;
                                    }
                                    $select.appendChild(el);
                        
                                }
                                newPost.appendChild($select);
                            }
                        }
                        $('#linkDisplayDiv').prepend(newPost);
                            
                    }

                    let uName = false;

                    /* SHOW/HIDE POSTS BY POST AUTHOR WHEN "POST BY..." IS CLICKED UPON */
                    let toggleCategory = function(catTitle) {
                        if (toggleCategory.prototype["togStatus"] === "true") {
                            toggleCategory.prototype["togStatus"] = "false";
                            $('.linkoutputdiv').show();
                        } else {
                            toggleCategory.prototype["togStatus"] = "true";
                            $('.linkoutputdiv').not('.' + catTitle).hide();
                        }
                    };


                    /* SET POST CATEGORY ON CLICK */
                    $('#dispLinksDiv').delegate('i.postedLink', 'click', function(e) {
                        e.stopPropagation();

                        let catTitle = $(this)[0].title;
                        switch (catTitle) {
                            case "Misc.":
                            case "See More Misc Posts":
                            case "Miscellaneous":
                                toggleCategory("Misc");
                                break;
                            case "Technology":
                            case "See More Technology Links":
                                toggleCategory(catTitle);
                                break;
                            case "News":
                                toggleCategory(catTitle);
                                break;
                            case "Science":
                                toggleCategory(catTitle);
                                break;
                            case "Entertainment":
                                toggleCategory(catTitle);
                                break;
                            case "Finance":
                                toggleCategory(catTitle);
                                break;
                            case "Sports":
                                toggleCategory(catTitle);
                                break;
                            case "Politics":
                                toggleCategory(catTitle);
                                break;
                        }
                    });


                    /* HIDE DIV OF LIKED USERS FOR CATEGORIES */
                    $('#dispLinksDiv').delegate('i.postedLink', 'mouseenter', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();

                        $(this).parent().parent().parent().parent().find('.selectNumber').removeClass('fadeIn');
                        $(this).parent().parent().parent().parent().find('.selectNumber').css('visibility', 'hidden');
                    });

                    let hideLikeDisp;


                    /* ON MOUSEOVER OF LIKE ICON, SHOW LIKE LIST */
                    $('#dispLinksDiv').delegate('div.likeIco', 'mouseenter', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();

                        let likeUserCount = $(this).parent().parent().find(".likeCount").text();
                        if (likeUserCount === "") {

                            return false;
                        } else {
                            $(this).parent().parent().find('.selectNumber').addClass('fadeIn');
                            $(this).parent().parent().find('.selectNumber').css('visibility', 'visible');

                            return true;
                        }
                    });


                    /* ON MOUSELEAVE OF LIKE ICON, HIDE LIKE LIST */
                    $('#dispLinksDiv').delegate('div.likeIco', 'mouseleave', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();

                        $(this).parent().parent().find('.selectNumber').removeClass('fadeIn');
                        $(this).parent().parent().find('.selectNumber').css('visibility', 'hidden');
                    });


                    /* ON CLICK OF LIKE ICON, RUN ADD/REMOVE LIKE LOGIC */
                    $('#dispLinksDiv').delegate('i.fa.fa-heart-o, i.fa.fa-heart', 'click', function(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        evt.stopImmediatePropagation();

                        let $this = $(this);
                        let $this0 = $(this)[0];

                        runOneTimeEach($this, $this0);

                        return false;
                    });


                    /* SHADE DROPDOWN CATEGORIES ON MOUSEOVER */
                    $('#menu').delegate('.ui-menu-item', 'mouseenter', function() {
                        $(this).css('color', 'gray');
                        $(this).find('.dropdownIco').css('color', 'gray');
                    });


                    /* UNSHADE DROPDOWN CATEGORIES ON MOUSELEAVE */
                    $('#menu').delegate('.ui-menu-item', 'mouseleave', function() {
                        $(this).css('color', '#333333');
                        $(this).find('.dropdownIco').css('color', '#333333');
                    });

                    let textRes;


                    /* CAPTURE/RECORD DATA REGARDING DELETION OF POSTS */
                    searchAndDestroy = function(url) {
                        $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(snapshot) {
                            for (let post in snapshot) {
                                // IF URL MATCH SNAPSHOT[POST.url], THEN SAME IS USED TO FORM REF FOR PARENT LINK TO BE .REMOVE()'d
                                if (snapshot[post].url === url) {
                                    // REMOVE POST DATA FROM DB
                                    firebase.database().ref('links/' + post).remove();

                                    // GATHER RELATED METADATA:
                                    let uEmail = localStorage['email'] || firebase.auth().currentUser.email;
                                    let uidNo = localStorage['uid'] || firebase.auth().currentUser.uid;
                                    let delURL = url;

                                    // PUSH EVENT DATA TO DB
                                    firebase.database().ref('deletedposts/').push({
                                        email: uEmail,
                                        url: delURL,
                                        uid: uidNo
                                    });
                                }
                            }
                        });
                    };


                    /* DELETE TARGETED LINK ON 'X' CLICK */
                    $('#dispLinksDiv').delegate('button.xDataDismiss', 'click', function(e) {
                        e.stopPropagation();

                        // FIND THE CORRESPONDING URL TO QUERY:
                        let delMarker = $(this).parent()[0].className.split(" ");
                        let $that = $(this);

                        postAuthor = delMarker[1];
                        delMarker = delMarker[2];
                        curUID = localStorage["uid"] || firebase.auth().currentUser.uid;
                        let userAuthedForPostDel = false;

                        $.getJSON('https://livelinks01125.firebaseio.com/users.json', function(snapshot) {
                            for (let username in snapshot) {
                                if (snapshot[username].uid === curUID) {
                                    if (postAuthor === snapshot[username].user) {
                                        userAuthedForPostDel = true;

                                        break;
                                    }
                                }
                            }

                            if (!userAuthedForPostDel) {
                                $('.deleteRestricted').dialog({
                                    modal: true,
                                    buttons: [{
                                        text: "OK",
                                        click: function() {
                                            $('.deleteRestricted').dialog("close");
                                        },
                                        class: "okBtn"
                                    }]
                                });
                            } else {
                                searchAndDestroy(delMarker);
                                // RUN FB QUERY, .THEN(...) delete and also .hide() associated.
                                $that.parent().css('display', 'none');
                            }
                        });
                    });
                    
                    // END OF GET COMMENTS FUNC GOES HERE
                    
                }); // END HERE -- INNER FUNC
            }); // END HERE -- OUTERMOST FUNC
        }
    }; // END HERE -- populatePageWLinks() WRAPPER

    populatePageWLinks();

    let res;
    let resString;
    let result;
    let uName;


    /* OPEN TARGETED LINK IF AND WHEN POSTED LINK DIV CLICKED UPON: */
    $("#dispLinksDiv").delegate('div', 'click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        let pUrl = $(this).find("a").attr("url");
        pUrl = decodeURIComponent(pUrl);
        window.open(pUrl, '_blank');

        return false;
    });


    /* UNDERLINE ANCHORS ON MOUSEOVER */
    $("#dispLinksDiv").delegate('div', 'mouseenter', function() {
        $(this).find(".divbody").css('text-decoration', 'underline');
    });


    /* REMOVE UNDERLINE ANCHORS ON MOUSELEAVE*/
    $("#dispLinksDiv").delegate('div', 'mouseleave', function() {
        $(this).find(".divbody").css('text-decoration', 'none');
    });

    let eUrl = encodeURIComponent($('#linkUrl').val());
    let lTitle = $('#linkTitle').val();
    let reg;


    /* ADD NEW LIVELINKS POST TO DATABASE/APP */
    $('#submitButton').click(function() {
        if (selectedMenuItem === "") {
            $('#throwDynamicErr').dialog({
                width: 355,
                modal: true,
                title: "Error!",
                open: function() {
                    var markup = '<center><p><span id="unassociatedCatBodyTxt">Please take a moment to associate your post with a category. Choose a selection from the nearby categories button, which is marked with a downward arrow, before attempting to resubmit.</span></p></center>';
                    $(this).html(markup);
                },
                buttons: [ // SUCCESS MESSAGE CONFIRMATION:
                    {
                        text: "OK",
                        click: function() {
                            $('#throwDynamicErr').dialog("close");
                        },
                        class: "okBtn2"
                    }
                ]
            });
        } else {
            if ($('#linkTitle').val().length === 0 || $('#linkUrl').val().length === 0) {
                return false;
            } else {
                let rawJSONList = $.getJSON('https://livelinks01125.firebaseio.com/users.json');
                rawJSONList.done(function(response) {
                    uName = localStorage["user"];
                    eUrl = encodeURIComponent($('#linkUrl').val());
                    lTitle = $('#linkTitle').val();
                    let uidNo = localStorage['uid'] || firebase.auth().currentUser.uid;
                    let userip = localStorage['ip'];
                    let ts = new Date();
                    ts = ts.toString();

                    // ASSIGN PROPER ICON TO RESPECTIVE NEW POST
                    let category = selectedMenuItem;

                    // CLEAN THE "SLATE" OF ANY PRIOR CATEGORY SELECTIONS:
                    selectedMenuItem = "";
                    let icon = "";
                    let cName = "";
                    $('li.ui-menu-item').removeClass('ui-state-active');
                    $('li.ui-menu-item').removeClass('ui-state-disabled');

                    switch (category) {
                        case "Sports":
                            icon = '<i class="fa fa-futbol-o postedLink" title="Sports" aria-hidden="true"></i>';
                            cName = category;
                            break;
                        case "Politics":
                            icon = '<i class="fa fa-university postedLink" title="Political" aria-hidden="true"></i>';
                            cName = category;
                            break;
                        case "Finance":
                            icon = '<i class="fa fa-line-chart postedLink" title="Finance" aria-hidden="true"></i>';
                            cName = category;
                            break;
                        case "Entertainment":
                            icon = '<i class="fa fa-film postedLink" title="Entertainment" aria-hidden="true"></i>';
                            cName = category;
                            break;
                        case "Science":
                            icon = '<i class="fa fa-bar-chart postedLink" title="Science" aria-hidden="true"></i>';
                            cName = category;
                            break;
                        case "Technology":
                            icon = '<i class="fa fa-lightbulb-o biggerIco postedLink" title="Technology" aria-hidden="true"></i>';
                            cName = category;
                            break;
                        case "News":
                            icon = '<i class="fa fa-newspaper-o postedLink" title="News" aria-hidden="true"></i>';
                            cName = category;
                            break;
                        case "Misc.":
                            icon = '<i class="fa fa-asterisk postedLink" title="Miscellaneous" aria-hidden="true"></i>';
                            cName = "Misc";
                            break;
                        default:
                            alert("ERR!");
                            break;
                    }
                    icon = encodeURIComponent(icon);
                    
                    let uniqueID = firebase.database().ref('comments/').push();
                    uniqueID = uniqueID.path.o[1];
                        
                    let zero = 0;
                 // PUSH POST DATA TO FIREBASE DB:
                    firebase.database().ref('links').push({
                        title: lTitle,
                        url: eUrl,
                        uid: uidNo,
                        author: uName,
                        timestamp: ts,
                        ip: userip,
                        category: icon,
                        catName: cName,
                        uniqueID: uniqueID
                    }).then(setTimeout(function() {
                        // AND THEN RECREATE ALL DIVS SEAMLESSLY VIA AJAX:
                        $('#linkDisplayDiv').html("");
                        populatePageWLinks();
                    }, 250));

                    // CLEAN UP INPUTS FOR NEXT:
                    icon = "";
                    $('#linkUrl').val("");
                    $('#linkTitle').val("");
                        
                });
            }
        } // END OF NEW CONTEXT
    });


    let d;
    let dt;

    /* PREVENT CLICK EVT BUBBLING UP WHEN CAT. ICON CLICKED */
    $('#dispLinksDiv').delegate('span.postCatIcon', 'click', function(evt) {
        evt.stopPropagation();
    });


    /* REFRESH BUTTON FUNCTION */
    $('#refreshButton').click(function() {
        $("#linkDisplayDiv").html("")
        populatePageWLinks();
    });

    let menuVisible = false;


    /* TOGGLE MENU BUTTON FUNCTION */
    $('#selectTypeButton').click(function() {
        if (menuVisible !== true) {
            $('#menu').menu();
            $('#menu').css('display', 'block');
            menuVisible = true;
        } else {
            $('#menu').css('display', 'none');
            menuVisible = false;
        }
    });


    /* LOGOUT BUTTON FUNCTION <- SLIDE MENU */
    let logOut = function() {
        setTimeout(function() {
            window.open('http://nyteksf.github.io/LiveLinksApp/loginli.html', '_self');
        }, 250);
    };


    /* BIND ENTER KEY TO SUBMIT LINK BUTTON */
    $('#linkTitle, #linkUrl').keyup(function(evt) {
        if (evt.keyCode === 13) {
            $('#submitButton').click();
        }
    });

    let userName;


    //ON KEYUP INSIDE TEXT BOX, TRIGGER SCAN OF .JSON RECEIVED FOR .USER or .USERNAME IN TEXTBOX:    
    $("#newUsernameInput").keyup(function(evt) {
        let inputLength = $('#newUsernameInput').val().length;
        let input = $('#newUsernameInput').val();
        let uN;
        let alphaNumChars;
        // SCAN INPUT FOR NON-ALPHANUMERIC CHARS
        let regexp = /[^a-z\d:]/gi;
        if (regexp.test(input)) {
            // PREP FIFTH MODAL:
            $('#fifthModal .modal-title').html("Error!");
            $('#fifthModal .modal-body').html("<center>Non-Alphanumeric Character Detected:<br>Valid usernames are limited to use of 'a-z' and '0-9'. Please delete the current character, and try your desired name once again.</center>");
            // LOAD FIFTH MODAL:
            alphaNumChars = false;
            $('#validName').hide();
            $('#invalidName').show();
            $('#fifthModalTrig').click();
        } else {
            alphaNumChars = true;
        }
        if (evt.keyCode === 46 || evt.keyCode === 8) { // HIDE VALIDITY MSG ON DEL/BACKSPACE
            $('#validName').hide();
            $('#invalidName').hide();
        }
        if (inputLength > 0 && inputLength <= 10 && alphaNumChars) {
            username = $.getJSON('https://livelinks01125.firebaseio.com/users.json', function() {
                uN = username.responseJSON;
                for (let obj in uN) {
                    let uNameInput = input.toLowerCase();
                    let existingUName = uN[obj].user;
                    if (uNameInput !== existingUName) {
                        $('#validName').show();
                        $('#invalidName').hide();
                    } else {
                        $('#invalidName').show();
                        $('#validName').hide();
                        break;
                    }
                }
            });
        } else if (inputLength > 10) {
            $('#invalidName').show();
            $('#validName').hide();
        }
    });


    /* SELECT POST CATEFORY FOR SUBMIT POST FUNCTION */
    $('#menu').delegate('li.ui-menu-item', 'click', function() {
        $('li.ui-menu-item').removeClass("ui-state-disabled");
        $('li.ui-menu-item').removeClass("ui-state-active");
        $(this).addClass("ui-state-disabled");
        $(this).addClass("ui-state-active");
        selectedMenuItem = $(this).find('span.menuTxtStyle').text();

        setTimeout(function() {
            $('#menu').css('display', 'none');
            menuVisible = false;
        }, 350);
    });


    /* OFF CANVAS SLIDE MENU BUTTON FUNCTIONALITY */
    $('#smbLogOut').click(function() {
        localStorage["autoLogin"] = false; // DEACTIVATE AUTOLOGIN FEATURE
        firebase.auth().signOut();
        logOut();
    });


    /* CHANGE PASSWORD FUNCTION <- SLIDE MENU */
    $('#smbChgPass').click(function() {
        let email = localStorage['email'] || firebase.auth().currentUser.email;
        let err = false;

        // SEND USER PASSWORD RESET EMAIL
        firebase.auth().sendPasswordResetEmail(email).catch(function(error) {
            if (error) {
                err = true;
                $('#throwDynamicErr').dialog({
                    modal: false,
                    title: error.code,
                    open: function() {
                        var markup = '<center><p><span id="passResetErrTxt">' + error.message + '</span></center>';
                        $(this).html(markup);
                    },
                    buttons: [ //SUCCESS MESSAGE CONFIRMATION:
                        {
                            text: "OK",
                            click: function() {
                                $('#throwDynamicErr').dialog("close");
                            },
                            class: "okBtn"
                        }
                    ]
                });
            }
        }).then(function() {
            if (!err) {
                $('#throwDynamicErr').dialog({
                    modal: false,
                    title: "Password Reset",
                    open: function() {
                        var markup = '<center><span id="emailChgBodyDialog"><br>Please check your primary email account for instructions on resetting your LiveLinks password immediately.</span></center>';
                        $(this).html(markup);
                    },
                    buttons: [ //SUCCESS MESSAGE CONFIRMATION:
                        {
                            text: "OK",
                            click: function() {
                                checkPanelState();
                                $('#throwDynamicErr').dialog("close");
                            },
                            class: "okBtn"
                        }
                    ]
                });
            }
        });
    });


    /* VALIDATE USER EMAIL FUNCTION */
    let validateEmail = function(email) {
        let atPos = email.indexOf("@");
        let dotPos = email.lastIndexOf(".");
        if (atPos < 1 || dotPos < atPos + 2 || dotPos + 2 >= email.length) {
            $('#throwDynamicErr').dialog({
                modal: false,
                title: "Invalid Email",
                open: function() {
                    var markup = '<center><p><span id="invalidEmailErrBody">The email address is badly formatted. Please check and try again.</span></p></center>';
                    $(this).html(markup);
                },
                buttons: [ //SUCCESS MESSAGE CONFIRMATION:
                    {
                        text: "OK",
                        click: function() {
                            $('#throwDynamicErr').dialog("close");
                        },
                        class: "okBtn"
                    }
                ]
            });

            return false;
        } else {

            return true;
        }
    };


    /* DEACTIVATE USER ACCOUNT */
    $('#smbDeactivate').click(function() {
        $('#confirmDeleteDialog').show();
        // POP JQUERY UI DIALOG TO REQUEST DEACTIVATION CONFIRMATION:
        $('#confirmDeleteDialog').dialog({
            width: 350,
            modal: true,
            buttons: [{
                text: "Cancel",
                click: function() {
                    $('#confirmDeleteDialog').dialog("close");
                    checkPanelState();
                }
            }, {
                text: "OK",
                click: function() { // DELETE THE ASSOCIATED ACCOUNT(S):
                    // GATHERING INFO:
                    let providersArray = firebase.auth().currentUser.providerData;
                    let provNames = [];
                    for (let x = 0; x < providersArray.length; x++) {
                        provNames.push(providersArray[x].providerId);
                    }
                    let providerCount = provNames.length;
                    // DELETE LINKED ACCOUNTS FROM FIREBASE:
                    // (MUST USE RECURSION TO AVOID OVERWRITING MULTIPLE ASYNC COMMANDS)
                    function start(counter) {
                        if (counter < providerCount) {
                            setTimeout(function() {
                                let cur = provNames[counter];
                                counter++;
                                start(counter);
                            }, 1200);
                        }
                    }
                    start(0);

                    // CLOSE THE DIALOG WINDOW & RESTORE UI:
                    $('#confirmDeleteDialog').dialog("close");

                    checkPanelState(); // IS MENU OPEN? THEN CLOSE IF SO.

                    document.cookie = "returnVisitor=false"; // <=DONE SO MAIN PAGE SHOWS GREETING FOR NEW USER

                    setTimeout(function() {
                        window.location.href = "http://nyteksf.github.io/index.html";
                    }, 1000);
                }
            }]
        });
    });


    /* CHANGE PRIMARY EMAIL FOR USER ACCOUNT */
    $('#smbChgEmail').click(function() {
        let currentUID = localStorage['uid'] || firebase.auth().currentUser.uid;
        let currentEmail = localStorage['email'] || firebase.auth().currentUser.email;

        // SET CURRENT EMAIL AS BASE:
        firebase.database().ref('userEmails/' + currentUID).update({
            currentEmail: currentEmail
        }).catch(function(error) {
            alert("Critical error while updating base email in database. Stand by for error info.");
            alert(error.code + "\n" + error.message);
        });

        $('#curEmailDispBox').html("<span id='curEmailTxt'>" + currentEmail + "</span>");
        let err;
        let errMsg;


        let hoverTracker = function() {
            console.log("This function is used primarily for sake of control flow. It leverages the function prototype as storage.");
        };

        $('#changeEmail').dialog({
            modal: true,
            buttons: [{
                text: "Cancel",
                click: function() {
                    $('#changeEmail').dialog("close");
                    $('input#newEmailInput').val("");
                    checkPanelState();
                },
                class: "chgEmailBtnCancel"
            }, {
                text: "Submit",
                click: function() {
                    let $newEmail = $('input#newEmailInput').val();
                    if ($newEmail !== null && $newEmail) {
                        let validatedEmail = validateEmail($newEmail);
                        if (validatedEmail) {
                            //CHANGE EMAIL TO THE FOLLOWING:
                            //store current email on modal load.
                            //if change current email, then email2 is set to current email.
                            //new email is set to email via firebase.auth()
                            firebase.auth().currentUser.updateEmail($newEmail).catch(function(error) {
                                err = true;
                                errMsg = error;
                                $('#throwDynamicErr').dialog({
                                    modal: true,
                                    title: error.code,
                                    open: function() {
                                        $(this).html("<center><p><span id='genErrDialogBody'>Error! " + error.message + "</span></p></center>");
                                    },
                                    buttons: [{
                                        text: "OK",
                                        click: function() {
                                            $('#throwDynamicErr').dialog("close");
                                        },
                                        class: "okBtn"
                                    }]
                                });
                            });
                            if (err) {
                                return false;
                            } else {
                                let err0r = false;
                                $.getJSON('https://livelinks01125.firebaseio.com/userEmails/' + currentUID + '.json', function(userEmails) {
                                    let emailAddyCounter = 1;
                                    for (let email in userEmails) {
                                        emailAddyCounter++; //COUNT EXISTING EMAILS
                                    }
                                    // STORE OLD EMAIL IN UNIQUE VAR:
                                    // $newEmail automatically reset to first slot in DB Child
                                    let addEmail = constructJson("email" + emailAddyCounter, currentEmail);

                                    localStorage["email"] = $('input#newEmailInput').val();

                                    firebase.database().ref('userEmails/' + currentUID).update(addEmail).catch(function(error) {
                                        if (error) {
                                            err0r = true;
                                            $('throwDynamicErr').dialog({
                                                modal: true,
                                                title: error.code,
                                                open: function() {
                                                    $(this).html(error.message);
                                                },
                                                buttons: [{
                                                    text: "OK",
                                                    click: function() {
                                                        $('#throwDynamicErr').dialog("close");
                                                    },
                                                    class: "okBtn"
                                                }]
                                            });
                                        }
                                    });
                                    if (!err0r) {
                                        setTimeout(function() {
                                            $('#throwDynamicErr').dialog({
                                                modal: false,
                                                title: "Success!",
                                                open: function() {
                                                    var markup = '<center><p>Email Successfully Changed!</p></center>';
                                                    $(this).html(markup);
                                                },
                                                buttons: [ // SUCCESS MESSAGE CONFIRMATION:
                                                    {
                                                        text: "OK",
                                                        click: function() {
                                                            $('#throwDynamicErr').dialog("close");
                                                        },
                                                        class: "okBtn"
                                                    }
                                                ]
                                            });
                                        }, 450);
                                    }
                                });
                            }
                            // CLEAN UP ON SUBMIT/EXIT
                            $('input#newEmailInput').val("");
                            $('#changeEmail').dialog("close");
                            checkPanelState();
                        } else {

                            // EXIT. USER FAILED TO ENTER EMAIL ADDRESS W/ VALID FORMAT.
                            // ERROR HAS NOW BEEN LOADED ELSEWHERE & JUST PRIOR.
                            return false;
                        }
                    } else {
                        $('#invalidFormInput').dialog({
                            modal: false,
                            buttons: [{
                                text: "OK",
                                click: function() {
                                    $('#invalidFormInput').dialog("close");
                                },
                                class: "okBtn"
                            }]
                        });
                    }
                },
                class: "addChgUNameBtn"
            }]
        });
    });


    /* DISPLAY INFO ABOUT THE AUTHOR (NYTEKSF) <- SLIDE MENU BUTTON */
    $('#smbAbout').click(function() {
        $('#smbAboutDialog').dialog({
            width: 700,
            modal: true,
            buttons: [{
                text: "OK",
                click: function() {
                    $('#smbAboutDialog').dialog("close");
                },
                class: "okBtnLg"
            }]
        });
    });


    /* SET NEW USERNAME FUNCTION */
    let setNewUName = function(uidNo, uName, exists) {
        if (exists) {
            firebase.database().ref("users/" + uidNo).update({
                user: uName
            });
        } else {
            firebase.database().ref("users/" + uidNo).set({
                user: uName,
                uid: uidNo
            });
        }
        localStorage["user"] = uName;
    };

    $('#dialog').hide();
    let ircNick = "";


    /* CHANGE USERNAME FUNCTION <- SLIDE MENU */
    $('#smbXtra').click(function() {
        let regexp = /[^a-z\d:]/gi;
        let uidNo = localStorage['uid'] || firebase.auth().currentUser.uid;
        $('#curUsername').text(localStorage["user"]);

        $('#dialog').dialog({ // LOAD CHANGE USERNAME DIALOG
            height: 260,
            modal: true,
            buttons: [{
                text: "Cancel",
                click: function() {
                    $('#dialog').dialog("close");
                    checkPanelState();
                    $('#validName').hide();
                    $('#invalidName').hide();
                    $('#newUsernameInput').val("");
                },
                class: "cancelDialogBtn"
            }, {
                text: "Submit",
                click: function() {
                    let $input = $('#newUsernameInput').val();
                    if ($('#newUsernameInput').val().length >= 1 && $('#newUsernameInput').val().length <= 10) {
                        if (regexp.test($input)) {
                            // TRIGGER NON-ALPHANUM DIALOG
                            $('#throwDynamicErr').dialog({
                                modal: false,
                                open: function() {
                                    alert("Non-Alphanumeric Keypress Detected! Try again.");

                                    var markup = "<center><p><span id='nonAlphanumErr'>Non-Alphanumeric Keypress Detected!<br>Usernames must be comprised of letters ('A-Z') and numbers ('0-9') only.</span></p></center>";
                                    $(this).html(markup);
                                },
                                buttons: [{
                                    text: "OK",
                                    click: function() {
                                        $('#throwDynamicErr').dialog("close");
                                    },
                                    class: "okBtn"
                                }]
                            });

                            return false;
                        } else {
                            $('#curUsername').text('' + $('#newUsernameInput').val());
                            $('#validName').hide();
                            $('#invalidName').hide();
                            let newUName = $('#newUsernameInput').val();
                            setNewUName(uidNo, newUName, userRegistered);
                            $('#newUsernameInput').val("");

                            setTimeout(function() {
                                $('#dialog').dialog("close");
                                checkPanelState();
                            }, 750);
                        }
                    } else {
                        $('#emptyFieldDialog').show();
                        $('#emptyFieldDialog').dialog({
                            modal: false,
                            buttons: [{
                                text: "OK",
                                click: function() {
                                    $('#emptyFieldDialog').dialog("close");
                                },
                                class: "okBtn"
                            }]
                        });
                    }
                },
                class: "addChgUNameBtn"
            }]
        });

        // ASSUME BELOW
        userRegistered = true;
        $('#curUsername').removeClass('redErrorTxt');

        $('#dialog').show();
        $('#dialog').dialog();
    });


    /* FUNCTION TO TOGGLE SHOWING ONLY OF INDIVIDUAL USER POSTS */
    let showHidePosts = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        let cn = $(this).parent()[0].className.split(" ");
        let targetPosts = cn[1];

        if (showHidePosts.prototype.hidden) {
            showHidePosts.prototype.hidden = false;
            $('.linkoutputdiv').not("." + targetPosts).show(); // SHOW ONLY POSTS BY SELECTED USER
        } else {
            showHidePosts.prototype.hidden = true;
            $('.linkoutputdiv').not("." + targetPosts).hide(); // OR HIDE ALL POSTS NOT BY SELECTED USER
        }
    };


    /* BINDS showHidePosts() TO DOM VIA "POSTED BY" ANCHOR IN EACH LINK */
    $('div#dispLinksDiv').delegate('span#newPostAuthor', 'click', showHidePosts);

    let hideMenu;


    /* IF MOUSELEAVE POST LIKE ICON, AND THEN MOUSEOVER AGAIN, CANCEL ASSOCIATED TIMER FOR CLOSING IT */
    $('.scotch-panel-canvas').delegate('ul#menu', 'mouseenter', function() {
        clearTimeout(hideMenu);
    });


    /* BTN TOGGLE SEARCH FUNCTION */
    $("#btn-ToggleSearch").click(e => {
        e.preventDefault();
        e.stopPropagation();

        $("#btn-ToggleSearch").hide(); // HIDE TOGGLE SEARCH BUTTON
        $(".input-group").css("visibility", "visible"); // MAKE INPUT GROUP VISIBLE
    });


    /* HIDE OPENED SEARCH DIV */
    $("#btn-XCloseSearch").click(e => {
        e.preventDefault();
        e.stopPropagation();

        $("#input-Search").val(""); // WIPE EXISTING INPUT
        $("#searchTypeDropdown").val("Choose Type:") // RESET DROPDOWN
        $("#btn-ToggleSearch").show(); // SHOW TOGGLE SEARCH BUTTON AGAIN
        $(".input-group").css("visibility", "hidden"); // HIDE THE INPUT GROUP
    });


    /* ADD "SEARCH BY NAME, TITLE, SUBJECT OR AUTHOR" FUNCTION */
    let searchLiveLinks = (searchVal, searchType) => {
        let result = {};

        // FORMAT CATNAME -> CASE INSENSITIVE INPUT FOR CATEGORY SEARCH TERMS    
        if (searchType === "catName") {
            let firstLetter = searchVal.slice(0, 1);
            let remainingWord = searchVal.slice(1)
            searchVal = firstLetter.toUpperCase() + remainingWord;
        }

        let $resArr = $.getJSON('https://livelinks01125.firebaseio.com/links.json');
        $resArr.done((resTxt) => {
            if (searchType === "title") { // SEE IF TITLE CONTAINS 'X' 
                let regExp = RegExp(searchVal, 'gi');
                for (let keyName in resTxt) {
                    let titleOutput = resTxt[keyName].title;
                    if (regExp.test(titleOutput)) {
                        result[keyName] = resTxt[keyName];
                    }
                }
            } else {
                for (let key in resTxt) {
                    if (resTxt[key][searchType] === searchVal) {
                        result[key] = resTxt[key];
                    }
                }
            }

            return result;
        }).done(() => {
            populatePageWLinks(result);
        });
    };

    
    $("#btn-SubmitSearch").click(e => {
        e.preventDefault();
        e.stopPropagation();

        // BLOCK USER FROM QUERYING WITHOUT SETTING SEARCH TYPE
        if ($("#searchTypeDropdown").val() === "Choose Type:") {
            $('#throwDynamicErr').dialog({
                width: 355,
                modal: true,
                title: "Error!",
                open: function() {
                    var markup = '<center><p><strong><span id="unassociatedCatBodyTxt">Please select a valid type from the dropdown menu and try your search again.</strong></span></p></center>';
                    $(this).html(markup);
                },
                buttons: [ // SUCCESS MESSAGE CONFIRMATION
                    {
                        text: "OK",
                        click: function() {
                            $('#throwDynamicErr').dialog("close");
                        },
                        class: "okBtn2"
                    }
                ]
            });

            return false;
        }

        // GATHER SEARCH INPUT VALUES
        let searchVal = $("#input-Search").val();
        let searchType = $("#searchTypeDropdown").val();

        // SEARCH LIVE LINKS FOR MATCHING RESULTS
        searchLiveLinks(searchVal, searchType); // -> E.g., searchLiveLinks("nyteksf","Author")
    });


    /* ADD DROPDOWN FOR USER TO SELECT SEARCH TYPE */
    $(() => {
        $("#searchType").selectmenu();
    });


    // USE THIS TO SELECT WHICH ITEMS ARE DISPLAYED IN AUTOCOMPLETE DROPDOWN LIST
    $("#searchTypeDropdown").change(function() {
        let selected = $(this).children(":selected").text();

        switch (selected) {
            case "Author": // CREATE DROPDOWN OF AUTHOR NAMES
                let availableAuthors = [];

                let uNameList = $.getJSON('https://livelinks01125.firebaseio.com/users.json');

                uNameList.done(uNames => {
                    uNames.responseJSON;

                    for (let name in uNames) {
                        availableAuthors.push(uNames[name].user);
                    }
                });

                $("#input-Search").autocomplete({
                    source: availableAuthors
                });
                
                break;
                
            case "Category":
                const categories = [
                    "Entertainment",
                    "Miscellaneous",
                    "Sports",
                    "Politics",
                    "Finance",
                    "Science",
                    "Technology",
                    "News",
                    "Misc."
                ];

                $("#input-Search").autocomplete({
                    source: categories
                });
                
                break;
                
            case "Choose Type:": // DO NOOP      
            case "Title Contains": // DO NOOP
            default:
                
                break;
                
        }
    });


    // ADD FUNCTION FOR A BACK BUTTON
    $(".back").click(function() {
        parent.history.back();
        
        return false;
    });
    
    
    // HIDE ADD COMMENTS MODAL
    $("#dialog-form").attr("style", "visibility: hidden;")
    
    
    // PREVENT CLICKS ON DIALOG-FORM FROM CLOSING DIALOG-FORM
    $("#dialog-form").click(e => {
        e.stopPropagation();
    });
    
    
    /* CLOSE 'ADD A COMMENT' DIV WHEN CLICK OUTSIDE BOX */
    $(window).click(function() {
        // Hide the menus if visible
        range = 5;  // RESET RANGE FOR "PREV COMMENTS" FUNC
        $("#dialog-form").attr("style", "visibility: hidden;");
    
        // WIPE COMMENT BOX OF DATA 
        $(".input-comment").val("");
        $("#div-comment-output").html("");
        $(".linkOutputDiv").css("background-color", "#FFFFFF");
        
        // RESTORE ELS BACK TO PRIOR STATE
        $(".linkOutputDiv").css("border-left", "1px solid #333333");
        $(".input-comment").removeClass("stretch-Input-Comment");
        $(".modalSubmit").removeClass("stretch-Btn-SubmitModal");
    });
    
    
    /* MODAL BUTTON: SUBMIT COMMENT */
    $("button.modalSubmit").click(e => {
        e.preventDefault();
        e.stopPropagation();
        
        if ($("#div-comment-output").html() === '<div class="noCommentsTxt">No comments yet. Be the first.</div><br><br>') {
            $("#div-comment-output").html("");
        }
        
        let $inputCommentStr = $(".input-comment").val();
        let $inputLength = $(".input-comment").val().split("").length;
        
        if ($inputLength > 0 && $inputLength <= 255) {
            // SUBMIT COMMENT TO DB
            let n = localStorage["user"];
            let u = firebase.auth().currentUser.uid || localStorage["uid"];
            let thisDate = new Date();
            thisDate = thisDate.toString();
            let uniqueID = firebase.database().ref('comments/').push();
            uniqueID = uniqueID.path.o[1];
            
            let objArr = [];
            let objArrLen;
            let thisCommentCount = 0;
            let postID = localStorage["parentID"];
            
            // PUSH COMMENT TO DB
            firebase.database().ref('comments').push({
                // GATHER/ASSIGN BELOW DATA! 
                author: n,
                uid: u,
                uniqueID: uniqueID,
                comment: $inputCommentStr,
                timestamp: thisDate,
                ip: localStorage["ip"],
                postID: postID
            }).then(setTimeout(() => {
                $(".input-comment").val("");  // WIPE LAST COMMENT
                //$('#linkDisplayDiv').html("");
                //populatePageWLinks();
            }, 250));
                        
            $(".input-comment").val("");  // CLEAR INPUT TEXT COMMENT
            
            // PREPEND LAST COMMENT TO DOM SEAMLESSLY
            $("#div-comment-output").prepend("<div class='postedComment'>" + n + " - " + $inputCommentStr + " &middot; <span class='timestamp'><small>" + moment(d).fromNow() + "</small></span><button class='btn-xclose-modal__del-comment'><i id='" + uniqueID + "' class='fa fa-times-circle-o'></i></button></div><br/><br/><br/>");
            
            // UPDATE LINK COMMENT COUNT IN DB
            let parentID = localStorage["parentID"],
                lastClassName = localStorage["lastClassName"],
                comment;
               
            // ADD GET COMMENT COUNT TO LINK PROPER HERE
            function countComments() {
                let commentCount = 0;
                return firebase.database().ref("comments").orderByChild("postID").equalTo(postID).once('value').then(function(snapshot) {
                    snapshot.forEach(comment => {   
                        commentCount++;      
                    });
                    
                    return commentCount;
                });
            }
            let commentsPromise = countComments();
           
            commentsPromise.then(commentCount => { 
                // REMOVE CURRENT COMMENT COUNT FROM DOM 
                $(postID).find("sup").text(commentCount);
           firebase.database().ref('links').orderByChild('uniqueID').equalTo(lastClassName).on("value", function(snapshot) {
                    snapshot.forEach(function(parent) {
                        let postKey = parent.key;
                        console.log("postKey ->" + postKey)
                        firebase.database().ref().child("links").child(postKey).child("commentCount").set(commentCount);  
                    });
                }); 
            });
            
            // UPDATE COMMENT COUNT IN DOM
            // $("").text() // OR RELOAD THE PAGE populatePageWLinks();
            
            return true;
        } else {
            // TRIGGER DYNAMIC MODAL
            $('#throwDynamicErr').dialog({
                width: 355,
                modal: true,
                title: "Warning!",
                open: function() {
                    var markup = '<center><p><strong><span id="unassociatedCatBodyTxt">Comment length is limited to a minimum of 1 and a maximum of 255 characters. Your attempt was ' + $inputLength + ' characters long. Please try again.</strong></span></p></center>';
                    $(this).html(markup);  // LOAD ABOVE
                },
                buttons: [ // PROVIDE SUCCESS MESSAGE CONFIRMATION
                    {
                        text: "OK",
                        click: function() {
                           $('#throwDynamicErr').dialog("close");  // HIDE COMMENT BOX
                        },
                        class: "okBtn2"
                    }
                ]
            });
            range = 5;  // RESET RANGE FOR "PREV COMMENTS" FUNC
            
            return false;
        }
    });
        
    let theThing = document.querySelector("#dialog-form");
    let container = document.querySelector(".scotch-panel-wrapper");
    let posX, posY;
    
    
    // GATHER COORDS FOR THIS ICON & MOVE DIALOG FORM THEREUNTO
    function moveDialog(child) {
        if (!$(".postedLink").height() && !$(".dialog-form").height()) {
            window.requestAnimationFrame(moveDialog);
            console.log("loading...")
        } else {
            let parent = $('#dispLinksDiv');

            let posY = $(child).offset().top - parent.offset().top;
            
            $("#dialog-form").css("top", posY+"px"); 
        }
    };
    
    /* DELAY EXECUTION OF CSS/JS UNTIL DOM NODE LOADED */
    function waitForElement(elementPath, targetLoc){
        window.setTimeout(() => {
            if($(elementPath).length){
                moveDialog(targetLoc)
            } else {
                waitForElement(elementPath, targetLoc);
            }
        }, 250)
    }
    
    
    /* ADD A COMMENT TO CURRENT POST AS AUTH'D USER */
    $('#dispLinksDiv').delegate('.ico-comment', 'click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // BECAUSE ADDING COMMENTS COMES NEXT, LOAD INTO MEMORY
        // COULD ALSO STORE GLOBALLY AND CALL MODALSUBMIT WITH THAT VAL
        localStorage["lastClassName"] = $(this).parent().parent()[0].className.split(" ")[5];

        // REFRESH UI CHARCOUNTER TO DEFAULT POST LENGTH LIMIT
        $("span#charCountDisp").text("255");
        
        // EXECUTE PREMPTIVE DATA WIPE/UI RESET
        $(".linkOutputDiv").css("background-color", "#FFFFFF");
        $(".linkOutputDiv").css("border-left", "1px solid #333333");
        
        // GRAB CURRENT SELECTED PARENT DIV
        let $parentDiv = $(this).parent().parent();
        
        let parentID = "#"+$parentDiv[0].id;
        localStorage["parentID"] = parentID;
        
        // MOVE DIALOG ABOVE CLICKED DIV
        waitForElement("#dialog-form", parentID);
        
        // MOVE FORM DIALOG TO POSITION OF CURRENT CLICKED POST
        $("#dialog-form").css("position", "element(" + $parentDiv + ")");
        $("#dialog-form").css("transform", "translateY(-100%)");
        
        // VISUALLY MARK WHICH DIV IS BEING COMMENTED UPON FOR USER
        $(parentID).css("background-color", "#D7D7D7");
        $(parentID).css("border-left", "4px solid #333333");
        
        let $commentList;
        let commentCounter = 0;

        // LET USER KNOW COMMENTS ARE LOADING
        $("#div-comment-output").append("<span style='padding-left:3px;'><strong>Loading...</strong></span><br/>");        
        
        // POPULATE COMMENT BOX DYNAMICALLY WITH COMMENTS
        $commentList = $.getJSON('https://livelinks01125.firebaseio.com/comments.json');
      
        $commentList.done(function(comments) {
            let comment; 
            
            $("#div-comment-output").html("");  // ON LOAD CLEAN OUTPUT DIV OF ANY OLD COMMENTS FIRST
            
            let resArr = [];
            
            // FORCE OBJECT INTO ARRAY FORM
            for (comment in comments) {
                resArr.push(comments[comment]);
            }

            // REVERSE ORDER OF NEW COMMENT ARRAY
            resArr = resArr.reverse();
  
            // ALSO ADD TIME STAMP TO POSTS!!!
            let commentFound = false;
            
            let commentArray = [];
            
            resArr.forEach((link) => {
                let thisComment = comments[comment];
                let curUID = firebase.auth().currentUser.uid || localStorage["uid"];

                if (link.postID === localStorage["parentID"]) {  // Is our cur post ID same as the one found via click event just now?
                    commentFound = true;
                    commentArray.push(link);         
                }
            });
            
            if (!commentFound) {
                $("#div-comment-output").append("<div class='noCommentsTxt'>No comments yet. Be the first.</div><br/><br/>");
                    
                return false;
            } else {  // COMMENT(S) FOUND FOR CURRENT POST
                let last5Comments = 5;

                // ADD PAGINATION: FIND OUT HOW MANY INDIVIDUAL PAGES OF 5 COMMENTS TO CREATE
                let pagesToGenerate = Math.ceil(commentArray.length / 5);
                localStorage["pagesToGenerate"] = pagesToGenerate;
                    
                if (pagesToGenerate > 1) { 
                    // SHOW "Prev Comments..." ANCHOR
                    $("#a-prev-comments").show();
                    
                    // LAZY-LOAD FIRST FIVE POSTS ONLY
                    if (last5Comments > 0) {
                        for (let i = 4; i >= 0; i--) {
                            // IF THE LOGGED IN USER OWNS POST ->
                            if (firebase.auth().currentUser.uid === commentArray[i].uid) {   
                                // LOAD THIS COMMENT WITH BTN-XCLOSE
                                $("#div-comment-output").prepend("<div class='postedComment'>" + commentArray[i].author + " - " + commentArray[i].comment + " &middot; <span class='timestamp'><small>" + moment(commentArray[i].timestamp).fromNow() + "</small></span><button id='" + commentArray[i].uniqueID + "' class='btn-xclose-modal__del-comment'><i class='fa fa-times-circle-o'></i></button></div><br/><br/><br/>");
                            } else {  // LOAD NON-CLOSABLE VERSION OF COMMENT
                                $("#div-comment-output").prepend("<div class='postedComment'>" + commentArray[i].author + " - " + commentArray[i].comment + " &middot; <span class='timestamp'><small>" + moment(commentArray[i].timestamp).fromNow() + "</small></span></div><br/><br/><br/>");
                            }
                        }
                    } else {
                        
                        // NOOP
                        return false;
                    }
                } else {
                    // HIDE "PREV COMMENTS" ANCHOR IF NOT MORE THAN 5 COMMENTS YET...
                    $("#a-prev-comments").hide();
                    
                    commentArray = commentArray.reverse();
                    
                    commentArray.forEach((post) => {        
                        // IF THE LOGGED IN USER OWNS POST ->
                        if (firebase.auth().currentUser.uid === post.uid) {   
                            // LOAD THIS COMMENT WITH BTN-XCLOSE
                            $("#div-comment-output").prepend("<div class='postedComment'>" + post.author + " - " + post.comment + " &middot; <span class='timestamp'><small>" + moment(post.timestamp).fromNow() + "</small></span><button id='" + post.uniqueID + "' class='btn-xclose-modal__del-comment'><i class='fa fa-times-circle-o'></i></button></div><br/><br/><br/>");
                        } else {  // LOAD NON-CLOSABLE VERSION OF COMMENT
                            $("#div-comment-output").prepend("<div class='postedComment'>" + post.author + " - " + post.comment + " &middot; <span class='timestamp'><small>" + moment(post.timestamp).fromNow() + "</small></span></div><br/><br/><br/>");
                        }
                                
                    }); 
                }

                return true;
            }
        });
        $("#dialog-form").attr("style", "visibility: visible;");
        
    });
    

    let commentList;
    
    // ADD EVENT LISTENERS TO COMMENTS XCLOSE BTN ALLOW DISMISSAL
    $("#div-comment-output").delegate(".btn-xclose-modal__del-comment", "click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // GET ID OF THIS COMMENT
        let $commentID = $(this)[0].id;  // UNIQUE ID FOR COMMENT
        let className = localStorage["lastClassName"];  // UNIQUE ID FOR (PARENT) POST
        let parentID = localStorage["parentID"];
        
        // REMOVE COMMENT FROM DOM
        $(this).parent().remove();
        firebase.database().ref('comments').orderByChild('uniqueID').equalTo($commentID).on("value", function(snapshot) {
            snapshot.forEach(function(parent) {
                let postKey = parent.key;
                    firebase.database().ref("comments/"+postKey).remove();
                }); 
            });
        
   
            // REMOVE 1 FROM COMMENT COUNT HERE
            $nameList = $.getJSON('https://livelinks01125.firebaseio.com/comments.json');
    
            $nameList.done(function(comments) {
                let comment;
                let commentCounter = 0;

                for (comment in comments) {
                    if (comments[comment].postID === parentID) {
                        commentCounter++;
                    };
                }
                // REMOVE CURRENT COMMENT FROM DB
                commentCounter = commentCounter - 1;
                
                firebase.database().ref('links').orderByChild('uniqueID').equalTo(className).on("value", function(snapshot) {
                    snapshot.forEach(function(parent) {
                        let postKey = parent.key;
                        firebase.database().ref().child("links").child(postKey).child("commentCount").set(commentCounter);  
                    });
                });
                
                // REMOVE CURRENT COMMENT COUNT FROM DOM 
                $(parentID).find("sup").text(commentCounter);
                
                setTimeout(() => {
                    if (commentCounter === 0) {
                        populatePageWLinks();  // HIDE 0 COMMENT COUNT
                    }
                }, 350);        
                
                
            })  // END NAMELIST.DONE
    });
    
        
    
    
    /* WHEN CLICK COMMENT INPUT, ADD FOLLOWING TRANSITIONS */
    $(".input-comment").focus(() => {
        $(".input-comment").addClass("stretch-Input-Comment");
        $(".modalSubmit").addClass("stretch-Btn-SubmitModal");
    });
    
    
    let commentCharLimit = 255;
    
    /* PROVIDE USER FEEDBACK ABOUT CHARACTER LIMIT FOR COMMENTS */
    $(".input-comment").bind("input", () => {
        let $charCount = $(".input-comment").val().split("").length;    
        
        let remainingChars = commentCharLimit - $charCount;
        
        // HANDLE DISP TXT OUTPUT, COLOR AND BUTTON ENABLE/DISABLE
        if (remainingChars === 0) {
            $(".modalSubmit").attr("disabled","true");
            $(".input-comment").css("border","1px solid red");
            $("#charCountWrapper").css("color","red");  // ERROR!
            $(".input-comment").blur();
        } else if (remainingChars > 0 && remainingChars <= 15) {
            $("#charCountWrapper").css("color","darkred");  // WARN USER
            $(".modalSubmit").removeAttr("disabled");
        } else {
            $(".input-comment").css("border", "1px solid #333333");  
            $("#charCountWrapper").css("color","#333333");  // RESTORE NORMAL COLOR OF DISP TXT
        }
        $("#charCountDisp").html(remainingChars);
        
        return;
    });
    
    
    let range = 5;  // INITIAL VALUE FOR ARRAY.SLICE()
    let objDiv;
    
    /* PROVIDE MORE COMMENTS ONCLICK IF POSSIBLE */
    $("a#a-prev-comments").click(e => {
        e.preventDefault();
        
        // POPULATE COMMENT BOX DYNAMICALLY WITH COMMENTS
        $nameList = $.getJSON('https://livelinks01125.firebaseio.com/comments.json');
      
        $nameList.done(function(comments) {
            let comment; 
            
            $("#div-comment-output").html("");  // ON LOAD CLEAN OUTPUT DIV OF ANY OLD COMMENTS FIRST
            
            let allCommentsArray  = [];
            let thisPostsComments = [];
            
            let pagesToGenerate = localStorage["pagesToGenerate"];
            
            // FORCE OBJECT INTO ARRAY OF OBJECTS FORMAT
            for (comment in comments) {
                allCommentsArray.push(comments[comment]);
            }

            // REVERSE ORDER OF NEW COMMENT ARRAY
            allCommentsArray = allCommentsArray.reverse();
            
            // FILTER ONLY COMMENTS RELATED TO CURRENT POST
            thisPostsComments = allCommentsArray.filter((comment) => comment.postID === localStorage["parentID"]);   
            
            let updatedOutput;
            
            if (pagesToGenerate >= 1) {
                range += 5;
                
                pagesToGenerate--;
                localStorage["pagesToGenerate"] = pagesToGenerate;
                
                updatedOutput = thisPostsComments.slice(0, range);
            }
            
            // METE OUT FIVE MORE COMMENTS PER CLICK
            if (pagesToGenerate === 1) {
                $("a#a-prev-comments").css("display","none");
            }
            
            updatedOutput.forEach(post => {
                if (firebase.auth().currentUser.uid === post.uid) {   
                    // LOAD THIS COMMENT WITH BTN-XCLOSE
                    $("#div-comment-output").append("<div class='postedComment'>" + post.author + " - " + post.comment + " &middot; <span class='timestamp'><small>" + moment(post.timestamp).fromNow() + "</small></span><button id='" + post.uniqueID + "' class='btn-xclose-modal__del-comment'><i class='fa fa-times-circle-o'></i></button></div><br/><br/><br/>");
                } else {  // LOAD NON-CLOSABLE VERSION OF COMMENT
                    $("#div-comment-output").append("<div class='postedComment'>" + post.author + " - " + post.comment + " &middot; <span class='timestamp'><small>" + moment(timestamp).fromNow() + "</small></span></div><br/><br/><br/>");
                }
            });
            // AUTOMATICALLY SCROLL DOWN TO NOW LOADED PREV COMMENTS
            objDiv = document.getElementById("div-comment-output");
            objDiv.scrollTop = objDiv.scrollHeight;
            
        });
    });
    
    
    /* ADD ALPHABETICAL USER SEARCH OPTION
    let nameList, user;
        let uNameArray = [];
        let commentCounter = 0;

        //E.g. Usernames: $("#div-comment-output").append("<span class='div-comment-output__span' style='margin-bottom: 15px !important;'>Test Dump: <strong>SELECT user FROM usernames</strong> =></span><br/>");
        
        nameList = $.getJSON('https://livelinks01125.firebaseio.com/users.json');
      
        nameList.done(function(list) {
            list.sort(function(a,b) {
                return a.user < b.user;
            });

            for (user in list) {
                commentCounter++;
                uNameArray.push(list[user].user);
            }
            uNameArray.forEach((username) => {
                console.log(username);
                 
                // $("#div-comment-output").append("<span class='div-comment-output__span'>" + username + "</span><br/>");
            });        
        });
    */

    
}); // END OF ONLOAD
