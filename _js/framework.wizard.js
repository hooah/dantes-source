framework.wizard = {
    fn: {
        init: function() {
            if (jQuery('.wizard-examination').length) {
                framework.wizard.exam.fn.init();
            }
            if (jQuery('.wizard-distance-learning').length) {
                framework.wizard.dlrsa.fn.init();
            }
            if (jQuery('.wizard-education-benefits').length) {
                framework.wizard.edbenefits.fn.init();
            }
        }
    }
};