const notAGitRepoErrorMsg = 'Not a git repository (or any of the parent directories)';
export const checkIsGitRepo = () => {

  return logseq.Git.execCommand(['rev-parse', '--is-inside-work-tree'])
    .then(res => {
      if (res && res.exitCode === 0 && res.stdout.includes('true')) {
        return true;
      } else {
        throw new Error(notAGitRepoErrorMsg);
      }
    })
    .catch(err => {
      logseq.App.showMsg(notAGitRepoErrorMsg);
      throw err;
    });
}

export const getGitDiffSince = (gitParams) => {
  return checkIsGitRepo().then((isGitRepo) => {
    if (isGitRepo) {
      return logseq.Git.execCommand(gitParams);
    } else {
      throw new Error(notAGitRepoErrorMsg);
    }
  });
}
