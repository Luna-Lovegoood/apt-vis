// import

let colorDim = 'avg_retard_d'

let strokeWidthDim = 'avg_pax_fs'

let paxChecked = false

let retChecked = false

let relatedFlights, flights

let depOrArr

function changeLineColor() {
    console.log('radio', this.value)
    colorDim = this.value

    render()
}

function showPax() {
    console.log('chk-pax', this.checked)

    paxChecked = this.checked

    render()
}

function showRet() {
    console.log('chk-ret', this.checked)
}

let globe_projection = d3.geoMercator()
.center([35, 46.86])
.scale(600)

let path = d3.geoPath().projection(globe_projection)

// console.log('hi', projection, path)

let width = 600, height = 450

let svg = d3.select('#world')
.append('svg')
.attr('height', height)
.attr('width', '100%')
// .style('border', 'solid 1px #999')
// .style('border-radius', 5)

function init() {
    d3.json('../../data/world.json').then(map => {
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

        svg.append('g')
        .attr('class', 'g-line')

        d3.csv('./data/flight.csv').then(data => {
            flights = data
            // updateData('dep', flights)
        })
    })
}

function updateData(apt, depOrArr) {
    relatedFlights = flights.filter(d => d[depOrArr] == apt)

    // console.log('filteredFlights', depOrArr, relatedFlights)

    if (depOrArr == 'dep') {
        colorDim = 'avg_retard_d'
    } else {
        colorDim = 'avg_retard_a'
    }

    render()
}

function render() {
    let filterData = relatedFlights

    if (paxChecked) {
        relatedFlights.sort((a,b) => {
            return b['avg_pax_fs'] - a['avg_pax_fs']
        })

        filterData = relatedFlights.slice(0, 10)
    }
    // console.log('////', filterData)

    let array = filterData.map(f => {
        // console.log('data', f)

        let posDep = globe_projection([ f['dep_apt_long'], f['dep_apt_lat'] ])
        let posArr = globe_projection([ f['arr_apt_long'], f['arr_apt_lat'] ])
        // console.log('==', globe_projection, f, f['dep_apt_long'], f['dep_apt_lat'], posDep, posArr)

        let pos = [posDep, posArr]

        pos.srcData = f

        return pos
    })
    // console.log('array', array)

    let widthScale = d3.scaleLinear()
    .domain(d3.extent(relatedFlights, d => +d[strokeWidthDim]))
    .range([0.3, 3])

    let opacityScale = d3.scaleLinear()
    .domain([0, d3.max(relatedFlights, d => +d[colorDim])])
    .range([0, 1])
    // console.log('sss', widthScale, colorScale)

    let colorScale = d3.scaleLinear()
    .domain(d3.extent(relatedFlights, d => +d[colorDim]))
    .range([0.5, 0])

    let newColorScale = d3.scaleOrdinal()
    .domain()

    d3.select('#world').select('svg')
    .select('.g-line')
    .selectAll('.lines')
    .data(array)
    .join('path')
    .attr('d', d3.line().x(d => d[0]).y(d => d[1]))
    .attr('class', 'lines')
    .style('stroke-width', d => widthScale(d.srcData[strokeWidthDim]))
    .style('stroke', d => {
        let value = d.srcData[colorDim]

        if (value == '(null)' || value == 0) {
            return '#a9d497'
        } else {
            return d3.interpolateRdYlGn(colorScale(value))  // interpolateSpectral
        }

        // return d3.schemeSpectral[colorScale(d[colorDim])]
    })
    // .style('opacity', d => opacityScale(d.srcData[colorDim]))
    .on('click', function(e,d) {
        console.log('click', d)
    })
}

init()

export { updateData, changeLineColor, showPax, showRet }