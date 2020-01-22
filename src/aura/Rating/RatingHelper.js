({
    loadRatingElement: function (component, helper, ratingElement) {

        $(ratingElement).raty({  
            starOff: $A.get('$Resource.RatingPlugin') + '/images/star_off-darkgray.svg',
            starOn: $A.get('$Resource.RatingPlugin') + '/images/star_p.svg',
            starHalf: $A.get('$Resource.RatingPlugin') + '/images/halfstar.svg',
            half: true,
            halfShow: true,
            // precision: true,
            round : { down: .26, full: .6, up: .76 },
            
            click: function (score, evt) {
                if (score == null) score = component.get("v.currentRating");
                alert(score.toFixed(2));
                    var result = confirm('Click OK button to confirm update Rating.');
                    if (result) {
                        component.set("v.currentRating", score);
                        helper.updateRating(component);
                        $(".star-rating, .loading-div, .footer-contents").toggle();
                    }else {
                        return false;
                    }
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