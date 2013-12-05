var getAccessTokenParams = function() {
    
    var baseURL = "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13";
    var clientId = "translatejs";
    var clientSecret = "IUs1plVcshQmAkKjJRm4IyCF7Fsl3WUxy5AJTBsw5Gc=";
    
    var request = {
	"grant_type": "client_credentials",
	"client_id": clientId,
	"client_secret": clientSecret,
	"scope": "http://api.microsofttranslator.com"
    };  
        
    return {
	"url": baseURL,
	"request": request
    }   

}
