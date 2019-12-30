({
    init: function(component, event, helper) {
        component.set('v.amountRecords', component.get('v.maxRecordsLimit'));
        helper.getData(component);
        helper.getCountContacts(component);
    },
    
    searchContacts : function(component, event, helper) {
        component.set("v.searchString", event.getParam("message"));
        component.set('v.amountRecords', component.get('v.maxRecordsLimit'));
        helper.getData(component);
        helper.getCountContacts(component);
    },
    
    addToListShow : function(component, event, helper) {
        component.set("v.amountRecords", component.get("v.amountRecords")+5);
        helper.getData(component);
    }
})