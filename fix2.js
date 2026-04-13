const fs = require('fs');
let content = fs.readFileSync('d:/genaiproject/frontend/src/features/interview/pages/Home.jsx', 'utf8');

content = content.replace("placeholder={Paste the full job description here...\\\\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'}",
  "placeholder={\Paste the full job description here...\\\\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'\}");

fs.writeFileSync('d:/genaiproject/frontend/src/features/interview/pages/Home.jsx', content);
