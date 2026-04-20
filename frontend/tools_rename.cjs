const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
                filelist.push(filepath);
            }
        }
    });
    return filelist;
};

const replaceMap = {
    'bg-brand-primary': 'bg-primary-navy',
    'text-brand-accent': 'text-text-main', // Usually for buttons, or body
    'bg-brand-accent': 'bg-accent-blue',
    'text-brand-primary': 'text-white',
    'border-brand-border': 'border-border-ui',
    'bg-brand-border': 'bg-border-ui',
    'text-brand-muted': 'text-text-muted',
    'bg-brand-card': 'bg-bg-surface'
};

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    Object.keys(replaceMap).forEach(key => {
        // Simple regex to replace the class name if it appears
        const regex = new RegExp(key, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, replaceMap[key]);
            modified = true;
        }
    });
    
    // Additional rules explicitly for page layout roots which shouldn't be navy
    // To be safe, any min-h-screen bg-primary-navy usually means it's a page root
    if (content.includes('min-h-screen bg-primary-navy')) {
        content = content.replace(/min-h-screen bg-primary-navy/g, 'min-h-screen bg-bg-base');
    }
    
    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
