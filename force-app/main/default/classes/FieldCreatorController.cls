public with sharing class FieldCreatorController {

    @AuraEnabled
    public static String createCustomField(String metadata){
        try {
            return submitMetadataRequest(metadata);
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static String submitMetadataRequest(String metadata) {
        HttpRequest request = new HttpRequest();
        request.setHeader('Authorization', 'Bearer ' +  Page.SessionGenerator.getContent().toString().trim());
        request.setHeader('Content-Type', 'application/json');
        request.setEndpoint(Url.getSalesforceBaseUrl().toExternalForm()+'/services/data/v58.0/tooling/sobjects/CustomField');
        request.setMethod('POST');
        request.setBody(metadata);

        Http http = new Http();
        HttpResponse res = http.send(request);

        return res.getBody();
    }

}