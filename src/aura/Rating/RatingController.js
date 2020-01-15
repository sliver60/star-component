({
    doInit: function (component, event, helper) {
//        var result = component.
//        helper.checkRating(component,helper);
            var ratingElement = component.find("starRating").getElement();
//            helper.checkRating(component);
            helper.loadRatingElement(component, helper, ratingElement);
            //Get current rating
            var action = component.get("c.getCurrentRating");
            action.setParams({
                recordId: component.get("v.recordId")
            });
            action.setCallback(this, function (response) {
                // update current rating attribute and set raty with current rating.

                component.set("v.currentRating", response.getReturnValue());
                $(ratingElement).raty('set', {score: response.getReturnValue()});
                $(".star-rating, .loading-div, .footer-contents").toggle();
            });
            $A.enqueueAction(action);

    },

    handleInsertRecord: function (component, event, helper) {
        helper.insertRating(component,helper);
    },

//     handleUserRating: function (component, event, helper) {
//         // var ratingUserElement = component.find("starUserRating").getElement().value();
//         // console.log(ratingUserElement);
//         // helper.loadUserRatingElement( component, helper, ratingUserElement);
// //        helper.getUserRating(component,event,helper);
//         var action = component.get("c.getUserRating");
//         action.setParams({
//             recordId: component.get("v.recordId")
//         });
//         action.setCallback(this, function (response) {
//             component.set("v.userRating", response.getReturnValue());
//             // $(ratingUserElement).raty('set', { score: response.getReturnValue() });
//             // $(".star-user-rating, .loading-div, .footer-contents").toggle();
//         });
//         $A.enqueueAction(action);
//     },

})