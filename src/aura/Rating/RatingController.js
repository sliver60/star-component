({
    doInit: function (component, event, helper) {
        helper.checkRating(component,helper);
//             var ratingElement = component.find("starRating").getElement();
// //            helper.checkRating(component);
//             helper.loadRatingElement(component, helper, ratingElement);
//             //Get current rating
//             var action = component.get("c.getCurrentRating");
//             action.setParams({
//                 recordId: component.get("v.recordId")
//             });
//             action.setCallback(this, function (response) {
//                 // update current rating attribute and set raty with current rating.
//
//                 component.set("v.currentRating", response.getReturnValue());
//                 $(ratingElement).raty('set', {score: response.getReturnValue()});
//                 $(".star-rating, .loading-div, .footer-contents").toggle();
//             });
//             $A.enqueueAction(action);

    },

    handleInsertRecord: function (component, event, helper) {
        helper.insertRating(component,helper);
    },

    handleDeleteRecord: function (component,event,helper) {
        helper.deleteRating(component,helper);
    }

})