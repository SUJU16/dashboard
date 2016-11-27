import geolib from 'geolib'
//let geolib = require('geolib')

const testData = {"stops":[{"date":{"start":1480198849.3636363,"end":1480199107.3636363},"points":[[60.172372,24.957457],[60.172356,24.956657],[60.172352,24.956476],[60.17227,24.956486],[60.171725,24.956551],[60.171648,24.956562],[60.171593,24.95657],[60.171269,24.956611],[60.171207,24.956619],[60.171016,24.956643],[60.17094,24.956652],[60.17086,24.956658],[60.170221,24.956728],[60.170146,24.956735],[60.170074,24.956742],[60.170013,24.956748],[60.169961,24.956753],[60.169726,24.956781],[60.169477,24.956812],[60.16927,24.956838],[60.169181,24.956846],[60.16909,24.956849],[60.168785,24.956885],[60.168712,24.956914],[60.168649,24.956965],[60.168593,24.957072],[60.168567,24.957151],[60.168485,24.957453],[60.168446,24.957604],[60.168424,24.95772],[60.168402,24.957815],[60.168366,24.957923],[60.168308,24.958098],[60.168245,24.958295],[60.168136,24.958624],[60.167817,24.959561],[60.167759,24.959751],[60.167709,24.959923],[60.16766,24.960129],[60.167613,24.960292],[60.167304,24.96121],[60.167269,24.961314],[60.167241,24.9614],[60.167182,24.961518],[60.167124,24.961636],[60.167053,24.96184],[60.166818,24.962499],[60.166531,24.96335],[60.166481,24.963505],[60.166445,24.963611],[60.166406,24.963728],[60.166346,24.963908],[60.16622,24.964289],[60.166156,24.96448],[60.166114,24.964607],[60.166087,24.964688],[60.166027,24.964867],[60.165972,24.965034],[60.165887,24.965291],[60.165747,24.965711],[60.16568,24.965913],[60.165759,24.966025],[60.165938,24.966265],[60.166141,24.966542],[60.166178,24.966592],[60.166129,24.966769],[60.166098,24.966863],[60.165796,24.967778],[60.165731,24.967974],[60.165662,24.968181]],"distance":1236}]}

export function pointInPath(t, route) {
	for(let i = 0; i < route.stops.length; i++) {
		let stop = route.stops[i]

		if (stop.date.start <= t && t < stop.date.end) {
			let distanceInPercent = (1 - (stop.date.end - t)/(stop.date.end - stop.date.start))
			let s = stop.distance * distanceInPercent

			let total = 0
			for (let j = 1; j < stop.points.length; j++) {
				let length = geolib.getDistance(
					{
						latitude: stop.points[j - 1][0],
						longitude: stop.points[j - 1][1]
					},
					{
						latitude: stop.points[j][0],
						longitude: stop.points[j][1]
					}, 10)

				if (total + length >= s) {
					let f = total + length - s

					return [
						stop.points[j-1][0] + ( stop.points[j][0] - stop.points[j-1][0] ) * ( f/length ), 
						stop.points[j-1][1] + ( stop.points[j][1] - stop.points[j-1][1] ) * ( f/length ), 
					]
				}

				total = total + length
			}
		}
	}
}

/*for (let i = 1480198849; i <= 1480199108; i = i + 10) {
	let a = pointInPath(i, testData)
	console.log(a)
}*/