import { init as initChordChart, highlight as highlightChord } from './chord.js'
import { updateData as updateWorldMap } from './world-map.js'
import { update as updateLine } from './line.js'

let projection = d3.geoMercator()
.center([9.55, 46.0])
.scale(1800)

let path = d3.geoPath().projection(projection)

// console.log('hi', projection, path)

let width = 500, height = 455

let svg = d3.select('#france')
.append('svg')
.attr('height', height)
.attr('width', width)
// .style('border', 'solid 1px #000')

let tooltip = d3.select('#france').append('div')
.attr('id', 'tooltip')
.html(`机场名称: <br>所属国家: <br>起飞航线: <br>降落航线: `)

let points


/*svg.append('text')
.attr('id', 'apt-name')
.attr('transform', 'translate(10,20)')
.style('text-anchor', 'start')
.style('font-size', 14)
.text('机场：')*/


function loadData() {
	d3.json('./data/France.json').then(map => {
	    //console.log(map);

	    svg.append('g')//.attr('transform', `translate(${width/2}, ${height/2})`)
	    .attr('class', 'map')
	    .selectAll('path')
	    .data(map.features)
	    .enter()
	    .append('path')
	    .attr('d', path)
	    .attr('fill', 'none')
	    .style('stroke', '#999')
	    .style('stroke-width', 0.5)

	    d3.csv('./data/apt.csv').then(docs => {
	    	points = docs
	        // console.log('points', points)

	        for (let i of points) {
	        	if (i['count_dep'] == '(null)') {
	        		i['count_dep'] = 0
	        	}
	        	if (i['count_arr'] == '(null)') {
	        		i['count_arr'] = 0
	        	}

	        	if (i['AVG_RETARD_D'] == '(null)') {
	        		i['AVG_RETARD_D'] = 0
	        	}
	        	if (i['AVG_RETARD_A'] == '(null)') {
	        		i['AVG_RETARD_A'] = 0
	        	}
	        }

	        // d3.csv('./data/flight.csv').then(flights => {
	        	initFranceMap('flight', points)

	        	// initWorldMap()
	        	initChordChart(points)
	        // })
	    })
	})
}

function initFranceMap(type, data) {
	// data = data.filter(d => d['ZON'] == 'I')
	console.log('data', data)

	let pinkArc, blueArc
	if (type == 'flight') {
		blueArc = 'count_dep'
		pinkArc = 'count_arr'
	} else if (type == 'retard') {
		blueArc = 'AVG_RETARD_D'
		pinkArc = 'AVG_RETARD_A'
	}


    let rScale = d3.scaleLinear()
    .domain([1, d3.max(data, d => +d[blueArc] + (+d[pinkArc]))])
    .range([4, 20])

    let groups = svg
    .selectAll('.point')
    .data([1])
    .join('g')
    .attr('class', 'point')
    .selectAll('.points')
    .data(data)
    .join('g')
    .attr('transform', d => `translate(${projection([d['APT_LONG'], d['APT_LAT']]).toString()})`)
    .attr('class', 'points')
    
    groups.selectAll('.arc-paths')
    .data(d => {
        let pieData = d3.pie().sort(null)([+d[blueArc], +d[pinkArc]])

        // console.log('pieData', pieData)

        for (let item of pieData) {
            item.outerRadius = (+d[blueArc] + (+d[pinkArc]) == 0) ? 0 : rScale(+d[blueArc] + (+d[pinkArc]))
        }

        return pieData
    })
    .join('path')
    .attr('class', 'arc-paths')
    .style('fill', (d,i) => i == 0 ? '#709bd1' : '#d376ac')
    .on('mouseover', function(e,d) {
    	d3.selectAll('.arc-paths').style('fill', (d,i) => i%2 == 0 ? '#c9dff2' : '#eecddf')

    	d3.select(this).style('fill', d.index == 0 ? '#709bd1' : '#d376ac')
    	.attr('d', d3.arc().innerRadius(0).outerRadius(d.outerRadius+2)(d))
    })
    .on('mouseout', function(e,d) {
    	d3.selectAll('.arc-paths').style('fill', (d,i) => i%2 == 0 ? '#709bd1' : '#d376ac')

    	d3.select(this).attr('d', d3.arc().innerRadius(0).outerRadius(d.outerRadius)(d))
    })
    .on('click', function(e, d) {
    	let datum = d3.select(e.target.parentNode).datum()

		let apt = datum['APT_OACI']

		let depOrArr = d3.select(e.target).datum().index == 0 ? 'dep' : 'arr'

		// console.log('click', d3.select(e.target).datum())

    	updateAptName(datum)

	    updateWorldMap(apt, depOrArr)

	    highlightChord(apt)

	    updateLine(apt, depOrArr)
    })
    // .transition()
    .attr('d', d => {
        return d3.arc().innerRadius(0).outerRadius(d.outerRadius)(d)
    })
}

function updateAptName(info) {
	// console.log(aptInfo)

	tooltip.html(`机场名称: ${info['APT_NOM']}<br>所属国家: ${info['APT_ISO2']}<br>起飞航线: ${info['count_dep']}<br>降落航线: ${info['count_arr']}`)
}

function updateFranceMap() {
    console.log('radio', this.value)
    initFranceMap(this.value, points)
}

function highlight() {}

loadData()

// click()

export { updateFranceMap }