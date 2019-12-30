public with sharing class RatingController {

    @AuraEnabled
    public static Integer getCurrentRating(Id recordId) {
        Integer currentRating = 0;
        Integer score =0;
        Rating__c rating = [SELECT Record_Id__c, Vote__c,Json__c, Participant__c FROM Rating__c WHERE Record_Id__c = :recordId];
        List<RatingController.JSONWrapper> listJsonWrappers = (List<RatingController.JSONWrapper>) JSON.deserialize(rating.Json__c, List<RatingController.JSONWrapper>.class);
        for (JSONWrapper wrapper : listJsonWrappers) {
            score += wrapper.score;
            currentRating = score / Integer.valueOf(rating.Participant__c);
        }
        return currentRating;
    }

    @AuraEnabled
    public static Integer updateRating(Id recordId, Decimal rating) {
        Rating__c updateRating = [SELECT Record_Id__c, Vote__c, Participant__c, Json__c FROM Rating__c WHERE Record_Id__c = :recordId];
        List<RatingController.JSONWrapper> listJsonWrappers = (List<RatingController.JSONWrapper>) JSON.deserialize(updateRating.Json__c, List<RatingController.JSONWrapper>.class);
        List<RatingController.JSONWrapper> updatelistJsonWrappers = new List<RatingController.JSONWrapper>();

        JSONWrapper wrapper = new JSONWrapper();
        wrapper.userId = UserInfo.getUserId();
        wrapper.score = Integer.valueOf(rating);

        for (JSONWrapper jsWrapper : listJsonWrappers) {
            if(jsWrapper.userId == wrapper.userId && jsWrapper.score != wrapper.score){
                jsWrapper.score = Integer.valueOf(rating);
                break;
            } else {
                updatelistJsonWrappers.add(wrapper);
                updateRating.Participant__c += 1;
                updateRating.Vote__c += 1;
            }
        }

        updatelistJsonWrappers.addAll(listJsonWrappers);
        updateRating.Json__c = JSON.serialize(updatelistJsonWrappers);

        if (updateRating.Vote__c == 0 && updateRating.Participant__c == 0) {
            updateRating.Participant__c += 1;
            updateRating.Vote__c += 1;
        }

        update updateRating;
        Integer currentScore = getCurrentRating(recordId);
        return currentScore;
    }

    @AuraEnabled
    public static Integer createNewRating(Id recordId) {
        Rating__c rating = new Rating__c(Record_Id__c = recordId, Vote__c = 0, Participant__c = 0);
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
        insert rating;
        return Integer.valueOf(rating.Vote__c);
//        return 'Suc';
    }

    @AuraEnabled
    public static Integer getUserRating(Id recordId) {
        Integer userScore;
        Rating__c rating = [SELECT Json__c FROM Rating__c WHERE Record_Id__c = :recordId];
        List<RatingController.JSONWrapper> listJsonWrappers = (List<RatingController.JSONWrapper>) JSON.deserialize(rating.Json__c, List<RatingController.JSONWrapper>.class);
        for (JSONWrapper wrapper : listJsonWrappers) {
            if(wrapper.userId == UserInfo.getUserId()){
                userScore = wrapper.score;
            }
        }
        system.debug(userScore);
        return userScore;
    }

//    @AuraEnabled
//    public static void postComment (Id recordId, String comment) {
//        List<RatingController.StringWrapper> updateComment = new List<RatingController.StringWrapper>();
//        Rating__c rating = [SELECT Comments__c FROM Rating__c WHERE Record_Id__c = :recordId];
//        List<RatingController.StringWrapper> listStringWrappers = (List<RatingController.StringWrapper>) JSON.deserialize(rating.Comments__c, List<RatingController.StringWrapper>.class);
//        StringWrapper str = new StringWrapper();
//        str.userId = UserInfo.getUserId();
//        str.comment = comment;
//
//        for (StringWrapper stringWrapper : listStringWrappers) {
//            if(stringWrapper.userId == str.userId && stringWrapper.comment != str.comment){
//                stringWrapper.comment = comment;
//                break;
//            } else {
//                updateComment.add(str);
//            }
//        }
//        updateComment.addAll(listStringWrappers);
//        rating.Comments__c = JSON.serialize(updateComment);
//        update  rating;
//    }

    public class JSONWrapper {
        public Id userId;
        public Integer score;
    }

    public class StringWrapper {
        public Id userId;
        public String comment;
    }
}