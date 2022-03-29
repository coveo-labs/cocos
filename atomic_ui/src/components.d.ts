/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ModalStatus } from "./components/code-search-preview-modal/code-search-preview-modal";
import { Result } from "@coveo/atomic/headless";
export namespace Components {
    interface CodeSearchComponent {
        "checked": boolean;
        "checkedColor": string;
        "fixQuery": (request: any, clientOrigin: any) => Promise<any>;
        "fixResults": (response: any) => Promise<any>;
        "type": string;
        "uncheckedColor": string;
    }
    interface CodeSearchPreviewModal {
        "modalStatus": ModalStatus;
        "open": (code: string, filename: string, top: number) => Promise<void>;
        "openButton"?: HTMLElement;
    }
    interface CodeSearchPreviewResultComponent {
    }
    interface DevIconsResultComponent {
        "currentResult"?: Result;
    }
    interface FindUsageResultComponent {
    }
    interface RecentlyOpenedComponent {
    }
    interface ResultsManager {
    }
}
declare global {
    interface HTMLCodeSearchComponentElement extends Components.CodeSearchComponent, HTMLStencilElement {
    }
    var HTMLCodeSearchComponentElement: {
        prototype: HTMLCodeSearchComponentElement;
        new (): HTMLCodeSearchComponentElement;
    };
    interface HTMLCodeSearchPreviewModalElement extends Components.CodeSearchPreviewModal, HTMLStencilElement {
    }
    var HTMLCodeSearchPreviewModalElement: {
        prototype: HTMLCodeSearchPreviewModalElement;
        new (): HTMLCodeSearchPreviewModalElement;
    };
    interface HTMLCodeSearchPreviewResultComponentElement extends Components.CodeSearchPreviewResultComponent, HTMLStencilElement {
    }
    var HTMLCodeSearchPreviewResultComponentElement: {
        prototype: HTMLCodeSearchPreviewResultComponentElement;
        new (): HTMLCodeSearchPreviewResultComponentElement;
    };
    interface HTMLDevIconsResultComponentElement extends Components.DevIconsResultComponent, HTMLStencilElement {
    }
    var HTMLDevIconsResultComponentElement: {
        prototype: HTMLDevIconsResultComponentElement;
        new (): HTMLDevIconsResultComponentElement;
    };
    interface HTMLFindUsageResultComponentElement extends Components.FindUsageResultComponent, HTMLStencilElement {
    }
    var HTMLFindUsageResultComponentElement: {
        prototype: HTMLFindUsageResultComponentElement;
        new (): HTMLFindUsageResultComponentElement;
    };
    interface HTMLRecentlyOpenedComponentElement extends Components.RecentlyOpenedComponent, HTMLStencilElement {
    }
    var HTMLRecentlyOpenedComponentElement: {
        prototype: HTMLRecentlyOpenedComponentElement;
        new (): HTMLRecentlyOpenedComponentElement;
    };
    interface HTMLResultsManagerElement extends Components.ResultsManager, HTMLStencilElement {
    }
    var HTMLResultsManagerElement: {
        prototype: HTMLResultsManagerElement;
        new (): HTMLResultsManagerElement;
    };
    interface HTMLElementTagNameMap {
        "code-search-component": HTMLCodeSearchComponentElement;
        "code-search-preview-modal": HTMLCodeSearchPreviewModalElement;
        "code-search-preview-result-component": HTMLCodeSearchPreviewResultComponentElement;
        "dev-icons-result-component": HTMLDevIconsResultComponentElement;
        "find-usage-result-component": HTMLFindUsageResultComponentElement;
        "recently-opened-component": HTMLRecentlyOpenedComponentElement;
        "results-manager": HTMLResultsManagerElement;
    }
}
declare namespace LocalJSX {
    interface CodeSearchComponent {
        "checked"?: boolean;
        "checkedColor"?: string;
        "type"?: string;
        "uncheckedColor"?: string;
    }
    interface CodeSearchPreviewModal {
        "modalStatus": ModalStatus;
        "openButton"?: HTMLElement;
    }
    interface CodeSearchPreviewResultComponent {
    }
    interface DevIconsResultComponent {
        "currentResult"?: Result;
    }
    interface FindUsageResultComponent {
    }
    interface RecentlyOpenedComponent {
    }
    interface ResultsManager {
    }
    interface IntrinsicElements {
        "code-search-component": CodeSearchComponent;
        "code-search-preview-modal": CodeSearchPreviewModal;
        "code-search-preview-result-component": CodeSearchPreviewResultComponent;
        "dev-icons-result-component": DevIconsResultComponent;
        "find-usage-result-component": FindUsageResultComponent;
        "recently-opened-component": RecentlyOpenedComponent;
        "results-manager": ResultsManager;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "code-search-component": LocalJSX.CodeSearchComponent & JSXBase.HTMLAttributes<HTMLCodeSearchComponentElement>;
            "code-search-preview-modal": LocalJSX.CodeSearchPreviewModal & JSXBase.HTMLAttributes<HTMLCodeSearchPreviewModalElement>;
            "code-search-preview-result-component": LocalJSX.CodeSearchPreviewResultComponent & JSXBase.HTMLAttributes<HTMLCodeSearchPreviewResultComponentElement>;
            "dev-icons-result-component": LocalJSX.DevIconsResultComponent & JSXBase.HTMLAttributes<HTMLDevIconsResultComponentElement>;
            "find-usage-result-component": LocalJSX.FindUsageResultComponent & JSXBase.HTMLAttributes<HTMLFindUsageResultComponentElement>;
            "recently-opened-component": LocalJSX.RecentlyOpenedComponent & JSXBase.HTMLAttributes<HTMLRecentlyOpenedComponentElement>;
            "results-manager": LocalJSX.ResultsManager & JSXBase.HTMLAttributes<HTMLResultsManagerElement>;
        }
    }
}