namespace TcHmiTest.ControlHelper {
    /**
     * Prepares the mockup system for one control type.
     * Mockups some basic system services to start most controls.
     * Call this function multiple times if embedded controls are needed.
     * @param controlType controlType as fqn like TcHmi.Controls.Beckhoff.TcHmiPasswordInput
     */
    export function prepareSystemForControlType<
        C extends TcHmi.Controls.System.TcHmiControl = TcHmi.Controls.System.TcHmiControl,
    >(controlType: string, controlConstructor: TcHmi.Controls.baseTcHmiControlConstructor<C>) {
        mockupControls.clear();

        nameToClassMap.set(controlType, controlConstructor);

        const controlTypeArray = controlType.split('.');
        const controlTypeScopedName = controlTypeArray.pop();
        const controlNamespace = controlTypeArray.join('.');
        /* **************** fill/cleanup internal data of framework ****************/
        TcHmi.Localization['__rebuildLocalizationCache']();
        if (!TcHmi.System.Data.Modules.controls) {
            TcHmi.System.Data.Modules.controls = {
                map: new Map(),
                array: [],
                urlMap: new Map(),
            };
        }
        TcHmi.System.Data.Modules.controls.map.set(controlType, {
            error: TcHmi.Errors.NONE,
            description: {
                name: controlTypeScopedName,
                namespace: controlNamespace,
            } as TcHmi.System.ControlDescription,
            package: {
                basePath: '/Beckhoff.TwinCAT.HMI.Controls',
                name: 'Beckhoff.TwinCAT.HMI.Controls',
            } as TcHmi.System.IPackage,
            manifestData: {
                basePath: controlTypeScopedName,
            } as TcHmi.System.IManifestControlModuleData,
        });
        /* **************** mockup main APIs of framework internals ****************/
        if (!jasmine.isSpy(TcHmi.Controls.get)) {
            spyOn(TcHmi.Controls, 'get').and.callFake((id: string): any => {
                return mockupControls.get(id);
            });
        }
        if (!TcHmi.System.Services.controlManager) {
            TcHmi.System.Services.controlManager = {
                compile: (elem, _parent, _options) => {
                    const subType = elem.getAttribute('data-tchmi-type')!;
                    const subConstructor = nameToClassMap.get(subType);
                    if (!subConstructor) {
                        throw new Error(
                            `Missing call of TcHmiTest.ControlHelper.prepareSystemForControlType for '${subType}'`,
                        );
                    }
                    const subControl = ControlHelper.createControl(subType, subConstructor, { controlId: elem.id });
                    return { error: TcHmi.Errors.NONE, control: subControl };
                },
                destruct: (_ctrl) => { },
                getDescriptionTypes: (type) => ['TcHmi.Controls.System.TcHmiControl', type],
                getDescriptionAttributeByPropertyName: (_type, _property) => null,
                getAttributeByPropertyName: (_control, _propertyName) => null,
                checkControlGeometryByControl: (_ctrl) => { },
            } as TcHmi.System.ControlManager;
        }

        // Controls need the full style manager because we want to be able to test css setter, too.
        if (!TcHmi.System.Services.styleManager) {
            TcHmi.System.Services.styleManager = new TcHmi.System.StyleManager();
        }
        if (!TcHmi.System.Services.triggerManager) {
            TcHmi.System.Services.triggerManager = {
                register: (_triggerArr: TcHmi.System.Trigger[]) => { },
            } as TcHmi.System.TriggerManager;
        }
        if (!TcHmi.System.Services.bindingManager) {
            TcHmi.System.Services.bindingManager = {
                getBinding: (_control, _propertyName): TcHmi.System.Binding | null => null,
                getBindingsByControl: (_control): Map<string, TcHmi.System.Binding> | undefined => undefined,
                createBinding: (_expr: string, _propertyName, _control) => ({}) as TcHmi.System.Binding,
                removeBinding: (_propertyName, _control, _bResetSetter) => { },
            } as TcHmi.System.BindingManager;
        }
        if (!TcHmi.System.Services.accessManager) {
            TcHmi.System.Services.accessManager = {
                checkAccess: (control, requestedAccessright: string): boolean | null => true,
                setControlRightOverride: (control, accessrightToOverride, forcedRight): void => { },
                getCurrentUserConfig: () => ({
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
                    defaultAuthExtension: '',
                    defaultUserGroup: '',
                    clientCertificate: null,
                    autoLogOffMilliSeconds: null,
                    session: null,
                    errorMessage: '',
                }),
            } as TcHmi.System.AccessManager;
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
        TcHmi.Localization['__rebuildLocalizationCache']();
        // @ts-ignore
        delete TcHmi.System.Services.controlManager;
        // @ts-ignore
        delete TcHmi.System.Services.styleManager;
        // @ts-ignore
        delete TcHmi.System.Services.triggerManager;
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
        const element = await ControlHelper.GenerateTemplateElement(controlType);
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
                TcHmiTest.ControlHelper.GenerateAttributeList(controlType, controlId),
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

        rawControl.__setLifeCycleState(TcHmi.System.LifeCycleState.AttributesInitialized);
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
            rawControl.__setLifeCycleState(TcHmi.System.LifeCycleState.Attached);
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
        // fetch template from jasmine "middleware" config
        const response = await fetch("/" + controlType + "/Template.html");
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
                valueType: TcHmi.System.ControlAttributeValueType.Simple,
                type: TcHmi.System.ControlAttributeType.Control,
                descr: null,
                value: controlType,
            },
            'id': {
                name: 'id',
                valueType: TcHmi.System.ControlAttributeValueType.Simple,
                type: TcHmi.System.ControlAttributeType.Control,
                descr: null,
                value: controlId,
            },
        } as TcHmi.Controls.ControlAttributeList;
        if (controlType === 'TcHmi.Controls.System.TcHmiUserControlHost') {
            ctrlAttr['data-tchmi-target-user-control'] = {
                value: 'mockup.usercontrol',
            } as TcHmi.System.ControlAttribute;
        }
        return ctrlAttr;
    }
}
