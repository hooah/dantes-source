framework.wizard.edbenefits = {
    data: {
        container: null,
        animation: {
            speed: 500
        }
    }, 
    fn: {
        init: function() {
            framework.wizard.edbenefits.data.container      = jQuery('.wizard-education-benefits');

            jQuery('>section>.grid>ol>li>a', framework.wizard.edbenefits.data.container).bind('click', framework.wizard.edbenefits.fn.show_toplevel_section);
            jQuery('>header>nav>ul>li.home>a', framework.wizard.edbenefits.data.container).bind('click', framework.wizard.edbenefits.fn.return_to_grid);
            jQuery('>section>.subject .section>footer>nav>a', framework.wizard.edbenefits.data.container).bind('click', framework.wizard.edbenefits.fn.navigate_subject_page);
            jQuery('>section>.grid', framework.wizard.edbenefits.data.container).addClass('selected');
        },

        return_to_grid: function(objEvent) {
            objEvent.preventDefault();

            if (!jQuery('>section>div.grid', framework.wizard.edbenefits.data.container).hasClass('selected')) {
                jQuery('>section>div', framework.wizard.edbenefits.data.container).stop();
                jQuery('>section>div.selected', framework.wizard.edbenefits.data.container)
                    .css({display: 'block', opacity: 1})
                    .animate({opacity: 0}, framework.wizard.edbenefits.data.animation.speed, function() {
                        jQuery(this).css({display: 'none', opacity: 0}).removeClass('selected');

                        jQuery('>footer>menu>ul>li.print', framework.wizard.edbenefits.data.container).hide();
                        jQuery('>header>nav>ul>li.sections>ol', framework.wizard.edbenefits.data.container).removeClass('chosen');
                        jQuery('>section>div.grid', framework.wizard.edbenefits.data.container)
                            .addClass('selected')
                            .css({display: 'block', opacity: 0})
                            .animate({opacity: 1}, framework.wizard.edbenefits.data.animation.speed);
                    });
            }
        },

        show_toplevel_section: function(objEvent) {
            objEvent.preventDefault();

            var strSection          = jQuery(this).attr('data-section');

            if (strSection.length) {
                jQuery('>header>nav>ul>li.sections>ol', framework.wizard.edbenefits.data.container).removeClass('chosen');
                jQuery('>header>nav>ul>li.sections>ol>li', framework.wizard.edbenefits.data.container).removeClass('selected');
                jQuery('>header>nav>ul>li.sections>ol.' + strSection, framework.wizard.edbenefits.data.container).addClass('chosen');
                jQuery('>footer>menu>ul>li.print', framework.wizard.edbenefits.data.container).hide();

                jQuery('>section>div', framework.wizard.edbenefits.data.container).stop();
                jQuery('>section>div.selected', framework.wizard.edbenefits.data.container)
                    .animate({opacity: 0}, framework.wizard.edbenefits.data.animation.speed, function() {
                        jQuery(this).css({display: 'none'}).removeClass('selected');

                        jQuery('>section>.subject>.section, >section>.subject>.section>ol>li', framework.wizard.edbenefits.data.container).removeClass('enabled');

                        jQuery('>section>div.' + strSection, framework.wizard.edbenefits.data.container)
                            .addClass('selected')
                            .css({display: 'block', opacity: 0})
                            .animate({opacity: 1}, framework.wizard.edbenefits.data.animation.speed, function() {
                                jQuery('>div[class != "intro"]', this).removeClass('enabled');
                                jQuery('>div.intro', this).addClass('enabled');
                            })
                            .parent('section').attr('class', strSection);
                    });
            }
        },

        /*
        control_subject_page: function(objEvent) {
            objEvent.preventDefault();

            var intPageNum          = parseInt(jQuery(this).attr('data-step'));
            var objController       = jQuery(this).parent('li').parent('ol');
            var objPages            = jQuery(this).parents('.section').find('>ol');

            if ((!jQuery(this).parent('li').hasClass('selected')) && (objController) && (objPages) && (!isNaN(intPageNum)) && (intPageNum > 0)) {
                jQuery('>li', objController).removeClass('selected');
                jQuery(this).parent('li').addClass('selected');

                jQuery('>li', objPages).removeClass('enabled');
                jQuery('>li:eq(' + (intPageNum - 1) + ')', objPages).addClass('enabled');
                jQuery(objController).attr('class', 'step-' + intPageNum);

                // control status of next/back buttons
                jQuery(this).parents('menu').siblings('nav').find('a').removeClass('disabled');

                if (intPageNum === jQuery('>li', objPages).length) {
                    jQuery(this).parents('menu').siblings('nav').find('a.next').addClass('disabled');
                } else if (intPageNum === 1) {
                    jQuery(this).parents('menu').siblings('nav').find('a.back').addClass('disabled');
                }
            }
        },
        */

        navigate_subject_page: function(objEvent) {
            var strDirection        = jQuery(this).attr('class');

            if (strDirection) {
                var objTotalPages       = jQuery(this).parent('nav').parent('footer').siblings('ol').find('>li');
                var objCurPage          = jQuery(this).parent('nav').siblings('menu').find('>ol>li.selected>a');
                var intTotalPages       = 0;
                var intCurPage          = 0;
                var intTargetPage       = 0;

                if ((objTotalPages) && (objCurPage)) {
                    intTotalPages           = objTotalPages.length;
                    intCurPage              = parseInt(objCurPage.attr('data-step'));
                    intTargetPage           = intCurPage;
                }

                if ((!isNaN(intCurPage)) && (intCurPage > 0) && (intTotalPages > 0)) {
                    switch (strDirection.toLowerCase()) {
                        case 'back' :
                            if (intCurPage > 1) {
                                intTargetPage   = intCurPage - 1;
                            }
                            break;

                        case 'next' :
                            if (intCurPage < intTotalPages) {
                                intTargetPage   = intCurPage + 1;
                            }
                            break;
                    }

                    if (intTargetPage != intCurPage) {
                        //framework.wizard.edbenefits.fn.control_subject_page.call(jQuery(this).parent('nav').siblings('menu').find('>ol>li:eq(' + (intTargetPage - 1) + ')>a')[0], objEvent);
                        //console.log(jQuery(this).parent('nav').siblings('menu').find('>ol>li:eq(' + (intTargetPage - 1) + ')>a')); //.trigger('click');
                    }
                }
            }
        }
    }
}