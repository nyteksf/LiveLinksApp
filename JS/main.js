$(function() {
    /* ALLOW FOR ES6 */
    'use strict';
});


$(() => {

    
    $('#validUName').hide();
    $('#invalidUName').hide();

    let token = "";
    let storedToken;
    let storedEmail;


    function writeCookie(key, value, seconds) {
        window.document.cookie = key + "=" + value + ";max-age=" + seconds + ";path=/";

        return value;
    };


    let goToApp = function() {
        window.open("livelinks.html", "_self");
        // window.open("https://nyteksf.github.io/LiveLinksApp/livelinks.html", "_self");
    };


    //MAKE SURE MULTIPLE MODALS FIRE WITHOUT OVERLAP VIA Z-INDEX:
    $(document).on('show.bs.modal', '.modal', function() {
        var zIndex = Math.max.apply(null, Array.prototype.map.call(document.querySelectorAll('*'), function(el) {
            return +el.style.zIndex;
        })) + 10;
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });


    let undoCheckboxClick = function() {
        $('#emailInputModal').prop('disabled', false);
        $('#passwordInputModal').prop('disabled', false);
        $('#persistCB').prop('disabled', false);
        $("#anonCB:checked").prop('checked', false);
        $("#persistCB:checked").prop('checked', false);
    };


    //ENABLE ENTER KEY USAGE FOR MAIN LOGIN FORM
    $('#emailInput, #passwInput').keyup(function(evt) {
        if (evt.keyCode === 13) {
            $('#submitBtn').click();
        }
    });


    let checkUName = function(uName, modalName) {
        if (modalName === "signinModal") {
            if (uName.toLowerCase() !== $('#uNameModal').val().toLowerCase()) {
                $('#validUName').show();
                $('#invalidUName').hide();
                $('#signinBtnModal').prop('disabled', false);
            } else {
                $('#invalidUName').show();
                $('#validUName').hide();
                $('#signinBtnModal').prop('disabled', true);

                return true;
            }
        }
        if (modalName === "registerModal") {
            if (uName.toLowerCase() !== $('#inputUNameModal').val().toLowerCase()) {
                $('#validName').show();
                $('#invalidName').hide();
                $('#submitBtnModal').prop('disabled', false);
            } else {
                $('#invalidName').show();
                $('#validName').hide();
                $('#submitBtnModal').prop('disabled', true);

                return true;
            }
        }
    };


    let setNewUName = function(uidNo, uName) {
        firebase.database().ref("" + "users/" + uidNo).set({
            user: uName,
            uid: uidNo
        });
    };


    let userName;
    $("#inputUNameModal, #uNameModal").keyup(function(evt) {
        let alternateModal = false;
        let inputLength;
        let input;
        if ($("#inputUNameModal").val().length > 0) {
            inputLength = $("#inputUNameModal").val().length;
            input = $("#inputUNameModal").val();
        }
        if ($('#uNameModal').val().length > 0) {
            inputLength = $('#uNameModal').val().length;
            input = $("#uNameModal").val();
            alternateModal = true;
        }
        let uN;
        let regexp = /[^a-zA-Z\d:]/g;
        if (regexp.test(input)) {
            // PREP FIFTH MODAL:
            $('#fifthModal .modal-title').html("Error!");
            $('#fifthModal .modal-body').html("<center>Non-Alphanumeric Character Detected:<br>Valid usernames are limited to use of 'a-z' and '0-9'. Please delete the current character, and try your desired name once again.</center>");
            // LOAD FIFTH MODAL:
            $('#fifthModalTrig').click();
            // DO SOME OTHER STUFF:
            if (alternateModal) {
                $('#signinBtnModal').prop('disabled', true);
                $('#validUName').hide();
                $('#invalidUName').show();
                alternateModal = false;
            } else {
                $("#submitBtnModal").prop('disabled', true);
                $('#validName').hide();
                $('#invalidName').show();
            }
        } else {
            if (evt.keyCode === 46 || evt.keyCode === 8) {
                $('#invalidName').hide();
                $('#invalidUName').hide();
                $('#validUName').hide();
                $('#validName').hide();
            }
            if (inputLength > 0 && inputLength <= 10) {
                $("#submitBtnModal").prop('disabled', false);
                username = $.getJSON('https://livelinks01125.firebaseio.com/users.json', function() {
                    uN = username.responseJSON;

                    for (let obj in uN) {
                        if (uN.hasOwnProperty(obj)) {
                            uName = uN[obj].username || uN[obj].user;
                            let breaker;
                            if (inputLength !== 0) {
                                if ($("#inputUNameModal").val().length > 0) {
                                    breaker = checkUName(uName, "registerModal");
                                }
                                if ($('#uNameModal').val().length > 0) {
                                    breaker = checkUName(uName, "signinModal");
                                }
                                if (breaker) {
                                    break;
                                }
                            }
                        }
                    }
                });
            } else {
                if ($("#inputUNameModal").val().length > 0) {
                    $("#submitBtnModal").prop('disabled', true);
                    $('#invalidName').show();
                    $('#validName').hide();
                } else if ($('#uNameModal').val().length > 0) {
                    $("#submitBtnModal").prop('disabled', true);
                    $('#invalidUName').show();
                    $('#validUName').hide();
                }
            }
        }
    });


    // FIRST MODAL: ie, ACCT. REGISTRATION CANCEL BTN
    $('#myModal .btn-danger').click(function() {
        undoCheckboxClick();
    });


    let providerName;
    let prov;


    let _providerFromName = function(pName, pCred, uName, email, password, isPasswdAcct) {
        let tokenRes;

        if (pName[0] === "google.com") {
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
                // Remember that the user may have signed in with an account that has a different email
                // address than the first one. This can happen as Firebase doesn't control the provider's
                // sign in flow and the user is free to login using whichever account he owns.
                // Step 4b.
                // Link to GitHub credential.
                // As we have access to the pending credential, we can directly call the link method.
                if (isPasswdAcct) {
                    pCred = firebase.auth.EmailAuthProvider.credential(email, password);
                }
                result.user.link(pCred).then(function() {
                    // Account successfully linked to the existing Firebase user.

                    // CHANGE TO SIXTH MODAL -- MAKE BTN-SUCCESS TRIGGER GOTOAPP();
                    $('#seventhModal .modal-title').html("Account Added");
                    if (isPasswdAcct) {
                        $('#seventhModal .modal-body').html("Password account successfully linked to the existing Firebase user.<BR>Please click 'OK' to continue.");
                    } else {
                        $('#seventhModal .modal-body').html("GitHub account successfully linked to the existing Firebase user.<BR>Please click 'OK' to continue.");
                    }
                    //LOAD SEVENTH MODAL:
                    $('#seventhModalTrig').click();
                });
            });
        } else if (pName[0] === "github.com") {
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
                // Remember that the user may have signed in with an account that has a different email
                // address than the first one. This can happen as Firebase doesn't control the provider's
                // sign in flow and the user is free to login using whichever account he owns.
                // Step 4b.
                // Link to GitHub credential.
                // As we have access to the pending credential, we can directly call the link method.
                if (isPasswdAcct) {
                    pCred = firebase.auth.EmailAuthProvider.credential(email, password);
                }
                result.user.link(pCred).then(function() {
                    // Account successfully linked to the existing Firebase user.
                    if (isPasswdAcct) {
                        $('#seventhModal .modal-title').html("Password Account Successfully Added");
                    } else {
                        $('#seventhModal .modal-title').html("Github Account Successfully Added");
                    }
                    $('#seventhModal .modal-body').html("Google account successfully linked to the existing Firebase user.");
                    //LOAD FIFTH MODAL:
                    $('#seventhModalTrig').click();
                });
            });
        }
        setTimeout(function() {
            goToApp();
        }, 3000);
    };


    // RETURN A LIST OF PROVIDERS FOR AUTHd USER:
    let getProviderForProviderId = function(pCred, email, uName, password, isPasswdAcct) {
        let uEmail = email || firebase.auth().currentUser.email;

        return firebase.auth().fetchProvidersForEmail(uEmail).then(function(provider) {
            _providerFromName(provider, pCred, uName, email, password, isPasswdAcct);
        });
    };


    $('#submitBtn').click(function() {
        if ($('#emailInput').val() < 1 || $('#passwInput').val() < 1) {
            $('#fourthModalTrig').click(); // INSUFFICIENT INPUT MODAL NOW FIRED

            return false;
        } else {
            let email = $('#emailInput').val().toLowerCase();
            let password = $('#passwInput').val();
            let errTest = false;

            localStorage.setItem('lastProvider', 'password');

            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here:
                if (error) {
                    errTest = true;
                    if (error.code === "auth/wrong-password") {
                        $('#fifthModal .modal-title').html(error.code);
                        $('#fifthModal .modal-body').html("<center>" + error.message + "<br>Please try first registering an email/password account,<br>or performing a password reset.</center>");
                        //LOAD FIFTH MODAL:
                        $('#fifthModalTrig').click();
                    } else {
                        //PASS DYNAMIC INFO TO FIFTH MODAL:
                        $('#fifthModal .modal-title').html(error.code);
                        $('#fifthModal .modal-body').html(error.message);
                        //LOAD FIFTH MODAL:
                        $('#fifthModalTrig').click();
                    }
                    return true;
                }
            }).then(function(errTest) {
                if (errTest !== true) {
                    if ($('input#mainRememberMeChkBox').is(':checked')) {
                        // FOR AUTO-LOGIN WHEN USER SELECTED PERSISTENCE; LOAD CODE BELOW:
                        let pass = $("#passwInput").val();
                        let email = $('#emailInput').val();
                        localStorage.setItem('autoLogin', true);
                        localStorage.setItem('pw', pass);
                    } else { // IF NO CHECKBOX FOR SET PERSIST, SET TO FALSE:
                        localStorage.setItem('autoLogin', false);
                    } // BUT EITHER WAY, STORE THESE VALUES FOR LATER USE:
                    localStorage.setItem('ip', userip);
                    localStorage.setItem('email', email);
                    localStorage.setItem('uid', firebase.auth().currentUser.uid);

                    // THEN TAKE TO APP LANDING PAGE:
                    setTimeout(function() {
                        goToApp();
                    }, 1200);
                }
            });
        }
    });


    let canIHazUsername = function(errorStatus) {
        if (errorStatus === false) {
            let curUser = rawUData = firebase.auth().currentUser;
            let email = curUser.email;
            let uid = curUser.uid;

            localStorage.setItem('email', email);
            localStorage.setItem('uid', uid);
            localStorage.setItem('ip', userip);

            if ($('input#mainRememberMeChkBox').is(':checked')) {
                //FOR AUTO-LOGIN ON PAGE LOAD WHEN SIGNED OUT ALREADY, LOAD CODE BELOW:
                //IF ALL ELSE FAILS: localStorage.setItem("token", userData);
                localStorage.setItem('autoLogin', true);
            } else {
                localStorage.setItem('autoLogin', false);
            }
            //THEN FIND USERNAME IF EXISTS:
            $.getJSON('https://livelinks01125.firebaseio.com/users.json', function(userList) {
                let curUID = firebase.auth().currentUser.uid;
                let userFound = false;
                for (let uName in userList) {
                    if (curUID === userList[uName].uid) {
                        localStorage.setItem('user', userList[uName].user);

                        userFound = true;
                        break;
                    }
                }
                if (!userFound) {
                    $('#eighthModalTrig').click();
                    //BOTH 8th MODAL BUTTONS LAUNCH APP--ie, 'CANCEL' AND 'SUBMIT'
                } else {
                    //...LOAD LANDING PAGE IF FINISHED:
                    setTimeout(function() {
                        goToApp();
                    }, 2000);
                }
            });

        }
    };


    let errorStatus = false;
    let pCred;
    $('#googleLoginBtn').click(function() {
        localStorage.setItem('lastProvider', 'google.com');
        // Step 1.
        // User tries to sign in to Google.
        token = firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function(error) {
            // An error happened. NOTIFY USER OF ERROR, AND OFFER REMEDY.
            if (error.code) {
                errorStatus = true;
                if (error.code !== 'auth/account-exists-with-different-credential') {
                    //PASS DYNAMIC INFO ABOUT ERROR TO FIFTH MODAL:
                    $('#fifthModal .modal-title').html(error.code);
                    $('#fifthModal .modal-body').html(error.message);
                    //LOAD FIFTH MODAL:
                    $('#fifthModalTrig').click();
                } else {
                    // Step 2.
                    // User's email already exists.
                    // The pending Google credential.
                    let pendingCred = error.credential;
                    // The provider account's email address.
                    let email = error.email;
                    // Get registered providers for this email.
                    auth.fetchProvidersForEmail(email).then(function(providers) {
                        // Step 3.
                        // If the user has several providers,
                        // the first provider in the list will be the "recommended" provider to use.
                        if (providers[0] === 'password') {
                            // Asks the user his password.
                            // In a real scenario, you should handle this asynchronously.
                            let password = prompt("PLEASE ENTER YOUR PASSWORD TO CONTINUE LOGGING IN:"); // TODO: implement promptUserForPassword.
                            auth.signInWithEmailAndPassword(email, password).then(function(user) {
                                // Step 4a.
                                return user.link(pendingCred);
                            });
                            return;
                        }
                    });
                    //END OF ACCT EXISTS ERROR MSG
                    // All the other cases are external providers.
                    // Construct provider object for that provider.
                    getProviderForProviderId(pendingCred);
                }
            }
        }).then(function() {
            //check for uName and assign if not present
            canIHazUsername(errorStatus);
        });

    });


    $('#githubLoginBtn').click(function() {
        localStorage.setItem('lastProvider', 'github.com');
        //Step 1.
        //User tries to sign in to GitHub.
        firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function(error) {
            //An error happened.
            errorStatus = true;
            if (error.code) {
                if (error.code !== 'auth/account-exists-with-different-credential') {
                    //PASS DYNAMIC INFO ON ERROR TO FIFTH MODAL:
                    $('#fifthModal .modal-title').html(error.code);
                    $('#fifthModal .modal-body').html(error.message);
                    //LOAD FIFTH MODAL:
                    $('#fifthModalTrig').click();
                } else {
                    // Step 2.
                    // User's email already exists.
                    // The pending GitHub credential.
                    var pendingCred = error.credential;

                    // The provider account's email address.
                    var email = error.email; //=> "email.nytek@gmail.com"

                    // Get registered providers for this email.
                    firebase.auth().fetchProvidersForEmail(email).then(function(providers) {
                        // Step 3.
                        // If the user has several providers,
                        // the first provider in the list will be the "recommended" provider to use.
                        if (providers[0] === 'password') {
                            // Asks the user his password. (IF PASSWORD ACCT IS PRE SET UP)
                            // In real scenario, you should handle this asynchronously.
                            var password = prompt("PLEASE ENTER YOUR PASSWORD:"); // TODO: implement promptUserForPassword modal.
                            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
                                // Step 4a.
                                return user.link(pendingCred);
                            }).then(function() {
                                // GitHub account successfully linked to the existing Firebase user.
                                $('#fifthModal .modal-title').html("Account Successfully Linked");
                                $('#fifthModal .modal-body').html("GitHub account successfully linked to the existing Firebase user.");
                                //LOAD FIFTH MODAL:
                                $('#fifthModalTrig').click();

                                setTimeout(function() {
                                    goToApp();
                                }, 2000);
                            });
                        }
                    });
                    //WHEN DEALING WITH REGISTRATION ATTEMPT OF A SECOND EXTERNAL PROVIDER SERVICE:
                    // All the other cases are external providers:
                    getProviderForProviderId(pendingCred, email);
                } /* if (error.code == ...) ends */
            }
        }).then(function() {
            //check for uName and assign if not present
            canIHazUsername(errorStatus);
        });
    });


    //TRIGGER FOR FIRST MODAL -- ACCT REG.
    $('#registerNowLnk').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#modalTrig').click();
    });


    //ON TOGGLE OF ANONYMOUS LOGIN CHECKBOX
    let anonLogin = false;
    $('#anonCB').change(function() {
        if ($(this).is(':checked')) {
            anonLogin = true;
            $('#inputEmailModal').val("");
            $('#inputPasswordModal').val("");
            $('#inputUNameModal').val("");
            $('#myModal .btn-success').text('LOGIN');
            $("#persistCB:checked").prop('checked', false);
            $('#inputEmailModal').prop('disabled', true);
            $('#inputUNameModal').prop('disabled', true);
            $('#inputPasswordModal').prop('disabled', true);
            $('#persistCB').prop('disabled', true);
            $('#SecondModalTrig').click();
            $('.modal-body span').hide();
        } else {
            anonLogin = false;
            $('#inputEmailModal').prop('disabled', false);
            $('#inputPasswordModal').prop('disabled', false);
            $('#inputUNameModal').prop('disabled', false);
            $('#persistCB').prop('disabled', false);
            $('#myModal .btn-success').text('SIGN UP');
        }
    });

    let errFlag = false;
    $('#submitEmailModal').click(function(e) {
        e.preventDefault();
        if ($('#emailResetInput').val().length === 0) {
            $('#fifthModal .modal-title').html("Error!");
            $('#fifthModal .modal-body').html("Please input your email address and try again!");
            $('#fifthModalTrig').click();

            return;
        } else {
            let email = $('#emailResetInput').val();

            firebase.auth().sendPasswordResetEmail(email).catch(function(error) {
                // Handle Errors here:
                if (error) {
                    //PASS DYNAMIC INFO TO CUSTOM MODAL:
                    errFlag = true;

                    $('#fifthModal .modal-title').html('Error: ' + error.code + '!');
                    $('#fifthModal .modal-body').html(error.message);
                    // LOAD CUSTOM MODAL:
                    $('#fifthModalTrig').click();

                    throw new Error(error.message);
                }
            }).then(function() {
                $('#fifthModal .modal-title').html('Success!');
                $('#fifthModal .modal-body').html('Please check the email used to register your account for a link to restore access.');
                $('#fifthModalTrig').click();

                return true;
            });
        }
        $('#emailResetInput').val("");
    });


    $('#passResetLnk').click(function() {
        //MODAL APPEARS AND PROMPTS FOR EMAIL.
        //OK BUTTON GRABS VALUE OF INPUT AND FIRES FUNC:
        $('#thirdModalTrig').click();
    });


    //ie SUBMITBTNMODAL:
    $('#myModal').delegate('.btn-success', 'click', function() {
        if (anonLogin) {
            undoCheckboxClick();

            setTimeout(function() {
                goToApp();
            }, 1500);
        } else {
            //OR IF REGISTER ACCT:
            if ($('#inputEmailModal').val().length > 0 && $('#inputPasswordModal').val().length > 0 && $('#inputUNameModal').val().length > 0) {
                let email = $('#inputEmailModal').val();
                localStorage.email = email;
                let password = $('#inputPasswordModal').val();
                let uName = $('#inputUNameModal').val();
                localStorage.user = uName;
                localStorage.ip = userip;

                let err = false;
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                    err = true;
                    // Handle Errors here:
                    if (error) {
                        if (error.code === "auth/email-already-in-use") {
                            let pendingCred = 'null';
                            getProviderForProviderId(pendingCred, email, uName, password, true);
                        } else {
                            //PASS DYNAMIC INFO TO FIFTH MODAL:
                            $('#fifthModal .modal-title').html(error.code);
                            $('#fifthModal .modal-body').html("<center>" + error.message + "</center>");

                            //FIRE OFF FIFTH MODAL:
                            $('#fifthModalTrig').click();
                        }
                    }
                }).then(function() {
                    if (!err) {
                        let userid = firebase.auth().currentUser.uid;
                        localStorage.uid = userid;
                        setNewUName(userid, uName); /* ADD AUTH'D UNAME + UID TO DB */

                        setTimeout(function() {
                            goToApp();
                        }, 2000);
                    } else {
                        alert(error);
                    }
                });
            } else {
                $('#fourthModalTrig').click();

                return;
            }

            // ON EXIT: CLEAR OLD INPUTS & HIDE ALL USER FEEDBACK
            $('#inputEmailModal').val("");
            $('#inputPasswordModal').val("");
            $('#inputUNameModal').val("");
            $('#validName').hide();
            $('#invalidName').hide();
        }
    });


    $('#signinBtnModal').click(function() {
        isAuthedUser = firebase.auth().currentUser;
        let uidNo = (isAuthedUser === null) ? localStorage["uid"] : firebase.auth().currentUser.uid;

        // ADD USERNAME TO FIREBASE DATABASE, AND THEN LOGIN/GOTOAPP()
        let username = $('#uNameModal').val();

        if (username.length > 0 && username.length <= 10) {
            setNewUName(uidNo, username);

            // PASS GIVEN VALUES TO APP ON OTHER PAGE
            localStorage.uid = uidNo;
            localStorage.user = username;
            localStorage.email = $('#inputEmailModal').val();

            // MARINATE AND THEN BAKE
            setTimeout(function() {
                goToApp();
            }, 2300);

            return true;
        } else {

            return false;
        }
    });


    //ENGAGE READ ONLY MODE; LOGIN
    $('#dangerBtnModal').click(function() {
        setTimeout(function() {
            goToApp();
        }, 1000);
    });

    
    /*
     * Match text color to color theme of given background photo
     */
    $(document).ready(() => {
        (function loadBG() {
            let backgroundImgs = ['img/background0.jpg', 'img/background1.jpg', 'img/background2.jpg', 'img/background2.jpg', 'img/background3.jpg', 'img/background4.jpg', 'img/background4.jpg', 'img/background5.jpg', 'img/background5.jpg'];
        let randBG = function() {
            return Math.floor(Math.random() * 8);
        };
        let BGUrl = backgroundImgs[randBG()];

        if (BGUrl === 'img/background0.jpg') {
            $('a#registerNowLnk').css('color', '#121121');
            $('a#passResetLnk').css('color', '#4d4d4d');
        }

        if (BGUrl === 'img/background2.jpg' || BGUrl === 'img/background4.jpg') {
            $('a#registerNowLnk').css('color', '#FFFFFF');
        }

        if (BGUrl === 'img/background2.jpg') {
            $('span#greetTxt').css('color', '#333333');
        }

        if (BGUrl === 'img/background3.jpg') {
            $('span#greetTxt').css('color', '#C7AC98');
            $('span#greetTxt').css('font-weight', 'bold');
            $('label.checkbox').css('color', '#4E5572');
            $('a#passResetLnk').css('color', '#2C214A');
        }

        if (BGUrl === 'img/background1.jpg') {
            $('span#greetTxt').css('color', '#2A224B');
            $('span#greetTxt').css('font-weight', 'bold');
            $('.row h1').css('color', '#ECE9E4');
        }

        if (BGUrl === 'img/background0.jpg') {
            $('span#greetTxt').css('font-weight', 'bold');
        }
            
        $('.container').css('background', 'url(' + BGUrl + ')');
        $('.container').css('background-size', 'cover');
        $('.container').css('background-repeat', 'no-repeat');

        })();
      
        
        setTimeout(() => {
            loadBG();
        }, 2000);
        
    });


    function setInitCookie() {
        writeCookie("returnVisitor", true, 604800);
    }


    function getCookie(name) {
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
        }

        return "";
    }


    function checkInitialCookie() {
        let returned = getCookie("returnVisitor=");
        if (returned === "true" && localStorage.getItem('user') !== null) {
            $('#greetTxt').html('Hello, ' + localStorage.getItem('user') + '!');

            return true;
        } else {
            $('#greetTxt').html('Hi, New User!');
            $('#greetTxt').css('font-size', '.945em');
            setInitCookie();
        }
    }

    function checkForJWT() {
        let isUserRegd = localStorage['autoLogin'];
        if (isUserRegd === "true") {
            $('input#mainRememberMeChkBox').prop('checked', 'true');

            // QUERY WHAT LAST PROVIDER IS AND LOGIN USING IT
            let lastProvider = localStorage["lastProvider"];
            switch (lastProvider) {
                case "google.com":
                    $('#googleLoginBtn').click();
                    break;
                case "github.com":
                    $('githubLoginBtn').click();
                    break;
                case "password":
                    let encryptedPW = localStorage["pw"];
                    let k = $.getJSON('https://livelinks01125.firebaseio.com/crypt/' + localStorage["uid"] + '/key.json');
                    k.done(function(encodedKey) {
                        decodedKey = decodeURIComponent(encodedKey);
                        let email = localStorage['email'];

                        // Decrypt:
                        let plaintextPW = crypt.AES.decrypt(encryptedPW, decodedKey);

                        $('#emailInput').val(email);
                        $('#passwInput').val(plaintextPW);
                        $('#submitBtn').click();
                    });
                    break;
                default:
                    break;
            }
        }
    }


    function salty() {
        let letters = '0123456789ABCDEFGHIJKLMNO';
        let rand = '';
        for (var i = 0; i < 5; i++) {
            rand += letters[Math.floor(Math.random() * 24)];
        }

        return rand;
    }


    let keyGen = function() {
        let part1 = salty();
        let part2 = salty();
        let part3 = salty();
        let part4 = salty();
        let key = "" + part1 + part2 + part3 + part4;

        key = crypt.AES.encrypt(key);
        return key;
    };


    $('#cancelBtnModal, #cancelBtnModalSecond, #cancelBtnModalThird').mouseenter(function() {
        $(this).addClass('btn-danger whiteText').removeClass('btn-default');
    });

    $('#cancelBtnModal, #cancelBtnModalSecond, #cancelBtnModalThird').mouseleave(function() {
        $(this).removeClass('btn-danger whiteText').addClass('btn-default');
    });


    $('#aboutNavBtn').click(function() {
        $('#ninthModalTrig').click();
    });


    $('#resetPWOption').click(function() {
        $('#passResetLnk').click();
    });


    $('#registerAcctOption').click(function() {
        $('#registerNowLnk').click();
    });


    //SET PAGE UP FOR USAGE:
    checkInitialCookie();
    checkForJWT();

    
});
