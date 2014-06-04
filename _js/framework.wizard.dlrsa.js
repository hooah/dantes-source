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
            }
        },
        questions: {
            current: 0,
            total: 0
        },
        animation: {
            animating: false,
            speed: 500
        }
    }, 
    fn: {
        init: function() {
            var counter, counter_inner;

            // setup containers
            framework.wizard.dlrsa.data.containers.main                     = jQuery('.wizard-distance-learning');
            framework.wizard.dlrsa.data.containers.questions.main           = jQuery('>section>.questions', framework.wizard.dlrsa.data.containers.main);
            framework.wizard.dlrsa.data.containers.questions.list           = jQuery('>section>ol', framework.wizard.dlrsa.data.containers.questions.main);
            framework.wizard.dlrsa.data.containers.questions.meta.header    = jQuery('>header', framework.wizard.dlrsa.data.containers.questions.main);
            framework.wizard.dlrsa.data.containers.questions.meta.footer    = jQuery('>footer', framework.wizard.dlrsa.data.containers.questions.main);

            // setup questions
            var template_question                   = jQuery('#template-question').html();
            var template_question_choice            = jQuery('#template-question-choice').html();
            var question_html, question_choice_html;

            Mustache.parse(template_question);
            Mustache.parse(template_question_choice);

            for (counter = 0; counter < framework.wizard.dlrsa.data.dataset.questions.length; counter++) {
                question_html                           = '';
                question_choice_html                    = '';

                for (counter_inner = 0; counter_inner < framework.wizard.dlrsa.data.dataset.questions[counter].choices.length; counter_inner++) {
                    question_choice_html                    += Mustache.render( template_question_choice,
                                                                                {
                                                                                    choice_name: 'question_choice_' + counter,
                                                                                    choice_value: counter_inner,
                                                                                    choice_text: framework.wizard.dlrsa.data.dataset.questions[counter].choices[counter_inner].text
                                                                                });
                }

                question_html                           = Mustache.render(  template_question,
                                                                            {
                                                                                question_title: framework.wizard.dlrsa.data.dataset.questions[counter].text,
                                                                                question_choices: question_choice_html
                                                                            });

                framework.wizard.dlrsa.data.containers.questions.list.append(question_html);
            }

            jQuery('li>label', framework.wizard.dlrsa.data.containers.questions.list).bind('click', framework.wizard.dlrsa.fn.radio.set_class);
            jQuery('>nav.pagination>a', framework.wizard.dlrsa.data.containers.questions.meta.footer).bind('click', framework.wizard.dlrsa.fn.questions.navigate);

            framework.wizard.dlrsa.data.questions.current       = 1;
            framework.wizard.dlrsa.data.questions.total         = jQuery('>li', framework.wizard.dlrsa.data.containers.questions.list).length;

            framework.wizard.dlrsa.fn.questions.set_metadata(true);

            // bind events
            jQuery('>section>div a.button[data-section]', framework.wizard.dlrsa.data.containers.main).bind('click', framework.wizard.dlrsa.fn.navigate_to_main_section);
        },

        navigate_to_main_section: function(objEvent) {
            objEvent.preventDefault();

            if (!framework.wizard.dlrsa.data.animation.animating) {
                var strSection          = jQuery(this).attr('data-section');

                if (strSection.length) {
                    jQuery('>section>div:visible', framework.wizard.dlrsa.data.containers.main).each(function() {
                        jQuery(this)
                            .css({display: 'block', 'opacity': 1})
                            .animate({opacity: 0}, framework.wizard.dlrsa.data.animation.speed, function() { jQuery(this).css({display: 'none'}); });
                    });

                    jQuery('>section>div.' + strSection, framework.wizard.dlrsa.data.containers.main)
                        .css({display: 'block', 'opacity': 0})
                        .delay(framework.wizard.dlrsa.data.animation.speed * 1.25)
                        .animate({opacity: 1}, framework.wizard.dlrsa.data.animation.speed, function() { framework.wizard.dlrsa.data.animation.animating = false; });

                    switch (strSection.toLowerCase()) {
                        case 'questions' :
                            framework.wizard.dlrsa.fn.questions.show(1);
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
                            if (jQuery('>li:visible>ol>li input[type="radio"]:checked', framework.wizard.dlrsa.data.containers.questions.list).length) {
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
        }
    }
}