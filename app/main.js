$(function() {
	var header = $('.header'),
		content = $('.content');

	//Переключение страниц
		var afterslash = location.hash.split('/').pop(),
			hash = location.hash.substr(1).replace('/'+afterslash, ''),
			page = [],
			page_title_postfix = ' / PIX',
			timer;

		$('[data-page]').each(function() {
			page.push($(this).data('page'));
		});

		function page_update(a) {
			if(page.indexOf(a) !== -1) {
				if(!header.hasClass('small')) header.addClass('hidden');
				content.removeClass('visible');
				clearTimeout(timer);
				timer = setTimeout(function() {
					$('[data-page]').removeAttr('class');
					if(a == 'search') {
						$('.search').addClass('extended');
					} else {
						$('.search').removeClass('extended');
					}
					header.addClass('small').removeClass('hidden');
					$('[data-page="'+a+'"]').addClass('current');
					content.addClass('visible');
					document.title = $('[data-page="'+a+'"]').data('page-title')+page_title_postfix;
				}, 250);
			} else {
				if(header.hasClass('small')) header.addClass('hidden');
				content.removeClass('visible');
				clearTimeout(timer);
				timer = setTimeout(function() {
					$('[data-page]').removeAttr('class');
					$('.search').removeClass('extended');
					header.removeClass('small').removeClass('hidden');
					content.removeClass('visible');
					document.title = 'Главная'+page_title_postfix;
				}, 250);
			}
		}

		$(window).on('hashchange', function(e) {
			var afterslash = location.hash.split('/').pop(),
				hash = location.hash.substr(1).replace('/'+afterslash, '');
			page_update(hash);
		});

		page_update(hash);

	//Кнопки
		//Функции
			//Смена хэша в URL
				window.hash_set = function(a) {
					location.hash = a;
				}

			//Копирование текста из поля
				window.text_copy = function(a, b) {
				}

			//Добавление текста в поле
				window.text_add = function(a, b) {
					$(a).val(function(i, t) {
						return t + b;
					});
					$(a).focus();
				}

			//Деактивировать все кнопки
				window.buttons_deactivate = function(a) {
					var b = $(a).closest('.navigation-button').data('menu-ref')
					$('.navigation-button[data-menu-ref!="'+b+'"]').removeClass('active');
					$('.navigation-menu[data-menu!="'+b+'"]').removeClass('visible');
					$('.select').not($(a).closest('.select')).removeClass('active');
				}

			//Комментарии
				window.comment_codeAdd = function(a, b) {
					var c = $(a).closest('.comment-tools').siblings('.comment-field'),
						d = b == 'bold' ? '[b][/b]' :
							b == 'italic' ? '[i][/i]' :
							b == 'underscore' ? '[u][/u]' :
							b == 'strikethrough' ? '[s][/s]' :
							b == 'url' ? '[url]http://example.com[/url]' :
							b == 'url-entitled' ? '[url=http://example.com]Название[/url]' : '';
					text_add(c, d);
				}

				window.comment_send = function(a) {
					var b = $(a).parent().parent().find('.block-progress'),
						c = $(a).closest('.comment-tools').siblings('.comment-field'),
						d = $(a).closest('.comment-write');
					$(a).attr('disabled', '');
					b.css('width', '0%');
					b.addClass('visible');
					b.animate({'width' : '100%'}, 1000);
					clearTimeout(timer);
					timer = setTimeout(function() {
						$(a).removeAttr('disabled');
						b.removeClass('visible');
						c.val('');
						d.removeClass('extended');
					}, 1000);
				}

				window.comment_rate = function(a) {
					$(a).toggleClass('active').siblings().removeClass('active');
				}

				window.comment_reply = function(a) {
					//var c = $(a).closest('.comment-field');
					text_add('.comment-field', '@'+a+', ');
				}

			//Модальное окно
				window.modal_open = function(a) {
					$('.dialog-text').text(a);
					$('body').addClass('modal');
				}

				window.modal_close = function() {
					$('body').removeClass('modal');
					clearTimeout(timer);
					timer = setTimeout(function() {
						$('.dialog-text').text('');
					}, 500);
				}

		//Навигация
			$('body').on('click', '.navigation-button', function() {
				var ref = $(this).data('menu-ref');
				$(this).toggleClass('active');
				$('.navigation-menu[data-menu="'+ref+'"]').toggleClass('visible').siblings().removeClass('visible');
			});

			$('body').on('click', '.navigation-menu', function(e) {
				if($(e.target).is('a, button, button > *')) return;
				e.stopPropagation();
			});

		//Всплывающие листы
			$('.select').each(function() {
				if(!$(this).hasClass('dropdown')) {
					var li_first = $(this).find('.select-list li:first-child');
					li_first.addClass('current');
					$(this).find('.select-text').text(li_first.text());
				}
			});

			$('body').on('click', '.select-button', function(e) {
				$(this).closest('.select').toggleClass('active');
			});

			$('body').on('click', '.select-list li', function() {
				if(!$(this).closest('.select').hasClass('dropdown')) {
					$(this).addClass('current').siblings().removeAttr('class');
					$(this).parent().siblings().find('.select-text').text($(this).text());
				}
				$(this).closest('.select').removeClass('active');
			});

		//Строка поиска
			$('body').on('keypress', '.search-query', function(e) {
				if(e.which == 13) {
					hash_set('search/'+$('.search-query').val());
				}
			});

		//Вкладки
			$('body').on('click', '.block-tabs li', function() {
				$(this).addClass('current').siblings().removeAttr('class');
			});

			$('body').on('click', '[data-tab-ref]', function() {
				var ref = $(this).data('tab-ref');
				$('[data-tab="'+ref+'"]').addClass('current').siblings().removeClass('current');
			});

			$('.block-tabs li:first-child').each(function() {
				$(this).addClass('current');
			});

			$('.block-tab:first-child').each(function() {
				$(this).addClass('current');
			});

		//Переключатели видимости
			$('body').on('click', '[data-toggle-ref]', function() {
				var ref = $(this).data('toggle-ref');
				$('[data-toggle="'+ref+'"]').toggleClass('active');
			});

		//Страница
			$(document).on('click', function(e) {
				buttons_deactivate(e.target);
			});

	//Текстовые поля
		//Комментарий
			$('body').on('click', '.comment-field', function() {
				$(this).closest('.comment-write').addClass('extended');
			});

			$(document).on('click', function(e) {
				if($(e.target).closest('.comment-write').length < 1) $('.comment-write').removeClass('extended');
			});

		//Любые
			$('.input-text.area').each(function() {
				$(this).val('');
				$(this).css({
					'height': this.scrollHeight + 'px',
					'overflow-y': 'hidden'
				});
			}).on('input', function() {
				$(this).css('height', '0');
				$(this).css('height', this.scrollHeight + 'px');
			});

	//Плеер
		var player = $('.player'),
			player_video = $('.player-video'),
			player_image = $('.player-image'),
			player_message = $('.player-message'),
			player_loading = $('.player-loading'),
			player_control = $('.player-control'),
			player_timeline = $('.player-timeline'),
			player_timeline_buffer = $('.player-timeline .player-progress-buffer'),
			player_timeline_current = $('.player-timeline .player-progress-current'),
			player_button = $('.player-button'),
			player_volume = $('.player-volume'),
			player_volume_current = $('.player-volume .player-progress-current'),
			player_time = $('.player-time'),
			player_menu = $('.player-menu'),
			player_context = $('.player-context'),

			player_error = false,
			player_timeline_drag = false,
			player_volume_drag = false,
			player_volume_default = 0.5;

		//Функции
			function player_setDebug(a) {
				$.each(a, function(k, v) {
					$('.player-debug-'+k).text(v);
				});
			}

			function player_setButton(a, b) {
				switch(a) {
					case 'play':
						$('.player-button-'+a).attr('data-value', b).attr('data-title', (b == 0 ? 'Воспроизведение' : b == 1 ? 'Пауза' : b == 2 ? 'Повтор' : '')); break;
					case 'volume':
						$('.player-button-'+a).attr('data-value', b); break;
					case 'expand':
						$('.player-button-'+a).attr('data-value', b).attr('data-title', (b == 0 ? 'Развернуть' : b == 1 ? 'Свернуть' : '')); break;
				}
			}

			function player_startBuffer() {
				var a = player_video[0].duration,
					b = player_video[0].buffered.end(0),
					c = 100 * b / a;
				player_setDebug({'buffer': b+' / '+a});
				player_timeline_buffer.css('width', c+'%');
				if(b < a) {
					setTimeout(player_startBuffer, 500);
				}
			}

			function player_setTimelineCurrent(a) {
				if(!player_error) {
					var b = player_video[0].duration,
						c = a - player_timeline.offset().left,
						d = 100 * c / player_timeline.width();
					d = d > 100 ? 100 : d < 0 ? 0 : d;
					player_video[0].currentTime = b * d / 100;
					player_timeline_current.css('width', d+'%');
					if(player_video[0].paused && d < 100) {
						player_setButton('play', 0);
					}
				}
			}

			function player_setVolumeCurrent(a) {
				var b = a - player_volume.offset().left,
					c = 100 * b / player_volume.width();
				c = c > 100 ? 100 : c < 0 ? 0 : c;
				player_video[0].volume = c / 100;
				player_volume_current.css('width', c+'%');
			}

			function player_resetProgress() {
				player_video[0].currentTime = 0;
				player_timeline_buffer.css('width', '0');
				player_timeline_current.css('width', '0');
			}

			function player_formatTime(a) {
				var hours = Math.floor(a / 3600),
					minutes = Math.floor((a - (hours * 3600)) / 60),
					seconds = Math.floor(a - (hours * 3600) - (minutes * 60));
				if(hours < 10 && a >= 36000) { hours = '0' + hours; }
				if(minutes < 10 && a >= 600) { minutes = '0' + minutes; }
				if(seconds < 10) { seconds = '0' + seconds; }
				return (hours > 0 ? hours + ':' : '') + minutes + ':' + seconds;
			}

			function player_getTime() {
				return player_formatTime(player_video[0].currentTime)+' / '+player_formatTime(player_video[0].duration);
			}

			function player_hideMenus() {
				player_control.removeClass('permanent');
				player_button.removeClass('active');
				player_menu.removeClass('visible');
			}

		//Видео
			player_video.on('error', function() {
				player_error = true;
				player_video.addClass('error');
				player_message.text('Возникла проблема с загрузкой медиа-файла, попробуйте обновить страницу.').addClass('visible');
				player_setDebug({'event': 'error'});
				player_loading.removeClass('visible');
				player_resetProgress();
				player_setButton('play', 0);
				$('.player-button-play').attr('disabled', '');
			});

			player_video.on('loadstart', function() {
				player_setDebug({
					'source': player_video[0].src || player_video.attr('src'),
					'buffer': '0 / 0',
					'volume': player_video[0].volume || 0,
					'event': 'loadstart'
				});
				player_resetProgress();
				player_setButton('play', 0);
				player_video[0].volume = player_volume_default;
				player_time.text('0:00 / 0:00');
			});

			player_video.on('waiting', function() {
				player_setDebug({'event': 'waiting'});
				player_loading.addClass('visible');
			});

			player_video.on('canplay', function() {
				player_error = false;
				player_video.removeClass('error');
				player_message.removeClass('visible');
				player_setDebug({
					'time': player_video[0].currentTime+' / '+player_video[0].duration,
					'event': 'canplay'
				});
				player_loading.removeClass('visible');
				setTimeout(player_startBuffer, 500);
				$('.player-button-play').removeAttr('disabled');
				player_time.text(player_getTime());
			});

			player_video.on('timeupdate', function() {
				player_setDebug({
					'time': player_video[0].currentTime+' / '+player_video[0].duration,
					'event': 'timeupdate'
				});
				var percentage = 100 * player_video[0].currentTime / player_video[0].duration;
				player_timeline_current.css('width', percentage+'%');
				player_time.text(player_getTime());
			});

			//Смена прогресса
				player_timeline.mousedown(function(e) {
					player_timeline_drag = true;
					player_setTimelineCurrent(e.pageX);
				});
				$(document).mouseup(function(e) {
					if(player_timeline_drag) {
						player_timeline_drag = false;
						player_setTimelineCurrent(e.pageX);
					}
				});
				$(document).mousemove(function(e) {
					if(player_timeline_drag) {
						player_setTimelineCurrent(e.pageX);
					}
				});

			player_video.on('play', function() {
				player_setDebug({'event': 'play'});
				player_setButton('play', 1);
			});

			player_video.on('pause', function() {
				player_setDebug({'event': 'pause'});
				player_setButton('play', 0);
			});

			player_video.on('ended', function() {
				player_setDebug({'event': 'ended'});
				player_setButton('play', 2);
			});

			player_video.on('volumechange', function() {
				player_setDebug({
					'volume': player_video[0].volume,
					'event': 'volumechange'
				});
				if(player_video[0].volume == 0) {
					player_setButton('volume', 0);
				} else
				if(player_video[0].volume > 0 && player_video[0].volume <= 0.25) {
					player_setButton('volume', 1);
				} else
				if(player_video[0].volume > 0.25 && player_video[0].volume <= 0.75) {
					player_setButton('volume', 2);
				} else
				if(player_video[0].volume > 0.75 && player_video[0].volume <= 1) {
					player_setButton('volume', 3);
				}
				var percentage = 100 * player_video[0].volume;
				player_volume_current.css('width', percentage+'%');
			});

			//Смена громкости
				player_volume.mousedown(function(e) {
					player_volume_drag = true;
					player_setVolumeCurrent(e.pageX);
				});
				$(document).mouseup(function(e) {
					if(player_volume_drag) {
						player_volume_drag = false;
						player_setVolumeCurrent(e.pageX);
					}
				});
				$(document).mousemove(function(e) {
					if(player_volume_drag) {
						player_setVolumeCurrent(e.pageX);
					}
				});

			$(window).on('hashchange', function(e) {
				if(!player_error) {
					player_video[0].pause();
				}
			});

			//Кнопки
				//Воспроизведение
					$('body').on('click', '.player-video', function() {
						if(!player_error && !player_menu.hasClass('visible') && !player_context.hasClass('visible')) {
							player_video[0].paused ? player_video[0].play() : player_video[0].pause();
						}
					});

					$('body').on('click', '.player-button-play[data-value="0"]', function() {
						if(!player_error) {
							player_video[0].play();
						}
					});

					$('body').on('click', '.player-button-play[data-value="1"]', function() {
						if(!player_error) {
							player_video[0].pause();
						}
					});

					$('body').on('click', '.player-button-play[data-value="2"]', function() {
						if(!player_error) {
							player_video[0].play();
						}
					});

				//Громкость
					$('body').on('click', '.player-button-volume', function() {
						if(player_video[0].volume > 0) {
							player_video[0].volume = 0;
						} else {
							player_video[0].volume = player_volume_default;
						}
					});

				//Размер
					$('body').on('click', '.player-button-expand[data-value="0"]', function() {
						if(player.requestFullscreen) {
							player.requestFullscreen();
						} else
						if(player.msRequestFullscreen) {
							player.msRequestFullscreen();
						} else
						if(player.mozRequestFullScreen) {
							player.mozRequestFullScreen();
						} else
						if(player.webkitRequestFullscreen) {
							player.webkitRequestFullscreen();
						}
						player_setButton('expand', 1);
					});

					$('body').on('click', '.player-button-expand[data-value="1"]', function() {
						player_setButton('expand', 0);
					});

				//Меню
					$('body').on('click', '.player-button', function(e) {
						var ref = $(this).data('menu-ref');
						if(ref) {
							$('.player-menu[data-menu="'+ref+'"]').toggleClass('visible').siblings().removeClass('visible');
							$(this).toggleClass('active');
							player_control.toggleClass('permanent');
						} else {
							player_hideMenus();
						}
						player_context.removeClass('visible');
						e.stopPropagation();
					});

					$('body').on('click', '.player-select li', function() {
						if($(this).siblings().hasClass('current')) {
							$(this).addClass('current').siblings().removeAttr('class');
						}
					});

					$(document).on('click', function(e) {
						if(!($(e.target).parent().hasClass('player-menu') && $(e.target).hasClass('disabled'))) {
							player_hideMenus();
						}
					});

				//Контекстное меню
					$('body').on('contextmenu', '.player', function(e) {
						if(!player_context.hasClass('visible')) {
							var x = e.pageX - player.offset().left,
								y = e.pageY - player.offset().top;
							player_context.css({'left': x, 'top': y}).addClass('visible');
							buttons_deactivate();
						} else {
							player_context.removeClass('visible');
						}
						player_hideMenus();
						e.preventDefault();
					});

					$(document).on('click', function(e) {
						if(!($(e.target).parent().hasClass('player-select') && $(e.target).hasClass('disabled'))) {
							player_context.removeClass('visible');
						}
					});

		//Изображение
			//Кнопки
				//Повороты
					$('body').on('click', '.player-button-rotate', function() {
						var value = $(this).attr('data-value'),
							img = $('.player-image > img'),
							img_mw = img.css('max-width');
							img_mh = img.css('max-height');
							img_tf = img.css('transform');
						if(value == 0) {
							switch(img_tf) {
								case 'matrix(1, 0, 0, 1, 0, 0)':
									img.css('transform', 'rotate(-90deg)'); img.css('max-width', img_mh); img.css('max-height', img_mw); break;
								case 'matrix(0, -1, 1, 0, 0, 0)':
									img.css('transform', 'rotate(-180deg)'); img.css('max-width', ''); img.css('max-height', ''); break;
								case 'matrix(-1, 0, 0, -1, 0, 0)':
									img.css('transform', 'rotate(-270deg)'); img.css('max-width', img_mh); img.css('max-height', img_mw); break;
								case 'matrix(0, 1, -1, 0, 0, 0)':
									img.removeAttr('style'); break;
								default:
									img.css('transform', 'rotate(-90deg)'); img.css('max-width', img_mh); img.css('max-height', img_mw);
							}
						} else
						if(value == 1) {
							switch(img_tf) {
								case 'matrix(1, 0, 0, 1, 0, 0)':
									img.css('transform', 'rotate(90deg)'); img.css('max-width', img_mh); img.css('max-height', img_mw); break;
								case 'matrix(0, 1, -1, 0, 0, 0)':
									img.css('transform', 'rotate(180deg)'); img.css('max-width', ''); img.css('max-height', ''); break;
								case 'matrix(-1, 0, 0, -1, 0, 0)':
									img.css('transform', 'rotate(270deg)'); img.css('max-width', img_mh); img.css('max-height', img_mw); break;
								case 'matrix(0, -1, 1, 0, 0, 0)':
									img.removeAttr('style'); break;
								default:
									img.css('transform', 'rotate(90deg)'); img.css('max-width', img_mh); img.css('max-height', img_mw);
							}
						}
					});
});