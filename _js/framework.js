var framework = {
	data: {
        global: {
            hostname: ''
        },
        nav: {
            containers: {
                selected: null,
                nav: null,
                links: null
            },
            open: false,
            timeout: null,
            delay: 325
        },
        cta: {
            carousel: {
                total: 0,
                current: 0,
                timeout: null,
                speed: 250,
                delay: 10000
            },
			aside: {
				newsView: {
                    count: 0,
                    current: 0,
					animation: {
						speed: 500,
                        timeout: null,
                        delay: 5000
					}
				}
			}
		},
        newsGrid: {
            data: [],
            initial:    [
                            'video', false, false,
                            false, false, false,
                            'video', 'video', false
                        ],
            initial_maximums: [
                {category: 'DANTES Information Bulletin', maximum: 1, current: 0}
            ],
            max_items: 12
        },
        multimedia: {
            dib: {
                year: 0,
                month: 0
            }
        },
        examwizard: {
            container: null,
            animation: {
                speed: 500
            }
        },
        search: {
            indexden: {
                public_url: 'http://teqaze.api.indexden.com/v1/indexes/DANTES'
            }
        },
		containers: {
			ctaAsideNewsView: null
		}
	},

	fn: {
        global: {
            findExternalLinks: function() {
                framework.data.global.hostname      = new RegExp(location.host);

                jQuery('a').each(function() {
                    var strURL          = jQuery(this).attr('href');

                    if ((strURL) && (strURL.length)) {
                        if ((framework.data.global.hostname.test(strURL)) || (strURL.indexOf('http') == -1) || (jQuery(this).hasClass('fresco'))) {
                            jQuery(this).attr('data-link-type', 'local');
                        } else if (strURL.slice(0, 1) == '#') {
                            jQuery(this).attr('data-link-type', 'anchor');
                        } else {
                            jQuery(this).attr('data-link-type', 'external');
                            jQuery(this).attr('target', '_blank');
                        }
                    }
                });

                jQuery('a[data-link-type="external"]').bind('click', framework.fn.global.trapExternalLink);
                jQuery('a[data-document-warning="true"]').bind('click', framework.fn.global.trapDocumentWithWarning);
            },

            trapExternalLink: function(objEvent) {
                var strURL             = jQuery(this).attr('href');

                if ((strURL) && (strURL.length)) {
                    if (confirm('PLEASE NOTE!\n\nYou are about to leave the DANTES website and access an external website.\n\nThe appearance of hyperlinks does not constitute endorsement by the (Department of Defense/the U.S. Army/the U.S. Navy/the U.S. Air Force/the U.S. Marine Corps, etc.) of this Web site or the information, products or services contained therein. For other than authorized activities such as military exchanges and Morale, Welfare and Recreation sites, the (Department of Defense/the U.S. Army/the U.S. Navy/the U.S. Air Force/the U.S. Marine Corps, etc.) does not exercise any editorial control over the information you may find at these locations. Such links are provided consistent with the stated purpose of this DoD Web site.\n\nPress [OK] to continue to the requested website, or [CANCEL] to return to the DANTES website.')) {
                        return true;
                    } else {
                        objEvent.preventDefault();
                        return false;
                    }
                }
            },

            trapDocumentWithWarning: function(objEvent) {
                if (confirm('PLEASE NOTE!\n\nThe document you are about to view on the DANTES website may contain links to external sites. If so, DANTES is not responsible and does not endorse the information or links you may find at the external site.\n\nPress [OK] to continue to the requested document, or [CANCEL] to return to the DANTES website.')) {
                    return true;
                } else {
                    objEvent.preventDefault();
                    return false;
                }
            }
        },

        nav: {
            init: function() {
                jQuery('#container>header>section').after('<aside><nav class="row"></nav></aside>');

                framework.data.nav.containers.nav   = jQuery('#container>header>aside>nav');
                framework.data.nav.containers.links = jQuery('#container>header>section>nav>ul>li>a');

                jQuery(framework.data.nav.containers.links).bind('mouseover', function(objEvent) {
                    clearTimeout(framework.data.nav.timeout);

                    framework.data.nav.containers.selected  = objEvent.target;

                    if (framework.data.nav.open) {
                        framework.data.nav.timeout              = setTimeout(framework.fn.nav.show, framework.data.nav.delay);
                    } else {
                        framework.fn.nav.show();
                    }
                });
                jQuery('#container>header>aside')
                    .bind('mouseover', function() {
                        clearTimeout(framework.data.nav.timeout);
                    })
                    .bind('mouseout', function() {
                        clearTimeout(framework.data.nav.timeout);

                        framework.data.nav.timeout              = setTimeout(framework.fn.nav.hide, framework.data.nav.delay / 2);
                    });
            },

            show: function() {
                var objSubnav          = jQuery(framework.data.nav.containers.selected).siblings('.subnav');

                if (objSubnav.length) {
                    framework.data.nav.open        = true;

                    jQuery(framework.data.nav.containers.links).removeClass('current');
                    jQuery(framework.data.nav.containers.selected).addClass('current');
                    jQuery(framework.data.nav.containers.nav).html(jQuery(jQuery(objSubnav).html()).addClass('twelve'));

                    jQuery('body').addClass('nav-open');
                } else {
                    framework.data.nav.open        = false;

                    jQuery('body').removeClass('nav-open');
                }
            },

            hide: function() {
                clearTimeout(framework.data.nav.timeout);

                jQuery('body').removeClass('nav-open');
            }
        },

        cta: {
            slim: {
                toggleContent: function(objEvent) {
                    objEvent.preventDefault();

                    var objParentNode				= jQuery(this).parent('h2').parent('.slim-cta-banner');
                    var objTextNode					= jQuery(objParentNode).find('>div');

                    if ((objParentNode.length) && (objTextNode.length)) {
                        if (jQuery(objParentNode).hasClass('expanded')) {
                            jQuery(objParentNode).removeClass('expanded');
                            jQuery(this).find('strong').html(jQuery(this).attr('data-text-collapsed'));

                            jQuery(objTextNode).slideUp();
                        } else {
                            jQuery(objParentNode).addClass('expanded');
                            jQuery(this).find('strong').html(jQuery(this).attr('data-text-expanded'));

                            jQuery(objTextNode).slideDown();
                        }
                    }
                }
            },

            carousel: {
                init: function() {
                    var objCarousel                 = jQuery('article.call-to-action ul.carousel');
                    var objContainer                = jQuery('>li', objCarousel);

                    if (objContainer.length) {
                        framework.data.cta.carousel.total       = objContainer.length;
                        framework.data.cta.carousel.current     = 1;

                        if (framework.data.cta.carousel.total > 1) {
                            objCarousel.before('<nav class="carousel-controls"><a href="javascript:;" class="prev">Previous</a><a href="javascript:;" class="next">Next</a></nav>');
                            jQuery('article.call-to-action nav.carousel-controls>a').bind('click', framework.fn.cta.carousel.control);
                        }

                        framework.fn.cta.carousel.show();
                    }
                },

                advance: function() {
                    if (framework.data.cta.carousel.current < framework.data.cta.carousel.total) {
                        framework.data.cta.carousel.current++;
                    } else {
                        framework.data.cta.carousel.current     = 1;
                    }

                    framework.fn.cta.carousel.show();
                },

                control: function(objEvent) {
                    clearTimeout(framework.data.cta.carousel.timeout);

                    objEvent.preventDefault();

                    switch (true) {
                        case jQuery(this).hasClass('next') :
                            if (framework.data.cta.carousel.current < framework.data.cta.carousel.total) {
                                framework.data.cta.carousel.current++;
                            } else {
                                framework.data.cta.carousel.current     = 1;
                            }
                            break;

                        case jQuery(this).hasClass('prev') :
                            if (framework.data.cta.carousel.current > 1) {
                                framework.data.cta.carousel.current--;
                            } else {
                                framework.data.cta.carousel.current     = framework.data.cta.carousel.total;
                            }
                            break;
                    }

                    framework.fn.cta.carousel.show();
                },

                show: function() {
                    jQuery('article.call-to-action ul.carousel>li:visible').css({'display': 'block', 'opacity': 1}).stop().animate({'opacity': 0}, framework.data.cta.carousel.speed, function() { jQuery(this).css('display', 'none'); });
                    jQuery('article.call-to-action ul.carousel>li:eq(' + (framework.data.cta.carousel.current - 1) + ')').css({'display': 'block', 'opacity': 0}).stop().animate({'opacity': 1}, framework.data.cta.carousel.speed);

                    framework.data.cta.carousel.timeout     = setTimeout(framework.fn.cta.carousel.advance, framework.data.cta.carousel.delay);
                }
            },

			aside: {
				newsView: {
					init: function() {
						framework.data.containers.ctaAsideNewsView	= jQuery('.hero-aside-news-view');

						if (framework.data.containers.ctaAsideNewsView) {
							jQuery('>ol>li', framework.data.containers.ctaAsideNewsView).each(function() {
								jQuery(this).css({'opacity': 0, 'display': 'none'});
								jQuery('>nav>ol', framework.data.containers.ctaAsideNewsView).append('<li><a href="javascript:;" rel="' + (jQuery(this).index() + 1) + '">' + jQuery(this).index() + '</a></li>');
							});
							jQuery('>nav>ol>li>a', framework.data.containers.ctaAsideNewsView).bind('click', framework.fn.cta.aside.newsView.change);

                            framework.data.cta.aside.newsView.count                 = jQuery('>ol>li', framework.data.containers.ctaAsideNewsView).length - 1;
                            framework.data.cta.aside.newsView.current               = 0;

							setTimeout(function () { jQuery('>nav>ol>li>a:first', framework.data.containers.ctaAsideNewsView).trigger('click'); }, framework.data.cta.aside.newsView.animation.speed);

                            framework.data.cta.aside.newsView.animation.timeout     = setTimeout(framework.fn.cta.aside.newsView.next, framework.data.cta.aside.newsView.animation.delay);
						}
					},

					change: function(objEvent) {
						var intRequestedSlide		= parseInt(jQuery(this).attr('rel'));

						if ((!isNaN(intRequestedSlide)) && (intRequestedSlide > 0)) {
                            framework.data.cta.aside.newsView.current           = intRequestedSlide - 1;

                            clearTimeout(framework.data.cta.aside.newsView.animation.timeout);

							jQuery('>nav>ol>li>a', framework.data.containers.ctaAsideNewsView).removeClass('current');
							jQuery(this).addClass('current');

							jQuery('>ol>li:visible', framework.data.containers.ctaAsideNewsView)
								.css({'opacity': 1, 'display': 'table'})
								.stop()
								.animate({'opacity': 0}, framework.data.cta.aside.newsView.animation.speed, function() { jQuery(this).css({'display': 'none'}); });
							jQuery('>ol>li:eq(' + (intRequestedSlide - 1) + ')', framework.data.containers.ctaAsideNewsView)
								.css({'opacity': 0, 'display': 'table'})
								.stop()
								.animate({'opacity': 1}, framework.data.cta.aside.newsView.animation.speed, function() {
                                    framework.data.cta.aside.newsView.animation.timeout     = setTimeout(framework.fn.cta.aside.newsView.next, framework.data.cta.aside.newsView.animation.delay);
                                });
						}
					},

                    next: function() {
                        if (framework.data.cta.aside.newsView.current == framework.data.cta.aside.newsView.count) {
                            framework.data.cta.aside.newsView.current           = 0;
                        } else {
                            framework.data.cta.aside.newsView.current++;
                        }

                        jQuery('>nav>ol>li>a:eq(' + framework.data.cta.aside.newsView.current + ')', framework.data.containers.ctaAsideNewsView).trigger('click');
                    }
				}
			}
		},

        newsGrid: {
            init: function() {
                jQuery.getJSON( 'http://dantespulse.com/?feed=json&imagesize=256,194&jsonp=?', framework.fn.newsGrid.render);
            },

            render: function(objData) {
                framework.data.newsGrid.data    = objData.posts;

                var arrCategories       = [];
                var intOuterCounter, intInnerCounter;

                for (intOuterCounter = 0; intOuterCounter < framework.data.newsGrid.data.length; intOuterCounter++) {
                    if (framework.data.newsGrid.data[intOuterCounter].categories.length) {
                        for (intInnerCounter = 0; intInnerCounter < framework.data.newsGrid.data[intOuterCounter].categories.length; intInnerCounter++) {
                            if ((framework.data.newsGrid.data[intOuterCounter].categories[intInnerCounter].slug != 'uncategorized') &&
                                (framework.data.newsGrid.data[intOuterCounter].categories[intInnerCounter].slug != 'hot-news') &&
                                (framework.data.newsGrid.data[intOuterCounter].categories[intInnerCounter].slug != 'press-releases') &&
                                (arrCategories[framework.data.newsGrid.data[intOuterCounter].categories[intInnerCounter].slug] === undefined)) {
                                arrCategories[framework.data.newsGrid.data[intOuterCounter].categories[intInnerCounter].slug] = true;

                                jQuery('.newsgrid>nav>ul').append('<li><a href="javascript:;" data-category="' + framework.data.newsGrid.data[intOuterCounter].categories[intInnerCounter].slug + '">' + framework.data.newsGrid.data[intOuterCounter].categories[intInnerCounter].title + '</a></li>');
                            }
                        }
                    }
                }

                jQuery('.newsgrid>nav').show();
                jQuery('.newsgrid>nav>ul>li>a').bind('click', framework.fn.newsGrid.populate);
                jQuery('.newsgrid>nav>ul>li>a[data-category="all"]').trigger('click');
            },

            populate: function(objEvent) {
                objEvent.preventDefault();

                jQuery('.newsgrid>nav>ul>li>a').removeClass('current');
                jQuery(this).addClass('current');

                var objContainer        = jQuery('.newsgrid>ul');
                var objContext          = this;

                if (objContainer.find('li').length) {
                    objContainer.find('li').css('opacity', 0);

                    setTimeout(function() { objContainer.empty(); jQuery(objContext).trigger('click'); }, 500);

                    return false;
                }

                var arrCursors          = [];
                var arrData             = [];
                var arrMatches;
                var strReqCategory      = jQuery(this).attr('data-category').toLowerCase();
                var intItemCursor, intInnerCount, intOuterCount, strImage;

                switch (strReqCategory) {
                    case 'all' :
                        // reset category maximums
                        for (var intCounter = 0; intCounter < framework.data.newsGrid.initial_maximums.length; intCounter++) {
                            framework.data.newsGrid.initial_maximums[intCounter].current    = 0;
                        }

<<<<<<< HEAD
<<<<<<< HEAD
                        for (var intOuterCount = 0; intOuterCount < framework.data.newsGrid.initial.length; intOuterCount++) {
=======
=======
>>>>>>> FETCH_HEAD
                        for (intOuterCount = 0; intOuterCount < framework.data.newsGrid.initial.length; intOuterCount++) {
>>>>>>> FETCH_HEAD
                            intItemCursor                   = 0;

                            for (intInnerCount = 0; intInnerCount < framework.data.newsGrid.data.length; intInnerCount++) {
                                if (arrCursors[framework.data.newsGrid.data[intInnerCount].format] === undefined) {
                                    arrCursors[framework.data.newsGrid.data[intInnerCount].format]     = 0;
                                }

                                if ((!framework.fn.newsGrid.item_has_category(framework.data.newsGrid.data[intInnerCount].categories, 'Press Releases')) &&
                                    (!framework.fn.newsGrid.item_has_category(framework.data.newsGrid.data[intInnerCount].categories, 'Hot News'))) {
                                    if (framework.data.newsGrid.data[intInnerCount].format === framework.data.newsGrid.initial[intOuterCount]) {
                                        if ((framework.data.newsGrid.data[intInnerCount].format !== 'link') ||
                                            ((framework.data.newsGrid.data[intInnerCount].format === 'link') && (framework.data.newsGrid.data[intInnerCount].permalink_external.length))) {
                                            if (framework.fn.newsGrid.is_under_category_maximum(framework.data.newsGrid.data[intInnerCount])) {
                                                if (intItemCursor === arrCursors[framework.data.newsGrid.data[intInnerCount].format]) {
                                                    arrCursors[framework.data.newsGrid.data[intInnerCount].format]++;
                                                    arrData.push(framework.data.newsGrid.data[intInnerCount]);
                                                    break;
                                                } else {
                                                    intItemCursor++;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;

                    default :
                        intItemCursor                   = 0;

                        for (intOuterCount = 0; intOuterCount < framework.data.newsGrid.data.length; intOuterCount++) {
                            if (framework.data.newsGrid.data[intOuterCount].categories.length) {
                                for (intInnerCount = 0; intInnerCount < framework.data.newsGrid.data[intOuterCount].categories.length; intInnerCount++) {
                                    if ((framework.data.newsGrid.data[intOuterCount].categories[intInnerCount].slug === strReqCategory) && (intItemCursor < framework.data.newsGrid.max_items)) {
                                        if ((framework.data.newsGrid.data[intOuterCount].format !== 'link') ||
                                            ((framework.data.newsGrid.data[intOuterCount].format === 'link') && (framework.data.newsGrid.data[intOuterCount].permalink_external.length))) {
                                            arrData.push(framework.data.newsGrid.data[intOuterCount]);
                                            intItemCursor++;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }

                if (arrData.length) {
                    objContainer.find('a').unbind('click');

                    objContainer.empty();

                    for (intOuterCount = 0; intOuterCount < arrData.length; intOuterCount++) {
                        strImage            = '_images/bg-newsgrid-item-default.jpg';

                        if (framework.fn.newsGrid.item_has_category(arrData[intOuterCount].categories, 'DANTES Information Bulletin')) {
                            strImage        = '_images/bg-newsgrid-item-dib.jpg';
                        } else if (arrData[intOuterCount].image.length) {
                            strImage            = 'http://www.dantespulse.com/' + arrData[intOuterCount].image;
                        } else {
                            switch (true) {
                                case framework.fn.newsGrid.item_has_category(arrData[intOuterCount].categories, 'Videos') :
                                case arrData[intOuterCount].format === 'video' :
                                    strImage        = '_images/bg-newsgrid-item-videos.jpg';
                                    break;

                                case framework.fn.newsGrid.item_has_category(arrData[intOuterCount].categories, 'Hot News') :
                                    strImage        = '_images/bg-newsgrid-item-hotnews.jpg';
                                    break;

                                case framework.fn.newsGrid.item_has_category(arrData[intOuterCount].categories, 'Press Releases') :
                                case arrData[intOuterCount].format === 'link' :
                                    strImage        = '_images/bg-newsgrid-item-links.jpg';
                                    break;
                            }
                        }

                        arrMatches          = arrData[intOuterCount].permalink.match(/(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i);

                        if (arrMatches) {
                            arrData[intOuterCount].permalink        = 'https://www.youtube.com/watch?v=' + arrMatches[arrMatches.length - 1];
                        }

                        objContainer.append(    '<li class="four columns ' + (((intOuterCount % 3) == 0) ? 'clear ' : '') + ((arrData[intOuterCount].format) ? (arrData[intOuterCount].format) : 'article') + '">' +
                                                    '<a href="' + ((arrData[intOuterCount].permalink.indexOf('://') > -1) ? arrData[intOuterCount].permalink : 'http://www.dantespulse.com' + arrData[intOuterCount].permalink) + '" target="_blank"' + ((arrData[intOuterCount].format === 'video') ? ' class="fresco"' : '') + '>' +
                                                        '<cite><strong><em>' + dateFormat(arrData[intOuterCount].date, 'd') + '<br />' + dateFormat(arrData[intOuterCount].date, 'mmm') + '<br />' + dateFormat(arrData[intOuterCount].date, 'yyyy') + '</em></strong></cite>' +
                                                        '<figure>' +
                                                            '<div>' +
                                                                '<span style="background-image: url(' + strImage + ');">&nbsp;</span>' +
                                                            '</div>' +
                                                            '<figcaption>' + arrData[intOuterCount].title + '</figcaption>' +
                                                        '</figure>' +
                                                    '</a>' +
                                                '</li>');
                    }
                }
            },

            item_has_category: function(objCategories, strCategoryTitle) {
                var boolResult          = false;

                if ((objCategories) && (objCategories.length)) {
                    for (var intCounter = 0; intCounter < objCategories.length; intCounter++) {
                        if (objCategories[intCounter].title.indexOf(strCategoryTitle) > -1) {
                            boolResult              = true;
                            break;
                        }
                    }
                }

                return boolResult;
            },

            is_under_category_maximum: function(objItem) {
                for (var intCounter = 0; intCounter < objItem.categories.length; intCounter++) {
                    for (var intCategoryCounter = 0; intCategoryCounter < framework.data.newsGrid.initial_maximums.length; intCategoryCounter++) {
                        if (framework.data.newsGrid.initial_maximums[intCategoryCounter].category === objItem.categories[intCounter].title) {
                            if (framework.data.newsGrid.initial_maximums[intCategoryCounter].current < framework.data.newsGrid.initial_maximums[intCategoryCounter].maximum) {
                                framework.data.newsGrid.initial_maximums[intCategoryCounter].current++;
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }

                return true;
            }
        },

        multimedia: {
            grid: {
                showContent: function() {
                    var txtContent          = jQuery('>.content', this).html();

                    if (txtContent) {
                        var objTarget           = jQuery(this).siblings('.multimedia-feature-box-content');

                        if (objTarget) {
                            jQuery('>section', objTarget).html(txtContent);

                            jQuery('.multimedia-feature-box').removeClass('selected');
                            jQuery(this).addClass('selected');

                            jQuery('.multimedia-feature-box-content').stop().slideUp();
                            jQuery(objTarget).stop().slideDown();
                        }
                    }
                }
            },

            dib: {
                init: function() {
                    var objYearButton       = jQuery('.multimedia-dib-menu>header>section>nav>a');
                    var objYearItems        = jQuery('.multimedia-dib-menu>header>section>nav>ul>li');
                    var objMonthButtons     = jQuery('.multimedia-dib-menu>header>section>ol>li[class != "handle"]');

                    if ((objYearButton) && (objYearItems) && (objMonthButtons)) {
                        objYearButton.bind('click', framework.fn.multimedia.dib.yearMenu);
                        objYearItems.bind('click', framework.fn.multimedia.dib.yearSelect);
                        objMonthButtons.bind('click', framework.fn.multimedia.dib.monthSelect);

                        jQuery('.multimedia-dib-menu>header>section>ol>li.handle').bind('click', function() {
                            var objParent           = jQuery(this).parent('ol');

                            if (objParent.hasClass('open')) {
                                objParent.removeClass('open');
                            } else {
                                objParent.addClass('open');
                            }
                        });

                        jQuery(objYearItems[0]).trigger('click');
                        jQuery(objMonthButtons[0]).trigger('click');
                    }
                },

                yearMenu: function() {
                    var objContainer        = jQuery(this).siblings('ul');

                    if (objContainer.hasClass('open')) {
                        objContainer.removeClass('open');
                    } else {
                        objContainer.addClass('open');
                    }
                },

                yearSelect: function() {
                    var objParent                           = jQuery(this).parent('ul');

                    framework.data.multimedia.dib.year      = jQuery(this).attr('data-year');

                    jQuery(this).siblings('li').removeClass('selected');
                    jQuery(this).addClass('selected');

                    objParent.siblings('a').html(jQuery(this).attr('data-year'));
                    objParent.removeClass('open');

                    framework.fn.multimedia.dib.showContent();
                },

                monthSelect: function() {
                    framework.data.multimedia.dib.month     = jQuery(this).attr('data-month');

                    jQuery(this).siblings('li.handle').html(jQuery('>a', this).html());
                    jQuery(this).siblings('li').removeClass('selected');
                    jQuery(this).addClass('selected');

                    jQuery(this).parent('ol').removeClass('open');

                    framework.fn.multimedia.dib.showContent();
                },

                showContent: function() {
                    var objContent          = jQuery('.multimedia-dib-menu>section');

                    if ((objContent) && (framework.data.multimedia.dib.month > 0) && (framework.data.multimedia.dib.year > 0)) {
                        var objCurContent       = jQuery('>div.y' + framework.data.multimedia.dib.year + 'm' + framework.data.multimedia.dib.month, objContent);
                        var objHeader           = jQuery('.multimedia-dib-menu>header>h3');

                        jQuery('>div', objContent).hide();

                        if (objCurContent.length) {
                            objHeader.html(jQuery('.multimedia-dib-menu>header>section>ol>li.selected>a').text() + ' ' + jQuery('.multimedia-dib-menu>header>section>nav>a').text());

                            jQuery(objCurContent).show();
                        } else {
                            objHeader.html('');

                            jQuery('>div.no-content', objContent).show();
                        }
                    }
                }
            }
        },

        examwizard: {
            init: function() {
                framework.data.examwizard.container     = jQuery('.examination-wizard');

                setTimeout(function() {
                    framework.data.examwizard.container.addClass('enabled');
                }, 1000);

                jQuery('>header>nav>ul>li[class != "home"]>a, >section>.grid>ol>li>a', framework.data.examwizard.container).bind('click', framework.fn.examwizard.show_toplevel_section);
                jQuery('>header>nav>ul>li[class != "home"]>ol>li>a', framework.data.examwizard.container).bind('click', framework.fn.examwizard.show_sub_section);
                jQuery('>section .subject .section>footer>menu>ol>li>a', framework.data.examwizard.container).bind('click', framework.fn.examwizard.control_subject_page);
                jQuery('>section .subject .section>footer>nav>a', framework.data.examwizard.container).bind('click', framework.fn.examwizard.navigate_subject_page);
            },

            show_toplevel_section: function(objEvent) {
                objEvent.preventDefault();

                var strSection          = jQuery(this).attr('href').replace('#', '');

                if (strSection.length) {
                    jQuery('>header>nav>ul>li', framework.data.examwizard.container).removeClass('selected');
                    jQuery('>header>nav>ul>li.' + strSection, framework.data.examwizard.container).addClass('selected');

                    jQuery('>section>div:visible', framework.data.examwizard.container)
                        .animate({opacity: 0}, framework.data.examwizard.animation.speed, function() {
                            jQuery(this).css('display', 'none');
                            jQuery('>section>div.' + strSection, framework.data.examwizard.container)
                                .css({display: 'block', opacity: 0})
                                .animate({opacity: 1}, framework.data.examwizard.animation.speed, function() {
                                    jQuery('>div[class != "intro"]', this).removeClass('enabled');
                                    jQuery('>div.intro', this).addClass('enabled');
                                });
                        });
                }
            },

            show_sub_section: function(objEvent) {
                objEvent.preventDefault();

                var strSection          = jQuery(this).attr('href').replace('#', '');
                var strParentSection    = jQuery(this).parent('li').parent('ol').siblings('a').attr('href').replace('#', '');

                if ((strSection.length) && (strParentSection.length)) {
                    jQuery('>header>nav>ul>li[class != "home"]>ol>li', framework.data.examwizard.container).removeClass('selected');
                    jQuery(this).parent('li').addClass('selected');

                    var objSection          = jQuery('>section>div.' + strParentSection, framework.data.examwizard.container);

                    if (objSection) {
                        jQuery('>div', objSection).removeClass('enabled');

                        jQuery('>div.' + strSection + '>ol>li', objSection).removeClass('enabled');
                        jQuery('>div.' + strSection + '>ol>li[data-step="1"]', objSection).addClass('enabled');
                        jQuery('>div.' + strSection + '>footer>menu>ol', objSection).attr('class', 'step-1');
                        jQuery('>div.' + strSection + '>footer>menu>ol>li', objSection).removeClass('selected');
                        jQuery('>div.' + strSection + '>footer>menu>ol>li:eq(0)', objSection).addClass('selected');

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
                            framework.fn.examwizard.control_subject_page.call(jQuery(this).parent('nav').siblings('menu').find('>ol>li:eq(' + (intTargetPage - 1) + ')>a')[0], objEvent);
                            //console.log(jQuery(this).parent('nav').siblings('menu').find('>ol>li:eq(' + (intTargetPage - 1) + ')>a')); //.trigger('click');
                        }
                    }
                }
            }
        },

        search: {
            jekyll_dynamic_search: {
                init: function() {
                    if (jQuery('form.jekyll-dynamic-search').length) {
                        jQuery('form.jekyll-dynamic-search').bind('submit', framework.fn.search.jekyll_dynamic_search.run_query);
                    }
                },

                run_query: function(objEvent) {
                    objEvent.preventDefault();

                    run_search(framework.fn.search.jekyll_dynamic_search.populate_results);

                    return false;
                },

                populate_results: function() {
                    var objContainer        = jQuery('#search-results>ul');

                    objContainer.empty();

                    if (final_results.length) {
                        var strBaseURL              = window.location.protocol + '//' + window.location.hostname;

                        for (var intCounter = 0; intCounter < final_results.length; intCounter++) {
                            objContainer.append(    '<li>' +
                                                        '<h2><a href="' + final_results[intCounter]['u'] + '">' + final_results[intCounter]['t'] + '</a></h2>' +
                                                        '<cite>' + strBaseURL + '<strong>' + final_results[intCounter]['u'] + '</strong></cite>' +
                                                        '<p>' + final_results[intCounter]['d'] + '</p>' +
                                                    '</li>')
                        }
                    } else {
                        objContainer.append('<li class="no-results"><h2>No results found!</h2><p><strong>No results found for your search query.  Please try different search keywords.</strong></p></li>');
                    }
                }
            },

            lunr_search: {
                init: function() {
                    jQuery('form.lunr-search').bind('submit', function() { return false; });

                    if (jQuery('form.lunr-search').length) {
                        jQuery('#searchbox').lunrSearch({
                            indexUrl: '../search-lunr.json',
                            results:  '#search-results',
                            entries:  'ul',
                            template: '#results-template'
                        });
                    }
                }
            },

            indexden: {
                init: function() {
                    if (jQuery('form.indexden-search').length) {
                        jQuery('form.indexden-search').bind('submit', framework.fn.search.indexden.run_query);
                    }
                },

                run_query: function(objEvent) {
                    objEvent.preventDefault();

                    var strQuery            = jQuery('#searchbox').val();

                    if (strQuery.length) {
                        jQuery.getJSON( framework.data.search.indexden.public_url + '/search?q=' + encodeURIComponent(strQuery) + '&len=1000&fetch=*&snippet=text&callback=?',
                                        framework.fn.search.indexden.populate_results);
                    } else {
                        jQuery('#search-results>ul').empty();
                    }
                },

                populate_results: function(objData) {
                    var objContainer        = jQuery('#search-results>ul');

                    objContainer.empty();

                    if (objData.results.length > 0) {
                        var strBaseURL              = window.location.protocol + '//' + window.location.hostname;

                        for (var intCounter = 0; intCounter < objData.results.length; intCounter++) {
                            objContainer.append(    '<li>' +
                                                        '<h2><a href="' + objData.results[intCounter].docid + '">' + objData.results[intCounter].title + '</a></h2>' +
                                                        '<cite>' + strBaseURL + '<strong>' + objData.results[intCounter].docid + '</strong></cite>' +
                                                        '<p>' + objData.results[intCounter].snippet_text + '</p>' +
                                                    '</li>')
                        }
                    } else {
                        objContainer.append('<li class="no-results"><h2>No results found!</h2><p><strong>No results found for your search query.  Please try different search keywords.</strong></p></li>');
                    }
                }
            }
        }
	}
};