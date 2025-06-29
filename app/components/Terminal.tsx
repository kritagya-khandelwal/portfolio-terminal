'use client';


import { motion } from 'framer-motion';
import { FormEvent, useState, useEffect } from 'react';
import portfolioData from '../data/portfolio-data.json';
import { marked } from 'marked';

interface Interaction {
	command: string;
	response: string;
	type: 'command' | 'llm';
}

const skillToIconName: { [key: string]: string } = {
	// Languages
	'Java': 'java',
	'Python': 'python',
	'JavaScript': 'javascript',
	'C++': 'cplusplus',

	// Frameworks
	'Springboot': 'spring',
	'FastAPI': 'fastapi',
	'ExpressJS': 'express',
	'React': 'react',
	'Temporal': 'electron',

	// protocols
	// 'GraphQL': 'graphql',
	'gRPC': 'grpc',
	'OpenAPI': 'openapi',
	'OpenTelemetry': 'opentelemetry',
	'REST': 'djangorest',

	// AI
	'FastMCP': 'fastapi',
	'LanGraph': 'phoenix',

	// Data
	'Elasticsearch': 'elasticsearch',
	'MongoDB': 'mongodb',
	'Kafka': 'apachekafka',
	'RabbitMQ': 'rabbitmq',
	'Redis': 'redis',
	'PostgreSQL': 'postgresql',

	// Tools
	'Docker': 'docker',
	'Git': 'git',
	'Jenkins': 'jenkins',
};

const getSkillIcon = (skill: string) => {
	const iconName = skillToIconName[skill];
	if (iconName) {
		return `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-original.svg" class="w-4 h-4 mr-2 inline-block" alt="${skill} icon" />`;
	}
	return '';
};

const getCompanyIcon = (url: string, company: string) => {
	if (url) {
		return `<img src="https://www.google.com/s2/favicons?sz=64&domain_url=${url}" class="w-4 h-4 mr-2 inline-block" alt="${company} icon" />`;
	}
	return '';
};

