import * as _ from "lodash";
import * as vscode from "vscode";

import { BallerinaExtension, ExtendedLangClient } from "../core";
import { BAL_SOURCE_NOT_FOUND, SELECTION_NOT_FOUND } from "../core/messages";
import { getCommonWebViewOptions, WebViewRPCHandler } from "../utils";
import { render } from "./renderer";
import { EXTENSION_ID,
         EXTENSION_NAME,
         FULL_TREE_VIEW,
         FULL_TREE_VISUALIZER_COMMAND,
         LOCATE_NODE_COMMAND,
         LOCATE_TREE_VIEW,
         SUB_TREE_VIEW,
         SUBTREE_VISUALIZER_COMMAND } from "./resources/constant-resources";
import { getRemoteMethods } from "./resources/remote-methods";
import { CodeActionProvider, findNode, postWebviewMessage } from "./tools/activator-utils";

let activeTextEditor: vscode.TextEditor;
let syntaxTreePanel: vscode.WebviewPanel;
let hasOpenWebview: boolean = false;

export function activate(ballerinaExtInstance: BallerinaExtension) {
    const context = <vscode.ExtensionContext> ballerinaExtInstance.context;
    const langClient = <ExtendedLangClient> ballerinaExtInstance.langClient;

    ballerinaExtInstance.onReady().then(() => {
        const { experimental } = langClient.initializeResult!.capabilities;
        const serverProvidesExamples = experimental && experimental.examplesProvider;

        if (!serverProvidesExamples) {
            ballerinaExtInstance.showMessageServerMissingCapability();
            return;
        } else {
            context.subscriptions.push(
                vscode.languages.registerCodeActionsProvider(
                    { pattern: "**/*.{bal}", scheme: "file" },
                    new CodeActionProvider()
                )
            );

            context.subscriptions.push(vscode.commands.registerCommand(SUBTREE_VISUALIZER_COMMAND, () => {
                activateCommand(langClient, SUB_TREE_VIEW);
            }));

            context.subscriptions.push(vscode.commands.registerCommand(LOCATE_NODE_COMMAND, () => {
                activateCommand(langClient, LOCATE_TREE_VIEW);
            }));

            context.subscriptions.push(vscode.commands.registerCommand(FULL_TREE_VISUALIZER_COMMAND, () => {
                activateCommand(langClient, FULL_TREE_VIEW);
            }));
        }
    })
    .catch((e) => {
        if (!ballerinaExtInstance.isValidBallerinaHome()) {
            ballerinaExtInstance.showMessageInvalidBallerinaHome();
        } else {
            ballerinaExtInstance.showPluginActivationError();
        }
    });
}

function createSyntaxTreePanel(langClient: ExtendedLangClient) {
    syntaxTreePanel = vscode.window.createWebviewPanel(
        EXTENSION_ID,
        EXTENSION_NAME,
        {
            viewColumn: vscode.ViewColumn.Beside
        },
        getCommonWebViewOptions()
    );
    hasOpenWebview = true;
    syntaxTreePanel.onDidDispose(() => {
        hasOpenWebview = false;
    });

    WebViewRPCHandler.create(syntaxTreePanel, langClient, getRemoteMethods(langClient));
}

function activateCommand (langClient: ExtendedLangClient, command: string) {
    if (!vscode.window.activeTextEditor ||
        !vscode.window.activeTextEditor.document.fileName.endsWith(".bal")) {
        vscode.window.showWarningMessage(EXTENSION_NAME, ": ", BAL_SOURCE_NOT_FOUND);
        return;
    } else if (command !== FULL_TREE_VIEW &&
        vscode.window.activeTextEditor.selection.isEmpty) {
        vscode.window.showWarningMessage(EXTENSION_NAME, ": ", SELECTION_NOT_FOUND);
        return;
    } else if (!hasOpenWebview) {
        createSyntaxTreePanel(langClient);
    }

    visualizeSyntaxTree(vscode.window.activeTextEditor,
                        vscode.window.activeTextEditor.selection,
                        command);
}

function visualizeSyntaxTree(activeEditor: vscode.TextEditor,
                             blockRange: vscode.Selection,
                             activatedCommand: string) {
    const sourceRoot = activeEditor.document.uri.path;

    if (hasOpenWebview) {
        vscode.workspace.onDidChangeTextDocument(_.debounce(() => {
            if (vscode.window.activeTextEditor &&
                activeTextEditor.document.uri === vscode.window.activeTextEditor.document.uri) {
                postWebviewMessage(syntaxTreePanel);
            }
        }, 500));

        syntaxTreePanel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "findNode": {
                    findNode(activeEditor, message.position);
                    return;
                }
            }
        });
    }

    const displayHtml = render(sourceRoot, blockRange, activatedCommand);
    syntaxTreePanel.webview.html = displayHtml;
    syntaxTreePanel.reveal();
    activeTextEditor = activeEditor;
}
