const fs = require('fs')

function listSubDirs(dirName) {
	return fs.readdirSync(dirName).filter(f=>fs.lstatSync(`${dirName}/${f}`).isDirectory())
}

function logEntries(directory,filename,users) {
	const log=require(`${directory}/${filename}`)
	console.log(`processing ${directory}/${filename}`)
	return log.map(entry=>processEntry(entry,users,directory.substring(directory.lastIndexOf('/')+1))).filter(e=>e.username !== undefined)
}

function gatherLogsFromFolder(path,users) {
	const files=fs.readdirSync(path)
	return files.reduce((accum,curr)=>accum.concat(logEntries(path,curr,users)),[])
}

function loadUsers(dirName) {
	const profiles=require(`${dirName}/users.json`)
	return profiles.reduce((accum,p)=>Object.assign(accum,{[p.id]:p.profile.real_name_normalized}),{})
}

function processEntry(entry,users,channel) {
	function findUser() {
		if(users[entry.user]) return users[entry.user];
		if(entry.subtype == "file_comment") {
			return users[entry.comment.user]
		}
		if(entry.subtype == 'bot_message' && entry.text.indexOf('has started a video conference') > -1) {
			//video conference
			if(entry.text.match(/\<@([^>]*)/)) {
				return users[entry.text.match(/\<@([^>]*)/)[1]]
			}
			else return entry.text.split(/\s/)[0] == 'drew_winship' ? users['U32RTP1S7'] : console.log('unknown user has started video conf');
		}
		if(entry.subtype == 'bot_message' && entry.attachments[0].author_name) { 
			//some activity somewhere else is being reported to slack
			return entry.attachments[0].author_name;
		}
		console.log('could not find user: '+entry.user)
	}
	return {
		timestamp:entry.ts.split('.')[0],
		username:findUser(),
		type:'M',
		file: `/${channel}`
	}
}

function processChannels(dirName,users) {
	const channels=require(`${dirName}/channels.json`)
	return channels.map(c=>({
		timestamp:c.created.split('.')[0],
		username:users[c.creator],
		type:'A',
		file: `/${c.name}`
	}))
}

function processMainDir(dirName) {
	const dirs=listSubDirs(dirName)
	const users=loadUsers(dirName)
	const channelLogs=processChannels(dirName,users)
	const activity = dirs.reduce((accum,curr)=>accum.concat(gatherLogsFromFolder(`${dirName}/${curr}`,users)),[])
	const allEntries=channelLogs.concat(activity).sort((e1,e2)=>parseInt(e1.timestamp)-parseInt(e2.timestamp))
	// fs.writeFileSync('temp.json',JSON.stringify(allEntries,null,2))
	fs.writeFileSync('../slack.log',allEntries.map(e=>`${e.timestamp}|${e.username}|${e.type}|${e.file}`).join('\n'))
	
	// for(let d in dirs) {
		// gatherLogsFromFolder(`./${dirName}/${dirs[d]}`,users)
	// }
}
const allEntries=processMainDir('./useThis')

