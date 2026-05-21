## 📝 Description

Please include a summary of the changes and related context. Explain the **why** not just the **what**.

## 🔗 Related Issues

Fixes #(issue number)
Related to #(issue number)

## 🎯 Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Dependency update
- [ ] Refactoring
- [ ] Performance improvement

## 📋 Checklist

### Code Quality
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My code follows the project's style guidelines
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings

### Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests passed locally with my changes
- [ ] I have tested the changes manually
- [ ] No console errors in browser (for frontend changes)

### Database (if applicable)
- [ ] [ ] I have created/updated database migrations
- [ ] [ ] Migration has been tested locally
- [ ] [ ] Rollback procedure is documented (if needed)

### Security
- [ ] I have not hardcoded any secrets or credentials
- [ ] I have not introduced any security vulnerabilities
- [ ] I have validated all user inputs (for backend changes)
- [ ] I have protected against XSS (for frontend changes)

### Documentation
- [ ] [ ] Updated README.md if needed
- [ ] [ ] Updated API documentation if applicable
- [ ] [ ] Added/updated JSDoc comments
- [ ] [ ] Updated CHANGELOG.md if applicable

### Performance
- [ ] [ ] I have not introduced any significant performance regressions
- [ ] [ ] Database queries are optimized (if applicable)
- [ ] [ ] Bundle size impact is acceptable (for frontend changes)

## 🖼️ Screenshots / Videos

If applicable, add screenshots or videos showing the changes:

*Add screenshots here*

## 💻 How Has This Been Tested?

Please describe the tests you ran and how to reproduce them:

```bash
npm test
npm run dev
```

**Test Configuration:**
- Node.js version: x.x.x
- Database: PostgreSQL
- Browser (if frontend): Chrome/Firefox/Safari

## 📦 Deployment Checklist

- [ ] This change requires a database migration
- [ ] This change requires environment variable changes
- [ ] This is a breaking change for API consumers
- [ ] This requires a rollback plan

## 🔄 Migration Notes (if applicable)

If you have database migrations, describe:
- What data transformation occurs
- Any downtime required
- Rollback procedure

```sql
-- Example migration
-- Rollback: DROP TABLE new_table;
```

## 📝 Additional Context

Add any other context about the PR here. Include:
- Alternative approaches considered
- Potential issues or edge cases
- Performance considerations
- Dependencies on other PRs

## 🔖 Version Impact

- [ ] Patch (bug fix, non-breaking)
- [ ] Minor (new feature, non-breaking)
- [ ] Major (breaking change)

## ✅ Final Checklist

- [ ] All checks pass
- [ ] No merge conflicts
- [ ] Code review requirements met
- [ ] Ready for merge

---

**Thank you for contributing! 🎉**
