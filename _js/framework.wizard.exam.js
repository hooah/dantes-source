framework.wizard.exam = {
    data: {
        container: null,
        animation: {
            speed: 500
        }
    }, 
    fn: {
        init: function() {
            framework.wizard.exam.data.container    = jQuery('.wizard-examination');

            jQuery('>section>.grid>ol>li>a', framework.wizard.exam.data.container).bind('click', framework.wizard.exam.fn.show_toplevel_section);
            jQuery('>header>nav>ul>li.sections>ol>li>a, >section>.subject>.intro figure>a, >section>.subject>.intro .content ul.programs>li>div>a', framework.wizard.exam.data.container).bind('click', framework.wizard.exam.fn.show_sub_section);
            jQuery('>header>nav>ul>li.home>a', framework.wizard.exam.data.container).bind('click', framework.wizard.exam.fn.return_to_grid);
            jQuery('>section>.subject .section>footer>menu>ol>li>a', framework.wizard.exam.data.container).bind('click', framework.wizard.exam.fn.control_subject_page);
            jQuery('>section>.subject .section>footer>nav>a', framework.wizard.exam.data.container).bind('click', framework.wizard.exam.fn.navigate_subject_page);
            jQuery('>section>.grid', framework.wizard.exam.data.container).addClass('selected');
            jQuery('>section', framework.wizard.exam.data.container).addClass('grid');
        },

        return_to_grid: function(objEvent) {
            objEvent.preventDefault();

            if (!jQuery('>section>div.grid', framework.wizard.exam.data.container).hasClass('selected')) {
                jQuery('>section>div', framework.wizard.exam.data.container).stop();
                jQuery('>section>div.selected', framework.wizard.exam.data.container)
                    .css({display: 'block', opacity: 1})
                    .animate({opacity: 0}, framework.wizard.exam.data.animation.speed, function() {
                        jQuery(this).css({display: 'none', opacity: 0}).removeClass('selected');

                        jQuery('>footer>menu>ul>li.print', framework.wizard.exam.data.container).hide();
                        jQuery('>header>nav>ul>li.sections>ol', framework.wizard.exam.data.container).removeClass('chosen');
                        jQuery('>section>div.grid', framework.wizard.exam.data.container)
                            .addClass('selected')
                            .css({display: 'block', opacity: 0})
                            .animate({opacity: 1}, framework.wizard.exam.data.animation.speed, function() { jQuery('>section', framework.wizard.exam.data.container).attr('class', 'grid'); });
                    });
            }
        },

        show_toplevel_section: function(objEvent) {
            objEvent.preventDefault();

            var strSection          = jQuery(this).attr('data-section');

            if (strSection.length) {
                jQuery('>header>nav>ul>li.sections>ol', framework.wizard.exam.data.container).removeClass('chosen');
                jQuery('>header>nav>ul>li.sections>ol>li', framework.wizard.exam.data.container).removeClass('selected');
                jQuery('>header>nav>ul>li.sections>ol.' + strSection, framework.wizard.exam.data.container).addClass('chosen');
                jQuery('>footer>menu>ul>li.print', framework.wizard.exam.data.container).hide();

                jQuery('>section>div', framework.wizard.exam.data.container).stop();
                jQuery('>section>div.selected', framework.wizard.exam.data.container)
                    .animate({opacity: 0}, framework.wizard.exam.data.animation.speed, function() {
                        jQuery(this).css({display: 'none'}).removeClass('selected');

                        jQuery('>section>.subject>.section, >section>.subject>.section>ol>li', framework.wizard.exam.data.container).removeClass('enabled');

                        jQuery('>section>div.' + strSection, framework.wizard.exam.data.container)
                            .addClass('selected')
                            .css({display: 'block', opacity: 0})
                            .animate({opacity: 1}, framework.wizard.exam.data.animation.speed, function() {
                                jQuery('>div[class != "intro"]', this).removeClass('enabled');
                                jQuery('>div.intro', this).addClass('enabled');
                            })
                            .parent('section').attr('class', strSection);
                    });
            }
        },

        show_sub_section: function(objEvent) {
            objEvent.preventDefault();

            var strSection          = jQuery(this).attr('data-section');
            var strParentSection    = jQuery('>header>nav>ul>li.sections>ol.chosen', framework.wizard.exam.data.container).attr('data-section');

            if ((strSection.length) && (strParentSection.length)) {
                jQuery('>header>nav>ul>li.sections>ol>li', framework.wizard.exam.data.container).removeClass('selected');
                jQuery('>header>nav>ul>li.sections>ol>li>a[data-section="' + strSection + '"]', framework.wizard.exam.data.container).parent('li').addClass('selected');

                var objSection          = jQuery('>section>div.' + strParentSection, framework.wizard.exam.data.container);

                if (objSection) {
                    var strPDFURL           = jQuery('>div.' + strSection, objSection).attr('data-pdf');

                    jQuery('>footer>menu>ul>li.print, >footer>menu>ul>li.email', framework.wizard.exam.data.container).hide();

                    if ((strPDFURL) && (strPDFURL.length)) {
                        jQuery('>footer>menu>ul>li.print', framework.wizard.exam.data.container).show();
                        jQuery('>footer>menu>ul>li.print>a', framework.wizard.exam.data.container).attr('href', strPDFURL);
                        jQuery('>footer>menu>ul>li.email[data-email-template="' + strSection + '"]', framework.wizard.exam.data.container).show();

                        addthis_share.email_vars.examname = strSection.toUpperCase();
                    }

                    jQuery('>div', objSection).removeClass('enabled');

                    jQuery('>div.' + strSection + '>ol>li', objSection).removeClass('enabled');
                    jQuery('>div.' + strSection + '>ol>li[data-step="1"]', objSection).addClass('enabled');
                    jQuery('>div.' + strSection + '>footer>nav>a.next', objSection).removeClass('disabled');
                    jQuery('>div.' + strSection + '>footer>nav>a.back', objSection).addClass('disabled');
                    jQuery('>div.' + strSection + '>footer>menu>ol', objSection).attr('class', 'step-1');
                    jQuery('>div.' + strSection + '>footer>menu>ol>li', objSection).removeClass('selected');
                    jQuery('>div.' + strSection + '>footer>menu>ol>li:eq(0)', objSection).addClass('selected');

                    jQuery(objSection).parent('section').attr('class', strParentSection + ' ' + strSection);

                    jQuery('>div.intro', objSection).removeClass('enabled');
                    jQuery('>div.' + strSection, objSection).addClass('enabled');
                }
            }
        },

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
                        framework.wizard.exam.fn.control_subject_page.call(jQuery(this).parent('nav').siblings('menu').find('>ol>li:eq(' + (intTargetPage - 1) + ')>a')[0], objEvent);
                        //console.log(jQuery(this).parent('nav').siblings('menu').find('>ol>li:eq(' + (intTargetPage - 1) + ')>a')); //.trigger('click');
                    }
                }
            }
        }
    }
}