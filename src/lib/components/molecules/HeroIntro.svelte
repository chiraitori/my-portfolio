<script lang="ts">
	import { holidayThemes, type Season } from '$lib/seasonal';
	import { navigateSection } from '$lib/navigation';

	let {
		donationOpen,
		onOpenDonation,
		season = null
	}: {
		donationOpen: boolean;
		onOpenDonation: () => void;
		season?: Season | null;
	} = $props();
</script>

<div class="hero-intro z-10 flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		{#if season}
			<p class="holiday-note"><span aria-hidden="true">✧</span> {holidayThemes[season].hero}</p>
		{/if}
		<h1 class="hero-title select-none">
			Hi there~ <br />
			I'm Chiraitori~
		</h1>
		<p
			class="hero-subtitle font-handwritten mt-4 text-xl text-[var(--ink)] select-none md:text-2xl"
		>
			<span class="line-through decoration-2">IoT Developer</span> <br />
			<span class="hero-highlight">I make things. Sometimes they work.</span>
		</p>
		<p class="max-w-sm text-xs leading-relaxed text-[var(--ink-muted)]">
			Part-time cosplayer, still waiting for my debut.
		</p>
	</div>

	<div class="hero-actions mt-2 flex flex-wrap items-center gap-4">
		<a
			href="#about"
			class="hand-drawn-btn btn-primary px-7 py-3 font-semibold text-[var(--ink)]"
			onclick={(event) => navigateSection(event, '#about')}
		>
			About me
		</a>
		<a
			href="#posts"
			class="hand-drawn-btn btn-white px-7 py-3 font-semibold text-[var(--ink)]"
			onclick={(event) => navigateSection(event, '#posts')}
		>
			Browse posts
		</a>
	</div>

	<div
		class="hero-connect mt-4 flex flex-col gap-3 text-current/80 sm:flex-row sm:items-center sm:gap-4"
	>
		<span class="connect-label text-sm font-medium">Let's connect</span>
		<div class="flex flex-wrap items-center gap-3">
			<a
				href="https://github.com/chiraitori"
				aria-label="GitHub"
				class="social-link rounded-full p-2 text-current"
			>
				<svg
					class="social-icon h-5 w-5"
					viewBox="0 0 24 24"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
					/>
				</svg>
			</a>
			<a
				href="https://discord.com/users/685716988471148552"
				aria-label="Discord"
				class="social-link rounded-full p-2 text-current"
			>
				<svg
					class="social-icon h-5 w-5"
					viewBox="0 0 24 24"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"
					/>
					<path
						d="M8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418z"
						fill="currentColor"
						stroke="none"
					/>
					<path
						d="M15.995 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"
						fill="currentColor"
						stroke="none"
					/>
				</svg>
			</a>
			<a
				href="mailto:mail@chiraitori.io.vn"
				aria-label="Email"
				class="social-link rounded-full p-2 text-current"
			>
				<svg
					class="social-icon h-5 w-5"
					viewBox="0 0 24 24"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
					></path>
					<polyline points="22,6 12,13 2,6"></polyline>
				</svg>
			</a>
			<button
				type="button"
				aria-label="Open donation options"
				aria-haspopup="dialog"
				aria-expanded={donationOpen}
				class="social-link donate-trigger rounded-full p-2 text-current"
				title="Buy me a cup"
				onclick={onOpenDonation}
			>
				<svg
					class="social-icon h-6 w-6"
					viewBox="0 0 32 32"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 11.5c5.5-.6 14.3-.6 20 0l-1.6 15.1c-4.1.8-12.1.8-16.2 0L5 11.5Z" />
					<path d="M5 11.5c4.9 1.1 15.2 1.1 20 0M8 15.4c4.3.6 10.7.6 14.1.1" />
					<path
						d="M10 5.7c-1.1 1.3-.9 2.4.1 3.4M16.2 4.1c-1.4 1.9-1.3 3.3.1 5M22 5.6c-1.1 1.2-1 2.4-.1 3.4"
					/>
					<path d="M11.2 20.2c.2 1.2.6 2.5 1.2 3.4" />
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	.holiday-note {
		margin: 0 0 10px;
		color: var(--festive-red);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.holiday-note span {
		color: var(--festive-gold);
		margin-right: 5px;
	}
	.hero-connect {
		flex-wrap: wrap;
	}
	.connect-label {
		flex-shrink: 0;
	}
	@media (max-width: 1023px) {
		.hero-connect {
			flex-direction: row;
			align-items: center;
			gap: 8px;
		}
		.connect-label {
			display: none;
		}
	}

	.hand-drawn-btn.btn-primary {
		color: var(--on-accent);
	}
	.social-link {
		position: relative;
		isolation: isolate;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		transition: color 180ms ease;
	}
	.social-link::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 2px;
		border-radius: 50%;
		background: radial-gradient(circle, var(--nav-bleed) 28%, transparent 73%);
		filter: blur(5px);
		opacity: 0;
		pointer-events: none;
		transition: opacity 180ms ease;
	}
	@media (hover: hover) and (pointer: fine) {
		.social-link:hover {
			color: var(--accent);
		}
		.social-link:hover::before {
			opacity: 1;
		}
	}
	.social-link:focus-visible {
		color: var(--accent);
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.social-link:focus-visible::before {
		opacity: 1;
	}
	.hero-title {
		margin: 0;
		max-width: 100%;
		color: var(--ink);
		font-family: var(--font-hero);
		font-size: clamp(2.25rem, 5.5cqw, 3.375rem);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: 0;
	}

	.font-handwritten {
		font-family: var(--font-handwritten);
	}

	.social-icon {
		filter: url(#rough);
	}

	.hand-drawn-btn {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		white-space: nowrap;
		transition: transform 150ms ease;
	}

	.hand-drawn-btn::before {
		content: '';
		position: absolute;
		inset: -1px;
		z-index: -1;
		border-style: solid;
		border-color: var(--line);
		box-shadow: 3px 4px 0px 0px var(--line);
		transition: all 150ms ease;
	}

	.hand-drawn-btn.btn-primary::before {
		background-color: var(--accent);
		border-radius: 80px 60px 90px 70px / 70px 90px 60px 80px;
		border-width: 3px 2px 2px 3px;
		transform: rotate(-0.5deg);
	}

	.hand-drawn-btn.btn-white::before {
		background-color: var(--surface);
		border-radius: 60px 90px 70px 80px / 80px 70px 90px 60px;
		border-width: 2px 3px 3px 2px;
		transform: rotate(0.5deg);
	}

	.hand-drawn-btn:hover {
		transform: translate(1px, 1px);
	}

	.hand-drawn-btn:hover::before {
		box-shadow: 2px 3px 0px 0px var(--line);
	}

	.hand-drawn-btn.btn-primary:hover::before {
		background-color: var(--accent-hover);
	}

	.hand-drawn-btn.btn-white:hover::before {
		background-color: var(--surface-hover);
	}

	.hand-drawn-btn:active {
		transform: translate(3px, 4px);
	}

	.hand-drawn-btn:active::before {
		box-shadow: 0px 0px 0px 0px var(--line);
	}

	.hero-highlight {
		color: var(--accent);
	}

	@media (max-width: 767px) {
		.hero-intro {
			gap: 1.25rem;
			max-width: min(100%, 21rem);
		}
		.hero-title {
			font-size: clamp(2.2rem, 10vw, 2.65rem);
			line-height: 1.08;
		}

		.hero-subtitle {
			margin-top: 0.75rem;
			font-size: clamp(1.1rem, 4.8vw, 1.25rem);
			line-height: 1.25;
		}

		.hero-actions {
			flex-wrap: wrap;
			gap: 0.75rem;
		}

		.hand-drawn-btn {
			min-width: min(100%, 8.75rem);
			padding: 0.72rem 1.2rem;
			font-size: 0.95rem;
			line-height: 1.25;
		}

		.hero-connect {
			margin-top: 0.75rem;
		}
	}

	@media (max-width: 600px) {
		.hero-intro {
			max-width: min(100%, 20rem);
		}

		.hero-title {
			font-size: clamp(2.15rem, 9vw, 2.6rem);
		}

		.hero-actions {
			width: 100%;
			max-width: 22rem;
			gap: 0.875rem;
		}

		.hand-drawn-btn {
			flex: 1 1 0;
			min-width: 0;
			padding: 0.8rem 0.5rem;
			font-size: 0.9rem;
			white-space: nowrap;
		}
	}
</style>
