let margin = { left: 25, right: 25, top: 10, bottom: 10 }

let height = 30, width = 500

let svg = d3.select('#chord')
.append('svg')
.attr('height', height)
.attr('width', margin.left + width + margin.right)
.append('g')
.attr('transform', `translate(0, ${margin.top})`)

function init(data) {
	console.log('chord', data)

	let timeParse = d3.timeParse('%Y%m')
	// console.log('ym', timeParse('200109'))

	let minTime = d3.min(data, d => timeParse(d['min_anmois']))
	let maxTime = d3.max(data, d => timeParse(d['max_anmois']))

	let timeScale = d3.scaleLinear()
	.domain([minTime, maxTime])
	.range([margin.left, margin.left + width])
	console.log([minTime, maxTime])

	let backLine = svg.append('line')
	.attr('x1', margin.left)
	.attr('x2', margin.left + width)
	.attr('class', 'back-line')

	let startText = svg.append('text')
	.attr('x', margin.left)
	.attr('y', 18)
	.attr('class', 'text')
	.text('199001')

	let endText = svg.append('text')
	.attr('x', margin.left + width)
	.attr('y', 18)
	.attr('class', 'text')
	.text('201803')

	let groups = svg.selectAll('.line-group')
	.data(data)
	.join('g')
	.attr('class', 'line-group')
	.style('visibility', 'hidden')

	groups.selectAll('.left-point')
	.data(d => [d])
	.join('circle')
	.attr('cx', d => timeScale(timeParse(d['min_anmois'])))
	.attr('r', 3)
	.attr('class', 'left-point')

	groups.selectAll('.right-point')
	.data(d => [d])
	.join('circle')
	.attr('cx', d => timeScale(timeParse(d['max_anmois'])))
	.attr('r', 3)
	.attr('class', 'right-point')

	groups.selectAll('.left-text')
	.data(d => [d])
	.join('text')
	.attr('x', d => timeScale(timeParse(d['min_anmois'])))
	.attr('y', 18)
	.attr('class', 'left-text')
	.text(d => d['min_anmois'])

	groups.selectAll('.right-text')
	.data(d => [d])
	.join('text')
	.attr('x', d => timeScale(timeParse(d['max_anmois'])))
	.attr('y', 18)
	.attr('class', 'right-text')
	.text(d => d['max_anmois'])

	groups.selectAll('.link')
	.data(d => [d])
	.join('line')
	.attr('x1', d => timeScale(timeParse(d['min_anmois'])))
	.attr('x2', d => timeScale(timeParse(d['max_anmois'])))
	.attr('class', 'link')
}

function highlight(apt) {
	svg.selectAll('.line-group')
	.style('visibility', d => d['APT_OACI'] == apt ? 'visible' : 'hidden')
}

/*function init(data) {
	// console.log('chord', data)

	let timeParse = d3.timeParse('%Y%m')
	// console.log('ym', timeParse('200109'))

	let minTime = d3.min(data, d => timeParse(d['min_anmois']))
	let maxTime = d3.max(data, d => timeParse(d['max_anmois']))

	let timeScale = d3.scaleLinear()
	.domain([minTime, maxTime])
	.range([margin.left, margin.left + width])

	// console.log('test', [minTime, maxTime], [margin.left, margin.left + width])

	// let arc = d3.arc().innerRadius(radius).outerRadius(radius+1)

	let pieData = data.map(d => {
		let item = {}

		item.data = d

		// item.index = 

		item.startAngle = -Math.PI/2
		item.endAngle = Math.PI/2
		item.padAngle = 0

		return item
	})

	svg.selectAll('.chords')
	.data(pieData)
	.join('path')
	.attr('d', d => {

		let radius = (timeScale(timeParse(d.data['max_anmois'])) - timeScale(timeParse(d.data['min_anmois']))) / 2

		// console.log('d', d.data['max_anmois'], d.data['min_anmois'], timeScale(timeParse(d.data['max_anmois'])), timeScale(timeParse(d.data['min_anmois'])))
		
		return d3.arc().innerRadius(0).outerRadius(radius)(d)
	})
	.attr('class', 'chords')
	.attr('transform', d => {
		// console.log('===', ( timeParse(d.data['max_anmois']) + timeParse(d.data['min_anmois']) ) )
		return `translate(${
			(timeScale(timeParse(d.data['max_anmois'])) + timeScale(timeParse(d.data['min_anmois'])) ) / 2
		}, ${ margin.top + height })`
	})
	.on('mouseover', function() {
		d3.select(this)
		.style('stroke', 'orange')
		.style('stroke-width', 1)
	})
	.on('mouseout', function() {
		d3.select(this)
		.style('stroke', 'black')
		.style('stroke-width', 0.2)
	})
	.on('click', function(e, d) {
		console.log('click', d.data['APT_OACI'])
	})
}

function highlight(apt_name) {
	svg.selectAll('.active-chords').attr('class', 'chords')

	svg.selectAll('.chords')
	.filter(d => d.data['APT_OACI'] == apt_name)
	.raise()
	.attr('class', 'active-chords')
}*/

export { init, highlight }

