<script lang="ts">
	import { pushState } from '$app/navigation';
	import glazelily from '$lib/assets/glazelily.png';
	import sunIcon from '$lib/assets/sun.svg';
	import moonIcon from '$lib/assets/moon.svg';
	import RoughTextFilter from '$lib/components/atoms/RoughTextFilter.svelte';
	import { onMount } from 'svelte';

	const navItems = [
		{ label: 'Home', href: '#home', icon: 'home' },
		{ label: 'About', href: '#about', icon: 'about' },
		{ label: 'Writing', href: '#posts', icon: 'folder' },
		{ label: 'Projects', href: '#projects', icon: 'projects' }
	] as const;

	let activeHref = $state('#home');
	let isGanyuTheme = $state(false);
	let isDarkMode = $state(false);
	let isThemeTransitioning = $state(false);
	let navigationScrollX = 0;
	let navigationScrollY = 0;

	function applyTheme(enabled: boolean) {
		isGanyuTheme = enabled;
		document.documentElement.classList.toggle('ganyu-theme', enabled);
		localStorage.setItem('portfolio-theme', enabled ? 'ganyu' : 'default');
	}

	function applyDarkMode(enabled: boolean) {
		isDarkMode = enabled;
		document.documentElement.classList.toggle('dark', enabled);
		localStorage.setItem('portfolio-dark-mode', enabled ? 'true' : 'false');
	}

	async function runFallbackTransition(enabled: boolean) {
		const overlay = document.createElement('span');
		overlay.className = `theme-transition-overlay ${enabled ? 'to-ganyu' : 'to-default'}`;
		overlay.setAttribute('aria-hidden', 'true');
		document.body.append(overlay);

		await overlay.animate(
			[
				{ clipPath: 'circle(0 at var(--theme-origin-x) var(--theme-origin-y))' },
				{ clipPath: 'circle(150vmax at var(--theme-origin-x) var(--theme-origin-y))' }
			],
			{ duration: 680, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
		).finished;

		applyTheme(enabled);

		await overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180 }).finished;
		overlay.remove();
	}

	async function toggleTheme(event: MouseEvent) {
		if (isThemeTransitioning) return;

		const button = event.currentTarget as HTMLButtonElement;
		const bounds = button.getBoundingClientRect();
		const root = document.documentElement;
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const nextTheme = !isGanyuTheme;
		const documentWithTransitions = document as Document & {
			startViewTransition?: (update: () => void) => { finished: Promise<void> };
		};

		// Use clientX/Y and account for CSS zoom on the document element
		const currentZoom = parseFloat(getComputedStyle(root).zoom || '1');
		const originX = (event.clientX || (bounds.left + bounds.width / 2)) / currentZoom;
		const originY = (event.clientY || (bounds.top + bounds.height / 2)) / currentZoom;
		root.style.setProperty('--theme-origin-x', `${originX}px`);
		root.style.setProperty('--theme-origin-y', `${originY}px`);

		if (prefersReducedMotion) {
			applyTheme(nextTheme);
			return;
		}

		isThemeTransitioning = true;
		root.classList.add('theme-transitioning');
		const transitionClass = nextTheme ? 'transitioning-to-ganyu' : 'transitioning-to-default';
		root.classList.add(transitionClass);

		try {
			if (documentWithTransitions.startViewTransition) {
				const transition = documentWithTransitions.startViewTransition(() => {
					applyTheme(nextTheme);
				});

				await transition.finished;
			} else {
				await runFallbackTransition(nextTheme);
			}
		} finally {
			isThemeTransitioning = false;
			root.classList.remove('theme-transitioning');
			root.classList.remove(transitionClass);
		}
	}

	async function toggleDarkMode(event: MouseEvent) {
		if (isThemeTransitioning) return;

		const button = event.currentTarget as HTMLButtonElement;
		const bounds = button.getBoundingClientRect();
		const root = document.documentElement;
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const nextTheme = !isDarkMode;
		const documentWithTransitions = document as Document & {
			startViewTransition?: (update: () => void) => { finished: Promise<void> };
		};

		// Use clientX/Y and account for CSS zoom on the document element
		const currentZoom = parseFloat(getComputedStyle(root).zoom || '1');
		const originX = (event.clientX || (bounds.left + bounds.width / 2)) / currentZoom;
		const originY = (event.clientY || (bounds.top + bounds.height / 2)) / currentZoom;
		root.style.setProperty('--theme-origin-x', `${originX}px`);
		root.style.setProperty('--theme-origin-y', `${originY}px`);

		if (prefersReducedMotion) {
			applyDarkMode(nextTheme);
			return;
		}

		isThemeTransitioning = true;
		root.classList.add('theme-transitioning');
		const transitionClass = nextTheme ? 'transitioning-to-dark' : 'transitioning-to-light';
		root.classList.add(transitionClass);

		try {
			if (documentWithTransitions.startViewTransition) {
				const transition = documentWithTransitions.startViewTransition(() => {
					applyDarkMode(nextTheme);
				});

				await transition.finished;
			} else {
				// Fallback
				const overlay = document.createElement('span');
				overlay.className = `theme-transition-overlay ${nextTheme ? 'to-dark' : 'to-light'}`;
				overlay.setAttribute('aria-hidden', 'true');
				// Give overlay simple colors for fallback
				overlay.style.backgroundColor = nextTheme ? '#1a1a1a' : '#fcf7ef';
				document.body.append(overlay);

				await overlay.animate(
					[
						{ clipPath: 'circle(0 at var(--theme-origin-x) var(--theme-origin-y))' },
						{ clipPath: 'circle(150vmax at var(--theme-origin-x) var(--theme-origin-y))' }
					],
					{ duration: 680, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
				).finished;

				applyDarkMode(nextTheme);

				await overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180 }).finished;
				overlay.remove();
			}
		} finally {
			isThemeTransitioning = false;
			root.classList.remove('theme-transitioning');
			root.classList.remove(transitionClass);
		}
	}

	function syncActiveHref() {
		const hash = window.location.hash;

		if (navItems.some((item) => item.href === hash)) {
			activeHref = hash;
		}
	}

	function rememberNavigationScroll() {
		navigationScrollX = window.scrollX;
		navigationScrollY = window.scrollY;
	}

	function restoreNavigationScroll() {
		const root = document.documentElement;
		const previousScrollBehavior = root.style.scrollBehavior;

		root.style.scrollBehavior = 'auto';
		window.scrollTo(navigationScrollX, navigationScrollY);

		requestAnimationFrame(() => {
			window.scrollTo(navigationScrollX, navigationScrollY);
			root.style.scrollBehavior = previousScrollBehavior;
		});
	}

	function navigateShowcase(href: '#about' | '#posts' | '#projects', keyboardNavigation: boolean) {
		const shouldScrollToShowcase = activeHref === '#home';

		if (keyboardNavigation) rememberNavigationScroll();

		const oldURL = window.location.href;

		if (window.location.hash !== href) {
			pushState(href, {});
		}

		activeHref = href;
		window.dispatchEvent(
			new HashChangeEvent('hashchange', {
				oldURL,
				newURL: window.location.href
			})
		);

		if (shouldScrollToShowcase) {
			setTimeout(() => {
				document.querySelector('.showcase-viewport')?.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}, 50);
		} else {
			restoreNavigationScroll();
		}
	}

	onMount(() => {
		syncActiveHref();
		applyTheme(localStorage.getItem('portfolio-theme') === 'ganyu');
		
		const storedDarkMode = localStorage.getItem('portfolio-dark-mode');
		const isDark = storedDarkMode === 'true' || (storedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
		applyDarkMode(isDark);

		// Scroll-based section detection
		const sectionIds = ['home', 'about', 'posts', 'projects'];
		const visibilityMap = new Map<string, number>();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					visibilityMap.set(entry.target.id, entry.intersectionRatio);
				}

				// Find the section with the highest visibility
				let bestId = '';
				let bestRatio = 0;
				for (const [id, ratio] of visibilityMap) {
					if (ratio > bestRatio) {
						bestRatio = ratio;
						bestId = id;
					}
				}

				if (bestId && bestRatio > 0) {
					activeHref = `#${bestId}`;
				}
			},
			{
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
				rootMargin: '-64px 0px 0px 0px' // offset for sticky nav height
			}
		);

		for (const id of sectionIds) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	});
