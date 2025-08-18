#!/usr/bin/env node

/**
 * iStampit.io Design System Migration Script
 * Automatically converts Tailwind classes to Design System components
 *
 * Usage: node migrate-to-design-system.js [component-file]
 * Example: node migrate-to-design-system.js components/Navigation.tsx
 */

const fs = require('fs');
const path = require('path');

// Migration patterns for common conversions
const MIGRATION_PATTERNS = {
  // Button patterns
  buttons: [
    {
      pattern: /className=["']([^"']*bg-blue-600[^"']*hover:bg-blue-700[^"']*)["']/g,
      replacement: 'className="ds-btn ds-btn--primary"',
      component: 'Button',
      variant: 'primary'
    },
    {
      pattern: /className=["']([^"']*bg-gray-600[^"']*hover:bg-gray-700[^"']*)["']/g,
      replacement: 'className="ds-btn ds-btn--secondary"',
      component: 'Button',
      variant: 'secondary'
    },
    {
      pattern: /className=["']([^"']*bg-transparent[^"']*hover:bg-gray-100[^"']*)["']/g,
      replacement: 'className="ds-btn ds-btn--ghost"',
      component: 'Button',
      variant: 'ghost'
    }
  ],

  // Card patterns
  cards: [
    {
      pattern: /className=["']([^"']*bg-white[^"']*dark:bg-gray-800[^"']*border[^"']*rounded[^"']*)["']/g,
      replacement: 'className="ds-card"',
      component: 'Card'
    },
    {
      pattern: /className=["']([^"']*bg-white[^"']*shadow[^"']*rounded[^"']*)["']/g,
      replacement: 'className="ds-card ds-card--elevated"',
      component: 'Card',
      variant: 'elevated'
    }
  ],

  // Badge patterns
  badges: [
    {
      pattern: /className=["']([^"']*bg-green-100[^"']*text-green-800[^"']*px-2[^"']*py-1[^"']*rounded[^"']*)["']/g,
      replacement: 'className="ds-badge ds-badge--success"',
      component: 'Badge',
      variant: 'success'
    },
    {
      pattern: /className=["']([^"']*bg-yellow-100[^"']*text-yellow-800[^"']*px-2[^"']*py-1[^"']*rounded[^"']*)["']/g,
      replacement: 'className="ds-badge ds-badge--warning"',
      component: 'Badge',
      variant: 'warning'
    },
    {
      pattern: /className=["']([^"']*bg-red-100[^"']*text-red-800[^"']*px-2[^"']*py-1[^"']*rounded[^"']*)["']/g,
      replacement: 'className="ds-badge ds-badge--error"',
      component: 'Badge',
      variant: 'error'
    }
  ],

  // Typography patterns
  typography: [
    {
      pattern: /className=["']([^"']*text-3xl[^"']*font-bold[^"']*)["']/g,
      replacement: 'className="ds-heading-1"',
      component: 'Heading',
      level: 1
    },
    {
      pattern: /className=["']([^"']*text-2xl[^"']*font-bold[^"']*)["']/g,
      replacement: 'className="ds-heading-2"',
      component: 'Heading',
      level: 2
    },
    {
      pattern: /className=["']([^"']*text-xl[^"']*font-semibold[^"']*)["']/g,
      replacement: 'className="ds-heading-3"',
      component: 'Heading',
      level: 3
    },
    {
      pattern: /className=["']([^"']*text-lg[^"']*font-medium[^"']*)["']/g,
      replacement: 'className="ds-heading-4"',
      component: 'Heading',
      level: 4
    }
  ],

  // Surface patterns
  surfaces: [
    {
      pattern: /className=["']([^"']*bg-gray-50[^"']*dark:bg-gray-900[^"']*)["']/g,
      replacement: 'className="ds-surface ds-surface--secondary"',
      component: 'Surface',
      variant: 'secondary'
    }
  ],

  // Navigation patterns
  navigation: [
    {
      pattern: /className=["']([^"']*text-gray-600[^"']*hover:text-gray-900[^"']*dark:text-gray-300[^"']*dark:hover:text-white[^"']*)["']/g,
      replacement: 'className="ds-nav-link"',
      component: 'NavLink'
    }
  ]
};

// Color token mappings
const COLOR_TOKENS = {
  'text-gray-900': 'text-[var(--ds-text-primary)]',
  'text-gray-600': 'text-[var(--ds-text-secondary)]',
  'text-gray-500': 'text-[var(--ds-text-tertiary)]',
  'bg-white': 'bg-[var(--ds-surface-primary)]',
  'bg-gray-50': 'bg-[var(--ds-surface-secondary)]',
  'bg-gray-100': 'bg-[var(--ds-surface-tertiary)]',
  'border-gray-200': 'border-[var(--ds-border-primary)]',
  'border-gray-300': 'border-[var(--ds-border-secondary)]'
};

function migrateFile(filePath) {
  console.log(`🔄 Migrating ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  let componentsUsed = new Set();
  let changes = 0;

  // Apply all migration patterns
  Object.entries(MIGRATION_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(({ pattern, replacement, component, variant, level }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        componentsUsed.add(component);
        changes += matches.length;
        console.log(`  ✓ Converted ${matches.length} ${category} pattern(s)`);
      }
    });
  });

  // Apply color token replacements
  Object.entries(COLOR_TOKENS).forEach(([oldToken, newToken]) => {
    const pattern = new RegExp(oldToken, 'g');
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, newToken);
      changes += matches.length;
      console.log(`  ✓ Converted ${matches.length} color token(s): ${oldToken}`);
    }
  });

  // Add import statement if components are used
  if (componentsUsed.size > 0) {
    const importComponents = Array.from(componentsUsed).sort().join(', ');
    const importStatement = `import { ${importComponents} } from '@/components/ds';\n`;

    // Check if import already exists
    if (!content.includes('from \'@/components/ds\'')) {
      // Find the last import statement
      const importLines = content.split('\n');
      let lastImportIndex = -1;

      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }

      if (lastImportIndex >= 0) {
        importLines.splice(lastImportIndex + 1, 0, importStatement.trim());
        content = importLines.join('\n');
        console.log(`  ✓ Added import for: ${importComponents}`);
      }
    }
  }

  // Write the updated content back to file
  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Successfully migrated ${filePath} (${changes} changes)`);
    console.log(`📦 Components added: ${Array.from(componentsUsed).join(', ') || 'None'}\n`);
  } else {
    console.log(`ℹ️  No changes needed for ${filePath}\n`);
  }

  return { changes, componentsUsed: Array.from(componentsUsed) };
}

function migrateDirectory(dirPath) {
  console.log(`📁 Scanning directory: ${dirPath}`);

  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  let totalChanges = 0;
  let allComponents = new Set();

  files.forEach(file => {
    const fullPath = path.join(dirPath, file.name);

    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      const result = migrateDirectory(fullPath);
      totalChanges += result.totalChanges;
      result.allComponents.forEach(comp => allComponents.add(comp));
    } else if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) {
      const result = migrateFile(fullPath);
      totalChanges += result.changes;
      result.componentsUsed.forEach(comp => allComponents.add(comp));
    }
  });

  return { totalChanges, allComponents: Array.from(allComponents) };
}

function generateMigrationReport(totalChanges, allComponents) {
  const report = `
# Migration Report - ${new Date().toISOString()}

## Summary
- **Total Changes**: ${totalChanges}
- **Components Used**: ${allComponents.length}
- **Migration Status**: ${totalChanges > 0 ? 'SUCCESS' : 'NO CHANGES NEEDED'}

## Components Integrated
${allComponents.map(comp => `- ${comp}`).join('\n')}

## Next Steps
1. Test all migrated components thoroughly
2. Check for any visual regressions
3. Verify accessibility compliance
4. Update any remaining manual styling

## Design System Usage
- Import components from: \`@/components/ds\`
- Use design tokens: \`var(--ds-*)\`
- Follow component API documented in integration guide

---
Generated by iStampit.io Design System Migration Tool
`;

  fs.writeFileSync('MIGRATION_REPORT.md', report);
  console.log('📊 Migration report saved to MIGRATION_REPORT.md');
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  console.log('🚀 iStampit.io Design System Migration Tool\n');

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node migrate-to-design-system.js [file-or-directory]');
    console.log('  node migrate-to-design-system.js components/Navigation.tsx');
    console.log('  node migrate-to-design-system.js istampit-web/components');
    process.exit(1);
  }

  const targetPath = args[0];

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path not found: ${targetPath}`);
    process.exit(1);
  }

  const stats = fs.statSync(targetPath);
  let result;

  if (stats.isDirectory()) {
    result = migrateDirectory(targetPath);
  } else {
    const fileResult = migrateFile(targetPath);
    result = {
      totalChanges: fileResult.changes,
      allComponents: fileResult.componentsUsed
    };
  }

  console.log('🎉 Migration Complete!');
  console.log(`📊 Total Changes: ${result.totalChanges}`);
  console.log(`🧩 Components Used: ${result.allComponents.join(', ') || 'None'}`);

  generateMigrationReport(result.totalChanges, result.allComponents);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { migrateFile, migrateDirectory, MIGRATION_PATTERNS, COLOR_TOKENS };
