window.config = {
    tenant: '<your tenant name>',
    clientId: '<your client id>',
    redirectUri: 'http://powerbijsembed.azurewebsites.net/return.html',
    postLogoutRedirectUri: window.location.origin,
    prompt: 'none',
    instance: 'https://login.windows.net/',
    endpoints: 'https://analysis.windows.net/powerbi/api',
    resource: 'https://analysis.windows.net/powerbi/api',
    cacheLocation: 'localStorage'
};
var apiUri = {
    workspaceCollections: 'https://management.azure.com/subscriptions/69192501-537c-4690-ae7f-f2fa49a34e49/providers/Microsoft.PowerBI/workspaceCollections?api-version=2016-01-29',
    report: 'https://app.powerbi.com/reportEmbed?reportId=',
    groupList: 'https://api.powerbi.com/v1.0/myorg/groups',
    groupReportList: 'https://api.powerbi.com/v1.0/myorg/groups/{id}/reports',
    reportList: 'https://api.powerbi.com/v1.0/myorg/reports',
    dashboardUri: ''
}
var pbiAppUri = {
    home: '/index.html',
    reports: '/reports.html',
    groups: '/groups.html',
}
window.sessionStorage = {};
var authContext = new AuthenticationContext(window.config);
var loggedUser;
var groupReportList = [];

$(document).ready(function () {
    try {
        var loggedUser = authContext.getCachedUser();
        if (loggedUser == null) { return; }
        console.log(loggedUser);
        $("#loggedUser").html(loggedUser.profile.name);
        window.config.token = authContext.getCachedToken(window.config.resource);
    } catch (e) {

    }
});

var authLogin = function () {
    console.log('trying to login using ADL!');
    console.log(authContext);
    authContext.login();
};

var setJWTToken = function (error, token) {
    if (error || !token) {
        //if it fails with error AADSTS50058 which is caused due to how browser handles cookie
        //then force user to go to login page again.
        if (("" + error).indexOf("AADSTS50058") >= 0) {
            authContext.login();
        } else {
            console.log('ADAL error occurred: ' + error);
            return;
        }
    }
    //authContext._saveItem(authContext.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY, token);
    //console.log('token');
    //console.log(authContext.getCachedToken(window.config.resource));
    if (authContext.getCachedToken(window.config.resource).trim() == 0) {
        console.error('Token is empty!');
        return;
    }
    $(location).attr('href', pbiAppUri.reports);
};



var setToken = function () {
    var hash = window.location.hash;
    console.debug('app ready for redirect to sign in!');
    var requestInfo = authContext.getRequestInfo(hash);
    console.log(requestInfo);
    authContext.saveTokenFromHash(requestInfo);

    authContext.acquireToken(window.config.resource, setJWTToken);
};

var loadReports = function () {
    loadGroups();
}

var loadGroups = function () {
    console.debug('loading groups/workspace!');
    getCall(apiUri.reportList, addMyWorkspaceReporList);
}

var addMyWorkspaceReporList = function (data) {
    var myworkSpaceReports = { name: "My Workspace", id: '', reports: [data.value] };
    groupReportList.push(myworkSpaceReports);
    loadItinerary().done(function () {
        console.log(groupReportList);
        
        var ulArr = $.map(groupReportList, function (group) {
            var grpDiv = '<li class="nav-item">' + group.name + '</li><ul class="nav flex-column">';
            $.map(group.reports[0], function (report) {
                if (report !== undefined) {
                    //var jsonReport = JSON.stringify(report);
                    grpDiv += '<li class="nav-item" data-groupId="' + group.id + '" data-reportId="' + report.id 
                                + '" onclick=runReport("' + report.embedUrl + '")>' 
                                + '<a class="nav-link" href="#">'
                                + report.name + '</a></li>';
                }
            });
            return grpDiv + '</ul></li>';
        });
        $('#groupList').html(ulArr);
    });
}

var loadItinerary = function () {
    var dfd = jQuery.Deferred();
    getCall(apiUri.groupList
        , function (data) {

            $.each(data.value, function (index, item) {
                var newWorkspace = { name: item.name, id: item.id, reports: [] };
                var groupUri = apiUri.groupReportList.replace('{id}', newWorkspace.id);
                getCall(groupUri, function (data) {
                    //console.log('data.value');
                    //console.log(data.value);
                    //return;
                    if (data.value !== undefined) {
                        newWorkspace.reports.push(data.value);
                        groupReportList.push(newWorkspace);
                    }
                    dfd.resolve();
                });
            });
        });
    return dfd;
}

var runReport = function (embedUrl) {
    console.log(embedUrl);
    var iframe = document.getElementById('ifReport');
    iframe.src = embedUrl;
    iframe.onload = postActionAddTokenReport;
}
var postActionAddTokenReport = function () {
    var message = { action: 'loadReport', accessToken: window.config.token, height: 500, width: 600 };
    message = JSON.stringify(message);
    iframe = document.getElementById('ifReport');
    iframe.contentWindow.postMessage(message, "*");
    console.log('Posting authentication message to embed url completed.');
}
var getCall = function (uri, callbackFunc) {
    //console.log('ajax get init!');
    $.ajax({
        type: "GET",
        url: uri,
        dataType: 'json',
        async: false,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + window.config.token);
        },
        success: function (data) {
            //console.log('getCall data');
            //console.log(data);
            callbackFunc(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(errorThrown);
        }
    });
}
