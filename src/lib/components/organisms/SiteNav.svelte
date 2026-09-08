<script lang="ts">
	import glazelily from '$lib/assets/glazelily.png';
	import sunIcon from '$lib/assets/sun.svg';
	import moonIcon from '$lib/assets/moon.svg';
	import RoughTextFilter from '$lib/components/atoms/RoughTextFilter.svelte';
	import { onMount } from 'svelte';
	import { navigateSection } from '$lib/navigation';

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
	let dockOffset = $state(0);

	function applyTheme(enabled: boolean) {
		isGanyuTheme = enabled;
		document.documentElement.classList.toggle('ganyu-theme', enabled);
		try {
			localStorage.setItem('portfolio-theme', enabled ? 'ganyu' : 'default');
		} catch {
			/* Storage may be disabled. */
		}
	}

	function applyDarkMode(enabled: boolean) {
		isDarkMode = enabled;
		document.documentElement.classList.toggle('dark', enabled);
		try {
			localStorage.setItem('portfolio-dark-mode', enabled ? 'true' : 'false');
		} catch {
			/* Storage may be disabled. */
		}
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
		const originX = (event.clientX || bounds.left + bounds.width / 2) / currentZoom;
		const originY = (event.clientY || bounds.top + bounds.height / 2) / currentZoom;
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
		const originX = (event.clientX || bounds.left + bounds.width / 2) / currentZoom;
		const originY = (event.clientY || bounds.top + bounds.height / 2) / currentZoom;
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
		activeHref = navItems.some((item) => item.href === hash) ? hash : '#home';
	}

	onMount(() => {
		syncActiveHref();
		isGanyuTheme = document.documentElement.classList.contains('ganyu-theme');
		isDarkMode = document.documentElement.classList.contains('dark');
		let frame = 0;
		const updateDock = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const footer = document.querySelector('.site-footer');
				const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
				dockOffset = footer
					? Math.max(0, window.innerHeight - footer.getBoundingClientRect().bottom) / zoom
					: 0;
			});
		};
		const observer = new ResizeObserver(updateDock);
		observer.observe(document.body);
		window.addEventListener('scroll', updateDock, { passive: true });
		window.addEventListener('resize', updateDock);
		updateDock();
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('scroll', updateDock);
			window.removeEventListener('resize', updateDock);
		};
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
		<a
			class="brand-name"
			href="#home"
			onclick={(event) => navigateSection(event, '#home')}
			aria-label="chiraitori.dev home">chiraitori.dev</a
		>
	</div>

	<nav aria-label="Primary navigation">
		{#each navItems as item (item.href)}
			<a
				href={item.href}
				class:active={activeHref === item.href}
				aria-current={activeHref === item.href ? 'page' : undefined}
				onclick={(event) => navigateSection(event, item.href)}
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
						<path
							d="M12 4.5 C 14.5 4.3, 16.5 6.3, 16.5 8.5 C 16.3 11.5, 14.5 12.7, 12 12.5 C 9.5 12.7, 7.7 11.5, 7.5 8.5 C 7.5 6.3, 9.5 4.3, 12 4.5"
						/>
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
			</a>
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

<nav
	class="mobile-bottom-nav"
	style:--dock-offset={`${dockOffset}px`}
	aria-label="Mobile navigation"
>
	{#each navItems as item (item.href)}
		<a
			href={item.href}
			class:active={activeHref === item.href}
			aria-current={activeHref === item.href ? 'page' : undefined}
			onclick={(event) => navigateSection(event, item.href)}
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
					<path
						d="M12 4.5 C 14.5 4.3, 16.5 6.3, 16.5 8.5 C 16.3 11.5, 14.5 12.7, 12 12.5 C 9.5 12.7, 7.7 11.5, 7.5 8.5 C 7.5 6.3, 9.5 4.3, 12 4.5"
					/>
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
		</a>
	{/each}
</nav>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 40;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		min-height: 72px;
		gap: 24px;
		padding: 0 max(24px, calc((100% - 1256px) / 2));
		background: var(--nav-bg);
		border-bottom: 1px solid var(--line);
		backdrop-filter: blur(16px);
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--ink);
		font-size: 20px;
		font-weight: 700;
	}
	.brand-name {
		color: inherit;
		text-decoration: none;
		white-space: nowrap;
	}
	.brand-at {
		font-family: var(--font-hero);
		font-size: 34px;
		line-height: 1;
	}
	.actions {
		justify-self: end;
		display: flex;
		align-items: center;
	}
	.theme-toggle {
		display: grid;
		width: 44px;
		height: 44px;
		padding: 4px;
		border: 0;
		background: transparent;
		cursor: pointer;
		place-items: center;
		transition: transform 180ms ease;
	}
	.theme-toggle img {
		width: 34px;
		height: 34px;
		object-fit: contain;
	}
	.theme-toggle:hover {
		transform: rotate(-8deg);
	}
	.theme-toggle:disabled {
		cursor: wait;
	}
	nav {
		display: flex;
		align-items: center;
		justify-self: center;
		gap: clamp(8px, 2vw, 28px);
	}
	nav a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0 12px;
		gap: 8px;
		color: var(--ink-muted);
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
		border-radius: 16px;
		transition:
			color 180ms ease,
			background 180ms ease;
	}
	nav a:hover,
	nav a.active {
		color: var(--accent);
		background: var(--accent-soft);
	}
	nav svg {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.mobile-bottom-nav {
		display: none;
	}
	@media (max-width: 1023px) {
		.site-header {
			grid-template-columns: auto 1fr;
			min-height: 64px;
			padding: 0 14px;
		}
		.site-header nav {
			display: none;
		}
		.mobile-bottom-nav {
			position: fixed;
			bottom: calc(20px + env(safe-area-inset-bottom, 0px) + var(--dock-offset, 0px));
			left: 50%;
			transform: translateX(-50%);
			z-index: 40;
			display: flex;
			width: min(calc(100% - 32px), 360px);
			padding: 6px;
			gap: 4px;
			background: var(--nav-bg);
			border: 1px solid var(--line);
			border-radius: 24px;
			box-shadow: 0 8px 28px var(--shadow);
			backdrop-filter: blur(16px);
		}
		.mobile-bottom-nav a {
			flex: 1;
			min-width: 0;
			flex-direction: column;
			min-height: 48px;
			padding: 5px 4px;
			gap: 3px;
			border-radius: 18px;
		}
		.mobile-label {
			font-size: 11px;
		}
	}
	:global(html:not(.ganyu-theme)) .ganyu-icon-only {
		display: none;
	}
	:global(html.ganyu-theme) .default-icon-only {
		display: none;
	}
	:global(html:not(.dark)) .dark-icon-only {
		display: none;
	}
	:global(html.dark) .light-icon-only {
		display: none;
	}
</style>
