({
    postComment : function (component) {
        var action = component.get("c.postComment");

        action.setParams({
            recordId : component.get("v.recordId"),
            comment : component.get("v.comment")
        });
        action.setCallback(this, function (response) {
            var records = JSON.parse(response.getReturnValue());
            var users = component.get("v.user");
//            console.log(users);
            records.forEach(function(record){
                var user = users.find(item => item.Id == record.userId);
                if (user != undefined) {
                    record.userId = user;
                    record.comment = record.comment;
                }
                if (user == undefined){
                   record.userId = 'test';
                   record.comment = record.comment;
                }

            });
            console.log(records);
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
    getUserName : function (component) {
        var action = component.get("c.getUserName");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
           var records = response.getReturnValue();
           // console.log(records.length);
//            var users = new Array();
// //           records.forEach(function (record) {
//                users.push(records);
// //           });
//            console.log(users);
            component.set("v.user",records);
        });
//        console.log(component.get("v.user"));
        $A.enqueueAction(action);
    }
})