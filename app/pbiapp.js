var pbiAppName='PBITest';
var pbiAppType='Server-side Web app';
var clientId='d624bfd0-6ed9-4bb4-8548-6d70c76854d4';
var clientSecret='ZR7JH2o8oqhyFuZRqsAWdxGetxmnwipbTCp/zxfNxUA=';
var homUrl='http://localhost:9002/index.html';
var returnUri='http://localhost:9002/return.html';
var resourceUri='https://analysis.windows.net/powerbi/api';
var responseType='code';
var context;
var initLogin = function(){
    console.debug('app ready for redirect to sign in!');
    var loginUrl = 'https://login.windows.net/common/oauth2/authorize?response_type='+responseType+'&resource='+resourceUrl+'&client_id='+clientId+'&redirect_uri='+returnUrl;
    $(location).attr('href', loginUrl);
}    

var setSession = function(){
    console.debug('app ready for redirect to sign in!');
    var code = urlParam('code');
    var session_state = urlParam('session_state');

    console.log(code);
    console.log(session_state);
} 
var adlLogin = function(){
    
    //context.login();
}


$(document).ready(function(){
    console.debug('app loaded!');
   
});
