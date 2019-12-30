({
    loadRatingElement: function(component, helper, ratingElement){
        $( ratingElement ).raty({
            starOff  : '/resource/RatingPlugin/images/star_off_darkgray.png',
            starOn   : '/resource/RatingPlugin/images/star_on.png',
            click: function(score, evt) {
                if(score == null ) score = 0;
                if(component.get("v.currentRating") != score ){
                    var result = confirm('Click OK button to confirm update Rating.');
                    if( result ){
                        component.set("v.newRating", score);
//                        component.get("v.currentRating");
                        $(".star-rating, .loading-div, .footer-contents").toggle();
//                        helper.getCurrentRating(component);
                        helper.updateRating( component );
                        helper.getUserRating(component);
                    }else{
                        return false;
                    }
                }
            }
        });
    },
    updateRating : function(component){
        // update record with new rating.
        var action = component.get("c.updateRating");
        action.setParams({
            recordId : component.get("v.recordId"),
            rating : component.get("v.newRating")
        });
        action.setCallback(this, function( response ){
            component.set( "v.currentRating", response.getReturnValue());
            $(".star-rating,.loading-div, .footer-contents").toggle();
//            component.set("v.userRating", component.get("v.newRating"));
//            $(".star-rating,.loading-div, .footer-contents").toggle();
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

    insertRating : function (component) {
        var action = component.get("c.createNewRating");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function( response ){
            component.set( "v.currentRating", response.getReturnValue());
//            component.set("v.showBool",true);

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

    getUserRating : function (component) {
        var action = component.get("c.getUserRating");
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function( response ) {
            component.set("v.userRating", response.getReturnValue());
        });
        $A.enqueueAction(action);
    },

    getCurrentRating : function (component) {
        var action = component.get("c.getCurrentRating");
        action.setParams({
            recordId : component.get("v.recordId"),
        });
        action.setCallback(this, function( response ){
            component.set( "v.currentRating", response.getReturnValue());
            $(".star-rating, .loading-div, .footer-contents").toggle();
        });
        $A.enqueueAction(action);
    }

    // postComment : function (component) {
    //     var action = component.get("c.postComment");
    //     action.setParams({
    //         recordId : component.get("v.recordId"),
    //         comment : component.get("v.myVal")
    //     });
    //     action.setCallback(this, function (response) {
    //             alert('Success Post')
    //     });
    //     $A.enqueueAction(action);
    // }
})