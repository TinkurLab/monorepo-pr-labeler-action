FROM node:8-slim

LABEL "com.github.actions.name"="Monorepo PR Repo Labeler"
LABEL "com.github.actions.description"="Labeling pull requests with the repo(s) that they impact for monorepos."
LABEL "com.github.actions.icon"="git-merge"
LABEL "com.github.actions.color"="green"

LABEL "repository"="http://github.com/adamzolyak/monorepo-pr-labeler-action"
LABEL "homepage"="http://www.tinkurlab.com"
LABEL "maintainer"="Adam Zolyak <adam@tinkurlab.com>"

ADD entrypoint.sh /action/entrypoint.sh
ADD package.json /action/package.json
ADD app.js /action/app.js
ADD helpers.js /action/helpers.js

RUN chmod +x /action/entrypoint.sh

ENTRYPOINT ["/action/entrypoint.sh"]