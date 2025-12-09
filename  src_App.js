// Copy the ENTIRE artifact code here (the full ProductivityTemplateGenerator component)
// Make sure it starts with: import React, { useState, useEffect } from 'react';
// And ends with: export default ProductivityTemplateGenerator;  import React, { useState, useEffect } from 'react';
import { Loader, LayoutGrid, Calendar, Target, Brain, Users, Briefcase, GraduationCap, Shuffle, Copy, Check, Download, History, Trash2, AlertCircle } from 'lucide-react';

const ProductivityTemplateGenerator = () => {
const [selectedPlatform, setSelectedPlatform] = useState('');
const [selectedUseCase, setSelectedUseCase] = useState('');
const [customNeeds, setCustomNeeds] = useState('');
const [template, setTemplate] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [copied, setCopied] = useState(false);
const [error, setError] = useState('');
const [showHistory, setShowHistory] = useState(false);
const [templateHistory, setTemplateHistory] = useState([]);

const platforms = [
{ id: 'notion', name: 'Notion', icon: '📝', accentColor: '#8B9A7E' },
{ id: 'airtable', name: 'Airtable', icon: '📊', accentColor: '#D4A574' },
{ id: 'trello', name: 'Trello', icon: '📋', accentColor: '#C17B5C' },
{ id: 'asana', name: 'Asana', icon: '🎯', accentColor: '#C9A3A0' },
{ id: 'clickup', name: 'ClickUp', icon: '⚡', accentColor: '#8B9A7E' },
{ id: 'monday', name: 'Monday.com', icon: '📅', accentColor: '#D4A574' },
];

const useCases = [
{ id: 'project', name: 'Project Management', icon: <Briefcase className="w-6 h-6" />, desc: 'Track projects, tasks, and deliverables' },
{ id: 'content', name: 'Content Calendar', icon: <Calendar className="w-6 h-6" />, desc: 'Plan and schedule content creation' },
{ id: 'goals', name: 'Goal Tracking', icon: <Target className="w-6 h-6" />, desc: 'Set and monitor personal or team goals' },
{ id: 'knowledge', name: 'Knowledge Base', icon: <Brain className="w-6 h-6" />, desc: 'Organize information and resources' },
{ id: 'team', name: 'Team Collaboration', icon: <Users className="w-6 h-6" />, desc: 'Coordinate team workflows' },
{ id: 'learning', name: 'Learning System', icon: <GraduationCap className="w-6 h-6" />, desc: 'Track courses, skills, and progress' },
];

useEffect(() => {
const saved = localStorage.getItem('templateHistory');
if (saved) {
try {
setTemplateHistory(JSON.parse(saved));
} catch (e) {
console.error('Failed to load history:', e);
localStorage.removeItem('templateHistory');
}
}
}, []);

const saveToHistory = (newTemplate) => {
const historyItem = {
id: Date.now(),
platform: platforms.find(p => p.id === selectedPlatform)?.name,
useCase: useCases.find(u => u.id === selectedUseCase)?.name,
template: newTemplate,
customNeeds,
date: new Date().toISOString(),
};

const newHistory = [historyItem, ...templateHistory].slice(0, 10);
setTemplateHistory(newHistory);
try {
localStorage.setItem('templateHistory', JSON.stringify(newHistory));
} catch (e) {
console.error('Failed to save history:', e);
}
};

const loadFromHistory = (item) => {
const platform = platforms.find(p => p.name === item.platform);
const useCase = useCases.find(u => u.name === item.useCase);

if (platform) setSelectedPlatform(platform.id);
if (useCase) setSelectedUseCase(useCase.id);
setCustomNeeds(item.customNeeds || '');
setTemplate(item.template);
setShowHistory(false);
};

const deleteFromHistory = (id) => {
const newHistory = templateHistory.filter(item => item.id !== id);
setTemplateHistory(newHistory);
try {
localStorage.setItem('templateHistory', JSON.stringify(newHistory));
} catch (e) {
console.error('Failed to update history:', e);
}
};

const clearHistory = () => {
setTemplateHistory([]);
localStorage.removeItem('templateHistory');
};

const generateTemplate = async () => {
if (!selectedPlatform || !selectedUseCase) return;

setIsLoading(true);
setTemplate('');
setError('');

try {
const platformName = platforms.find(p => p.id === selectedPlatform)?.name;
const useCaseName = useCases.find(u => u.id === selectedUseCase)?.name;

const prompt = `Generate a comprehensive, professional productivity template for ${platformName} focused on ${useCaseName}.

The required aesthetic is Warm, Calming, and Minimalist, utilizing a sophisticated, muted palette.

${customNeeds ? `Additional Requirements: ${customNeeds}\n` : ''}
COLOR PALETTE & STYLING GUIDE:
• Backgrounds: Lightest colors (#FAF8F5 Creamy White, #FEFDFB Icy White, #F5F0E8 Light Taupe) for all page and widget backgrounds. Always recommend transparent or #FAF8F5 for widgets.
• Text & Data: Deep grounding browns (#3D2817 Deep Chocolate, #5C4A3A Deep Espresso) for all primary text, titles, and data values.
• Rich Accents: Saturated warm colors (#D4A574 Soft Gold, #C17B5C Terracotta, #C9A3A0 Blush, #8B9A7E Sage Green) ONLY for status indicators, progress bars, highlights, and icons.
• Borders: Subtle warm borders using #E8DFD4.

Structure the output using proper Markdown headings (##, ###) and provide:

## 1. Overview & Core Philosophy
Brief description and how the warm color scheme enhances focus.

## 2. Platform Structure & Color Coding
Detailed breakdown with color recommendations:
${selectedPlatform === 'notion' ? '- Database properties (Type, Description, Color Tag using Rich Accents)\n- Views (Kanban, Calendar, Table) with visual styling\n- Key Formulas/Rollups' : ''}${selectedPlatform === 'airtable' ? '- Tables & Purposes\n- Field Types with Rich Accent colors for status fields\n- Key Automation/View suggestions' : ''}${selectedPlatform === 'trello' ? '- Lists (Workflow Stages) with recommended label colors\n- Card Templates and Custom Fields with color emphasis' : ''}${selectedPlatform === 'asana' ? '- Project Sections & Custom Fields with color coding\n- Reporting/Portfolio View setup tips' : ''}${selectedPlatform === 'clickup' ? '- Space/Folder/List hierarchy\n- Statuses with Rich Accent colors\n- Custom Fields setup' : ''}${selectedPlatform === 'monday' ? '- Board Structure and Column Types with color mapping\n- Dashboard Widget suggestions' : ''}

## 3. Workflow & Usage Guide
Daily/weekly usage with color-coded priorities.

## 4. Visual Integration & Pro Tips
Widget integration advice (Indify/Gridfiti):
• Set backgrounds to transparent or #FAF8F5
• Use #3D2817 for text
• Use Rich Accents for icons and borders
• Maintain visual minimalism while scaling

Make it detailed, practical, and immediately implementable with specific color codes.`;

const response = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
model: 'claude-sonnet-4-20250514',
max_tokens: 4000,
messages: [{ role: 'user', content: prompt }],
}),
});

