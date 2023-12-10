import Geohash from 'latlon-geohash'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the MapContainer component with SSR disabled
const MapContainer = dynamic(
	() => import('react-leaflet').then((mod) => mod.MapContainer),
	{ ssr: false },
)
const TileLayer = dynamic(
	() => import('react-leaflet').then((mod) => mod.TileLayer),
	{ ssr: false },
)
const Marker = dynamic(
	() => import('react-leaflet').then((mod) => mod.Marker),
	{ ssr: false },
)
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
	ssr: false,
})

interface Location {
	lat: number
	lon: number
}

function Map() {
	const [location, setLocation] = useState<Location | null>(null)

	const convertGeohash = () => {
		const geohash = 'tdr3814779p6'
		const decodedLocation: Geohash.Point = Geohash.decode(geohash)
		setLocation({ lat: decodedLocation.lat, lon: decodedLocation.lon })
	}

	return (
		<div>
			<button onClick={convertGeohash}>Convert Geohash</button>
			{typeof window !== 'undefined' && (
				<MapContainer
					style={{
						width: '600px',
						height: '400px',
						margin: '1rem auto',
						position: 'relative',
					}}
					center={[47.0519926878143, 6.201351588162976]}
					zoom={4}
				>
					<TileLayer
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					{location && (
						<Marker position={[location.lat, location.lon]}>
							<Popup>
								Latitude: {location.lat}
								<br />
								Longitude: {location.lon}
							</Popup>
						</Marker>
					)}
				</MapContainer>
			)}
		</div>
	)
}

export default Map
