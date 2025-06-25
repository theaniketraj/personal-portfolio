---
type: PostLayout
title: Understanding How Git Works Under the Hood
date: '2025-05-23'
excerpt: >-
  A deep dive into Git’s internal mechanics: object model, staging, commits, 
  trees, and more. Learn how Git really works under the hood.
featuredImage:
  type: ImageBlock
  url: 'https://assets.stackbit.com/components/images/default/post-4.jpeg'
  altText: Post thumbnail image
  caption: Caption of the image
  elementId: ''
media:
  type: ImageBlock
  url: 'https://assets.stackbit.com/components/images/default/post-4.jpeg'
  altText: Post image
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
author: content/data/team/doris-soto.json
metaTitle: Understanding How Git Works Under the Hood | Aniket Raj's Tech Blog
metaDescription: >-
  A deep dive into Git’s internal mechanics: object model, staging, commits, 
  trees, and more. Learn how Git really works under the hood.
metaTags:
  - type: MetaTag
    property: 'og:title'
    content: Understanding How Git Works Under the Hood | Aniket Raj's Tech Blog
  - type: MetaTag
    property: 'og:type'
    content: Blog
  - type: MetaTag
    property: 'og:url'
    content: 'https://github.com/theaniketraj'
  - type: MetaTag
    property: 'og:url'
    content: 'https://linkedin.com/in/theaniketraj'
  - type: MetaTag
    property: 'twitter:creator'
    content: ''
  - type: MetaTag
    property: 'og:title'
    content: ''
---
**Introduction**

Git is more than just a version-control tool—it’s a content-addressable filesystem and a set of primitives upon which distributed collaboration is built. In this deep dive, we’ll strip away the “git add/commit/push” gloss and peer into Git’s innards: its object model, storage mechanics, and the workflows that emerge from them. By the end, you’ll appreciate why Git is fast, resilient, and remarkably flexible.

## 1. The Three States: Working Directory, Index, and Repository

1.  **Working Directory**

    *   Your editable files on disk.

2.  **Index (Staging Area)**

    *   A cached snapshot of what will go into the next commit.

3.  **Repository (.git folder)**

    *   Contains all commits, objects, refs, and metadata.

When you run `git add`, you’re copying changes from the Working Directory into the Index. A `git commit` transforms the Index into a new commit object inside the Repository.

## 2. The Git Object Model

At its core, Git stores four object types, each identified by a SHA-1 (or SHA-256) hash of its content:

1.  **Blob**

    *   Represents file data (contents only).

    *   No filename or metadata—just raw bytes.

2.  **Tree**

    *   A directory listing: maps filenames to blob or subtree SHA hashes plus permissions.

3.  **Commit**

    *   Points to one tree (the snapshot of your entire project), contains metadata (author, message, timestamp) and zero or more parent commit hashes.

4.  **Tag**

    *   A named pointer to a specific commit, optionally signed.

> **Why content-addressable?**
>
> Because the SHA is computed over the contents, identical blobs or trees are stored only once. This deduplication makes Git both space-efficient and self-verifying.

## 3. How a Commit Hooks Into History

Every commit object looks roughly like this:

```
tree   
parent            # absent for the very first commit
author   
committer   

Commit message explaining the snapshot…
```

Git treats these commits as nodes in a **Directed Acyclic Graph (DAG)**: each commit references its parent(s), forming a history chain (or multiple chains for merges).

## 4. References: Branches, Tags, and HEAD

*   **Branches** are simply files in `.git/refs/heads/` containing a single commit SHA.

*   **Tags** live in `.git/refs/tags/` and point to commits (or annotated tag objects).

*   **HEAD** is a special ref indicating your current checkout. It usually points to a branch ref (e.g., `refs/heads/main`) or directly to a commit (detached HEAD).

Changing branches (`git checkout`) means updating HEAD to point elsewhere, then rebuilding your Working Directory from the target commit’s tree.

## 5. The Index: Git’s Shopping Cart

Internally, the Index is a binary file `.git/index` that records:

*   File paths

*   Blob SHA references

*   File permissions and timestamps

When you `git commit`, Git takes the Index, writes a new tree object, then makes a commit object referencing that tree.

## 6. Storage on Disk: Loose Objects and Packfiles

*   **Loose Objects**: initially, each new blob/tree/commit is written as a compressed file under `.git/objects/xx/yyyy...`.

*   **Packfiles**: over time, Git consolidates loose objects into packfiles (`.git/objects/pack/pack-*.pack/.idx`) using delta compression to save space and speed up network transfer.

`git gc --auto` (garbage collection) handles packing, pruning unreachable objects, and optimizing performance.

## 7. Core Operations Under the Hood

*   **Commit**

    1.  Write blobs for staged files.

    2.  Build trees recursively from directories.

    3.  Create commit object pointing to root tree and parent.

    4.  Update branch ref to new commit SHA.

*   **Branch**

    *   Create or move a ref file under `.git/refs/heads/`.

*   **Merge**

    1.  Find common ancestor commit.

    2.  Perform a three-way merge of trees.

    3.  Write new merge commit with two parents.

*   **Rebase**

    *   Replay commits onto a new base by rewriting commit objects with updated parent SHAs.

*   **Checkout**

    1.  Read target commit’s tree.

    2.  Overwrite Working Directory and Index to match.

    3.  Update HEAD to the target ref or commit SHA.

## 8. Why Git Is So Fast and Reliable

*   **Data Integrity**: SHA hashing ensures any corruption is detected.

*   **Local-first**: nearly all operations read/write locally—no network needed.

*   **Immutable History**: commits never change once created, making rollbacks trivial.

*   **Delta Compression in Packs**: efficient storage and transfer.

## Conclusion

Understanding Git’s plumbing—its object model, references, and storage mechanisms—unlocks powerful workflows. You’re no longer just typing commands; you know what truly happens when you stage, commit, branch, or merge. Armed with this knowledge, you can diagnose low-level issues, craft advanced scripts, and leverage Git’s full potential in any development scenario.