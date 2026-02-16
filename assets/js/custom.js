$(document).ready(function(){
	"use strict";

        /*==================================
* Author        : "ThemeSine"
* Template Name : Khanas HTML Template
* Version       : 1.0
==================================== */



/*=========== TABLE OF CONTENTS ===========
1. Scroll To Top
2. Smooth Scroll spy
3. Progress-bar
4. owl carousel
5. welcome animation support
======================================*/

    // 1. Scroll To Top
		$(window).on('scroll',function () {
			if ($(this).scrollTop() > 600) {
				$('.return-to-top').fadeIn();
			} else {
				$('.return-to-top').fadeOut();
			}
		});
		$('.return-to-top').on('click',function(){
				$('html, body').animate({
				scrollTop: 0
			}, 1500);
			return false;
		});



	// 2. Smooth Scroll spy

		$('.header-area').sticky({
           topSpacing:0
        });

		//=============

		$('li.smooth-menu a').bind("click", function(event) {
			event.preventDefault();
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top - 0
			}, 1200,'easeInOutExpo');
		});

		$('body').scrollspy({
			target:'.navbar-collapse',
			offset:0
		});

	// 3. Progress-bar

		var dataToggleTooTip = $('[data-toggle="tooltip"]');
		var progressBar = $(".progress-bar");
		if (progressBar.length) {
			progressBar.appear(function () {
				dataToggleTooTip.tooltip({
					trigger: 'manual'
				}).tooltip('show');
				progressBar.each(function () {
					var each_bar_width = $(this).attr('aria-valuenow');
					$(this).width(each_bar_width + '%');
				});
			});
		}

	// 4. owl carousel

		// i. client (carousel)

			$('#client').owlCarousel({
				items:7,
				loop:true,
				smartSpeed: 1000,
				autoplay:true,
				dots:false,
				autoplayHoverPause:true,
				responsive:{
						0:{
							items:2
						},
						415:{
							items:2
						},
						600:{
							items:4

						},
						1199:{
							items:4
						},
						1200:{
							items:7
						}
					}
				});


				$('.play').on('click',function(){
					owl.trigger('play.owl.autoplay',[1000])
				})
				$('.stop').on('click',function(){
					owl.trigger('stop.owl.autoplay')
				})


    // 5. welcome animation support

        $(window).load(function(){
		$(".header-text h2,.header-text p").removeClass("animated fadeInUp").css({'opacity':'0'});
            $(".header-text a").removeClass("animated fadeInDown").css({'opacity':'0'});
        });

        $(window).load(function(){
		$(".header-text h2,.header-text p").addClass("animated fadeInUp").css({'opacity':'0'});
            $(".header-text a").addClass("animated fadeInDown").css({'opacity':'0'});
        });

	// 6. Chat widget toggle + Lebenslauf-Assistent (Profile.txt)
		var chatToggleButton = $('.chat-toggle-btn');
		var chatPanel = $('#chatWidgetPanel');
		var chatCloseButton = $('.chat-close-btn');
		var chatForm = $('#chatForm');
		var chatQuestionInput = $('#chatQuestion');
		var chatMessages = $('#chatMessages');
		var profileText = '';

		function appendMessage(message, sender) {
			if (!chatMessages.length) {
				return;
			}

			var safeMessage = $('<div>').text(message).html();
			var cssClass = sender === 'user' ? 'chat-message-user' : 'chat-message-bot';
			chatMessages.append('<div class="chat-message ' + cssClass + '">' + safeMessage + '</div>');
			chatMessages.scrollTop(chatMessages[0].scrollHeight);
		}

		function extractSection(sectionName) {
			if (!profileText) {
				return '';
			}

			var marker = sectionName + '\n';
			var start = profileText.indexOf(marker);
			if (start === -1) {
				return '';
			}

			var afterStart = profileText.slice(start + marker.length);
			var nextSectionIndex = afterStart.search(/\n[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\s]+\n/);
			var sectionBody = nextSectionIndex === -1 ? afterStart : afterStart.slice(0, nextSectionIndex);
			return sectionBody.trim();
		}

		function answerFromProfile(question) {
			if (!profileText) {
				return 'Ich konnte Profile.txt noch nicht laden. Bitte versuche es gleich erneut.';
			}

			var normalizedQuestion = question.toLowerCase();
			var sectionMap = [
				{ keywords: ['ausbildung', 'studium', 'uni', 'abschluss'], section: 'Ausbildung' },
				{ keywords: ['beruf', 'erfahrung', 'job', 'arbeit', 'filialleiter'], section: 'Berufserfahrung' },
				{ keywords: ['skill', 'kenntnis', 'programmier', 'sprache', 'tool', 'technologie'], section: 'Kenntnisse' },
				{ keywords: ['sprache', 'englisch', 'deutsch', 'spanisch'], section: 'Sprachen' },
				{ keywords: ['kontakt', 'email', 'e-mail', 'mail', 'linkedin', 'website'], section: 'Kontakt' },
				{ keywords: ['profil', 'über', 'ueber', 'vorstellen'], section: 'Kurzprofil' }
			];

			for (var i = 0; i < sectionMap.length; i++) {
				var hasKeyword = sectionMap[i].keywords.some(function (keyword) {
					return normalizedQuestion.indexOf(keyword) !== -1;
				});

				if (hasKeyword) {
					var sectionContent = extractSection(sectionMap[i].section);
					if (sectionContent) {
						return sectionMap[i].section + ':\n' + sectionContent;
					}
				}
			}

			var compactProfile = profileText.split('\n').filter(function (line) {
				return line.trim().length > 0;
			}).slice(0, 5).join(' ');

			return 'Ich habe dazu keine exakte Stelle gefunden. Hier ist ein kurzer Auszug aus dem Profil:\n' + compactProfile;
		}

		function loadProfileText() {
			return fetch('assets/download/Profile.txt')
				.then(function (response) {
					if (!response.ok) {
						throw new Error('Profile.txt konnte nicht geladen werden.');
					}
					return response.text();
				})
				.then(function (text) {
					profileText = text;
				})
				.catch(function () {
					profileText = '';
					appendMessage('Hinweis: Profile.txt konnte nicht geladen werden. Prüfe, ob die Datei unter assets/download/Profile.txt vorhanden ist.', 'bot');
				});
		}

		if (chatToggleButton.length && chatPanel.length) {
			chatToggleButton.on('click', function () {
				var isOpen = !chatPanel.prop('hidden');
				chatPanel.prop('hidden', isOpen);
				chatToggleButton.attr('aria-expanded', String(!isOpen));

				if (!isOpen && !profileText) {
					loadProfileText();
				}
			});

			chatCloseButton.on('click', function () {
				chatPanel.prop('hidden', true);
				chatToggleButton.attr('aria-expanded', 'false').focus();
			});
		}

		if (chatForm.length) {
			chatForm.on('submit', function (event) {
				event.preventDefault();
				var question = chatQuestionInput.val().trim();
				if (!question) {
					return;
				}

				appendMessage(question, 'user');
				appendMessage(answerFromProfile(question), 'bot');
				chatQuestionInput.val('').focus();
			});
		}

});

