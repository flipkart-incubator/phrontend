rm -f p.js p.min.js p.min.js.gz
npm run build &> /dev/null
browserify lib/index.js > p.js
uglifyjs p.js > p.min.js 2> /dev/null
gzip p.min.js
du -h p.min.js.gz
rm -f p.js p.min.js p.min.js.gz
