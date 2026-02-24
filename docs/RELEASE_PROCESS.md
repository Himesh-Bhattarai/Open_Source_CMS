# Release Process

This repo ships to production via the `deploy` branch, but releases are tracked by Git tags and `CHANGELOG.md`.

## Versioning
- Use Semantic Versioning: MAJOR.MINOR.PATCH.
- Use tag format `vX.Y.Z`.
- Keep `CHANGELOG.md` in sync with tagged versions.

## Prepare
1. Decide the next version number.
2. Update `CHANGELOG.md` by moving items from `Unreleased` into a new version section with the release date.
3. If you want package versions to match the release, update `Client/package.json` and `Server/package.json`.
4. Run checks: `npm run test` and `npm --prefix Client run build`.

## Release
1. Merge the release PR to `main`.
2. Create a tag at the release commit: `git tag vX.Y.Z`.
3. Push the tag: `git push origin vX.Y.Z`.
4. The `release.yml` workflow creates a GitHub Release.

## Deploy
1. Open a PR from `main` to `deploy`.
2. Merge to `deploy` to trigger the production workflow in `.github/workflows/deploy.yml`.

## Hotfix
1. Branch from the last release tag.
2. Apply the fix and bump the patch version.
3. Tag and release using the same steps, then promote to `deploy`.
