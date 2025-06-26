---
type: ProjectLayout
title: VISTA
date: '2025-04-26'
client: Aniket Raj
description: VISTA - Version Increment and Semantic Tracking Automation.
featuredImage:
  type: ImageBlock
  url: 'https://assets.stackbit.com/components/images/default/post-4.jpeg'
  altText: Project thumbnail image
  caption: ''
  elementId: ''
media:
  type: ImageBlock
  url: 'https://assets.stackbit.com/components/images/default/post-4.jpeg'
  altText: Project image
  caption: Caption of the image
  elementId: ''
addTitleSuffix: true
colors: colors-a
backgroundImage:
  type: BackgroundImage
  url: /images/bg2.jpg
  backgroundSize: cover
  backgroundPosition: center
  backgroundRepeat: no-repeat
  opacity: 100
metaTitle: VISTA | Aniket Raj's Project
metaDescription: >-
  VISTA (Version Increment and Semantic Tracking Automation) is a CLI Gradle
  plugin designed to automate project version management using a version. 
  Properties file. | Aniket Raj's Project
metaTags:
  - type: MetaTag
    property: 'og:title'
    content: VISTA | Aniket Raj's Project
  - type: MetaTag
    property: 'og:description'
    content: >-
      VISTA (Version Increment and Semantic Tracking Automation) is a CLI Gradle
      plugin designed to automate project version management using a version. 
      Properties file. | Aniket Raj's Project
  - type: MetaTag
    property: 'og:type'
    content: Gradle Plugin
  - type: MetaTag
    property: 'og:url'
    content: 'https://plugins.gradle.org/plugin/io.github.theaniketraj.vista'
  - type: MetaTag
    property: 'og:title'
    content: ''
---
# Introducing VISTA

As part of the CEIE (Controlled Environment Integration Engine) ecosystem, **VISTA** represents our most advanced versioning solution—a Gradle plugin that automates semantic versioning, Git tagging, and rollback workflows directly within your build process. In this article, we’ll dive into VISTA’s architecture, configuration, and usage, and demonstrate how it elevates version control to a fully automated, enterprise-grade experience.

## Background: Why Custom Versioning Matters

Traditional versioning often relies on manual updates to `version.properties` or hard-coded version strings. This approach is:

*   **Error-Prone:** Developers may forget to bump minor or patch numbers.

*   **Inconsistent:** Different branches can drift out of sync.

*   **Opaque:** It can be difficult to trace how versions were calculated.

With VISTA, version management becomes:

*   **Deterministic:** Semantic version bumps are driven by commit metadata.

*   **Traceable:** Every version tag maps back to a concrete set of commits.

*   **Reversible:** Rollback tasks restore both code and version artifacts to known good states.

## Architecture Overview

VISTA is implemented as a Kotlin-based Gradle plugin and plugs into the standard Gradle lifecycle:

1.  **Initialization Phase**

    *   Reads an optional `version.properties` override.

    *   Scans Git history to determine the highest existing version tag.

2.  **Version Generation**

    *   Applies a semantic strategy (major/minor/patch) based on commit messages.

    *   Honors an explicit `version.properties` if present.

3.  **Injection & Build**

    *   Injects the computed version into `project.version` before compilation.

4.  **Release & Tagging**

    *   Creates a Git tag using a configurable prefix (e.g., `v1.2.3`).

    *   Pushes the tag to the remote repository.

Under the hood, VISTA leverages:

*   **JGit** for high-performance Git operations.

*   **Kotlin DSL** for a type-safe Gradle extension API.

*   **Conventional Commits** parsing to drive semver decisions.

## Installation

Add VISTA to your Gradle project by updating your `settings.gradle.kts` or `build.gradle.kts`:

```
plugins {
id("io.github.theaniketraj.vista") version "1.0.7" 
// Always use latest Version
}
```

Gradle will fetch the plugin from the Gradle Plugin Portal at build time.

## Configuration

