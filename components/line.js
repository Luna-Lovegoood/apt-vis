function update(apt, type) {
	queryData(apt, type)
}

function queryData(apt, type) {
	fetch(`http://localhost:3000/query?type=${type}&apt=${apt}`)
	.then(res => res.json())
	.then(data => {
		// console.log('hi', data)

		updateLine(data, type)
	})
}

const margin = { top: 50, right: 50, bottom: 50, left: 50 }

const height = 400, width = 400

let svg = d3.select('#line')
.append('svg')
.attr('height', margin.top + height + margin.bottom)
.attr('width', margin.left + width + margin.right)
.style('border',  'red 1px solid')

let timeParse = d3.timeParse('%Y%m')
// console.log('ym', timeParse('200109'))



function updateLine(data, type) {
	const yAxis = type == 'dep' ? 'RETARD_D' : 'RETARD_A'
	// const yAxis = 'pax_fs' // nvols

	const anmois = 'ANMOIS', dep = 'DEP'

	data.sort((a,b) => a[anmois] - b[anmois])

	let groupData = d3.groups(data, d => d[dep])
	// console.log('groupData', groupData)

	let xScale = d3.scaleTime()
	.domain([timeParse('201201'), timeParse('201803')])
	// .domain(d3.extent(data, d => timeParse(d[anmois])))
	.range([margin.left, margin.left + width])

	let yScale = d3.scaleLinear()
	// .domain([0, 365.2]) // arr 654
	.domain(d3.extent(data, d => +d[yAxis]))
	.range([margin.top + height, margin.top])

	let lineFunc = d3.line()
	.x(d => xScale(timeParse(d[anmois])))
	.y(d => yScale(d[yAxis]))

	svg.selectAll('.polylines')
	.data(groupData.map(d => d[1]))
	.join('path')
	.attr('d', lineFunc)
	.attr('class', 'polylines')
	.style('stroke', (d,i) => {
		// console.log(i, d)
		return d3.schemeSet1[i]
	})
	.on('click', function(e,d) {
		console.log(d)
	})

	svg.append('g')
	.attr('transform', `translate(0, ${margin.top+height})`)
	.call(d3.axisBottom().scale(xScale).ticks(5))
}



export { update }