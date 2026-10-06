# Publishing the preview artifact

The artifact at https://claude.ai/artifact/WFAUZ8LWeKrLpoaExDp31p is a snapshot of the app. It does **not**
update when the code changes; someone has to rebuild and republish it.

1. `python3 tools/artifact/build_artifact.py /tmp/artifact_new /tmp/artifact_old`
   (the second folder is the previous build, if you still have it, so it can list what changed).
2. Publish `/tmp/artifact_new/index.html` to the existing artifact URL with the Artifact tool, passing `root` as
   `/tmp/artifact_new` and `files` as the changed/new files under `images/` (a list of paths, or a map with
   `null` to remove a file). One publish can send at most 255 files and 64 MB, so split big sets into several
   publishes to the same URL. A version can hold 511 files in all.
3. In a new session, read the artifact first (`action: "read"`) before publishing to it.

`loader.template.js` is a small script placed before the app. It makes `images/stock_*.jpg` requests load
from the bundle files instead, so the photos fit in the artifact.
