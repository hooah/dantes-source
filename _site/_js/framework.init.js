jQuery(document).ready(function() {
    framework.fn.global.findExternalLinks();
    framework.fn.nav.init();

    jQuery('#container>footer>section>.content>a.sitemap-trigger').bind('click', function(objEvent) {
        objEvent.preventDefault();

        if (jQuery(this).hasClass('open')) {
            jQuery(this).removeClass('open');
            jQuery('#container>menu.sitemap').slideUp();
        } else {
            jQuery(this).addClass('open');
            jQuery('#container>menu.sitemap').show().scrollintoview({duration: 1250, direction: 'vertical'});
        }
    });
    jQuery('#container>header>section>nav').bind('click', function() {
        jQuery(this).hasClass('open') ? jQuery(this).removeClass('open') : jQuery(this).addClass('open');
    });

    // conditionals
    if (typeof jQuery.fn.foundationAccordion === 'function') {
        jQuery('.accordion').foundationAccordion();
    }
    if (typeof jQuery.fn.chosen === 'function') {
        jQuery('select').chosen();

        jQuery('button[type="reset"], input[type="reset"]').bind('click', function() {
            jQuery('select').val('').trigger('chosen:updated');
        });
    }
	if (jQuery('.hero-aside-news-view').length) {
		framework.fn.cta.aside.newsView.init();
	}
    if (jQuery('.newsgrid').length) {
        framework.fn.newsGrid.init();
    }
    if (jQuery('article.call-to-action ul.carousel').length) {
        framework.fn.cta.carousel.init();
    }
    if (jQuery('.slim-cta-banner').length) {
	    jQuery('.slim-cta-banner a.trigger').bind('click', framework.fn.cta.slim.toggleContent);
    }
    if (jQuery('.multimedia-features .multimedia-feature-box').length) {
        jQuery('.multimedia-features .multimedia-feature-box').bind('click', framework.fn.multimedia.grid.showContent);
    }
    if (jQuery('.multimedia-dib-menu').length) {
        framework.fn.multimedia.dib.init();
    }
    if ((jQuery('#strEdLevel').length) || (jQuery('#strFactSheet').length)) {
        jQuery('#strEdLevel, #strFactSheet').bind('change', function() {
            var strPDFURL           = jQuery(this).val();

            if (strPDFURL) {
                jQuery(this).siblings('a.button').attr('href', strPDFURL);
            }
        });
    }

    // lunr.js search
    framework.fn.search.lunr_search.init();

    // scout
    jQuery.scout();
    jQuery('[data-scout-manual]').bind('click', function() {
        var arrParams       = jQuery(this).attr('data-scout-manual').split(',');

        if (arrParams.length === 3) {
            var strCategory     = arrParams[0];
            var strAction       = arrParams[1];
            var strLabel        = arrParams[2];

            jQuery.scout(strCategory, strAction, strLabel);
        }
    });

    // accordion jump
    setTimeout( function() {
                    if (window.location.hash.length) {
                        // check for accordion hash
                        if (window.location.hash.indexOf('accordion-') > -1) {
                            var strAccordionHash        = window.location.hash.substr(window.location.hash.indexOf('accordion-') + 10);

                            if (strAccordionHash.length) {
                                strAccordionHash            = strAccordionHash.toLowerCase();
                                var objAccordionItem        = jQuery('.accordion>li>div.title[data-ref="' + strAccordionHash + '"]');

                                if (objAccordionItem.length) {
                                    objAccordionItem.trigger('click');
                                }
                            }
                        }
                    }
                }, 500);
});