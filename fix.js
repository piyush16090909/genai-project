const fs = require('fs');
let content = fs.readFileSync('d:/genaiproject/frontend/src/features/interview/pages/Home.jsx', 'utf8');

content = content.replace("className={eport-badge report-badge--score \\}>", 
  "className={\eport-badge report-badge--score \\}>");

content = content.replace("{report.matchScore ? \% Match\ : 'Match Score'}",
  "{report.matchScore ? \\% Match\ : 'Match Score'}");

fs.writeFileSync('d:/genaiproject/frontend/src/features/interview/pages/Home.jsx', content);
