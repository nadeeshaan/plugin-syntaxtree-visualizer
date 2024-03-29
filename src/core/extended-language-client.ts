'use strict';
/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import { LanguageClient } from "vscode-languageclient";
import { Uri, Selection } from "vscode";

export interface BallerinaSyntaxTree {
    kind: String;
    topLevelNodes: any[];
}

export interface BallerinaSyntaxTreeResponse {
    syntaxTree?: BallerinaSyntaxTree;
}

export interface GetSyntaxTreeRequest {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetSyntaxTreeByRangeRequest {
    documentIdentifier: {
        uri: string
    };
    lineRange: Selection;
}

export class ExtendedLangClient extends LanguageClient {
    getSyntaxTree(uri: Uri): Thenable<BallerinaSyntaxTreeResponse> {
        const req: GetSyntaxTreeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            }
        };
        
        return this.sendRequest("ballerinaDocument/syntaxTree", req);
    }

    getSyntaxTreeByRange(uri: Uri, lineRange: Selection): Thenable<BallerinaSyntaxTreeResponse>{
        const req: GetSyntaxTreeByRangeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            },
            lineRange: lineRange
        };

        return this.sendRequest("ballerinaDocument/syntaxTreeByRange", req);
    }

    getSyntaxNodePath(uri: Uri, lineRange: Selection): Thenable<BallerinaSyntaxTreeResponse>{
        const req: GetSyntaxTreeByRangeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            },
            lineRange: lineRange
        };

        return this.sendRequest("ballerinaDocument/syntaxTreeLocate", req);
    }
}
