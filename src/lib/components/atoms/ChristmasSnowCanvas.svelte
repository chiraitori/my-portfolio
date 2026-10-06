<script lang="ts">
	import { onMount } from 'svelte';

	let { pageHidden = false }: { pageHidden?: boolean } = $props();

	let canvas: HTMLCanvasElement;
	let animId: number | null = null;

	interface Snowflake {
		x: number;
		y: number;
		r: number;
		vy: number;
		drift: number;
		wobble: number;
		wobbleSpeed: number;
		opacity: number;
	}

	interface Sparkle {
		x: number;
		y: number;
		life: number;
		maxLife: number;
		size: number;
	}

	const SEGMENTS = 26;
	const MAX_SPARKLES = 12;

	onMount(() => {
		const ctx = canvas.getContext('2d', { alpha: true });
		if (!ctx) return;

		let dpr = 1;
		let width = 0;
		let height = 0;
		let isMobile = false;
		let isDark = document.documentElement.classList.contains('dark');

		// Theme observer
		const observer = new MutationObserver(() => {
			isDark = document.documentElement.classList.contains('dark');
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		// Particle pool
		const particles: Snowflake[] = [];
		const sparkles: Sparkle[] = [];
		for (let i = 0; i < MAX_SPARKLES; i++) {
			sparkles.push({ x: 0, y: 0, life: 0, maxLife: 0.5, size: 2 });
		}

		// Pile height arrays: start at EXACTLY 0 (clean page on load)
		const leftPile = new Float32Array(SEGMENTS);
		const rightPile = new Float32Array(SEGMENTS);
		const leftTarget = new Float32Array(SEGMENTS);
		const rightTarget = new Float32Array(SEGMENTS);

		let pileWidth = 0;
		let maxPileH = 0;

		const updatePileTargets = () => {
			pileWidth = Math.min(width * 0.28, 380);
			maxPileH = Math.min(height * 0.16, 125);

			for (let i = 0; i < SEGMENTS; i++) {
				const t = i / (SEGMENTS - 1); // 0 at outer corner, 1 at inner ground
				// Natural snowdrift curve: high at edge, organic slope inward
				const shape = Math.pow(1 - t, 1.45) * (1 + 0.12 * Math.sin(t * Math.PI * 3.2));
				leftTarget[i] = Math.max(0, maxPileH * shape);
				rightTarget[i] = Math.max(0, maxPileH * shape);
			}
		};

		const initParticles = () => {
			particles.length = 0;
			const count = isMobile ? 15 : 42;
			for (let i = 0; i < count; i++) {
				particles.push({
					x: Math.random() * width,
					// Scatter initially across full screen height on load
					y: Math.random() * height,
					r: 1.6 + Math.random() * 2.4,
					vy: 1.2 + Math.random() * 1.8,
					drift: (Math.random() - 0.5) * 0.8,
					wobble: Math.random() * Math.PI * 2,
					wobbleSpeed: 0.02 + Math.random() * 0.03,
					opacity: 0.65 + Math.random() * 0.35
				});
			}
		};

		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			isMobile = width <= 768;

			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			updatePileTargets();
			if (particles.length === 0) {
				initParticles();
			} else {
				// Adjust count if mobile toggled
				const targetCount = isMobile ? 15 : 38;
				while (particles.length > targetCount) particles.pop();
				while (particles.length < targetCount) {
					particles.push({
						x: Math.random() * width,
						y: -20 - Math.random() * 50,
						r: 1.6 + Math.random() * 2.4,
						vy: 1.1 + Math.random() * 1.6,
						drift: (Math.random() - 0.5) * 0.8,
						wobble: Math.random() * Math.PI * 2,
						wobbleSpeed: 0.02 + Math.random() * 0.03,
						opacity: 0.65 + Math.random() * 0.35
					});
				}
			}
		};

		resize();
		window.addEventListener('resize', resize, { passive: true });

		const triggerSparkle = (x: number, y: number, r: number) => {
			for (let i = 0; i < sparkles.length; i++) {
				if (sparkles[i].life <= 0) {
					sparkles[i].x = x;
					sparkles[i].y = y;
					sparkles[i].life = 0.45;
					sparkles[i].maxLife = 0.45;
					sparkles[i].size = r * 1.4;
					break;
				}
			}
		};

		let lastTime = performance.now();

		const drawPile = (
			heights: Float32Array,
			startX: number,
			direction: 1 | -1, // 1 for left pile, -1 for right pile
			pWidth: number
		) => {
			const segW = pWidth / (SEGMENTS - 1);
			const baseCornerX = direction === 1 ? 0 : width;
			const innerEndX = direction === 1 ? pWidth : width - pWidth;

			// Back shadow drift (subtle depth)
			ctx.beginPath();
			ctx.moveTo(baseCornerX, height);
			ctx.lineTo(baseCornerX, height - heights[0] * 1.05);
			for (let i = 1; i < SEGMENTS; i++) {
				const prevX = baseCornerX + direction * (i - 1) * segW;
				const prevY = height - heights[i - 1] * 1.05;
				const currX = baseCornerX + direction * i * segW;
				const currY = height - heights[i] * 1.05;
				const midX = (prevX + currX) / 2;
				const midY = (prevY + currY) / 2;
				ctx.quadraticCurveTo(prevX, prevY, midX, midY);
			}
			ctx.lineTo(innerEndX, height);
			ctx.closePath();
			ctx.fillStyle = isDark ? 'rgba(38, 52, 70, 0.45)' : 'rgba(182, 205, 226, 0.35)';
			ctx.fill();

			// Main snow body
			ctx.beginPath();
			ctx.moveTo(baseCornerX, height);
			ctx.lineTo(baseCornerX, height - heights[0]);
			for (let i = 1; i < SEGMENTS; i++) {
				const prevX = baseCornerX + direction * (i - 1) * segW;
				const prevY = height - heights[i - 1];
				const currX = baseCornerX + direction * i * segW;
				const currY = height - heights[i];
				const midX = (prevX + currX) / 2;
				const midY = (prevY + currY) / 2;
				ctx.quadraticCurveTo(prevX, prevY, midX, midY);
			}
			ctx.lineTo(innerEndX, height);
			ctx.closePath();

			const grad = ctx.createLinearGradient(0, height - maxPileH, 0, height);
			if (isDark) {
				grad.addColorStop(0, '#dbe8f8');
				grad.addColorStop(0.35, '#85a3c2');
				grad.addColorStop(1, '#253242');
			} else {
				grad.addColorStop(0, '#ffffff');
				grad.addColorStop(0.4, '#eef5fc');
				grad.addColorStop(1, '#d5e5f3');
			}
			ctx.fillStyle = grad;
			ctx.fill();

			// Soft crest contour
			ctx.strokeStyle = isDark ? '#476280' : '#b8cde2';
			ctx.lineWidth = 1;
			ctx.stroke();

			// Fluffy highlight caps on high crests
			if (heights[0] > 18) {
				ctx.fillStyle = isDark ? 'rgba(235, 245, 255, 0.65)' : 'rgba(255, 255, 255, 0.85)';
				const capCount = 3;
				for (let c = 0; c < capCount; c++) {
					const idx = Math.floor(c * (SEGMENTS * 0.28) + 2);
					if (idx < SEGMENTS && heights[idx] > 12) {
						const cx = baseCornerX + direction * idx * segW;
						const cy = height - heights[idx] + 2;
						ctx.beginPath();
						ctx.ellipse(cx, cy, 14 - c * 2, 4, 0, 0, Math.PI * 2);
						ctx.fill();
					}
				}
			}
		};

		const loop = (now: number) => {
			const dt = Math.min((now - lastTime) / 1000, 0.1);
			lastTime = now;

			if (!pageHidden) {
				ctx.clearRect(0, 0, width, height);

				// 1. On Desktop: Draw the 2 snow piles if any snow has accumulated
				if (!isMobile) {
					let maxLeft = 0;
					let maxRight = 0;
					for (let i = 0; i < SEGMENTS; i++) {
						if (leftPile[i] > maxLeft) maxLeft = leftPile[i];
						if (rightPile[i] > maxRight) maxRight = rightPile[i];
					}
					if (maxLeft > 0.5) drawPile(leftPile, 0, 1, pileWidth);
					if (maxRight > 0.5) drawPile(rightPile, width, -1, pileWidth);
				}

				// 2. Update and draw falling snowflakes (batched for max 60fps performance)
				ctx.beginPath();
				const snowflakeColor = isDark ? 'rgba(238, 245, 255, 0.85)' : 'rgba(177, 189, 196, 0.85)';

				for (let i = 0; i < particles.length; i++) {
					const p = particles[i];
					p.y += p.vy;
					p.wobble += p.wobbleSpeed;
					p.x += Math.sin(p.wobble) * 0.6 + p.drift * 0.3;

					// Check landing on desktop corner piles
					if (!isMobile) {
						// Left corner check
						if (p.x >= 0 && p.x <= pileWidth) {
							const segIdx = Math.min(
								SEGMENTS - 1,
								Math.max(0, Math.floor((p.x / pileWidth) * (SEGMENTS - 1)))
							);
							const groundY = height - leftPile[segIdx];
							if (p.y >= groundY) {
								// Particle hits pile! Accumulate height smoothly via Gaussian spread
								const add = p.r * 3.6;
								for (let j = Math.max(0, segIdx - 3); j <= Math.min(SEGMENTS - 1, segIdx + 3); j++) {
									const dist = Math.abs(j - segIdx);
									const weight = Math.exp(-dist * 0.7);
									leftPile[j] = Math.min(leftTarget[j], leftPile[j] + add * weight);
								}
								if (segIdx < 8) {
									leftPile[0] = Math.min(leftTarget[0], leftPile[0] + add * 0.4);
									leftPile[1] = Math.min(leftTarget[1], leftPile[1] + add * 0.35);
								}
								triggerSparkle(p.x, groundY, p.r);
								// Recycle particle back to top
								p.y = -10 - Math.random() * 30;
								p.x = Math.random() * width;
								continue;
							}
						} else if (p.x >= width - pileWidth && p.x <= width) {
							// Right corner check
							const segIdx = Math.min(
								SEGMENTS - 1,
								Math.max(0, Math.floor(((width - p.x) / pileWidth) * (SEGMENTS - 1)))
							);
							const groundY = height - rightPile[segIdx];
							if (p.y >= groundY) {
								// Particle hits pile!
								const add = p.r * 3.6;
								for (let j = Math.max(0, segIdx - 3); j <= Math.min(SEGMENTS - 1, segIdx + 3); j++) {
									const dist = Math.abs(j - segIdx);
									const weight = Math.exp(-dist * 0.7);
									rightPile[j] = Math.min(rightTarget[j], rightPile[j] + add * weight);
								}
								if (segIdx < 8) {
									rightPile[0] = Math.min(rightTarget[0], rightPile[0] + add * 0.4);
									rightPile[1] = Math.min(rightTarget[1], rightPile[1] + add * 0.35);
								}
								triggerSparkle(p.x, groundY, p.r);
								p.y = -10 - Math.random() * 30;
								p.x = Math.random() * width;
								continue;
							}
						}
					}

					// Recycle when passing bottom screen
					if (p.y > height + 10) {
						p.y = -10 - Math.random() * 20;
						p.x = Math.random() * width;
					}

					// Batch particle circle
					if (p.y >= -5) {
						ctx.moveTo(p.x + p.r, p.y);
						ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
					}
				}

				ctx.fillStyle = snowflakeColor;
				ctx.fill();

				// 3. Draw landing sparkles
				if (!isMobile) {
					for (let i = 0; i < sparkles.length; i++) {
						const sp = sparkles[i];
						if (sp.life > 0) {
							sp.life -= dt;
							const alpha = Math.max(0, sp.life / sp.maxLife);
							ctx.fillStyle = isDark
								? `rgba(225, 240, 255, ${alpha * 0.8})`
								: `rgba(130, 175, 215, ${alpha * 0.7})`;
							ctx.beginPath();
							ctx.arc(sp.x, sp.y, sp.size * (1.2 - alpha * 0.4), 0, Math.PI * 2);
							ctx.fill();
						}
					}
				}
			}

			animId = requestAnimationFrame(loop);
		};

		animId = requestAnimationFrame(loop);

		return () => {
			if (animId) cancelAnimationFrame(animId);
			observer.disconnect();
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="christmas-snow-canvas" aria-hidden="true"></canvas>

<style>
	.christmas-snow-canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		pointer-events: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.christmas-snow-canvas {
			display: none;
		}
	}
</style>
