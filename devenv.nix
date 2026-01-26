{ pkgs, ... }:
{
  packages = [
    pkgs.act
    pkgs.gh
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
  };

  scripts.fix-check-dist = {
    exec = ./fix-check-dist.sh;
    description = "Fix check-dist failure in PR";
  };
  scripts.merge-dependabot-prs = {
    exec = ./merge-dependabot-prs.sh;
    description = "Merge all dependabot PRs with successful checks";
  };

  # See full reference at https://devenv.sh/reference/options/
}

