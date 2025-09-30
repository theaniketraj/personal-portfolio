import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';

import { AnnotatedField } from '@/components/Annotated';
import { Action } from '@/components/atoms';
import { DynamicComponent } from '@/components/components-registry';
import {
    FadeIn,
    HoverScale,
    ParallaxText,
    ScrollBasedScale,
    StaggerContainer,
    StaggerItem
} from '@/components/motion';
import { HeroSection } from '@/types';
import { mapStylesToClassNames as mapStyles } from '@/utils/map-styles-to-class-names';
import Section from '../Section';

export default function ParallaxHeroSection(props: HeroSection) {
    const {
        elementId,
        colors,
        backgroundSize,
        title,
        subtitle,
        text,
        actions = [],
        media,
        styles = {}
    } = props;
    const flexDirection = styles?.self?.flexDirection ?? 'row';
    const alignItems = styles?.self?.alignItems ?? 'center';

    return (
        <Section
            elementId={elementId}
            colors={colors}
            backgroundSize={backgroundSize}
            styles={styles?.self}
        >
            <div className={classNames('flex', mapFlexDirectionStyles(flexDirection), mapStyles({ alignItems }))}>
                <div className="flex-1 flex flex-col justify-center">
                    <StaggerContainer className="space-y-6">
                        {title && (
                            <StaggerItem>
                                <ParallaxText speed={0.1} direction="up">
                                    <AnnotatedField path=".title">
                                        <h1
                                            className={classNames(
                                                'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight',
                                                styles?.title ? mapStyles(styles?.title) : null
                                            )}
                                        >
                                            {title}
                                        </h1>
                                    </AnnotatedField>
                                </ParallaxText>
                            </StaggerItem>
                        )}
                        {subtitle && (
                            <StaggerItem>
                                <ParallaxText speed={0.15} direction="left">
                                    <AnnotatedField path=".subtitle">
                                        <p
                                            className={classNames(
                                                'text-xl sm:text-2xl lg:text-3xl text-opacity-90',
                                                styles?.subtitle ? mapStyles(styles?.subtitle) : null
                                            )}
                                        >
                                            {subtitle}
                                        </p>
                                    </AnnotatedField>
                                </ParallaxText>
                            </StaggerItem>
                        )}
                        {text && (
                            <StaggerItem>
                                <FadeIn direction="up" delay={0.3}>
                                    <AnnotatedField path=".text">
                                        <Markdown
                                            options={{ forceBlock: true, forceWrapper: true }}
                                            className={classNames(
                                                'prose prose-lg max-w-none',
                                                styles?.text ? mapStyles(styles?.text) : null
                                            )}
                                        >
                                            {text}
                                        </Markdown>
                                    </AnnotatedField>
                                </FadeIn>
                            </StaggerItem>
                        )}
                        {actions.length > 0 && (
                            <StaggerItem>
                                <FadeIn direction="up" delay={0.4}>
                                    <AnnotatedField path=".actions">
                                        <div
                                            className={classNames(
                                                'flex flex-wrap gap-4 pt-4',
                                                styles?.actions ? mapStyles(styles?.actions) : null
                                            )}
                                        >
                                            {actions.map((action, index) => (
                                                <HoverScale key={`action-${action.label || index}`} scale={1.05}>
                                                    <Action
                                                        {...action}
                                                        className="inline-flex"
                                                    />
                                                </HoverScale>
                                            ))}
                                        </div>
                                    </AnnotatedField>
                                </FadeIn>
                            </StaggerItem>
                        )}
                    </StaggerContainer>
                </div>
                {media && (
                    <div className="flex-1 flex justify-center lg:justify-end">
                        <ScrollBasedScale scaleRange={[0.9, 1.1]}>
                            <ParallaxText speed={0.2} direction="right">
                                <AnnotatedField path=".media">
                                    <HeroMedia media={media} />
                                </AnnotatedField>
                            </ParallaxText>
                        </ScrollBasedScale>
                    </div>
                )}
            </div>
        </Section>
    );
}

function HeroMedia({ media }: { media: any }) {
    return <DynamicComponent {...media} className="w-full max-w-lg" />;
}

function mapFlexDirectionStyles(flexDirection?: 'row' | 'row-reverse' | 'col' | 'col-reverse') {
    switch (flexDirection) {
        case 'row':
            return ['flex-row', 'space-x-8'];
        case 'row-reverse':
            return ['flex-row-reverse', 'space-x-reverse', 'space-x-8'];
        case 'col':
            return ['flex-col', 'space-y-8'];
        case 'col-reverse':
            return ['flex-col-reverse', 'space-y-reverse', 'space-y-8'];
        default:
            return ['flex-row', 'space-x-8'];
    }
}