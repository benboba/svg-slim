declare module 'svg-path-contours' {
	function contours(arr: [string, ...number[]][]): Array<[number, number][]>;
	export = contours;
}

declare module 'triangulate-contours' {
	function triangulate(arr: Array<[number, number][]>): {
		positions: [number, number][];
		cells: [number, number, number][];
	};
	export = triangulate;
}
