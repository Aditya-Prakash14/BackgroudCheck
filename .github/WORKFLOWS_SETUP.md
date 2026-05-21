# GitHub Actions CI/CD Setup Guide

Complete guide to set up GitHub Actions for the BGV Platform with automated testing, building, and deployment.

## 📋 Workflows Overview

### 1. **CI Workflow** (`ci.yml`)
Runs on every push and pull request to main/develop branches.

**Jobs:**
- ✅ Lint & Test Backend (Jest tests + coverage)
- ✅ Lint Frontend (ESLint)
- ✅ Build Frontend (Next.js production build)
- ✅ Security Scan (Snyk)
- ✅ Dependency Check (npm audit)

### 2. **Deploy Workflow** (`deploy.yml`)
Runs on push to main branch after CI passes.

**Jobs:**
- ✅ Deploy to Vercel
- ✅ Run Database Migrations
- ✅ Run Smoke Tests
- ✅ Slack Notifications

### 3. **Code Quality Workflow** (`code-quality.yml`)
Runs on every push/PR for code quality analysis.

**Jobs:**
- ✅ Code Quality Analysis (SonarQube)
- ✅ Dependency Security Audit
- ✅ TypeScript Type Checking
- ✅ Docker Build Check
- ✅ PR Comment with Checklist

## 🔐 Required Secrets

### Vercel Secrets (for deploy.yml)
Required for automatic Vercel deployment.

