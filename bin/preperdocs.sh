docsDir="docs"

# find -name "types.js" -type f -not -path "./node_modules/*" -not -path "./test/*" -exec jsdoc2md --files {} + > $docsDir/types.md

for rawFile in src/wp-cli/*; do
  cleanFile="$(basename $rawFile .js)"
  
  # if [[ "(index|util|types)" =~ $cleanFile ]]; then
  #   continue
  # fi
  
  docsFile="$docsDir/$cleanFile.md"
  
  # jsdoc2md --source "$(sed 's/import(.*\/\(.*\)'\'')/\u\1/g' $rawFile)" > $docsFile
  
  grep 
done