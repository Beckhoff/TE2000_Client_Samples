// This file will be imported (as module) by the unit test spec files to mockup the TcHmi framework
// and create controls for testing.

// The following files are not part of the public API and may change without notice
// but needed for mockup of controls in unit tests.

// Load code to fill TcHmi namespace with all needed types and functions
import 'Beckhoff.TwinCAT.HMI.Framework/dist/index/TcHmi.js';
import { ControlAttributeType, ControlAttributeValueType } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/_Types.js';
import type { IManifestControlModuleData, IPackage } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/_Types.js';
import { Data } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/System.js';
import { __rebuildLocalizationCache as rebuildLocalizationCache } from 'Beckhoff.TwinCAT.HMI.Framework/dist/API/Localization.js';
import { accessManager } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/AccessManager.js';
import { bindingManager } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/BindingManager.js';
import { controlManager } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/ControlManager.js';
import { triggerManager } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/TriggerManager.js';
import type { Binding } from 'Beckhoff.TwinCAT.HMI.Framework/dist/System/Binding.js';

export const mappingControlTypeToFolders = new Map<string, {
    /** package folder */
    packageFolder: string;
    /** control folder */
    controlFolder: string;
}>([
    ["TcHmi.Controls.ExampleControl.ColorChange", {
        packageFolder: "ExampleControl",
        controlFolder: "ColorChange"
    }]
]);


/**
 * Prepares the mockup system for one control type.
 * Mockups some basic system services to start most controls.
 * Call this function multiple times if embedded controls are needed.
 * @param controlType controlType as fqn like TcHmi.Controls.Beckhoff.TcHmiPasswordInput
 */
export function prepareSystemForControlType<
    C extends TcHmi.Controls.System.TcHmiControl = TcHmi.Controls.System.TcHmiControl,
>(
    controlType: string,
    controlConstructor: TcHmi.Controls.baseTcHmiControlConstructor<C>,
    options?: {
        keepBindingManager?: boolean;
        keepTriggerManager?: boolean;
        nugetId?: string;
        basePath?: string;
    },
) {
    mockupControls.clear();

    nameToClassMap.set(controlType, controlConstructor);

    const controlTypeArray = controlType.split('.');
    const controlTypeScopedName = controlTypeArray.pop();
    const controlNamespace = controlTypeArray.join('.');
    /* **************** fill/cleanup internal data of framework ****************/
    rebuildLocalizationCache();
    if (!Data.Modules.controls) {
        Data.Modules.controls = {
            map: new Map(),
            array: [],
            urlMap: new Map(),
        };
    }
    Data.Modules.controls.map.set(controlType, {
        error: TcHmi.Errors.NONE,
        description: {
            name: controlTypeScopedName,
            namespace: controlNamespace,
        } as TcHmi.ControlDescription,
        package: {
            basePath: options?.basePath ? '/' + options.basePath : '/Beckhoff.TwinCAT.HMI.Controls',
            name: options?.nugetId ?? 'Beckhoff.TwinCAT.HMI.Controls',
        } as IPackage,
        manifestData: {
            basePath: controlTypeScopedName,
        } as IManifestControlModuleData,
    });
    /* **************** mockup main APIs of framework internals ****************/
    if (!jasmine.isSpy(controlManager.getControlsCache)) {
        spyOn(controlManager, 'getControlsCache').and.callFake(() => {
            return mockupControls;
        });
    }
    if (!jasmine.isSpy(controlManager.compile)) {
        spyOn(controlManager, 'compile').and.callFake((elem, _parent, _options) => {
            const subType = elem.getAttribute('data-tchmi-type')!;
            const subConstructor = nameToClassMap.get(subType);
            if (!subConstructor) {
                throw new Error(`Missing call of ControlHelper.prepareSystemForControlType for '${subType}'`);
            }
            const subControl = createControl(subType, subConstructor, { controlId: elem.id });
            return { error: TcHmi.Errors.NONE, control: subControl as any };
        });
        spyOn(controlManager, 'destruct').and.callFake((_ctrl) => { });
        spyOn(controlManager, 'getDescriptionTypes').and.callFake((type) => [
            'TcHmi.Controls.System.TcHmiControl',
            type!,
        ]);
        spyOn(controlManager, 'getDescriptionAttributeByPropertyName').and.callFake((type, propertyName) => {
            return null;
        });
        spyOn(controlManager, 'getAttributeByPropertyName').and.callFake((control, propertyName) => {
            return null;
        });
        spyOn(controlManager, 'checkControlGeometryByControl').and.callFake((_ctrl) => { });
    }

    if (!jasmine.isSpy(triggerManager.register) && !options?.keepTriggerManager) {
        spyOn(triggerManager, 'register').and.callFake((_triggerArr) => () => { });
    }
    if (!jasmine.isSpy(bindingManager.getBinding) && !options?.keepBindingManager) {
        spyOn(bindingManager, 'getBinding').and.callFake((control, propertyName) => null);
        spyOn(bindingManager, 'getBindingsByControl').and.callFake((_control) => undefined);
        spyOn(bindingManager, 'createBinding').and.callFake((_expr, _propertyName, c) => ({}) as Binding);
        spyOn(bindingManager, 'removeBinding').and.callFake((_propertyName, _control, _bResetSetter) => { });
    }

    if (!jasmine.isSpy(accessManager.checkAccess)) {
        spyOn(accessManager, 'checkAccess').and.callFake((_control, _requestedAccessright): boolean | null => true);
        spyOn(accessManager, 'setControlRightOverride').and.callFake(
            (_control, _accessrightToOverride, _forcedRight): void => { },
        );
        spyOn(accessManager, 'getCurrentUserConfig').and.callFake(() => ({
            state: TcHmi.Server.userConfigState.noAuthRequired,
            userIsInGroups: ['__SystemUsers'],
            name: null,
            domain: null,
            locale: '',
            configLocale: 'project',
            timeFormatLocale: undefined,
            configTimeFormatLocale: undefined,
            timeZone: undefined,
            configTimeZone: undefined,
            timeZoneOffset: 0,
            clientIp: '',
            defaultAuthExtension: 'TcHmiUserManagement',
            defaultUserGroup: '',
            clientCertificate: null,
            autoLogOffMilliSeconds: null,
            session: null,
            errorMessage: '',
        }));
    }
}
/**
 * Cleans up the mockup system.
 * Removes some mockups of basic system services.
 */
