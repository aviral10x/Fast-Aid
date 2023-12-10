import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<meta name='viewport' content='width=device-width, initial-scale=1' />

				<meta charSet='utf-8' />
				<link rel='icon' type='image/png' href='/images/favicon.png' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
				/>
				<meta
					name='theme-color'
					content='#18181b'
					media='(prefers-color-scheme: dark)'
				/>
				<meta name='theme-color' content='#f4f4f5' />
				<link rel='apple-touch-icon' href='/images/icon-maskable-512.png' />
				<link rel='manifest' href='/manifest.json' />
				{/* <link
					rel='stylesheet'
					href='https://unpkg.com/leaflet@1.0.1/dist/leaflet.css'
				/> */}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
