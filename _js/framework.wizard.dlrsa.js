framework.wizard.dlrsa = {
    data: {
        containers: {
            main: null,
            questions: {
                meta: {
                    header: null,
                    footer: null
                },
                main: null,
                list: null
            },
            demographics: {
                meta: {
                    header: null,
                    footer: null
                },
                main: null,
                list: null
            },
            results: {
                meta: {
                    header: null,
                    footer: null
                },
                main: null,
                list: null
            },
            details: {
                meta: {
                    footer: null
                },
                main: null,
                content: null
            }
        },
        questions: {
            current: 1,
            total: 0
        },
        demographics: {
            current: 1,
            total: 0
        },
        results: {
            current: 1,
            total: 0,
            viewing_detail: false
        },
        animation: {
            animating: false,
            speed: 500
        },
        grid: {
            width_lookup: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
        }
    }, 
    fn: {
        init: function() {
            // setup containers
            framework.wizard.dlrsa.data.containers.main                     = jQuery('.wizard-distance-learning');

            // questions
            framework.wizard.dlrsa.data.containers.questions.main           = jQuery('>section>.questions', framework.wizard.dlrsa.data.containers.main);
            framework.wizard.dlrsa.data.containers.questions.list           = jQuery('>section>ol', framework.wizard.dlrsa.data.containers.questions.main);
            framework.wizard.dlrsa.data.containers.questions.meta.header    = jQuery('>header', framework.wizard.dlrsa.data.containers.questions.main);
            framework.wizard.dlrsa.data.containers.questions.meta.footer    = jQuery('>footer', framework.wizard.dlrsa.data.containers.questions.main);

            // demographics
            framework.wizard.dlrsa.data.containers.demographics.main        = jQuery('>section>.questions-demographics', framework.wizard.dlrsa.data.containers.main);
            framework.wizard.dlrsa.data.containers.demographics.list        = jQuery('>section>ol', framework.wizard.dlrsa.data.containers.demographics.main);
            framework.wizard.dlrsa.data.containers.demographics.meta.header = jQuery('>header', framework.wizard.dlrsa.data.containers.demographics.main);
            framework.wizard.dlrsa.data.containers.demographics.meta.footer = jQuery('>footer', framework.wizard.dlrsa.data.containers.demographics.main);

            // results
            framework.wizard.dlrsa.data.containers.results.main             = jQuery('>section>.results', framework.wizard.dlrsa.data.containers.main);
            framework.wizard.dlrsa.data.containers.results.list             = jQuery('>section>ol', framework.wizard.dlrsa.data.containers.results.main);
            framework.wizard.dlrsa.data.containers.results.meta.header      = jQuery('>header', framework.wizard.dlrsa.data.containers.results.main);
            framework.wizard.dlrsa.data.containers.results.meta.footer      = jQuery('>footer', framework.wizard.dlrsa.data.containers.results.main);

            // results
            framework.wizard.dlrsa.data.containers.details.main             = jQuery('>section>.results-detail', framework.wizard.dlrsa.data.containers.main);
            framework.wizard.dlrsa.data.containers.details.content          = jQuery('>section', framework.wizard.dlrsa.data.containers.details.main);
            framework.wizard.dlrsa.data.containers.details.meta.footer      = jQuery('>footer', framework.wizard.dlrsa.data.containers.details.main);

            framework.wizard.dlrsa.fn.init_required_questions();
            framework.wizard.dlrsa.fn.init_demographic_questions();
            framework.wizard.dlrsa.fn.init_results();

            // bind generic events
            jQuery(framework.wizard.dlrsa.data.containers.main).on('click', 'a[data-section][class != "next"][class != "back"]', framework.wizard.dlrsa.fn.navigate_to_main_section);
            jQuery(framework.wizard.dlrsa.data.containers.details.meta.footer).on('click', 'a[data-section]', framework.wizard.dlrsa.fn.navigate_to_main_section);
        },

        init_required_questions: function() {
            var txtTemplateQuestion                     = jQuery('#template-question-page').html();
            var txtTemplateQuestionChoice               = jQuery('#template-question-choice').html();
            var intCounter, intCounterInner;
            var txtQuestionHTML, txtQuestionChoiceHTML;

            Mustache.parse(txtTemplateQuestion);
            Mustache.parse(txtTemplateQuestionChoice);

            for (intCounter = 0; intCounter < framework.wizard.dlrsa.data.dataset.questions.length; intCounter++) {
                txtQuestionHTML                             = '';
                txtQuestionChoiceHTML                       = '';

                for (intCounterInner = 0; intCounterInner < framework.wizard.dlrsa.data.dataset.questions[intCounter].choices.length; intCounterInner++) {
                    txtQuestionChoiceHTML                       += Mustache.render( txtTemplateQuestionChoice,
                                                                                    {
                                                                                        choice_class: '',
                                                                                        choice_name: 'question_choice_' + intCounter,
                                                                                        choice_value: intCounterInner,
                                                                                        choice_text: framework.wizard.dlrsa.data.dataset.questions[intCounter].choices[intCounterInner].text
                                                                                    });
                }

                txtQuestionHTML                             = Mustache.render(  txtTemplateQuestion,
                                                                                {
                                                                                    question_title: framework.wizard.dlrsa.data.dataset.questions[intCounter].text,
                                                                                    question_choices: txtQuestionChoiceHTML
                                                                                });

                framework.wizard.dlrsa.data.containers.questions.list.append(txtQuestionHTML);
            }

            jQuery('li>label', framework.wizard.dlrsa.data.containers.questions.list).bind('click', framework.wizard.dlrsa.fn.radio.set_class);
            jQuery('>nav.pagination>a', framework.wizard.dlrsa.data.containers.questions.meta.footer).bind('click', framework.wizard.dlrsa.fn.questions.navigate);

            framework.wizard.dlrsa.data.questions.current       = 1;
            framework.wizard.dlrsa.data.questions.total         = jQuery('>li', framework.wizard.dlrsa.data.containers.questions.list).length;

            framework.wizard.dlrsa.fn.questions.set_metadata(true);
        },

        init_demographic_questions: function() {
            var txtTemplateDemographicSection       = jQuery('#template-demographic-page').html();
            var txtTemplateDemographicSectionInner  = jQuery('#template-demographic-page-inner').html();
            var txtTemplateQuestionChoice           = jQuery('#template-question-choice').html();
            var intCounter, intCounterInner;
            var txtDemographicHTML, txtDemographicInnerHTML, txtQuestionChoiceHTML, intColumnWidth, strColumnClass, strChoiceClass, strListClass, intListRows;

            Mustache.parse(txtTemplateDemographicSection);
            Mustache.parse(txtTemplateDemographicSectionInner);
            Mustache.parse(txtTemplateQuestionChoice);

            for (intCounter = 0; intCounter < framework.wizard.dlrsa.data.dataset.demographics.length; intCounter++) {
                intListRows                             = 1;
                intColumnWidth                          = (12 / framework.wizard.dlrsa.data.dataset.demographics[intCounter].length);
                strColumnClass                          = framework.wizard.dlrsa.data.grid.width_lookup[intColumnWidth - 1];
                txtDemographicHTML                      = '';
                txtDemographicInnerHTML                 = '';

                for (intCounterOuter = 0; intCounterOuter < framework.wizard.dlrsa.data.dataset.demographics[intCounter].length; intCounterOuter++) {
                    txtQuestionChoiceHTML                   = '';

                    if ((framework.wizard.dlrsa.data.dataset.demographics[intCounter][intCounterOuter].choices.length > 4) && (intColumnWidth === 12)) {
                        if (framework.wizard.dlrsa.data.dataset.demographics[intCounter][intCounterOuter].choices.length < 10) {
                            intListRows                             = 2;
                        } else {
                            intListRows                             = 3;
                        }
                    }

                    strChoiceClass                          = ((intListRows > 1) ? (framework.wizard.dlrsa.data.grid.width_lookup[(12 / intListRows) - 1] + ' left') : '');
                    strListClass                            = (((intListRows > 1) && (intColumnWidth === 12)) ? 'selection-list-compressed' : '');


                    for (intCounterInner = 0; intCounterInner < framework.wizard.dlrsa.data.dataset.demographics[intCounter][intCounterOuter].choices.length; intCounterInner++) {
                        txtQuestionChoiceHTML                   += Mustache.render( txtTemplateQuestionChoice,
                                                                                    {
                                                                                        choice_class: strChoiceClass + (((intListRows > 1) && ((intCounterInner % intListRows) === 0)) ? ' clear' : ''),
                                                                                        choice_name: 'demo_choice_' + intCounter,
                                                                                        choice_value: intCounterInner,
                                                                                        choice_text: framework.wizard.dlrsa.data.dataset.demographics[intCounter][intCounterOuter].choices[intCounterInner].title
                                                                                    });
                    }

                    txtDemographicInnerHTML                 += Mustache.render( txtTemplateDemographicSectionInner,
                                                                                {
                                                                                    question_grid_width: strColumnClass,
                                                                                    question_title: framework.wizard.dlrsa.data.dataset.demographics[intCounter][intCounterOuter].text,
                                                                                    question_list_class: strListClass,
                                                                                    question_choices: txtQuestionChoiceHTML
                                                                                });
                }

                txtDemographicHTML                      += Mustache.render( txtTemplateDemographicSection,
                                                                            {
                                                                                section_data: txtDemographicInnerHTML
                                                                            });

                framework.wizard.dlrsa.data.containers.demographics.list.append(txtDemographicHTML);
            }

            jQuery('li>label', framework.wizard.dlrsa.data.containers.demographics.list).bind('click', framework.wizard.dlrsa.fn.radio.set_class);
            jQuery('>nav.pagination>a', framework.wizard.dlrsa.data.containers.demographics.meta.footer).bind('click', framework.wizard.dlrsa.fn.demographics.navigate);

            framework.wizard.dlrsa.data.demographics.current    = 1;
            framework.wizard.dlrsa.data.demographics.total      = jQuery('>li', framework.wizard.dlrsa.data.containers.demographics.list).length;

            framework.wizard.dlrsa.fn.demographics.set_metadata(true);
        },

        init_results: function() {
            jQuery('a[data-section]', framework.wizard.dlrsa.data.containers.results.list).unbind('click').bind('click', framework.wizard.dlrsa.fn.navigate_to_main_section);
            jQuery('>nav.pagination>a', framework.wizard.dlrsa.data.containers.results.meta.footer).unbind('click').bind('click', framework.wizard.dlrsa.fn.results.navigate);

            framework.wizard.dlrsa.data.results.current         = 1;
            framework.wizard.dlrsa.data.results.total           = jQuery('>li', framework.wizard.dlrsa.data.containers.results.list).length;
        },

        navigate_to_main_section: function(objEvent) {
            objEvent.preventDefault();

            if (!framework.wizard.dlrsa.data.animation.animating) {
                console.log('animating');

                var strSection          = jQuery(this).attr('data-section');

                if (strSection.length) {
                    jQuery('>section>div:visible', framework.wizard.dlrsa.data.containers.main).each(function() {
                        console.log(this);

                        jQuery(this)
                            .css({display: 'block', 'opacity': 1})
                            .stop()
                            .animate({opacity: 0}, framework.wizard.dlrsa.data.animation.speed, function() { jQuery(this).css({display: 'none'}); });
                    });

                    console.log(strSection);

                    jQuery('>section>div.' + strSection, framework.wizard.dlrsa.data.containers.main)
                        .css({display: 'block', 'opacity': 0})
                        .delay(framework.wizard.dlrsa.data.animation.speed * 1.25)
                        .stop()
                        .animate({opacity: 1}, framework.wizard.dlrsa.data.animation.speed, function() { framework.wizard.dlrsa.data.animation.animating = false; });

                    jQuery('>footer li.print, >footer li.email', framework.wizard.dlrsa.data.containers.main).hide();

                    switch (strSection.toLowerCase()) {
                        case 'questions' :
                            framework.wizard.dlrsa.fn.questions.show(framework.wizard.dlrsa.data.questions.current);
                            break;

                        case 'questions-demographics' :
                            framework.wizard.dlrsa.fn.demographics.show(framework.wizard.dlrsa.data.demographics.current);
                            break;

                        case 'results' :
                            jQuery('>footer li.print, >footer li.email', framework.wizard.dlrsa.data.containers.main).show();

                            if (!framework.wizard.dlrsa.data.results.viewing_detail) {
                                framework.wizard.dlrsa.fn.results.compile();
                            } else {
                                framework.wizard.dlrsa.data.results.viewing_detail      = false;
                            }
                            framework.wizard.dlrsa.fn.results.show(framework.wizard.dlrsa.data.results.current);
                            break;

                        case 'results-detail' :
                            framework.wizard.dlrsa.data.results.viewing_detail      = true;
                            framework.wizard.dlrsa.fn.results.detail(jQuery(this).attr('data-result-id'));
                            break;
                    }
                }
            }
        },

        radio: {
            set_class: function(objEvent) {
                jQuery(this).addClass('selected');
                jQuery('>label', jQuery(this).parent('li').siblings('li')).removeClass('selected');
            }
        },

        questions: {
            set_metadata: function(boolSetTotal) {
                // header metadata
                if (boolSetTotal) {
                    jQuery('>h5 span.total', framework.wizard.dlrsa.data.containers.questions.meta.header).html(framework.wizard.dlrsa.data.questions.total);
                }
                jQuery('>h5 span.current', framework.wizard.dlrsa.data.containers.questions.meta.header).html(framework.wizard.dlrsa.data.questions.current);

                // footer metadata
                jQuery('>nav.pagination>a', framework.wizard.dlrsa.data.containers.questions.meta.footer).removeClass('disabled');

                if (framework.wizard.dlrsa.data.questions.current === 1) {
                    jQuery('>nav.pagination>a.back', framework.wizard.dlrsa.data.containers.questions.meta.footer).addClass('disabled');
                }
            },

            navigate: function(objEvent) {
                objEvent.preventDefault();

                switch (true) {
                    case jQuery(this).hasClass('next') :
                        if (framework.wizard.dlrsa.data.questions.current === framework.wizard.dlrsa.data.questions.total) {
                            // advance to next section
                            framework.wizard.dlrsa.fn.navigate_to_main_section.call(jQuery(this)[0], objEvent);
                        } else {
                            if ((true) || (jQuery('>li:visible>ol>li input[type="radio"]:checked', framework.wizard.dlrsa.data.containers.questions.list).length)) {
                                framework.wizard.dlrsa.data.questions.current++;

                                framework.wizard.dlrsa.fn.questions.show(framework.wizard.dlrsa.data.questions.current);
                            } else {
                                alert('Please choose an answer to this question.');
                            }
                        }
                        break;

                    case jQuery(this).hasClass('back') :
                        if (framework.wizard.dlrsa.data.questions.current === 1) {
                            // go to previous section
                            framework.wizard.dlrsa.fn.navigate_to_main_section.call(jQuery(this)[0], objEvent);
                        } else {
                            framework.wizard.dlrsa.data.questions.current--;
                        }

                        framework.wizard.dlrsa.fn.questions.show(framework.wizard.dlrsa.data.questions.current);
                        break;
                }
            },

            show: function(intIndex) {
                jQuery('>li', framework.wizard.dlrsa.data.containers.questions.list).hide();
                jQuery('>li:eq(' + (intIndex - 1) + ')', framework.wizard.dlrsa.data.containers.questions.list).show();

                framework.wizard.dlrsa.fn.questions.set_metadata(false);
            }
        },

        demographics: {
            set_metadata: function(boolSetTotal) {
                // header metadata
                if (boolSetTotal) {
                    jQuery('>h5 span.total', framework.wizard.dlrsa.data.containers.demographics.meta.header).html(framework.wizard.dlrsa.data.questions.total);
                }
                jQuery('>h5 span.current', framework.wizard.dlrsa.data.containers.demographics.meta.header).html(framework.wizard.dlrsa.data.questions.current);

                // footer metadata
                jQuery('>nav.pagination>a', framework.wizard.dlrsa.data.containers.demographics.meta.footer).removeClass('disabled');

                if (framework.wizard.dlrsa.data.demographics.current === 1) {
                    jQuery('>nav.pagination>a.back', framework.wizard.dlrsa.data.containers.demographics.meta.footer).addClass('disabled');
                }
            },

            navigate: function(objEvent) {
                objEvent.preventDefault();

                switch (true) {
                    case jQuery(this).hasClass('next') :
                        if (framework.wizard.dlrsa.data.demographics.current === framework.wizard.dlrsa.data.demographics.total) {
                            // advance to next section
                            framework.wizard.dlrsa.fn.navigate_to_main_section.call(jQuery(this)[0], objEvent);
                        } else {
                            framework.wizard.dlrsa.data.demographics.current++;

                            framework.wizard.dlrsa.fn.demographics.show(framework.wizard.dlrsa.data.demographics.current);
                        }
                        break;

                    case jQuery(this).hasClass('back') :
                        if (framework.wizard.dlrsa.data.demographics.current === 1) {
                            // go to previous section
                            framework.wizard.dlrsa.fn.navigate_to_main_section.call(jQuery(this)[0], objEvent);
                        } else {
                            framework.wizard.dlrsa.data.demographics.current--;
                        }

                        framework.wizard.dlrsa.fn.demographics.show(framework.wizard.dlrsa.data.demographics.current);
                        break;
                }
            },

            show: function(intIndex) {
                jQuery('>li', framework.wizard.dlrsa.data.containers.demographics.list).hide();
                jQuery('>li:eq(' + (intIndex - 1) + ')', framework.wizard.dlrsa.data.containers.demographics.list).show();

                framework.wizard.dlrsa.fn.demographics.set_metadata(false);
            }
        },

        results: {
            set_metadata: function(boolSetTotal) {
                // header metadata
                if (boolSetTotal) {
                    jQuery('>h5 span.total', framework.wizard.dlrsa.data.containers.results.meta.header).html(framework.wizard.dlrsa.data.results.total);
                }
                jQuery('>h5 span.current', framework.wizard.dlrsa.data.containers.results.meta.header).html(framework.wizard.dlrsa.data.results.current);

                // footer metadata
                jQuery('>nav.pagination>a', framework.wizard.dlrsa.data.containers.results.meta.footer).removeClass('disabled');

                if (framework.wizard.dlrsa.data.results.current === 1) {
                    jQuery('>nav.pagination>a.back', framework.wizard.dlrsa.data.containers.results.meta.footer).addClass('disabled');
                }
            },

            compile: function() {
                var txtTemplateResultPage               = jQuery('#template-result-page').html();
                var txtTemplateResultRow                = jQuery('#template-result-row').html();
                var intCounter;
                var txtResultHTML, txtResultRowHTML, strResultStatusClass, strResultStatusText, intAnswerValue;

                Mustache.parse(txtTemplateResultPage);
                Mustache.parse(txtTemplateResultRow);

                txtResultRowHTML                        = '';

                for (intCounter = 0; intCounter < framework.wizard.dlrsa.data.dataset.questions.length; intCounter++) {
                    if ((intCounter > 0) && ((intCounter % 3) === 0)) {
                        txtResultHTML                           = Mustache.render(  txtTemplateResultPage,
                                                                                    {
                                                                                        result_data: txtResultRowHTML
                                                                                    });

                        txtResultRowHTML                        = '';

                        framework.wizard.dlrsa.data.containers.results.list.append(txtResultHTML);
                    }

                    intAnswerValue                          = parseInt(jQuery('input[name="question_choice_' + intCounter + '"]:checked').val());

                    if (framework.wizard.dlrsa.data.dataset.questions[intCounter].choices[intAnswerValue]) {
                        switch (true) {
                            case (framework.wizard.dlrsa.data.dataset.questions[intCounter].choices[intAnswerValue].points > 0) :
                                strResultStatusClass                = 'ready';
                                strResultStatusText                 = 'Ready';
                                break;

                            case (framework.wizard.dlrsa.data.dataset.questions[intCounter].choices[intAnswerValue].points === 0) :
                                strResultStatusClass                = 'almost-ready';
                                strResultStatusText                 = 'Almost Ready';
                                break;

                            case (framework.wizard.dlrsa.data.dataset.questions[intCounter].choices[intAnswerValue].points < 0) :
                                strResultStatusClass                = 'not-ready';
                                strResultStatusText                 = 'Not Ready';
                                break;
                        }

                        txtResultRowHTML                        += Mustache.render(  txtTemplateResultRow,
                                                                                    {
                                                                                        result_status: strResultStatusClass,
                                                                                        result_counter: intCounter + 1,
                                                                                        result_text: '<p>' + framework.wizard.dlrsa.data.dataset.questions[intCounter].text + '</p><ul><li>' + framework.wizard.dlrsa.data.dataset.questions[intCounter].choices[intAnswerValue].text + '</li></ul>',
                                                                                        result_status_text: strResultStatusText,
                                                                                        result_index: intCounter
                                                                                    });
                    }
                }

                if (txtResultRowHTML.length) {
                    txtResultHTML                           = Mustache.render(  txtTemplateResultPage,
                                                                                {
                                                                                    result_data: txtResultRowHTML
                                                                                });

                    txtResultRowHTML                        = '';

                    framework.wizard.dlrsa.data.containers.results.list.append(txtResultHTML);
                }

                framework.wizard.dlrsa.fn.init_results();
                framework.wizard.dlrsa.fn.results.set_metadata(true);
            },

            detail: function(intIndex) {
                var intAnswerValue                      = parseInt(jQuery('input[name="question_choice_' + intIndex + '"]:checked').val());

                if ((framework.wizard.dlrsa.data.dataset.questions[intIndex]) && (!isNaN(intAnswerValue))) {
                    var txtTemplateResultDetail             = jQuery('#template-result-detail').html();
                    var txtTemplateResultDetailInner        = jQuery('#template-result-detail-inner').html();
                    var strResultStatusClass, strResultStatusText;
                    var txtResultDataHTML, txtResultDataInnerHTML;

                    Mustache.parse(txtTemplateResultDetail);
                    Mustache.parse(txtTemplateResultDetailInner);

                    switch (true) {
                        case (framework.wizard.dlrsa.data.dataset.questions[intIndex].choices[intAnswerValue].points > 0) :
                            strResultStatusClass                = 'ready';
                            strResultStatusText                 = 'Ready';
                            break;

                        case (framework.wizard.dlrsa.data.dataset.questions[intIndex].choices[intAnswerValue].points === 0) :
                            strResultStatusClass                = 'almost-ready';
                            strResultStatusText                 = 'Almost Ready';
                            break;

                        case (framework.wizard.dlrsa.data.dataset.questions[intIndex].choices[intAnswerValue].points < 0) :
                            strResultStatusClass                = 'not-ready';
                            strResultStatusText                 = 'Not Ready';
                            break;
                    }

                    txtResultDataInnerHTML                  = Mustache.render(  txtTemplateResultDetailInner,
                                                                                {
                                                                                    detail_choice: framework.wizard.dlrsa.data.dataset.questions[intIndex].choices[intAnswerValue].text,
                                                                                    detail_status: strResultStatusText,
                                                                                    detail_text: '<p>' + framework.wizard.dlrsa.data.dataset.questions[intIndex].choices[intAnswerValue].more + '</p>'
                                                                                });

                    txtResultDataHTML                       = Mustache.render(  txtTemplateResultDetail,
                                                                                {
                                                                                    result_status: strResultStatusClass,
                                                                                    result_detail: txtResultDataInnerHTML
                                                                                });

                    framework.wizard.dlrsa.data.containers.details.content.html(txtResultDataHTML);
                }
            },

            navigate: function(objEvent) {
                objEvent.preventDefault();

                switch (true) {
                    case jQuery(this).hasClass('next') :
                        if (framework.wizard.dlrsa.data.results.current === framework.wizard.dlrsa.data.results.total) {
                            // advance to next section
                            framework.wizard.dlrsa.fn.navigate_to_main_section.call(jQuery(this)[0], objEvent);
                        } else {
                            framework.wizard.dlrsa.data.results.current++;

                            framework.wizard.dlrsa.fn.results.show(framework.wizard.dlrsa.data.results.current);
                        }
                        break;

                    case jQuery(this).hasClass('back') :
                        if (framework.wizard.dlrsa.data.results.current === 1) {
                            // go to previous section
                            framework.wizard.dlrsa.fn.navigate_to_main_section.call(jQuery(this)[0], objEvent);
                        } else {
                            framework.wizard.dlrsa.data.results.current--;
                        }

                        framework.wizard.dlrsa.fn.results.show(framework.wizard.dlrsa.data.results.current);
                        break;
                }
            },

            show: function(intIndex) {
                jQuery('>li', framework.wizard.dlrsa.data.containers.results.list).hide();
                jQuery('>li:eq(' + (intIndex - 1) + ')', framework.wizard.dlrsa.data.containers.results.list).show();

                framework.wizard.dlrsa.fn.results.set_metadata(false);
            }
        }
    }
};