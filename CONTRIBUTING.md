# Contributing to &lt;mapbox&gt;

## Code Contributions

The mapbox-map project welcomes new contributors.

Individuals making significant and valuable contributions are made
_Collaborators_.

This document will guide you through the contribution process.

### Step 1: Fork

Fork the project [on GitHub](https://github.com/GNURub/mapbox-map) then check out your copy locally.

```text
$ git clone git@github.com:username/mapbox-map.git
$ cd mapbox-map
$ git remote add upstream git://github.com/GNURub/mapbox-map.git
```

#### Which branch?

For developing new features and bug fixes, the `master` branch should be pulled and built upon.


### Step 2: Branch

Create a feature branch and start hacking:

```text
$ git checkout -b my-feature-branch -t origin/master
```

### Step 3: Commit

Please follow the **one logical change per commit rule**.

Make sure git knows your name and email address:

```text
$ git config --global user.name "User"
$ git config --global user.email "user@example.com"
```

Writing good commit logs is important. A commit log should describe what changed and why. Follow these guidelines when writing one:

1. The first line should be 50 characters or less and contain a short
   description of the change prefixed with the name of the changed
   subsystem (e.g. "net: add localAddress and localPort to Socket").
2. Keep the second line blank.
3. Wrap all other lines at 72 columns.

A good commit log can look something like this:

```
subsystem: explaining the commit in one line

Body of commit message is a few lines of text, explaining things in more detail, possibly giving some background about the issue being fixed, etc. etc.

The body of the commit message can be several paragraphs, and please do proper word-wrap and keep columns shorter than about 72 characters or so. That way `git log` will show things nicely even when it is indented.
```

The header line should be meaningful; it is what other people see when they run `git shortlog` or `git log --oneline`.

Check the output of `git log --oneline files_that_you_changed` to find out what subsystem (or subsystems) your changes touch.


### Step 4: Rebase

Use `git rebase` (not `git merge`) to sync your work from time to time.

```text
$ git fetch upstream
$ git rebase upstream/master
```

### Step 5: Push

```text
$ git push origin my-feature-branch
```

Go to https://github.com/yourusername/mapbox-map and select your feature branch. Click the 'Pull Request' button and fill out the form.

Pull requests are usually reviewed within a few days.  If there are comments to address, apply your changes in a separate commit and push that to your feature branch.  Post a comment in the pull request afterwards; GitHub does not send out notifications when you add commits.


## Code of Conduct

This Code of Conduct is adapted from [JavaScript Style Guide](https://github.com/airbnb/javascript).

* We are committed to providing a friendly, safe and welcoming
  environment for all, regardless of gender, sexual orientation,
  disability, ethnicity, religion, or similar personal characteristic.
* Please avoid using overtly sexual nicknames or other nicknames that
  might detract from a friendly, safe and welcoming environment for
  all.
* Please be kind and courteous. There's no need to be mean or rude.
* Respect that people have differences of opinion and that every
  design or implementation choice carries a trade-off and numerous
  costs. There is seldom a right answer.
* Please keep unstructured critique to a minimum. If you have solid
  ideas you want to experiment with, make a fork and see how it works.
* We will exclude you from interaction if you insult, demean or harass
  anyone.  That is not welcome behaviour. We interpret the term
  "harassment" as including the definition in the [Citizen Code of
  Conduct](http://citizencodeofconduct.org/); if you have any lack of
  clarity about what might be included in that concept, please read
  their definition. In particular, we don't tolerate behavior that
  excludes people in socially marginalized groups.
* Private harassment is also unacceptable. No matter who you are, if
  you feel you have been or are being harassed or made uncomfortable
  by a community member, please contact one of the channel ops or any
  of the TC members immediately with a capture (log, photo, email) of
  the harassment if possible.  Whether you're a regular contributor or
  a newcomer, we care about making this community a safe place for you
  and we've got your back.
* Likewise any spamming, trolling, flaming, baiting or other
  attention-stealing behaviour is not welcome.
* Avoid the use of personal pronouns in code comments or
  documentation. There is no need to address persons when explaining
  code (e.g. "When the developer")
