This directory exists entirely to make certain org-header links work
when pushing to github pages.

In a .org file, write:

```
  #+infojs_opt: view:showall mouse:#ffc0c0 toc:nil ltoc:nil path:/web/ext/orginfo/org-info.js
  #+html_head: <link rel="stylesheet" type="text/css" href="/web/css/notebook.css" />
```

Hosting Natively: `/web/css/notebook.css` gets resolved via this directory
(btw, note that `org-publish-project` expands symlinks)

Hosting on Github pages: `/web/css/notebooks.css` works,  because github repository name is `web`
