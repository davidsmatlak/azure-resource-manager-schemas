// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { SchemaPostProcessor } from '../models';

export const postProcessor: SchemaPostProcessor = async (namespace, apiVersion, schema, onSave) => {
    const extensionsDefinitions = extensionsDefinition(apiVersion);

    // Set schema.resourceDefinitions.virtualMachines_extensions.properties.properties = $extensionsProperties
    if (schema.resourceDefinitions?.virtualMachines_extensions?.properties?.properties) {
        schema.resourceDefinitions.virtualMachines_extensions.properties.properties = extensionsProperties(apiVersion);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (extensionsDefinitions.resourceDefinitions as any).virtualMachines_extensions = schema.resourceDefinitions.virtualMachines_extensions;
        
        // remove schema.resourceDefinitions.virtualMachines_extensions
        delete schema.resourceDefinitions.virtualMachines_extensions;
    }

    // Set schema.resourceDefinitions.virtualMachineScaleSets_extensions.properties.properties = $extensionsProperties
    if (schema.resourceDefinitions?.virtualMachineScaleSets_extensions?.properties?.properties) {
        schema.resourceDefinitions.virtualMachineScaleSets_extensions.properties.properties = extensionsProperties(apiVersion);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (extensionsDefinitions.resourceDefinitions as any).virtualMachineScaleSets_extensions = schema.resourceDefinitions.virtualMachineScaleSets_extensions;

        // remove schema.resourceDefinitions.virtualMachineScaleSets_extensions
        delete schema.resourceDefinitions.virtualMachineScaleSets_extensions
    }

    // Set schema.definitions.virtualMachines_extensions_childResource.properties.properties = $extensionsProperties
    if (schema.definitions.virtualMachines_extensions_childResource?.properties?.properties) {
        schema.definitions.virtualMachines_extensions_childResource.properties.properties = extensionsProperties(apiVersion);
    }

    // Set schema.definitions.VirtualMachineScaleSetExtension.properties.properties = $extensionsProperties
    if (schema.definitions.VirtualMachineScaleSetExtension?.properties?.properties) {
        schema.definitions.VirtualMachineScaleSetExtension.properties.properties = extensionsProperties(apiVersion);
    }

    /// Remove CloudService Update Domain
    if (schema.resourceDefinitions?.cloudServices_updateDomains) {
        delete schema.resourceDefinitions.cloudServices_updateDomains;
    }
    if (schema.resourceDefinitions?.cloudServices?.properties?.resources) {
        delete schema.resourceDefinitions.cloudServices.properties.resources
    }
    if (schema.definitions?.cloudServices_updateDomains_childResource) {
        delete schema.definitions?.cloudServices_updateDomains_childResource
    }

    // save extensionsDefinitions as Microsoft.Compute.Extensions.json
    await onSave('Microsoft.Compute.Extensions.json', extensionsDefinitions);
}

