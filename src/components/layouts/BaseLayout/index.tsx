import * as React from 'react';

import { Annotated } from '@/components/Annotated';
import { BackgroundImage } from '@/components/atoms';
import Footer from '@/components/sections/Footer';
import Header from '@/components/sections/Header';
import { PageComponentProps } from '@/types';
import { PageModelType } from '@/types/generated';

type BaseLayoutProps = React.PropsWithChildren & PageComponentProps & PageModelType;

const BaseLayout: React.FC<BaseLayoutProps> = (props) => {
    const { global, ...page } = props;
    const { site } = global;

    // Debug logging for homepage
    console.log('BaseLayout rendering:', {
        hasGlobal: !!global,
        hasSite: !!site,
        hasHeader: !!site?.header,
        hasFooter: !!site?.footer,
        globalKeys: global ? Object.keys(global) : 'no global',
        siteKeys: site ? Object.keys(site) : 'no site'
    });

    return (
        <div className="flex flex-col grow">
            {page?.backgroundImage && <BackgroundImage {...page?.backgroundImage} />}
            
            {/* Debug info visible on page */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    right: 0, 
                    background: 'red', 
                    color: 'white', 
                    padding: '10px', 
                    fontSize: '12px',
                    zIndex: 9999
                }}>
                    Debug: Global={!!global}, Site={!!site}, Header={!!site?.header}, Footer={!!site?.footer}
                </div>
            )}
            
            {site.header && (
                <Annotated content={site}>
                    <Annotated content={site.header}>
                        <Header {...site.header} />
                    </Annotated>
                </Annotated>
            )}
            <Annotated content={page}>
                <main id="main" className="relative grow">
                    {props.children}
                </main>
            </Annotated>
            {site.footer && (
                <Annotated content={site}>
                    <Annotated content={site.footer}>
                        <Footer {...site.footer} />
                    </Annotated>
                </Annotated>
            )}
        </div>
    );
};

export default BaseLayout;