export default function Terminal() {
	const [command, setCommand] = useState('');
	const [interactions, setInteractions] = useState<Interaction[]>([]);
	const [currentInteraction, setCurrentInteraction] = useState<Interaction | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [commandHistory, setCommandHistory] = useState<string[]>([]);

	// Predefined commands
	const predefinedCommands = {
		'whoami': {
			response: `
				<div class="flex items-center gap-4 mb-4">
					<img src="${portfolioData.personalInfo.profileImage}" alt="${portfolioData.personalInfo.name}" class="w-16 h-16 rounded-full" />
					<div>
						<h2 class="text-2xl font-bold text-white">${portfolioData.personalInfo.name}</h2>
						<p class="text-gray-400">${portfolioData.personalInfo.title}</p>
					</div>
				</div>
				<p class="text-gray-300">${portfolioData.personalInfo.summary}</p>
			`,
			type: 'command' as const
		},
		'ls': {
			response: `
			<p class="text-gray-300">experience</p>
			<p class="text-gray-300">skills</p>
			<p class="text-gray-300">education</p>
			<p class="text-gray-300">projects</p>
			<p class="text-gray-300">contacts</p>
			<p class="text-gray-300">achievements</p>
			`,
			type: 'command' as const
		},
		'cat experience': {
			response: `
				<h3 class="text-xl font-bold text-white mb-3">📁 Experience</h3>
				<div class="space-y-4">
					${portfolioData.experience.map(exp => `
						<div class="bg-gray-800/50 p-3 rounded-lg">
							<div class="flex items-start gap-4">
								<div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg">
									${getCompanyIcon(exp.url, exp.company)}
								</div>
								<div class="flex-1">
									<h4 class="text-green-400 font-semibold">${exp.title}</h4>
									<p class="text-gray-400">
										<span class="font-bold">${exp.company}</span> • ${exp.period}
									</p>
								</div>
							</div>
							<p class="text-gray-300 text-sm mt-2">${exp.description}</p>
							${exp.link ? `<div class='mt-2'><a href='${exp.link}' target='_blank' rel='noopener noreferrer' class='inline-block px-3 py-1 text-white rounded border border-green-500/20 hover:bg-green-500/20 transition-colors' style='border-color: green'>View Details</a></div>` : ''}
						</div>
					`).join('')}
				</div>
			`,
			type: 'command' as const
		},
		'cat skills': {
			response: `
				<h3 class="text-xl font-bold text-white mb-3">🛠️ Skills</h3>
				${Object.entries(portfolioData.skills).map(([category, skills]) => `
					<div class="mb-4">
						<h4 class="text-gray-400 capitalize mb-2">${category}</h4>
						<div class="flex flex-wrap gap-2">
							${(skills as string[]).map((skill: string) => `
								<span class="flex items-center px-3 py-1 bg-green-500/10 rounded-md border border-green-500/20 text-green-400">
									${getSkillIcon(skill)}
									${skill}
								</span>
							`).join('')}
						</div>
					</div>
				`).join('')}
			`,
			type: 'command' as const
		},
		'cat education': {
			response: `
				<h3 class="text-xl font-bold text-white mb-3">🎓 Education</h3>
				<div class="space-y-3">
					${portfolioData.education.map(edu => `
						<div class="bg-gray-800/50 p-3 rounded-lg">
							<h4 class="text-green-400 font-semibold">${edu.degree}</h4>
							<p class="text-gray-400">${edu.institution} • ${edu.period}</p>
							<p class="text-gray-300 text-sm mt-1">${edu.description ? edu.description : ''}</p>
						</div>
					`).join('')}
				</div>
			`,
			type: 'command' as const
		},
		'cat projects': {
			response: `
				<h3 class="text-xl font-bold text-white mb-3">🚀 Projects</h3>
				<div class="space-y-3">
					${portfolioData.projects.map(project => `
						<div class="bg-gray-800/50 p-3 rounded-lg">
							<h4 class="text-green-400 font-semibold">${project.title}</h4>
							<p class="text-gray-300 text-sm">${project.description}</p>
							<div class="flex flex-wrap gap-1 mt-2">
								${project.tech.map(tech => `<span class="text-xs px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20">${tech}</span>`).join('')}
							</div>
							${project.link ? `<div class='mt-2'><a href='${project.link}' target='_blank' rel='noopener noreferrer' class='inline-block px-3 py-1 text-white rounded border border-green-500/20 hover:bg-green-500/20 transition-colors' style='border-color: green'>View Project</a></div>` : ''}
						</div>
					`).join('')}
				</div>
			`,
			type: 'command' as const
		},
		'cat achievements': {
			response: `
				<h3 class="text-xl font-bold text-white mb-3">🏆 Achievements</h3>
				<div class="space-y-3">
					${portfolioData.achievements.map(ach => `
						<div class="flex items-center gap-4 bg-gray-800/50 p-3 rounded-lg">
							<div>
								<h4 class="text-green-400 font-semibold">${ach.title}</h4>
								<p class="text-gray-400 text-sm">${ach.subTitle}</p>
							</div>
						</div>
					`).join('')}
				</div>
			`,
			type: 'command' as const
		},
		'cat contacts': {
			response: `
				<h3 class="text-xl font-bold text-white mb-3">📧 Contact</h3>
				<div class="space-y-2">
					<p class="text-gray-300">📧 Email: <a href="mailto:${portfolioData.contact.email}" class="text-green-400 underline">${portfolioData.contact.email}</a></p>
					<p class="text-gray-300">💼 LinkedIn: <a href="${portfolioData.contact.linkedin}" target="_blank" rel="noopener noreferrer" class="text-green-400 underline">${portfolioData.contact.linkedin}</a></p>
					<p class="text-gray-300">🐙 GitHub: <a href="${portfolioData.contact.github}" target="_blank" rel="noopener noreferrer" class="text-green-400 underline">${portfolioData.contact.github}</a></p>
					${portfolioData.contact.medium ? `<p class="text-gray-300">✍️ Medium: <a href="${portfolioData.contact.medium}" target="_blank" rel="noopener noreferrer" class="text-green-400 underline">${portfolioData.contact.medium}</a></p>` : ''}
					${portfolioData.contact.phone ? `<p class="text-gray-300">📱 Phone: <a href="tel:${portfolioData.contact.phone}" class="text-green-400 underline">${portfolioData.contact.phone}</a></p>` : ''}
				</div>
			`,
			type: 'command' as const
		},
		'wget': {
			response: `<span class='text-gray-400'>download started...</span>`,
			type: 'command' as const
		},
		'clear': {
			response: '',
			type: 'command' as const
		},
		'help': {
			response: `
				<h3 class="text-xl font-bold text-white mb-3">💡 Available Commands</h3>
				<div class="space-y-2 text-gray-300">
					<p><span class="text-green-400">whoami</span> - Display my introduction</p>
					<p><span class="text-green-400">ls </span> - Shows all sections</p>
					<p><span class="text-green-400">cat [section]</span> - Displays Content of section</p>
					<p><span class="text-green-400">wget</span> - Downloads resume</p>
					<p><span class="text-green-400">gui</span> - Opens GUI version in new window</p>
					<p><span class="text-green-400">help</span> - Show this help message</p>
					<p><span class="text-green-400">clear</span> - Clear the terminal</p>
					<p class="mt-4 text-yellow-400">💬 You can also ask me anything! Try questions like:</p>
					<p class="text-gray-400 text-sm">• "Where did you go for your Bachelors degree?"</p>
					<p class="text-gray-400 text-sm">• "What's your favorite programming language?"</p>
					<p class="text-gray-400 text-sm">• "Tell me about your philosophy"</p>
				</div>
			`,
			type: 'command' as const
		},
		'gui': {
			response: `<span class='text-gray-400'>Opening GUI version in new window...</span>`,
			type: 'command' as const
		}
	};

	async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		if(command.trim() === '') return;

		const trimmedCommand = command.trim();
		
		// Update command history
		setCommandHistory(prev => [...prev, trimmedCommand]);

		// Check if it's a predefined command
		if (predefinedCommands[trimmedCommand as keyof typeof predefinedCommands]) {
			const cmd = predefinedCommands[trimmedCommand as keyof typeof predefinedCommands];
			if (trimmedCommand === 'clear') {
				setInteractions([]);
			} else {
				// Show predefined command with streaming effect
				setIsProcessing(true);
				// setCurrentInteraction({ command: trimmedCommand, response: '', type: 'command' });
				
				// Simulate streaming for predefined commands
				const streamPredefinedResponse = async () => {
					const sections = cmd.response.split('</div>').filter(section => section.trim() !== '');
					let fullResponse = '';
					
					for (const section of sections) {
						if (section.trim()) {
							fullResponse += section + '</div>';
							setCurrentInteraction({ command: trimmedCommand, response: fullResponse, type: 'command' });
							// Add delay between sections (200-400ms)
							await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
						}
					}
					
					// Add final delay before completing
					await new Promise(resolve => setTimeout(resolve, 300));
					
					setInteractions([...interactions, { command: trimmedCommand, response: cmd.response, type: 'command' }]);
					setCurrentInteraction(null);
					setIsProcessing(false);
				};
				
				streamPredefinedResponse();
			}
			setCommand('');
			if (trimmedCommand === 'wget') {
				// Trigger file download
				const link = document.createElement('a');
				link.href = 'kritagya_khandelwal_cv.pdf';
				link.download = 'kritagya_khandelwal_cv.pdf';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
			if (trimmedCommand === 'gui') {
				// Open portfolio website in new window
				window.open(portfolioData.personalInfo.website, '_blank');
			}
			return;
		}

		// If not a predefined command, use LLM
		setIsProcessing(true);
		// setCurrentInteraction({ command: trimmedCommand, response: '', type: 'llm' });

		try {
			const response = await fetch('http://localhost:8000/stream', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'text/event-stream'
				},
				body: JSON.stringify({
					prompt: trimmedCommand
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error('No reader available');
			}

			let fullResponse = '';
			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					
					const chunk = new TextDecoder().decode(value);
					
					// Split the chunk by 'data: ' to handle multiple JSON objects
					const dataLines = chunk.split('data: ').filter(line => line.trim() !== '');
					
					for (const line of dataLines) {
						try {
							const jsonData = JSON.parse(line.trim());

							
							// Check if this is the end signal
							if (jsonData.type === 'end') {
								break;
							}
							
							// Extract content from the chunk (only if content is not empty)
							if (jsonData.content && jsonData.content !== '') {
								fullResponse += jsonData.content;
								// Update the current interaction with each new chunk in real-time
								setCurrentInteraction({ command: trimmedCommand, response: fullResponse, type: 'llm' });
								// wait for 0.01 to 0.1 seconds randomly
								await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
							}
						} catch (e) {
							// Only log actual parsing errors, not empty content
							if (line.trim() !== '{"content": "", "type": "chunk"}') {
								console.error(`Failed to parse JSON: ${line.trim()} with error: ${e}`);
							}
						}
					}
				}
			} finally {
				reader.releaseLock();
			}
			
			// Add the complete response to interactions history
			setInteractions([...interactions, { command: trimmedCommand, response: fullResponse, type: 'llm' }]);
		} catch (error) {
			console.error('Error:', error);
			setInteractions([...interactions, { command: trimmedCommand, response: '❌ Sorry, I encountered an error. Please try again!', type: 'llm' }]);
		} finally {
			setCurrentInteraction(null);
			setIsProcessing(false);
			setCommand('');
		}
	}

	// Auto-focus on input when component mounts
	useEffect(() => {
		const input = document.getElementById('terminal-input');
		if (input) input.focus();
	}, []);

	// Auto-scroll to bottom when interactions change
	useEffect(() => {
		const terminalContent = document.querySelector('.terminal-content');
		if (terminalContent) {
			terminalContent.scrollTop = terminalContent.scrollHeight;
		}
	}, [interactions, currentInteraction]);

	// Auto-focus on input after processing is finished
	useEffect(() => {
		if (!isProcessing) {
			const input = document.getElementById('terminal-input');
			if (input) {
				input.focus();
			}
		}
	}, [isProcessing]);

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
			<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 opacity-10" />
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
			</div>

			<div className="relative z-10 max-w-4xl w-full mx-auto p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="bg-black/90 backdrop-blur-lg rounded-lg border border-gray-800 font-['SF_Mono'] shadow-2xl h-[600px] flex flex-col pr-0"
				>
					{/* Terminal Header */}
					<div className="flex items-center gap-2 flex-shrink-0 bg-gray-800 rounded-t-lg p-2 px-4">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
						<span className="text-grey-400 text-sm ml-4 font-bold font-mono p-0"><span className="text-pink-400">visitor</span>@krtagya.portfolio ~ %</span>
					</div>

					{/* Terminal Content - Scrollable */}
					<div className="terminal-content font-mono text-sm flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500/50 px-0 py-2">
						<div className="pr-6">
							{/* Welcome Message */}
							{interactions.length === 0 && (
								<div className="mb-4">
									<p className="text-green-400">Welcome to Kritagya&apos;s Portfolio Terminal! 🚀</p>
									<p className="text-gray-400 mb-2">Type <span className="text-green-400">help</span> to see available commands.</p>
								</div>
							)}

							{/* Interactions */}
							{interactions.map((interaction, index) => (
								<div key={index} className="mb-4">
									<p className="text-green-400">$ {interaction.command}</p>
									{interaction.response && (
										<div className="text-gray-300 mt-2 p-2" dangerouslySetInnerHTML={{ __html: interaction.type === 'llm' ? marked.parse(interaction.response) : interaction.response }} />
									)}
								</div>
							))}

							{/* Current Interaction (for streaming) */}
							{currentInteraction && (
								<div className="mb-4">
									<p className="text-green-400">$ {currentInteraction.command}</p>
									{currentInteraction.response && (
										<div className="text-gray-300 mt-2 p-2" dangerouslySetInnerHTML={{ __html: currentInteraction.type === 'llm' ? marked.parse(currentInteraction.response) : currentInteraction.response }} />
									)}
									{isProcessing && <span className="text-green-400 animate-pulse">▋</span>}
								</div>
							)}

							{/* Processing Indicator */}
							{isProcessing && !currentInteraction && (
								<div className="mb-4">
									<p className="text-green-400">$ {command}</p>
									<div className="text-gray-400 mt-2 flex items-center gap-2">
										<span>🤔 Thinking...</span>
										<span className="text-green-400 animate-pulse">▋</span>
									</div>
								</div>
							)}

							{/* Input Form - Flows with content */}
							{isProcessing || <form onSubmit={handleSubmit} className="flex items-center gap-2">
								<span className="text-green-400">$ </span>
								<input 
									id="terminal-input"
									type="text" 
									className="terminal-input text-green-400 bg-transparent border-none outline-none w-full text-sm" 
									placeholder="Enter command..." 
									value={command} 
									onChange={(e) => setCommand(e.target.value)}
									disabled={isProcessing}
									style={{ caretShape: 'underscore', caretColor: '#4ade80'}}
									spellCheck={false}
									autoComplete='off'
									onKeyDown={(e) => {
										if (e.key === 'ArrowUp') {
											e.preventDefault();
											if (commandHistory.length === 0) return;
											setCommand(commandHistory[commandHistory.length - 1]);
										} else if (e.key === 'ArrowDown') {
											e.preventDefault();
											if (commandHistory.length === 0) return;
											setCommand(commandHistory[commandHistory.length - 1]);
										}
									}}
								/>
							</form>}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
