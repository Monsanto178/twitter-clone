import './bootstrap';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import React, { ReactNode } from 'react'
import Layout from './Layout/Layout';

type PageWithLayout = {
  default: React.FC & {
    layout?: (page: React.JSX.Element) => React.JSX.Element;
  };
};

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true }) as Record<string, PageWithLayout>;
    const page =  pages[`./Pages/${name}.tsx`];
    page.default.layout = 
        page.default.layout || ((page: ReactNode) => <Layout> {page}</Layout>);
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
  progress: {
    color: '#fff',
  }
})