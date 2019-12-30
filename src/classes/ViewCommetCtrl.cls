public with sharing class ViewCommetCtrl {
    @AuraEnabled
    public static String getUserIds (Id recordId) {
        Rating__c rating = [SELECT Comments__c FROM Rating__c WHERE Record_Id__c =: recordId];
        return rating.Comments__c;
    }

    @AuraEnabled
    public static String postComment (Id recordId, String comment) {
        List<ViewCommetCtrl.StringWrapper> updateComment = new List<ViewCommetCtrl.StringWrapper>();
        Rating__c rating = [SELECT Comments__c FROM Rating__c WHERE Record_Id__c = :recordId];
        List<ViewCommetCtrl.StringWrapper> listStringWrappers = (List<ViewCommetCtrl.StringWrapper>) JSON.deserialize(rating.Comments__c, List<ViewCommetCtrl.StringWrapper>.class);
        StringWrapper str = new StringWrapper();
        str.userId = UserInfo.getUserId();
        str.comment = comment;

        for (StringWrapper stringWrapper : listStringWrappers) {
            if(stringWrapper.userId == str.userId && stringWrapper.comment != str.comment){
                stringWrapper.comment = comment;
                break;
            } else {
                updateComment.add(str);
            }
        }
        updateComment.addAll(listStringWrappers);
        rating.Comments__c = JSON.serialize(updateComment);
        update  rating;
        return rating.Comments__c;
    }

    @AuraEnabled
    public static User getUserName (Id userId) {
        User user = [SELECT Id,Name FROM User WHERE Id =: userId];
        system.debug('user--- ' + user);
        return user;
    }

        public class StringWrapper {
        public Id userId;
        public String comment;
    }
}