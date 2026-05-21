# GitHub Configuration

This directory contains GitHub-specific configurations for the BGV Platform project, including workflows, issue templates, and pull request templates.

## 📁 Structure

```
.github/
├── workflows/                   # GitHub Actions workflows
│   ├── ci.yml                  # Continuous Integration
│   ├── deploy.yml              # Deployment to Vercel
│   └── code-quality.yml        # Code quality checks
├── ISSUE_TEMPLATE/             # Issue templates
│   ├── bug_report.md          # Bug report template
│   ├── feature_request.md     # Feature request template
│   └── config.yml             # Issue template configuration
├── WORKFLOWS_SETUP.md          # Workflow setup guide
├── CODEOWNERS                  # Code ownership rules
└── pull_request_template.md    # PR template
```

## 🔄 Workflows

### 1. CI Workflow (`workflows/ci.yml`)

**Trigger:** Push and Pull Request to main/develop

**Jobs:**
- Lint & Test Backend
- Lint Frontend
- Build Frontend
- Security Scan
- Dependency Check

**Duration:** ~5-10 minutes

**Status:** All jobs must pass before merge

### 2. Deploy Workflow (`workflows/deploy.yml`)

**Trigger:** Push to main after CI passes

**Jobs:**
- Deploy to Vercel
- Run Database Migrations
- Smoke Tests
- Slack Notifications

**Duration:** ~15-20 minutes

**Status:** Automatic deployment on main branch

### 3. Code Quality Workflow (`workflows/code-quality.yml`)

**Trigger:** Push and Pull Request to main/develop

**Jobs:**
- Code Quality Analysis (SonarQube)
- Dependency Security Audit
- TypeScript Type Checking
- Docker Build Check
- PR Comment with Checklist

**Duration:** ~5 minutes

**Status:** Non-blocking (for information)

## 📋 Templates

### Issue Templates

#### Bug Report (`bug_report.md`)
- Describe the bug
- Steps to reproduce
- Expected behavior
- Screenshots
- Environment info
- Impact level

#### Feature Request (`feature_request.md`)
- Problem description
- Proposed solution
- Use case examples
- Mockups/sketches
- Acceptance criteria

### Pull Request Template (`pull_request_template.md`)

Provides a comprehensive checklist:
- Code quality checks
- Testing requirements
- Documentation updates
- Security review
- Database changes (if applicable)
- Deployment checklist

**Auto-fills for all PRs** with helpful reminders about:
- Self-review
- Tests
- Comments
- Documentation
- Breaking changes

## 👥 Code Owners (`CODEOWNERS`)

Automatically assigns reviewers to PRs based on files changed:

```
backend/**           @Aditya-Prakash14
frontend/**          @Aditya-Prakash14
.github/**           @Aditya-Prakash14
```

## 🔐 Secrets Required

For workflows to function, add these secrets to GitHub:

### Vercel Secrets (Deployment)
- `VERCEL_TOKEN` - Personal API token
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID` - Project ID

### Database (Migrations)
- `DATABASE_URL` - PostgreSQL connection string
- `VERCEL_DATABASE_URL` - Vercel Postgres URL (optional)

### Notifications (Optional)
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications

### Security (Optional)
- `SNYK_TOKEN` - Snyk security scanning
- `SONAR_TOKEN` - SonarQube analysis

**Setup Guide:** See [WORKFLOWS_SETUP.md](./WORKFLOWS_SETUP.md)

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────┐
│  Code Pushed to GitHub                  │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    CI Workflow          Code Quality
    (mandatory)           (informational)
        │                     │
        ├──────────┬──────────┤
        │          │          │
      PASS      FAIL      PASS/FAIL
        │          │
        │      ❌ Block Merge
        │
    Deploy Workflow (if main branch)
        │
        ├─ Vercel Deploy
        ├─ DB Migrations
        ├─ Smoke Tests
        └─ Slack Notify
        │
    ✅ Live!
```

## 🚀 Quick Start

### 1. Setup Workflows

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add required secrets (see above)
3. Verify workflow files are in `.github/workflows/`

### 2. Test Workflows

```bash
# Create test branch
git checkout -b test/workflows

# Make a change and push
echo "test" >> test.txt
git add .
git commit -m "test: trigger workflows"
git push origin test/workflows

# Go to Actions tab to see workflows running
```

### 3. View Results

- Go to repository
- Click **Actions** tab
- Click workflow run
- View real-time logs

## 📚 Documentation

### For Developers

- [WORKFLOWS_SETUP.md](./WORKFLOWS_SETUP.md) - Complete workflow setup guide
- [../CONTRIBUTING.md](../CONTRIBUTING.md) - Contributing guidelines
- [../QUICKREF.md](../QUICKREF.md) - Quick reference for common tasks

### For Operations

- [../DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment procedures
- [../README.md](../README.md) - Project overview

## 🔧 Customization

### Modify CI Pipeline

Edit `.github/workflows/ci.yml` to:
- Add/remove test suites
- Change Node version
- Add security checks
- Customize coverage requirements

### Modify Deployment

Edit `.github/workflows/deploy.yml` to:
- Change target platform (currently Vercel)
- Add additional deployment steps
- Modify health checks
- Update notification channels

### Update Templates

Modify issue and PR templates to match your:
- Development process
- Deployment process
- Team requirements
- Documentation standards

## 🆘 Troubleshooting

### Workflows Not Running

1. Check workflow files are in `.github/workflows/`
2. Verify YAML syntax is correct
3. Check branch protection rules
4. Ensure secrets are configured

### CI Failing

1. Check workflow logs in Actions tab
2. Run tests locally to debug
3. Review error messages
4. Fix and push new commit

### Secrets Not Found

1. Verify secret names match workflow references
2. Check secret is added to correct repository
3. Ensure secret is set for correct environment
4. Recreate secret if needed

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [GitHub Marketplace - Actions](https://github.com/marketplace?type=actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides)

## 📞 Support

For workflow-related questions or issues:

1. Check [WORKFLOWS_SETUP.md](./WORKFLOWS_SETUP.md)
2. Review GitHub Actions documentation
3. Check workflow logs in Actions tab
4. Open a GitHub Discussion or Issue

---

**Last Updated:** May 2026  
**Status:** ✅ Production Ready  
**Maintainer:** Aditya Prakash