</script>

<svelte:window onhashchange={syncActiveHref} />

<header class="site-header">
	<div class="brand">
		<button
			type="button"
			class="theme-toggle"
			class:active={isGanyuTheme}
			disabled={isThemeTransitioning}
			aria-label={isGanyuTheme ? 'Use default theme' : 'Use Ganyu theme'}
			aria-pressed={isGanyuTheme}
			title={isGanyuTheme ? 'Back to default theme' : 'Switch to Ganyu theme'}
			onclick={toggleTheme}
		>
			<img src={glazelily} class="ganyu-icon-only" alt="Glaze Lily" aria-hidden="true" />
			<span class="default-icon-only brand-at">@</span>
		</button>
		<a class="brand-name" href="#home" aria-label="chiraitori.dev home">chiraitori.dev</a>
	</div>

	<nav aria-label="Primary navigation">
		{#each navItems as item (item.href)}
			<button
				type="button"
				class:active={activeHref === item.href}
				aria-current={activeHref === item.href ? 'page' : undefined}
				onpointerdown={item.href === '#home' ? undefined : rememberNavigationScroll}
				onmousedown={item.href === '#home' ? undefined : (event) => event.preventDefault()}
				onclick={(event) => {
					if (item.href === '#home') {
						activeHref = '#home';
						pushState('#home', {});
						document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
					} else {
						navigateShowcase(item.href, event.detail === 0);
					}
				}}
			>
				{#if item.icon === 'home'}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<!-- Roof Left & Right sketch -->
						<path d="M3 11.5 C 5.8 9, 9.2 6.2, 12 3.8" />
						<path d="M12 3.8 C 14.8 6.2, 18.2 9, 21 11.5" />
						<!-- Left & Right walls sketch -->
						<path d="M5.8 10.2 C 5.5 13.2, 5.9 16.5, 5.8 19.3" />
						<path d="M18.2 10.2 C 18.5 13.2, 18.1 16.5, 18.2 19.3" />
						<!-- Floor sketch -->
						<path d="M5.5 19.3 C 9.5 19.5, 14.5 19.1, 18.5 19.3" />
						<!-- Door Left, Top & Right sketch -->
						<path d="M9.5 19.3 C 9.3 17.5, 9.6 15.5, 9.5 13.5" />
						<path d="M9.5 13.5 C 11.2 13.3, 12.8 13.7, 14.5 13.5" />
						<path d="M14.5 13.5 C 14.3 15.5, 14.6 17.5, 14.5 19.3" />
					</svg>
				{:else if item.icon === 'folder'}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<!-- Folder Tab sketch -->
						<path d="M3.5 6.5 C 5.5 6.3, 7.8 6.4, 9.5 6.3" />
						<path d="M9.5 6.3 C 10.1 7.1, 10.7 7.9, 11.3 8.5" />
						<!-- Folder Body sketch -->
						<path d="M11.3 8.5 C 14.2 8.3, 17.5 8.6, 20.5 8.5" />
						<path d="M20.5 8.5 C 20.3 11.8, 20.7 15.2, 20.5 18.5" />
						<path d="M20.5 18.5 C 16.5 18.7, 11.5 18.3, 3.5 18.5" />
						<path d="M3.5 18.5 C 3.7 15.2, 3.3 11.8, 3.5 6.5" />
						<!-- Inner document lines sketch -->
						<path d="M6.5 12 C 10 11.8, 14 12.2, 17.5 12" />
						<path d="M6.5 15 C 10 14.8, 14 15.2, 17.5 15" />
					</svg>
				{:else if item.icon === 'about'}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<!-- Person Head sketch -->
						<path d="M12 4.5 C 14.5 4.3, 16.5 6.3, 16.5 8.5 C 16.3 11.5, 14.5 12.7, 12 12.5 C 9.5 12.7, 7.7 11.5, 7.5 8.5 C 7.5 6.3, 9.5 4.3, 12 4.5" />
						<!-- Person Body sketch -->
						<path d="M6.5 19.5 C 6.3 17.5, 7.5 15.3, 12 15.5 C 16.5 15.3, 17.7 17.5, 17.5 19.5" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<!-- Briefcase Handle sketch -->
						<path
							d="M8.2 6.8 C 8.1 5.3, 8.3 4.3, 8.5 4.3 C 10.5 4.1, 13.5 4.5, 15.5 4.3 C 15.7 4.3, 15.9 5.3, 15.8 6.8"
						/>
						<!-- Briefcase Box Outer Outline sketch -->
						<path d="M5 6.8 C 9 6.6, 15 7.0, 19 6.8" />
						<path d="M19 6.8 C 18.8 10.8, 19.2 15.8, 19 19.8" />
						<path d="M19 19.8 C 15 19.6, 9 20.0, 5 19.8" />
						<path d="M5 19.8 C 5.2 15.8, 4.8 10.8, 5 6.8" />
						<!-- Center Divider curve sketch -->
						<path d="M5 11.5 C 9.2 12.7, 14.8 12.7, 19 11.5" />
						<!-- Lock Center sketch -->
						<path d="M10.5 13.8 C 11.5 13.5, 12.5 13.5, 13.5 13.8" />
						<path d="M13.5 13.8 C 13.3 14.8, 13.7 15.8, 13.5 16.3" />
						<path d="M13.5 16.3 C 12.5 16.5, 11.5 16.5, 10.5 16.3" />
						<path d="M10.5 16.3 C 10.7 15.8, 10.3 14.8, 10.5 13.8" />
					</svg>
				{/if}
				<span>{item.label}</span>
			</button>
		{/each}
	</nav>

	<div class="actions">
		<button
			type="button"
			class="theme-toggle"
			class:active={isDarkMode}
			disabled={isThemeTransitioning}
			aria-label={isDarkMode ? 'Use light mode' : 'Use dark mode'}
			aria-pressed={isDarkMode}
			title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
			onclick={toggleDarkMode}
		>
			<img src={sunIcon} class="dark-icon-only" alt="Sun" aria-hidden="true" />
			<img src={moonIcon} class="light-icon-only" alt="Moon" aria-hidden="true" />
		</button>
	</div>
	<RoughTextFilter />
</header>

<nav class="mobile-bottom-nav" aria-label="Mobile navigation">
	{#each navItems as item (item.href)}
		<button
			type="button"
			class:active={activeHref === item.href}
			aria-current={activeHref === item.href ? 'page' : undefined}
			onpointerdown={item.href === '#home' ? undefined : rememberNavigationScroll}
			onmousedown={item.href === '#home' ? undefined : (event) => event.preventDefault()}
			onclick={(event) => {
				if (item.href === '#home') {
					activeHref = '#home';
					pushState('#home', {});
					document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
				} else {
					navigateShowcase(item.href, event.detail === 0);
				}
			}}
		>
			{#if item.icon === 'home'}
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M3 11.5 C 5.8 9, 9.2 6.2, 12 3.8" />
					<path d="M12 3.8 C 14.8 6.2, 18.2 9, 21 11.5" />
					<path d="M5.8 10.2 C 5.5 13.2, 5.9 16.5, 5.8 19.3" />
					<path d="M18.2 10.2 C 18.5 13.2, 18.1 16.5, 18.2 19.3" />
					<path d="M5.5 19.3 C 9.5 19.5, 14.5 19.1, 18.5 19.3" />
					<path d="M9.5 19.3 C 9.3 17.5, 9.6 15.5, 9.5 13.5" />
					<path d="M9.5 13.5 C 11.2 13.3, 12.8 13.7, 14.5 13.5" />
					<path d="M14.5 13.5 C 14.3 15.5, 14.6 17.5, 14.5 19.3" />
				</svg>
			{:else if item.icon === 'folder'}
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M3.5 6.5 C 5.5 6.3, 7.8 6.4, 9.5 6.3" />
					<path d="M9.5 6.3 C 10.1 7.1, 10.7 7.9, 11.3 8.5" />
					<path d="M11.3 8.5 C 14.2 8.3, 17.5 8.6, 20.5 8.5" />
					<path d="M20.5 8.5 C 20.3 11.8, 20.7 15.2, 20.5 18.5" />
					<path d="M20.5 18.5 C 16.5 18.7, 11.5 18.3, 3.5 18.5" />
					<path d="M3.5 18.5 C 3.7 15.2, 3.3 11.8, 3.5 6.5" />
					<path d="M6.5 12 C 10 11.8, 14 12.2, 17.5 12" />
					<path d="M6.5 15 C 10 14.8, 14 15.2, 17.5 15" />
				</svg>
			{:else if item.icon === 'about'}
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 4.5 C 14.5 4.3, 16.5 6.3, 16.5 8.5 C 16.3 11.5, 14.5 12.7, 12 12.5 C 9.5 12.7, 7.7 11.5, 7.5 8.5 C 7.5 6.3, 9.5 4.3, 12 4.5" />
					<path d="M6.5 19.5 C 6.3 17.5, 7.5 15.3, 12 15.5 C 16.5 15.3, 17.7 17.5, 17.5 19.5" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M8.2 6.8 C 8.1 5.3, 8.3 4.3, 8.5 4.3 C 10.5 4.1, 13.5 4.5, 15.5 4.3 C 15.7 4.3, 15.9 5.3, 15.8 6.8"
					/>
					<path d="M5 6.8 C 9 6.6, 15 7.0, 19 6.8" />
					<path d="M19 6.8 C 18.8 10.8, 19.2 15.8, 19 19.8" />
					<path d="M19 19.8 C 15 19.6, 9 20.0, 5 19.8" />
					<path d="M5 19.8 C 5.2 15.8, 4.8 10.8, 5 6.8" />
					<path d="M5 11.5 C 9.2 12.7, 14.8 12.7, 19 11.5" />
					<path d="M10.5 13.8 C 11.5 13.5, 12.5 13.5, 13.5 13.8" />
					<path d="M13.5 13.8 C 13.3 14.8, 13.7 15.8, 13.5 16.3" />
					<path d="M13.5 16.3 C 12.5 16.5, 11.5 16.5, 10.5 16.3" />
					<path d="M10.5 16.3 C 10.7 15.8, 10.3 14.8, 10.5 13.8" />
				</svg>
			{/if}
			<span class="mobile-label">{item.label}</span>
		</button>
	{/each}
</nav>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 20;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		min-height: 64px;
		padding: 0 28px;
		background: rgba(252, 247, 239, 0.94);
		backdrop-filter: blur(12px);
	}

	.brand {
		display: inline-flex;
		width: fit-content;
		align-items: center;
		gap: 5px;
		color: #302b30;
		font-family: var(--font-nav);
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.025em;
		text-decoration: none;
	}

	.brand-name {
		color: inherit;
		text-decoration: none;
	}

	.actions {
		grid-column: 3;
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.theme-toggle {
		display: inline-grid;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		place-items: center;
		transform: rotate(-8deg);
		transition:
			filter 200ms ease,
			transform 200ms ease;
	}

	.theme-toggle img {
		width: 39px;
		height: 39px;
		object-fit: contain;
		transition: transform 200ms ease;
	}

	.brand-at {
		font-family: var(--font-hero), var(--font-sans), sans-serif;
		font-size: 34px;
		font-weight: 700;
		line-height: 1;
		color: currentColor;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.theme-toggle:hover {
		filter: drop-shadow(0 4px 5px rgba(117, 157, 202, 0.32));
		transform: rotate(5deg) scale(1.08);
	}

	.theme-toggle.active {
		filter: drop-shadow(0 0 8px rgba(105, 153, 211, 0.72));
		transform: rotate(7deg) scale(1.05);
	}

	.theme-toggle:active img {
		transform: scale(0.88);
	}

	.theme-toggle:disabled {
		cursor: wait;
	}

	.theme-toggle:focus-visible {
		border-radius: 6px;
		outline: 2px solid #759dca;
		outline-offset: 4px;
	}

	nav {
		grid-column: 2;
		display: flex;
		align-items: center;
		align-self: stretch;
		gap: clamp(32px, 4.4vw, 60px);
	}

	nav button {
		position: relative;
		display: inline-flex;
		min-width: 88px;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		gap: 8px;
		color: #39333a;
		font-family: var(--font-nav);
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0.01em;
		line-height: 1;
		text-decoration: none;
		transition: color 180ms ease;
	}

	nav button::before {
		position: absolute;
		content: '';
		inset: -8px -20px;
		background: radial-gradient(ellipse at center, rgba(229, 166, 181, 0.3) 0%, transparent 70%);
		z-index: -1;
		opacity: 0;
		border-radius: 999px;
		transition: opacity 200ms ease;
		pointer-events: none;
	}

	nav button::after {
		position: absolute;
		right: 4px;
		bottom: -6px; /* Moved down to separate from text */
		left: 4px;
		height: 5px; /* Slightly thinner */
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M1,5 C20,3 40,6 60,4 C75,3 90,5 99,4 C80,6 60,7 40,6 C20,5 5,8 1,5 Z' fill='%23e6aeb9'/%3E%3C/svg%3E");
		background-size: 100% 100%;
		background-repeat: no-repeat;
		content: '';
		opacity: 0;
		transform: scaleX(0.65) rotate(-1deg);
		transform-origin: center;
		transition:
			opacity 180ms ease,
			transform 180ms ease;
	}

	nav button:hover {
		color: #17141a;
	}

	nav button:hover::before,
	nav button.active::before {
		opacity: 1;
	}

	nav button:hover::after,
	nav button.active::after {
		opacity: 1;
		transform: scaleX(1) rotate(-1deg);
	}

	nav button.active {
		text-shadow: 0 0 12px rgba(229, 166, 181, 0.4);
	}

	nav svg {
		width: 21px;
		height: 21px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.7;
		filter: url(#rough);
	}

	a:focus-visible {
		border-radius: 6px;
		outline: 2px solid #c9788a;
		outline-offset: 4px;
	}

	nav button:focus-visible {
		border-radius: 6px;
		outline: 2px solid #c9788a;
		outline-offset: 4px;
	}

	.mobile-bottom-nav {
		display: none;
	}

	@media (max-width: 680px) {
		.site-header {
			grid-template-columns: auto 1fr;
			padding: 0 14px;
		}

		nav {
			display: none;
		}

		.actions {
			grid-column: 2;
			justify-self: end;
			position: static;
		}

		.mobile-bottom-nav {
			position: fixed;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			z-index: 40;
			display: flex;
			align-items: center;
			gap: 4px;
			background: rgba(252, 247, 239, 0.85);
			backdrop-filter: blur(16px);
			-webkit-backdrop-filter: blur(16px);
			border: 2px solid #302b30;
			border-radius: 999px;
			padding: 6px 12px;
			box-shadow: 0 8px 30px rgba(48, 43, 48, 0.12);
			transition: background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
		}

		:global(html.dark) .mobile-bottom-nav {
			background: rgba(26, 26, 26, 0.85);
			border-color: #e4e4e7;
			box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
		}

		:global(html.ganyu-theme) .mobile-bottom-nav {
			background: rgba(237, 247, 252, 0.85);
			border-color: #4b6790;
			box-shadow: 0 8px 30px rgba(117, 157, 202, 0.15);
		}

		:global(html.dark.ganyu-theme) .mobile-bottom-nav {
			background: rgba(9, 13, 22, 0.85);
			border-color: rgba(75, 103, 144, 0.3);
			box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
		}

		.mobile-bottom-nav button {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: transparent;
			border: none;
			padding: 6px 14px;
			gap: 3px;
			color: #39333a;
			cursor: pointer;
			position: relative;
			transition: color 180ms ease, transform 150ms ease;
			min-width: 68px;
		}

		:global(html.dark) .mobile-bottom-nav button {
			color: #a1a1aa;
		}

		:global(html.dark) .mobile-bottom-nav button.active {
			color: #f4f4f5;
		}

		:global(html.ganyu-theme) .mobile-bottom-nav button {
			color: #536585;
		}

		:global(html.ganyu-theme) .mobile-bottom-nav button.active {
			color: #1d3557;
		}

		:global(html.dark.ganyu-theme) .mobile-bottom-nav button {
			color: #8bb1e2;
		}

		:global(html.dark.ganyu-theme) .mobile-bottom-nav button.active {
			color: #e2f0fd;
		}

		.mobile-bottom-nav button::before {
			content: '';
			position: absolute;
			inset: 2px 4px;
			z-index: -1;
			border-radius: 999px;
			background: rgba(229, 166, 181, 0.25);
			opacity: 0;
			transform: scaleX(0.7);
			transition: opacity 180ms ease, transform 180ms ease;
		}

		.mobile-bottom-nav button.active::before {
			opacity: 1;
			transform: scaleX(1);
		}

		:global(html.ganyu-theme) .mobile-bottom-nav button::before {
			background: rgba(117, 157, 202, 0.25);
		}

		:global(html.dark) .mobile-bottom-nav button::before {
			background: rgba(244, 244, 245, 0.08);
		}

		:global(html.dark.ganyu-theme) .mobile-bottom-nav button::before {
			background: rgba(139, 177, 226, 0.15);
		}

		.mobile-bottom-nav svg {
			width: 19px;
			height: 19px;
			fill: none;
			stroke: currentColor;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke-width: 1.8;
			transition: transform 180ms ease;
		}

		.mobile-bottom-nav button.active svg {
			transform: scale(1.05);
		}

		.mobile-label {
			font-size: 10px;
			font-weight: 700;
			font-family: var(--font-nav);
			letter-spacing: 0.01em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		nav button,
		nav button::after,
		.theme-toggle,
		.theme-toggle img {
			transition: none;
		}
	}

	/* Ganyu Theme Overrides */
	:global(html.ganyu-theme) .site-header {
		background: rgba(237, 247, 252, 0.94);
	}

	:global(html.ganyu-theme) nav button::before {
		background: radial-gradient(ellipse at center, rgba(117, 157, 202, 0.3) 0%, transparent 70%);
	}

	:global(html.ganyu-theme) nav button::after {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M1,5 C20,3 40,6 60,4 C75,3 90,5 99,4 C80,6 60,7 40,6 C20,5 5,8 1,5 Z' fill='%23759dca'/%3E%3C/svg%3E");
	}

	:global(html.ganyu-theme) nav button.active {
		text-shadow: 0 0 12px rgba(117, 157, 202, 0.4);
	}

	:global(html.ganyu-theme) a:focus-visible,
	:global(html.ganyu-theme) nav button:focus-visible {
		outline-color: #759dca;
	}

	/* Dark Mode Overrides */
	:global(html.dark) .site-header {
		background: rgba(26, 26, 26, 0.94);
	}
	:global(html.dark) nav button {
		color: #a1a1aa;
	}
	:global(html.dark) nav button:hover {
		color: #f4f4f5;
	}
	:global(html.dark) nav button.active {
		color: #f4f4f5;
	}
	:global(html.dark) .brand {
		color: #e4e4e7;
	}

	/* Ganyu Dark Mode Overrides */
	:global(html.dark.ganyu-theme) .site-header {
		background: rgba(9, 13, 22, 0.94);
		border-bottom: 1px solid rgba(75, 103, 144, 0.2);
	}
	:global(html.dark.ganyu-theme) nav button {
		color: #8bb1e2;
	}
	:global(html.dark.ganyu-theme) nav button:hover {
		color: #cbd5e1;
	}
	:global(html.dark.ganyu-theme) nav button.active {
		color: #e2f0fd;
		text-shadow: 0 0 12px rgba(139, 177, 226, 0.4);
	}
	:global(html.dark.ganyu-theme) .brand {
		color: #cbd5e1;
	}
	:global(html.dark.ganyu-theme) nav button::before {
		background: radial-gradient(ellipse at center, rgba(117, 157, 202, 0.15) 0%, transparent 70%);
	}
	:global(html.dark.ganyu-theme) nav button::after {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M1,5 C20,3 40,6 60,4 C75,3 90,5 99,4 C80,6 60,7 40,6 C20,5 5,8 1,5 Z' fill='%238bb1e2'/%3E%3C/svg%3E");
	}
	:global(html.dark.ganyu-theme) a:focus-visible,
	:global(html.dark.ganyu-theme) nav button:focus-visible {
		outline-color: #8bb1e2;
	}
	:global(html.dark.ganyu-theme) .theme-toggle {
		color: #8bb1e2;
	}
	
	/* Prevent icon flash (FOUC) */
	:global(html:not(.ganyu-theme) .ganyu-icon-only) { display: none !important; }
	:global(html.ganyu-theme .default-icon-only) { display: none !important; }
	
	:global(html:not(.dark) .dark-icon-only) { display: none !important; }
	:global(html.dark .light-icon-only) { display: none !important; }
</style>
