public with sharing class ContactComponentController {
    
    static String checkString(String param) {
        if (String.isBlank(param)){
            return '%';
        }
        return '%' + param + '%';
    }
    
    @AuraEnabled
    public static List<Contact> getContacts(String filterValue, Integer maxRecordsLimit) {
        String expression = checkString(filterValue);
        List<Contact> contacts = [SELECT ID, Name, FirstName, LastName, Phone, MobilePhone, Email, Account.Name
                                  FROM Contact
                                  WHERE Name LIKE :expression
                                  OR Phone LIKE :expression
                                  OR Email LIKE :expression
                                  ORDER BY LastModifiedDate DESC
                                  LIMIT :Integer.valueof(maxRecordsLimit)];
        return contacts;
	}
    
    @AuraEnabled
    public static Integer countContacts(String filterValue) {
        String expression = checkString(filterValue);
        AggregateResult count = [SELECT Count(ID) CountContacts
                                 FROM Contact
                                 WHERE Name LIKE :expression
                                 OR Phone LIKE :expression
                                 OR Email LIKE :expression];
        Integer countContacts = (Integer)count.get('CountContacts');
        return countContacts;
	}
}