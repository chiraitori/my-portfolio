<svg class="filter-definitions" width="0" height="0" aria-hidden="true">
	<filter id="rough">
		<feTurbulence
			type="fractalNoise"
			baseFrequency="0.035"
			numOctaves="2"
			seed="8"
			result="noise"
		/>
		<feDisplacementMap
			in="SourceGraphic"
			in2="noise"
			scale="2.8"
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
</svg>

<style>
	.filter-definitions {
		position: absolute;
		pointer-events: none;
	}
</style>
