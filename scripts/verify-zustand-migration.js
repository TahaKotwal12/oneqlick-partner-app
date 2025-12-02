#!/usr/bin/env node

// Script to verify Zustand migration is complete
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');
const hooksDir = path.join(__dirname, '..', 'hooks');

// Files that should NOT use old hooks
const excludeFiles = [
  'node_modules',
  '.expo',
  '.git',
  'store',
  'scripts'
];

// Old hook patterns to check for
const oldHookPatterns = [
  /from\s+['"]\.\.\/hooks\/useAuth['"]/g,
  /from\s+['"]\.\.\/hooks\/useCart['"]/g,
  /import.*useAuth.*from.*hooks\/useAuth[^Z]/g,
  /import.*useCart.*from.*hooks\/useCart[^Z]/g
];

// New hook patterns that should be used
const newHookPatterns = [
  /from\s+['"]\.\.\/hooks\/useAuthZustand['"]/g,
  /from\s+['"]\.\.\/hooks\/useCartZustand['"]/g,
  /from\s+['"]\.\.\/store\/authStore['"]/g,
  /from\s+['"]\.\.\/store\/cartStore['"]/g
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!excludeFiles.some(exclude => file.includes(exclude))) {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for old hook usage
  oldHookPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        type: 'OLD_HOOK_USAGE',
        pattern: pattern.toString(),
        matches: matches,
        line: content.split('\n').findIndex(line => pattern.test(line)) + 1
      });
    }
  });
  
  // Check if file uses hooks but doesn't use new patterns
  const usesHooks = /useAuth|useCart|useLocation/.test(content);
  const usesNewHooks = newHookPatterns.some(pattern => pattern.test(content));
  
  if (usesHooks && !usesNewHooks && !filePath.includes('store/')) {
    issues.push({
      type: 'MISSING_ZUSTAND_MIGRATION',
      message: 'File uses hooks but not migrated to Zustand'
    });
  }
  
  return issues;
}

function main() {
  console.log('🔍 Verifying Zustand migration...\n');
  
  const allFiles = getAllFiles(appDir);
  const hookFiles = getAllFiles(hooksDir);
  const allFilesToCheck = [...allFiles, ...hookFiles];
  
  let totalIssues = 0;
  let migratedFiles = 0;
  
  allFilesToCheck.forEach(filePath => {
    const issues = checkFile(filePath);
    
    if (issues.length > 0) {
      console.log(`❌ ${path.relative(process.cwd(), filePath)}`);
      issues.forEach(issue => {
        console.log(`   - ${issue.type}: ${issue.message || issue.pattern}`);
        if (issue.line) {
          console.log(`     Line ${issue.line}`);
        }
      });
      totalIssues += issues.length;
    } else if (filePath.includes('app/') && (filePath.includes('.tsx') || filePath.includes('.ts'))) {
      migratedFiles++;
    }
  });
  
  console.log('\n📊 Migration Summary:');
  console.log(`✅ Migrated files: ${migratedFiles}`);
  console.log(`❌ Issues found: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 SUCCESS: All files have been migrated to Zustand!');
    console.log('🚀 Your app is now using enterprise-grade state management.');
  } else {
    console.log('\n⚠️  Some files still need migration. Please fix the issues above.');
  }
  
  return totalIssues === 0;
}

if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = { main };
