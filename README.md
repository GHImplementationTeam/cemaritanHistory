#to run
 1. install gource https://gource.io/
 1. install ffmpeg
 1. install node
 1. Get an export from ghimplementationteam.slack.com
 1. extract it into /useThis subfolder
 1. git clone all the globalhack repos into the parent folder of this project's folder
 1. do `cd ../API` `gource --output-custom-log ../api.log`
 1. do `cd ../Authorization` `gource --output-custom-log ../authorization.log`
 1. do `cd ../cemaritan` `gource --output-custom-log ../cemaritan.log`
 1. do `cd ../FrontEnd` `gource --output-custom-log ../frontend.log`
 1. do `cd ../referrals` `gource --output-custom-log ../referrals.log`
 1. do `cd ../schema` `gource --output-custom-log ../Schema.log`
 1. do `cd ../test-data-generator` `gource --output-custom-log ../test-data-generator.log`
 1. delete the github_updates, uptime, and user_events folders in the useThis folder
 1. navigate back to this project and do `npm install` and `npm run slack` to convert all the slack logs into gource logs
 1. do `npm start` to compile all the logs into a single one
 1. OPTIONALLY do `npm run captions` to generate new captions from the unified log WARNING: Additional captions have been entered manually. This will overwrite them.
 1. do `npm run gource` to start recording the video
 1. do `npm run convertVideo` to convert the recording to a playable format