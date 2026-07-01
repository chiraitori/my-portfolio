<div class="z-10 flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		<h1 class="hero-title select-none">
			Hi there~ <br />
			I'm Chiraitori~
		</h1>
		<p class="font-handwritten mt-4 text-2xl text-[#302b30] dark:text-zinc-200 select-none md:text-3xl">
			<span class="line-through decoration-2">IoT Developer</span> <br />
			<span class="hero-highlight">Hardware Muncher :)</span>
		</p>
	</div>

	<div class="mt-2 flex items-center gap-4">
		<a
			href="#about"
			class="hand-drawn-btn btn-yellow px-7 py-3 font-semibold text-[#302b30]"
			onclick={() => {
				setTimeout(() => {
					document
						.querySelector('.showcase-viewport')
						?.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 50);
			}}
		>
			About me
		</a>
		<a
			href="#posts"
			class="hand-drawn-btn btn-white px-7 py-3 font-semibold text-[#302b30] dark:text-zinc-200"
			onclick={() => {
				setTimeout(() => {
					document
						.querySelector('.showcase-viewport')
						?.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 50);
			}}
		>
			Browse posts
		</a>
	</div>

	<div class="mt-4 flex flex-col gap-3 text-current/80 sm:flex-row sm:items-center sm:gap-4">
		<span class="text-sm font-medium">Let's connect</span>
		<div class="flex flex-wrap items-center gap-3">
			<a
				href="https://github.com"
				aria-label="GitHub"
				class="social-link rounded-full p-2 text-current transition-colors hover:bg-current/8"
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
				href="https://twitter.com"
				aria-label="Twitter"
				class="social-link rounded-full p-2 text-current transition-colors hover:bg-current/8"
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
						d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
					/>
				</svg>
			</a>
			<a
				href="https://bluesky.social"
				aria-label="BlueSky"
				class="social-link rounded-full p-2 text-current transition-colors hover:bg-current/8"
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
						d="M12 10.8c-1.5-2.5-4-5.8-7-7.8C3.5 1.9 2.3.8.7.2 0 0 0 .5 0 1c0 2.4.6 6 2 8 1.4 2 2.8 2.7 4.5 3-1.7.3-3 .8-4.5 3-1.4 2-2 5.6-2 8 0 .5 0 1 .7.8 1.6-.6 2.8-1.7 4.3-2.8 3-2 5.5-5.3 7-7.8m0 0c1.5-2.5 4-5.8 7-7.8 1.5-1.1 2.7-2.2 4.3-2.8.7-.2.7.3.7.8 0 2.4-.6 6-2 8-1.4 2-2.8 2.7-4.5 3 1.7.3 3 .8 4.5 3 1.4 2 2 5.6 2 8 0 .5 0 1-.7.8-1.6-.6-2.8-1.7-4.3-2.8-3-2-5.5-5.3-7-7.8"
					/>
				</svg>
			</a>
			<a
				href="https://discord.com"
				aria-label="Discord"
				class="social-link rounded-full p-2 text-current transition-colors hover:bg-current/8"
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
				href="mailto:contact@chiraitori.io.vn"
				aria-label="Email"
				class="social-link rounded-full p-2 text-current transition-colors hover:bg-current/8"
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
		</div>
	</div>
</div>

<style>
	.hero-title {
		margin: 0;
		color: #202747;
		font-family: var(--font-hero);
		font-size: 62px;
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: 0;
	}

	:global(html.dark) .hero-title {
		color: #f4f4f5;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45), 0 4px 24px rgba(0, 0, 0, 0.25);
	}

	:global(html.dark.ganyu-theme) .hero-title {
		color: #e2f0fd;
		text-shadow: 0 2px 12px rgba(9, 13, 22, 0.8), 0 4px 28px rgba(9, 13, 22, 0.5);
	}

	.font-handwritten {
		font-family: var(--font-handwritten);
	}

	:global(html.dark) .font-handwritten {
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
	}

	:global(html.dark.ganyu-theme) .font-handwritten {
		text-shadow: 0 1px 8px rgba(9, 13, 22, 0.7);
	}

	.social-icon {
		filter: url(#rough);
		transform-origin: center;
		transition: transform 180ms ease;
	}

	.social-link:hover .social-icon {
		transform: scale(1.15) rotate(4deg);
	}

	.hand-drawn-btn {
		position: relative;
		z-index: 1;
		transition: transform 150ms ease;
	}

	.hand-drawn-btn::before {
		content: '';
		position: absolute;
		inset: -1px;
		z-index: -1;
		border-style: solid;
		border-color: #302b30;
		box-shadow: 3px 4px 0px 0px #302b30;
		transition: all 150ms ease;
	}

	.hand-drawn-btn.btn-yellow::before {
		background-color: #fbeea5;
		border-radius: 80px 60px 90px 70px / 70px 90px 60px 80px;
		border-width: 3px 2px 2px 3px;
		transform: rotate(-0.5deg);
	}

	.hand-drawn-btn.btn-white::before {
		background-color: #ffffff;
		border-radius: 60px 90px 70px 80px / 80px 70px 90px 60px;
		border-width: 2px 3px 3px 2px;
		transform: rotate(0.5deg);
	}

	.hand-drawn-btn:hover {
		transform: translate(1px, 1px);
	}

	.hand-drawn-btn:hover::before {
		box-shadow: 2px 3px 0px 0px #302b30;
	}

	.hand-drawn-btn.btn-yellow:hover::before {
		background-color: #fae383;
	}

	.hand-drawn-btn.btn-white:hover::before {
		background-color: #f5f5f5;
	}

	.hand-drawn-btn:active {
		transform: translate(3px, 4px);
	}

	.hand-drawn-btn:active::before {
		box-shadow: 0px 0px 0px 0px #302b30;
	}

	.hero-highlight {
		color: #a15f70;
	}

	:global(html.ganyu-theme) .hero-highlight {
		color: #4b6790;
	}

	:global(html.dark) .hero-highlight {
		color: #e8a7b5;
	}

	:global(html.dark) .hand-drawn-btn::before {
		border-color: #e4e4e7;
		box-shadow: 3px 4px 0px 0px #e4e4e7;
	}

	:global(html.dark) .hand-drawn-btn:hover::before {
		box-shadow: 2px 3px 0px 0px #e4e4e7;
	}

	:global(html.dark) .hand-drawn-btn:active::before {
		box-shadow: 0px 0px 0px 0px #e4e4e7;
	}

	:global(html.dark) .hand-drawn-btn.btn-white::before {
		background-color: #27272a;
	}

	:global(html.dark) .hand-drawn-btn.btn-white:hover::before {
		background-color: #3f3f46;
	}

	@media (max-width: 767px) {
		.hero-title {
			font-size: clamp(40px, 11vw, 52px);
		}
	}
</style>
