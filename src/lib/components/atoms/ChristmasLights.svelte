<svg class="christmas-lights" width="100%" height="38" aria-hidden="true">
	<defs>
		<pattern id="christmas-light-strand" width="240" height="38" patternUnits="userSpaceOnUse">
			<path
				d="M0 3 Q60 30 120 3 Q180 30 240 3"
				fill="none"
				stroke="var(--festive-green)"
				stroke-width="1.4"
			/>
			<g stroke="var(--festive-green)" stroke-width="1.5">
				<path d="M25 12v5m35-1v7m35-11v5m50-5v5m35-1v7m35-11v5" />
			</g>
			<g stroke="var(--surface)" stroke-width="1">
				<ellipse cx="25" cy="23" rx="4" ry="6" fill="var(--festive-red)" />
				<ellipse cx="60" cy="29" rx="4" ry="6" fill="var(--festive-gold)" />
				<ellipse cx="95" cy="23" rx="4" ry="6" fill="var(--festive-green)" />
				<ellipse cx="145" cy="23" rx="4" ry="6" fill="var(--festive-gold)" />
				<ellipse cx="180" cy="29" rx="4" ry="6" fill="var(--festive-red)" />
				<ellipse cx="215" cy="23" rx="4" ry="6" fill="var(--festive-green)" />
			</g>
		</pattern>
	</defs>
	<rect width="100%" height="38" fill="url(#christmas-light-strand)" />
</svg>

<style>
	.christmas-lights {
		position: absolute;
		top: calc(100% - 3px);
		left: 0;
		pointer-events: none;
		overflow: visible;
	}
</style>