export function cleanupSystem() {
    for (const control of mockupControls.values()) {
        // Detach to remove event listener and other stuff
        control.__detach();
    }
    mockupControls.clear();
    nameToClassMap.clear();
    rebuildLocalizationCache();
}
/**
 * Creates a real control instance from an constructor.
 * Calls __prevInit, __init, and __attach functions.
 * DOM elements from template.html will be available.
 * Attention: This does not call any setters (position, size or data)!
 *
 * @param controlType controlType as fqn like "TcHmi.Controls.Beckhoff.TcHmiPasswordInput"
 * @param controlConstructor control constructor object like TcHmi.Controls.Beckhoff.TcHmiPasswordInput
 */
export async function createControl<C extends TcHmi.Controls.System.TcHmiControl = TcHmi.Controls.System.TcHmiControl>(
    controlType: string,
    controlConstructor: TcHmi.Controls.baseTcHmiControlConstructor<C>,
    options?: {
        /** name of the id. Defaults to 'controlId' */
        controlId?: string;
        /** Should the control be detached? Defaults to false */
        detached?: boolean;
    },
): Promise<C> {
    const element = await GenerateTemplateElement(controlType);
    if (!element) {
        throw new Error(
            "Could not not generate the template string of control type " +
            controlType
        );
    }
    const controlId = options?.controlId ?? 'controlId';
    /* **************** create instance ****************/
    let rawControl: C;
    try {
        rawControl = new controlConstructor(
            $('<div id="' + controlId + '"></div>'),
            $('<div id="pcElem"></div>'),
            GenerateAttributeList(controlType, controlId),
        );
    } catch (ex) {
        throw new Error(
            `Failed to create a control with type ${controlType}. Perhaps you lack this call: \nTcHmiTest.ControlHelper.prepareSystemForControlType('${controlType}', ${controlType});`,
            { cause: ex },
        );
    }
    rawControl
        .getElement()
        .empty()
        .append(element.cloneNode(true) as typeof element);
    rawControl.__setPcElement($('<div></div>'));

    let functionThrowed = false;
    /* **************** start live cycle code to initialize ****************/
    expect(function () {
        functionThrowed = true;
        rawControl.__previnit.call(rawControl);
        functionThrowed = false;
    })
        .withContext('<' + controlType + '>.__previnit')
        .not.toThrow();
    if (functionThrowed) {
        // eslint-disable-next-line no-console
        console.error(
            'Try to add "TcHmiTest.ControlHelper.prepareSystemForControlType" call if this was an "Unknown control type" error.',
        );
    }
    expect(function () {
        rawControl.setGridRowIndex.call(rawControl, 0);
        rawControl.setGridColumnIndex.call(rawControl, 0);
    })
        .withContext('<' + controlType + '>.setGridRowIndex/setGridColumnIndex')
        .not.toThrow();

    rawControl.__setLifeCycleState(LifeCycleState.AttributesInitialized);
    expect(function () {
        rawControl.__init.call(rawControl);
    })
        .withContext('<' + controlType + '>.__init should not throw')
        .not.toThrow();

    spyOn<any>(rawControl, '__requestAsyncWork').and.callFake(() => {
        rawControl['__doAsyncWork'].call(rawControl);
        return;
    });

    if (!options?.detached) {
        /* **************** fake attach ****************/
        rawControl.__setLifeCycleState(LifeCycleState.Attached);
        expect(function () {
            //call attach for the onPressed event registration
            rawControl.__attach.call(rawControl);
        })
            .withContext('<' + controlType + '>.__attach should not throw')
            .not.toThrow();
    }

    spyOn(rawControl as any, 'getIsEnabled').and.returnValue(true);
    if (!jasmine.isSpy(TcHmi.Access.checkAccess)) {
        spyOn(TcHmi.Access, 'checkAccess').and.returnValue(true);
    }

    mockupControls.set(controlId, rawControl);
    return rawControl;
}

