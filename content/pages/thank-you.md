---
type: PageLayout
title: Thank You!
colors: colors-a
backgroundImage:
  type: BackgroundImage
  url: /images/bg1.jpg
  backgroundSize: cover
  backgroundPosition: center
  backgroundRepeat: no-repeat
  opacity: 100
sections:
  - type: HeroSection
    elementId: ''
    colors: colors-f
    backgroundSize: full
    title: Thank You! 🎉
    subtitle: >-
      Your message has been received! I appreciate you reaching out and will get
      back to you within 24-48 hours.
    actions:
      - type: Button
        label: Back to Home
        url: /
        style: primary
        elementId: ''
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-36
          - pb-36
          - pl-4
          - pr-4
        textAlign: center
        flexDirection: row
  - type: FeaturedItemsSection
    colors: colors-f
    subtitle: 'In the meantime, you can:'
    items:
      - type: FeaturedItem
        title: Check out my projects
        text: >-
          Browse through my latest work in AI, Kotlin development, and embedded
          systems.
        actions:
          - type: Link
            label: View Projects
            url: /projects
            showIcon: true
            icon: arrowRight
            iconPosition: right
        styles:
          self:
            textAlign: left
      - type: FeaturedItem
        title: Read my blog
        text: >-
          Discover insights on modern web development, AI, and technology trends.
        actions:
          - type: Link
            label: Read Blog
            url: /blog
            showIcon: true
            icon: arrowRight
            iconPosition: right
        styles:
          self:
            textAlign: left
      - type: FeaturedItem
        title: Connect with me
        text: >-
          Follow me on social media or check out my open-source contributions.
        actions:
          - type: Link
            label: View Profile
            url: /info
            showIcon: true
            icon: arrowRight
            iconPosition: right
        styles:
          self:
            textAlign: left
    variant: variant-c
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        textAlign: center
metaTitle: Thank You - Message Received | Aniket Raj
metaDescription: >-
  Thank you for contacting me! Your message has been received and I'll respond
  within 24-48 hours.
addTitleSuffix: true
---
