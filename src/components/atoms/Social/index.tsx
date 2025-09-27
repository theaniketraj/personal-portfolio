import classNames from 'classnames';

import { Annotated } from '@/components/Annotated';
import { iconMap } from '@/components/svgs';
import Link from '../Link';

export default function Social(props) {
    const { elementId, className, label, altText, url, icon = 'facebook', target, rel, ...otherProps } = props;
    const IconComponent = iconMap[icon];

    // Debug: log the props to see what we're receiving
    console.log('Social component props:', { target, rel, url });

    // For external links, bypass the Link component and use a direct <a> tag
    const isExternal = url && (url.startsWith('http://') || url.startsWith('https://'));

    if (isExternal) {
        return (
            <Annotated content={props}>
                <a
                    href={url}
                    aria-label={altText}
                    id={elementId || null}
                    target={target || '_blank'}
                    rel={rel || 'noopener noreferrer'}
                    className={classNames('inline-flex items-center justify-center no-underline', className)}
                    {...otherProps}
                >
                    {label && <span className="sr-only">{label}</span>}
                    {IconComponent && <IconComponent className="fill-current w-icon h-icon" />}
                </a>
            </Annotated>
        );
    }

    return (
        <Annotated content={props}>
            <Link
                href={url}
                aria-label={altText}
                id={elementId || null}
                target={target}
                rel={rel}
                className={classNames('inline-flex items-center justify-center no-underline', className)}
                {...otherProps}
            >
                {label && <span className="sr-only">{label}</span>}
                {IconComponent && <IconComponent className="fill-current w-icon h-icon" />}
            </Link>
        </Annotated>
    );
}
