  $('#noUserErrDialog').hide();
  $('#emptyFieldDialog').hide();
  $('.deleteRestricted').hide();
  $('#changeEmail').hide();
  $('#throwDynamicErr').hide();
  $('#invalidFormInput').hide();


  let config = {
    apiKey: "AIzaSyDEP7PX9rcrbtTwTZ85mLyt2ALzczuUomA",
    authDomain: "livelinks01125.firebaseapp.com",
    databaseURL: "https://livelinks01125.firebaseio.com",
    storageBucket: "livelinks01125.appspot.com",
  };
  firebase.initializeApp(config);


  function createJSON(jsonKey, val) {
    let jsonObj = {};
    jsonObj[jsonKey] = val;

    return jsonObj;
  }


  function salty() {
    let letters = '0123456789ABCDEFGHIJKLMNO';
    let rand = '';

    for (var i = 0; i < 5; i++) {
        rand += letters[Math.floor(Math.random() * 24)];
    }

    return rand;
  }


  let keyGen = function(uid) {
    let part1 = salty(); //CREATE RANDOM STRING
    let part2 = salty(); //FROM RANDOM CHARACTERS
    let part3 = salty(); //BY CATTING TOGETHER
    let part4 = salty(); //AND THEN ENCRYPT
    let key = "" + part1 + part3 + part4 + part2; //FOR MORE RANDOMNESS

    key = crypt.AES.encrypt(key);
    firebase.database().ref('/users/' + uid).update({
        key: true
    });

    return key;
  };


  setTimeout(function() {
    let userID = localStorage['uid']; // = firebase.auth().currentUser.uid;

    if (localStorage["lastProvider"] === "password") {
    	let user;
        let userIsFound = false;
        let curUID = localStorage['uid'] || firebase.auth().currentUser.uid;
        $.getJSON('https://livelinks01125.firebaseio.com/users.json', function(userlist) {
            for (let name in userlist) {
                if (userlist[name].uid === curUID) {
                    user = userlist[name].user;
                    localStorage.setItem('user', user);
                    k = keyGen(curUID); //SPAWN ONE-TIME USAGE KEY
                    userIsFound = true;
                    break;
                }
            }
            if (!userIsFound) {
                alert("ERR! No username created!");
            }
    	}); 
    }
    
    if (localStorage["autoLogin"] === "true") {
        let k;
        let encryptedPW;
        
     /* encrypt */
        let passToCrypt = localStorage['pw'];
        encryptedPW = crypt.AES.encrypt(passToCrypt, k);

     /* store one-use key w/ UID */
        localStorage['pw'] = encryptedPW;
        let encodedPW = encodeURIComponent(encryptedPW);
        let setKey = createJSON("key", encodeURIComponent(k));
        let uid = localStorage["uid"] || firebase.auth().currentUser.uid;
        let setUID = createJSON("uid", uid);

        firebase.database().ref('crypt/' + uid).update(setUID);
        firebase.database().ref('crypt/' + uid).update(setKey);
     }
    
  }, 900);
