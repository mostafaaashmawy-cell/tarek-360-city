const fs = require('fs');

const blocks = JSON.parse(fs.readFileSync('scripts/final_17_blocks.json'));

let tsBlocks = 'export const MASTERPLAN_BLOCKS_HD: MasterPlanBlock[] = [\n';
blocks.forEach(b => {
  tsBlocks += `  {\n`;
  tsBlocks += `    id: '${b.id}',\n`;
  tsBlocks += `    nameAr: '${b.nameAr}',\n`;
  tsBlocks += `    nameEn: '${b.nameEn}',\n`;
  tsBlocks += `    category: '${b.category}',\n`;
  tsBlocks += `    unitType: '${b.unitType}',\n`;
  tsBlocks += `    area: '${b.area}',\n`;
  tsBlocks += `    specs: '${b.specs}',\n`;
  tsBlocks += `    description: '${b.description}',\n`;
  tsBlocks += `    polygon: '${b.polygon}',\n`;
  tsBlocks += `    center: [${b.center[0]}, ${b.center[1]}],\n`;
  tsBlocks += `    color: '${b.color}',\n`;
  tsBlocks += `    tourUrl: '${b.tourUrl}',\n`;
  tsBlocks += `  },\n`;
});
tsBlocks += '];\n';

let fileContent = fs.readFileSync('components/experience/MasterPlanView.tsx', 'utf8');

// Replace MASTERPLAN_BLOCKS_HD definition
const startMarker = 'export const MASTERPLAN_BLOCKS_HD: MasterPlanBlock[] = [';
const endMarker = '];\n\ninterface MasterPlanViewProps';

const startIdx = fileContent.indexOf(startMarker);
const endIdx = fileContent.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  fileContent = fileContent.slice(0, startIdx) + tsBlocks + fileContent.slice(endIdx + 2);
  console.log('Successfully replaced MASTERPLAN_BLOCKS_HD array.');
} else {
  console.error('Could not find markers for MASTERPLAN_BLOCKS_HD array');
}

fs.writeFileSync('components/experience/MasterPlanView.tsx', fileContent);
