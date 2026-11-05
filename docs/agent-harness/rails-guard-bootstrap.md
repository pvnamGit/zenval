# ADLC rails-guard bootstrap ceremony

Zenval acknowledges the current ADLC rail-freeze limitation: a rail introduced for the first time
in a pull request becomes enforceable only after it lands on the protected base. This does not
authorize bypassing an existing rail or editing an immutable trust root from an ordinary pull
request.

## Protected-base preconditions

Before merging the bootstrap change, the repository owner must confirm all of the following:

1. `main` requires pull requests for ordinary changes.
2. CODEOWNERS review is required, or an equivalent repository ruleset protects
   `.github/workflows/adlc-rails-guard.yml`.
3. Only the repository owner may use the one-time protected-base/admin ceremony to land this
   bootstrap diff despite the expected pre-bootstrap rails-guard failure.
4. The dedicated workflow and ADLC CLI version were reviewed before the acknowledgement and
   `trustedCodeownersAttested` fields were accepted.

The bootstrap pull request must remain draft until these repository settings are confirmed. The
first rails-guard run on that pull request is expected to fail because the acknowledgement is not
yet on `main`; the pull request cannot self-attest. After the owner merges the ceremony, rerun both:

```bash
adlc rails-guard-ci bootstrap --base origin/main
adlc rails-guard-ci --base origin/main
```

Then rerun any feature pull request that was blocked by the missing base acknowledgement.

## Ongoing trust-root changes

The dedicated workflow, CODEOWNERS, ADLC config, and ticket-store manifests are immutable trust
roots after bootstrap. Change them only through the ADLC trust-root authorization ceremony or the
protected-base admin path. Never add a feature-PR bypass to make the check pass.
