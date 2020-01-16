({
    loadRatingElement: function (component, helper, ratingElement) {
        $(ratingElement).raty({
            starOff: '/resource/RatingPlugin/images/star_off_darkgray.png',
            starOn: '/resource/RatingPlugin/images/star_p.png',
            starHalf: '/resource/RatingPlugin/images/star-half-mono.png',
            half: true,
            halfShow: true,
            click: function (score, evt) {
                if (score == null) score = component.get("v.currentRating");
                    var result = confirm('Click OK button to confirm update Rating.');
                    if (result) {
                        component.set("v.currentRating", score);
                        helper.updateRating(component);
                        $(".star-rating, .loading-div, .footer-contents").toggle();
//                     helper.getCurrentRating(component);
//                     $(".star-rating, .loading-div, .footer-contents").toggle();
                    }
//                helper.getCurrentRating(component);
//                $(".star-rating, .loading-div, .footer-contents").toggle();
//                 if(component.get("v.currentRating") != score ){
//                     var result = confirm('Click OK button to confirm update Rating.');
//                     if( result ){
//                         component.set("v.newRating", score);
// //                        component.get("v.currentRating");
//                         $(".star-rating, .loading-div, .footer-contents").toggle();
// //                        helper.getCurrentRating(component);
//                         helper.updateRating( component );
// //                        helper.getUserRating(component);
//                     }else{
//                         return false;
//                     }
//                 }
            },
        });
    },
    updateRating: function (component) {
        var ratingElement = component.find("starRating").getElement();
        // update record with new rating.
        var action = component.get("c.updateRating");
        action.setParams({
            recordId: component.get("v.recordId"),
            rating: component.get("v.currentRating")
        });
        action.setCallback(this, function (response) {
            component.set("v.currentRating", response.getReturnValue());
            console.log(response.getReturnValue());
            $(ratingElement).raty('set', {score: response.getReturnValue()});
            $(".star-rating, .loading-div, .footer-contents").toggle();
        });
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "You have successfully voted",
            "type": 'success'
        });
        toastEvent.fire();
        $A.enqueueAction(action);
    },

    insertRating: function (component, helper) {
        var self = this;
        var action = component.get("c.createNewRating");
        action.setParams({
            recordId: component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            component.set("v.currentRating", response.getReturnValue());
            component.set("v.showBool", true);
            self.checkRating(component, helper);

        });
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "Rating created",
            "type": 'success'
        });
        toastEvent.fire();
        $A.enqueueAction(action);
    },

    getCurrentRating: function (component, helper) {
        var ratingElement = component.find("starRating").getElement();
        var self = this;
        self.loadRatingElement(component, helper, ratingElement);

        var action = component.get("c.getCurrentRating");
        action.setParams({
            recordId: component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            // update current rating attribute and set raty with current rating.
            component.set("v.currentRating", response.getReturnValue());
            console.log(component.get("v.currentRating"));
            $(ratingElement).raty('set', {score: response.getReturnValue()});
            $(".star-rating, .loading-div, .footer-contents").toggle();
        });
        $A.enqueueAction(action);
    },
    checkRating: function (component, helper) {
        var self = this;

        var action = component.get("c.checkRating");
        action.setParams({
            recordId: component.get("v.recordId")
        });
        action.setCallback(this, function (response) {
            var result = response.getReturnValue();
            console.log(result);
            if (result) {
                component.set("v.showBool", result);
                self.getCurrentRating(component, helper);
            } else {
                component.set("v.showBool", false);
            }

        });
        $A.enqueueAction(action);
    },

})