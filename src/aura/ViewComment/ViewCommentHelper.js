
({
    postComment : function (component) {
        var action = component.get("c.postComment");
        action.setParams({
            recordId : component.get("v.recordId"),
            comment : component.get("v.comment")
        });
        action.setCallback(this, function (response) {
            var records = JSON.parse(response.getReturnValue());
            console.log(records);
            records.forEach(function(record){
                record.linkName = helper.getUserName(component,record.userId);
                record.Comment__c = record.comment;
            });
            component.set("v.data", records);
            component.set("v.comment", '');
        });
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "Post created",
            "type": 'success'
        });
        toastEvent.fire();
        $A.enqueueAction(action);
    },
    getUserName : function (component,userId) {
        var action = component.get("c.getUserName");
        action.setParams({
            userId : userId
        });
        action.setCallback(this, function (response) {
           var records = response.getReturnValue();
           records.forEach(function (record) {
              record.linkName = record.Name;
           });
        });
        $A.enqueueAction(action);
    }
})