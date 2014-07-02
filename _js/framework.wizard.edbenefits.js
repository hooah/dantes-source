framework.wizard.edbenefits = {
    data: {
        container: null,
        animation: {
            speed: 500
        },
        navigation: {
            current_page: 1
        }
    }, 
    fn: {
        init: function() {
            framework.wizard.edbenefits.data.container      = jQuery('.wizard-education-benefits');

            jQuery('[data-section]', framework.wizard.edbenefits.data.container).bind('click', framework.wizard.edbenefits.fn.show_toplevel_section);
            jQuery('[data-subsection]', framework.wizard.edbenefits.data.container).bind('click', framework.wizard.edbenefits.fn.show_sub_section);
            jQuery('[data-jump-index]', framework.wizard.edbenefits.data.container).bind('click', framework.wizard.edbenefits.fn.jump_to_page);
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
            objEvent.stopPropagation();

            var strSection          = jQuery(this).attr('data-section');

            if (strSection.length) {
                jQuery('>header>nav>ul>li.sections>ol', framework.wizard.edbenefits.data.container).removeClass('chosen');
                jQuery('>header>nav>ul>li.sections>ol>li', framework.wizard.edbenefits.data.container).removeClass('selected');
                jQuery('>header>nav>ul>li.sections>ol.' + strSection, framework.wizard.edbenefits.data.container).addClass('chosen');

                jQuery('>section>div', framework.wizard.edbenefits.data.container).stop();
                jQuery('>section>div.selected', framework.wizard.edbenefits.data.container)
                    .animate({opacity: 0}, framework.wizard.edbenefits.data.animation.speed, function() {
                        framework.wizard.edbenefits.data.navigation.current_page    = 1;

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

        show_sub_section: function(objEvent) {
            objEvent.preventDefault();
            objEvent.stopPropagation();

            var strSection          = jQuery(this).attr('data-subsection');
            var intJumpIndex        = parseInt(jQuery(this).attr('data-subsection-index'));
            var strParentSection    = jQuery('>header>nav>ul>li.sections>ol.chosen', framework.wizard.edbenefits.data.container).attr('data-section');

            if ((strSection.length) && (strParentSection.length)) {
                jQuery('>header>nav>ul>li.sections>ol>li', framework.wizard.edbenefits.data.container).removeClass('selected');

                if ((isNaN(intJumpIndex)) || (intJumpIndex == 0)) {
                    intJumpIndex        = 1;

                    jQuery('>header>nav>ul>li.sections>ol>li>a[data-subsection="' + strSection + '"]', framework.wizard.edbenefits.data.container).parent('li').addClass('selected');
                } else {
                    jQuery('>header>nav>ul>li.sections>ol>li>a[data-subsection-index="' + intJumpIndex + '"]', framework.wizard.edbenefits.data.container).parent('li').addClass('selected');
                }

                var objSection          = jQuery('>section>div.' + strParentSection, framework.wizard.edbenefits.data.container);

                if (objSection) {
                    framework.wizard.edbenefits.data.navigation.current_page    = intJumpIndex;

                    jQuery('>div', objSection).removeClass('enabled');

                    jQuery('>div.' + strSection + '>ol>li', objSection).removeClass('enabled');
                    jQuery('>div.' + strSection + '>ol>li[data-step="' + intJumpIndex + '"]', objSection).addClass('enabled');
                    jQuery('>div.' + strSection + '>footer>nav>a.next', objSection).removeClass('disabled');
                    jQuery('>div.' + strSection + '>footer>nav>a.back', objSection).addClass('disabled');

                    jQuery(objSection).parent('section').attr('class', strParentSection + ' ' + strSection);

                    jQuery('>div.intro', objSection).removeClass('enabled');
                    jQuery('>div.' + strSection, objSection).addClass('enabled');
                }
            }
        },

        control_subject_page: function(intTargetPage) {
            var objPages            = jQuery('>section>.subject.selected>.section.enabled>ol', framework.wizard.edbenefits.data.container);

            if ((objPages) && (!isNaN(intTargetPage)) && (intTargetPage > 0)) {
                var objControls         = objPages.siblings('footer').find('nav');
                var objPage             = jQuery('>li:eq(' + (intTargetPage - 1) + ')', objPages);

                if (objPage) {
                    jQuery('>li', objPages).removeClass('enabled');

                    objPage.addClass('enabled');

                    if (objPage.attr('data-set-nav-by-index')) {
                        jQuery('>header>nav>ul>li.sections>ol>li', framework.wizard.edbenefits.data.container).removeClass('selected');
                        jQuery('>header>nav>ul>li.sections>ol>li>a[data-subsection-index="' + (intTargetPage - 1) + '"]', framework.wizard.edbenefits.data.container).parent('li').addClass('selected');
                    }

                    framework.wizard.edbenefits.data.navigation.current_page        = intTargetPage;

                    if (objControls) {
                        // control status of next/back buttons
                        objControls.find('a').removeClass('disabled');

                        if (intTargetPage === jQuery('>li', objPages).length) {
                            objControls.find('a.next').addClass('disabled');
                        } else if (intTargetPage === 1) {
                            objControls.find('a.back').addClass('disabled');
                        }
                    }
                }
            }
        },

        jump_to_page: function(objEvent) {
            objEvent.preventDefault();

            var intJumpPage         = parseInt(jQuery(this).attr('data-jump-index'));

            if ((!isNaN(intJumpPage)) && (intJumpPage > 0)) {
                framework.wizard.edbenefits.fn.control_subject_page(intJumpPage);
            }
        },

        navigate_subject_page: function(objEvent) {
            var strDirection        = jQuery(this).attr('class');

            if (strDirection) {
                var objTotalPages       = jQuery(this).parent('nav').parent('footer').siblings('ol').find('>li');
                var intTotalPages       = objTotalPages.length;
                var intCurPage          = framework.wizard.edbenefits.data.navigation.current_page;
                var intTargetPage       = framework.wizard.edbenefits.data.navigation.current_page;

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
                        framework.wizard.edbenefits.fn.control_subject_page(intTargetPage);
                    }
                }
            }
        }
    }
}