declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
declare module 'bootstrap/js/dist/carousel' {
  export default class Carousel {
    constructor(element: HTMLElement, options?: any);
    to(index: number): void;
    dispose(): void;
    pause(): void;
    cycle(): void;
  }
}