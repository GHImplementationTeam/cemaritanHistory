const fs=require('fs')
const isCreated={
	'Api':false,
	'Authorization':false,
	'Cemaritan':false,
	'Frontend':false,
	'Referrals':false,
	'Schema':false,
	'Slack':false,
	'Test-data-generator':false
}
var joined=[]
const entries=fs.readFileSync('all.log','utf8').replace(/\r/g,'').split('\n')
const newEntries=entries
	.map(line=>processLine(line))
	.filter(line=>line.length>0)
fs.writeFileSync('captions.log',newEntries.join('\n'))


function processLine(line) {
	let [ts,user,type,file]=line.split('|')
	return getAction(type,file,ts,user)
}

function getAction(type,file,ts,user) {
	switch(type) {
		case 'A':
			if(file.indexOf('Slack') > -1) {
				return `${ts}|${formatDate(ts)} ${user} created the Slack channel #${file.replace('/Slack/','').replace('.slack','')}`
			}
			const project = inWhich(file,Object.keys(isCreated))
			if(!isCreated[project]) {
				isCreated[project]=true;
				if(!joined.includes(user)) {
					joined.push(user)
					return `${ts}|${formatDate(ts)} ${user} joined the team and created the project ${project}`;
				}
				return `${ts}|${formatDate(ts)} ${user} created the project ${project}`;
			}
			return '';
		case 'M':
			// if(file.indexOf('Slack') > -1) {
				// return `${ts}|${user} posted to #${file.replace('/Slack/','').replace('.slack','')}`
			// }
			if(!joined.includes(user)) {
				joined.push(user)
				return `${ts}|${formatDate(ts)} ${user} joined the team`;
			}
			// return `${ts}|${user} modified ${file}`
			
			return ''
		case 'D':
			return ''
			//return `${ts}|${user} deleted ${file}`
	}
}

function inWhich(searchIn,whichOnes) {
	return whichOnes.find(searchFor=>searchIn.indexOf(searchFor) > -1)
}

function formatDate(ts) {
	const date=new Date(parseInt(ts)*1000)
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear().toString().substr(2);

  return  monthNames[monthIndex] + ' '+ day + ':';
}