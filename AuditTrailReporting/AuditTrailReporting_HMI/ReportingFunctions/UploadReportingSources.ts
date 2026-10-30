// This function is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Environment, Errors, Functions, Server, type Context, type SelectableRequired } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/** Value of the function symbol TcHmiReporting.AddResource. */
interface ReportingResource {
    /** File name without extension, as listed in the runtime configuration. */
    name: string;
    /** Content of the file. */
    data: string;
    /** 0: CSS, 1: JavaScript */
    type: 0 | 1;
    /** Runtime of the reporting server */
    runtime: string;
}

/** The files the report Beckhoff uses. */
const SOURCES = [
    'ReportingSources/ReportingScripts/Images.js',
    'ReportingSources/ReportingScripts/Toolbox.js',
    'ReportingSources/ReportingStyles/TcHmi.css',
];

/**
 * Uploads the scripts and the stylesheet of ReportingSources to a runtime of the reporting server.
 * Does the same as "Upload CSS/JavaScript file" on the Config page of TcHmiReporting.
 * @param ctx Context object which provides context specific data and functions.
 * @param runtime Runtime of the reporting server, for example "local".
 * @returns A short text for the user.
 */
export async function UploadReportingSources(ctx: SelectableRequired<Context<string>, 'success' | 'error'>, runtime: string | null) {
    const domain = 'TcHmi.Functions.AuditTrailReportingSample.UploadReportingSources';
    if (!runtime) {
        ctx.error(Errors.E_PARAMETER_INVALID, {
            code: Errors.E_PARAMETER_INVALID,
            message: Errors[Errors.E_PARAMETER_INVALID],
            reason: 'No runtime of the reporting server.',
            domain,
        });
        return;
    }

    // The HMI server delivers the files of the project.
    const resources: ReportingResource[] = [];
    try {
        for (const path of SOURCES) {
            const response = await fetch(Environment.getHostBaseUri() + '/' + path, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(path + ' could not be loaded (HTTP ' + response.status + ').');
            }
            const fileName = path.substring(path.lastIndexOf('/') + 1);
            resources.push({
                name: fileName.replace(/\.(js|css)$/, ''),
                data: await response.text(),
                type: fileName.endsWith('.css') ? 0 : 1,
                runtime,
            });
        }
    } catch (ex) {
        ctx.error(Errors.E_EXCEPTION, {
            code: Errors.E_EXCEPTION,
            message: Errors[Errors.E_EXCEPTION],
            reason: ex instanceof Error ? ex.message : String(ex),
            domain,
        });
        return;
    }

    // One request with one write command per file.
    Server.writeSymbolEx<ReportingResource>(
        resources.map(() => 'TcHmiReporting.AddResource'),
        resources,
        null,
        (data) => {
            const failed = data.results?.find((result) => result.error !== Errors.NONE);
            const error = data.error !== Errors.NONE ? data.error : (failed?.error ?? Errors.NONE);
            if (error !== Errors.NONE) {
                ctx.error(error, {
                    code: error,
                    message: Errors[error],
                    reason: 'The files could not be uploaded to the runtime ' + runtime + '.',
                    domain,
                    errors: data.details ? [data.details] : failed?.details ? [failed.details] : undefined,
                });
                return;
            }
            ctx.success(resources.length + ' files uploaded to the runtime ' + runtime + '.');
        }
    );
}

Functions.registerFunctionEx('UploadReportingSources', 'TcHmi.Functions.AuditTrailReportingSample', UploadReportingSources);
