import React, {memo, useEffect, useRef} from "react";
import EditorJS from "@editorjs/editorjs";
import {EDITOR_JS_TOOLS} from "./tools";

const Editor = ({ data, onChange, editorblock, className }) => {
    const ref = useRef();
    //Initialize editorjs
    useEffect(() => {
        //Initialize editorjs if we don't have a reference
        if (!ref.current) {
            ref.current = new EditorJS({
                holder: editorblock,
                config: {
                    minHeight: 30,
                    height: 30,
                },
                tools: EDITOR_JS_TOOLS,
                data: data,
                async onChange(api, event) {
                    const data = await api.saver.save();
                    onChange(data);
                },
            });
        }

        return () => {
            if (ref.current && ref.current.destroy) {
                ref.current.destroy();
            }
        };
    }, []);
    return <div id={editorblock} className={className}></div>;
};

export default memo(Editor);