Use the `vista { … }` extension block to customize behavior:

```
vista {
// Optional override file (highest priority)
versionFile.set(file("version.properties"))
// Enable automatic version bumps
autoIncrement.set(true)
// Versioning strategy: "semantic", "calendar", or any custom strategy
strategy.set("semantic")
// Prefix for Git tags
tagPrefix.set("v")
// Property name to apply to project.version
propertyName.set("projectVersion")
}
```

| Property        | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `versionFile`   | Path to `version.properties` for manual overrides                                              |
| `autoIncrement` | Boolean flag—when `true`, VISTA computes the next version automatically                        |
| `strategy`      | Versioning strategy; `"semantic"` interprets commit types, `"calendar"` uses date-based scheme |
| `tagPrefix`     | Prefix for version tags (e.g., `v1.2.3` vs. `1.2.3`)                                           |
| `propertyName`  | Gradle project property to which the version is assigned                                       |

## version.properties Override

Place a `version.properties` file in your project root to force a specific version:

```
version=2.3.0
buildMetadata=20250426.1423
```

When detected, VISTA will respect this explicit version rather than calculating one automatically—ideal for hotfixes or emergency patches.

## Tasks Provided

VISTA contributes four primary Gradle tasks:

| Task                   | Purpose                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `vistaGenerateVersion` | Generates and writes the next version to `version.properties` (if `autoIncrement` is enabled)       |
| `vistaApplyVersion`    | Sets `project.version` to the computed or overridden version before the compilation phase           |
| `vistaRelease`         | Tags the Git repository with the computed version and pushes the tag to the remote (e.g., `v2.3.0`) |
| `vistaRollback`        | Reverts `version.properties` and remotes tags to the previous stable version                        |

## CI/CD Integration

### GitHub Actions Example

```
name: Release
on:
push:
branches: [ main ]
jobs:
release:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v2
- uses: actions/setup-java@v3
with:
distribution: 'temurin'
java-version: '11'
- name: Generate and Apply Version
run: ./gradlew vistaGenerateVersion vistaApplyVersion
- name: Build
run: ./gradlew build
- name: Tag and Publish Release
run: ./gradlew vistaRelease
- name: Rollback (if needed)
if: failure()
run: ./gradlew vistaRollback
```

This pipeline ensures:

1.  **Automatic Version Bumping** on every push to `main`.

2.  **Unified Build Artifacts** with `project.version` set.

3.  **Automated Git Tagging and Pushing** for seamless release.

4.  **Conditional Rollback** in the event of pipeline failures.

## Best Practices

*   **Commit Message Standards:** Enforce Conventional Commits (e.g., `feat:`, `fix:`, `BREAKING CHANGE:`) to drive accurate semver changes.

*   **Branch Protection:** Restrict direct pushes to `main`; require pull-request reviews to maintain release integrity.

*   **Version File Discipline:** Only update `version.properties` via `vistaGenerateVersion` to preserve audit trails.

*   **Plugin Updates:** Regularly bump the VISTA plugin version to benefit from enhancements and security fixes.

## Benefits of VISTA

*   **Reliability:** Eliminates manual version errors.

*   **Traceability:** Each version maps to a clear Git tag and changelog entry.

*   **Reversibility:** Easy rollback of both code and version metadata.

*   **Integration:** Seamless with existing Gradle and Git workflows.

*   **Scalability:** Supports complex multi-module and multi-project builds.

## Conclusion

VISTA (CEIE 4.0) brings automated, semantically correct version management into your Gradle builds. By embedding version logic directly into your CI/CD pipelines and harnessing Git metadata, VISTA ensures that every release is consistent, traceable, and easily reversible—key attributes for modern software delivery at scale.

## Go-to

| [Repo ↗](https://github.com/theaniketraj/VISTA) | [Portal ↗](https://plugins.gradle.org/plugin/io.github.theaniketraj.vista) | [Docs ↗](https://ceie-docs.netlify.app/) |
| ----------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |

