# readtheorg theme (vendored)

CSS/JS for Fabrice Niessen's readtheorg theme, plus the jQuery/Bootstrap/
stickytableheaders it depends on.

Upstream: https://github.com/fniessen/org-html-themes
Vendored from commit `561857e83d45eb7e6fcc361c42d073631e60c131`, 2026-08-16.

## These files ARE used

`theme-readtheorg.setup` references them as `/web/ext/fniessen/...`, and every page
pulls that in via `#+setupfile:`. Deleting one breaks the published site.

They used to be dead weight -- copied in Oct 2025 "as insurance in case the original
site disappears", but never referenced, while the setup file pointed at
`fniessen.github.io`. On 2026-08-12 upstream renamed `src/readtheorg_theme/` to
`src/readtheorg/` and `src/lib/js/` to `src/vendor/<pkg>/`. Every asset 404'd and both
deployments rendered unstyled. The insurance was there; it just wasn't wired up.

## Layout

Mirrors upstream's `src/`, so refreshing is a straight copy:

    readtheorg/css/{readtheorg,htmlize,code-copy,search}.css
    readtheorg/js/{readtheorg,search,code-copy}.js
    vendor/{jquery,bootstrap,stickytableheaders}/*.js

## Refreshing

    SHA=<upstream commit>
    for p in readtheorg/css/readtheorg.css ... ; do
      curl -sSL -o "$p" "https://cdn.jsdelivr.net/gh/fniessen/org-html-themes@$SHA/src/$p"
    done

Pin a commit rather than `@master`: the point of vendoring is that upstream moving
things cannot break us. Update the SHA above when you do.

Check upstream's `org/setup/html-theme-readtheorg.setup` at the same time -- that is
where new assets show up. (Upstream also renamed the setup file itself from
`theme-readtheorg.setup`; ours keeps the old name since it is our file now.)

## Remaining external dependencies

`readtheorg/css/readtheorg.css` still `@import`s two things upstream did not bundle:

- Google Fonts (Lato, Roboto Slab, Inconsolata)
- Font Awesome 4.3.0 from `maxcdn.bootstrapcdn.com`

Both resolved as of 2026-08-16. If either dies the page stays laid out and readable --
fonts fall back, icons go missing -- so this is cosmetic, not another blank-page
outage. Vendoring the font files would close it; upstream ships none, despite the
`url("../fonts/fontawesome-webfont.*")` references in its CSS, which 404 upstream too.
