@IsTest
public with sharing class TestRatingController {

    @testsetup
    static void setup() {

        Contact testContact = new Contact(LastName = 'TestContact');
        insert testContact;
    }

    @IsTest
    public static void createNewTestRating() {
        Contact testContact = [SELECT Id FROM Contact WHERE LastName = 'TestContact'];
        Test.startTest();
            RatingController.createNewRating(testContact.Id);
            RatingController.checkRating(testContact.Id);
            RatingController.updateRating(testContact.Id, 2.3);
            RatingController.getCurrentRating(testContact.Id);
        Test.stopTest();
    }

    public class StringWrapper {
        public Id userId;
        public String comment;
    }

}