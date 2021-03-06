let curUser;
let selectedMenuItem = "";
let uNameFound = false;

$('#firebase-ico').click(function(evt) {
  evt.stopPropagation();
  window.open('http://www.firebase.com/','_blank');
});


//-=-SUMMARY OF FUNCTION:-=-
//ENSURES NO MISFIRE RE-OPENINGS OF SLIDE PANEL DUE TO INITIAL 
//AUTO OPEN-CLOSE SEQUENCE ON LOAD
//INSTEAD OF USING NORMAL DUMB .CLICK() ACTION FOR TOGGLE
function checkPanelState() {
  if(menuToggleStatus.prototype.menuPanelState === "opened") { // Close SP as normal w/ toggle:
    $('#offscreenMenuIco').click();

    return true;
  } else { // OR DO NOTHING IF SP ALREADY CLOSED FOR CURRENT TOGGLE EVENT:

    return false;
  }
}


//SETS SLIDE MENU STATUS FOR SM BUTTON FUNCTION INTERFACE
function menuToggleStatus() {
  if(menuToggleStatus.prototype.menuPanelState !== "opened") {
    menuToggleStatus.prototype.menuPanelState = "opened";
  } else {
    menuToggleStatus.prototype.menuPanelState = "closed";
  }
}


let toggleMenuPanel = $('#togglePanel').scotchPanel({
  containerSelector: 'body', // Make this appear on the entire screen
  direction: 'left', // Make it toggle in from the left
  duration: 450, // Speed in ms how fast you want it to be
  transition: 'ease-out', // CSS3 transition type: linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(P1x,P1y,P2x,P2y)
  clickSelector: '.toggle-panel', // Enables toggling when clicking elements of this class
  distanceX: '129px', // Size of the toggle
  enableEscapeKey: true // Clicking Esc will close the panel
});


let constructJson = function(jsonKey, val) {
  let jsonObj = {};
  jsonObj[jsonKey] = val;

  return jsonObj;
};


// ON PAGE LOAD: Auto-open....
   setTimeout(function(){
     $('#offscreenMenuIco').click();
   },500);


// ....then auto-close off canvas slide-menu w/ time delay
setTimeout(function(){
  $('#offscreenMenuIco').click();
},2750);


$('#offscreenMenuIco, #offscreenMenuIcoTop').click(function(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  menuToggleStatus();
  toggleMenuPanel.toggle();
});


populatePageWLinks = function() {
function runOneTime($this) {
  let postID = $this.parent().parent().parent()[0].className.split(" ");
  postID = postID[3]; //ID OF DIV BEING CLICKED HERE
  let isPostLikedAlready = $this[0].className.split(" ");
  isPostLikedAlready = isPostLikedAlready[2]; //IS THIS ICO OF CLASS 'FA-HEART'?

  //CHECK IF THIS POST HAS BEEN LIKED ONCE THIS SESSION--NO EXTRA CLICKS
  if(runOneTime.prototype[postID] === true) {
 // NOOP IF LIKE BUTTON HAS ALREADY BEEN CLICKED ONCE--
 //
 // SHOULD BECOME UNLIKE FUNCTION HERE. FUNCTION CALL.
    return true;
  }
  else if(runOneTime.prototype[postID] === undefined && isPostLikedAlready === "fa-heart" || isPostLikedAlready === "fa-heart-o") {
 // IF CLICKED ALREADY LIKED POST NOT YET LIKED BY CURRENT AUTHED USER,
 // SET TO TRUE TO PREVENT RE-FIRE OF LIKE FUNCTION ON THAT SPECIFIC POST
    runOneTime.prototype[postID] = true;

 // DOES USER HAVE AN EXISTING LIKE ATTRIBUTED TO CUR POST?
    if(""+$this.parent().parent().parent().find(".userListed").val() !== "true") {
   // ADDING A LIKE AND CHANGING THE ICON:
      $this.parent().parent().parent().find(".likeCount").html(function(i, val) { return +val+1; });
      $this.parent().parent().parent().find(".likeCount").css('visibility', 'visible');
      $this.parent().html('<i class="fa fa-heart disabledIco" aria-hidden="true"></i>');

  // TOTALLY DISABLE 'THIS' LIKE BUTTON
     $this.parent().parent().addClass('disabledIco');

   // POSTED LINK META-DATA:
      let cN = $this.attr('class').split(' ');
      let pAuth = cN[0];
      let url = cN[3];
      let uidNo = localStorage['uid'] || firebase.auth().currentUser.uid;

      findIfUserExists(uidNo);
      let storedName = localStorage["user"];

  //  ADD A "LIKE"; GOES WITH ABOVE, FOUND USER NAME:
      $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(responseList) {
        //CUSTOM DYNAMIC JSON KEY VALUE GENERATOR:
        function constructJson(jsonKey) {
          let jsonObj = {};
          jsonObj[jsonKey] = true;

          return jsonObj;
        }
        //COMPARE AGAINST EXISTING POSTS IN DATABASE TO FIND LIKED POST
        //UPON FINDING IT, ADD 1 TO ASSOCIATED 'likes' AREA WITHIN DATABASE
        for(let link in responseList) {
          responseURL = decodeURIComponent(responseList[link].url);

          if(decodeURIComponent(responseList[link].url) === url && responseList[link].author === pAuth) {

            let pKey = link;
            let res = constructJson(pKey);

            firebase.database().ref('postLikes/'+outputUName).update(res).then(function() {
              setTimeout(function() {
                $('#linkDisplayDiv').html("");
                populatePageWLinks();
              },1000);
            });
          }
        }
      });

    }
  } else { alert("ERROR--NEITHER CASE WORKED"); }

}//END RUNONETIME() FUNCTION

  findIfUserExists = function(uidNo) {
    let usernameList = $.getJSON('https://livelinks01125.firebaseio.com/users.json', function() {
      usernameList = usernameList.responseJSON;
      let uNameFound = false;

      let uidNo = localStorage["uid"] || JSON.parse(localStorage["firebase:authUser:AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA:[DEFAULT]"]).uid || firebase.auth().currentUser.uid;

      for(let user in usernameList) {
          if(usernameList[user].uid === uidNo) {
            uNameFound = true;
            curUser = usernameList[user].user;

            break;
          }
      }// RETURN THE USER OR NOTHING
      if(!curUser) {

        return false;
      } else {

        return curUser;
      }
  });
};

