import os from 'os';
import path from 'path';

export const generatorRoot = path.resolve(__dirname, '../');

export const specsRepoPath = path.join(os.tmpdir(), 'schm_azspc');
export const specsRepoUri = 'https://github.com/azure/azure-rest-api-specs';
export const specsRepoCommitHash = 'origin/main';
export const pathRegex = /(microsoft\.\w+)[\\\/]\S*[\\\/](\d{4}-\d{2}-\d{2}(|-preview))[\\\/]/i;

export const autoRestVerboseOutput = false;

export const schemasBaseUri = 'https://schema.management.azure.com/schemas';
export const schemasBasePath = path.join(generatorRoot, 'schemas');
export const autogenResultPath = path.join(generatorRoot, 'onboarded-report');
export const resourceGroupRootSchema = {
    file: path.join(schemasBasePath, 'common/autogeneratedResources.json'),
    jsonPath: 'allOf[1].oneOf'
};
export const subscriptionRootSchema = {
    file: path.join(schemasBasePath, '2018-05-01/subscriptionDeploymentTemplate.json'),
    jsonPath: 'definitions.resource.allOf[1].oneOf'
};
export const tenantRootSchema = {
    file: path.join(schemasBasePath, '2019-08-01/tenantDeploymentTemplate.json'),
    jsonPath: 'definitions.resource.oneOf[0].allOf[1].oneOf'
};
export const managementGroupRootSchema = {
    file: path.join(schemasBasePath, '2019-08-01/managementGroupDeploymentTemplate.json'),
    jsonPath: 'definitions.resource.allOf[1].oneOf'
};
export const generatedSchemasTemplatePath = path.join(__dirname, 'resources/autogeneratedResources_template.json');

export const autorestCoreVersion = '3.0.6374';
export const azureresourceschemaVersion = '3.0.92';

// paths in this list won't even appear in list-basepaths. 
// This list should only contain spec paths that should DEFINITELY be excluded from generation.
// For now - that should just be Azure Stack providers, and deprecated providers.
export const excludedBasePathPrefixes = [
    /* Azure Stack resource providers */
    'azsadmin/',
    /* Microsoft.CustomerInsights is deprecated */
    'customer-insights/',
];
