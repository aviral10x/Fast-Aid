import { Inter } from 'next/font/google'
import {
	useLocalAudio,
	useLocalPeer,
	useLocalVideo,
	usePeerIds,
	useRoom,
} from '@huddle01/react/hooks'
import { useEffect, useRef } from 'react'
import React, { useState } from 'react'
import RemotePeer from '@/components/RemotePeer'
import { AccessToken, Role } from '@huddle01/server-sdk/auth'
import { Recorder } from '@huddle01/server-sdk/recorder'
import Map from '@/components/Map'
import Link from 'next/link'
// import { ConnectButton } from '@rainbow-me/rainbowkit'

// components/RecordingControls.js

const inter = Inter({ subsets: ['latin'] })

interface Recording {
	id: string
	url: string
	size: number // Assuming size is a number representing bytes
}

type Props = {
	token: string
}
type LocationState = {
	latitude: number | null
	longitude: number | null
}

export default function Home({ token }: Props) {
	const { joinRoom, state } = useRoom({
		onJoin: (room) => {
			console.log('onJoin', room)
		},
		onPeerJoin: (peer) => {
			console.log('onPeerJoin', peer)
		},
	})

	const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo()
	const { enableAudio, isAudioOn, stream: audioStream } = useLocalAudio()
	const [location, setLocation] = useState<LocationState>({
		latitude: null,
		longitude: null,
	})

	const [error, setError] = useState('')

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					})
					setError('')
				},
				(err) => {
					setError(err.message)
				},
			)
		} else {
			setError('Geolocation is not supported by this browser.')
		}
	}

	const [roomId, setRoomId] = useState('')
	// const [token, setToken] = useState('')
	const [rtmpUrls, setRtmpUrls] = useState([])

	const handleStartRecording = async () => {
		await fetch('/api/recorder', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				action: 'startRecording',
				roomId,
				token,
			}),
		})
	}

	const handleStartLivestream = async () => {
		await fetch('/api/recorder', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				action: 'startLivestream',
				roomId,
				token,
				rtmpUrls,
			}),
		})
	}

	const handleStop = async () => {
		await fetch('/api/recorder', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				action: 'stop',
				roomId,
			}),
		})
	}

	async function getRecordings() {
		const API_KEY = 'zMQHa6hH5hGrxfwYZp7z8I-1lWScI7UA' // Replace with your actual API key

		try {
			const response = await fetch(
				'https://api.huddle01.com/api/v1/get-recordings',
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						'x-api-key': API_KEY,
					},
				},
			)

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`)
			}

			const data = await response.json()
			console.log(data)
			return data
		} catch (error) {
			console.error('Error fetching recordings:', error)
		}
	}

	const [recordings, setRecordings] = useState([])

	const handleStopAndFetchRecordings = async () => {
		await handleStop() // Assuming this is your function to stop the recording
		const fetchedRecordings = await getRecordings()
		setRecordings(fetchedRecordings)
	}

	const { peerIds } = usePeerIds()

	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (stream && videoRef.current) {
			videoRef.current.srcObject = stream
		}
	}, [stream])

	console.log({ audioStream, isAudioOn })

	console.log({ peerIds })

	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
				<p className='fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
					<code className='font-mono font-bold'>Fast Aid</code>
				</p>
				{/* <ConnectButton chainStatus='icon' accountStatus='avatar' /> */}

				<div className='fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none'>
					<button
						type='button'
						className='bg-blue-500 p-2 mx-2'
						onClick={async () => {
							await joinRoom({
								roomId: 'chq-anzn-chw',
								token,
							})
						}}
					>
						.
					</button>
					<button
						className='bg-blue-500 p-2 mx-2'
						onClick={async () => {
							await enableVideo()
						}}
					>
						Enable Video
					</button>
					{/* <button
						className='bg-blue-500 p-2 mx-2'
						onClick={async () => {
							await disableVideo()
						}}
					>
						Disable Video
					</button> */}
					{/* <button
						className='bg-blue-500 p-2 mx-2'
						onClick={async () => {
							await enableAudio()
						}}
					>
						Enable Audio
					</button> */}

					<button
						type='button'
						className='bg-blue-500 p-2 mx-2'
						onClick={getLocation}
					>
						Get Location
					</button>
					{location.latitude !== null && location.longitude !== null ? (
						<p className='bg-blue-500 p-2 mx-2'>
							Latitude: {location.latitude}, Longitude: {location.longitude}
						</p>
					) : null}
					{error ? <p>Error: {error}</p> : null}
				</div>
			</div>

			<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
				{isVideoOn && (
					<video
						ref={videoRef}
						className='w-1/2 mx-auto border-2 rounded-xl border-blue-400'
						autoPlay
						muted
					/>
				)}
			</div>

			<div>
				{' '}
				<div>
					{/* <input
						type='text'
						// placeholder='Room ID'
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
					/> */}
					{/* <input
						type='text'
						placeholder='Token'
						value={token}
						// onChange={(e) => setToken(token)}
					/> */}
					<button onClick={handleStartRecording}>Start Recording</button>
					<button onClick={handleStartLivestream}></button>
					<button onClick={handleStop}>Stop</button>
					<button onClick={handleStopAndFetchRecordings}>
						Stop Recording and Fetch Recordings
					</button>

					{recordings.length > 0 && (
						<div>
							<h3>Recordings:</h3>
							<ul>
								{recordings.map((recording: Recording) => (
									<li key={recording.id}>
										<a
											href={recording.url}
											target='_blank'
											rel='noopener noreferrer'
										>
											{recording.id} (Size: {recording.size} bytes)
										</a>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>

			<div className='mt-4 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left'>
				{peerIds.map((peerId) =>
					peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null,
				)}
			</div>
		</main>
	)
}

export const getServerSideProps = async () => {
	const accessToken = new AccessToken({
		apiKey: 'zMQHa6hH5hGrxfwYZp7z8I-1lWScI7UA',
		roomId: 'mom-xnkh-lwh',

		role: Role.HOST,
		permissions: {
			admin: true,
			canConsume: true,
			canProduce: true,
			canProduceSources: {
				cam: true,
				mic: true,
				screen: true,
			},
			canRecvData: true,
			canSendData: true,
			canUpdateMetadata: true,
		},
		options: {
			metadata: {
				// you can add any custom attributes here which you want to associate with the user
				walletAddress: '0x29f54719E88332e70550cf8737293436E9d7b10b',
			},
		},
	})

	const token = await accessToken.toJwt()

	return {
		props: { token },
	}
}
