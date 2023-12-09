// pages/api/recorder.js

import { Recorder } from '@huddle01/server-sdk/recorder'

export default async function handler(req, res) {
	console.log('Request received:', req.method, req.url)

	const recorder = new Recorder('PROJECT_ID', 'API_KEY')

	if (req.method === 'POST') {
		console.log('Handling POST request:', req.body)

		// Handle start/stop recording or livestreaming based on request body
		const { action, roomId, token, rtmpUrls } = req.body

		try {
			if (action === 'startRecording') {
				console.log('Starting recording for room:', roomId)
				await recorder.startRecording({ roomId, token })
			} else if (action === 'startLivestream') {
				console.log('Starting livestream for room:', roomId)
				await recorder.startLivestream({ roomId, token, rtmpUrls })
			} else if (action === 'stop') {
				console.log('Stopping recording/livestream for room:', roomId)
				await recorder.stop({ roomId })
			}

			console.log('Action completed successfully:', action)
			res.status(200).json({ message: 'Success' })
		} catch (error) {
			console.error('Error occurred:', error)
			res.status(500).json({ error: error.message })
		}
	} else {
		console.log('Non-POST request received:', req.method)
		// Handle any non-POST requests
		res.setHeader('Allow', ['POST'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
