import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import * as React from 'react'
import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import {
	argentWallet,
	trustWallet,
	ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { HuddleClient, HuddleProvider } from '@huddle01/react'

const huddleClient = new HuddleClient({
	projectId: 'zMQHa6hH5hGrxfwYZp7z8I-1lWScI7UA',
	options: {
		activeSpeakers: {
			size: 8,
		},
	},
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[
		polygon,
		polygonMumbai,
		...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
			? [polygonMumbai]
			: []),
	],
	[publicProvider()],
)

const projectId = `85a616505f219621a73d1af8a208fd14`

const { wallets } = getDefaultWallets({
	appName: 'IKnowSpots',
	projectId,
	chains,
})

const demoAppInfo = {
	appName: 'IKnowSpots',
}

const connectors = connectorsForWallets([
	...wallets,
	{
		groupName: 'Other',
		wallets: [
			argentWallet({ projectId, chains }),
			trustWallet({ projectId, chains }),
			ledgerWallet({ projectId, chains }),
		],
	},
])

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Providers>
			<Component {...pageProps} />
		</Providers>
	)
}

function Providers({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = React.useState(false)
	React.useEffect(() => setMounted(true), [])

	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
				{mounted && (
					<HuddleProvider client={huddleClient}>{children}</HuddleProvider>
				)}
			</RainbowKitProvider>
		</WagmiConfig>
	)
}