if (!response.ok) {
throw new Error(`API error: ${response.status} - ${response.statusText}`);
}

const data = await response.json();

if (data.error) {
throw new Error(data.error.message || 'API returned an error');
}

const content = data.content?.find(item => item.type === 'text')?.text || 'Unable to generate template.';

if (data.stop_reason === 'max_tokens') {
setError('Note: Template may be incomplete due to length. Consider being more specific in your requirements.');
}

setTemplate(content);
saveToHistory(content);
} catch (error) {
setError(`Error: ${error.message}`);
console.error('Generation error:', error);
} finally {
setIsLoading(false);
}
};

const copyToClipboard = async () => {
try {
await navigator.clipboard.writeText(template);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
} catch (err) {
setError('Failed to copy to clipboard. Please try again.');
console.error('Copy failed:', err);
}
};

const downloadAsMarkdown = () => {
try {
const platformName = platforms.find(p => p.id === selectedPlatform)?.name || 'Template';
const useCaseName = useCases.find(u => u.id === selectedUseCase)?.name || 'Template';
const filename = `${platformName}-${useCaseName}-Template.md`;

const blob = new Blob([template], { type: 'text/markdown' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
a.click();
URL.revokeObjectURL(url);
} catch (err) {
setError('Failed to download file. Please try again.');
console.error('Download failed:', err);
}
};

const downloadAsText = () => {
try {
const platformName = platforms.find(p => p.id === selectedPlatform)?.name || 'Template';
const useCaseName = useCases.find(u => u.id === selectedUseCase)?.name || 'Template';
const filename = `${platformName}-${useCaseName}-Template.txt`;

const blob = new Blob([template], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
a.click();
URL.revokeObjectURL(url);
} catch (err) {
setError('Failed to download file. Please try again.');
console.error('Download failed:', err);
}
};

const randomize = () => {
const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)].id;
const randomUseCase = useCases[Math.floor(Math.random() * useCases.length)].id;
setSelectedPlatform(randomPlatform);
setSelectedUseCase(randomUseCase);
};

const reset = () => {
setSelectedPlatform('');
setSelectedUseCase('');
setCustomNeeds('');
setTemplate('');
setError('');
};

const renderMarkdown = (text) => {
return text.split('\n').map((line, index) => {
if (line.startsWith('# ')) {
return <h1 key={index} className="text-3xl font-black text-[#3D2817] mt-8 mb-4 border-b-2 border-[#E8DFD4] pb-2">{line.substring(2)}</h1>;
}
if (line.match(/^\*\*.*\*\*$/)) {
return <h2 key={index} className="text-2xl font-bold text-[#5C4A3A] mt-6 mb-3">{line.replace(/\*\*/g, '')}</h2>;
}
if (line.startsWith('## ')) {
return <h2 key={index} className="text-2xl font-bold text-[#5C4A3A] mt-6 mb-3">{line.substring(3)}</h2>;
}
if (line.startsWith('### ')) {
return <h3 key={index} className="text-xl font-bold text-[#8B9A7E] mt-4 mb-2">{line.substring(4)}</h3>;
}
if (line.trim().match(/^[-*•]/)) {
return (
<div key={index} className="flex gap-3 mb-2 ml-4">
<span className="text-[#C17B5C] font-bold text-lg leading-6">•</span>
<span className="flex-1 text-[#3D2817]">{line.trim().substring(1).trim()}</span>
</div>
);
}
if (line.trim().match(/^\d+\./)) {
const match = line.trim().match(/^(\d+)\.\s*(.*)/);
if (match) {
return (
<div key={index} className="flex gap-3 mb-2 ml-4">
<span className="text-[#D4A574] font-bold min-w-[1.5rem]">{match[1]}.</span>
<span className="flex-1 text-[#3D2817]">{match[2]}</span>
</div>
);
}
}
if (line.includes('**')) {
const parts = line.split(/(\*\*.*?\*\*)/g);
return (
<p key={index} className="mb-3 text-[#3D2817]">
{parts.map((part, i) =>
part.startsWith('**') && part.endsWith('**') ?
<strong key={i} className="font-bold text-[#5C4A3A]">{part.slice(2, -2)}</strong> :
part
)}
</p>
);
}
if (line.trim()) {
return <p key={index} className="mb-3 text-[#3D2817]">{line}</p>;
}
return <br key={index} />;
});
};

return (
<div className="min-h-screen bg-[#FAF8F5] p-6">
<div className="max-w-6xl mx-auto">
<div className="text-center mb-12">
<div className="inline-flex items-center gap-3 mb-4">
<div className="p-2 rounded-xl bg-gradient-to-br from-[#C17B5C] to-[#D4A574]">
<LayoutGrid className="w-10 h-10 text-white" />
</div>
<h1 className="text-5xl font-black text-[#3D2817]">Template Builder</h1>
</div>
<p className="text-xl text-[#5C4A3A] max-w-2xl mx-auto leading-relaxed">
Generate professional productivity templates with a warm, calming aesthetic
</p>

{templateHistory.length > 0 && (
<button
onClick={() => setShowHistory(!showHistory)}
className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#FEFDFB] hover:bg-[#F5F0E8] rounded-xl text-sm font-semibold text-[#5C4A3A] transition-all shadow-sm border border-[#E8DFD4]"
>
<History className="w-4 h-4 text-[#C17B5C]" />
History ({templateHistory.length})
</button>
)}
</div>

{showHistory && (
<div className="bg-[#FEFDFB] rounded-3xl shadow-sm p-8 mb-8 border border-[#E8DFD4]">
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-bold text-[#3D2817]">Template History</h2>
<button
onClick={clearHistory}
className="flex items-center gap-2 px-4 py-2 bg-[#FEFDFB] hover:bg-[#F5F0E8] border border-[#C17B5C] rounded-xl text-sm font-semibold text-[#C17B5C] transition-all"
>
<Trash2 className="w-4 h-4" />
Clear All
</button>
</div>
<div className="space-y-3 max-h-96 overflow-y-auto">
{templateHistory.length === 0 ? (
<p className="text-center text-[#5C4A3A] py-4">No history yet. Generate a template to save it here!</p>
) : (
templateHistory.map((item) => (
<div
key={item.id}
className="flex items-center justify-between p-5 bg-[#F9F6F1] rounded-xl hover:bg-[#F5F0E8] transition-colors border border-[#E8DFD4]"
>
<div className="flex-1">
<div className="font-bold text-[#3D2817] text-lg mb-1">
{item.platform} - {item.useCase}
</div>
<div className="text-sm text-[#8B9A7E]">
{new Date(item.date).toLocaleString()}
</div>
</div>
<div className="flex gap-2">
<button
onClick={() => loadFromHistory(item)}
className="px-4 py-2 bg-[#8B9A7E] hover:bg-[#7A8970] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
>
Load
</button>
<button
onClick={() => deleteFromHistory(item.id)}
className="px-3 py-2 bg-[#FEFDFB] hover:bg-[#F5F0E8] border border-[#C17B5C] text-[#C17B5C] rounded-xl transition-colors"
>
<Trash2 className="w-4 h-4" />
</button>
</div>
</div>
))
)}
</div>
</div>
)}

<div className="bg-[#FEFDFB] rounded-3xl shadow-sm p-8 mb-8 border border-[#E8DFD4]">
<div className="mb-8">
<div className="flex items-center justify-between mb-4">
<h2 className="text-2xl font-bold text-[#3D2817]">Choose Platform</h2>
<button
onClick={randomize}
className="flex items-center gap-2 px-4 py-2 bg-[#F9F6F1] hover:bg-[#F5F0E8] rounded-xl text-sm font-semibold text-[#5C4A3A] transition-all border border-[#E8DFD4]"
>
<Shuffle className="w-4 h-4 text-[#D4A574]" />
Surprise Me
</button>
</div>
<div className="grid grid-cols-3 gap-4">
{platforms.map((platform) => (
<button
key={platform.id}
onClick={() => setSelectedPlatform(platform.id)}
className={`p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
selectedPlatform === platform.id
? 'bg-[#F5F0E8] shadow-md'
: 'border-[#E8DFD4] hover:border-[#D4C4B4] bg-[#FEFDFB]'
}`}
style={{
borderColor: selectedPlatform === platform.id ? platform.accentColor : undefined
}}
>
<div className="text-4xl mb-3">{platform.icon}</div>
<div className="font-bold text-lg text-[#3D2817]">{platform.name}</div>
{selectedPlatform === platform.id && (
<div className="mt-2 h-1 rounded-full" style={{ backgroundColor: platform.accentColor }}></div>
)}
</button>
))}
</div>
</div>

<div className="mb-8">
<h2 className="text-2xl font-bold text-[#3D2817] mb-4">Select Use Case</h2>
<div className="grid grid-cols-2 gap-4">
{useCases.map((useCase) => (
<button
key={useCase.id}
onClick={() => setSelectedUseCase(useCase.id)}
className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
selectedUseCase === useCase.id
? 'border-[#C9A3A0] bg-[#F5F0E8] shadow-md'
: 'border-[#E8DFD4] hover:border-[#D4C4B4] bg-[#FEFDFB]'
}`}
>
<div className="flex items-start gap-4">
<div
className={`p-3 rounded-xl transition-colors ${
selectedUseCase === useCase.id
? 'text-white'
: 'bg-[#F9F6F1] text-[#5C4A3A]'
}`}
style={{
backgroundColor: selectedUseCase === useCase.id ? '#C9A3A0' : undefined
}}
>
{useCase.icon}
</div>
<div className="flex-1">
<div className="font-bold text-lg text-[#3D2817] mb-1">{useCase.name}</div>
<div className="text-sm text-[#5C4A3A]">{useCase.desc}</div>
</div>
</div>
</button>
))}
</div>
</div>

<div className="mb-8">
<label className="block text-lg font-bold text-[#3D2817] mb-3">
Additional Requirements <span className="text-[#8B9A7E] font-normal text-base">(optional)</span>
</label>
<textarea
value={customNeeds}
onChange={(e) => setCustomNeeds(e.target.value)}
placeholder="e.g., Include budget tracking, integrate with Slack, focus on remote teams..."
className="w-full px-4 py-3 border-2 border-[#E8DFD4] rounded-xl focus:border-[#8B9A7E] focus:outline-none text-[#3D2817] placeholder-[#A89885] resize-none bg-[#FEFDFB] transition-colors"
rows="3"
/>
</div>

{error && (
<div className="mb-6 p-4 bg-[#F9F6F1] border-2 border-[#D4A574] rounded-xl flex items-start gap-3">
<AlertCircle className="w-5 h-5 text-[#C17B5C] mt-0.5 flex-shrink-0" />
<p className="text-sm text-[#5C4A3A]">{error}</p>
</div>
)}

<button
onClick={generateTemplate}
disabled={!selectedPlatform || !selectedUseCase || isLoading}
className="w-full py-5 rounded-2xl text-xl font-bold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md text-white disabled:opacity-50"
style={{
background: (!selectedPlatform || !selectedUseCase || isLoading)
? '#D4C4B4'
: 'linear-gradient(135deg, #C17B5C 0%, #D4A574 100%)'
}}
>
{isLoading ? (
<>
<Loader className="w-6 h-6 animate-spin" />
Generating Your Template...
</>
) : (
'Generate Template'
)}
</button>
</div>

{template && (
<div className="bg-[#FEFDFB] rounded-3xl shadow-sm p-8 border border-[#E8DFD4]">
<div className="flex justify-between items-center mb-6 flex-wrap gap-4">
<h3 className="text-3xl font-black text-[#3D2817]">Your Custom Template</h3>
<div className="flex gap-2 flex-wrap">
<button
onClick={copyToClipboard}
className="flex items-center gap-2 px-4 py-2.5 bg-[#F9F6F1] hover:bg-[#F5F0E8] border border-[#8B9A7E] rounded-xl text-sm font-bold transition-colors text-[#8B9A7E]"
>
{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
{copied ? 'Copied!' : 'Copy'}
</button>
<button
onClick={downloadAsMarkdown}
className="flex items-center gap-2 px-4 py-2.5 bg-[#F9F6F1] hover:bg-[#F5F0E8] border border-[#D4A574] rounded-xl text-sm font-bold transition-colors text-[#C17B5C]"
>
<Download className="w-4 h-4" />
Markdown
</button>
<button
onClick={downloadAsText}
className="flex items-center gap-2 px-4 py-2.5 bg-[#F9F6F1] hover:bg-[#F5F0E8] border border-[#C9A3A0] rounded-xl text-sm font-bold transition-colors text-[#C9A3A0]"
>
<Download className="w-4 h-4" />
Text
</button>
<button
onClick={reset}
className="px-4 py-2.5 bg-[#F9F6F1] hover:bg-[#F5F0E8] border border-[#E8DFD4] rounded-xl text-sm font-bold transition-colors text-[#5C4A3A]"
>
Create Another
</button>
</div>
</div>

<div className="mb-6 p-4 bg-[#F9F6F1] rounded-xl border border-[#E8DFD4]">
<h4 className="text-sm font-bold text-[#3D2817] mb-3">Color Palette Applied:</h4>
<div className="flex flex-wrap gap-3">
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-[#FAF8F5] border border-[#E8DFD4]"></div>
<span className="text-xs text-[#5C4A3A]">Backgrounds</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-[#3D2817]"></div>
<span className="text-xs text-[#5C4A3A]">Text</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-[#D4A574]"></div>
<span className="text-xs text-[#5C4A3A]">Soft Gold</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-[#C17B5C]"></div>
<span className="text-xs text-[#5C4A3A]">Terracotta</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-[#C9A3A0]"></div>
<span className="text-xs text-[#5C4A3A]">Blush</span>
</div>
<div className="flex items-center gap-2">
<div className="w-4 h-4 rounded bg-[#8B9A7E]"></div>
<span className="text-xs text-[#5C4A3A]">Sage</span>
</div>
</div>
</div>

<div className="prose prose-lg max-w-none">
<div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E8] rounded-2xl p-8 border border-[#E8DFD4]">
<div className="whitespace-pre-wrap text-[#3D2817] leading-relaxed">
{renderMarkdown(template)}
</div>
</div>
</div>
</div>
)}
</div>
</div>
);
};

export default ProductivityTemplateGenerator;