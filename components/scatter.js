import { update as updateLine } from './line.js'

function init() {
	d3.csv('./data/apt.csv').then(data => {
		
		const depOrArr = 'arr', radius = 'AVG_RETARD_A'

		const xAxis = 'APT_LONG', yAxis = 'APT_LAT'

		data = data.filter(d => d['dep'] != '(null)' && d['arr'] != '(null)')
		// console.log('data', data)

		const margin = { top: 50, right: 50, bottom: 50, left: 50 }

		const height = 400, width = 400

		let svg = d3.select('#scatter')
		.append('svg')
		.attr('height', margin.top + height + margin.bottom)
		.attr('width', margin.left + width + margin.right)
		.style('border',  'red 1px solid')

		let xScale = d3.scaleLinear()
		.domain(d3.extent(data, d => +d[xAxis]))
		.range([margin.left, margin.left + width])

		let yScale = d3.scaleLinear()
		.domain(d3.extent(data, d => +d[yAxis]))
		.range([margin.top + height, margin.top])

		let rScale = d3.scaleLinear()
		.domain(d3.extent(data, d => +d[radius]))
		.range([2, 20])

		svg.selectAll('circle')
		.data(data)
		.join('circle')
		.attr('cx', d => xScale(d[xAxis]))
		.attr('cy', d => yScale(d[yAxis]))
		.attr('r', d => rScale(d[radius]))
		.attr('class', 'circles')
		.on('click', function(e,d) {
			console.log(d)

			updateLine(depOrArr , d['APT_OACI'])
		})
	})
}

init()

export { init }