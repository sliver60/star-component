public with sharing class RatingController {

    @AuraEnabled
    public static Double getCurrentRating(Id recordId) {
        Decimal currentRating = 0;
        Decimal score =0;
        Rating__c rating = [SELECT Record_Id__c, Vote__c,Json__c, Participant__c FROM Rating__c WHERE Record_Id__c = :recordId];
        List<RatingController.JSONWrapper> listJsonWrappers = (List<RatingController.JSONWrapper>) JSON.deserialize(rating.Json__c, List<RatingController.JSONWrapper>.class);
        for (JSONWrapper wrapper : listJsonWrappers) {
            score += wrapper.score;
        }

        if(rating.Participant__c == 1 && score == 0) {
            return currentRating.setScale(1, RoundingMode.CEILING);
        } else {
            currentRating = score / rating.Participant__c;
            return currentRating.setScale(1, RoundingMode.CEILING);
        }
    }

    @AuraEnabled (cacheable = false)
    public static Double updateRating(Id recordId, Decimal rating) {
        Rating__c updateRating = [SELECT Record_Id__c, Vote__c, Participant__c, Json__c FROM Rating__c WHERE Record_Id__c = :recordId];
        List<RatingController.JSONWrapper> listJsonWrappers = (List<RatingController.JSONWrapper>) JSON.deserialize(updateRating.Json__c, List<RatingController.JSONWrapper>.class);
        List<RatingController.JSONWrapper> updatelistJsonWrappers = new List<RatingController.JSONWrapper>();
        Map<Id,JSONWrapper> updateMap = new Map<Id, JSONWrapper>();
        User user = [SELECT Id FROM User WHERE Id =: UserInfo.getUserId()];

        JSONWrapper wrapper = new JSONWrapper();
        wrapper.userId = user.Id;
        wrapper.score = rating;

        for (JSONWrapper jsWrapper : listJsonWrappers) {
            updateMap.put(jsWrapper.userId, jsWrapper);
        }

        if (updateMap.containsKey(wrapper.userId)) {
            JSONWrapper oldComment = updateMap.get(wrapper.userId);
            if (oldComment.score != wrapper.score) {
                oldComment.score = wrapper.score;
                updateMap.put(wrapper.userId, oldComment);
            }
        } else if (! updateMap.containsKey(wrapper.userId)) {
            updateMap.put(wrapper.userId, wrapper);
            updateRating.Participant__c += 1;
        }

        updatelistJsonWrappers.addAll(updateMap.values());
        updateRating.Json__c = JSON.serialize(updatelistJsonWrappers);

        update updateRating;
        Decimal currentScore = getCurrentRating(recordId);
        return currentScore.setScale(1, RoundingMode.CEILING);
    }

    @AuraEnabled
    public static Double createNewRating(Id recordId) {
        Rating__c rating = new Rating__c(Record_Id__c = recordId, Vote__c = 0, Participant__c = 1);
        List<RatingController.JSONWrapper> newListJsonWrappers = new List<RatingController.JSONWrapper>();
        List<RatingController.StringWrapper> newListStringWrappers = new List<RatingController.StringWrapper>();
        JSONWrapper wrapper = new JSONWrapper();
        wrapper.userId = UserInfo.getUserId();
        wrapper.score = 0;
        newListJsonWrappers.add(wrapper);
        StringWrapper stringWrapper = new StringWrapper();
        stringWrapper.userId = UserInfo.getUserId();
        stringWrapper.comment = '';
        newListStringWrappers.add(stringWrapper);
        rating.Json__c = JSON.serialize(newListJsonWrappers);
        rating.Comments__c = JSON.serialize(newListStringWrappers);
        Decimal currentScore = 0;
        insert rating;
        return currentScore.setScale(1, RoundingMode.CEILING);
//        return 'Suc';
    }

    @AuraEnabled (cacheable = false)
    public static Boolean checkRating(Id recordId) {
        List<Rating__c> rating = [SELECT Id FROM Rating__c WHERE Record_Id__c =: recordId];
        return !rating.isEmpty() ? true : false;
    }

    public class JSONWrapper {
        public Id userId;
        public Decimal score;
    }

    public class StringWrapper {
        public Id userId;
        public String comment;
    }
}