#!/usr/bin/env bash

script=$(readlink -f $0)
base=$(dirname $(dirname $script))
toolsScriptPath=~/.blogtools.sh
rcPath=~/.zshrc

grep -q '#BLOG-TOOLS' $rcPath
if [ $? -eq 0 ]; then
  echo "Blog tools already installed"
  exit 1
fi


if [ ! -f "$toolsScriptPath" ]; then
echo -e "#!/usr/bin/env bash\n
export BLOG_REPO_DIR=$base 
export PATH=\$PATH:$base/scripts/cli\n" > $toolsScriptPath
fi

echo -e "\n#BLOG-TOOLS
source $toolsScriptPath
" >> $rcPath
