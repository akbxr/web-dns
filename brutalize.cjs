const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.astro') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
};

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Layout fixes
    if (file.includes('Layout.astro')) {
        content = content.replace(
            /https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@300;400;500;600;700&display=swap/g,
            'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap'
        );
        content = content.replace(/font-family: "Inter", system-ui, sans-serif;/g, 'font-family: "Bricolage Grotesque", system-ui, sans-serif;');
        content = content.replace(/<body class="font-sans antialiased">/g, '<body class="font-sans antialiased bg-brutal-bg text-brutal-black bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]">');
    }

    // Component fixes
    const replacements = [
        [/rounded-2xl/g, 'rounded-none'],
        [/rounded-xl/g, 'rounded-none'],
        [/rounded-lg/g, 'rounded-none'],
        [/rounded-md/g, 'rounded-none'],
        [/rounded-sm/g, 'rounded-none'],
        [/rounded-full/g, 'rounded-none'],
        [/shadow-2xl/g, 'shadow-brutal-lg border-4 border-brutal-black'],
        [/shadow-xl/g, 'shadow-brutal-lg border-4 border-brutal-black'],
        [/shadow-lg/g, 'shadow-brutal border-4 border-brutal-black'],
        [/shadow-md/g, 'shadow-brutal border-4 border-brutal-black'],
        [/shadow-sm/g, 'shadow-brutal-sm border-2 border-brutal-black'],
        [/shadow-blue-500\/10/g, 'shadow-brutal-black'],
        [/shadow-indigo-500\/20/g, 'shadow-brutal-black'],
        [/bg-white\/80/g, 'bg-brutal-white border-4 border-brutal-black'],
        [/bg-white\/50/g, 'bg-brutal-white border-2 border-brutal-black'],
        [/bg-white/g, 'bg-brutal-white'],
        [/bg-gray-50/g, 'bg-brutal-bg'],
        [/bg-gray-100/g, 'bg-brutal-bg border-2 border-brutal-black'],
        [/bg-blue-600/g, 'bg-brutal-green text-brutal-black border-4 border-brutal-black shadow-brutal'],
        [/bg-blue-700/g, 'bg-brutal-yellow text-brutal-black'],
        [/bg-blue-50/g, 'bg-brutal-white border-4 border-brutal-black'],
        [/bg-blue-100/g, 'bg-brutal-green border-4 border-brutal-black'],
        [/bg-red-50/g, 'bg-brutal-white border-4 border-brutal-black'],
        [/bg-red-100/g, 'bg-brutal-red text-brutal-white border-4 border-brutal-black'],
        [/bg-green-50/g, 'bg-brutal-white border-4 border-brutal-black'],
        [/bg-green-100/g, 'bg-brutal-green text-brutal-black border-4 border-brutal-black'],
        [/bg-indigo-600/g, 'bg-brutal-black text-brutal-white shadow-brutal'],
        [/text-blue-600/g, 'text-brutal-black'],
        [/text-blue-500/g, 'text-brutal-black'],
        [/text-blue-700/g, 'text-brutal-black'],
        [/text-indigo-600/g, 'text-brutal-black'],
        [/text-red-500/g, 'text-brutal-red'],
        [/text-red-600/g, 'text-brutal-red'],
        [/text-gray-900/g, 'text-brutal-black font-black uppercase tracking-tighter'],
        [/text-gray-800/g, 'text-brutal-black font-black uppercase'],
        [/text-gray-700/g, 'text-brutal-black font-bold'],
        [/text-gray-600/g, 'text-brutal-black font-bold font-mono'],
        [/text-gray-500/g, 'text-brutal-gray font-mono'],
        [/text-white/g, 'text-brutal-white'],
        [/text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600/g, 'text-brutal-black bg-brutal-green border-4 border-brutal-black shadow-brutal px-2 py-1'],
        [/ring-1/g, 'border-2 border-brutal-black'],
        [/ring-gray-200/g, 'border-brutal-black'],
        [/backdrop-blur-md/g, ''],
        [/transition-all/g, 'transition-none'],
        [/duration-300/g, ''],
        [/duration-500/g, ''],
        [/hover:-translate-y-1/g, 'hover:-translate-y-2 hover:translate-x-2'],
        [/hover:shadow-xl/g, 'hover:shadow-none hover:bg-brutal-yellow'],
        [/font-semibold/g, 'font-black uppercase'],
        [/font-medium/g, 'font-bold uppercase'],
        [/border-gray-200/g, 'border-brutal-black border-4'],
        [/border-gray-100/g, 'border-brutal-black border-2'],
        [/border-t /g, 'border-t-4 border-brutal-black '],
        [/border-b /g, 'border-b-4 border-brutal-black ']
    ];

    replacements.forEach(([pattern, replacement]) => {
        content = content.replace(pattern, replacement);
    });

    // Add specific brutalist elements if they are components
    if (file.includes('Hero.astro')) {
        content = content.replace(/<section(.*?)>/, `<section$1>\n  <div class="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ffcc00_10px,#ffcc00_20px)] border-b-4 border-brutal-black z-50"></div>`);
    }

    if (file.includes('DNSAddress.astro') || file.includes('Setup.astro')) {
        content = content.replace(/class="(.*?)font-mono(.*?)"/g, 'class="$1font-mono text-brutal-green bg-brutal-black p-2 border-4 border-brutal-black shadow-brutal$2"');
    }
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Brutalization complete');
