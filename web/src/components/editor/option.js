import * as actions from "monaco-editor/esm/vs/platform/actions/common/actions";
export function clearDefaultContextMenu() {
    let menus = actions.MenuRegistry._menuItems;
    let contextMenuEntry = [...menus].find(entry => entry[0].id == "EditorContext");
    let contextMenuLinks = contextMenuEntry[1];
    let removableIds = [
        "editor.action.clipboardCutAction",
        "editor.action.clipboardCopyAction",
        "editor.action.clipboardPasteAction",
        "editor.action.refactor",
        "editor.action.sourceAction",
        "editor.action.revealDefinition",
        "editor.action.revealDeclaration",
        "editor.action.goToTypeDefinition",
        "editor.action.goToImplementation",
        "editor.action.goToReferences",
        "editor.action.formatDocument",
        "editor.action.formatSelection",
        "editor.action.changeAll",
        "editor.action.rename",
        "editor.action.quickOutline",
        "editor.action.quickCommand",
        "Peek"
    ];

    let removeById = (list, ids) => {
    let node = list._first;
    do {
        let shouldRemove = ids.includes(node.element?.command?.id || node.element?.title);
        if (shouldRemove) { list._remove(node)  }
    } while ((node = node.next));
    };
    removeById(contextMenuLinks, removableIds);
}

export function addActions(editor) {
    editor.addAction({
        id: '标记已读',
        label: '标记已读',
        contextMenuGroupId: 'navigation',
        run: function(ed) {
            console.log('My custom action was clicked!');
        }
    });
    editor.addAction({
        id: 'ersc_message',
        label: '注解',
        contextMenuGroupId: 'navigation',
        run: function(ed) {
            console.log('My custom action was clicked!');
        }
    });
}