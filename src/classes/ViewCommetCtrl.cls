public with sharing class ViewCommetCtrl {

    @AuraEnabled
    public static String getUserIds (Id recordId) {
        Rating__c rating = [SELECT Comments__c FROM Rating__c WHERE Record_Id__c =: recordId];
        return rating.Comments__c;
    }

    @AuraEnabled (cacheable = false)
    public static String postComment (Id recordId, String comment) {
        Map<Id,StringWrapper> updateMap = new Map<Id, StringWrapper>();
        List<ViewCommetCtrl.StringWrapper> newListStringWrappers = new List<ViewCommetCtrl.StringWrapper>();
        Rating__c rating = [SELECT Record_Id__c, Comments__c FROM Rating__c WHERE Record_Id__c = :recordId];
        User user = [SELECT Id FROM User WHERE Id =: UserInfo.getUserId()];
        StringWrapper str = new StringWrapper();
        str.userId = user.Id;
        str.comment = comment;

        if(rating.Comments__c != null) {
            List<ViewCommetCtrl.StringWrapper> listStringWrappers = (List<ViewCommetCtrl.StringWrapper>) JSON.deserialize(rating.Comments__c, List<ViewCommetCtrl.StringWrapper>.class);

            for (StringWrapper stringWrapper : listStringWrappers) {
                updateMap.put(stringWrapper.userId, stringWrapper);
            }

            if (updateMap.containsKey(str.userId)) {
                StringWrapper oldComment = updateMap.get(str.userId);
                if (oldComment.comment != str.comment) {
                    oldComment.comment = str.comment;
                    updateMap.put(str.userId, oldComment);
                }
            } else if (!updateMap.containsKey(str.userId)) {
                updateMap.put(str.userId, str);
            }

            newListStringWrappers.addAll(updateMap.values());
            rating.Comments__c = JSON.serialize(newListStringWrappers);
            update rating;
        } else {
            newListStringWrappers.add(str);
            rating.Comments__c = JSON.serialize(newListStringWrappers);
            update rating;
        }
        return rating.Comments__c;
    }

    @AuraEnabled
    public static List<User> getUserName (Id recordId) {
        List<User> users = new List<User>();
        Rating__c rating = [SELECT Id, Comments__c FROM Rating__c WHERE Record_Id__c = :recordId];

        if (rating.Comments__c != null) {
            List<ViewCommetCtrl.StringWrapper> listStringWrappers = (List<ViewCommetCtrl.StringWrapper>) JSON.deserialize(rating.Comments__c, List<ViewCommetCtrl.StringWrapper>.class);
            for (StringWrapper stringWrapper : listStringWrappers) {
                User user = [SELECT Id,Name FROM User WHERE Id =: stringWrapper.userId];
                users.add(user);
            }
        } else {
            User user = [SELECT Id,Name FROM User WHERE Id =: UserInfo.getUserId()];
            users.add(user);
        }
        system.debug('user--- ' + users);
        return users;
    }

    @AuraEnabled
    public static void deleteRating (Id recordId) {
        Rating__c rating = [SELECT Id FROM Rating__c WHERE Record_Id__c =: recordId];
        system.debug(rating);
        delete rating;
    }

    public class StringWrapper {
        public Id userId;
        public String comment;
    }
}