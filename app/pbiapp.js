var pbiAppName='PBITest';
var pbiAppType='Server-side Web app';
var clientId='d624bfd0-6ed9-4bb4-8548-6d70c76854d4';
var clientSecret='ZR7JH2o8oqhyFuZRqsAWdxGetxmnwipbTCp/zxfNxUA=';
var homUrl='http://localhost:9002/index.html';
var returnUrl='http://localhost:9002/return.html';
var resourceUrl='https://analysis.windows.net/powerbi/api';
var responseType='code';

var initLogin = function(){
    console.debug('app ready for redirect to sign in!');
    var loginUrl = 'https://login.windows.net/common/oauth2/authorize?response_type='+responseType+'&resource='+resourceUrl+'&client_id='+clientId+'&redirect_uri='+returnUrl;
    $(location).attr('href', loginUrl);
}    

var setSession = function(){
    console.debug('app ready for redirect to sign in!');
} 

$(document).ready(function(){
    console.debug('app loaded!');
   
});