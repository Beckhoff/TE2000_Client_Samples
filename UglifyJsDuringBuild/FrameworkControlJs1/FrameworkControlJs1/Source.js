// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

/*
 * Generated 7/23/2020 11:22:00 AM
 * Copyright SebastianGl 2020
 * 
 * destinationdirectory:        C:\Users\SebastianGl\Desktop\FrameworkControlJs1\FrameworkControlJs1
 * TcHmi_DefaultParameters:     [$guid1$, 4524982e-c533-4e60-bb63-23a6701dff75] | [$guid2$, f510dd82-c591-45d4-ba56-f3d136bf9ec8] | [$guid3$, 7f48e2e3-fece-47f8-bfc5-4ee17e1c517b] | [$guid4$, 5ebe7e10-e318-4a19-8fb9-18c86fc4eff2] | [$guid5$, 065372b5-e506-4b1e-9015-7b353c8270dd] | [$guid6$, 5b15ca68-8bbe-4209-8e3b-35f9b653c435] | [$guid7$, 4a123d64-62c2-42f7-a97f-59e7e01df1e7] | [$guid8$, b97898e9-21aa-491d-91f7-bd501d6cb939] | [$guid9$, 6d5eb79d-99d5-4102-908f-508bf98bff93] | [$guid10$, 57ccdfc9-349b-4de8-90e4-f33e157565b4] | [$time$, 7/23/2020 11:22:00 AM] | [$year$, 2020] | [$username$, SebastianGl] | [$userdomain$, DESKTOP-PIKEQ9C] | [$machinename$, DESKTOP-PIKEQ9C] | [$clrversion$, 4.0.30319.42000] | [$registeredorganization$, ] | [$runsilent$, False] | [$solutiondirectory$, C:\Users\SebastianGl\Desktop\FrameworkControlJs1] | [$projectname$, FrameworkControlJs1] | [$safeprojectname$, FrameworkControlJs1] | [$currentuiculturename$, en-US] | [$installpath$, C:\Program Files (x86)\Microsoft Visual Studio\2017\Professional\Common7\IDE\] | [$specifiedsolutionname$, FrameworkControlJs1] | [$exclusiveproject$, True] | [$destinationdirectory$, C:\Users\SebastianGl\Desktop\FrameworkControlJs1\FrameworkControlJs1] | [$targetframeworkversion$, 4.5]
 * projectname_tchmi:           FrameworkControlJs1
 * projectname_tchmi_dashcase:  framework-control-js1
 * safeprojectname:             FrameworkControlJs1
 * projectname:                 FrameworkControlJs1
 */

/**
*  Namespace: TcHmi
*  [REQUIRED]
*/
(function (TcHmi) {
    /**
    *  Namespace: TcHmi.Controls
    *  [REQUIRED]
    */
    (function (Controls) {
        /**
         *  Namespace: TcHmi.Controls.Custom
         *  [CUSTOM]
         */
        var Custom;
        (function (Custom) {
            /** FrameworkControlJs1 object */
            var FrameworkControlJs1 = (function (_super) {
                __extends(FrameworkControlJs1, _super);

                /*
                Attribute philosophy
                --------------------
                - Local variables are not set while definition in class, so they have the value 'undefined'.
                - On compile the Framework sets the value from HTML or from theme (possibly 'null') via normal setters
                - The "changed detection" in the setter will result in processing the value only once while compile
                - Attention: If we have a Server Binding on an Attribute the setter can be very late or never (leaving the value = undefined).
                */

                /**
                 * @description Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                function FrameworkControlJs1(element, pcElement, attrs) {
                    /** Call base constructor */
                    _super.call(this, element, pcElement, attrs);

                }
                /** 
                * @description Is called during control initialize phase before attribute setter are called based on initial html dom values. 
                * @returns {void}
                */
                FrameworkControlJs1.prototype.__previnit = function () {
                    /** Handle template elements. Should be done before call to __previnit of super class. */
                    this.__elementTemplateRoot = this.__element.find('.framework-control-js1-template');
                    
                    /** Call __previnit of super class with the correct instance. */
                    _super.prototype.__previnit.call(this);
                };
                /** 
                 * @description Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values. 
                 * @returns {void}
                 */
                FrameworkControlJs1.prototype.__init = function () {
                    /** Call __init of super class with the correct instance. */
                    _super.prototype.__init.call(this);

                };
                /**
                * @description Is called after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                * @returns {void}
                */
                FrameworkControlJs1.prototype.__attach = function () {
                    /** Call __attach of super class with the correct instance. */
                    _super.prototype.__attach.call(this);

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                };
                /**
                * @description Is called after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                * @returns {void}
                */
                FrameworkControlJs1.prototype.__detach = function () {
                    /** Call __detach of super class with the correct instance. */
                    _super.prototype.__detach.call(this);

                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */
                };
                /**
                * @description Destroy the current control instance. 
                * Will be called automatically if system destroys control!
                * @returns {void}
                */
                FrameworkControlJs1.prototype.destroy = function () {
                    /** Call destroy of super class with the correct instance. */
                    _super.prototype.destroy.call(this);

                    /**
                    * Free resources like child controls etc.
                    */
                };

                return FrameworkControlJs1;
            })(TcHmi.Controls.System.TcHmiControl);
            Custom.FrameworkControlJs1 = FrameworkControlJs1;
        })(Custom = Controls.Custom || (Controls.Custom = {}));
        /**
        * Register control...
        */
        Controls.register('framework-control-js1', Custom.FrameworkControlJs1, 'Custom/FrameworkControlJs1/', 'Custom/FrameworkControlJs1/Template.html');
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi);