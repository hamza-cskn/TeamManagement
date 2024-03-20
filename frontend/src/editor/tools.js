import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Link from "@editorjs/link";
import Delimiter from "@editorjs/delimiter";
import CheckList from "@editorjs/checklist";
import Table from '@editorjs/table'
import InlineCode from '@editorjs/inline-code';
import CodeTool from '@editorjs/code';
import createGenericInlineTool, {
    ItalicInlineTool,
    UnderlineInlineTool,
} from 'editorjs-inline-tool'


export const EDITOR_JS_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: true,
    },
    checkList: CheckList,
    list: List,
    header: Header,
    delimiter: Delimiter,
    link: Link,
    table: Table,
    inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+M',
    },
    bold: {
        class: createGenericInlineTool({
            sanitize: {
                strong: {},
            },
            shortcut: 'CMD+B',
            tagName: 'STRONG',
            toolboxIcon:
                '<svg class="icon icon--bold" width="12px" height="14px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bold"></use></svg>',
        }),
    },
    // or use a pre-defined tool instead
    italic: ItalicInlineTool,
    underline: UnderlineInlineTool,
    code: CodeTool,
};
