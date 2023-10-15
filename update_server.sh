#! /bin/sh
pm2 kill
rm -r dist
echo "--Ya se borró la versión antigua--"
git pull origin main
npm run build 
echo "--Ya generó la nueva versión--"
pm2 start dist/src/main.js --name tasky
echo "--Ya inició en nuevo servidor--"
pm2 monit

