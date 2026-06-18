{ pkgs ? import <nixpkgs> {} }:

let
  emacs = (pkgs.emacsPackagesFor pkgs.emacs30).emacsWithPackages (ep: [
    ep.htmlize
    ep.nix-mode
    ep.yaml-mode
    ep.cmake-mode
  ]);
in
pkgs.mkShell {
  buildInputs = [ emacs ];
}
