({
    getData : function(component, event, helper) {
        var self = this;
        self.showSpinner(component);
        
        var action = component.get('c.getContacts');
        
        action.setParams({filterValue : component.get("v.searchString"), maxRecordsLimit : component.get('v.amountRecords')});
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.mydata', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
            self.hideSpinner(component);
        }));
        $A.enqueueAction(action);
    },
    
    getCountContacts : function(component) {
        var action = component.get("c.countContacts");

        action.setParams({filterValue : component.get("v.searchString")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.countContacts", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    showSpinner: function(component) {
		var spinnerMain =  component.find("Spinner");
		$A.util.removeClass(spinnerMain, "slds-hide");
	},
 
	hideSpinner : function(component) {
		var spinnerMain =  component.find("Spinner");
		$A.util.addClass(spinnerMain, "slds-hide");
	}
})