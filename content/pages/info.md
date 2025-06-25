---
type: PageLayout
title: About
colors: colors-a
backgroundImage:
  type: BackgroundImage
  url: /images/bg4.jpg
  backgroundSize: cover
  backgroundPosition: center
  backgroundRepeat: no-repeat
  opacity: 75
sections:
  - elementId: ''
    colors: colors-f
    backgroundSize: full
    text: >+
      ## Hey, I’m a fourth-year B.Tech student specializing in Computer Science
      and Engineering. With a strong foundation in programming, data structures
      and algorithms, I’m passionate about leveraging technology to solve
      real-world problems. I’m driven by curiosity and a desire to innovate. Be
      it developing a new app, optimizing an algorithm, or exploring the latest
      trends in AI and machine learning, I’m always eager to learn and grow.

    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-16
          - pb-12
          - pl-4
          - pr-4
        textAlign: center
    type: HeroSection
  - type: DividerSection
    styles:
      self:
        width: wide
        padding:
          - pt-8
          - pb-8
          - pl-4
          - pr-4
        borderWidth: 1
        borderStyle: solid
  - type: MediaGallerySection
    colors: colors-f
    subtitle: Fluency
    images:
      - type: ImageBlock
        url: /images/Kotlin Monochrome Logo White Mark RGB.svg
        altText: Kotlin
        caption: ''
      - type: ImageBlock
        url: /images/icons8-java (1).svg
        altText: Java
        caption: ''
      - type: ImageBlock
        url: /images/icons8-android.svg
        altText: Android
        caption: Logo three
      - type: ImageBlock
        url: /images/icons8-git.svg
        altText: Git
        caption: ''
    spacing: 160
    columns: 4
    aspectRatio: auto
    showCaption: false
    enableHover: true
    styles:
      self:
        width: wide
        height: auto
        padding:
          - pt-8
          - pb-8
          - pl-4
          - pr-4
        textAlign: center
  - type: DividerSection
    styles:
      self:
        width: wide
        padding:
          - pt-8
          - pb-8
          - pl-4
          - pr-4
        borderWidth: 1
        borderStyle: solid
  - type: FeaturedItemsSection
    subtitle: 'You can find me here:'
    colors: colors-f
    items:
      - type: FeaturedItem
        actions:
          - type: Link
            label: NPM
            url: 'https://www.npmjs.com/~theaniketraj'
            showIcon: false
            iconPosition: right
            icon: arrowUpRight
        styles:
          self:
            textAlign: left
      - type: FeaturedItem
        actions:
          - type: Link
            label: Gradle
            url: 'https://plugins.gradle.org/u/theaniketraj'
            icon: arrowUpRight
            showIcon: false
            iconPosition: right
        styles:
          self:
            textAlign: left
      - type: FeaturedItem
        actions:
          - type: Link
            label: Dev.To
            url: 'https://dev.to/theaniketraj'
            showIcon: false
            icon: arrowUpRight
            iconPosition: right
        styles:
          self:
            textAlign: left
      - type: FeaturedItem
        actions:
          - type: Link
            label: X
            url: 'https://x.com/devxaniket'
            showIcon: false
            icon: twitter
            iconPosition: right
        styles:
          self:
            textAlign: left
      - type: FeaturedItem
        actions:
          - type: Link
            label: LinkedIN
            url: 'https://www.linkedin.com/in/theaniketraj/'
            showIcon: false
            icon: linkedin
            iconPosition: right
        styles:
          self:
            textAlign: left
        title: ''
      - type: FeaturedItem
        actions:
          - type: Link
            label: Discord
            url: 'https://discord.com/theaniketraj#8007'
            showIcon: false
            icon: arrowUpRight
        styles:
          self:
            textAlign: left
    columns: 3
    spacingX: 160
    spacingY: 25
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-8
          - pb-8
          - pl-4
          - pr-4
  - type: DividerSection
    styles:
      self:
        width: wide
        padding:
          - pt-12
          - pb-12
          - pl-4
          - pr-4
        borderWidth: 1
        borderStyle: solid
  - type: LabelsSection
    colors: colors-f
    subtitle: 'Skills:'
    items:
      - type: Label
        label: 'WEB 1, 2, 3'
      - type: Label
        label: Java
      - type: Label
        label: Kotlin
      - type: Label
        label: UI/UX
      - type: Label
        label: Android Studio
      - type: Label
        label: CI/CD Pipeline
      - type: Label
        label: Creative Writing
      - type: Label
        label: Netlify
      - type: Label
        label: GSAP
        url: ''
  - type: DividerSection
    styles:
      self:
        width: wide
        padding:
          - pt-12
          - pb-12
          - pl-4
          - pr-4
        borderWidth: 1
        borderStyle: solid
  - type: TextSection
    variant: variant-a
    subtitle: 'Contact:'
    colors: colors-f
    text: |
      [theaniketraj@hotmail.com](mailto:theaniketraj@hotmail.com)
  - type: DividerSection
    styles:
      self:
        width: wide
        padding:
          - pt-8
          - pb-8
          - pl-4
          - pr-4
        borderWidth: 1
        borderStyle: solid
  - type: FeaturedItemsSection
    colors: colors-f
    items:
      - type: FeaturedItem
        subtitle: 'Education:'
        text: |+
          **2022 - present**

          *   Durgapur Institute of Advanced Technology and Management

          *   B. Tech CSE

          **2020 - 2022**

          *   Bhagwat Vidyapeeth, Chapra

          *   Intermediate, Science

          *   Grade: A+

          **2018 - 2020**

          *   Bhagwat Vidyapeeth, Chapra

          *   Matriculation, Science

          *   Grade: A+

        styles:
          self:
            textAlign: left
    columns: 2
    spacingX: 60
    spacingY: 60
    styles:
      self:
        height: auto
        width: wide
        padding:
          - pt-8
          - pb-8
          - pl-4
          - pr-4
        textAlign: left
  - type: DividerSection
    styles:
      self:
        width: wide
        padding:
          - pt-12
          - pb-12
          - pl-4
          - pr-4
        borderWidth: 1
        borderStyle: solid
  - type: ContactSection
    backgroundSize: full
    title: "Let’s talk... \U0001F4AC"
    colors: colors-f
    form:
      type: FormBlock
      elementId: sign-up-form
      fields:
        - name: firstName
          label: First Name
          hideLabel: true
          placeholder: First Name
          isRequired: true
          width: 1/2
          type: TextFormControl
        - name: lastName
          label: Last Name
          hideLabel: true
          placeholder: Last Name
          isRequired: false
          width: 1/2
          type: TextFormControl
        - name: email
          label: Email
          hideLabel: true
          placeholder: Email
          isRequired: true
          width: full
          type: EmailFormControl
        - name: message
          label: Message
          hideLabel: true
          placeholder: Tell me about your project
          isRequired: true
          width: full
          type: TextareaFormControl
        - name: updatesConsent
          label: Sign me up to recieve my words
          isRequired: false
          width: full
          type: CheckboxFormControl
      submitLabel: "Submit \U0001F680"
      styles:
        self:
          textAlign: center
    styles:
      self:
        height: auto
        width: narrow
        margin:
          - mt-0
          - mb-0
          - ml-4
          - mr-4
        padding:
          - pt-12
          - pb-12
          - pr-4
          - pl-4
        flexDirection: row
        textAlign: left
metaTitle: About Aniket Raj | AI & Kotlin Innovator
metaDescription: >-
  Learn about Aniket Raj's journey in AI, Kotlin development, and embedded 
  systems. Passionate about tech innovation, automation & problem-solving.
addTitleSuffix: true
metaTags:
  - type: MetaTag
    property: 'og:title'
    content: About Aniket Raj
  - type: MetaTag
    property: 'og:description'
    content: >-
      Aniket Raj is an AI & Kotlin developer specializing in automation,     
      embedded systems and cutting-edge projects.
  - type: MetaTag
    property: 'og:url'
    content: ''
  - type: MetaTag
    property: 'og:title'
    content: ''
  - type: MetaTag
    property: 'og:title'
    content: ''
  - type: MetaTag
    property: 'og:title'
    content: ''
---