/* ********************* Needed for framework tests only ********************* */

/** key is the control id */
const mockupControls = new Map<string, TcHmi.Controls.System.TcHmiControl>();
const nameToClassMap = new Map<
    string,
    TcHmi.Controls.baseTcHmiControlConstructor<TcHmi.Controls.System.TcHmiControl>
>();

/**
 *
 * @param controlType controlType as fqn like TcHmi.Controls.Beckhoff.TcHmiPasswordInput
 */
export async function GenerateTemplateElement(controlType: string) {
    const { packageFolder, controlFolder } = mappingControlTypeToFolders.get(controlType) ?? {};
    if (!packageFolder || !controlFolder) {
        throw new Error("Unknown control type: " + controlType);
    }
    // fetch template from jasmine "middleware" config
    const response = await fetch(`/${packageFolder}/${controlFolder}/Template.html`);
    if (!response.ok) {
        throw new Error(
            "Could not not fetch template for control type " + controlType
        );
    }
    const templateHtml = await response.text();
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = templateHtml?.replace(/{Id}/g, "controlId") ?? "";
    return (tempDiv.firstElementChild ?? tempDiv) as HTMLElement;
}

/**
 *
 * @param controlType controlType as fqn like TcHmi.Controls.Beckhoff.TcHmiPasswordInput
 */
export function GenerateAttributeList(
    controlType: string,
    controlId = 'controlId',
): TcHmi.Controls.ControlAttributeList {
    let ctrlAttr = {
        'data-tchmi-type': {
            name: 'data-tchmi-type',
            valueType: ControlAttributeValueType.Simple,
            type: ControlAttributeType.Control,
            descr: null,
            value: controlType,
        },
        'id': {
            name: 'id',
            valueType: ControlAttributeValueType.Simple,
            type: ControlAttributeType.Control,
            descr: null,
            value: controlId,
        },
    } as TcHmi.Controls.ControlAttributeList;
    if (controlType === 'TcHmi.Controls.System.TcHmiUserControlHost') {
        ctrlAttr['data-tchmi-target-user-control'] = {
            name: 'data-tchmi-target-user-control',
            descr: null,
            value: 'mockup.usercontrol',
        };
    }
    return ctrlAttr;
}

// copy from System/_Types.ts, because it is not exported and needed for the mockup
const enum LifeCycleState {
    // Constructed = 0,
    // PrevInitialized = 10,
    AttributesInitialized = 15,
    // Initialized = 20,
    Attached = 30,
    /** Will be detached in the near future. */
    StartDetaching = 36,
    /** Will not be detached in near the future. */
    StopDetaching = 37,
    Detached = 40,
    // Destroy must be handled by the control itself
}
