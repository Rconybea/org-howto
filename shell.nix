{ pkgs ? import <nixpkgs> {} }:

let
  emacs = (pkgs.emacsPackagesFor pkgs.emacs30).emacsWithPackages (ep: [
    ep.htmlize
  ]);
in
pkgs.mkShell {
  buildInputs = [ emacs ];
}
