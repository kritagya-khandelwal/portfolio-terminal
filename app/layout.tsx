import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Kritagya Khandelwal - Software Developer',
	description:
		'Welcome to my portfolio! I am a passionate software developer specializing in building scalable server architectures, robust APIs, and high-performance distributed systems. With expertise in cloud infrastructure and database optimization, I create efficient and reliable backend solutions.',
	keywords: [
		'Software Developer',
		'Software Engineer',
		'System Architecture',
		'API Development',
		'Database Design',
		'Cloud Computing',
		'Microservices',
		'DevOps',
		'Kritagya Khandelwal',
		'Node.js',
		'Python',
		'Java',
		'Distributed Systems',
		'System Design',
		'Software Architecture',
	],
	authors: [{ name: 'Kritagya Khandelwal' }],
	creator: 'Kritagya Khandelwal',
	openGraph: {
		title: 'Kritagya Khandelwal - Software Developer Portfolio',
		description: 'Passionate software developer crafting scalable and efficient server architectures. Explore my projects and technical expertise.',
		url: 'https://kritagya.dev',
		siteName: 'Kritagya Khandelwal - Portfolio',
		images: [
			{
				url: '/profile.png',
				width: 1200,
				height: 630,
				alt: 'Kritagya Khandelwal - Software Developer Portfolio',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Kritagya Khandelwal - Software Developer',
		description: 'Passionate software developer crafting scalable and efficient server architectures. Explore my projects and technical expertise.',
		creator: '@kritagya_khandelwal',
		images: ['/profile.png'],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
