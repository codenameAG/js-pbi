window.config = {
    tenant: 'orioninc.com',
    clientId: 'd624bfd0-6ed9-4bb4-8548-6d70c76854d4',
    redirectUri: 'http://localhost:9002/return.html?',
    instance: 'https://login.windows.net/',
    endpoints: 'https://analysis.windows.net/powerbi/api',
    cacheLocation: 'localStorage'
};
window.sessionStorage={};
var authContext = new AuthenticationContext(window.config);
var loggedUser;
var setJWTToken = function(token){
    console.log('JWTToken');
    console.log(token);
};

var authLogin = function(){
    console.log('trying to login using ADL!');
    console.log(authContext);
    authContext.login();
};

var setToken = function(){
    var hash = window.location.hash;
    //console.log(hash);
    //if (_adal.isCallback(hash)) {
        // callback can come from login or iframe request

      //  var requestInfo = _adal.getRequestInfo(hash);
       // _adal.saveTokenFromHash(requestInfo);
    console.debug('app ready for redirect to sign in!');

    var requestInfo = authContext.getRequestInfo(hash);
    console.log(requestInfo);
    authContext.saveTokenFromHash(requestInfo);
    var loggedUser = authContext.getCachedUser();
    console.log(loggedUser);
    authContext.acquireToken('https://analysis.windows.net/powerbi/api?response_type=client_credentials',setJWTToken);
    //var id_token = urlParam('id_token');
    //var session_state = urlParam('session_state');
    //console.log(id_token);
    //console.log(session_state);
    //localStorage.setItem(authContext.CONSTANTS.STORAGE.IDTOKEN,id_token);
    //localStorage.setItem(authContext.CONSTANTS.STORAGE.SESSION_STATE,session_state);
    //var loggedUser = authContext.getCachedUser();
    //console.log(loggedUser);
    //authContext.acquireToken('https://analysis.windows.net/powerbi/api',myfunc);    
};