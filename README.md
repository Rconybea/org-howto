# org-howto
Emacs org git repo with howto articles.
Published regularly to github pages here: [[https://rconybea.github.io/web]]
see [[https://github.com:Rconybea/web]] for snapshot of generated html tree

publish content here from emacs, using `M-x org-publish-project org-howto`
See html on roly-laptop-14 at this url: http://localhost/howto

## host configuration for publishing
```
mkdir -p ~/proj
mkdir -p ~/proj/public_html
(cd ~/proj && git clone git@github.com:Rconybea/org-howto.git)
(cd ~/proj/public_html && git clone git@github.com:Rconybea/web.git org-howto)
```

## interactive emacs configuration
assuming:
1. contents of this repo is at `~/proj/org-howto`
2. publishing html to `~/proj/public_html/org-howto`
we need the following in `~/.emacs`:

```
;; ----------------------------------------------------------------
;; org-mode publishing
;;
(require 'ox-publish)

;; publishing setup -- this is a kitchen sink -- it's intended to cover
;; everything we want org-mode to publish
;;
(setq org-publish-project-alist
      '(
        ("org-howto"
         :components ("org-howto-notes" "org-howto-static"))

        ("org-howto-notes"
         :base-directory "~/proj/org-howto"
         :base-extension "org"
         :publishing-directory "~/proj/public_html/org-howto"
         :recursive t
         :publishing-function org-html-publish-to-html
         :headling-levels 4
         :auto-preamble t
         )

        ("org-howto-static"
         :base-directory "~/org/"
         :base-extension "css\\|js\\|svg\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf"
         :publishing-directory "~/proj/public_html/org-howto"
         :recursive t
         :publishing-function org-publish-attachment
        )))
```

create html tree with
```
M-x org-publish-project org-howto
```

To serve html content locally:
```
python3 -m http.server 8000 --directory ~/proj/public_html/org-howto
```

To publish updated html tree to github
```
cd ~/proj/public_html/org-howto
git add .
git commit -m update
git push
```

To reset org-mode publishing cache (e.g. because futzing with host setup)
```
rm -rf ~/.org-timestamps/*
```
