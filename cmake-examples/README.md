- In =org-howto=:
  Otherwise-empty placeholder directory for sphinx-generated cmake-examples documentation

- In =public_html/org-howto/cmake-examples=:
  Sphinx-generated documentation in this directory,  copied from somewhere like =cmake-examples/.build/docs/sphinx=
  Entry point will be =org-howto/cmake-examples/index.html=

- Note that github jekyll treats directories that begin with underscore as special.
  Suppress that behavior by creating a =.nojekyll= file in repo root.
