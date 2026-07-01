<script lang="ts">
	interface Props {
		values: number[];
		color: string;
		gradientId: string;
	}

	let { values, color, gradientId }: Props = $props();

	const width = 100;
	const height = 40;
	const padding = 3;

	let points = $derived.by(() => {
		const data = values.length > 1 ? values : [0, 0];
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min;

		return data.map((value, index) => ({
			x: (index / (data.length - 1)) * width,
			y: range === 0 ? height / 2 : padding + ((max - value) / range) * (height - padding * 2)
		}));
	});

	let linePath = $derived.by(() => {
		if (points.length < 2) return '';

		return points.reduce((path, point, index) => {
			if (index === 0) return `M ${point.x} ${point.y}`;

			const previous = points[index - 1];
			const controlX = (previous.x + point.x) / 2;
			return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
		}, '');
	});

	let areaPath = $derived(`${linePath} L ${width} ${height} L 0 ${height} Z`);
	let lastPoint = $derived(points.at(-1) ?? { x: width, y: height / 2 });
</script>

<svg class="h-10 w-20 shrink-0 overflow-visible" viewBox="0 0 100 40" aria-hidden="true">
	<defs>
		<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color={color} stop-opacity="0.28" />
			<stop offset="100%" stop-color={color} stop-opacity="0" />
		</linearGradient>
	</defs>
	<path d={areaPath} fill={`url(#${gradientId})`} />
	<path
		d={linePath}
		fill="none"
		stroke={color}
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<circle cx={lastPoint.x} cy={lastPoint.y} r="3" fill={color} />
</svg>
