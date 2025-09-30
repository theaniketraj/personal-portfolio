import {
    ButtonAnimation,
    FadeIn,
    FloatingElement,
    HoverLift,
    HoverScale,
    Pulse,
    RotateOnHover,
    ScrollReveal,
    SlideIn,
    StaggerContainer,
    StaggerItem
} from '@/components/motion';

export default function AnimationDemo() {
    return (
        <div className="min-h-screen p-8 space-y-16">
            {/* Header */}
            <FadeIn direction="up">
                <h1 className="text-6xl font-bold text-center mb-4">
                    Framer Motion Animations Demo
                </h1>
                <p className="text-xl text-center text-gray-600">
                    Showcasing smooth page transitions, scroll-triggered animations, and micro-interactions
                </p>
            </FadeIn>

            {/* Page Transitions Demo */}
            <section className="space-y-8">
                <FadeIn direction="up" delay={0.2}>
                    <h2 className="text-4xl font-bold mb-8">Page Transitions</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Smooth page transitions are automatically applied to all page navigation.
                        The page fades in with a subtle scale and vertical movement.
                    </p>
                </FadeIn>
            </section>

            {/* Scroll Animations Demo */}
            <section className="space-y-8">
                <FadeIn direction="up">
                    <h2 className="text-4xl font-bold mb-8">Scroll-Triggered Animations</h2>
                </FadeIn>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <FadeIn direction="left">
                            <div className="p-6 bg-blue-100 rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2">Fade In from Left</h3>
                                <p>This element fades in from the left when scrolled into view.</p>
                            </div>
                        </FadeIn>

                        <FadeIn direction="right" delay={0.2}>
                            <div className="p-6 bg-green-100 rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2">Fade In from Right</h3>
                                <p>This element fades in from the right with a delay.</p>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.4}>
                            <div className="p-6 bg-purple-100 rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2">Fade In from Bottom</h3>
                                <p>This element fades in from the bottom.</p>
                            </div>
                        </FadeIn>
                    </div>

                    <div className="space-y-6">
                        <ScrollReveal>
                            <div className="p-6 bg-yellow-100 rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2">Scale Reveal</h3>
                                <p>This element scales in when scrolled into view.</p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div className="p-6 bg-red-100 rounded-lg">
                                <h3 className="text-2xl font-semibold mb-2">Scale Reveal with Delay</h3>
                                <p>This element scales in with a delay.</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Stagger Container Demo */}
                <FadeIn direction="up" delay={0.6}>
                    <h3 className="text-3xl font-semibold mb-6">Staggered Animations</h3>
                </FadeIn>

                <StaggerContainer className="grid md:grid-cols-3 gap-6">
                    <StaggerItem>
                        <div className="p-6 bg-indigo-100 rounded-lg">
                            <h4 className="text-xl font-semibold mb-2">Item 1</h4>
                            <p>Staggered animation item</p>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <div className="p-6 bg-pink-100 rounded-lg">
                            <h4 className="text-xl font-semibold mb-2">Item 2</h4>
                            <p>Staggered animation item</p>
                        </div>
                    </StaggerItem>
                    <StaggerItem>
                        <div className="p-6 bg-teal-100 rounded-lg">
                            <h4 className="text-xl font-semibold mb-2">Item 3</h4>
                            <p>Staggered animation item</p>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </section>

            {/* Micro-Interactions Demo */}
            <section className="space-y-8">
                <FadeIn direction="up">
                    <h2 className="text-4xl font-bold mb-8">Micro-Interactions</h2>
                </FadeIn>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <HoverLift>
                        <div className="p-6 bg-gray-100 rounded-lg border-2 border-gray-300">
                            <h3 className="text-xl font-semibold mb-2">Hover Lift</h3>
                            <p>Hover over this card to see it lift up.</p>
                        </div>
                    </HoverLift>

                    <HoverScale>
                        <div className="p-6 bg-gray-100 rounded-lg border-2 border-gray-300">
                            <h3 className="text-xl font-semibold mb-2">Hover Scale</h3>
                            <p>Hover over this card to see it scale up.</p>
                        </div>
                    </HoverScale>

                    <RotateOnHover rotation={5}>
                        <div className="p-6 bg-gray-100 rounded-lg border-2 border-gray-300">
                            <h3 className="text-xl font-semibold mb-2">Hover Rotate</h3>
                            <p>Hover over this card to see it rotate slightly.</p>
                        </div>
                    </RotateOnHover>
                </div>

                {/* Continuous Animations */}
                <FadeIn direction="up" delay={0.4}>
                    <h3 className="text-3xl font-semibold mb-6 mt-12">Continuous Animations</h3>
                </FadeIn>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                        <FloatingElement className="inline-block">
                            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4"></div>
                        </FloatingElement>
                        <h4 className="text-xl font-semibold">Floating Element</h4>
                        <p>This element floats up and down continuously.</p>
                    </div>

                    <div className="text-center">
                        <Pulse className="inline-block">
                            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4"></div>
                        </Pulse>
                        <h4 className="text-xl font-semibold">Pulsing Element</h4>
                        <p>This element pulses by scaling up and down.</p>
                    </div>
                </div>

                {/* Button Animations */}
                <FadeIn direction="up" delay={0.6}>
                    <h3 className="text-3xl font-semibold mb-6 mt-12">Button Animations</h3>
                </FadeIn>

                <div className="flex flex-wrap gap-4 justify-center">
                    <ButtonAnimation variant="scale">
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold">
                            Scale Animation
                        </button>
                    </ButtonAnimation>

                    <ButtonAnimation variant="bounce">
                        <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold">
                            Bounce Animation
                        </button>
                    </ButtonAnimation>

                    <ButtonAnimation variant="shake">
                        <button className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold">
                            Shake Animation
                        </button>
                    </ButtonAnimation>
                </div>
            </section>

            {/* Slide In Animations */}
            <section className="space-y-8">
                <FadeIn direction="up">
                    <h2 className="text-4xl font-bold mb-8">Slide In Animations</h2>
                </FadeIn>

                <div className="grid md:grid-cols-2 gap-8">
                    <SlideIn direction="left">
                        <div className="p-6 bg-orange-100 rounded-lg">
                            <h3 className="text-2xl font-semibold mb-2">Slide from Left</h3>
                            <p>This element slides in from the left on page load.</p>
                        </div>
                    </SlideIn>

                    <SlideIn direction="right">
                        <div className="p-6 bg-cyan-100 rounded-lg">
                            <h3 className="text-2xl font-semibold mb-2">Slide from Right</h3>
                            <p>This element slides in from the right on page load.</p>
                        </div>
                    </SlideIn>
                </div>
            </section>

            {/* Footer */}
            <FadeIn direction="up" delay={0.8}>
                <div className="text-center py-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Animation Implementation Complete! 🎉
                    </h2>
                    <p className="text-lg text-gray-600">
                        Your portfolio now features smooth page transitions, scroll-triggered animations,
                        and engaging micro-interactions powered by Framer Motion.
                    </p>
                </div>
            </FadeIn>
        </div>
    );
}