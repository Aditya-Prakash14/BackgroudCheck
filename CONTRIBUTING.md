# Contributing to BGV Platform

Thank you for your interest in contributing to the BGV Platform! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [CI/CD Pipeline](#cicd-pipeline)
- [Release Process](#release-process)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to treat each other with respect and professionalism.

### Unacceptable Behavior

- Harassment, discrimination, or bullying
- Disrespectful language or personal attacks
- Posting of private information without consent
- Any form of spam or unsolicited advertising

### Enforcement

Reports of unacceptable behavior can be sent to the project maintainers. All complaints will be reviewed and investigated fairly.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 12+
- Git
- GitHub account

### Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/BackgroudCheck.git
cd BackgroudCheck

# Add upstream remote
git remote add upstream https://github.com/Aditya-Prakash14/BackgroudCheck.git
```

### Setup Development Environment

```bash
# Run setup script
bash setup.sh

# Or manually:
cd backend && npm install && npm run prisma:migrate
cd ../frontend && npm install
```

### Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/descriptive-name
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates
- `perf/` - Performance improvements

### 2. Make Changes

- Keep commits focused and logically organized
- Write clear, descriptive commit messages
- Test your changes frequently

### 3. Keep Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 4. Push Your Changes

```bash
git push origin feature/your-feature-name
```

## 📝 Commit Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding or updating tests
- **chore**: Changes to build process, dependencies, or tooling
- **ci**: Changes to CI/CD configuration

### Examples

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update deployment guide"
git commit -m "refactor(auth): improve token validation logic"
git commit -m "test: add unit tests for candidate service"
```

## 🔀 Pull Request Process

### Before Creating a PR

1. **Run tests locally**
   ```bash
   npm test
   ```

2. **Check for linting errors**
   ```bash
   npm run lint
   ```

3. **Update documentation** if needed

4. **Ensure branch is up to date**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Creating a PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Go to GitHub and click "Create Pull Request"**

3. **Fill out the PR template**
   - Provide clear description
   - Link related issues
   - Fill out checklist
   - Add screenshots if applicable

4. **Wait for CI checks to pass**

### PR Review Process

- At least one approval required
- All CI checks must pass
- Discussions may occur in comments
- Changes requested should be addressed promptly

### Merging a PR

- Use "Squash and merge" for single commits
- Use "Create a merge commit" for feature branches
- Delete branch after merging
- PR is automatically deployed to staging after merge to main

## 🧪 Testing

### Running Tests

**Backend:**
```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test auth.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

**Frontend:**
```bash
cd frontend
npm test
```

### Writing Tests

#### Backend (Jest)
```typescript
describe('Auth Service', () => {
  it('should register a new user', async () => {
    const user = await authService.register('user@example.com', 'password');
    expect(user).toBeDefined();
    expect(user.email).toBe('user@example.com');
  });
});
```

#### Frontend (Testing Library)
```typescript
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Test Coverage

Aim for at least 80% code coverage:

```bash
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

## 🎨 Code Style

### Backend (TypeScript)

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

async function getUserById(id: string): Promise<User> {
  return prisma.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
```

### Frontend (TypeScript/React)

```typescript
// ✅ Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
}

// ❌ Bad
function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Formatting

- Use `npm run lint` to check code style
- Use `npm run lint -- --fix` to auto-fix issues
- Prettier is configured for consistent formatting
- EditorConfig is configured for cross-editor consistency

## 📚 Documentation

### Update Documentation When

- Adding new features
- Changing API endpoints
- Modifying configuration options
- Adding new environment variables
- Changing deployment process

### Files to Update

- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment instructions
- `backend/README.md` - API documentation
- `frontend/README.md` - Frontend documentation
- Inline code comments for complex logic
- JSDoc comments for public APIs

### Documentation Style

```typescript
/**
 * Fetches a user by their ID.
 * @param id - The user's unique identifier
 * @returns The user object, or null if not found
 * @throws {DatabaseError} If the query fails
 * @example
 * const user = await getUserById('123');
 */
export async function getUserById(id: string): Promise<User | null> {
  // Implementation
}
```

## 🔄 CI/CD Pipeline

### Automated Checks

Your PR will automatically run:

1. **CI Checks** (`.github/workflows/ci.yml`)
   - ✅ Backend lint & tests
   - ✅ Frontend lint & build
   - ✅ Type checking
   - ✅ Security scan

2. **Code Quality** (`.github/workflows/code-quality.yml`)
   - ✅ SonarQube analysis
   - ✅ Dependency audit
   - ✅ Docker build check

3. **All checks must pass before merging**

### Viewing CI Results

1. Go to PR page
2. Scroll to "Checks" section
3. Click on failed check for details
4. Fix issues and push again

### If CI Fails

**Common issues:**
- **Linting errors:** Run `npm run lint -- --fix`
- **Test failures:** Run `npm test` locally to debug
- **Build errors:** Check Node version and dependencies

```bash
# Fix and push
npm run lint -- --fix
npm test
git add .
git commit --amend --no-edit
git push origin feature/your-feature-name -f
```

## 🎯 Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (e.g., 1.0.0)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Preparing a Release

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Create release PR** with changes
4. **Get approval** and merge to main
5. **Create GitHub Release** with tag and notes

### Deployment After Release

1. Merge to main triggers deployment workflow
2. Tests run and must pass
3. Automatic deployment to Vercel
4. Smoke tests run
5. Slack notification sent

## ✅ Checklist Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] Tests are added/updated and passing
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] No console errors/warnings
- [ ] PR template is filled out
- [ ] Linked related issues

## 🆘 Getting Help

### Resources

- **Documentation:** [README.md](../README.md)
- **Deployment Guide:** [DEPLOYMENT.md](../DEPLOYMENT.md)
- **API Docs:** [backend/README.md](../backend/README.md)
- **GitHub Issues:** Search existing issues
- **Discussions:** Start a discussion for questions

### Asking Questions

1. Search existing issues and discussions first
2. Check documentation
3. Create a GitHub Discussion
4. Be specific about the problem
5. Include code snippets and error messages

## 🎉 Thank You!

Your contributions make BGV Platform better. Whether it's code, documentation, or bug reports, we appreciate your help!

---

**Questions?** Open a GitHub Discussion or issue.  
**Ready to contribute?** Fork the repo and create a PR!  
**Want to learn more?** Check out [QUICKREF.md](../QUICKREF.md)
