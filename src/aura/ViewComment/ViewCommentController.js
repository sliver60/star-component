({
    // Handle component initialization
    doInit : function(component, event, helper) {
        component.set('v.columns', [
            {label: 'User Name', fieldName: 'linkName', type: 'url',
                typeAttributes: { fieldName: 'Name' },value:{fieldName: 'linkName'},target: '_blank'},
            {label: 'Comment', fieldName: 'Comment__c', type: 'text'},
        ]);
        var action = component.get("c.getUserIds");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function( response ) {
            var records = JSON.parse(response.getReturnValue());
            console.log(records);
            records.forEach(function(record){
                record.linkName = '/' + record.userId;
                record.Comment__c = record.comment;
            });
            component.set("v.data", records);
        });
        $A.enqueueAction(action);
    },

    handlePostComment : function (component, event, helper) {
        helper.postComment(component);
    }


})