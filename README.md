# org-howto
Emacs org git repo with howto articles.
Published regularly to github pages here: [[https://rconybea.github.io/web]]
see [[github://Rconybea/org-howto]] for snapshot of generated html tree

publish content here from emacs, using `M-x org-publish-project org-howto`
see html on roly-laptop-14 at this url: http://localhost/howto

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
