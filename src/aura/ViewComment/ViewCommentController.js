({
    // Handle component initialization
    doInit : function(component, event, helper) {
        // component.set('v.columns', [
        //     {label: 'User Name', fieldName: 'linkName', type: 'url',
        //         typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}},
        //     {label: 'Comment', fieldName: 'Comment__c', type: 'text'},
        // ]);
        helper.getUserName(component);
        var action = component.get("c.getUserIds");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function( response ) {
            var records = JSON.parse(response.getReturnValue());
//            console.log(records);
            var users = component.get("v.user");
                records.forEach(function(record){
                   var user = users.find(item => item.Id == record.userId);
                        record.userId = user;
//                        record.Comment__c = record.comment;
                    //console.log(record.linkName);
                });
            // records.forEach(function(record){
            //     users.forEach(function (user) {
            //      var user1= users.find(item => item.Id == record.userId);
            //      console.log(user1);
            //
            //             record.linkName = user.Name;
            //             record.Comment__c = record.comment;
            //
            //     });
//                console.log(users);
                // record.linkName = '/' + record.userId;
                // record.Comment__c = record.comment;
//            });
//            console.log(records);
            component.set("v.data", records);
        });
        $A.enqueueAction(action);
    },

    handlePostComment : function (component, event, helper) {
        helper.postComment(component,helper);
    },

    handleDeleteRecordEvent: function (component,event,helper) {
        helper.deleteRating(component,event,helper);
    }


})