const fs = require('fs')
const nameReplacements=require('../nameReplacements.json')

const projects = ['api','authorization','cemaritan','frontend','referrals','schema','slack','test-data-generator']

const allEntries = projects.reduce((accum,project)=>accum.concat(processProject(project)),[])

fs.writeFileSync('all.log',allEntries.sort((e1,e2)=>parseInt(e1.split('|')[0])-parseInt(e2.split('|')[0])).join('\n'))

function processProject(project) {
	const p = fs.readFileSync(`../${project}.log`,'utf8').split('\n')
		.filter(line=>line.indexOf('|') !== -1)
		.filter(line=>line.indexOf('node_modules') == -1)
	const pArr=p.map(line=>processLine(project,line.replace('\r','')))
	return pArr
}

function processLine(project,line) {
	let [ts,user,type,file]=line.split('|')
	const username=nameReplacements[user] ? nameReplacements[user] : user;
	return `${ts}|${username}|${type}|/${capitalizeFirstLetter(project)}${file}`
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}