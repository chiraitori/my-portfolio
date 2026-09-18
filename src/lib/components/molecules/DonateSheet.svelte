<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import CloseButton from '$lib/components/atoms/CloseButton.svelte';

	type DonationOption = {
		label: string;
		description: string;
		icon: 'payos' | 'bank' | 'github' | 'paypal';
		href?: string;
	};

	let {
		open = false,
		close
	}: {
		open?: boolean;
		close: () => void;
	} = $props();

	const options: DonationOption[] = [
		{
			label: 'PayOS',
			description: 'Chọn số tiền · VietQR',
			icon: 'payos'
		},
		{
			label: 'Bank transfer',
			description: 'Techcombank · Chuyển khoản trực tiếp',
			icon: 'bank'
		},
		{
			label: 'GitHub Sponsors',
			description: 'Support me on GitHub',
			icon: 'github',
			href: 'https://github.com/sponsors/chiraitori'
		},
		{
			label: 'PayPal',
			description: 'Send via PayPal',
			icon: 'paypal',
			href: 'https://paypal.me/chiraitori'
		}
	];

	const suggestedAmounts = [20_000, 50_000, 100_000];
	const formatVnd = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
	const bankAccount = '19071945512011';
	let payosExpanded = $state(false);
	let bankExpanded = $state(false);
	let copyStatus = $state('');
	let amountInput = $state('50000');
	let donorMessage = $state('');
	let creatingCheckout = $state(false);
	let payosError = $state('');
	let checkoutAbort: AbortController | null = null;

	async function copyBankAccount() {
		try {
			await navigator.clipboard.writeText(bankAccount);
			copyStatus = 'Đã sao chép số tài khoản.';
		} catch {
			copyStatus = 'Không sao chép được. Bạn có thể chọn số tài khoản ở trên.';
		}
	}

	async function startPayosCheckout(event: SubmitEvent) {
		event.preventDefault();
		if (creatingCheckout) return;
		const amount = Number(amountInput);
		if (!Number.isInteger(amount) || amount < 10_000 || amount > 2_000_000 || amount % 1000) {
			payosError = 'Nhập từ 10.000đ đến 2.000.000đ, theo bội số 1.000đ.';
			return;
		}

		creatingCheckout = true;
		payosError = '';
		checkoutAbort = new AbortController();
		try {
			const response = await fetch('/api/donations/payos', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ amount, message: donorMessage.trim() }),
				signal: checkoutAbort.signal
			});
			const result: unknown = await response.json().catch(() => null);
			if (!result || typeof result !== 'object') {
				throw new Error('Máy chủ thanh toán đang gặp lỗi. Vui lòng thử lại sau.');
			}
			const { checkoutUrl, message } = result as { checkoutUrl?: string; message?: string };
			if (!response.ok || !checkoutUrl) {
				throw new Error(message || 'Không tạo được link thanh toán.');
			}
			window.location.assign(checkoutUrl);
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			payosError = error instanceof Error ? error.message : 'Không kết nối được PayOS.';
		} finally {
			checkoutAbort = null;
			creatingCheckout = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') close();
	}

	let hiddenAt: number | null = null;

	function resumeAnimationAfterVisibilityChange() {
		if (document.hidden) {
			hiddenAt = performance.now();
			return;
		}
		if (hiddenAt === null || !open) {
			hiddenAt = null;
			return;
		}
		hiddenAt = null;
		// Let a transition that was paused in a background tab continue naturally.
		// Only settle an animation if the browser already advanced it past its end.
		requestAnimationFrame(() => {
			const layer = document.querySelector('.donation-layer');
			for (const animation of layer?.getAnimations({ subtree: true }) ?? []) {
				const duration = animation.effect?.getTiming().duration;
				if (typeof duration === 'number' && Number(animation.currentTime) >= duration) {
					animation.finish();
				}
			}
		});
	}

	$effect(() => {
		if (!open) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			checkoutAbort?.abort();
			document.body.style.overflow = previousOverflow;
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />
<svelte:document onvisibilitychange={resumeAnimationAfterVisibilityChange} />

{#if open}
	<div class="donation-layer" aria-label="Donation options">
		<button
			class="donation-backdrop"
			type="button"
			aria-label="Close donation options"
			onclick={close}
			transition:fade={{ duration: 220 }}
		></button>

		<div
			class="donation-sheet theme-surface"
			role="dialog"
			aria-modal="true"
			aria-labelledby="donation-title"
			transition:fly={{ y: 44, duration: 340, opacity: 0 }}
		>
			<div class="sheet-handle" aria-hidden="true"></div>
			<div class="sheet-heading">
				<div>
					<p class="eyebrow">A little support</p>
					<h2 id="donation-title">Buy me a cup?</h2>
					<p class="sheet-description">Nếu thấy project dễ thương, bạn có thể ủng hộ mình ở đây.</p>
				</div>
				<CloseButton label="Close" onclick={close} />
			</div>

			<div class="donation-options">
				{#each options as option (option.label)}
					{#if option.icon === 'payos'}
						<button
							class="donation-option"
							class:active={payosExpanded}
							type="button"
							aria-expanded={payosExpanded}
							aria-controls="payos-amount-form"
							onclick={() => {
								payosExpanded = !payosExpanded;
								if (payosExpanded) bankExpanded = false;
							}}
						>
							<span class="option-icon" aria-hidden="true">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M6 8h12" />
									<path d="M5 8.5h14l-1 11H6l-1-11Z" />
									<path d="M8 8a4 4 0 0 1 8 0" />
								</svg>
							</span>
							<span class="option-copy">
								<strong>{option.label}</strong>
								<small>{option.description}</small>
							</span>
							<span class="option-arrow" aria-hidden="true">⌄</span>
						</button>
					{:else if option.icon === 'bank'}
						<button
							class="donation-option"
							class:active={bankExpanded}
							type="button"
							aria-expanded={bankExpanded}
							aria-controls="bank-transfer-details"
							onclick={() => {
								bankExpanded = !bankExpanded;
								if (bankExpanded) payosExpanded = false;
								copyStatus = '';
							}}
						>
							<span class="option-icon" aria-hidden="true">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="m3 10 9-6 9 6M5 10h14M6 10v7m4-7v7m4-7v7m4-7v7M4 20h16" />
								</svg>
							</span>
							<span class="option-copy">
								<strong>{option.label}</strong>
								<small>{option.description}</small>
							</span>
							<span class="option-arrow" aria-hidden="true">⌄</span>
						</button>
					{:else if option.href}
						<a
							class="donation-option"
							href={option.href}
							target="_blank"
							rel="noopener noreferrer"
							onclick={close}
						>
							<span class="option-icon" aria-hidden="true">
								{#if option.icon === 'github'}
									<svg
										viewBox="0 0 24 24"
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
								{:else}
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M6 8h12" />
										<path d="M5 8.5h14l-1 11H6l-1-11Z" />
										<path d="M8 8a4 4 0 0 1 8 0" />
										<path d="M9 12h6" />
									</svg>
								{/if}
							</span>
							<span class="option-copy">
								<strong>{option.label}</strong>
								<small>{option.description}</small>
							</span>
							<span class="option-arrow" aria-hidden="true">↗</span>
						</a>
					{/if}
				{/each}
			</div>
			{#if payosExpanded}
				<form
					id="payos-amount-form"
					class="payos-form"
					onsubmit={startPayosCheckout}
					transition:slide={{ duration: 280, axis: 'y' }}
				>
					<label for="donation-amount">Số tiền ủng hộ</label>
					<div class="amount-presets" aria-label="Mức ủng hộ gợi ý">
						{#each suggestedAmounts as amount}
							<button
								type="button"
								class:selected={amountInput === String(amount)}
								aria-pressed={amountInput === String(amount)}
								onclick={() => {
									amountInput = String(amount);
									payosError = '';
								}}>{formatVnd(amount)}</button
							>
						{/each}
					</div>
					<div class="amount-entry">
						<input
							id="donation-amount"
							type="number"
							min="10000"
							max="2000000"
							step="1000"
							inputmode="numeric"
							value={amountInput}
							oninput={(event) => {
								amountInput = event.currentTarget.value;
								payosError = '';
							}}
							required
						/>
						<span>VND</span>
					</div>
					<label for="donation-message">Lời nhắn (không bắt buộc)</label>
					<textarea
						id="donation-message"
						rows="3"
						maxlength="300"
						placeholder="Nhắn gì đó cho mình nhé…"
						bind:value={donorMessage}
					></textarea>
					<small class="message-hint"
						>Chỉ gửi sau khi PayOS xác nhận thanh toán · {donorMessage.length}/300</small
					>
					{#if payosError}<p class="payos-error" role="alert">{payosError}</p>{/if}
					<button class="payos-submit" type="submit" disabled={creatingCheckout}>
						{creatingCheckout ? 'Đang tạo link…' : 'Tiếp tục với PayOS ↗'}
					</button>
				</form>
			{/if}
			{#if bankExpanded}
				<section
					id="bank-transfer-details"
					class="bank-panel"
					aria-label="Thông tin chuyển khoản Techcombank"
					transition:slide={{ duration: 280, axis: 'y' }}
				>
					<div class="bank-heading">
						<span class="bank-emblem" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none">
								<path d="m3 10 9-6 9 6M5 10h14M6 10v7m4-7v7m4-7v7m4-7v7M4 20h16" />
							</svg>
						</span>
						<div><strong>Techcombank</strong><small>Chuyển khoản trực tiếp</small></div>
					</div>
					<div class="bank-details">
						<div class="bank-instructions">
							<div class="bank-account">
								<span>Số tài khoản</span>
								<div class="bank-account-line">
									<strong>{bankAccount}</strong>
								</div>
								<span class="bank-owner">NGUYEN TAN TU</span>
							</div>
							<button class="bank-copy" type="button" onclick={copyBankAccount}
								>Sao chép số tài khoản</button
							>
							{#if copyStatus}<p class="copy-status" role="status">{copyStatus}</p>{/if}
							<p class="bank-note">
								Bạn tự chọn số tiền và lời nhắn trong app ngân hàng. Trang này không tự xác nhận
								chuyển khoản.
							</p>
						</div>
						<div class="bank-qr-frame">
							<img
								class="bank-qr"
								src="/images/techcombank-vietqr.jpg"
								alt="Mã VietQR chuyển khoản đến tài khoản Techcombank {bankAccount}"
								width="514"
								height="570"
							/>
						</div>
					</div>
				</section>
			{/if}
		</div>
	</div>
{/if}

<style>
	.donation-layer {
		position: fixed;
		inset: 0;
		z-index: 70;
		pointer-events: none;
	}
	.donation-backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		border: 0;
		background: rgb(26 20 30 / 48%);
		backdrop-filter: blur(6px);
		cursor: pointer;
		pointer-events: auto;
	}
	.donation-sheet {
		position: absolute;
		inset-inline: max(12px, env(safe-area-inset-left)) max(12px, env(safe-area-inset-right));
		bottom: max(12px, env(safe-area-inset-bottom));
		width: min(620px, calc(100% - 24px));
		max-height: min(94dvh, 720px);
		margin-inline: auto;
		overflow-y: auto;
		padding: 12px 20px 20px;
		border: 1.5px solid var(--line);
		border-radius: 30px 24px 20px 26px;
		background: color-mix(in srgb, var(--surface) 94%, transparent);
		box-shadow: 0 18px 70px rgb(16 12 20 / 28%);
		backdrop-filter: blur(18px);
		pointer-events: auto;
	}
	.sheet-handle {
		width: 42px;
		height: 4px;
		margin: 0 auto 18px;
		border-radius: 999px;
		background: var(--line);
		opacity: 0.7;
	}
	.sheet-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
	}
	.eyebrow {
		margin: 0 0 2px;
		color: var(--accent);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	h2 {
		margin: 0;
		color: var(--ink);
		font-family: var(--font-hero);
		font-size: clamp(1.45rem, 5vw, 2rem);
		font-weight: 400;
	}
	.sheet-description {
		max-width: 32rem;
		margin: 7px 0 0;
		color: var(--ink-muted);
		font-size: 0.82rem;
		line-height: 1.5;
	}
	.donation-options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin-top: 22px;
	}
	.donation-option {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 11px;
		padding: 13px 12px;
		border: 1px solid var(--line);
		border-radius: 17px 13px 16px 12px;
		background: color-mix(in srgb, var(--surface) 72%, var(--accent-soft));
		color: var(--ink);
		text-align: left;
		text-decoration: none;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			background 180ms ease;
	}
	a.donation-option:hover {
		transform: translateY(-2px) rotate(-0.4deg);
		border-color: var(--accent);
		background: var(--accent-soft);
	}
	button.donation-option:not(:disabled):hover,
	button.donation-option.active {
		border-color: var(--accent);
		background: var(--accent-soft);
	}
	.payos-form {
		display: grid;
		gap: 10px;
		margin-top: 12px;
		padding: 15px;
		border: 1px solid var(--line);
		border-radius: 18px;
		background: var(--surface);
	}
	.bank-panel {
		display: grid;
		gap: 14px;
		margin-top: 12px;
		padding: 17px;
		border: 1px solid var(--line);
		border-radius: 18px;
		background: var(--surface);
	}
	.bank-heading {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.bank-emblem {
		display: grid;
		width: 42px;
		height: 42px;
		flex: 0 0 auto;
		place-items: center;
		border-radius: 13px;
		background: var(--accent-soft);
		color: var(--accent);
	}
	.bank-emblem svg {
		width: 22px;
		height: 22px;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.bank-heading div {
		display: grid;
		gap: 2px;
	}
	.bank-heading strong {
		font-size: 0.9rem;
	}
	.bank-details {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 230px);
		align-items: center;
		gap: 20px;
	}
	.bank-qr-frame {
		padding: 7px;
		border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line));
		border-radius: 20px;
		background: var(--accent-soft);
	}
	.bank-qr {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 13px;
		background: white;
	}
	.bank-instructions {
		display: grid;
		justify-items: start;
		gap: 10px;
	}
	.bank-heading small,
	.bank-account > span,
	.bank-note {
		color: var(--ink-muted);
		font-size: 0.75rem;
	}
	.bank-account {
		display: grid;
		gap: 4px;
	}
	.bank-account-line {
		margin-top: 1px;
	}
	.bank-account-line strong {
		color: var(--ink);
		font-size: clamp(1rem, 3.5vw, 1.25rem);
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.015em;
		user-select: all;
	}
	.bank-owner {
		color: var(--ink-muted);
		font-size: 0.75rem;
		letter-spacing: 0.04em;
	}
	.bank-copy {
		min-height: 40px;
		padding: 7px 14px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--accent-soft);
		color: var(--ink);
		font: inherit;
		font-size: 0.75rem;
		cursor: pointer;
	}
	.bank-copy:hover {
		border-color: var(--accent);
		box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 18%, transparent);
	}
	.bank-copy:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.bank-note,
	.copy-status {
		margin: 0;
		line-height: 1.6;
	}
	.copy-status {
		color: var(--accent);
		font-size: 0.75rem;
	}
	.payos-form label {
		color: var(--ink);
		font-size: 0.8rem;
		font-weight: 700;
	}
	.amount-presets {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}
	.amount-presets button {
		min-height: 36px;
		padding: 6px 12px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--surface);
		color: var(--ink-muted);
		cursor: pointer;
	}
	.amount-presets button.selected {
		border-color: var(--accent);
		background: var(--accent-soft);
		color: var(--ink);
	}
	.amount-entry {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 12px;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: var(--surface);
		color: var(--ink-muted);
	}
	.amount-entry input {
		width: 100%;
		min-width: 0;
		height: 44px;
		border: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
	}
	.amount-entry input:focus {
		outline: none;
	}
	.amount-entry:focus-within {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.payos-form textarea {
		width: 100%;
		min-height: 74px;
		resize: vertical;
		padding: 10px 12px;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: var(--surface);
		color: var(--ink);
		font: inherit;
		font-size: 0.82rem;
		line-height: 1.5;
	}
	.payos-form textarea:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.message-hint {
		color: var(--ink-muted);
		font-size: 0.72rem;
	}
	.payos-error {
		margin: 0;
		color: var(--accent);
		font-size: 0.78rem;
	}
	.payos-submit {
		min-height: 44px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--accent);
		color: var(--on-accent);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
	}
	.payos-submit:disabled {
		cursor: wait;
		opacity: 0.6;
	}
	.amount-presets button:focus-visible,
	.payos-submit:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.donation-option:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.option-icon {
		display: grid;
		width: 34px;
		height: 34px;
		flex: 0 0 auto;
		place-items: center;
		border-radius: 12px 9px 11px 8px;
		background: var(--accent-soft);
		color: var(--accent);
	}
	.option-icon svg {
		width: 18px;
		height: 18px;
	}
	.option-copy {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 2px;
	}
	.option-copy strong {
		overflow: hidden;
		font-size: 0.82rem;
		font-weight: 700;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.option-copy small {
		overflow: hidden;
		color: var(--ink-muted);
		font-size: 0.68rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.option-arrow {
		flex: 0 0 auto;
		color: var(--accent);
		font-size: 0.9rem;
		font-weight: 700;
	}
	.option-arrow {
		transition: transform 220ms ease;
	}
	.donation-option.active .option-arrow {
		transform: rotate(180deg);
	}
	@media (max-width: 480px) {
		.donation-sheet {
			padding-inline: 15px;
		}
		.donation-options {
			grid-template-columns: 1fr;
		}
		.bank-details {
			grid-template-columns: 1fr;
			justify-items: center;
		}
		.bank-qr-frame {
			grid-row: 1;
			width: min(100%, 258px);
		}
		.bank-instructions {
			width: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.donation-option,
		.option-arrow {
			transition: none;
		}
	}
</style>