let resJSON = $.getJSON('https://livelinks01125.firebaseio.com/postLikes.json');
let userLikeObj = {};
let likeArray = [];

resJSON.done(function(snapshot) {
  for(let likedPost in snapshot) {
      resJSON = resJSON;
      userLikeObj[likedPost] = Object.keys(snapshot[likedPost]);
  }
});

let thisUID = localStorage["uid"];
let outputUName;
let cachedUNameList;

cachedUNameList = $.getJSON('https://livelinks01125.firebaseio.com/users.json');

$('#linkDisplayDiv').html("");

cachedUNameList.done(function(cachedUNameList) { //INNER FUNC
  for(let name in cachedUNameList) {
    if(cachedUNameList[name].uid === thisUID) {
      outputUName = cachedUNameList[name].user;
      break;
    }
  }

  /* POPULATE INITIAL LINKS ON SCREEN */
  let searchAndDestroy;
  let postNo;

    $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(snapshot) {
      let likeUserList = [];
            let countDivs = 0;
              for(let post in snapshot) {
                let resJSONObj = resJSON.responseJSON;
                let likeUNameList = [];
                let likeCounter = 0;

                countDivs++;
                postNo = post;

                let usernameCount = 0;

                for(let likes in resJSONObj) {
                  let usernames = Object.keys(resJSONObj);
                  usernameCount++;

                  let arrLen = Object.keys(resJSONObj[likes]).length;
                  let keys = Object.keys(resJSONObj[likes]);

                  for(let i=0; i<arrLen; i++) {
                    if(keys[i] === postNo) {
                      likeUNameList.push(likes);
                    }
                  }
                }
                //'toggle':
                //if uname in likeunamelist then disable button
                //else enable it
                uNameFound = false;
                if(likeUNameList.indexOf(""+outputUName) !== -1) {
                  //AUTHED USER'S UNAME FOUND IN LIKE-LIST FOR CUR POST
                  uNameFound = true;
                }
                let numOfLikes = likeUNameList.length;

                  let newPost = document.createElement('div');
                  newPost.id = 'div' + countDivs +'Init'; //NUMBERS EACH DIV INDIVIDUALLY
                  newPost.pTitle = snapshot[post].title.length >= 42 ? snapshot[post].title.substring(0,41)+"..." : snapshot[post].title;
                  newPost.xDataMarker = snapshot[post].url;
                  newPost.pUrl = snapshot[post].url.length >= 53 ? decodeURIComponent(snapshot[post].url).substring(0,52)+"..." : decodeURIComponent(snapshot[post].url);
                  newPost.rawUrl = newPost.pUrl;
                  newPost.author = snapshot[post].author;
                  newPost.ip = snapshot[post].ip || "0.0.0.0";
                  newPost.category = decodeURIComponent(snapshot[post].category); //<=String of HTML
                  newPost.created_at = snapshot[post].timestamp || new Date();
                  newPost.catName = snapshot[post].catName;
                  newPost.className = 'linkOutputDiv '+newPost.author+' '+newPost.xDataMarker+' '+newPost.id+" "+newPost.catName;


              //  IF NOT ABOVE LIKES === 0, THEN LOAD .FA-HEART-O ICON INSTEAD OF .FA-HEART
                  if(numOfLikes === 0) {
                    newPost.innerHTML = '<h3 class="h3items"><span class=\'divTitle\'><a href=\'javascript:void(0);\' url='+newPost.rawUrl+'>'+newPost.pTitle+'</a></span></h3><div id="likeIcoWrap" class="'+newPost.pUrl+" "+newPost.author+'"><span class="postCatIcon">'+newPost.category+'</span>&middot;  <div class="likeIco"><i class="'+newPost.author+' fa fa-heart-o '+newPost.rawUrl+'" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount"></span></div></div></div><button type="button" class="xDataDismiss ">&times;</button><br />';
                    newPost.innerHTML += '<span class=\'divBody\'><a href=\'javascript:void(0);\' url='+newPost.rawUrl+'>'+newPost.pUrl+'</a></span><span id="newPostAuthor" class="'+newPost.author+'"><a href=\'javascript:void(0);\' class="authorDescribe" title='+newPost.ip+'>Posted By: '+newPost.author+'  &middot; <span class="timestamp" data-livestamp="'+newPost.created_at+'"></span></a></span>';
                  } else { //...LOAD VERSION WITH LIKES INSTEAD, BUT PRECLUDE FROM FURTHER CLICKS:
                    if(likeUNameList.indexOf(""+outputUName) !== -1) {
                      newPost.innerHTML = '<h3 class="h3items"><span class=\'divTitle\'><a href=\'javascript:void(0);\' url='+newPost.rawUrl+'>'+newPost.pTitle+'</a></span></h3><div class="likeIcoWrap '+newPost.pUrl+" "+newPost.author+'"><span class="postCatIcon">'+newPost.category+'</span>&middot;  <div class="likeIco killCursor"><i class="'+newPost.author+' fa fa-heart disabledIco '+newPost.rawUrl+'" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount">'+numOfLikes+'</span><input type="text" class="userListed" value="true"/></div></div></div><button type="button" class="xDataDismiss ">&times;</button><br />';
                      newPost.innerHTML += '<span class=\'divBody\'><a href=\'javascript:void(0);\' url='+newPost.rawUrl+'>'+newPost.pUrl+'</a></span><span id="newPostAuthor" class="'+newPost.author+'"><a href=\'javascript:void(0);\' class="authorDescribe" title='+newPost.ip+'>Posted By: '+newPost.author+'  &middot; <span class="timestamp" data-livestamp="'+newPost.created_at+'"></span></a></span>';
                    } else {
                      newPost.innerHTML = '<h3 class="h3items"><span class=\'divTitle\'><a href=\'javascript:void(0);\' url='+newPost.rawUrl+'>'+newPost.pTitle+'</a></span></h3><div class="likeIcoWrap '+newPost.pUrl+" "+newPost.author+'"><span class="postCatIcon">'+newPost.category+'</span>&middot; <div class="likeIco"><i class="'+newPost.author+' fa fa-heart '+newPost.rawUrl+'" aria-hidden="true"></i></div><div class="likeWrapper"><span class="likeCount">'+numOfLikes+'</span></div></div></div><button type="button" class="xDataDismiss ">&times;</button><br />';
                      newPost.innerHTML += '<span class=\'divBody\'><a href=\'javascript:void(0);\' url='+newPost.rawUrl+'>'+newPost.pUrl+'</a></span><span id="newPostAuthor" class="'+newPost.author+'"><a href=\'javascript:void(0);\' class="authorDescribe" title='+newPost.ip+'>Posted By: '+newPost.author+'  &middot; <span class="timestamp" data-livestamp="'+newPost.created_at+'"></span></a></span>';
                    }

                    //FORM A DYNAMIC DROPDOWN LIST OF USERS CLICKED 'LIKE':
                    //FILTER OUT INVALID RESULTS=>
                    // TODO: for loop?
                    if(likeUNameList[0] !== "undefined") {
                      let $select = document.createElement("div");
                      $select.className = "selectNumber";
                      newPost.dropdownUserList = likeUNameList; //<=WHOLE ARRAY AUTOMATICALLY VALID
                      for(let i = 0; i < newPost.dropdownUserList.length+1; i++) {
                          let el = document.createElement("option");
                          if(i === 0) {
                            el.className = "firstOptionDD";
                            el.textContent = " ";
                            el.value = " ";
                          } else {
                            let user = newPost.dropdownUserList[i-1];
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


              let toggleCategory = function(catTitle) {
                if(toggleCategory.prototype.togStatus === "true") {
                  toggleCategory.prototype["togStatus"] = "false";
                  $('.linkoutputdiv').show();
                }
                else {
                  toggleCategory.prototype["togStatus"] = "true";
                  $('.linkoutputdiv').not('.'+catTitle).hide();
                }
              };


              $('#dispLinksDiv').delegate('i.postedLink', 'click', function(evt) {
                evt.stopPropagation();
                let catTitle = $(this)[0].title;

                switch(catTitle) {
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


              //HIDE DIV OF LIKED USERS FOR CATEGORIES
              $('#dispLinksDiv').delegate('i.postedLink', 'mouseenter', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $(this).parent().parent().parent().parent().find('.selectNumber').removeClass('fadeIn');
                $(this).parent().parent().parent().parent().find('.selectNumber').css('visibility','hidden');
              });


              let hideLikeDisp;
              $('#dispLinksDiv').delegate('div.likeIco', 'mouseenter', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $(this).parent().parent().find('.selectNumber').addClass('fadeIn');
                $(this).parent().parent().find('.selectNumber').css('visibility','visible');
              });


              $('#dispLinksDiv').delegate('div.likeIco', 'mouseleave', function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                $(this).parent().parent().find('.selectNumber').removeClass('fadeIn');
                $(this).parent().parent().find('.selectNumber').css('visibility','hidden');
              });


              $('#dispLinksDiv').delegate('i.fa.fa-heart-o, i.fa.fa-heart', 'click', function(evt) {
                let $this = $(this);
                evt.stopPropagation();
                evt.preventDefault();
                runOneTime($this);
              });


              $('#menu').delegate('.ui-menu-item','mouseenter',function() {
                $(this).css('color','gray');
                $(this).find('.dropdownIco').css('color','gray');
              });


              $('#menu').delegate('.ui-menu-item','mouseleave',function() {
                $(this).css('color','#333333');
                $(this).find('.dropdownIco').css('color','#333333');
              });


            let textRes;
         // CAPTURE/RECORD DATA REGARDING DELETION OF POSTS
            searchAndDestroy = function(url) {

              $.getJSON('https://livelinks01125.firebaseio.com/links.json', function(snapshot) {
                for(let post in snapshot) {
                  //if url matches snapshot[post].url, then snapshot[post].url is used to form ref for parent to be .remove()'d
                  if(snapshot[post].url === url) {
                    firebase.database().ref('links/'+post).remove();

                    //LOG EVENT TO DATABASE:
                    let uEmail = localStorage['email'] || JSON.parse(localStorage['firebase:authUser:AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA:[DEFAULT]']).email || firebase.auth().currentUser.email;
                    let uidNo = localStorage['uid'] || JSON.parse(localStorage['firebase:authUser:AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA:[DEFAULT]']).uid || firebase.auth().currentUser.uid;
                    let delURL = url;
                    firebase.database().ref('deletedposts/').push({
                      email: uEmail,
                      url: delURL,
                      uid: uidNo
                    });
                  }
                }
              });
            };


            $('#dispLinksDiv').delegate('button.xDataDismiss', 'click', function(e) {
              e.stopPropagation();
           // FIND THE CORRESPONDING URL TO QUERY:
              let delMarker = $(this).parent()[0].className.split(" ");
              let $that = $(this);
              postAuthor = delMarker[1];
              delMarker = delMarker[2];
              curUID = firebase.auth().currentUser.uid;
              let userAuthedForPostDel = false;
              $.getJSON('https://livelinks01125.firebaseio.com/users.json', function(snapshot) {
                for(let username in snapshot) {
                  if(snapshot[username].uid === curUID) {
                    if(postAuthor === snapshot[username].user) {
                      userAuthedForPostDel = true;
                      break;
                    }
                  }
                }
                if(!userAuthedForPostDel) {
                    $('.deleteRestricted').dialog({
                  modal: true,
                  buttons: [
                    { text: "OK", click: function() { $('.deleteRestricted').dialog("close"); }, class:"okBtn", style:"color:lightpink" }
                  ]
                  });
                } else {
                  searchAndDestroy(delMarker);
               // RUN FB QUERY, .THEN(...) delete and also .hide() associated.
                  $that.parent().css('display','none');
                }
              });
            });
    }); //END HERE -- INNER FUNC
}); //END HERE -- FIRST FUNC -- OUTERMOST
}; //END HERE -- populatePageWLinks() WRAPPER
populatePageWLinks();


let res;
let resString;
let result;
let uName;


  $("#dispLinksDiv").delegate('div', 'click', function() {
    window.open($(this).find("a").attr("url"),'_blank');

    return false;
  });


  $("#dispLinksDiv").delegate('div', 'mouseenter', function() {
    $(this).find(".divbody").css('text-decoration', 'underline');
  });

  $("#dispLinksDiv").delegate('div', 'mouseleave', function() {
    $(this).find(".divbody").css('text-decoration', 'none');
  });


  let eUrl = encodeURIComponent($('#linkUrl').val());
  let lTitle = $('#linkTitle').val();
  let reg;

  //ADD NEW LIVELINK POST TO DATABASE/APP
  $('#submitButton').click(function() {
    if(selectedMenuItem === "") {
      $('#throwDynamicErr').dialog({
        width: 355,
        modal: true,
        title: "Error!",
        open: function() {
          var markup = '<p><center><span id="unassociatedCatBodyTxt">Please take a moment to associate your post with a category. Choose a selection from the nearby categories button, which is marked with a downward arrow, before attempting to resubmit.</span></center></p>';
          $(this).html(markup);
        },
        buttons: [ //SUCCESS MESSAGE CONFIRMATION:
          { text: "OK", click: function() {
            $('#throwDynamicErr').dialog("close");
          }, class:"okBtn2", style:"color:lightpink" }
        ]
      });
    } else {
if ($('#linkTitle').val().length === 0 || $('#linkUrl').val().length === 0) {

      return false;
    } else {
      let rawJSONList = $.getJSON('https://livelinks01125.firebaseio.com/users.json');

      rawJSONList.done(function(response) {
        let uidNo = localStorage["uid"] || JSON.parse(localStorage['firebase:authUser:AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA:[DEFAULT]']).uid || firebase.auth().currentUser.uid;
        reg = false;

        for(let user in response) {
          if(response[user].uid === uidNo) {
            uName = response[user].user;
            reg = true;
            break;
          }
        }
        if (!reg) {
          $( "#noUserErrDialog" ).dialog({
            modal: true,
            buttons: {
              "OK": function() {
                $('#noUserErrDialog').dialog("close");
              }
            }
          });

          return false;
        } else {
          eUrl = encodeURIComponent($('#linkUrl').val());
          lTitle = $('#linkTitle').val();
          let uidNo = localStorage["uid"] || JSON.parse(localStorage['firebase:authUser:AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA:[DEFAULT]']).uid || firebase.auth().currentUser.uid;
          let userip = localStorage["ip"];
          let ts = new Date();
          ts = ts.toString();

          //ASSIGN PROPER ICON TO RESPECTIVE POST
          let category = selectedMenuItem;

          //CLEAN THE "SLATE" FROM ANY PRIOR SELECTIONS:
          selectedMenuItem = "";
          let icon = "";
          let cName = "";
          $('li.ui-menu-item').removeClass('ui-state-active');
          $('li.ui-menu-item').removeClass('ui-state-disabled');

          switch(category) {
            case "Sports":
              icon = '<i class="fa fa-futbol-o postedLink" title="Sports" aria-hidden="true"></i>';
              cName = category;
              break;
            case "Politics":
              icon = '<i class="fa fa-university postedLink" title="Politics" aria-hidden="true"></i>';
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
              icon = '<i class="fa fa-asterisk postedLink" title="Misc" aria-hidden="true"></i>';
              cName = "Misc";
              break;
            default:
              alert("ERR!");
              break;
          }
          icon = encodeURIComponent(icon);

          //PUSH IT TO FIREBASE DB:
          firebase.database().ref('links').push({ title: lTitle, url: eUrl, uid: uidNo, author: uName, timestamp: ts, ip: userip, category: icon, catName: cName }).then(setTimeout(function() {

          //AND THEN RECREATE ALL DIVS SEAMLESSLY VIA AJAX:
            populatePageWLinks();
          },250));

          //CLEAN UP INPUTS FOR NEXT:
          icon = "";
          $('#linkUrl').val("");
          $('#linkTitle').val("");
        }
      });
    }
  } //END OF NEW CONTEXT

  });


  let d;
  let dt;


  $('#dispLinksDiv').delegate('span.postCatIcon','click',function(evt) {
      evt.stopPropagation();
  });


  $('#refreshButton').click(function() {
    $('#linkDisplayDiv').html("");
    populatePageWLinks();
  });


  let menuVisible = false;
  $('#selectTypeButton').click(function() {
    if(menuVisible !== true) {
      $('#menu').menu();
      $('#menu').css('display','block');
      menuVisible = true;
    } else {
      $('#menu').css('display','none');
      menuVisible = false;
    }
  });


  let logOut = function(){
    setTimeout(function(){
      window.open('http://127.0.0.1:8000/loginli.html','_self');
    },250);
  };


  $('#linkTitle, #linkUrl').keyup(function(evt) {
    if(evt.keyCode === 13) {
      $('#submitButton').click();
    }
  });


  //ON KEYUP INSIDE TEXT BOX, TRIGGER SCAN OF .JSON RECEIVED FOR .USER or .USERNAME IN TEXTBOX:
  let userName;
  $("#newUsernameInput").keyup(function(evt) {
    let inputLength = $('#newUsernameInput').val().length;
    let input = $('#newUsernameInput').val();
    let uN;
    let alphaNumChars;

   // SCAN INPUT FOR NON-ALPHANUMERIC CHARS
    let regexp = /[^a-zA-Z\d:]/g;
    if (regexp.test(input)) {
   // PREP FIFTH MODAL:
      $('#fifthModal .modal-title').html("Error!");
      $('#fifthModal .modal-body').html("<center>Non-Alphanumeric Character Detected:<br>Valid usernames are limited to use of 'a-z' and '0-9'. Please delete the current character, and try your desired name once again.</center>");
   // LOAD FIFTH MODAL:
      alphaNumChars = false;
      $('#validName').hide();
      $('#invalidName').show();

      $('#fifthModalTrig').click(); //REPLACE WITH JQUERY UI DIALOG
    } else {
      alphaNumChars = true;
    }

    if(evt.keyCode === 46 || evt.keyCode === 8) { //HIDE VALIDITY MSG ON DEL/BACKSPACE
      $('#validName').hide();
      $('#invalidName').hide();
    }

    if(inputLength > 0 && inputLength <= 10 && alphaNumChars) {
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


  $('#menu').delegate('li.ui-menu-item', 'click', function() {
    $('li.ui-menu-item').removeClass("ui-state-disabled");
    $('li.ui-menu-item').removeClass("ui-state-active");

    $(this).addClass("ui-state-disabled");
    $(this).addClass("ui-state-active");

    selectedMenuItem = $(this).find('span.menuTxtStyle').text();
    //CALL FUNCTION AND SEND THIS DIRECTLY TO IT INSTEAD OF RELYING ON SCOPE/CONTEXT
    setTimeout(function() {
      $('#menu').css('display','none');
      menuVisible = false;
    },350);
  });


// OFF CANVAS SLIDE MENU BUTTON FUNCTIONALITY
  $('#smbLogOut').click(function() {
    localStorage["autoLogin"] = false;
    firebase.auth().signOut();
    logOut();
  });


  $('#smbChgPass').click(function() {
    let email = localStorage["email"] || JSON.parse(localStorage['firebase:authUser:AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA:[DEFAULT]']).email || firebase.auth().currentUser.email;
    let err = false;
    firebase.auth().sendPasswordResetEmail(email).catch(function(error) {
      if(error) {
        err = true;
        $('#throwDynamicErr').dialog({
          modal: false,
          title: error.code,
          open: function() {
            var markup = '<p><center><span id="passResetErrTxt">'+error.message+'</span></center></p>';
            $(this).html(markup);
          },
          buttons: [ //SUCCESS MESSAGE CONFIRMATION:
            { text: "OK", click: function() {
              $('#throwDynamicErr').dialog("close");
            }, class:"okBtn", style:"color:lightpink" }
          ]
        });
      }
    }).then(function(){
      if (!err) {
        $('#throwDynamicErr').dialog({
          modal: false,
          title: "Password Reset",
          open: function() {
            var markup = '<center><span id="emailChgBodyDialog"><br>Please check your primary email account for instructions on resetting your LiveLinks password immediately.</span></center>';
            $(this).html(markup);
          },
          buttons: [ //SUCCESS MESSAGE CONFIRMATION:
            { text: "OK", click: function() {
              checkPanelState();
              $('#throwDynamicErr').dialog("close");
            }, class:"okBtn", style:"color:lightpink" }
          ]
        });
      }
    });
  });


  let validateEmail = function(e) {
    let atpos = e.indexOf("@");
    let dotpos = e.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos+2 || dotpos+2 >= e.length) {
      $('#throwDynamicErr').dialog({
        modal: false,
        title: "Invalid Email",
        open: function() {
          var markup = '<p><center><span id="invalidEmailErrBody">The email address is badly formatted. Please check and try again.</span></center></p>';
          $(this).html(markup);
        },
        buttons: [ //SUCCESS MESSAGE CONFIRMATION:
          { text: "OK", click: function() {
            $('#throwDynamicErr').dialog("close");
          }, class:"okBtn", style:"color:lightpink" }
        ]
      });
      return false;
    } else { return true; }
  };


  $('#smbDeactivate').click(function() {
    $('#confirmDeleteDialog').show();
    //POP JQUERY UI DIALOG TO REQUEST CONFIRMATION:
    $('#confirmDeleteDialog').dialog({
      width: 350,
      modal: true,
      buttons: [
        { text: "Cancel", click: function() { $('#confirmDeleteDialog').dialog("close"); checkPanelState(); }, style:"color:lightpink" },
        { text: "OK", click: function() { //DELETE THE ASSOCIATED ACCOUNT(S):
          //GATHERING INFO:
          let providersArray = firebase.auth().currentUser.providerData;

          let provNames = [];
          for(let x = 0; x<providersArray.length; x++) {
              provNames.push(providersArray[x].providerId);
          }
          let providerCount = provNames.length;

          //DELETE LINKED ACCOUNTS FROM FIREBASE:
          //(MUST USE RECURSION TO AVOID OVERWRITING MULTIPLE ASYNC COMMANDS)
          function start(counter) {
            if(counter < providerCount) {
              setTimeout(function() {
                let cur = provNames[counter];
                console.log(firebase.auth().currentUser.unlink(cur));

                counter++;
                console.log(counter);
                start(counter);
              }, 1200);
            }
          }
          start(0);

          //CLOSE THE DIALOG WINDOW & RESTORE UI:
          $('#confirmDeleteDialog').dialog("close");
          checkPanelState();
          document.cookie = "returnVisitor=false"; //<=SO MAIN PAGE GREETS A NEW USER

          setTimeout(function(){
            window.location.href = "http://127.0.0.1:8000/signupll.html";
          },1000);
        }, style:"color:lightpink" }
      ]
    });
  });


  $('#smbChgEmail').click(function() {
    let currentUID = localStorage["uid"] || firebase.auth().currentUser.uid;
    let currentEmail = localStorage["email"] || firebase.auth().currentUser.email;

    //SET CURRENT EMAIL AS BASE:
    firebase.database().ref('userEmails/'+currentUID).update({
      currentEmail: currentEmail,
    }).catch(function(error){
      alert("Critical error while updating base email in database. Stand by for error info.");
      alert(error.code+"\n"+error.message);
    });

    $('#curEmailDispBox').html("<span id='curEmailTxt'>"+currentEmail+"</span>");

    let err;
    let errMsg;

    $('#changeEmail').dialog({
      modal: true,
      buttons: [
        { text: "Cancel", click: function() {
          $('#changeEmail').dialog("close");
          $('input#newEmailInput').val("");
          checkPanelState();
        }, class:"addChgUNameBtn", style:"color:lightpink" },
        { text: "Submit", click: function() {
          let $newEmail = $('input#newEmailInput').val();
          if($newEmail != null && $newEmail) {
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
                    $(this).html("<p><center><span id='genErrDialogBody'>Error! "+error.message+"</span></center></p>");
                  },
                  buttons: [
                    { text: "OK", click: function() {
                      $('#throwDynamicErr').dialog("close");
                    }, class:"okBtn", style:"color:lightpink" }
                  ]
                  });
              });

                if (err) {

                  return false;
                } else {
                  let err0r = false;
                  $.getJSON('https://livelinks01125.firebaseio.com/userEmails/'+currentUID+'.json', function(userEmails) {
                    let emailAddyCounter = 1;
                    for(let email in userEmails) {
                      emailAddyCounter++; //COUNT EXISTING EMAILS
                    }
                    //STORE OLD EMAIL IN UNIQUE VAR:
                    //$newEmail automatically reset to first slot in DB Child
                    let addEmail = constructJson("email"+emailAddyCounter, currentEmail);
                    firebase.database().ref('userEmails/'+currentUID).update(addEmail).catch(function(error) {
                      if (error) {
                        err0r = true;
                        $('throwDynamicErr').dialog({
                        modal: true,
                        title: error.code,
                        open: function() {
                          $(this).html(error.message);
                        },
                        buttons: [
                          { text: "OK", click: function() {
                            $('#throwDynamicErr').dialog("close");
                          }, class:"okBtn", style:"color:lightpink" }
                        ]
                        });
                      }
                    });

                    if (!err0r) {
                      setTimeout(function() {
                        $('#throwDynamicErr').dialog({
                          modal: false,
                          title: "Success!",
                          open: function() {
                            var markup = '<p><center>Email Successfully Changed!</center></p>';
                            $(this).html(markup);
                          },
                          buttons: [ //SUCCESS MESSAGE CONFIRMATION:
                            { text: "OK", click: function() {
                              $('#throwDynamicErr').dialog("close");
                            }, class:"okBtn", style:"color:lightpink" }
                          ]
                        });
                      },450);
                    }
                  });
                }
                //CLEAN UP ON SUBMIT/EXIT
                $('input#newEmailInput').val("");
                $('#changeEmail').dialog("close");
                checkPanelState();
            } else {
              //EXIT. USER FAILED TO ENTER EMAIL ADDRESS W/ VALID FORMAT.
              //ERROR HAS NOW BEEN LOADED ELSEWHERE & JUST PRIOR.
              return false;
            }
          } else {
            $('#invalidFormInput').dialog({
              modal: false,
              buttons: [
                { text: "OK", click: function()
                  {
                    $('#invalidFormInput').dialog("close");
                  }, class:"okBtn", style:"color:lightpink" }
              ]
            });
          }
        }, class:"addChgUNameBtn", style:"color:lightpink" }
      ]
  });
});


  $('#smbAbout').click(function() {
    $('#smbAboutDialog').dialog({
      width: 700,
      modal: true,
      buttons: [
        { text: "OK", click: function() { $('#smbAboutDialog').dialog("close"); }, class:"okBtnLg", style:"color:lightpink" }
      ]
    });
  });


  let setNewUName = function(uidNo,uName,exists) {
    if(exists) {
      firebase.database().ref(""+"users/"+uidNo).update({ user: uName });
    } else {
      uName = uName || firebase.auth().currentUser.displayName;
        firebase.database().ref(""+"users/"+uidNo).set({
          user: uName,
          uid: uidNo
        });
    }
  };


    $('#dialog').hide();
    $('#smbXtra').click(function() {
      let regexp = /[^a-zA-Z\d:]/g;
      let uidNo = localStorage["uid"] || firebase.auth().currentUser.uid || JSON.parse(localStorage['firebase:authUser:AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA:[DEFAULT]']).uid;

      $('#dialog').dialog({
        height: 260,
        modal: true,
        buttons: [
          { text: "Cancel", click: function() {
            $('#dialog').dialog("close");
            checkPanelState();
            $('#validName').hide();
            $('#invalidName').hide();
            $('#newUsernameInput').val("");
          }, class:"addChgUNameBtn",style:"color:lightpink" },
          { text: "Submit", click: function() {
            let input = $('#newUsernameInput').val();
            if($('#newUsernameInput').val().length >= 1 && $('#newUsernameInput').val().length <= 10) {
              if(regexp.test(input)) {
                //TRIGGER NON-ALPHANUM DIALOG
                $('#throwDynamicErr').dialog({
                  modal: false,
                  open: function() {
                    var markup = "<p><center><span id='nonAlphanumErr'>Non-Alphanumeric Keypress Detected!<br>Usernames must be comprised of letters ('A-Z') and numbers ('0-9') only.</span></center></p>";
                    $(this).html(markup);
                  },
                  buttons: [
                    { text: "OK", click: function()
                      {
                        $('#throwDynamicErr').dialog("close");
                      }, class:"okBtn", style:"color:lightpink" }
                  ]
                });

                return false;
              } else {
                $('#curUsername').text(''+$('#newUsernameInput').val());
                $('#validName').hide();
                $('#invalidName').hide();

                let newUName = $('#newUsernameInput').val();
                setNewUName(uidNo, newUName, userRegistered);
                $('#newUsernameInput').val("");

                setTimeout(function() {
                  $('#dialog').dialog("close");
                  checkPanelState();
                },750);
              }
            } else {
              $('#emptyFieldDialog').show();
              $('#emptyFieldDialog').dialog({
                modal: false,
                buttons: [
                  { text: "OK", click: function()
                    {
                      $('#emptyFieldDialog').dialog("close");
                    }, class:"okBtn", style:"color:lightpink" }
                ]
              });
            }
          }, class:"addChgUNameBtn", style:"color:lightpink" }
        ]
      });
      let userRegistered = false;

      let usernameList = $.getJSON('https://livelinks01125.firebaseio.com/users.json', function() {
        usernameList = usernameList.responseJSON;

        let uidNo = firebase.auth().currentUser.uid;

        for(let user in usernameList) {
            if(usernameList[user].uid === uidNo) {
              userRegistered = true;
              $('#curUsername').removeClass('redErrorTxt');
              $('#curUsername').text(''+usernameList[user].user);
              break;
            } else {
              $('#curUsername').addClass('redErrorTxt');
              $('#curUsername').text("User Unregistered");
            }
        }
    });
    $('#dialog').show();
    $('#dialog').dialog();
});


//FUNCTION TO TOGGLE SHOWING ONLY OF INDIVIDUAL USER POSTS
function showHidePosts(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  let cn = $(this).parent()[0].className.split(" ");
  let targetPosts = cn[1];

  if (showHidePosts.prototype.hidden) {
    showHidePosts.prototype.hidden = false;
    $('.linkoutputdiv').not("."+targetPosts).show();
     //SHOW ONLY POSTS BY SELECTED USER
  } else {
    showHidePosts.prototype.hidden = true;
    $('.linkoutputdiv').not("."+targetPosts).hide(); //HIDE ALL POSTS NOT BY SELECTED USER
  }
}


let hideMenu;
$('.scotch-panel-canvas').delegate('ul#menu', 'mouseleave', function() {
  hideMenu = setTimeout(function() {
    //$('ul#menu').hide();
    //menuVisible = false;
  },850);
});

$('.scotch-panel-canvas').delegate('ul#menu', 'mouseenter', function() {
  clearTimeout(hideMenu);
});


$('div#dispLinksDiv').delegate('span#newPostAuthor', 'click', showHidePosts);
