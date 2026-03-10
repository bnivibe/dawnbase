# Syncing Claude Code Skills Across Devices with Git

## 개요

Claude Code skills are stored locally in `~/.claude/skills/`. By default, these skills only exist on the machine where they were created. When you switch devices — for example, from a local PC to a cloud-based dev environment like Claude Code on the web — those skills are not available. Managing skills through a Git repository solves this problem cleanly.

## 핵심 내용

### Where skills live

Skills are stored as directories under `~/.claude/skills/`. Each skill is a folder containing at minimum a `prompt.md` (or equivalent) file:

```
~/.claude/skills/
  └── my-skill/
        └── prompt.md
```

### Option 1: Dotfiles repository

If you already manage a dotfiles repo, add your Claude skills there:

```
~/.dotfiles/
  └── claude/
        └── skills/
              └── my-skill/
                    └── prompt.md
```

In your setup script, symlink or copy the skills folder:

```bash
# Symlink approach
ln -s ~/.dotfiles/claude/skills ~/.claude/skills

# Or copy approach
cp -r ~/.dotfiles/claude/skills ~/.claude/skills
```

This keeps all your personal config in one place and applies cleanly to any new machine.

### Option 2: Dedicated skills repository

Create a standalone repo specifically for your Claude skills:

```bash
# Initial setup (do once)
cd ~/.claude
git init skills
cd skills
git remote add origin git@github.com:yourname/claude-skills.git
git push -u origin main

# On a new device
git clone git@github.com:yourname/claude-skills.git ~/.claude/skills
```

This is simpler if you only want to sync skills without a full dotfiles setup.

### Security considerations

Before pushing to a public repository, check that your skills do not contain:

- API keys or tokens embedded in prompts
- Personal data or internal system details
- Passwords or credentials referenced inline

If your skills contain sensitive context (e.g., internal project details), use a **private repository** instead.

### Keeping skills up to date

Once set up, syncing is just standard Git:

```bash
# After editing a skill
cd ~/.claude/skills
git add .
git commit -m "update my-skill: add new behavior"
git push

# On another device
cd ~/.claude/skills
git pull
```

## 정리

- Claude Code skills are stored in `~/.claude/skills/` and do not sync automatically between devices
- Managing them in a Git repository (dotfiles or dedicated) makes them available on any device with one `git clone`
- Prefer a **private repository** if your skills include any sensitive or internal information
- Once cloned, keeping skills in sync is just `git pull` — no special tooling needed
