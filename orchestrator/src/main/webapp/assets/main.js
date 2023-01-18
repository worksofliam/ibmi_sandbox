/* Carrd Site JS | carrd.co | License: MIT */

let connectionDetails = {
	codespaceUri: undefined,
	branch: undefined,
	server: undefined,
	username: undefined,
	password: undefined,
}

function goOnline() {
	window.location.hash = "goonline";
}

function loading() {
	window.location.hash = "loading";
}

(function() {

	var ele = document.getElementById(`form01`);
	ele.addEventListener("submit", function(e) {
		e.preventDefault(); //stop form from submitting

		loading();

		let xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.onreadystatechange = function () {
			if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
				console.log(JSON.parse(xmlHttpReq.responseText));
				const data = JSON.parse(xmlHttpReq.responseText);
				console.log(data);

				const branch = data.branch;

				document.getElementById("button-codespaces").href = `https://github.com/codespaces/new?machine=basicLinux32gb&repo=587978251&ref=${branch}&devcontainer_path=.devcontainer%2Fdevcontainer.json`;

				const server = data.hostname;
				const user = data.usrprf;
				const password = btoa(data.password);

				console.log(`'${window.location.host}'`);

				document.getElementById("button-local").href = `vscode://halcyontechltd.code-for-ibmi/connect?server=${encodeURIComponent(server)}&user=${encodeURIComponent(user)}&pass=${encodeURIComponent(password)}`;

				goOnline();
			}
		};
		xmlHttpReq.open("GET", `http://idevphp.idevcloud.com:12080/api/create?base=junk`, true); // true for asynchronous
		xmlHttpReq.send(null);
	});

	var	on = addEventListener,
		$ = function(q) { return document.querySelector(q) },
		$$ = function(q) { return document.querySelectorAll(q) },
		$body = document.body,
		$inner = $('.inner'),
		client = (function() {
	
			var o = {
					browser: 'other',
					browserVersion: 0,
					os: 'other',
					osVersion: 0,
					mobile: false,
					canUse: null,
					flags: {
						lsdUnits: false,
					},
				},
				ua = navigator.userAgent,
				a, i;
	
			// browser, browserVersion.
				a = [
					['firefox',		/Firefox\/([0-9\.]+)/],
					['edge',		/Edge\/([0-9\.]+)/],
					['safari',		/Version\/([0-9\.]+).+Safari/],
					['chrome',		/Chrome\/([0-9\.]+)/],
					['chrome',		/CriOS\/([0-9\.]+)/],
					['ie',			/Trident\/.+rv:([0-9]+)/]
				];
	
				for (i=0; i < a.length; i++) {
	
					if (ua.match(a[i][1])) {
	
						o.browser = a[i][0];
						o.browserVersion = parseFloat(RegExp.$1);
	
						break;
	
					}
	
				}
	
			// os, osVersion.
				a = [
					['ios',			/([0-9_]+) like Mac OS X/,			function(v) { return v.replace('_', '.').replace('_', ''); }],
					['ios',			/CPU like Mac OS X/,				function(v) { return 0 }],
					['ios',			/iPad; CPU/,						function(v) { return 0 }],
					['android',		/Android ([0-9\.]+)/,				null],
					['mac',			/Macintosh.+Mac OS X ([0-9_]+)/,	function(v) { return v.replace('_', '.').replace('_', ''); }],
					['windows',		/Windows NT ([0-9\.]+)/,			null],
					['undefined',	/Undefined/,						null],
				];
	
				for (i=0; i < a.length; i++) {
	
					if (ua.match(a[i][1])) {
	
						o.os = a[i][0];
						o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
	
						break;
	
					}
	
				}
	
				// Hack: Detect iPads running iPadOS.
					if (o.os == 'mac'
					&&	('ontouchstart' in window)
					&&	(
	
						// 12.9"
							(screen.width == 1024 && screen.height == 1366)
						// 10.2"
							||	(screen.width == 834 && screen.height == 1112)
						// 9.7"
							||	(screen.width == 810 && screen.height == 1080)
						// Legacy
							||	(screen.width == 768 && screen.height == 1024)
	
					))
						o.os = 'ios';
	
			// mobile.
				o.mobile = (o.os == 'android' || o.os == 'ios');
	
			// canUse.
				var _canUse = document.createElement('div');
	
				o.canUse = function(property, value) {
	
					var style;
	
					// Get style.
						style = _canUse.style;
	
					// Property doesn't exist? Can't use it.
						if (!(property in style))
							return false;
	
					// Value provided?
						if (typeof value !== 'undefined') {
	
							// Assign value.
								style[property] = value;
	
							// Value is empty? Can't use it.
								if (style[property] == '')
									return false;
	
						}
	
					return true;
	
				};
	
			// flags.
				o.flags.lsdUnits = o.canUse('width', '100dvw');
	
			return o;
	
		}()),
		trigger = function(t) {
			dispatchEvent(new Event(t));
		},
		cssRules = function(selectorText) {
	
			var ss = document.styleSheets,
				a = [],
				f = function(s) {
	
					var r = s.cssRules,
						i;
	
					for (i=0; i < r.length; i++) {
	
						if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
							(f)(r[i]);
						else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
							a.push(r[i]);
	
					}
	
				},
				x, i;
	
			for (i=0; i < ss.length; i++)
				f(ss[i]);
	
			return a;
	
		},
		thisHash = function() {
	
			var h = location.hash ? location.hash.substring(1) : null,
				a;
	
			// Null? Bail.
				if (!h)
					return null;
	
			// Query string? Move before hash.
				if (h.match(/\?/)) {
	
					// Split from hash.
						a = h.split('?');
						h = a[0];
	
					// Update hash.
						history.replaceState(undefined, undefined, '#' + h);
	
					// Update search.
						window.location.search = a[1];
	
				}
	
			// Prefix with "x" if not a letter.
				if (h.length > 0
				&&	!h.match(/^[a-zA-Z]/))
					h = 'x' + h;
	
			// Convert to lowercase.
				if (typeof h == 'string')
					h = h.toLowerCase();
	
			return h;
	
		},
		scrollToElement = function(e, style, duration) {
	
			var y, cy, dy,
				start, easing, offset, f;
	
			// Element.
	
				// No element? Assume top of page.
					if (!e)
						y = 0;
	
				// Otherwise ...
					else {
	
						offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
	
						switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
	
							case 'default':
							default:
	
								y = e.offsetTop + offset;
	
								break;
	
							case 'center':
	
								if (e.offsetHeight < window.innerHeight)
									y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
								else
									y = e.offsetTop - offset;
	
								break;
	
							case 'previous':
	
								if (e.previousElementSibling)
									y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
								else
									y = e.offsetTop + offset;
	
								break;
	
						}
	
					}
	
			// Style.
				if (!style)
					style = 'smooth';
	
			// Duration.
				if (!duration)
					duration = 750;
	
			// Instant? Just scroll.
				if (style == 'instant') {
	
					window.scrollTo(0, y);
					return;
	
				}
	
			// Get start, current Y.
				start = Date.now();
				cy = window.scrollY;
				dy = y - cy;
	
			// Set easing.
				switch (style) {
	
					case 'linear':
						easing = function (t) { return t };
						break;
	
					case 'smooth':
						easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
						break;
	
				}
	
			// Scroll.
				f = function() {
	
					var t = Date.now() - start;
	
					// Hit duration? Scroll to y and finish.
						if (t >= duration)
							window.scroll(0, y);
	
					// Otherwise ...
						else {
	
							// Scroll.
								window.scroll(0, cy + (dy * easing(t / duration)));
	
							// Repeat.
								requestAnimationFrame(f);
	
						}
	
				};
	
				f();
	
		},
		scrollToTop = function() {
	
			// Scroll to top.
				scrollToElement(null);
	
		},
		loadElements = function(parent) {
	
			var a, e, x, i;
	
			// IFRAMEs.
	
				// Get list of unloaded IFRAMEs.
					a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
	
				// Step through list.
					for (i=0; i < a.length; i++) {
	
						// Load.
							a[i].contentWindow.location.replace(a[i].dataset.src);
	
						// Save initial src.
							a[i].dataset.initialSrc = a[i].dataset.src;
	
						// Mark as loaded.
							a[i].dataset.src = '';
	
					}
	
			// Video.
	
				// Get list of videos (autoplay).
					a = parent.querySelectorAll('video[autoplay]');
	
				// Step through list.
					for (i=0; i < a.length; i++) {
	
						// Play if paused.
							if (a[i].paused)
								a[i].play();
	
					}
	
			// Autofocus.
	
				// Get first element with data-autofocus attribute.
					e = parent.querySelector('[data-autofocus="1"]');
	
				// Determine type.
					x = e ? e.tagName : null;
	
					switch (x) {
	
						case 'FORM':
	
							// Get first input.
								e = e.querySelector('.field input, .field select, .field textarea');
	
							// Found? Focus.
								if (e)
									e.focus();
	
							break;
	
						default:
							break;
	
					}
	
		},
		unloadElements = function(parent) {
	
			var a, e, x, i;
	
			// IFRAMEs.
	
				// Get list of loaded IFRAMEs.
					a = parent.querySelectorAll('iframe[data-src=""]');
	
				// Step through list.
					for (i=0; i < a.length; i++) {
	
						// Don't unload? Skip.
							if (a[i].dataset.srcUnload === '0')
								continue;
	
						// Mark as unloaded.
	
							// IFRAME was previously loaded by loadElements()? Use initialSrc.
								if ('initialSrc' in a[i].dataset)
									a[i].dataset.src = a[i].dataset.initialSrc;
	
							// Otherwise, just use src.
								else
									a[i].dataset.src = a[i].src;
	
						// Unload.
							a[i].contentWindow.location.replace('about:blank');
	
					}
	
			// Video.
	
				// Get list of videos.
					a = parent.querySelectorAll('video');
	
				// Step through list.
					for (i=0; i < a.length; i++) {
	
						// Pause if playing.
							if (!a[i].paused)
								a[i].pause();
	
					}
	
			// Autofocus.
	
				// Get focused element.
					e = $(':focus');
	
				// Found? Blur.
					if (e)
						e.blur();
	
	
		};
	
		// Expose scrollToElement.
			window._scrollToTop = scrollToTop;
	
	// "On Load" animation.
		on('load', function() {
			setTimeout(function() {
				$body.className = $body.className.replace(/\bis-loading\b/, 'is-playing');
	
				setTimeout(function() {
					$body.className = $body.className.replace(/\bis-playing\b/, 'is-ready');
				}, 6250);
			}, 100);
		});
	
	// Sections.
		(function() {
	
			var initialSection, initialScrollPoint, initialId,
				header, footer, name, hideHeader, hideFooter, disableAutoScroll,
				h, e, ee, k,
				locked = false,
				scrollPointParent = function(target) {
	
					var target;
	
					target = event.target;
	
					while (target) {
	
						if (target.parentElement
						&&	target.parentElement.tagName == 'SECTION')
							break;
	
						target = target.parentElement;
	
					}
	
					return target;
	
				},
				doNextScrollPoint = function(event) {
	
					var e, target, id;
	
					// Prevent default.
						event.preventDefault();
						event.stopPropagation();
	
					// Determine parent element.
						e = scrollPointParent(event.target);
	
						if (!e)
							return;
	
					// Find next scroll point.
						while (e && e.nextElementSibling) {
	
							e = e.nextElementSibling;
	
							if (e.dataset.scrollId) {
	
								target = e;
								id = e.dataset.scrollId;
								break;
	
							}
	
						}
	
						if (!target
						||	!id)
							return;
	
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target);
						else
							location.href = '#' + id;
	
				},
				doPreviousScrollPoint = function(e) {
	
					var e, target, id;
	
					// Prevent default.
						event.preventDefault();
						event.stopPropagation();
	
					// Determine parent element.
						e = scrollPointParent(event.target);
	
						if (!e)
							return;
	
					// Find previous scroll point.
						while (e && e.previousElementSibling) {
	
							e = e.previousElementSibling;
	
							if (e.dataset.scrollId) {
	
								target = e;
								id = e.dataset.scrollId;
								break;
	
							}
	
						}
	
						if (!target
						||	!id)
							return;
	
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target);
						else
							location.href = '#' + id;
	
				},
				doFirstScrollPoint = function(e) {
	
					var e, target, id;
	
					// Prevent default.
						event.preventDefault();
						event.stopPropagation();
	
					// Determine parent element.
						e = scrollPointParent(event.target);
	
						if (!e)
							return;
	
					// Find first scroll point.
						while (e && e.previousElementSibling) {
	
							e = e.previousElementSibling;
	
							if (e.dataset.scrollId) {
	
								target = e;
								id = e.dataset.scrollId;
	
							}
	
						}
	
						if (!target
						||	!id)
							return;
	
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target);
						else
							location.href = '#' + id;
	
				},
				doLastScrollPoint = function(e) {
	
					var e, target, id;
	
					// Prevent default.
						event.preventDefault();
						event.stopPropagation();
	
					// Determine parent element.
						e = scrollPointParent(event.target);
	
						if (!e)
							return;
	
					// Find last scroll point.
						while (e && e.nextElementSibling) {
	
							e = e.nextElementSibling;
	
							if (e.dataset.scrollId) {
	
								target = e;
								id = e.dataset.scrollId;
	
							}
	
						}
	
						if (!target
						||	!id)
							return;
	
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target);
						else
							location.href = '#' + id;
	
				},
				doNextSection = function() {
	
					var section;
	
					section = $('#main > .inner > section.active').nextElementSibling;
	
					if (!section || section.tagName != 'SECTION')
						return;
	
					location.href = '#' + section.id.replace(/-section$/, '');
	
				},
				doPreviousSection = function() {
	
					var section;
	
					section = $('#main > .inner > section.active').previousElementSibling;
	
					if (!section || section.tagName != 'SECTION')
						return;
	
					location.href = '#' + (section.matches(':first-child') ? '' : section.id.replace(/-section$/, ''));
	
				},
				doFirstSection = function() {
	
					var section;
	
					section = $('#main > .inner > section:first-of-type');
	
					if (!section || section.tagName != 'SECTION')
						return;
	
					location.href = '#' + section.id.replace(/-section$/, '');
	
				},
				doLastSection = function() {
	
					var section;
	
					section = $('#main > .inner > section:last-of-type');
	
					if (!section || section.tagName != 'SECTION')
						return;
	
					location.href = '#' + section.id.replace(/-section$/, '');
	
				},
				sections = {};
	
	
			// Expose doNextScrollPoint, doPreviousScrollPoint, doFirstScrollPoint, doLastScrollPoint.
				window._nextScrollPoint = doNextScrollPoint;
				window._previousScrollPoint = doPreviousScrollPoint;
				window._firstScrollPoint = doFirstScrollPoint;
				window._lastScrollPoint = doLastScrollPoint;
	
			// Expose doNextSection, doPreviousSection, doFirstSection, doLastSection.
				window._nextSection = doNextSection;
				window._previousSection = doPreviousSection;
				window._firstSection = doFirstSection;
				window._lastSection = doLastSection;
	
			// Override exposed scrollToTop.
				window._scrollToTop = function() {
	
					var section, id;
	
					// Scroll to top.
						scrollToElement(null);
	
					// Section active?
						if (!!(section = $('section.active'))) {
	
							// Get name.
								id = section.id.replace(/-section$/, '');
	
								// Index section? Clear.
									if (id == 'home')
										id = '';
	
							// Reset hash to section name (via new state).
								history.pushState(null, null, '#' + id);
	
						}
	
				};
	
			// Initialize.
	
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
	
				// Header, footer.
					header = $('#header');
					footer = $('#footer');
	
				// Show initial section.
	
					// Determine target.
						h = thisHash();
	
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								h = null;
	
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
	
								initialScrollPoint = e;
								initialSection = initialScrollPoint.parentElement;
								initialId = initialSection.id;
	
							}
	
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
	
								initialScrollPoint = null;
								initialSection = e;
								initialId = initialSection.id;
	
							}
	
						// Missing initial section?
							if (!initialSection) {
	
								// Default to index.
									initialScrollPoint = null;
									initialSection = $('#' + 'home' + '-section');
									initialId = initialSection.id;
	
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
	
							}
	
					// Get options.
						name = (h ? h : 'home');
						hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
						hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
						disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
	
					// Deactivate all sections (except initial).
	
						// Initially hide header and/or footer (if necessary).
	
							// Header.
								if (header && hideHeader) {
	
									header.classList.add('hidden');
									header.style.display = 'none';
	
								}
	
							// Footer.
								if (footer && hideFooter) {
	
									footer.classList.add('hidden');
									footer.style.display = 'none';
	
								}
	
						// Deactivate.
							ee = $$('#main > .inner > section:not([id="' + initialId + '"])');
	
							for (k = 0; k < ee.length; k++) {
	
								ee[k].className = 'inactive';
								ee[k].style.display = 'none';
	
							}
	
					// Activate initial section.
						initialSection.classList.add('active');
	
					// Load elements.
						loadElements(initialSection);
	
						if (header)
							loadElements(header);
	
						if (footer)
							loadElements(footer);
	
					// Scroll to top (if not disabled for this section).
						if (!disableAutoScroll)
							scrollToElement(null, 'instant');
	
				// Load event.
					on('load', function() {
	
						// Scroll to initial scroll point (if applicable).
					 		if (initialScrollPoint)
								scrollToElement(initialScrollPoint, 'instant');
	
					});
	
			// Hashchange event.
				on('hashchange', function(event) {
	
					var section, scrollPoint, id, sectionHeight, currentSection, currentSectionHeight,
						name, hideHeader, hideFooter, disableAutoScroll,
						h, e, ee, k;
	
					// Lock.
						if (locked)
							return false;
	
					// Determine target.
						h = thisHash();
	
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
	
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
	
								scrollPoint = e;
								section = scrollPoint.parentElement;
								id = section.id;
	
							}
	
						// Section.
							else if (e = $('#' + (h ? h : 'home') + '-section')) {
	
								scrollPoint = null;
								section = e;
								id = section.id;
	
							}
	
						// Anything else.
							else {
	
								// Default to index.
									scrollPoint = null;
									section = $('#' + 'home' + '-section');
									id = section.id;
	
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
	
							}
	
					// No section? Bail.
						if (!section)
							return false;
	
					// Section already active?
						if (!section.classList.contains('inactive')) {
	
							// Get options.
								name = (section ? section.id.replace(/-section$/, '') : null);
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
	
						 	// Scroll to scroll point (if applicable).
						 		if (scrollPoint)
									scrollToElement(scrollPoint);
	
							// Otherwise, just scroll to top (if not disabled for this section).
								else if (!disableAutoScroll)
									scrollToElement(null);
	
							// Bail.
								return false;
	
						}
	
					// Otherwise, activate it.
						else {
	
							// Lock.
								locked = true;
	
							// Clear index URL hash.
								if (location.hash == '#home')
									history.replaceState(null, null, '#');
	
							// Get options.
								name = (section ? section.id.replace(/-section$/, '') : null);
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
	
							// Deactivate current section.
								currentSection = $('section:not(.inactive)');
	
								if (currentSection) {
	
									// Deactivate.
										currentSection.classList.add('inactive');
	
									// Unload elements.
										unloadElements(currentSection);
	
									// Hide.
										setTimeout(function() {
											currentSection.style.display = 'none';
											currentSection.classList.remove('active');
										}, 125);
	
								}
	
							// Activate target section.
								setTimeout(function() {
	
									// Show.
										section.style.display = '';
	
									// Trigger 'resize' event.
										trigger('resize');
	
									// Scroll to top (if not disabled for this section).
										if (!disableAutoScroll)
											scrollToElement(null, 'instant');
	
									// Delay.
										setTimeout(function() {
	
											// Activate.
												section.classList.remove('inactive');
												section.classList.add('active');
	
											// Delay.
												setTimeout(function() {
	
													// Load elements.
														loadElements(section);
	
												 	// Scroll to scroll point (if applicable).
												 		if (scrollPoint)
															scrollToElement(scrollPoint, 'instant');
	
													// Unlock.
														locked = false;
	
												}, 250);
	
										}, 75);
	
								}, 125);
	
						}
	
					return false;
	
				});
	
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
	
						var t = event.target,
							tagName = t.tagName.toUpperCase(),
							scrollPoint;
	
						// Find real target.
							switch (tagName) {
	
								case 'IMG':
								case 'SVG':
								case 'USE':
								case 'U':
								case 'STRONG':
								case 'EM':
								case 'CODE':
								case 'S':
								case 'MARK':
								case 'SPAN':
	
									// Find ancestor anchor tag.
										while ( !!(t = t.parentElement) )
											if (t.tagName == 'A')
												break;
	
									// Not found? Bail.
										if (!t)
											return;
	
									break;
	
								default:
									break;
	
							}
	
						// Target is an anchor *and* its href is a hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href').substr(0, 1) == '#') {
	
								// Hash matches an invisible scroll point?
									if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) + '"][data-scroll-invisible="1"]'))) {
	
										// Prevent default.
											event.preventDefault();
	
										// Scroll to element.
											scrollToElement(scrollPoint);
	
									}
	
								// Hash matches the current hash?
									else if (t.hash == window.location.hash) {
	
										// Prevent default.
											event.preventDefault();
	
										// Replace state with '#'.
											history.replaceState(undefined, undefined, '#');
	
										// Replace location with target hash.
											location.replace(t.hash);
	
									}
	
							}
	
					});
	
		})();
	
	// Browser hacks.
	
		// Init.
			var style, sheet, rule;
	
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
	
			// Get sheet.
				sheet = style.sheet;
	
		// Mobile.
			if (client.mobile) {
	
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
	
						// Lsd units available?
							if (client.flags.lsdUnits) {
	
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100dvh');
	
							}
	
						// Otherwise, use innerHeight hack.
							else {
	
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
	
								on('load', f);
								on('orientationchange', function() {
	
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
	
								});
	
							}
	
					})();
	
			}
	
		// Android.
			if (client.os == 'android') {
	
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
	
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
	
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
	
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
	
					})();
	
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
	
			}
	
		// iOS.
			else if (client.os == 'ios') {
	
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
	
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
	
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
	
						})();
	
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
	
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
	
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
	
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
	
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
	
						})();
	
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
	
			}
	
		var scrollEvents = {
	
			/**
			 * Items.
			 * @var {array}
			 */
			items: [],
	
			/**
			 * Adds an event.
			 * @param {object} o Options.
			 */
			add: function(o) {
	
				this.items.push({
					element: o.element,
					triggerElement: (('triggerElement' in o && o.triggerElement) ? o.triggerElement : o.element),
					enter: ('enter' in o ? o.enter : null),
					leave: ('leave' in o ? o.leave : null),
					mode: ('mode' in o ? o.mode : 3),
					offset: ('offset' in o ? o.offset : 0),
					initialState: ('initialState' in o ? o.initialState : null),
					state: false,
				});
	
			},
	
			/**
			 * Handler.
			 */
			handler: function() {
	
				var	height, top, bottom, scrollPad;
	
				// Determine values.
					if (client.os == 'ios') {
	
						height = document.documentElement.clientHeight;
						top = document.body.scrollTop + window.scrollY;
						bottom = top + height;
						scrollPad = 125;
	
					}
					else {
	
						height = document.documentElement.clientHeight;
						top = document.documentElement.scrollTop;
						bottom = top + height;
						scrollPad = 0;
	
					}
	
				// Step through items.
					scrollEvents.items.forEach(function(item) {
	
						var bcr, elementTop, elementBottom, state, a, b;
	
						// No enter/leave handlers? Bail.
							if (!item.enter
							&&	!item.leave)
								return true;
	
						// No trigger element, or not visible? Bail.
							if (!item.triggerElement
							||	item.triggerElement.offsetParent === null)
								return true;
	
						// Get element position.
							bcr = item.triggerElement.getBoundingClientRect();
							elementTop = top + Math.floor(bcr.top);
							elementBottom = elementTop + bcr.height;
	
						// Determine state.
	
							// Initial state exists?
								if (item.initialState !== null) {
	
									// Use it for this check.
										state = item.initialState;
	
									// Clear it.
										item.initialState = null;
	
								}
	
							// Otherwise, determine state from mode/position.
								else {
	
									switch (item.mode) {
	
										// Element falls within viewport.
											case 1:
											default:
	
												// State.
													state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));
	
												break;
	
										// Viewport midpoint falls within element.
											case 2:
	
												// Midpoint.
													a = (top + (height * 0.5));
	
												// State.
													state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));
	
												break;
	
										// Viewport midsection falls within element.
											case 3:
	
												// Upper limit (25%-).
													a = top + (height * 0.25);
	
													if (a - (height * 0.375) <= 0)
														a = 0;
	
												// Lower limit (-75%).
													b = top + (height * 0.75);
	
													if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad)
														b = document.body.scrollHeight + scrollPad;
	
												// State.
													state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));
	
												break;
	
									}
	
								}
	
						// State changed?
							if (state != item.state) {
	
								// Update state.
									item.state = state;
	
								// Call handler.
									if (item.state) {
	
										// Enter handler exists?
											if (item.enter) {
	
												// Call it.
													(item.enter).apply(item.element);
	
												// No leave handler? Unbind enter handler (so we don't check this element again).
													if (!item.leave)
														item.enter = null;
	
											}
	
									}
									else {
	
										// Leave handler exists?
											if (item.leave) {
	
												// Call it.
													(item.leave).apply(item.element);
	
												// No enter handler? Unbind leave handler (so we don't check this element again).
													if (!item.enter)
														item.leave = null;
	
											}
	
									}
	
							}
	
					});
	
			},
	
			/**
			 * Initializes scroll events.
			 */
			init: function() {
	
				// Bind handler to events.
					on('load', this.handler);
					on('resize', this.handler);
					on('scroll', this.handler);
	
				// Do initial handler call.
					(this.handler)();
	
			}
		};
	
		// Initialize.
			scrollEvents.init();
	
	// Deferred.
		(function() {
	
			var items = $$('.deferred'),
				loadHandler, enterHandler;
	
			// Handlers.
	
				/**
				 * "On Load" handler.
				 */
				loadHandler = function() {
	
					var i = this,
						p = this.parentElement;
	
					// Not "done" yet? Bail.
						if (i.dataset.src !== 'done')
							return;
	
					// Show image.
						if (Date.now() - i._startLoad < 375) {
	
							p.classList.remove('loading');
							p.style.backgroundImage = 'none';
							i.style.transition = '';
							i.style.opacity = 1;
	
						}
						else {
	
							p.classList.remove('loading');
							i.style.opacity = 1;
	
							setTimeout(function() {
								i.style.backgroundImage = 'none';
								i.style.transition = '';
							}, 375);
	
						}
	
				};
	
				/**
				 * "On Enter" handler.
				 */
				enterHandler = function() {
	
					var	i = this,
						p = this.parentElement,
						src;
	
					// Get src, mark as "done".
						src = i.dataset.src;
						i.dataset.src = 'done';
	
					// Mark parent as loading.
						p.classList.add('loading');
	
					// Swap placeholder for real image src.
						i._startLoad = Date.now();
						i.src = src;
	
				};
	
			// Initialize items.
				items.forEach(function(p) {
	
					var i = p.firstElementChild;
	
					// Set parent to placeholder.
						if (!p.classList.contains('enclosed')) {
	
							p.style.backgroundImage = 'url(' + i.src + ')';
							p.style.backgroundSize = '100% 100%';
							p.style.backgroundPosition = 'top left';
							p.style.backgroundRepeat = 'no-repeat';
	
						}
	
					// Hide image.
						i.style.opacity = 0;
						i.style.transition = 'opacity 0.375s ease-in-out';
	
					// Load event.
						i.addEventListener('load', loadHandler);
	
					// Add to scroll events.
						scrollEvents.add({
							element: i,
							enter: enterHandler,
							offset: 250,
						});
	
				});
	
		})();
	
	// Buttons: buttons02.
		$('#buttons02 > li:nth-child(1) > a').addEventListener(
			'click',
			function(event) { 
				console.log('boxA')
			}
		);
	
	// Buttons: buttons01.
		$('#buttons01 > li:nth-child(1) > a').addEventListener(
			'click',
			function(event) { 
				console.log('boxB')
			}
		);

})();