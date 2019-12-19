## Master Redmine ticket
* (Required!)

## Checklist:

### Angular
* (ensure the following commands return no errors or warnings, this repo uses husky to perform pre-commit checks to correct linter errors, but some may not be auto-fixed)

```
ng lint
ng test
npm audit
```

### Rails
* (ensure specs are passing from the Rails API)

```
bundle exec rake parallel:spec[4]
```

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings (in terminal, and in browser console)
- [ ] New and existing unit tests pass locally with my changes

## Functional Testing
* (For testing locally)

## Deployment
* (for release manager and/or build manager)