**Setup:**
1. Go to [Vercel Dashboard → Settings → Tokens](https://vercel.com/account/tokens)
2. Create a new token
3. Add to GitHub Secrets:

| Secret | Value | Where to Get |
|--------|-------|-------------|
| `VERCEL_TOKEN` | Vercel personal API token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | Project settings page (URL) |
| `VERCEL_PROJECT_ID` | Vercel project ID | Project settings page (URL) |

### Database Secrets (for migrations)
Optional but recommended for production deployments.

| Secret | Value |
|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string |
| `VERCEL_DATABASE_URL` | Vercel Postgres connection string |

### Slack Webhook (for notifications)
Optional for Slack notifications on deploy success/failure.

**Setup:**
1. Create Slack App or use existing workspace
2. Create Incoming Webhook
3. Add to GitHub Secrets:

| Secret | Value |
|--------|-------|
| `SLACK_WEBHOOK_URL` | Slack webhook URL |

### SonarQube (for code quality)
Optional for code quality analysis.

| Secret | Value |
|--------|-------|
| `SONAR_HOST_URL` | SonarQube server URL |
| `SONAR_TOKEN` | SonarQube authentication token |

### Snyk (for security scanning)
Optional for dependency security scanning.

| Secret | Value |
|--------|-------|
| `SNYK_TOKEN` | Snyk API token |

## 🛠️ Setup Instructions

### Step 1: Add Secrets to GitHub

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each required secret

### Step 2: Add Vercel Secrets

```bash
# Get VERCEL_TOKEN from Vercel Dashboard
# Settings → Tokens → Create token (choose Full Access)

# Get VERCEL_ORG_ID from project URL
# vercel.com/dashboard/username/[ORG_ID]/projects

# Get VERCEL_PROJECT_ID from project settings
# vercel.com/username/[PROJECT_ID]/settings
```

### Step 3: Configure Slack Webhook (Optional)

```bash
# Create webhook in Slack:
# 1. Go to https://api.slack.com/apps
# 2. Create New App
# 3. Enable Incoming Webhooks
# 4. Create New Webhook URL
# 5. Add to GitHub Secrets as SLACK_WEBHOOK_URL
```

### Step 4: Enable SonarQube (Optional)

```bash
# For self-hosted SonarQube:
# 1. Set up SonarQube server
# 2. Create project token
# 3. Add SONAR_HOST_URL and SONAR_TOKEN to secrets

# Or use SonarCloud (free tier available)
# 1. Go to https://sonarcloud.io
# 2. Sign up with GitHub
# 3. Import repository
# 4. Get token from account settings
```

## 📦 Workflow Triggers

### CI Workflow
- **On Push:** When code is pushed to main or develop
- **On Pull Request:** When PR is created or updated
- **Runs:** ~5-10 minutes

### Deploy Workflow
- **On Push to main:** After CI passes
- **On successful CI:** From workflow_run trigger
- **Runs:** ~15-20 minutes

### Code Quality Workflow
- **On Push:** To main or develop
- **On Pull Request:** Against main or develop
- **Runs:** ~5 minutes

## ✅ Testing the Workflows

### Test CI Workflow

```bash
# Create a test branch
git checkout -b test/ci-workflow

# Make a small change
echo "# Test" >> test.txt

# Push to trigger workflow
git add .
git commit -m "test: trigger CI workflow"
git push origin test/ci-workflow

# Create PR to main
# GitHub will run CI automatically
```

### Test Deploy Workflow

```bash
# Once PR is merged to main
git push origin main

# Deploy workflow will run automatically
# Check Actions tab for progress
```

## 🔍 Monitoring Workflows

### View Workflow Status

1. Go to repository
2. **Actions** tab
3. Click on workflow run
4. View real-time logs

### Check Specific Job Logs

```bash
# Via GitHub Actions tab:
# 1. Click workflow run
# 2. Click job name
# 3. Expand any step to see logs
```

### View Deployment Status

```bash
# In Deploy workflow:
# - Check Vercel deployment status
# - View database migration logs
# - See smoke test results
# - Read Slack notifications
```

## 🐛 Troubleshooting

### CI Workflow Fails

**Issue:** Tests fail
```
Solution:
1. Check test logs in GitHub Actions
2. Run locally: npm test
3. Fix issues
4. Push to trigger workflow again
```

**Issue:** Linting errors
```
Solution:
1. Check lint logs
2. Run locally: npm run lint
3. Auto-fix: npm run lint -- --fix
4. Commit and push
```

### Deploy Workflow Fails

**Issue:** Vercel authentication fails
```
Solution:
1. Verify VERCEL_TOKEN is correct
2. Check token hasn't expired
3. Verify ORG_ID and PROJECT_ID
4. Re-generate token if needed
```

**Issue:** Database migration fails
```
Solution:
1. Check DATABASE_URL is correct
2. Verify database is accessible
3. Review migration files
4. Test locally first
```

**Issue:** Slack notification fails
```
Solution:
1. Verify SLACK_WEBHOOK_URL is correct
2. Check webhook is still valid in Slack
3. Ensure URL hasn't expired
4. Create new webhook if needed
```

### GitHub Actions Quota Exceeded

**Issue:** Workflows cancelled due to quota
```
Solution:
- Free tier: 2,000 minutes/month
- Pro tier: Unlimited
- Consider disabling some workflows for PRs
- Optimize job duration
```

## ⚡ Optimization Tips

### Reduce Workflow Time

1. **Cache dependencies**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

2. **Parallel jobs**
   ```yaml
   strategy:
     matrix:
       directory: [backend, frontend]
   ```

3. **Conditional execution**
   ```yaml
   if: github.event_name == 'push'
   ```

4. **Conditional steps**
   ```yaml
   steps:
     - name: Step
       if: success()
       run: npm test
   ```

### Cost Optimization

- Disable unnecessary workflows
- Run code quality checks only on PRs
- Deploy only from main branch
- Use matrix strategy for parallel jobs

## 📊 Viewing Workflow Metrics

### GitHub Actions Dashboard

1. Go to repository → Actions
2. View all workflows and their status
3. Check execution times
4. Monitor quota usage

### View Detailed Metrics

```bash
# GitHub CLI
gh run list
gh run view <run-id>
gh run view <run-id> --log
```

## 🔗 Integration with Other Tools

### Link with Slack

Slack will receive notifications for:
- ✅ Successful deployments
- ❌ Failed deployments
- 📊 Smoke test results

### Link with Vercel

Vercel shows:
- Build status in PR comments
- Deployment preview links
- Production deployment info

### Link with SonarQube

SonarQube displays:
- Code quality metrics
- Security vulnerabilities
- Code coverage
- Technical debt

## 🚀 Best Practices

### Workflow Best Practices

1. **Keep workflows fast** - Aim for <10 minutes for CI
2. **Use caching** - Cache node_modules and build artifacts
3. **Fail fast** - Run quick checks first (lint, type check)
4. **Clear names** - Use descriptive job and step names
5. **Error handling** - Use `continue-on-error` wisely

### Secret Management

1. **Never commit secrets** - Use GitHub Secrets only
2. **Rotate tokens regularly** - Update Vercel/Slack tokens quarterly
3. **Limited scope** - Use token with minimal required permissions
4. **Monitor usage** - Check GitHub Actions logs for misuse

### Deployment Best Practices

1. **Test before deploy** - Always run CI before deploy
2. **Review PRs** - Require reviews before merging to main
3. **Backup database** - Before running migrations in production
4. **Gradual rollout** - Use Vercel's preview deployments
5. **Monitor health** - Check smoke tests after deployment

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Slack API Documentation](https://api.slack.com)
- [SonarQube Documentation](https://docs.sonarqube.org)

## 🆘 Getting Help

### Check Workflow Logs

1. Actions tab → Workflow → Run → Job → Step
2. Expand failed step for full error message
3. Search error message in documentation

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Permission denied` | Check GitHub token and permissions |
| `Authentication failed` | Verify secrets are correct |
| `Timeout` | Increase timeout or optimize job |
| `Node version mismatch` | Update Node version in workflow |

### Debug Mode

Enable debug logging:
```bash
# Add this secret to GitHub:
# ACTIONS_STEP_DEBUG = true
```

Then re-run workflow to see verbose logs.

---

**Setup Status:** Ready to use  
**Next Step:** Add secrets to GitHub and test workflows  
**Support:** Check GitHub Actions tab for real-time logs
