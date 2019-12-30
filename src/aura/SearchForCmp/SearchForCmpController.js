({
    fireSearchEvent : function(component, event, helper) {
        var isEnterKey = event.keyCode === 13;
        if (isEnterKey || event.keyCode === undefined) {
            var cmpEvent = component.getEvent("stringCmpEvent");
            var filter = component.get("v.searchString");
            cmpEvent.setParams({"message" : filter });
            cmpEvent.fire();
        }
    }
})