const extensionsDefinition = (apiVersion: string) => (
    {
        "id": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#`,
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Microsoft.Compute.Extensions",
        "description": "Microsoft Compute Extensions Resource Types",
        "resourceDefinitions": {},
        "definitions": {
            "genericExtension": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "type": "string",
                        "minLength": 1,
                        "description": "Microsoft.Compute/extensions - Publisher"
                    },
                    "type": {
                        "type": "string",
                        "minLength": 1,
                        "description": "Microsoft.Compute/extensions - Type"
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1,
                        "description": "Microsoft.Compute/extensions - Type handler version"
                    },
                    "settings": {
                        "oneOf": [
                            { "type": "object" },
                            { "$ref": "https://schema.management.azure.com/schemas/common/definitions.json#/definitions/expression" }
                        ],
                        "description": "Microsoft.Compute/extensions - Settings"
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "settings"
                ]
            },
            "iaaSDiagnostics": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.Diagnostics"
                        ]
                    },
                    "type": {
                        "enum": [
                            "IaaSDiagnostics"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "xmlCfg": {
                                "type": "string"
                            },
                            "StorageAccount": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "xmlCfg",
                            "StorageAccount"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "storageAccountName": {
                                "type": "string"
                            },
                            "storageAccountKey": {
                                "type": "string"
                            },
                            "storageAccountEndPoint": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "storageAccountName",
                            "storageAccountKey",
                            "storageAccountEndPoint"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "iaaSAntimalware": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.Security"
                        ]
                    },
                    "type": {
                        "enum": [
                            "IaaSAntimalware"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "AntimalwareEnabled": {
                                "type": "boolean"
                            },
                            "Exclusions": {
                                "type": "object",
                                "properties": {
                                    "Paths": {
                                        "type": "string"
                                    },
                                    "Extensions": {
                                        "type": "string"
                                    },
                                    "Processes": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "Paths",
                                    "Extensions",
                                    "Processes"
                                ]
                            },
                            "RealtimeProtectionEnabled": {
                                "enum": [
                                    "true",
                                    "false"
                                ]
                            },
                            "ScheduledScanSettings": {
                                "type": "object",
                                "properties": {
                                    "isEnabled": {
                                        "enum": [
                                            "true",
                                            "false"
                                        ]
                                    },
                                    "scanType": {
                                        "type": "string"
                                    },
                                    "day": {
                                        "type": "string"
                                    },
                                    "time": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "isEnabled",
                                    "scanType",
                                    "day",
                                    "time"
                                ]
                            }
                        },
                        "required": [
                            "AntimalwareEnabled",
                            "Exclusions",
                            "RealtimeProtectionEnabled",
                            "ScheduledScanSettings"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "customScriptExtension": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Compute"
                        ]
                    },
                    "type": {
                        "enum": [
                            "CustomScriptExtension"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "fileUris": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "commandToExecute": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "commandToExecute"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "storageAccountName": {
                                "type": "string"
                            },
                            "storageAccountKey": {
                                "type": "string"
                            }
                        }
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "customScriptForLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.OSTCExtensions"
                        ]
                    },
                    "type": {
                        "enum": [
                            "CustomScriptForLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "fileUris": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "commandToExecute": {
                                "type": "string"
                            },
                            "storageAccountName": {
                                "type": "string"
                            },
                            "storageAccountKey": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "commandToExecute"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "linuxDiagnostic": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.OSTCExtensions"
                        ]
                    },
                    "type": {
                        "enum": [
                            "LinuxDiagnostic"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "enableSyslog": {
                                "type": "string"
                            },
                            "mdsdHttpProxy": {
                                "type": "string"
                            },
                            "perCfg": {
                                "type": "array"
                            },
                            "fileCfg": {
                                "type": "array"
                            },
                            "xmlCfg": {
                                "type": "string"
                            },
                            "ladCfg": {
                                "type": "object"
                            },
                            "syslogCfg": {
                                "type": "string"
                            },
                            "eventVolume": {
                                "type": "string"
                            },
                            "mdsdCfg": {
                                "type": "string"
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "mdsdHttpProxy": {
                                "type": "string"
                            },
                            "storageAccountName": {
                                "type": "string"
                            },
                            "storageAccountKey": {
                                "type": "string"
                            },
                            "storageAccountEndPoint": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "storageAccountName",
                            "storageAccountKey"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "vmAccessForLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.OSTCExtensions"
                        ]
                    },
                    "type": {
                        "enum": [
                            "VMAccessForLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "check_disk": {
                                "type": "boolean"
                            },
                            "repair_disk": {
                                "type": "boolean"
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "username": {
                                "type": "string"
                            },
                            "password": {
                                "type": "string"
                            },
                            "ssh_key": {
                                "type": "string"
                            },
                            "reset_ssh": {
                                "type": "string"
                            },
                            "remove_user": {
                                "type": "string"
                            },
                            "expiration": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "username",
                            "password",
                            "ssh_key",
                            "reset_ssh",
                            "remove_user",
                            "expiration"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "bgInfo": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Compute"
                        ]
                    },
                    "type": {
                        "enum": [
                            "bginfo"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion"
                ]
            },
            "vmAccessAgent": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Compute"
                        ]
                    },
                    "type": {
                        "enum": [
                            "VMAccessAgent"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "username": {
                                "type": "string"
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "password": {
                                "type": "string"
                            }
                        }
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "dscExtension": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Powershell"
                        ]
                    },
                    "type": {
                        "enum": [
                            "DSC"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "modulesUrl": {
                                "type": "string"
                            },
                            "configurationFunction": {
                                "type": "string"
                            },
                            "properties": {
                                "type": "string"
                            },
                            "wmfVersion": {
                                "type": "string"
                            },
                            "privacy": {
                                "type": "object",
                                "properties": {
                                    "dataCollection": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "required": [
                            "modulesUrl",
                            "configurationFunction"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "dataBlobUri": {
                                "type": "string"
                            }
                        }
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "acronisBackupLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Acronis.Backup"
                        ]
                    },
                    "type": {
                        "enum": [
                            "AcronisBackupLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "absURL": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "absURL"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "userLogin": {
                                "type": "string"
                            },
                            "userPassword": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "userLogin",
                            "userPassword"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "acronisBackup": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Acronis.Backup"
                        ]
                    },
                    "type": {
                        "enum": [
                            "AcronisBackup"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "absURL": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "absURL"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "userLogin": {
                                "type": "string"
                            },
                            "userPassword": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "userLogin",
                            "userPassword"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "linuxChefClient": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Chef.Bootstrap.WindowsAzure"
                        ]
                    },
                    "type": {
                        "enum": [
                            "LinuxChefClient"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "bootstrap_version": {
                                "type": "string"
                            },
                            "bootstrap_options": {
                                "type": "object",
                                "properties": {
                                    "chef_node_name": {
                                        "type": "string"
                                    },
                                    "chef_server_url": {
                                        "type": "string"
                                    },
                                    "validation_client_name": {
                                        "type": "string"
                                    },
                                    "node_ssl_verify_mode": {
                                        "type": "string"
                                    },
                                    "environment": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "chef_node_name",
                                    "chef_server_url",
                                    "validation_client_name",
                                    "node_ssl_verify_mode",
                                    "environment"
                                ]
                            },
                            "runlist": {
                                "type": "string"
                            },
                            "client_rb": {
                                "type": "string"
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "validation_key": {
                                "type": "string"
                            },
                            "chef_server_crt": {
                                "type": "string"
                            },
                            "secret": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "validation_key",
                            "chef_server_crt",
                            "secret"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "chefClient": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Chef.Bootstrap.WindowsAzure"
                        ]
                    },
                    "type": {
                        "enum": [
                            "ChefClient"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "bootstrap_options": {
                                "type": "object",
                                "properties": {
                                    "chef_node_name": {
                                        "type": "string"
                                    },
                                    "chef_server_url": {
                                        "type": "string"
                                    },
                                    "validation_client_name": {
                                        "type": "string"
                                    },
                                    "node_ssl_verify_mode": {
                                        "type": "string"
                                    },
                                    "environment": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "chef_node_name",
                                    "chef_server_url",
                                    "validation_client_name",
                                    "node_ssl_verify_mode",
                                    "environment"
                                ]
                            },
                            "runlist": {
                                "type": "string"
                            },
                            "client_rb": {
                                "type": "string"
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "validation_key": {
                                "type": "string"
                            },
                            "chef_server_crt": {
                                "type": "string"
                            },
                            "secret": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "validation_key",
                            "chef_server_crt",
                            "secret"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "datadogLinuxAgent": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Datadog.Agent"
                        ]
                    },
                    "type": {
                        "enum": [
                            "DatadogLinuxAgent"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "api_key": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "api_key"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "datadogWindowsAgent": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Datadog.Agent"
                        ]
                    },
                    "type": {
                        "enum": [
                            "DatadogWindowsAgent"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "api_key": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "api_key"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "dockerExtension": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.Extensions"
                        ]
                    },
                    "type": {
                        "enum": [
                            "DockerExtension"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "docker": {
                                "type": "object",
                                "properties": {
                                    "port": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "port"
                                ]
                            }
                        },
                        "required": [
                            "docker"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "certs": {
                                "type": "object",
                                "properties": {
                                    "ca": {
                                        "type": "string"
                                    },
                                    "cert": {
                                        "type": "string"
                                    },
                                    "key": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "ca",
                                    "cert",
                                    "key"
                                ]
                            }
                        },
                        "required": [
                            "certs"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "dynatraceLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "dynatrace.ruxit"
                        ]
                    },
                    "type": {
                        "enum": [
                            "ruxitAgentLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "tenantId": {
                                "type": "string"
                            },
                            "token": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "tenantId",
                            "token"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "dynatraceWindows": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "dynatrace.ruxit"
                        ]
                    },
                    "type": {
                        "enum": [
                            "ruxitAgentWindows"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "tenantId": {
                                "type": "string"
                            },
                            "token": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "tenantId",
                            "token"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "eset": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "ESET"
                        ]
                    },
                    "type": {
                        "enum": [
                            "FileSecurity"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "LicenseKey": {
                                "type": "string"
                            },
                            "Install-RealtimeProtection": {
                                "type": "boolean"
                            },
                            "Install-ProtocolFiltering": {
                                "type": "boolean"
                            },
                            "Install-DeviceControl": {
                                "type": "boolean"
                            },
                            "Enable-Cloud": {
                                "type": "boolean"
                            },
                            "Enable-PUA": {
                                "type": "boolean"
                            },
                            "ERAAgentCfgUrl": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "LicenseKey",
                            "Install-RealtimeProtection",
                            "Install-ProtocolFiltering",
                            "Install-DeviceControl",
                            "Enable-Cloud",
                            "Enable-PUA",
                            "ERAAgentCfgUrl"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "hpeSecurityApplicationDefender": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "HPE.Security.ApplicationDefender"
                        ]
                    },
                    "type": {
                        "enum": [
                            "DotnetAgent"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "key": {
                                "type": "string"
                            },
                            "serverURL": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "key",
                            "serverURL"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "protectedSettings"
                ]
            },
            "puppetAgent": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Puppet"
                        ]
                    },
                    "type": {
                        "enum": [
                            "PuppetAgent"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "PUPPET_MASTER_SERVER": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "PUPPET_MASTER_SERVER"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "protectedSettings"
                ]
            },
            "site24x7LinuxServerExtn": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Site24x7"
                        ]
                    },
                    "type": {
                        "enum": [
                            "Site24x7LinuxServerExtn"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "site24x7AgentType": {
                                "enum": [
                                    "azurevmextnlinuxserver"
                                ]
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "site24x7LicenseKey": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "site24x7LicenseKey"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "site24x7WindowsServerExtn": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Site24x7"
                        ]
                    },
                    "type": {
                        "enum": [
                            "Site24x7WindowsServerExtn"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "site24x7AgentType": {
                                "enum": [
                                    "azurevmextnwindowsserver"
                                ]
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "site24x7LicenseKey": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "site24x7LicenseKey"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "site24x7ApmInsightExtn": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Site24x7"
                        ]
                    },
                    "type": {
                        "enum": [
                            "Site24x7ApmInsightExtn"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "site24x7AgentType": {
                                "enum": [
                                    "azurevmextnapminsightclassic"
                                ]
                            }
                        }
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "site24x7LicenseKey": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "site24x7LicenseKey"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "trendMicroDSALinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "TrendMicro.DeepSecurity"
                        ]
                    },
                    "type": {
                        "enum": [
                            "TrendMicroDSALinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "DSMname": {
                                "type": "string"
                            },
                            "DSMport": {
                                "type": "string"
                            },
                            "policyNameorID": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "DSMname",
                            "DSMport"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "tenantID": {
                                "type": "string"
                            },
                            "tenantPassword": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "tenantID",
                            "tenantPassword"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "trendMicroDSA": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "TrendMicro.DeepSecurity"
                        ]
                    },
                    "type": {
                        "enum": [
                            "TrendMicroDSA"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "DSMname": {
                                "type": "string"
                            },
                            "DSMport": {
                                "type": "string"
                            },
                            "policyNameorID": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "DSMname",
                            "DSMport"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "tenantID": {
                                "type": "string"
                            },
                            "tenantPassword": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "tenantID",
                            "tenantPassword"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "bmcCtmAgentLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "ctm.bmc.com"
                        ]
                    },
                    "type": {
                        "enum": [
                            "BmcCtmAgentLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "Control-M Server Name": {
                                "type": "string"
                            },
                            "Agent Port": {
                                "type": "string"
                            },
                            "Host Group": {
                                "type": "string"
                            },
                            "User Account": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "Control-M Server Name",
                            "Agent Port",
                            "Host Group",
                            "User Account"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "bmcCtmAgentWindows": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "bmc.ctm"
                        ]
                    },
                    "type": {
                        "enum": [
                            "AgentWinExt"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "Control-M Server Name": {
                                "type": "string"
                            },
                            "Agent Port": {
                                "type": "string"
                            },
                            "Host Group": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "Control-M Server Name",
                            "Agent Port",
                            "Host Group"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "OSPatchingForLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.OSTCExtensions"
                        ]
                    },
                    "type": {
                        "enum": [
                            "OSPatchingForLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "disabled": {
                                "type": "boolean"
                            },
                            "stop": {
                                "type": "boolean"
                            },
                            "installDuration": {
                                "type": "string"
                            },
                            "intervalOfWeeks": {
                                "type": "number"
                            },
                            "dayOfWeek": {
                                "type": "string"
                            },
                            "startTime": {
                                "type": "string"
                            },
                            "rebootAfterPatch": {
                                "type": "string"
                            },
                            "category": {
                                "type": "string"
                            },
                            "oneoff": {
                                "type": "boolean"
                            },
                            "local": {
                                "type": "boolean"
                            },
                            "idleTestScript": {
                                "type": "string"
                            },
                            "healthyTestScript": {
                                "type": "string"
                            },
                            "distUpgradeList": {
                                "type": "string"
                            },
                            "distUpgradeAll": {
                                "type": "boolean"
                            },
                            "vmStatusTest": {
                                "type": "object"
                            }
                        },
                        "required": [
                            "disabled",
                            "stop"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "storageAccountName": {
                                "type": "string"
                            },
                            "storageAccountKey": {
                                "type": "string"
                            }
                        }
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "VMSnapshot": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.RecoveryServices"
                        ]
                    },
                    "type": {
                        "enum": [
                            "VMSnapshot"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "locale": {
                                "type": "string"
                            },
                            "taskId": {
                                "type": "string"
                            },
                            "commandToExecute": {
                                "type": "string"
                            },
                            "objectStr": {
                                "type": "string"
                            },
                            "logsBlobUri": {
                                "type": "string"
                            },
                            "statusBlobUri": {
                                "type": "string"
                            },
                            "commandStartTimeUTCTicks": {
                                "type": "string"
                            },
                            "vmType": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "locale",
                            "taskId",
                            "commandToExecute",
                            "objectStr",
                            "logsBlobUri",
                            "statusBlobUri",
                            "commandStartTimeUTCTicks",
                            "vmType"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "VMSnapshotLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.RecoveryServices"
                        ]
                    },
                    "type": {
                        "enum": [
                            "VMSnapshotLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "locale": {
                                "type": "string"
                            },
                            "taskId": {
                                "type": "string"
                            },
                            "commandToExecute": {
                                "type": "string"
                            },
                            "objectStr": {
                                "type": "string"
                            },
                            "logsBlobUri": {
                                "type": "string"
                            },
                            "statusBlobUri": {
                                "type": "string"
                            },
                            "commandStartTimeUTCTicks": {
                                "type": "string"
                            },
                            "vmType": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "locale",
                            "taskId",
                            "commandToExecute",
                            "objectStr",
                            "logsBlobUri",
                            "statusBlobUri",
                            "commandStartTimeUTCTicks",
                            "vmType"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings"
                ]
            },
            "customScript": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.Extensions"
                        ]
                    },
                    "type": {
                        "enum": [
                            "CustomScript"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    },
                    "settings": {
                        "type": "object",
                        "properties": {
                            "fileUris": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "fileUris"
                        ]
                    },
                    "protectedSettings": {
                        "type": "object",
                        "properties": {
                            "storageAccountName": {
                                "type": "string"
                            },
                            "storageAccountKey": {
                                "type": "string"
                            },
                            "commandToExecute": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "storageAccountName",
                            "storageAccountKey",
                            "commandToExecute"
                        ]
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion",
                    "settings",
                    "protectedSettings"
                ]
            },
            "networkWatcherAgentWindows": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.NetworkWatcher"
                        ]
                    },
                    "type": {
                        "enum": [
                            "NetworkWatcherAgentWindows"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion"
                ]
            },
            "networkWatcherAgentLinux": {
                "type": "object",
                "properties": {
                    "publisher": {
                        "enum": [
                            "Microsoft.Azure.NetworkWatcher"
                        ]
                    },
                    "type": {
                        "enum": [
                            "NetworkWatcherAgentLinux"
                        ]
                    },
                    "typeHandlerVersion": {
                        "type": "string",
                        "minLength": 1
                    },
                    "autoUpgradeMinorVersion": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "publisher",
                    "type",
                    "typeHandlerVersion",
                    "autoUpgradeMinorVersion"
                ]
            }
        }
    }
);

const extensionsProperties = (apiVersion: string) => (
    {
        "anyOf": [
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/genericExtension` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/iaaSDiagnostics` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/iaaSAntimalware` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/customScriptExtension` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/customScriptForLinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/linuxDiagnostic` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/vmAccessForLinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/bgInfo` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/vmAccessAgent` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/dscExtension` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/acronisBackupLinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/acronisBackup` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/linuxChefClient` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/chefClient` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/datadogLinuxAgent` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/datadogWindowsAgent` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/dockerExtension` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/dynatraceLinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/dynatraceWindows` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/eset` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/hpeSecurityApplicationDefender` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/puppetAgent` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/site24x7LinuxServerExtn` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/site24x7WindowsServerExtn` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/site24x7ApmInsightExtn` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/trendMicroDSALinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/trendMicroDSA` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/bmcCtmAgentLinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/bmcCtmAgentWindows` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/OSPatchingForLinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/VMSnapshot` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/VMSnapshotLinux` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/customScript` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/networkWatcherAgentWindows` },
            { "$ref": `https://schema.management.azure.com/schemas/${apiVersion}/Microsoft.Compute.Extensions.json#/definitions/networkWatcherAgentLinux` }
        ]
    });
